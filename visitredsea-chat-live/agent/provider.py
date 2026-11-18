"""Connection to the live agent.

ManagedAgentsProvider talks to a Claude Managed Agent (beta) through the
Anthropic Python SDK: one remote session per chat session, user messages and
custom-tool results are sent as events, and the reply is read from the
session's event stream until it goes idle. The tools the agent calls are
executed here (agent/tools.py), never in the cloud sandbox.

TestDoubleProvider is a local stand-in used ONLY when the environment sets
LIVE_AGENT_TEST_DOUBLE=1 (the server prints a banner). It exists so the
protocol, the browser action and the deterministic handlers can be driven
without a key. It is never chosen automatically: without credentials the
live provider reports "not_configured" and the chat shows that.
"""
import json
import os
import re
import sys
import time

from . import budget as BUDGET

STREAM_TIMEOUT = float(os.environ.get("ANTHROPIC_STREAM_TIMEOUT", "120") or 120)   # seconds for one agent run


class ProviderError(Exception):
    def __init__(self, reason, detail=""):
        super().__init__(reason)
        self.reason = reason
        self.detail = detail


class ToolUse(object):
    def __init__(self, id, name, input):
        self.id, self.name, self.input = id, name, input or {}


class RunResult(object):
    """status: end_turn | requires_action | refusal | budget_reached | retries_exhausted"""

    def __init__(self, status, texts, tool_uses):
        self.status, self.texts, self.tool_uses = status, texts, tool_uses


def user_message(text):
    return {"type": "user.message", "content": [{"type": "text", "text": text}]}


def tool_result(tool_use_id, result, is_error=False):
    return {"type": "user.custom_tool_result", "custom_tool_use_id": tool_use_id, "is_error": bool(is_error),
            "content": [{"type": "text", "text": json.dumps(result, ensure_ascii=False)}]}


def _get(o, k, default=None):
    if isinstance(o, dict):
        return o.get(k, default)
    return getattr(o, k, default)


