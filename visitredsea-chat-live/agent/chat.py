"""Chat sessions and the turn protocol between the browser, the booking state and the agent.

    POST /api/chat/session        {}                                   -> {sid, state, ttlSec}
    POST /api/chat/turn           {sid, turnId, kind:"text", text, client}        (a typed message: goes to the agent)
                                  {sid, turnId, kind:"event", event, client}      (a card/form action: deterministic)
                                  -> {turnId, items, state, consume, action, suspended, error, after}
    POST /api/chat/action-result  {sid, actionId, ok, visible | reason} -> the continuation, same shape

Every turn is idempotent on turnId (a repeat returns the cached reply), one
turn runs at a time per session (409 otherwise), and a browser action
suspends the agent's turn until the page acknowledges it. The agent never
receives OTP codes, session tokens, e-mail addresses or phone numbers.
"""
import collections
import json
import secrets
import threading
import time

from . import state as T
from . import tools as TOOLS
from .provider import ProviderError, tool_result, user_message

SESSION_TTL = 7200
MAX_SESSIONS = 200
MAX_STEPS = 6                 # tool rounds per guest message
ACTION_TIMEOUT = 20.0         # seconds the browser has to acknowledge a page action
RESULT_CACHE = 20

S = T.S


class ChatError(Exception):
    def __init__(self, status, error, **extra):
        super().__init__(error)
        self.status, self.error, self.extra = status, error, extra


class Session(object):
    def __init__(self):
        self.sid = secrets.token_hex(16)
        self.created = self.last_seen = time.time()
        self.lock = threading.Lock()
        self.state = T.fresh()
        self.remote_id = None
        self.pending = None               # {id, toolUseId, partial, deadline, kind, target}
        self.closed_actions = set()
        self.queued = []                  # provider events to prepend to the next agent run (closed actions)
        self.results = collections.OrderedDict()
        self.recent_events = []           # short notes for the agent's context block
        self.client = {}                  # client-held flags sent with each turn (termsAccepted)

    def remember(self, key, resp):
        self.results[key] = resp
        while len(self.results) > RESULT_CACHE:
            self.results.popitem(last=False)


_sessions = {}
_lock = threading.Lock()
PROVIDER = None                           # set by server.py (agent.provider.make_provider())


def new_session():
    now = time.time()
    with _lock:
        for sid in [k for k, s in _sessions.items() if s.last_seen + SESSION_TTL < now]:
            _sessions.pop(sid, None)
        while len(_sessions) >= MAX_SESSIONS:
            oldest = min(_sessions.values(), key=lambda s: s.last_seen)
            _sessions.pop(oldest.sid, None)
        s = Session()
        _sessions[s.sid] = s
    return s


def get_session(sid):
    with _lock:
        s = _sessions.get(str(sid or ""))
        if not s or s.last_seen + SESSION_TTL < time.time():
            _sessions.pop(str(sid or ""), None)
            return None
        s.last_seen = time.time()
        return s


def status():
    return dict(PROVIDER.status(), sessions=len(_sessions))


# ---------------------------------------------------------------- helpers
def _context(sess):
    st = sess.state
    g = st.get("guest") or {}
    public = {k: st.get(k) for k in ("stage", "name", "resortName", "villaName", "rateName", "adults", "children", "checkIn", "checkOut",
                                     "nights", "mode", "arrivalAirport", "departureAirport", "authMode", "paymentStatus")}
    public["guest"] = {"firstName": g.get("firstName", ""), "familyName": g.get("familyName", ""), "secondGuestFirstName": g.get("guest2First", ""),
                       "specialRequest": g.get("requests", "")} if g else None
    public["profileRetrieved"] = bool(st.get("profile"))
    public["verifiedEmailOnFile"] = bool(st.get("verifiedEmail"))
    ctx = {"stage": st["stage"], "state": public, "allowed_now": TOOLS.allowed_tools(st), "recent_events": sess.recent_events[-6:]}
    return "<context>\n" + json.dumps(ctx, ensure_ascii=False) + "\n</context>\n"


def _response(sess, turn_id, items, consume, action=None, error=None, after=None, extra=None):
    r = {"turnId": turn_id, "items": items, "state": T.snapshot(sess.state), "consume": bool(consume), "action": action,
         "suspended": bool(action), "error": error, "after": after}
    if extra:
        r.update(extra)
    return r


