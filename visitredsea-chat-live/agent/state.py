"""Booking state and the valid transitions of the concierge journey.

This is the server-side port of the stage machine that js/chat.js used to
run locally (stageSpec). Claude decides *what* the guest means and calls a
tool; the functions here decide whether that step is valid for the current
stage, update the state and return the approved reply items from
data/script.js (strings, {text, component}, {quick}). The browser fills the
{name}-style placeholders and renders the components exactly as before.

Only the quoted route is priced (Shebara, One Bedroom Overwater Villa,
Villa Flat Rate, 2 adults, 23 to 25 Oct 2026): any other choice gets the
"need to confirm the price" reply and keeps the stage, as the page did.
"""
import copy
import datetime
import re

from . import data as D

B = D.BOOKING
S = D.SCRIPT

STAGES = ["name", "intent", "resort", "villa", "party", "dates", "approve1", "mode", "airports", "approve2",
          "activities", "account", "login", "requests", "voice", "guest", "review", "verify", "payment", "done"]

PUBLIC_FIELDS = ("stage", "name", "resortName", "villaName", "rateName", "adults", "children", "checkIn", "checkOut",
                 "nights", "mode", "arrivalAirport", "departureAirport", "flight", "voice", "formSeed", "guest",
                 "verifiedEmail", "authMode", "loginEmail", "profile", "paid", "paymentStatus")


def fresh():
    return {"stage": "name", "name": "", "resortName": "", "villaName": "", "rateName": "", "adults": 2, "children": 0,
            "checkIn": "", "checkOut": "", "nights": 0, "mode": "", "arrivalAirport": "", "departureAirport": "", "flight": {},
            "voice": None, "formSeed": None, "guest": None, "verifiedEmail": "", "authMode": "", "loginEmail": "",
            "profile": None, "paid": False, "paymentStatus": "none"}


def snapshot(st):
    return {k: copy.deepcopy(st.get(k)) for k in PUBLIC_FIELDS}


class Result(object):
    """ok: the step advanced (the browser consumes the live components); items: reply items for the browser;
    result: what the agent is told; action: a browser action to run before the agent continues."""

    def __init__(self, ok, items, result=None, action=None):
        self.ok = ok
        self.items = _items(items)
        self.result = result if result is not None else ({"ok": True} if ok else {"ok": False})
        self.action = action


def _items(x):
    if x is None:
        return []
    x = copy.deepcopy(x)
    x = x if isinstance(x, list) else [x]
    return [{"text": it} if isinstance(it, str) else it for it in x]


def days_between(a, b):
    try:
        da = datetime.date.fromisoformat(a)
        db = datetime.date.fromisoformat(b)
    except ValueError:
        return None
    return (db - da).days


def ar_list(parts):
    parts = list(parts)
    if len(parts) < 2:
        return "".join(parts)
    return "، ".join(parts[:-1]) + " و" + parts[-1]


REQUIRED = ["title", "firstName", "familyName", "email", "mobile"]


def missing_names(seed):
    return [S["words"]["fieldNames"][k] for k in REQUIRED if not (seed or {}).get(k)]


def profile_seed(st):
    seed = {}
    for k in ("title", "firstName", "familyName", "mobileCode", "mobile", "guest2First", "guest2Family"):   # never requests
        if (st.get("profile") or {}).get(k):
            seed[k] = st["profile"][k]
    if not seed.get("firstName") and st.get("name"):
        seed["firstName"] = st["name"]
    seed["email"] = st.get("verifiedEmail", "")
    return seed


def needs_otp(st):
    g = st.get("guest") or {}
    return st.get("authMode") == "account" and str(g.get("email", "")).lower() != st.get("verifiedEmail", "")


def fallback(st):
    """The stage's own 'not now' reply, as the page used for input that does not fit the stage."""
    stage = st["stage"]
    table = {"name": S["name"]["fallback"], "intent": S["intent"]["fallback"], "resort": S["resort"]["fallback"],
             "villa": S["villa"]["fallback"], "party": S["party"]["fallback"], "dates": S["dates"]["fallback"],
             "approve1": S["approve1"]["fallback"], "mode": S["mode"]["fallback"], "airports": S["airports"]["fallback"],
             "approve2": S["approve2"]["fallback"], "activities": S["activities"]["fallback"], "account": S["account"]["fallback"],
             "login": S["account"]["loginFallback"], "requests": S["account"]["requestsClarify"], "voice": S["voice"]["fallback"],
             "guest": S["guest"]["fallback"], "review": S["review"]["fallback"], "verify": S["verify"]["fallback"],
             "payment": S["payment"]["fallback"], "done": S["done"]["ok"]}
    return table.get(stage, S["done"]["ok"])