# ---------------------------------------------------------------- Managed Agents
class ManagedAgentsProvider(object):
    name = "managed_agents"

    def __init__(self):
        self.api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
        self.agent_id = os.environ.get("ANTHROPIC_AGENT_ID", "").strip()
        self.environment_id = os.environ.get("ANTHROPIC_ENVIRONMENT_ID", "").strip()
        self.model = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5-5").strip()
        self._client = None

    def configured(self):
        return bool(self.api_key and self.agent_id and self.environment_id)

    def status(self):
        return {"provider": self.name, "configured": self.configured(), "apiKey": bool(self.api_key), "agentId": bool(self.agent_id),
                "environmentId": bool(self.environment_id), "model": self.model}

    def client(self):
        if self._client is None:
            import anthropic
            self._client = anthropic.Anthropic(api_key=self.api_key, timeout=60.0, max_retries=1)
        return self._client

    def open_session(self, title):
        cap = BUDGET.session_budget(self.client(), self.agent_id)        # what is left of the shared cap, platform-enforced per session
        if cap is None:
            raise ProviderError("budget", "shared agent budget reached before opening a session")
        try:
            s = self.client().beta.sessions.create(agent=self.agent_id, environment_id=self.environment_id, title=title[:80], budget=cap)
        except Exception as e:
            raise self._map(e)
        BUDGET.record(s.id, {"list_cost": {"amount": "0"}}, title)
        return s.id

    def run(self, remote_id, events):
        """Send events, then read the stream until the session is idle. Returns RunResult."""
        texts, tool_uses = [], []
        deadline = time.time() + STREAM_TIMEOUT
        if BUDGET.remaining_cents(self.client(), self.agent_id) <= 0:  # shared cap across every session of this agent
            raise ProviderError("budget", "shared agent budget reached")
        try:
            with self.client().beta.sessions.events.stream(remote_id, timeout=STREAM_TIMEOUT) as stream:
                self.client().beta.sessions.events.send(remote_id, events=events)
                for ev in stream:
                    et = _get(ev, "type", "")
                    if et == "agent.message":
                        for blk in _get(ev, "content", []) or []:
                            if _get(blk, "type") == "text":
                                texts.append(str(_get(blk, "text", "")))
                    elif et == "agent.custom_tool_use":
                        tool_uses.append(ToolUse(_get(ev, "id"), _get(ev, "name"), _get(ev, "input") or {}))
                    elif et == "session.status_idle":
                        sr = _get(ev, "stop_reason")
                        st = _get(sr, "type", "end_turn") if sr is not None else "end_turn"
                        self._record_spend(remote_id)
                        if st == "budget_reached":
                            raise ProviderError("budget", "session budget reached")
                        return RunResult(st, texts, tool_uses if st == "requires_action" else [])
                    elif et == "session.error":
                        err = _get(ev, "error")
                        detail = err.model_dump() if hasattr(err, "model_dump") else err
                        raise ProviderError("provider", json.dumps(detail, ensure_ascii=False, default=str)[:400])
                    if time.time() > deadline:
                        raise ProviderError("timeout", "no idle event within %ds" % STREAM_TIMEOUT)
        except ProviderError:
            raise
        except Exception as e:
            raise self._map(e)
        raise ProviderError("provider", "stream ended without an idle event")

    def _record_spend(self, remote_id):
        """Store the platform's cumulative list cost for this session (exact, no price table on our side)."""
        try:
            s = self.client().beta.sessions.retrieve(remote_id)
            BUDGET.record(remote_id, getattr(s, "usage", None), getattr(s, "title", "") or "")
        except Exception as e:                               # never let bookkeeping break the guest's turn
            import sys
            sys.stderr.write("spend record failed for %s: %s\n" % (remote_id, type(e).__name__))

    def budget_status(self):
        try:
            return BUDGET.status(self.client() if self.configured() else None, self.agent_id)
        except Exception as e:
            return {"error": type(e).__name__}

    @staticmethod
    def _map(e):
        try:
            import anthropic
        except ImportError:
            return ProviderError("not_installed", "pip install -r requirements.txt")
        name = type(e).__name__
        if isinstance(e, (anthropic.AuthenticationError, anthropic.PermissionDeniedError)):
            return ProviderError("auth", name)
        if isinstance(e, anthropic.RateLimitError):
            return ProviderError("rate_limit", name)
        if isinstance(e, anthropic.NotFoundError):
            return ProviderError("not_found", name)
        if isinstance(e, anthropic.APITimeoutError):
            return ProviderError("timeout", name)
        if isinstance(e, anthropic.APIConnectionError):
            return ProviderError("network", name)
        if isinstance(e, anthropic.APIStatusError):
            return ProviderError("provider" if e.status_code >= 500 else "request", "%s %s" % (name, e.status_code))
        return ProviderError("provider", name)


