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
             "account": S["activities"]["ok"][1:], "login": S["account"]["login"],
             "requests": S["live"]["askRequests"] if st.get("guest") else S["account"]["askRequests"],
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
    return Result(False, S["resort"]["other"], {"ok": False, "resort": r["name"], "note": "details shown; only Shebara can be booked here, the reply offers to continue with Shebara"})


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
    return Result(False, S["party"]["fallback"], {"ok": False, "note": "the quoted rate is for 2 adults and no children; a different party needs a new quote this build cannot give"})


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
    if mode == "account" and st.get("channel") == "studio_widget":
        # No e-mail code entry exists in the widget, so no profile can be retrieved there: say so, never claim one was.
        st["authMode"], st["stage"] = "guest", "guest"
        return Result(True, [S["live"]["signInWidget"], S["live"]["guestAsk"]],
                      {"ok": True, "mode": "guest", "note": "widget: sign-in with a code is not available, so no saved profile; the details are collected in the chat", "stage": "guest"})
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
    if st.get("guest"):                                   # details collected in the chat (widget): straight to the review
        st["guest"]["requests"] = req[:200]
        st["stage"] = "review"
        return Result(True, _items(S["guest"]["ok"]) + redeem_offer(st), {"ok": True, "request": req or None, "shown": "review card", "stage": "review"})
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
    if not terms_accepted and st.get("channel") != "studio_widget":     # the widget has no terms step: the official checkout shows its own
        r = Result(False, S["review"]["terms"], {"ok": False, "note": "the terms are not accepted yet (the checkbox under the review card on the website); the application has sent the reminder"})
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


# ---------------------------------------------------------------- guest details typed in the chat (widget path, 10 Nov 2026)
FIELD_AR = dict(S["words"]["fieldNames"], guest2First="الاسم الأول لزوجتك", guest2Family="اسم عائلة زوجتك", mobileCode="رمز الدولة")
TOOL_FIELDS = {"title": "title", "first_name": "firstName", "family_name": "familyName", "email": "email", "mobile_code": "mobileCode",
               "mobile": "mobile", "companion_first_name": "guest2First", "companion_family_name": "guest2Family"}
_WS = re.compile(r"\s+")
_DIGITS = re.compile(r"^[0-9]{7,14}$")
_CODE = re.compile(r"^\+?[0-9]{1,4}$")
_DIAC = re.compile(r"[\u064B-\u0652\u0640]")
TITLE_M, TITLE_F = "السيد", "السيدة"


def _nkey(name):
    """Comparison key for an Arabic first name: no diacritics or tatweel, one alef, ه for ة, ي for ى, no spaces (عبد الله = عبدالله)."""
    s = _DIAC.sub("", str(name or ""))
    for a, b in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ة", "ه"), ("ى", "ي")):
        s = s.replace(a, b)
    return _WS.sub("", s).strip().lower()


# Common first names whose gender is clear in Saudi usage. A name in neither set (نور, إحسان, a foreign name, a nickname) is
# ambiguous: the application asks one short question instead of guessing. Unisex names are deliberately in neither list.
MASCULINE_NAMES = frozenset(_nkey(n) for n in (
    "محمد أحمد عبدالله عبدالرحمن عبدالعزيز عبدالإله عبدالملك عبدالمجيد عبدالكريم عبدالرحيم عبداللطيف عبدالمحسن عبدالهادي عبدالوهاب "
    "خالد فهد سعود سلطان فيصل سعد سعيد عمر علي حسن حسين يوسف إبراهيم ناصر بندر تركي مشعل مشاري ماجد طلال نايف نواف سلمان راشد "
    "عادل أنس أسامة بدر بسام جابر حمد حمود زياد زيد سامي سليمان صالح طارق عايض عثمان عمار غازي فارس فواز كريم مازن مالك متعب "
    "محمود مصطفى معاذ منصور مهند هاني هشام وليد ياسر يحيى يزيد رائد رامي عصام فراس قاسم لؤي مروان ثامر إسماعيل إلياس أيمن أمجد "
    "باسل جمال حاتم حازم رياض سفيان شادي صقر ضاري ظافر عبده عزام عيسى غانم فيصل قصي لطفي مبارك مرزوق مساعد مقرن ممدوح موسى نبيل "
    "هادي هلال وائل وسيم يعقوب يونس ذياب ردين رعد ريان"
).split())
FEMININE_NAMES = frozenset(_nkey(n) for n in (
    "نورة فاطمة عائشة مريم سارة هند ريم لمى رنا دانة جواهر حصة منيرة العنود الجوهرة أمل هيا هيفاء لطيفة منى سلمى شهد غادة ليلى "
    "لينا نوف رهف روان جوري أروى أسماء بشاير بدور تهاني خلود دلال رغد رزان ريما سمر سميرة شذى عبير عهود فوزية لولوة مها مشاعل "
    "مضاوي نجلاء ندى نهى هديل هنادي وجدان وعد يارا أفنان ابتسام بثينة حنان خديجة رقية زينب صفية عفاف فدوى كوثر نادية نورا "
    "نسرين هالة وفاء أمجاد أميرة الهنوف ديمة ريناد لجين ملاك غلا غيداء إيمان رحمة مرام مي ميساء نجود نجوى هنوف وردة أثير أسيل "
    "البندري الريم بسمة بيان تالا جنى حلا دعاء رؤى رنيم ريم سجى سدين سهام شوق صبا عالية عزيزة فجر فرح لارا لمياء لورا ماجدة "
    "مزنة مها منال نوال هاجر هديل هيام وجد ورود يسرا"
).split())
_TITLE_WORDS = {"سيد": TITLE_M, "السيد": TITLE_M, "mr": TITLE_M, "mr.": TITLE_M, "سيده": TITLE_F, "السيده": TITLE_F, "mrs": TITLE_F, "mrs.": TITLE_F, "ms": TITLE_F, "ms.": TITLE_F}


