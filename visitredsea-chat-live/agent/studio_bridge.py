"""Empathy Studio "Custom Agent (self-hosted)" bridge.

Studio's own API-contract panel (read from its UI bundle, 9 Nov 2026) defines two endpoints at the agent's Base URL:

    POST {base_url}/sessions                      {"variables":[{"name":"channel_key",...},{"name":"visitor_id",...}]}
                                                  -> 2xx {"session_id": "<opaque>"}
    POST {base_url}/sessions/{session_id}/messages {"message": "...", "variables": [...]}
                                                  -> 2xx {"reply": "text"}
    404/410: Studio restarts the session and retries once. Other 4xx: hard fail. 5xx: one retry after 1 s.
    Timeouts: 60 s for /sessions, 3 min for /messages. The handler must tolerate the same message twice.
    Secret headers (if configured in Studio) are attached to every request.

This module turns a Studio message into the same turn the website would have sent (agent/chat.py): an approved
card line («نختار Shebara.», «مناسب، نكمل», «مطار الوصول: X, مطار المغادرة: Y» ...) becomes the deterministic
event, anything else goes to the Claude Managed Agent. The reply is ONE text: the approved lead-in sentences with
their placeholders filled, followed by a labelled data block for each card the application attached, so Studio's
Rendering Intelligence can select the template and populate the component. Nothing here invents content: every
value comes from agent/data.json (dumped from data/*.js) and the booking state.

Limits of the widget path, stated to the guest instead of faked: no calendar (dates are typed), no guest form,
no OTP sign-in. No terms step either (12 Nov 2026): «البيانات صحيحة، نكمل» goes straight to the payment link and the
official checkout shows its own terms. The trip-summary card's «تحميل PDF» carries the signed link as its payload; the
fresh site opens it on click (js/site.js), and a payload that still reaches the bridge gets the link as text.
"""
import datetime
import hashlib
import json
import re
import secrets
import sys
import threading
import time

from . import chat as CHAT
from . import data as D
from . import loyalty as L
from . import state as T

S = D.SCRIPT
B = D.BOOKING
_lock = threading.Lock()
_recent = {}          # sid -> (message, reply_json, time): the duplicate-delivery guard the contract asks for

AR_DAYS = ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]      # date.weekday(): Monday = 0
AR_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]


def ar_date(iso):
    try:
        d = datetime.date.fromisoformat(iso)
    except (TypeError, ValueError):
        return iso or ""
    return "%s %d %s %d" % (AR_DAYS[d.weekday()], d.day, AR_MONTHS[d.month - 1], d.year)


def nights_word(n):
    w = S["words"]["nights"]
    if not n:
        return ""
    if n == 1:
        return w["1"]
    if n == 2:
        return w["2"]
    return (w["many"] if n <= 10 else w["lots"]).replace("{n}", str(n))


def fill(text, st):
    """Server-side port of js/chat.js fill(): {{{x}}} and {x} from state, {{literal}} kept as the literal."""
    g = st.get("guest") or {}
    v = {"name": st.get("name", ""), "wife": g.get("guest2First") or S["words"]["wifeDefault"], "email": g.get("email", ""),
         "resort": st.get("resortName", ""), "villa": st.get("villaName", ""), "in": ar_date(st.get("checkIn")) if st.get("checkIn") else "",
         "out": ar_date(st.get("checkOut")) if st.get("checkOut") else "", "nights": str(st.get("nights") or ""), "nightsWord": nights_word(st.get("nights") or 0),
         "modeWord": S["words"]["modes"].get(st.get("mode", ""), st.get("mode", "")), "arrival": st.get("arrivalAirport", ""), "departure": st.get("departureAirport", "")}
    text = re.sub(r"\{\{\{(\w+)\}\}\}", lambda m: v.get(m.group(1), m.group(0)), text)
    text = re.sub(r"\{\{(.+?)\}\}", lambda m: m.group(1), text)
    return re.sub(r"\{(\w+)\}", lambda m: v.get(m.group(1), m.group(0)), text)


def money(n):
    return "%s %s" % (B["currency"], format(float(n), ",.2f"))


def adults_word(n):
    return "شخص بالغ واحد" if n == 1 else "2 بالغين" if n == 2 else "%d بالغين" % n


# ---------------------------------------------------------------- card data blocks (what Studio's populator reads)
def _abs(origin, path):
    return path if not path or path.startswith(("http://", "https://")) else origin.rstrip("/") + "/" + path.lstrip("/")