def current_step(st):
    """Re-sends the prompt of the current stage (the guest asked where we are, or for the card again)."""
    stage = st["stage"]
    table = {"name": S["greeting"], "intent": S["name"]["ok"], "resort": S["intent"]["ok"], "villa": S["resort"]["ok"][1:],
             "party": S["villa"]["ok"], "dates": S["party"]["ok"], "approve1": S["dates"]["ok"], "mode": S["approve1"]["ok"],
             "airports": S["mode"]["ok"], "approve2": S["airports"]["ok"][1:], "activities": S["approve2"]["ok"],
             "account": S["activities"]["ok"][1:], "login": S["account"]["login"], "requests": S["account"]["askRequests"],
             "voice": S["account"]["guest"], "guest": S["account"]["guest"], "review": S["review"]["fallback"],
             "verify": S["review"]["verifyNew"], "payment": S["review"]["ok"], "done": S["done"]["ok"]}
    return Result(False, table.get(stage, S["done"]["ok"]), {"ok": True, "stage": stage, "shown": "current step"})


# ---------------------------------------------------------------- transitions (one per journey step)
def set_name(st, name):
    raw = re.sub(r"^((أنا|انا|اسمي|إسمي|معك|معاك|هلا|مرحبا|اهلا|أهلا|السلام عليكم)\s*)+", "", str(name or "").strip()).rstrip(".!؟?")
    first = raw.split()[0] if raw.split() else ""
    if st["stage"] != "name":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    if not first or len(first) > 20:
        return Result(False, S["name"]["fallback"], {"error": "invalid_name"})
    st["name"] = first
    st["stage"] = "intent"
    return Result(True, S["name"]["ok"], {"ok": True, "name": first, "stage": "intent"})


def show_suggestions(st):
    if st["stage"] not in ("intent", "resort"):
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["stage"] = "resort"
    return Result(True, S["intent"]["ok"], {"ok": True, "shown": "resort suggestions carousel", "resorts": D.SUGGESTED, "stage": "resort"})


def show_comparison(st):
    if st["stage"] not in ("intent", "resort"):
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["stage"] = "resort"
    return Result(True, S["compare"]["ok"], {"ok": True, "shown": "comparison carousel, recommendation (Shebara), selection carousel", "stage": "resort"})


def navigate(st, target):
    if st["stage"] not in ("intent", "resort"):
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    target = str(target or "all").strip().lower()
    if target != "all" and target not in D.RESORT_BY_ID:
        return Result(False, None, {"error": "unknown_target", "allowed": ["all"] + [D.resort_id(n) for n in D.PAGE_RESORTS]})
    if target != "all" and D.RESORT_BY_ID[target]["name"] not in D.PAGE_RESORTS:
        return Result(False, None, {"error": "not_on_page", "allowed": ["all"] + [D.resort_id(n) for n in D.PAGE_RESORTS]})
    st["stage"] = "resort"
    return Result(True, S["navigate"]["lead"], {"pending": "browser action"}, action={"kind": "navigate_resorts", "target": target})


def choose_resort(st, name):
    if st["stage"] != "resort":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    r = D.RESORT_BY_NAME.get(name) or D.RESORT_BY_ID.get(D.resort_id(str(name or "")))
    if not r:
        return Result(False, S["resort"]["fallback"], {"error": "unknown_resort", "known": [x["name"] for x in D.ALL_RESORTS]})
    st["resortName"] = r["name"]
    if r["name"] == B["resort"]["name"]:
        st["stage"] = "villa"
        return Result(True, S["resort"]["ok"], {"ok": True, "resort": r["name"], "shown": "resort details, villas carousel", "stage": "villa"})
    return Result(False, S["resort"]["other"], {"ok": False, "resort": r["name"], "note": "details shown; only Shebara can be booked in this demo, the reply offers to continue with Shebara"})


def choose_villa(st, name):
    if st["stage"] != "villa":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    v = next((x for x in D.VILLAS if x["name"].lower() == str(name or "").strip().lower() or x.get("nameAr") == name), None)
    if not v:
        return Result(False, S["villa"]["fallback"], {"error": "unknown_villa", "known": [x["name"] for x in D.VILLAS]})
    st["villaName"] = v["name"]
    if v["name"] == B["villa"]["name"]:
        st["rateName"] = B["rate"]["name"]
        st["stage"] = "party"
        return Result(True, S["villa"]["ok"], {"ok": True, "villa": v["name"], "rate": B["rate"]["name"], "total": B["rate"]["total"], "stage": "party"})
    return Result(False, S["villa"]["other"], {"ok": False, "villa": v["name"], "note": "no confirmed price for this villa; the reply offers the priced villa"})


