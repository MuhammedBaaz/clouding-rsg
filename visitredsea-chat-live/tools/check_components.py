# -*- coding: utf-8 -*-
"""Local checks for the widget's calendar and guest-form components on the bridge side (no agent, no network):

  - the calendar's line and the form's line are recognised as deterministic events;
  - the dates step and the details step emit the [calendar: dates] / [form: guest_details] blocks;
  - one form submission saves the details, records the request and lands on the review;
  - a rejected field sends the form back with error lines; an unclear first name asks for the title in the block.

Run from the app folder:  python tools/check_components.py
"""
import os
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMP = tempfile.mkdtemp(prefix="rsg-components-check-")
os.environ["LOYALTY_STORE"] = os.path.join(TMP, "loyalty.json")
os.environ.setdefault("LIVE_AGENT_TEST_DOUBLE", "1")
sys.path.insert(0, ROOT)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from agent import state as T, studio_bridge as SB   # noqa: E402

ORIGIN = "http://127.0.0.1:8100"
S, B = T.S, T.B
FAILS = []


def check(cond, label):
    print(("ok   " if cond else "FAIL ") + label)
    if not cond:
        FAILS.append(label)


def section(t):
    print("\n== " + t)


def session_to(stage_fn):
    sid = SB.start_session([])
    sess = SB.CHAT.get_session(sid)
    st = sess.state
    st["channel"] = "studio_widget"
    stage_fn(st)
    return sess


def route_to_dates(st, name="محمد"):
    for f in (lambda: T.set_name(st, name), lambda: T.show_suggestions(st), lambda: T.choose_resort(st, "Shebara"),
              lambda: T.choose_villa(st, B["villa"]["name"]), lambda: T.set_party(st, 2, 0)):
        r = f()
        assert r.ok, r.result
    assert st["stage"] == "dates"


def route_to_guest(st, name="محمد"):
    route_to_dates(st, name)
    for f in (lambda: T.set_dates(st, "2026-10-23", "2026-10-25"), lambda: T.approve_stay(st), lambda: T.set_mode(st, "By Plane"),
              lambda: T.set_airports(st, B["transport"]["legs"][0]["from"], B["transport"]["legs"][1]["to"]),
              lambda: T.approve_transfers(st), lambda: T.defer_experiences(st), lambda: T.account_mode(st, "guest")):
        r = f()
        assert r.ok, r.result
    assert st["stage"] == "guest"


# ------------------------------------------------------------------ 1. parsing
section("submission lines are recognised")
ev = SB.event_for("الوصول 23 أكتوبر 2026 والمغادرة 25 أكتوبر 2026، ليلتان.")
check(ev == {"type": "dates", "a": "2026-10-23", "b": "2026-10-25"}, "calendar line → dates event with ISO dates")
ev = SB.event_for("الوصول 5 يناير 2027 والمغادرة 12 يناير 2027، 7 ليالٍ.")
check(ev == {"type": "dates", "a": "2027-01-05", "b": "2027-01-12"}, "single-digit day and another month parse")
line = "بياناتي: اللقب السيد؛ الاسم الأول محمد؛ اسم العائلة باز؛ البريد mohammed.baz.demo@example.com؛ الجوال +966 551234567؛ المرافق نورة الحربي؛ طلبات: تسجيل وصول متأخر"
ev = SB.event_for(line)
check(ev and ev["type"] == "guestForm", "form line → guestForm event")
f = ev["fields"]
check(f.get("title") == "السيد" and f.get("first_name") == "محمد" and f.get("family_name") == "باز", "title and names parsed")
check(f.get("email") == "mohammed.baz.demo@example.com" and f.get("mobile_code") == "+966" and f.get("mobile") == "551234567", "e-mail, code and mobile parsed")
check(f.get("companion_first_name") == "نورة" and f.get("companion_family_name") == "الحربي" and f.get("requests") == "تسجيل وصول متأخر", "companion and request parsed")
ev = SB.event_for("بياناتي: اللقب السيدة؛ الاسم الأول نورة؛ اسم العائلة الحربي؛ البريد n@example.com؛ الجوال +971 501234567؛ المرافق -؛ طلبات: لا")
check("companion_first_name" not in ev["fields"] and "requests" not in ev["fields"] and ev["fields"]["mobile_code"] == "+971", "«-» companion and «لا» request are omitted")