def _plain(t, st=None):
    """Comparison form of a reply line: placeholders, their values and bidi markup removed, whitespace folded."""
    import re
    t = re.sub(r"\{\{\{?(\w+)\}\}\}?|\{\{|\}\}", "", str(t or ""))
    t = re.sub(r"\{\w+\}", "", t)
    for v in ((st or {}).get("name"), (st or {}).get("resortName"), (st or {}).get("villaName")):
        if v:
            t = t.replace(str(v), "")
    return re.sub(r"[\s.،,:!؟]+", " ", t).strip()


def _extend(items, new):
    """Append reply items, never the same text+component twice in one turn."""
    have = set((i.get("text") or "", i.get("component") or "") for i in items if i.get("text") or i.get("component"))
    for it in new:
        key = (it.get("text") or "", it.get("component") or "")
        if key != ("", "") and key in have:
            continue
        have.add(key)
        items.append(it)


def _stub(t):
    """A placeholder the model sometimes emits when told to say nothing ("(no text)", "—"): no Arabic, very short."""
    import re
    return len(t.strip()) <= 24 and not re.search(r"[؀-ۿ]", t)


def _error_item(reason):
    text = S["live"]["notConfigured"] if reason == "not_configured" else S["live"]["unavailable"]
    return {"text": text, "error": "provider_unavailable", "reason": reason}


def _close_pending(sess, reason):
    """The browser never answered the page action (or typed first): the agent gets an error tool result."""
    p = sess.pending
    if not p:
        return
    sess.pending = None
    sess.closed_actions.add(p["id"])
    sess.queued.extend(p["partial"] + [tool_result(p["toolUseId"], {"error": reason}, is_error=True)])
    sess.recent_events.append("page action %s closed: %s" % (p["kind"], reason))


def _expire_pending(sess):
    if sess.pending and time.time() > sess.pending["deadline"]:
        _close_pending(sess, "no_ack")


def _acquire(sess):
    if not sess.lock.acquire(blocking=False):
        raise ChatError(409, "turn_in_flight", retryAfterMs=1500)


# ---------------------------------------------------------------- the agent loop
def _agent_loop(sess, turn_id, events, items, consume, allow_action):
    """Run the agent until it ends its turn, needs the browser, or fails. Mutates items/state."""
    after = None
    quiet = False            # the previous round's tools all advanced the journey: the approved reply is complete
    for _ in range(MAX_STEPS):
        try:
            rr = PROVIDER.run(sess.remote_id, events)
        except ProviderError as e:
            items.append(_error_item(e.reason))
            return _response(sess, turn_id, items, consume, error="provider_unavailable", after=after, extra={"reason": e.reason})
        except Exception as e:                                       # a bug in the provider must not drop the connection
            import sys
            sys.stderr.write("provider failure: %s: %s\n" % (type(e).__name__, str(e)[:200]))
            items.append(_error_item("provider"))
            return _response(sess, turn_id, items, consume, error="provider_unavailable", after=after, extra={"reason": "provider"})
        # The agent's own words are kept for questions and for the page action; after a step the application's
        # scripted reply already asks the next question, so an echo or a second question would be noise.
        seen = set(_plain(i.get("text"), sess.state) for i in items if i.get("text"))
        for t in rr.texts:
            if not t or not t.strip() or quiet or _plain(t, sess.state) in seen or _stub(t):
                continue
            if rr.status == "requires_action" and len(t.strip()) < 12:      # a one-word echo ("خلاص.") before the tool call
                continue
            items.append({"text": t})
            seen.add(_plain(t, sess.state))
        if rr.status != "requires_action":
            if rr.status in ("budget_reached", "retries_exhausted"):
                items.append(_error_item(rr.status))
                return _response(sess, turn_id, items, consume, error="provider_unavailable", after=after, extra={"reason": rr.status})
            return _response(sess, turn_id, items, consume, after=after)
        results = []
        for tu in rr.tool_uses:
            if quiet:                                        # the step is done; a second tool in the same turn would repeat a card
                res = T.Result(False, None, {"error": "turn_complete", "note": "the application already replied for this message; end your turn without text"})
            else:
                res = TOOLS.call_tool(sess.state, tu.name, tu.input, sess.client)
            if res.action and not allow_action:
                res = T.Result(False, None, {"error": "one_action_per_turn"})
            if res.action:
                aid = "act_" + secrets.token_hex(6)
                action = dict(res.action, id=aid, timeoutMs=int(ACTION_TIMEOUT * 1000))
                sess.pending = {"id": aid, "toolUseId": tu.id, "partial": results, "deadline": time.time() + ACTION_TIMEOUT,
                                "kind": action["kind"], "target": action.get("target")}
                _extend(items, TOOLS.filter_quick(res.items, sess.state))
                return _response(sess, turn_id, items, consume or res.ok, action=action)
            _extend(items, TOOLS.filter_quick(res.items, sess.state))
            consume = consume or res.ok
            results.append(tool_result(tu.id, res.result, is_error="error" in res.result))
            sess.recent_events.append("tool %s -> %s" % (tu.name, "ok" if res.ok else res.result.get("error", "not advanced")))
            after = getattr(res, "after", None) or after
        # every result in this round carried the application's own reply (no error): the agent's extra words would repeat it
        quiet = quiet or (bool(results) and all("error" not in json.loads(r["content"][0]["text"]) for r in results))
        events = results
    items.append(_error_item("too_many_steps"))
    return _response(sess, turn_id, items, consume, error="provider_unavailable", after=after, extra={"reason": "too_many_steps"})