def infer_title(first_name):
    """السيد for a clearly masculine first name, السيدة for a clearly feminine one, None when the name is ambiguous or unknown."""
    k = _nkey(first_name)
    if not k:
        return None
    if k in MASCULINE_NAMES:
        return TITLE_M
    if k in FEMININE_NAMES:
        return TITLE_F
    return None


def _clean_title(v):
    """The guest's own word for the title: سيد/mr -> السيد, سيدة/mrs/ms -> السيدة; any other short title is kept as written."""
    k = _nkey(v)
    return _TITLE_WORDS.get(k, v)


def guest_status(st):
    d = st.get("guest") or st.get("guestDraft") or {}
    return {"saved": [k for k in GUEST_KEYS if d.get(k)], "missing": [k for k in REQUIRED if not d.get(k)]}


def _clean_mobile(v):
    digits = "".join(ch for ch in v if ch.isdigit() or ch == "+")
    code = None
    if digits.startswith("00966"):
        code, digits = "+966", digits[5:]
    elif digits.startswith("+966"):
        code, digits = "+966", digits[4:]
    elif digits.startswith("+"):
        code, digits = digits[:4], digits[4:]
    if digits.startswith("0") and code in (None, "+966"):
        digits = digits[1:]
    return (code, digits) if _DIGITS.match(digits) else (None, None)


def set_guest_details(st, fields):
    """Merge the fields the guest typed into the draft (stages guest, requests) or the saved details (review, payment)."""
    if st["stage"] not in ("guest", "requests", "review", "payment"):
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    fields = fields if isinstance(fields, dict) else {}
    editing = bool(st.get("guest"))
    target = dict(st["guest"]) if editing else dict(st.get("guestDraft") or {})
    rejected = []
    for arg, key in TOOL_FIELDS.items():
        v = fields.get(arg)
        if v is None or not str(v).strip():
            continue
        v = _WS.sub(" ", str(v)).strip()[:200]
        if key == "email":
            if not EMAIL_RE.match(v):
                rejected.append(key)
                continue
            v = v.lower()
        elif key == "mobile":
            code, digits = _clean_mobile(v)
            if not digits:
                rejected.append(key)
                continue
            v = digits
            if code:
                target["mobileCode"] = code
        elif key == "mobileCode":
            if not _CODE.match(v):
                rejected.append(key)
                continue
            v = v if v.startswith("+") else "+" + v
        elif key == "title":
            v = _clean_title(v)
            if len(v) > 20:
                rejected.append(key)
                continue
        target[key] = v
    target.setdefault("mobileCode", "+966")
    for k in GUEST_KEYS:
        target.setdefault(k, False if k == "marketing" else "")
    if not target.get("title") and target.get("firstName"):       # the title follows the first name when it is clear
        target["title"] = infer_title(target["firstName"]) or ""
    missing = [k for k in REQUIRED if not target.get(k)]
    # the title is never asked for up front: it is inferred from the first name, and only an unclear name gets one question
    title_question = "title" in missing and bool(target.get("firstName"))
    ask_missing = [k for k in missing if k != "title"]
    if editing:                                            # a correction at review (or at payment, which reopens the review)
        if missing or rejected:
            if title_question and not rejected and not ask_missing:
                st["guest"] = target
                return Result(False, S["live"]["titleAsk"], {"ok": False, "missing": ["title"], "titleQuestion": True,
                                                            "note": "the first name is not clearly masculine or feminine; the reply asks which title to use"})
            return Result(False, S["live"]["guestInvalid"].replace("{invalid}", ar_list(FIELD_AR[k] for k in (rejected or ask_missing or missing))),
                          {"ok": False, "rejected": rejected, "missing": missing, "note": "the saved details are unchanged for those fields"})
        st["guest"] = target
        if st["stage"] == "requests":                      # corrected while the special-request question is open: ask it again
            return Result(True, S["live"]["askRequests"], {"ok": True, "shown": "special-request question", "stage": "requests", "note": "details updated; the request question is still open"})
        reopened = st["stage"] == "payment"
        st["stage"] = "review"
        return Result(True, _items(S["review"]["updated"]) + redeem_offer(st), {"ok": True, "shown": "updated review card", "stage": "review", "checkoutReopened": reopened})
    st["guestDraft"] = target
    if missing or rejected:
        text = ""
        if rejected:
            text = S["live"]["guestInvalid"].replace("{invalid}", ar_list(FIELD_AR[k] for k in rejected))
        if ask_missing:
            text = (text + " " if text else "") + S["live"]["guestMissing"].replace("{missing}", ar_list(FIELD_AR[k] for k in ask_missing))
        if title_question and not ask_missing:                  # everything else is in: the one short title question
            text = (text + " " if text else "") + S["live"]["titleAsk"]
        return Result(False, text, {"ok": False, "saved": [k for k in GUEST_KEYS if target.get(k)], "missing": missing, "rejected": rejected,
                                    "titleQuestion": title_question and not ask_missing,
                                    "note": "ask only for the missing or invalid fields; the title comes from the first name, so never ask for it unless titleQuestion is true; never card numbers or codes"})
    st["guest"] = target
    st.pop("guestDraft", None)
    st["stage"] = "requests"
    return Result(True, S["live"]["askRequests"], {"ok": True, "saved": [k for k in GUEST_KEYS if target.get(k)], "shown": "special-request question", "stage": "requests"})


