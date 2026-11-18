# -*- coding: utf-8 -*-
"""Local checks for the widget changes of 12 November 2026 (no agent, no network):

  - the villa selection block carries no price, no nights and no tax note, and keeps the party and the dates;
  - the review lines in the widget no longer ask for the terms, and «البيانات صحيحة، نكمل» goes straight to the payment link;
  - the website channel still requires its terms checkbox (unchanged);
  - the PDF button's payload (the signed trip link) is recognised when it reaches the bridge.

Run from the app folder:  python tools/check_widget_flow.py
"""
import os
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMP = tempfile.mkdtemp(prefix="rsg-widget-flow-check-")
os.environ["LOYALTY_STORE"] = os.path.join(TMP, "loyalty.json")
os.environ.setdefault("LIVE_AGENT_TEST_DOUBLE", "1")
sys.path.insert(0, ROOT)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from agent import state as T, studio_bridge as SB   # noqa: E402

ORIGIN = "http://127.0.0.1:8100"
S, B = T.S, T.B
FAILS = []
TERMS_WORDS = ("الشروط", "الأحكام", "سياسة الخصوصية", "وافقت")


def check(cond, label):
    print(("ok   " if cond else "FAIL ") + label)
    if not cond:
        FAILS.append(label)


def section(t):
    print("\n== " + t)


def widget_session(stage_fn):
    sid = SB.start_session([])
    sess = SB.CHAT.get_session(sid)
    stage_fn(sess.state)
    return sess


def route_to_villas(st):
    for f in (lambda: T.set_name(st, "محمد"), lambda: T.show_suggestions(st), lambda: T.choose_resort(st, "Shebara")):
        r = f()
        assert r.ok, r.result


def route_to_guest(st):
    route_to_villas(st)
    for f in (lambda: T.choose_villa(st, B["villa"]["name"]), lambda: T.set_party(st, 2, 0), lambda: T.set_dates(st, "2026-10-23", "2026-10-25"),
              lambda: T.approve_stay(st), lambda: T.set_mode(st, "By Plane"),
              lambda: T.set_airports(st, B["transport"]["legs"][0]["from"], B["transport"]["legs"][1]["to"]),
              lambda: T.approve_transfers(st), lambda: T.defer_experiences(st), lambda: T.account_mode(st, "guest")):
        r = f()
        assert r.ok, r.result
    assert st["stage"] == "guest"


LINE = "بياناتي: اللقب السيد؛ الاسم الأول محمد؛ اسم العائلة باز؛ البريد mohammed.baz.demo@example.com؛ الجوال +966 551234567؛ المرافق نورة الحربي؛ طلبات: تسجيل وصول متأخر"

# ------------------------------------------------------------------ 1. villa selection card
section("villa selection block")
sess = widget_session(route_to_villas)
blk = SB.card_block("villas", sess.state, ORIGIN)
first = blk.split("\n\n")[1]
check(blk.startswith("[cards: villas]") and blk.count("button = اختيار -> ") == len(T.D.VILLAS), "one record per villa, each with the «اختيار» button")
check("SAR" not in blk and "price" not in blk, "no price and no price key in any record")
check("ليلتان" not in blk and B["rate"]["taxNoteAr"] not in blk, "no nights and no «شامل جميع الضرائب»")
check("stay" not in blk and "شخصان بالغان" not in blk and "أكتوبر" not in blk, "no party or dates line on any villa (owner, 12 Nov)")
check("name_ar = " + B["villa"]["nameAr"] in first and "occupancy = " in first and "facts = " in first, "name, occupancy and features kept")
check(blk.count("rate_badge = Villa Flat Rate") == 1 and blk.count("rate_badge = -") == len(T.D.VILLAS) - 1, "only the priced villa carries the rate badge")
r = T.choose_villa(sess.state, B["villa"]["name"])
for f in (lambda: T.set_party(sess.state, 2, 0), lambda: T.set_dates(sess.state, "2026-10-23", "2026-10-25")):
    r = f()
txt = SB.reply_text(T._items(r.items), sess.state, ORIGIN)
check("[card: stay_summary]" in txt and "SAR 28,980.00" in txt and B["rate"]["taxNoteAr"] in txt, "the stay summary still carries the amount and the tax note")

# ------------------------------------------------------------------ 2. review → payment without terms
section("review to payment in the widget")
sess = widget_session(route_to_guest)
status, payload = SB.handle_message(sess.sid, LINE, None, ORIGIN)
rep = payload["reply"]
lead = rep.split("[card: review]")[0]
check(status == 200 and sess.state["stage"] == "review" and "[card: review]" in rep, "form line → review card")
check(not any(w in lead for w in TERMS_WORDS) and "التحقق من البريد" not in lead, "review lead-in asks for no terms and no e-mail check")
check(S["live"]["reviewNextWidget"] in lead, "review lead-in: " + lead.strip())
check("SAR 33,793.90" in rep, "the review keeps the totals")
status, payload = SB.handle_message(sess.sid, "البيانات صحيحة، نكمل", None, ORIGIN)
rep = payload["reply"]
check(status == 200 and sess.state["stage"] == "payment", "«البيانات صحيحة، نكمل» → stage payment")
check(B["checkoutUrl"] in rep and not any(w in rep for w in TERMS_WORDS), "the reply is the payment link, no terms reminder:\n     " + rep.replace("\n", "\n     "))
check(getattr(sess, "pending_completion", None), "the payment link armed the demo completion")

section("review lines that offered the terms, as the widget sends them")
st = sess.state
for key, text in (("review.updated", S["review"]["updated"][0]["text"]), ("review.fallback", S["review"]["fallback"]["text"]),
                  ("live.redeemNone", S["live"]["redeemNone"]), ("live.redeemCleared", S["live"]["redeemCleared"]),
                  ("live.redeemApplied", S["live"]["redeemApplied"]), ("live.cancelled", S["live"]["cancelled"])):
    out = SB.widget_text(text, st)
    check(not any(w in out for w in TERMS_WORDS) and S["live"]["reviewNextWidget"] in out, key + " → «…" + out[-40:] + "»")

section("the website channel keeps its checkbox")
sess = widget_session(route_to_guest)
sess.state["channel"] = "website"
SB.handle_message(sess.sid, LINE, None, ORIGIN)
r = T.confirm(sess.state, False)
check((not r.ok) and getattr(r, "after", "") == "termsError" and sess.state["stage"] == "review", "website without the tick: terms reminder, stage review")
r = T.confirm(sess.state, True)
check(r.ok and sess.state["stage"] == "payment", "website with the tick: payment")

# ------------------------------------------------------------------ 3. PDF payload
section("PDF button payload")
SB.PAGE_ORIGIN = ORIGIN                                  # server.py sets it at start
url = SB.pdf_url("RSGD-ABC123")
check(SB.event_for(url) == {"type": "pdf"}, "the signed trip link as a message → pdf event")
check(SB.event_for("تحميل PDF") == {"type": "pdf"}, "the label still works")
check(SB.event_for("https://example.com/trip.html?b=x&t=zz") is None, "a non-hex token is not taken for the link")

print("\n%d failure(s)" % len(FAILS))
sys.exit(1 if FAILS else 0)