def set_party(st, adults, children):
    if st["stage"] != "party":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    try:
        adults = int(adults); children = int(children or 0)
    except (TypeError, ValueError):
        return Result(False, S["party"]["fallback"], {"error": "invalid_party"})
    if adults == B["stay"]["adults"] and children == B["stay"]["children"]:
        st["adults"], st["children"], st["stage"] = adults, children, "dates"
        return Result(True, S["party"]["ok"], {"ok": True, "adults": adults, "children": children, "shown": "calendar", "stage": "dates"})
    return Result(False, S["party"]["fallback"], {"ok": False, "note": "the quoted rate is for 2 adults and no children; a different party needs a new quote the demo cannot give"})


def set_dates(st, a, b):
    if st["stage"] != "dates":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    n = days_between(str(a or ""), str(b or ""))
    if n is None:
        return Result(False, S["dates"]["fallback"], {"error": "invalid_dates"})
    if n < 1:
        return Result(False, S["dates"]["invalid"], {"error": "checkout_not_after_checkin"})
    st["checkIn"], st["checkOut"], st["nights"] = a, b, n
    if a == B["stay"]["checkIn"] and b == B["stay"]["checkOut"]:
        st["stage"] = "approve1"
        return Result(True, S["dates"]["ok"], {"ok": True, "checkIn": a, "checkOut": b, "nights": n, "shown": "stay summary", "stage": "approve1"})
    return Result(False, S["dates"]["other"], {"ok": False, "checkIn": a, "checkOut": b, "note": "no confirmed price for these dates; the reply offers 23 to 25 Oct 2026"})


def approve_stay(st):
    if st["stage"] != "approve1":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["stage"] = "mode"
    return Result(True, S["approve1"]["ok"], {"ok": True, "shown": "arrival modes picker", "stage": "mode"})


def set_mode(st, mode):
    if st["stage"] != "mode":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    modes = B["transport"]["modes"]
    m = next((x for x in modes if x.lower() == str(mode or "").strip().lower()), None)
    if not m:
        return Result(False, S["mode"]["fallback"], {"error": "unknown_mode", "known": modes})
    st["mode"] = m
    if m == B["transport"]["supportedMode"]:
        st["stage"] = "airports"
        return Result(True, S["mode"]["ok"], {"ok": True, "mode": m, "shown": "airports picker", "stage": "airports"})
    return Result(False, S["mode"]["other"], {"ok": False, "mode": m, "note": "transfers are prepared for By Plane only; the reply offers it"})


def set_airports(st, arrival, departure, flight=None):
    if st["stage"] != "airports":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    airports = B["transport"]["airports"]
    names_ar = B["transport"].get("airportsAr", {})

    def match(x):
        x = str(x or "").strip().lower()
        for a in airports:
            if x and (x == a.lower() or x == names_ar.get(a, "").lower() or x in a.lower()):
                return a
        return None
    ar, dp = match(arrival), match(departure)
    if not ar or not dp:
        return Result(False, S["airports"]["fallback"], {"error": "unknown_airport", "known": airports})
    st["arrivalAirport"], st["departureAirport"], st["flight"] = ar, dp, flight or {}
    if ar == B["transport"]["arrivalAirport"] and dp == B["transport"]["departureAirport"]:
        st["stage"] = "approve2"
        return Result(True, S["airports"]["ok"], {"ok": True, "arrival": ar, "departure": dp, "shown": "transfer legs, updated summary", "grandTotal": B["grandTotal"], "stage": "approve2"})
    return Result(False, S["airports"]["other"], {"ok": False, "arrival": ar, "departure": dp, "note": "transfers are priced only for Yanbu arrival and RSIA departure; the reply offers them"})


def approve_transfers(st):
    if st["stage"] != "approve2":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["stage"] = "activities"
    return Result(True, S["approve2"]["ok"], {"ok": True, "shown": "experiences carousel + quick reply", "stage": "activities"})


def defer_experiences(st):
    if st["stage"] != "activities":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["stage"] = "account"
    return Result(True, S["activities"]["ok"], {"ok": True, "shown": "account choice picker", "stage": "account"})


def experience_interest(st):
    if st["stage"] != "activities":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    return Result(False, S["activities"]["add"], {"ok": False, "note": "experiences are arranged with the resort team after the booking; the reply offers to continue"})


def account_mode(st, mode):
    mode = str(mode or "").strip().lower()
    if st["stage"] == "login" and mode == "guest":
        st["authMode"], st["stage"] = "guest", "guest"
        return Result(True, S["account"]["guest"], {"ok": True, "mode": "guest", "shown": "guest form", "stage": "guest"})
    if st["stage"] != "account" or mode not in ("account", "guest"):
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["authMode"] = mode
    if mode == "account":
        st["stage"] = "login"
        return Result(True, S["account"]["login"], {"ok": True, "mode": "account", "shown": "sign-in card (e-mail + code)", "stage": "login"})
    st["stage"] = "guest"
    return Result(True, S["account"]["guest"], {"ok": True, "mode": "guest", "shown": "guest form", "stage": "guest"})


