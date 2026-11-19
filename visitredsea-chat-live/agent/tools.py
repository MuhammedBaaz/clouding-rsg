"""Tool catalogue and dispatch for the live concierge.

agent/tools.json is the single source of the tool definitions (sent to the
Managed Agent at creation by tools/console_setup.py). This module maps each
tool name to the transition in agent/state.py, enforces the stages a tool is
allowed in, and turns browser events (card buttons, forms) into the same
transitions without a model call.
"""
import json
import os

from . import state as T
from . import data as D

HERE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(HERE, "tools.json"), encoding="utf-8") as _fh:
    TOOLS = json.load(_fh)
TOOL_NAMES = [t["name"] for t in TOOLS]

# Stages in which each tool may be called. Mirrors the checks in state.py; used for the context block
# so the agent sees what applies now, and for a clear tool error otherwise.
TOOL_STAGES = {
    "set_guest_name": ["name"],
    "show_resort_suggestions": ["intent", "resort"],
    "navigate_to_resorts": ["intent", "resort"],
    "show_resort_comparison": ["intent", "resort"],
    "select_resort": ["resort"],
    "select_villa": ["villa"],
    "set_party": ["party"],
    "set_dates": ["dates"],
    "approve_stay": ["approve1"],
    "set_transfer_mode": ["mode"],
    "set_airports": ["airports"],
    "approve_transfers": ["approve2"],
    "defer_experiences": ["activities"],
    "experience_interest": ["activities"],
    "choose_account_mode": ["account", "login"],
    "record_special_request": ["requests"],
    "set_guest_details": ["guest", "requests", "review", "payment"],
    "redeem_points": ["review"],
    "cancel_checkout": ["payment"],
    "confirm_review": ["review"],
    "show_current_step": T.STAGES,
}

# Quick replies the application may offer for a stage (labels live in data/script.js items); mirrors QUICK in js/chat.js.
QUICK_STAGES = {"approve1_ok": ["approve1"], "approve2_ok": ["approve2"], "activities_defer": ["activities"], "review_confirm": ["review"],
                "resort_shebara": ["resort"], "villa_supported": ["villa"], "dates_supported": ["dates"], "mode_plane": ["mode"], "airports_supported": ["airports"]}


def allowed_tools(st):
    return [n for n in TOOL_NAMES if st["stage"] in TOOL_STAGES.get(n, [])]


def filter_quick(items, st):
    """Drop quick replies that are not valid for the stage the state ended in (defensive; the script already matches)."""
    out = []
    for it in items:
        if isinstance(it, dict) and it.get("quick"):
            q = [c for c in it["quick"] if st["stage"] in QUICK_STAGES.get(c.get("id", ""), [])]
            it = dict(it)
            if q:
                it["quick"] = q
            else:
                it.pop("quick", None)
                if not it.get("text") and not it.get("component"):
                    continue
        out.append(it)
    return out


def call_tool(st, name, args, client):
    """Run a tool the agent asked for. Returns state.Result. Unknown tools and bad input become tool errors."""
    args = args if isinstance(args, dict) else {}
    if name not in TOOL_NAMES:
        return T.Result(False, None, {"error": "unknown_tool", "tools": TOOL_NAMES})
    if st["stage"] not in TOOL_STAGES.get(name, []):      # the agent corrects itself from the result; the guest sees nothing
        return T.Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"], "allowed_now": allowed_tools(st)})
    try:
        if name == "set_guest_name":
            return T.set_name(st, args.get("name"))
        if name == "show_resort_suggestions":
            return T.show_suggestions(st)
        if name == "navigate_to_resorts":
            return T.navigate(st, args.get("target"))
        if name == "show_resort_comparison":
            return T.show_comparison(st)
        if name == "select_resort":
            return T.choose_resort(st, args.get("resort"))
        if name == "select_villa":
            return T.choose_villa(st, args.get("villa"))
        if name == "set_party":
            return T.set_party(st, args.get("adults"), args.get("children"))
        if name == "set_dates":
            return T.set_dates(st, args.get("check_in"), args.get("check_out"))
        if name == "approve_stay":
            return T.approve_stay(st)
        if name == "set_transfer_mode":
            return T.set_mode(st, args.get("mode"))
        if name == "set_airports":
            return T.set_airports(st, args.get("arrival"), args.get("departure"))
        if name == "approve_transfers":
            return T.approve_transfers(st)
        if name == "defer_experiences":
            return T.defer_experiences(st)
        if name == "experience_interest":
            return T.experience_interest(st)
        if name == "choose_account_mode":
            return T.account_mode(st, args.get("mode"))
        if name == "record_special_request":
            return T.record_request(st, args.get("request"), bool(args.get("none")))
        if name == "set_guest_details":
            return T.set_guest_details(st, args)
        if name == "redeem_points":
            return T.redeem_points(st, args.get("points"))
        if name == "cancel_checkout":
            return T.cancel_checkout(st)
        if name == "confirm_review":
            return T.confirm(st, bool((client or {}).get("termsAccepted")))
        if name == "show_current_step":
            return T.current_step(st)
    except Exception as e:                                   # a handler bug must not take the turn down
        return T.Result(False, None, {"error": "tool_failed", "detail": type(e).__name__})
    return T.Result(False, None, {"error": "unknown_tool"})