def _resort_lines(r, origin, button=True):
    lines = ["name = " + r["name"], "setting = " + (r.get("settingAr") or ""), "profile = " + (r.get("aboutAr") or ""),
             "location = " + (r.get("locationAr") or r.get("placeAr") or r.get("place") or ""), "accommodation = " + (r.get("stayAr") or r.get("factsAr") or ""),
             "highlights = " + "، ".join(r.get("highlightsAr") or []), "image = " + _abs(origin, r.get("image", "")), "official_page = " + (r.get("url") or "")]
    if button:
        lines.append("button = اختيار -> " + S["customer"]["resort"].replace("{{{resort}}}", r["name"]))
    return "\n".join(lines)


FORM_FIELD = {"title": "title", "firstName": "first_name", "familyName": "family_name", "email": "email", "mobileCode": "mobile_code",
              "mobile": "mobile", "guest2First": "companion_first_name", "guest2Family": "companion_family_name"}


def _v(x):
    x = "" if x is None else str(x).strip()
    return x if x else "-"


def calendar_block(st):
    """[calendar: dates] for the website's rsg_date_range renderer. min_date is the priced check-in (the demo's only priced
    stay is already in the past on the calendar); in production it becomes tomorrow. Nothing is pre-selected (12 Nov 2026):
    the guest picks both dates; "-" is the schema's empty value and the page's renderer reads it as no selection."""
    start = datetime.date.fromisoformat(B["stay"]["checkIn"])
    lines = ["[calendar: dates]", "main_title = " + S["live"]["calendarTitle"], "min_date = " + B["stay"]["checkIn"],
             "max_date = " + (start + datetime.timedelta(days=365)).isoformat(), "initial_check_in = -",
             "initial_check_out = -", "min_nights = 1", "max_nights = 30", "submit_label = " + S["live"]["calendarSubmit"]]
    return chr(10).join(lines)


def form_block(st):
    """[form: guest_details] for the website's rsg_guest_form renderer: prefill from what is saved, the title rule applied
    by the application (infer_title), and the one rejected field of the last submission, if any."""
    g = st.get("guest") or st.get("guestDraft") or {}
    first = g.get("firstName") or st.get("name") or ""
    title = g.get("title") or (T.infer_title(first) if first else "") or ""
    ask = bool(first) and not title
    err = st.pop("_formError", None) or {}
    lines = ["[form: guest_details]", "main_title = " + S["live"]["formTitle"], "title_value = " + _v(title), "title_ask = " + ("true" if ask else "false"),
             "title_question = " + (S["live"]["titleAsk"] if ask else "-"), "first_name = " + _v(first), "family_name = " + _v(g.get("familyName")),
             "email = " + _v(g.get("email")), "mobile_code = " + (_v(g.get("mobileCode")) if g.get("mobileCode") else "+966"), "mobile = " + _v(g.get("mobile")),
             "companion_first_name = " + _v(g.get("guest2First")), "companion_family_name = " + _v(g.get("guest2Family")), "requests = " + _v(g.get("requests")),
             "error_field = " + _v(err.get("field")), "error_text = " + _v(err.get("text")), "submit_label = " + S["live"]["formSubmit"]]
    return chr(10).join(lines)