def signed_in(st, email, profile, status):
    """After server.py verified the code and read the store. profile may be None."""
    if st["stage"] != "login":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["verifiedEmail"] = str(email or "").lower()
    st["profile"] = profile or None
    st["formSeed"] = profile_seed(st)
    if st["profile"]:
        st["stage"] = "requests"
        return Result(True, S["account"]["askRequests"], {"ok": True, "profile": "found", "stage": "requests"})
    st["stage"] = "guest"
    text = S["account"]["profileError"] if status == "error" else S["account"]["notFound"]
    return Result(True, [{"text": text, "component": "guestForm"}], {"ok": True, "profile": status, "stage": "guest"})


def record_request(st, request, none):
    if st["stage"] != "requests":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    req = "" if none else str(request or "").strip()
    if not none and not req:
        return Result(False, S["account"]["requestsClarify"], {"error": "unclear_request"})
    st["formSeed"] = profile_seed(st)
    if req:
        st["formSeed"]["requests"] = req
    need = missing_names(st["formSeed"])
    ready = S["account"]["readyWithRequest"] if req else S["account"]["readyNoRequest"]
    if need:
        ready += " " + S["account"]["stillMissing"].replace("{missing}", ar_list(need))
    st["stage"] = "guest"
    return Result(True, [{"text": ready, "component": "guestForm"}], {"ok": True, "request": req or None, "shown": "prefilled guest form", "stage": "guest"})


GUEST_KEYS = ("title", "firstName", "familyName", "email", "mobileCode", "mobile", "guest2First", "guest2Family", "requests", "marketing")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
MOBILE_RE = re.compile(r"^\d[\d\s]{6,14}$")


def _clean_guest(data):
    if not isinstance(data, dict):
        return None
    g = {k: (bool(data.get(k)) if k == "marketing" else str(data.get(k) or "").strip()[:200]) for k in GUEST_KEYS}
    if not g["title"] or not g["firstName"] or not g["familyName"] or not EMAIL_RE.match(g["email"]) or not MOBILE_RE.match(g["mobile"]):
        return None
    return g


def set_guest(st, data):
    if st["stage"] not in ("voice", "guest"):
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    g = _clean_guest(data)
    if not g:
        return Result(False, S["guest"]["fallback"], {"error": "invalid_guest_form"})
    st["guest"] = g
    st["stage"] = "review"
    return Result(True, S["guest"]["ok"], {"ok": True, "shown": "review card", "stage": "review"})


def edit_guest(st, data):
    if st["stage"] != "review":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    g = _clean_guest(data)
    if not g:
        return Result(False, S["review"]["fallback"], {"error": "invalid_guest_form"})
    st["guest"] = g
    return Result(True, S["review"]["updated"], {"ok": True, "shown": "updated review card", "stage": "review"})


def confirm(st, terms_accepted):
    if st["stage"] != "review":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    if not terms_accepted:
        r = Result(False, S["review"]["terms"], {"ok": False, "note": "the guest has not ticked the terms checkbox under the review card"})
        r.after = "termsError"
        return r
    if needs_otp(st):
        st["stage"] = "verify"
        return Result(True, S["review"]["verifyNew"], {"ok": True, "shown": "e-mail verification card", "stage": "verify"})
    st["stage"] = "payment"
    return Result(True, S["review"]["ok"], {"ok": True, "shown": "payment hand-off card", "grandTotal": B["grandTotal"], "stage": "payment"})


def verified(st, email):
    """server.py confirmed a code for `email` (from the OTP session, never from the browser's word)."""
    if st["stage"] != "verify":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    g = st.get("guest") or {}
    if str(email or "").lower() != str(g.get("email", "")).lower():
        return Result(False, S["verify"]["fallback"], {"error": "verified_email_mismatch"})
    st["verifiedEmail"] = str(email).lower()
    st["stage"] = "payment"
    return Result(True, S["verify"]["ok"], {"ok": True, "shown": "payment hand-off card", "stage": "payment"})


def voice_message(st):
    """Live build: no transcription service is configured, so a recording never fills the form (see README)."""
    if st["stage"] == "account":
        st["authMode"], st["stage"] = "guest", "guest"
        return Result(True, [{"text": S["live"]["voiceUnavailable"], "component": "guestForm"}], {"ok": False, "note": "voice transcription not configured; manual form shown"})
    if st["stage"] in ("voice", "guest"):
        return Result(False, S["live"]["voiceUnavailable"], {"ok": False, "note": "voice transcription not configured"})
    return Result(False, S["voice"]["other"], {"ok": False})


def payment_returned(st):
    if st["stage"] != "payment":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["paid"] = False
    st["paymentStatus"] = "unverified"
    st["stage"] = "done"
    return Result(True, S["payment"]["unverified"], {"ok": True, "paymentStatus": "unverified", "stage": "done"})