# ------------------------------------------------------------------ 2. blocks
section("blocks emitted at the right steps")
sess = session_to(route_to_dates)
txt = SB.reply_text(T._items(S["party"]["ok"]), sess.state, ORIGIN)
check("[calendar: dates]" in txt and "min_date = 2026-10-23" in txt and "initial_check_in = -" in txt and "initial_check_out = -" in txt and "submit_label = اعتماد التواريخ" in txt, "dates step: calendar block, nothing pre-selected (owner, 12 Nov)")
check(S["live"]["datesWidget"] not in txt, "the typed-dates sentence is gone from the widget reply")
r = T.set_dates(sess.state, "2026-12-01", "2026-12-03")
txt = SB.reply_text(T._items(r.items), sess.state, ORIGIN)
check((not r.ok) and "[calendar: dates]" in txt and "للتواريخ من" in txt, "other dates: the needs-confirming reply carries the calendar again")
r = T.set_dates(sess.state, "2026-10-23", "2026-10-25")
txt = SB.reply_text(T._items(r.items), sess.state, ORIGIN)
check(r.ok and "[card: stay_summary]" in txt and "[calendar: dates]" not in txt, "priced dates: stay summary, no calendar")

sess = session_to(route_to_guest)
txt = SB.reply_text(T._items(S["account"]["guest"]), sess.state, ORIGIN)
check("[form: guest_details]" in txt and "title_value = السيد" in txt and "title_ask = false" in txt and "first_name = محمد" in txt and "mobile_code = +966" in txt, "guest step: form block prefilled with the name and the resolved title")
check(txt.startswith(S["live"]["formLead"].replace("{name}", "محمد")), "lead-in is the form sentence, not the website's")
sess2 = session_to(lambda st: route_to_guest(st, "نور"))
txt = SB.reply_text(T._items(S["account"]["guest"]), sess2.state, ORIGIN)
check("title_value = -" in txt and "title_ask = true" in txt and ("title_question = " + S["live"]["titleAsk"]) in txt, "unclear first name: the block asks for the title")

# ------------------------------------------------------------------ 3. submission flow
section("one submission lands on the review")
st = sess.state
status, payload = SB.handle_message(sess.sid, line, None, ORIGIN)
check(status == 200 and st["stage"] == "review", "form line → details saved, request recorded, stage review")
check("[card: review]" in payload["reply"] and "السيد محمد باز" in payload["reply"], "reply is the review card with title and names")
check(st["guest"]["requests"] == "تسجيل وصول متأخر" and st["guest"]["guest2First"] == "نورة", "request and companion saved")

section("a rejected field sends the form back")
sess3 = session_to(route_to_guest)
bad = "بياناتي: اللقب السيد؛ الاسم الأول محمد؛ اسم العائلة باز؛ البريد not-an-email؛ الجوال +966 551234567؛ المرافق -؛ طلبات: لا"
status, payload = SB.handle_message(sess3.sid, bad, None, ORIGIN)
rep = payload["reply"]
check(sess3.state["stage"] == "guest" and "[form: guest_details]" in rep and "error_field = email" in rep, "invalid e-mail: stage unchanged, form block with error_field = email")
check("family_name = باز" in rep and "first_name = محمد" in rep, "the saved values are prefilled in the returned form")
check("error_text = -" not in rep, "the rejection sentence is carried as error_text")
good = bad.replace("not-an-email", "m@example.com")
status, payload = SB.handle_message(sess3.sid, good, None, ORIGIN)
check(sess3.state["stage"] == "review" and "[card: review]" in payload["reply"], "corrected line → review")

section("edit at the review re-sends the prefilled form")
status, payload = SB.handle_message(sess3.sid, "تعديل البيانات", None, ORIGIN)
rep = payload["reply"]
check("[form: guest_details]" in rep and "email = m@example.com" in rep and "title_value = السيد" in rep, "«تعديل البيانات» → form block prefilled from the saved details")
status, payload = SB.handle_message(sess3.sid, good.replace("m@example.com", "m2@example.com"), None, ORIGIN)
check(sess3.state["guest"]["email"] == "m2@example.com" and "[card: review]" in payload["reply"], "resubmission updates the review")

print("\n%d failure(s)" % len(FAILS))
sys.exit(1 if FAILS else 0)