def card_block(component, st, origin):
    if component == "calendar":
        return calendar_block(st)
    if component == "guestForm":
        return form_block(st)
    """The data lines for one application component, or "" for website-only components."""
    if component == "resortPick":
        return "[cards: resort_suggestions]\n\n" + "\n\n".join(_resort_lines(D.RESORT_BY_NAME[n], origin) for n in D.SUGGESTED)
    if component == "resortDetails":
        r = D.RESORT_BY_NAME.get(st.get("resortName"))
        return "[card: resort_details]\n\n" + _resort_lines(r, origin, button=False) if r else ""
    if component == "compare":
        rows = []
        for i, x in enumerate(D.RESORT_COMPARE, 1):
            rows.append("criterion = %d من %d\ntitle = %s\nquestion = %s\nShebara = %s\nDesert Rock = %s\ndifference_label = %s\ndifference = %s"
                        % (i, len(D.RESORT_COMPARE), x["title"], x["question"], x["shebara"], x["desertRock"], x.get("diffLabel") or "-", x.get("diff") or "-"))
        return "[cards: resort_compare]\n\n" + "\n\n".join(rows)
    if component == "comparePick":
        return "[cards: resort_choice]\n\n" + "\n\n".join(_resort_lines(D.RESORT_BY_NAME[n], origin) for n in ("Shebara", "Desert Rock"))
    if component == "villas":
        # Selection card only (12 Nov 2026): name, occupancy, features, button; no price, party, dates or tax note (the stay
        # details and amounts come at the stay summary, totals and review).
        rows = []
        for v in D.VILLAS:
            priced = v["name"] == B["villa"]["name"]
            rows.append("name = %s\nname_ar = %s\noccupancy = %s\nfacts = %s\nrate_badge = %s\nimage = %s\nbutton = اختيار -> %s"
                        % (v["name"], v.get("nameAr", v["name"]), v.get("occupancyAr", ""), v.get("factsAr", ""),
                           B["rate"]["name"] if priced else "-", _abs(origin, v["image"]),
                           S["customer"]["villa"].replace("{{{villa}}}", v["name"]).replace("{{", "").replace("}}", "")))
        return "[cards: villas]\n\n" + "\n\n".join(rows)
    if component in ("summary1", "summary2"):
        stay = "%s – %s · %s" % (ar_date(st["checkIn"]), ar_date(st["checkOut"]), nights_word(st["nights"]))
        if component == "summary1":
            return ("[card: stay_summary]\nimage = %s\nsubtitle = %s · %s\ndates = %s\nguests = %s\ntotal = %s · %s\nnote = %s\nbutton = مناسب، نكمل"
                    % (_abs(origin, "assets/site/resorts-hero-shebara.webp"), B["villa"]["nameAr"], B["rate"]["name"], stay, adults_word(st["adults"]), money(B["rate"]["total"]), B["rate"]["taxNoteAr"], B["occupancyNoteAr"]))
        return ("[card: totals]\nimage = %s\nsubtitle = %s · %s · %s\nstay = %s\ntransfers = %s\ntotal = %s · %s\nnote = الإقامة والتنقلات · %s · %s\nbutton = اعتمد ونكمل"
                % (_abs(origin, "assets/site/resorts-hero-shebara.webp"), B["villa"]["nameAr"], stay, adults_word(st["adults"]), money(B["rate"]["total"]), money(B["transport"]["transfersTotal"]),
                   money(B["grandTotal"]), B["rate"]["taxNoteAr"], adults_word(st["adults"]), B["rate"]["taxNoteAr"]))
    if component == "modes":
        icons = {"By Plane": "plane", "By Private Jet": "plane-takeoff", "By Car": "car", "By Yacht": "ship"}
        return "[picker: arrival_modes]\n" + "\n".join("option = %s | icon = %s | payload = %s" % (S["words"]["modes"][m], icons[m], S["customer"]["mode"].replace("{modeWord}", S["words"]["modes"][m])) for m in B["transport"]["modes"])
    if component == "airports":
        names = B["transport"]["airportsAr"]
        opts = " | ".join(names[a] for a in B["transport"]["airports"])
        return "[picker: airports]\ngroup = مطار الوصول :: %s\ngroup = مطار المغادرة :: %s\nsend_button = اعتماد المطارات" % (opts, opts)
    if component == "transportTrip":
        rows = []
        for i, l in enumerate(B["transport"]["legs"]):
            details = [l.get("durationAr") or ""] + list(l.get("capacityAr") or []) + [l.get("neededAr") or ""]
            rows.append("leg = %s\nproduct = %s\nprice = %s\nroute = %s → %s\ndetails = %s\nprice_basis = %s\nimage = %s"
                        % ("المغادرة" if i else "الوصول", l.get("productAr", l["product"]), money(l["price"]), l["from"], l["to"], " | ".join(d for d in details if d) or "-", l.get("priceBasisAr", ""), _abs(origin, l.get("image", ""))))
        return "[cards: transfer_legs]\n\n" + "\n\n".join(rows)
    if component == "activities":
        return "[cards: experiences]\n\n" + "\n\n".join("name = %s\ncategory = %s\nprice = %s\ntags = %s\nimage = %s" % (a.get("nameAr", a["name"]), a.get("categoryAr", a["category"]), a.get("priceAr", a["price"]), " | ".join(a.get("tagsAr") or a["tags"]), _abs(origin, a["image"])) for a in B["activities"])
    if component == "accountChoice":
        return "[picker: guest_path]\noption = لدي حساب سابق | subtitle = الدخول ببريدك الإلكتروني واسترجاع بياناتك المحفوظة | icon = lock | payload = لدي حساب سابق\noption = متابعة كضيف جديد | subtitle = إدخال بياناتك وبيانات زوجتك للحجز | icon = user | payload = متابعة كضيف جديد"
    if component == "review":
        g = st["guest"]
        return ("[card: review]\nimage = %s\nsubtitle = %s · %s · %s – %s · %s · %s · %s → %s\nguests = %s %s %s · %s\ntransfers = الوصول: %s / المغادرة: %s\ncontact = %s / %s %s\ntotals = الإجمالي %s · %s · الإقامة %s + التنقلات %s · لا تجارب مضافة\nrequest = %s\nbutton = البيانات صحيحة، نكمل"
                % (_abs(origin, B["villa"]["terraceImage"]), B["villa"]["nameAr"], B["rate"]["name"], ar_date(st["checkIn"]), ar_date(st["checkOut"]), nights_word(st["nights"]), adults_word(st["adults"]), st["arrivalAirport"], st["departureAirport"],
                   g["title"], g["firstName"], g["familyName"], (g["guest2First"] + " " + g["guest2Family"]).strip() or "-", B["transport"]["legs"][0]["productAr"], B["transport"]["legs"][1]["productAr"], g["email"], g["mobileCode"], g["mobile"],
                   money(T.payable_total(st)), B["rate"]["taxNoteAr"], money(B["rate"]["total"]), money(B["transport"]["transfersTotal"]), g.get("requests") or "-")
                + (("\nredeemed = %s نقطة ولاء = %s" % (st["redeem"]["points"], money(st["redeem"]["valueSar"]))) if st.get("redeem") else ""))
    if component == "payment":
        return ("[card: checkout]\nimage = %s\nsubtitle = %s · %s\nvilla = %s\ndates = %s – %s · %s\ncheckout_url = %s\nbutton = المتابعة للدفع"
                % (_abs(origin, B["villa"]["terraceImage"]), money(B["grandTotal"]), B["rate"]["taxNoteAr"], B["villa"]["nameAr"], ar_date(st["checkIn"]), ar_date(st["checkOut"]), adults_word(st["adults"]), B["checkoutUrl"]))
    if component == "confirmation":
        g = st["guest"]
        loy = st.get("loyalty") or {}
        return ("[card: trip_summary]\nimage = %s\nsubtitle = %s · %s · %s – %s · %s → %s\nguests = %s %s %s و%s · %s\ntransfers = الوصول: %s / المغادرة: %s\ncontact = %s / %s %s\n"
                "amount_due = %s · %s\npoints_earned = %s\npoints_redeemed = %s\ntotals = الإجمالي %s · %s · لا تجارب مضافة\nrequest = %s\npdf = %s"
                % (_abs(origin, B["resort"]["image"]), B["villa"]["nameAr"], B["rate"]["name"], ar_date(st["checkIn"]), ar_date(st["checkOut"]), st["arrivalAirport"], st["departureAirport"],
                   g["title"], g["firstName"], g["familyName"], (g["guest2First"] + " " + g["guest2Family"]).strip() or "-", adults_word(st["adults"]), B["transport"]["legs"][0]["productAr"], B["transport"]["legs"][1]["productAr"],
                   g["email"], g["mobileCode"], g["mobile"],
                   money(T.payable_total(st)), B["rate"]["taxNoteAr"], points_text(loy.get("earned")), loy.get("redeemed", 0) or 0,
                   money(T.payable_total(st)), B["rate"]["taxNoteAr"], g.get("requests") or "-", pdf_note(st) or "-"))
    return ""