# ---------------------------------------------------------------- local test double (explicit opt-in only)
def _norm(t):
    import unicodedata
    t = unicodedata.normalize("NFKC", str(t or "")).lower()
    t = re.sub("[ً-ْٰـ]", "", t)
    t = re.sub("[أإآ]", "ا", t).replace("ة", "ه").replace("ى", "ي")
    t = re.sub("[٠-٩]", lambda m: str(ord(m.group(0)) - 0x660), t)
    t = re.sub(r"[^\w\s@.+-]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def _has(t, words):
    toks = t.split(" ")
    return any((w in toks) if len(w) <= 3 else (w in t) for w in words)


APPROVE = ["تمام", "موافق", "مناسب", "اوكي", "ok", "نعم", "ايه", "كمل", "نكمل", "ماشي", "زين", "اكيد", "ابشر", "اعتمد", "ممتاز", "yes", "تم", "صحيح"]


class TestDoubleProvider(object):
    """Keyword stand-in for the model: picks one tool for the current stage, or answers a question with a fixed line."""
    name = "test_double"
    model = "test-double"

    def __init__(self):
        self.fail = os.environ.get("LIVE_AGENT_FAIL", "").strip()     # e.g. network: every run raises, to test the error path
        self._n = 0

    def configured(self):
        return True

    def status(self):
        return {"provider": self.name, "configured": True, "model": self.model, "testDouble": True}

    def open_session(self, title):
        self._n += 1
        return "double-%d" % self._n

    def run(self, remote_id, events):
        if self.fail:
            raise ProviderError(self.fail, "LIVE_AGENT_FAIL")
        last = events[-1] if events else {}
        if last.get("type") != "user.message":
            # tool results: a real agent adds at most a short line; the double stays quiet unless the page action failed
            for ev in events:
                if ev.get("type") == "user.custom_tool_result" and ev.get("is_error"):
                    try:
                        err = json.loads(ev["content"][0]["text"]).get("error", "")
                    except (ValueError, KeyError, IndexError, TypeError):
                        err = ""
                    if err in ("cards_missing", "spotlight_unavailable", "interrupted", "no_ack"):
                        return RunResult("requires_action", [], [ToolUse("tu-%d" % self._next(), "show_resort_suggestions", {})])
            return RunResult("end_turn", [], [])
        raw = "".join(b.get("text", "") for b in last.get("content", []) if b.get("type") == "text")
        m = re.search(r"<context>(.*?)</context>\s*(.*)$", raw, re.S)
        ctx = json.loads(m.group(1)) if m else {}
        text = (m.group(2) if m else raw).strip()
        stage = ctx.get("stage", "name")
        t = _norm(text)
        tool = self._pick(stage, t, text)
        if tool is None:
            return RunResult("end_turn", ["سؤال في محله. اللي أقدر أؤكده لك موجود في البطاقات، ونكمل خطوتنا الحالية متى ما تحب."], [])
        name, args = tool
        return RunResult("requires_action", [], [ToolUse("tu-%d" % self._next(), name, args)])

    def _next(self):
        self._n += 1
        return self._n

    def _pick(self, stage, t, raw):
        if _has(t, ["وين وصلنا", "ارجع", "اعد", "مره ثانيه", "البطاقه"]):
            return ("show_current_step", {})
        if "؟" in raw or _has(t, ["كم", "وش الفرق", "هل", "ليش", "متى يفتح"]) and stage not in ("name",):
            if not (_has(t, ["شباره", "shebara"]) and _has(t, ["ديزرت", "desert"])):
                return None
        if stage == "name":
            name = re.sub(r"^((أنا|انا|اسمي|إسمي|معك|معاك|هلا|مرحبا)\s*)+", "", raw.strip()).split()[0] if raw.strip() else ""
            return ("set_guest_name", {"name": name})
        if stage in ("intent", "resort"):
            if _has(t, ["شباره", "شيباره", "shebara"]) and _has(t, ["ديزرت", "desert"]):
                return ("show_resort_comparison", {})
            if _has(t, ["تصفح", "اتصفح", "علي الصفحه", "في الصفحه", "الموقع", "كل المنتجعات", "باقي المنتجعات", "وين نقدر نروح", "browse", "page"]):   # normalised forms: ى -> ي, ة -> ه
                return ("navigate_to_resorts", {"target": "all"})
            if stage == "resort":
                for k, v in {"شباره": "Shebara", "shebara": "Shebara", "ديزرت": "Desert Rock", "desert": "Desert Rock", "سيكس": "Six Senses Southern Dunes, The Red Sea", "six senses": "Six Senses Southern Dunes, The Red Sea", "نجوما": "Nujuma, a Ritz-Carlton Reserve"}.items():
                    if k in t:
                        return ("select_resort", {"resort": v})
            if _has(t, ["منتجع", "منتجعات", "اجازه", "رحله", "resort", "اقامه", "فندق", "اشوف", "استكشف", "اقترح"]):
                return ("show_resort_suggestions", {})
            return None
        if stage == "villa":
            if _has(t, ["فوق الماء", "فوق الما", "overwater"]):
                return ("select_villa", {"villa": "Two Bedroom Overwater Villa" if _has(t, ["غرفتين", "two"]) else "One Bedroom Overwater Villa"})
            if _has(t, ["شاطئ", "شاطي", "beach"]):
                return ("select_villa", {"villa": "One Bedroom Beach Villa"})
            return None
        if stage == "party":
            if _has(t, ["زوجتي", "اثنين", "شخصين", "2", "انا وزوجتي", "بس انا"]):
                return ("set_party", {"adults": 2, "children": 0})
            if _has(t, ["ثلاثه", "3", "اربعه", "4"]):
                return ("set_party", {"adults": 3, "children": 0})
            return None
        if stage == "dates":
            m = re.search(r"(\d{1,2})\D+(\d{1,2})", t)
            if m:
                return ("set_dates", {"check_in": "2026-10-%02d" % int(m.group(1)), "check_out": "2026-10-%02d" % int(m.group(2))})
            return None
        if stage in ("approve1", "approve2"):
            if re.match(r"^(لا|كلا|مو|مب)\b", t):
                return None
            if _has(t, APPROVE):
                return ("approve_stay" if stage == "approve1" else "approve_transfers", {})
            return None
        if stage == "mode":
            if _has(t, ["خاصه", "جت", "jet"]):
                return ("set_transfer_mode", {"mode": "By Private Jet"})
            if _has(t, ["طائره", "طياره", "طيران", "plane", "نطير"]):
                return ("set_transfer_mode", {"mode": "By Plane"})
            if _has(t, ["سياره", "car", "نسوق"]):
                return ("set_transfer_mode", {"mode": "By Car"})
            if _has(t, ["يخت", "yacht"]):
                return ("set_transfer_mode", {"mode": "By Yacht"})
            return None
        if stage == "airports":
            ar = "Yanbu Airport" if _has(t, ["ينبع", "yanbu"]) else ("Al Wajh Domestic Airport" if _has(t, ["الوجه", "wajh"]) else "")
            dp = "Red Sea International Airport - RSIA" if _has(t, ["البحر الاحمر", "الدولي", "rsia"]) else ""
            return ("set_airports", {"arrival": ar, "departure": dp}) if ar and dp else None
        if stage == "activities":
            if _has(t, ["بعدين", "لاحقا", "عند الوصول", "بعد ما نوصل", "لا", "مو الحين", "later", "no"]):
                return ("defer_experiences", {})
            if _has(t, ["اضف", "ضيف", "ابغى", "ابي", "نعم", "yes"]):
                return ("experience_interest", {})
            return None
        if stage in ("account", "login"):
            if _has(t, ["حساب", "مسجل", "سجلت", "دخول"]) and stage == "account":
                return ("choose_account_mode", {"mode": "account"})
            if _has(t, ["ضيف", "جديد"]):
                return ("choose_account_mode", {"mode": "guest"})
            return None
        if stage == "requests":
            if re.match(r"^(لا|no)\b", t) or _has(t, ["ما عندنا", "ما عندي", "ماعندنا", "بدون", "ولا شي", "لا شكرا"]):
                return ("record_special_request", {"request": "", "none": True})
            if t in ("نعم", "ايه", "اكيد", "عندي طلب"):
                return None
            return ("record_special_request", {"request": raw.strip(), "none": False})
        if stage == "review":
            if _has(t, APPROVE) and not re.match(r"^(لا|كلا)\b", t):
                return ("confirm_review", {})
            return None
        return None


def make_provider():
    if os.environ.get("LIVE_AGENT_TEST_DOUBLE", "").strip() == "1":
        sys.stderr.write("\n" + "!" * 78 + "\n!! LIVE_AGENT_TEST_DOUBLE=1: the chat is driven by a local keyword stand-in, NOT by Claude.\n!! For tests only. Unset it for the live agent.\n" + "!" * 78 + "\n\n")
        return TestDoubleProvider()
    return ManagedAgentsProvider()