# ---------------------------------------------------------------- demo loyalty points (agent/loyalty.py; demo rules, not RSG's programme)
def money(n):
    from decimal import Decimal
    return "%s %s" % (B["currency"], format(Decimal(str(n)), ",.2f"))


def payable_total(st):
    """The amount payable at checkout: the approved grand total minus the value of the points the guest chose to redeem."""
    from . import loyalty as L
    total = L.sar(B["grandTotal"])
    r = st.get("redeem") or {}
    value = L.redeem_value(r.get("points", 0)) if r else L.sar(0)
    return max(L.sar(0), total - value)


def loyalty_balance(st):
    from . import loyalty as L
    g = st.get("guest") or {}
    return L.balance(L.identity(g.get("email"))) if g.get("email") else 0


def redeem_offer(st):
    """One sentence offering the saved balance, appended to the review when the guest has points from earlier bookings."""
    from . import loyalty as L
    bal = loyalty_balance(st)
    if bal <= 0 or st.get("redeem"):
        return []
    return [S["live"]["redeemOffer"].replace("{balance}", str(bal)).replace("{value}", money(L.redeem_value(L.max_redeemable(bal, B["grandTotal"]))))]


def redeem_points(st, points):
    from . import loyalty as L
    if st["stage"] != "review":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    try:
        points = int(points)
    except (TypeError, ValueError):
        return Result(False, None, {"error": "invalid_points"})
    bal = loyalty_balance(st)
    if points <= 0:
        st.pop("redeem", None)
        return Result(True, [S["live"]["redeemCleared"].replace("{payable}", money(payable_total(st))), {"component": "review"}], {"ok": True, "redeemed": 0, "stage": "review"})
    if bal <= 0:
        return Result(False, S["live"]["redeemNone"], {"ok": False, "balance": 0, "note": "no points to redeem; this booking earns the first ones"})
    mx = L.max_redeemable(bal, B["grandTotal"])
    if points > mx:
        return Result(False, S["live"]["redeemTooMany"].replace("{max}", str(mx)).replace("{value}", money(L.redeem_value(mx))),
                      {"ok": False, "balance": bal, "maxPoints": mx, "note": "the reply already asks how many points to use"})
    st["redeem"] = {"points": points, "valueSar": str(L.redeem_value(points))}
    text = S["live"]["redeemApplied"].replace("{points}", str(points)).replace("{value}", money(L.redeem_value(points))).replace("{payable}", money(payable_total(st)))
    return Result(True, [text, {"component": "review"}], {"ok": True, "redeemed": points, "valueSar": str(L.redeem_value(points)), "payable": str(payable_total(st)), "stage": "review"})


def cancel_checkout(st):
    """The guest stops at the payment link: back to the review; the bridge invalidates the pending completion."""
    if st["stage"] != "payment":
        return Result(False, None, {"error": "not_allowed_in_stage", "stage": st["stage"]})
    st["stage"] = "review"
    return Result(True, [S["live"]["cancelled"], {"component": "review"}], {"ok": True, "stage": "review", "shown": "review card", "note": "the pending completion is cancelled"})