# ---------------------------------------------------------------- public entry points
def text_turn(sess, turn_id, text, client):
    text = str(text or "").strip()
    if not text:
        raise ChatError(400, "empty_text")
    if turn_id in sess.results:
        return sess.results[turn_id]
    _acquire(sess)
    try:
        sess.client = client or {}
        _expire_pending(sess)
        if sess.pending:
            _close_pending(sess, "interrupted")
        if not PROVIDER.configured():
            resp = _response(sess, turn_id, [_error_item("not_configured")], False, error="provider_unavailable", extra={"reason": "not_configured"})
            sess.remember(turn_id, resp)
            return resp
        if not sess.remote_id:
            try:
                sess.remote_id = PROVIDER.open_session("RSG concierge " + sess.sid[:8])
            except ProviderError as e:
                resp = _response(sess, turn_id, [_error_item(e.reason)], False, error="provider_unavailable", extra={"reason": e.reason})
                sess.remember(turn_id, resp)
                return resp
        events = sess.queued + [user_message(_context(sess) + text)]
        sess.queued = []
        resp = _agent_loop(sess, turn_id, events, [], False, allow_action=True)
        sess.recent_events = sess.recent_events[-12:]
        sess.remember(turn_id, resp)
        return resp
    finally:
        sess.lock.release()


def event_turn(sess, turn_id, event, client, server):
    if turn_id in sess.results:
        return sess.results[turn_id]
    _acquire(sess)
    try:
        sess.client = client or {}
        _expire_pending(sess)
        res = TOOLS.handle_event(sess.state, event, server)
        items = TOOLS.filter_quick(res.items, sess.state)
        after = getattr(res, "after", None)
        sess.recent_events.append("guest action: " + TOOLS.describe_event(event, res, sess.state))
        sess.recent_events = sess.recent_events[-12:]
        resp = _response(sess, turn_id, items, res.ok, after=after)
        sess.remember(turn_id, resp)
        return resp
    finally:
        sess.lock.release()


def action_result(sess, action_id, ok, payload):
    key = "ack:" + str(action_id)
    if key in sess.results:
        return dict(sess.results[key], ignored=True)
    _acquire(sess)
    try:
        p = sess.pending
        if not p or p["id"] != action_id:
            raise ChatError(410, "action_expired")
        sess.pending = None
        sess.closed_actions.add(action_id)
        if ok:
            result = {"ok": True, "visible": [str(x)[:80] for x in (payload.get("visible") or [])][:12]}
        else:
            result = {"error": str(payload.get("reason") or "failed")[:40]}
        sess.recent_events.append("page action %s -> %s" % (p["kind"], "shown" if ok else result["error"]))
        events = p["partial"] + [tool_result(p["toolUseId"], result, is_error=not ok)]
        resp = _agent_loop(sess, "ack:" + action_id, events, [], False, allow_action=False)
        resp["turnId"] = None
        resp["actionId"] = action_id
        sess.remember(key, resp)
        return resp
    finally:
        sess.lock.release()