def handle_event(st, ev, server):
    """A browser event (card button, form, OTP result). Deterministic, no model call. `server` gives access to
    the OTP session store so verification results are checked, never trusted from the page."""
    ev = ev if isinstance(ev, dict) else {}
    t = ev.get("type")
    if t == "resort":
        return T.choose_resort(st, ev.get("name"))
    if t == "villa":
        return T.choose_villa(st, ev.get("villa"))
    if t == "dates":
        return T.set_dates(st, ev.get("a"), ev.get("b"))
    if t == "approve":
        return T.approve_stay(st) if st["stage"] == "approve1" else T.approve_transfers(st)
    if t == "mode":
        return T.set_mode(st, ev.get("mode"))
    if t == "airports":
        return T.set_airports(st, ev.get("arrival"), ev.get("departure"), ev.get("flight"))
    if t == "airportsBad":
        return T.Result(False, T.S["airports"]["fallback"], {"ok": False})
    if t == "defer":
        return T.defer_experiences(st)
    if t == "interest":                       # the website's activity card (18 Nov 2026): same rule as the agent's tool
        return T.experience_interest(st)
    if t == "account":
        return T.account_mode(st, ev.get("mode"))
    if t == "signedIn":
        email = server.session_email(str(ev.get("session", ""))[:64])
        if not email:
            return T.Result(False, T.S["account"]["loginFallback"], {"error": "not_authenticated"})
        store, prof = server.load_profile(email)
        return T.signed_in(st, email, prof, "found" if prof else ("none" if store else "error"))
    if t == "verify":
        email = server.session_email(str(ev.get("session", ""))[:64])
        if not email:
            return T.Result(False, T.S["verify"]["fallback"], {"error": "not_authenticated"})
        return T.verified(st, email)
    if t == "guest":
        return T.set_guest(st, ev.get("data"))
    if t == "guestEdit":
        return T.edit_guest(st, ev.get("data"))
    if t == "confirm":
        return T.confirm(st, bool(ev.get("termsAccepted")))
    if t == "voice":
        return T.voice_message(st)
    if t == "voiceOther":
        return T.Result(False, T.S["voice"]["other"], {"ok": False})
    if t == "paymentReturned":
        return T.payment_returned(st)
    return T.Result(False, T.fallback(st), {"error": "unknown_event"})


def describe_event(ev, res, st):
    """One line for the agent's context about what the guest did on the components (no PII)."""
    t = (ev or {}).get("type", "?")
    detail = ""
    if t == "resort":
        detail = " " + str(ev.get("name", ""))
    elif t == "villa":
        detail = " " + str(ev.get("villa", ""))
    elif t == "dates":
        detail = " %s to %s" % (ev.get("a"), ev.get("b"))
    elif t == "mode":
        detail = " " + str(ev.get("mode", ""))
    elif t == "airports":
        detail = " %s -> %s" % (ev.get("arrival"), ev.get("departure"))
    elif t == "account":
        detail = " " + str(ev.get("mode", ""))
    elif t == "guest":
        detail = " (form submitted)"
    elif t == "confirm":
        detail = " terms=%s" % bool(ev.get("termsAccepted"))
    return "%s%s -> %s, stage %s" % (t, detail, "accepted" if res.ok else "not advanced", st["stage"])