WEBSITE_ONLY = ("verify",)                              # the e-mail code card: unreachable for chat-collected details (no OTP)
CHAT_ASK = {"signIn": "signInWidget"}                            # website components replaced by a conversational line
# confirmation-card icons, the same files the website's cards use (studio/icons/*.svg), as absolute URLs for the populator
CARD_ICONS = {"summary1": (("dates", "calendar"), ("guests", "users"), ("total", "credit-card")),
              "summary2": (("stay", "bed"), ("transfers", "plane"), ("total", "credit-card")),
              "review": (("guests", "users"), ("transfers", "plane"), ("contact", "mail")),
              "confirmation": (("guests", "users"), ("transfers", "plane"), ("contact", "mail"))}


TERMS_ASK = re.compile(r"أكّد الموافقة على الشروط ونكمل(?: للتحقق من البريد)?")   # the website's checkbox prompt in the review lines


def widget_text(text, st):
    """Approved wording that names a website control the widget does not have gets the widget's own line."""
    return TERMS_ASK.sub(S["live"]["reviewNextWidget"], fill(text, st))


def reply_text(items, st, origin):
    parts = []
    for it in items:
        if not isinstance(it, dict):
            continue
        comp = it.get("component")
        if comp in WEBSITE_ONLY:                        # the lead-in would invite the guest into a card that is not here
            parts.append(fill(S["live"]["widgetStep"], st))
            continue
        if comp == "guestForm":                         # the website renders the form from the block (Template 16)
            lead = it.get("text") or ""
            if not lead or lead == S["account"]["guest"][0]["text"]:
                lead = S["live"]["formLead"]
            parts.append(fill(lead, st))
            parts.append(form_block(st))
            continue
        if comp in CHAT_ASK:                            # sign-in by code does not exist here: say so, then the form
            parts.append(fill(S["live"][CHAT_ASK[comp]], st))
            parts.append(fill(S["live"]["formLead"], st))
            parts.append(form_block(st))
            continue
        text = it.get("text") or ""
        if text in (S["live"]["guestAsk"], S["guest"]["fallback"]):   # typed-details asks become the form
            parts.append(fill(S["live"]["formLead"] if text == S["live"]["guestAsk"] else S["live"]["formLeadFix"], st))
            parts.append(form_block(st))
            continue
        if text in (S["dates"]["fallback"], S["dates"]["invalid"]):   # calendar asks (Template 15)
            parts.append(fill(S["dates"]["invalid"] if text == S["dates"]["invalid"] else S["live"]["calendarTitle"], st))
            parts.append(calendar_block(st))
            continue
        if comp == "payment":                           # the approved link as plain text (no card), with the payable amount
            parts.append(checkout_text(st))
            continue
        if it.get("text"):
            parts.append(widget_text(it["text"], st))
        if comp == "calendar":
            parts.append(calendar_block(st))
        elif text.startswith(S["dates"]["other"][0]["text"][:12]):   # other dates: the reply offers the priced ones, calendar again
            parts.append(calendar_block(st))
        if comp and comp != "calendar":
            blk = card_block(comp, st, origin)
            if blk and comp in CARD_ICONS:
                blk += chr(10) + "icons = " + " | ".join("%s: %s" % (k, _abs(origin, "studio/icons/%s.svg" % n)) for k, n in CARD_ICONS[comp])
            if blk:
                parts.append(blk)
        if it.get("quick"):
            parts.append("تقدر ترد بـ: " + " / ".join("«%s»" % q["label"] for q in it["quick"]))
    return "\n\n".join(p for p in parts if p).strip()


PAGE_ORIGIN = ""        # set by server.py: the website origin that serves trip.html (default http://127.0.0.1:8100)
TOKEN_SECRET = b""      # set by server.py: the bridge secret (or a per-process random) that signs the download links


def pdf_token(booking_id):
    import hmac
    return hmac.new(TOKEN_SECRET, booking_id.encode("utf-8"), hashlib.sha256).hexdigest()[:24]


def pdf_url(booking_id):
    return "%s/trip.html?b=%s&t=%s" % (PAGE_ORIGIN.rstrip("/"), booking_id, pdf_token(booking_id))


def pdf_note(st):
    """The trip-summary card's note: the download link of the recorded booking, once it exists."""
    return pdf_url(st["bookingRef"]) if st.get("bookingRef") else ""


def pdf_reply(sess):
    st = sess.state
    if not st.get("bookingRef") or not L.completion(st["bookingRef"]):
        return [{"text": S["live"]["pdfNotReady"]}]
    return [{"text": fill(S["live"]["pdfLink"], st).replace("{link}", md_link(S["live"]["pdfLinkLabel"], pdf_url(st["bookingRef"])))}]


def points_text(n):
    """A points figure for guest-facing text: Western digits with a thousands separator (3379 -> 3,379)."""
    try:
        return "{:,}".format(int(n))
    except (TypeError, ValueError):
        return "-"


def md_link(label, url):
    """A markdown link: the widget's formatter renders [label](https://…) as an anchor that opens in a new tab."""
    return "[%s](%s)" % (label, url)


def checkout_text(st):
    return "\n".join([S["live"]["checkoutLead"].replace("{payable}", money(T.payable_total(st))),
                       md_link(S["live"]["checkoutLinkLabel"], B["checkoutUrl"]), S["live"]["checkoutNote"]])


def quote_hash(st):
    """What the pending demo completion is tied to: the approved booking, the guest and the amount payable."""
    g = st.get("guest") or {}
    key = [st.get("resortName"), st.get("villaName"), st.get("checkIn"), st.get("checkOut"), st.get("adults"), st.get("children"),
           st.get("arrivalAirport"), st.get("departureAirport"), g.get("email"), g.get("firstName"), g.get("familyName"),
           g.get("guest2First"), g.get("guest2Family"), g.get("requests"), (st.get("redeem") or {}).get("points", 0), str(T.payable_total(st))]
    return hashlib.sha256(json.dumps(key, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()


MIN_DELAY = 4.5          # seconds after the link was issued before the page's continue signal is honoured (the page waits 5)


def sync_pending(sess):
    """After every turn: a payment link on screen for the current quote keeps (or creates) its pending completion; anything
    else (cancel, correction, new conversation) invalidates it."""
    st = sess.state
    if st["stage"] != "payment" or getattr(sess, "completion", None):
        sess.pending_completion = None
        return
    q = quote_hash(st)
    p = getattr(sess, "pending_completion", None)
    if not p or p["quote"] != q:
        sess.pending_completion = {"id": "RSGD-" + hashlib.sha256(("booking:" + q).encode()).hexdigest()[:10].upper(),
                                   "quote": q, "issued": time.time(), "payable": str(T.payable_total(st)), "redeem": (st.get("redeem") or {}).get("points", 0)}


def demo_continue(sess, origin):
    """The page's silent signal about five seconds after the payment link appeared. Idempotent per booking id."""
    st = sess.state
    if getattr(sess, "completion", None):                  # already completed: the same closing again, nothing credited twice
        return sess.completion
    p = getattr(sess, "pending_completion", None)
    if not p or st["stage"] != "payment" or p["quote"] != quote_hash(st):
        return T.current_step(st).items                     # nothing pending: the step's own prompt
    if time.time() - p["issued"] < MIN_DELAY:
        return [{"text": S["live"]["checkoutNote"]}]
    g = st.get("guest") or {}
    rec = L.complete(p["id"], L.identity(g.get("email")), p["payable"], p["redeem"],
                     {"resort": st.get("resortName"), "villa": st.get("villaName"), "checkIn": st.get("checkIn"), "checkOut": st.get("checkOut"),
                      "nights": st.get("nights"), "adults": st.get("adults"), "children": st.get("children"),
                      "arrivalAirport": st.get("arrivalAirport"), "departureAirport": st.get("departureAirport"),
                      "guest": {k: g.get(k, "") for k in ("title", "firstName", "familyName", "email", "mobileCode", "mobile", "guest2First", "guest2Family", "requests")},
                      "redeem": dict(st.get("redeem") or {}), "channel": "studio_widget"})
    st["paid"] = False
    st["paymentStatus"] = "unverified"
    st["bookingRef"] = rec["booking_id"]
    st["loyalty"] = {"earned": rec["earned_points"], "redeemed": rec["redeemed_points"]}     # this booking's award only (no running balance shown)
    st["stage"] = "done"
    companion = ("ول" + g["guest2First"] + " ") if g.get("guest2First") else ""
    redeemed_line = S["live"]["loyaltyRedeemedLine"].replace("{redeemed}", points_text(rec["redeemed_points"])) if rec["redeemed_points"] else ""
    close = S["live"]["loyaltyClose"].replace("{points}", points_text(rec["earned_points"])).replace("{companion}", companion).replace("{redeemedLine}", redeemed_line)
    summary_lead = next((it["text"] for it in T._items(S["payment"]["unverified"]) if it.get("component") == "confirmation"), "")
    items = [{"text": fill(S["live"]["completed"], st)}, {"text": summary_lead, "component": "confirmation"}, {"text": fill(close, st)}]
    sess.completion = items
    sess.pending_completion = None
    sess.recent_events.append("booking recorded: %s, loyalty points earned on this booking %d (the application already told the guest)" % (rec["booking_id"], rec["earned_points"]))
    sys.stderr.write("%s studio %s demo completion %s earned=%s balance=%s%s\n" % (time.strftime("%H:%M:%S"), sess.sid[:8], rec["booking_id"],
                                                                                 rec["earned_points"], rec["balance_after"], " (repeated)" if rec.get("repeated") else ""))
    return items


# ---------------------------------------------------------------- Studio message -> application event
TRIP_URL = re.compile(r"^https?://\S+/trip\.html\?b=[\w-]+&t=[0-9a-f]+$")    # the PDF button's payload when no page handler caught the click


def _airport_from_label(label):
    label = label.strip()
    for a in B["transport"]["airports"]:
        if label == a or label == B["transport"]["airportsAr"].get(a):
            return a
    return None


DATES_LINE = re.compile(r"^الوصول (\d{1,2}) (\S+) (\d{4}) والمغادرة (\d{1,2}) (\S+) (\d{4})")
DETAIL_KEYS = (("اللقب", "title"), ("الاسم الأول", "first_name"), ("اسم العائلة", "family_name"), ("البريد", "email"),
               ("الجوال", "mobile"), ("المرافق", "companion"), ("طلبات:", "requests"), ("طلبات", "requests"))


def parse_details_line(t):
    """«بياناتي: اللقب X؛ الاسم الأول X؛ اسم العائلة X؛ البريد X؛ الجوال +966 5…؛ المرافق X Y؛ طلبات: …» → set_guest_details fields."""
    out = {}
    body = t.split(":", 1)[1] if ":" in t else t
    for seg in body.split("؛"):
        seg = seg.strip()
        for label, key in DETAIL_KEYS:
            if seg.startswith(label):
                val = seg[len(label):].strip().lstrip(":").strip()
                if val in ("", "-"):
                    break
                if key == "mobile":
                    m = re.match(r"^(\+\d{1,4})\s*(.*)$", val)
                    if m:
                        out["mobile_code"], val = m.group(1), m.group(2).strip()
                    out["mobile"] = val
                elif key == "companion":
                    bits = val.split(None, 1)
                    out["companion_first_name"] = bits[0]
                    if len(bits) > 1:
                        out["companion_family_name"] = bits[1]
                elif key == "requests":
                    if val not in ("لا", "لا شيء", "بدون"):
                        out["requests"] = val
                else:
                    out[key] = val
                break
    return out


def guest_form_submit(sess, fields, origin):
    """The form's line: save the details (deterministic), then the special request in the same turn, so one submission
    lands on the review. A rejected field sends the form back with that field marked."""
    st = sess.state
    fields = dict(fields or {})
    requests = fields.pop("requests", None)
    r = T.set_guest_details(st, fields)
    if r.ok and st["stage"] == "requests":
        r2 = T.record_request(st, requests, not requests)
        items = T._items(r2.items)
        note = "details form submitted and saved; review shown"
    elif r.ok:
        items = T._items(r.items)
        note = "details form resubmitted; review updated"
    elif r.result.get("error") == "not_allowed_in_stage":
        items = T._items(T.fallback(st))
        note = "details form submitted at the wrong step"
    else:
        bad = (r.result.get("rejected") or r.result.get("missing") or [""])[0]
        st["_formError"] = {"field": FORM_FIELD.get(bad, bad), "text": " ".join(i.get("text", "") for i in T._items(r.items) if isinstance(i, dict)).strip()}
        items = [{"text": fill(S["live"]["formLeadFix"], st), "component": "guestForm"}]
        note = "details form rejected (%s)" % bad
    sess.recent_events.append("guest action: " + note)
    sess.recent_events = sess.recent_events[-12:]
    return {"items": items, "state": T.snapshot(st)}


def event_for(text):
    """The approved card/quick-reply lines, mapped to the event the website would send. None = a typed message."""
    t = text.strip()
    m = re.match(r"^نختار (.+?)\.?$", t)
    if m and (m.group(1) in D.RESORT_BY_NAME or D.resort_id(m.group(1)) in D.RESORT_BY_ID):
        r = D.RESORT_BY_NAME.get(m.group(1)) or D.RESORT_BY_ID[D.resort_id(m.group(1))]
        return {"type": "resort", "name": r["name"], "source": "card"}
    if t == "نكمل مع Shebara":
        return {"type": "resort", "name": "Shebara", "source": "quick"}
    m = re.match(r"^أختار (.+?) على Villa Flat Rate\.?$", t)
    if m:
        return {"type": "villa", "villa": m.group(1).strip()}
    if t == "نكمل على فيلا فوق الماء بغرفة نوم واحدة":
        return {"type": "villa", "villa": B["villa"]["name"]}
    if t in ("مناسب، نكمل", "اعتمد ونكمل"):
        return {"type": "approve"}
    if t == "اختيار 23 إلى 25 أكتوبر 2026":
        return {"type": "dates", "a": B["stay"]["checkIn"], "b": B["stay"]["checkOut"]}
    for mode, word in S["words"]["modes"].items():
        if t == S["customer"]["mode"].replace("{modeWord}", word) or t == word or (mode == B["transport"]["supportedMode"] and t == "نعم، بالطائرة"):
            return {"type": "mode", "mode": mode}
    if "مطار الوصول:" in t and "مطار المغادرة:" in t:     # the grouped picker sends "group: option, group: option" in click order
        picks = {"مطار الوصول": [], "مطار المغادرة": []}
        for part in t.split(", "):
            g, sep, label = part.partition(": ")
            a = _airport_from_label(label) if sep else None
            if a and g.strip() in picks:
                picks[g.strip()].append(a)
        if len(picks["مطار الوصول"]) == 1 and len(picks["مطار المغادرة"]) == 1:
            return {"type": "airports", "arrival": picks["مطار الوصول"][0], "departure": picks["مطار المغادرة"][0], "flight": {}}
        return {"type": "airportsBad"}
    if t == "نكمل على مطار ينبع ومطار البحر الأحمر الدولي":
        return {"type": "airports", "arrival": B["transport"]["arrivalAirport"], "departure": B["transport"]["departureAirport"], "flight": {}}
    if t in ("نختار عند الوصول", "نعم، نكمل الحجز"):
        return {"type": "defer"}
    if t == "لدي حساب سابق":
        return {"type": "account", "mode": "account"}
    if t == "متابعة كضيف جديد":
        return {"type": "account", "mode": "guest"}
    if t == "البيانات صحيحة، نكمل":
        return {"type": "confirm"}
    if t in ("المتابعة إلى الدفع على Visit Red Sea", "المتابعة للدفع"):
        return {"type": "checkoutLink"}
    if t == "rsg:continue":
        return {"type": "demoContinue"}
    m = DATES_LINE.match(t)
    if m and m.group(2) in AR_MONTHS and m.group(5) in AR_MONTHS:    # the calendar's line (customer.dates wording)
        return {"type": "dates", "a": "%s-%02d-%02d" % (m.group(3), AR_MONTHS.index(m.group(2)) + 1, int(m.group(1))),
                "b": "%s-%02d-%02d" % (m.group(6), AR_MONTHS.index(m.group(5)) + 1, int(m.group(4)))}
    if t.startswith("بياناتي:"):                                     # the guest form's line
        return {"type": "guestForm", "fields": parse_details_line(t)}
    if t == "تعديل البيانات":
        return {"type": "editAsk"}
    if t == "تحميل PDF" or TRIP_URL.match(t):
        return {"type": "pdf"}
    return None


# ---------------------------------------------------------------- the two contract endpoints
def start_session(variables):
    sess = CHAT.new_session()
    sess.channel = "studio_widget"                      # told to the agent in the <context> block (no calendar/form/checkbox here)
    sess.state["channel"] = "studio_widget"             # transitions that differ in the widget (sign-in, details) read this
    sess.pending_completion = None                      # {id, quote, issued, payable, redeem}: set when the payment link is issued
    sess.completion = None                              # the recorded demo completion's reply items (returned again on a retry)
    sess.studio = {"variables": {v.get("name"): v.get("value") for v in (variables or []) if isinstance(v, dict)}, "created": time.time()}
    return sess.sid


def handle_message(session_id, message, server, origin):
    """Returns (status, payload). 404 when the session is unknown or expired (Studio restarts it and retries once)."""
    sess = CHAT.get_session(session_id)
    if not sess:
        return 404, {"error": "session_not_found"}
    message = str(message or "").strip()
    if not message:
        return 400, {"error": "empty_message"}
    with _lock:
        last = _recent.get(sess.sid)
    if last and last[0] == message and time.time() - last[2] < 180 and message != "rsg:continue":   # the contract's duplicate delivery
        return 200, last[1]                                      # (the control line repeats by design; its idempotency is the completion record)
    turn_id = "studio-" + secrets.token_hex(6)             # unique per delivery: Windows time.time() ticks every ~15 ms, so two
                                                           # instant card events could share a millisecond id and hit the turn cache
    ev = event_for(message)
    st = sess.state
    try:
        if ev and ev["type"] == "checkoutLink":
            text = fill(S["live"]["checkoutWidget"], st) + "\n" + B["checkoutUrl"]
            resp = {"items": [{"text": text}], "state": T.snapshot(st)}
        elif ev and ev["type"] == "widgetOnly":
            resp = {"items": [{"text": fill(S["live"]["editWidget"], st)}], "state": T.snapshot(st)}
        elif ev and ev["type"] == "pdf":
            resp = {"items": pdf_reply(sess), "state": T.snapshot(st)}
        elif ev and ev["type"] == "editAsk":
            resp = {"items": [{"text": fill(S["live"]["formLeadEdit"], st), "component": "guestForm"}], "state": T.snapshot(st)}
        elif ev and ev["type"] == "guestForm":
            resp = guest_form_submit(sess, ev["fields"], origin)
        elif ev and ev["type"] == "demoContinue":
            resp = {"items": demo_continue(sess, origin), "state": T.snapshot(st)}
        elif ev:
            resp = CHAT.event_turn(sess, turn_id, ev, {}, server)
        else:
            resp = CHAT.text_turn(sess, turn_id, message, {})
            if resp.get("action"):
                # The page scrolls + highlights when it receives the lead-in in this reply; nothing comes back to confirm it.
                # The result therefore lists the cards the page has and says the highlight is not confirmed (agent prompt rule).
                cont = CHAT.action_result(sess, resp["action"]["id"], True,
                                          {"visible": D.PAGE_RESORTS, "note": "studio_widget: the page scrolls to these cards and highlights them when this reply arrives; the highlight is not confirmed back"})
                resp["items"] = resp["items"] + cont.get("items", [])
    except CHAT.ChatError as e:
        return 409 if e.error == "turn_in_flight" else 400, {"error": e.error}
    if resp.get("error"):
        sys.stderr.write("%s studio %s turn error %s (%s)\n" % (time.strftime("%H:%M:%S"), sess.sid[:8], resp["error"], resp.get("reason", "")))
    sync_pending(sess)
    text = reply_text(resp.get("items", []), sess.state, origin)
    if not text:                                           # an empty turn (e.g. provider error with no item): the stage's own line
        fb = T.fallback(sess.state)
        text = reply_text(T._items(fb) if hasattr(T, "_items") else [fb], sess.state, origin) or S["live"]["unavailable"]
    payload = {"reply": text}
    if not resp.get("error"):                              # a failed turn is not replayed: Studio's retry gets a fresh attempt
        with _lock:
            _recent[sess.sid] = (message, payload, time.time())
    return 200, payload
