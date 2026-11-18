# -*- coding: utf-8 -*-
"""Local fixture checks (no agent, no network, no paid turn) for Round 8:

  1. the loyalty closing and trip card quote only the award of the current booking, even for a returning guest;
  2. repeating the completion, or completing the same quote again from a new session, never credits points twice;
  3. the title follows the first name (محمد -> السيد, نورة -> السيدة), an unclear name gets one question, and the
     guest's own answer or correction lands in the booking review.

Run from the app folder:  python tools/check_loyalty_title.py
A temporary loyalty store is used; private/loyalty.json is never touched.
"""
import io
import os
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMP = tempfile.mkdtemp(prefix="rsg-loyalty-check-")
os.environ["LOYALTY_STORE"] = os.path.join(TMP, "loyalty.json")
os.environ.setdefault("LIVE_AGENT_TEST_DOUBLE", "1")
sys.path.insert(0, ROOT)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from agent import state as T, loyalty as L, studio_bridge as SB   # noqa: E402

ORIGIN = "http://127.0.0.1:8100"
S = T.S
B = T.B
FAILS = []


def check(cond, label):
    print(("ok   " if cond else "FAIL ") + label)
    if not cond:
        FAILS.append(label)


def to_guest_stage(st, name="محمد"):
    """Drive the real transitions of the priced route up to the guest-details step."""
    st["channel"] = "studio_widget"
    steps = [lambda: T.set_name(st, name), lambda: T.show_suggestions(st), lambda: T.choose_resort(st, "Shebara"),
             lambda: T.choose_villa(st, B["villa"]["name"]), lambda: T.set_party(st, 2, 0), lambda: T.set_dates(st, "2026-10-23", "2026-10-25"),
             lambda: T.approve_stay(st), lambda: T.set_mode(st, "By Plane"),
             lambda: T.set_airports(st, B["transport"]["legs"][0]["from"], B["transport"]["legs"][1]["to"]),
             lambda: T.approve_transfers(st), lambda: T.defer_experiences(st), lambda: T.account_mode(st, "guest")]
    for i, step in enumerate(steps):
        r = step()
        if not r.ok:
            raise SystemExit("route step %d failed at stage %s: %r" % (i, st["stage"], r.result))
    assert st["stage"] == "guest", st["stage"]


def complete_session(email, first="محمد"):
    """A widget session through details, consent and the payment link, then the page's continue signal."""
    sid = SB.start_session([])
    sess = SB.CHAT.get_session(sid)
    st = sess.state
    to_guest_stage(st, first)
    r = T.set_guest_details(st, {"first_name": first, "family_name": "باز", "email": email, "mobile": "0551234567",
                                 "companion_first_name": "نورة", "companion_family_name": "الحربي"})
    assert r.ok and st["stage"] == "requests", r.result
    r = T.record_request(st, None, True)
    assert r.ok and st["stage"] == "review", r.result
    r = T.confirm(st, True)
    assert r.ok and st["stage"] == "payment", r.result
    SB.sync_pending(sess)
    sess.pending_completion["issued"] -= 10          # the page waits 5 s; the fixture does not
    items = SB.demo_continue(sess, ORIGIN)
    return sess, items, SB.reply_text(items, st, ORIGIN)


def section(title):
    print("\n== " + title)


# ------------------------------------------------------------------ 1. returning guest: only this booking's award
section("returning guest sees only this booking's award")
ident = "returning.guest@example.com"
old = L.complete("RSGD-OLD00001", ident, "1250.50", 0, {"note": "an earlier booking from another conversation"})
check(old["earned_points"] == 125 and L.balance(ident) == 125, "fixture: an earlier booking left 125 points on the account")
sess_a, items_a, text_a = complete_session(ident)
expected_award = L.points_for(T.payable_total(sess_a.state))
award_text = "{:,}".format(expected_award)
check(expected_award == 3379, "award for the priced route = 3379 (1 point per SAR 10 of %s)" % T.payable_total(sess_a.state))
check(("كسبت من حجزك هذا %s نقطة ولاء" % award_text) in text_a, "closing quotes this booking's award with a thousands separator")
check("حجوزاتك الجاية" in text_a, "closing says the points can be used on a future booking")
check("رصيد" not in text_a and "3,504" not in text_a and "125" not in text_a, "no running balance anywhere in the guest-facing reply")
check(("points_earned = %s" % award_text) in text_a and "points_balance" not in text_a, "trip card carries points_earned next to amount_due and no balance line")
check("amount_due = %s" % T.money(T.payable_total(sess_a.state)) in text_a, "trip card carries the final payable amount")
check(sess_a.state["loyalty"] == {"earned": 3379, "redeemed": 0}, "state keeps the award (and redeemed) only, no balance, for the PDF")
check(L.balance(ident) == 125 + 3379, "the account total is kept internally for a later redemption (never shown)")

# ------------------------------------------------------------------ 2. no double credit
section("retrying the completion never credits again")
booking_id = sess_a.state["bookingRef"]
again = SB.demo_continue(sess_a, ORIGIN)
check(again is items_a, "the continue signal repeated: same reply, nothing recorded again")
check(L.balance(ident) == 125 + 3379, "balance unchanged after the repeated signal")
sess_b, items_b, text_b = complete_session(ident)
check(sess_b.state["bookingRef"] == booking_id, "a new session completing the same quote maps to the same booking id")
check(L.balance(ident) == 125 + 3379, "balance unchanged after the same booking was completed from a new session")
check(("كسبت من حجزك هذا %s نقطة ولاء" % award_text) in text_b, "the new session still shows this booking's award, not a sum")
store = L._load()
check(len(store["completions"]) == 2, "store holds exactly two completions: the old fixture booking and this one")

# ------------------------------------------------------------------ 3. title from the first name
section("title follows the first name")
st = T.fresh(); to_guest_stage(st, "محمد")
r = T.set_guest_details(st, {"first_name": "محمد", "family_name": "باز", "email": "m@example.com", "mobile": "0551234567"})
check(r.ok and st["guest"]["title"] == "السيد" and st["stage"] == "requests", "محمد -> السيد, no title question, straight to the request question")
check(S["live"]["titleAsk"] not in "".join(i.get("text", "") if isinstance(i, dict) else str(i) for i in T._items(r.items)), "reply for محمد does not contain the title question")

st = T.fresh(); to_guest_stage(st, "نورة")
r = T.set_guest_details(st, {"first_name": "نورة", "family_name": "الحربي", "email": "n@example.com", "mobile": "0551234567"})
check(r.ok and st["guest"]["title"] == "السيدة", "نورة -> السيدة without a question")

st = T.fresh(); to_guest_stage(st, "عبد الله")
r = T.set_guest_details(st, {"first_name": "عبد الله", "family_name": "القحطاني", "email": "a@example.com", "mobile": "0551234567"})
check(r.ok and st["guest"]["title"] == "السيد", "عبد الله (with a space) -> السيد")

section("an unclear name gets one question, and the answer is used")
st = T.fresh(); to_guest_stage(st, "نور")
r = T.set_guest_details(st, {"first_name": "نور", "family_name": "العتيبي", "email": "nour@example.com", "mobile": "0551234567"})
txt = "".join(i.get("text", "") for i in T._items(r.items))
check((not r.ok) and r.result.get("titleQuestion") is True and r.result["missing"] == ["title"], "نور: ok:false with titleQuestion and only the title missing")
check(txt == S["live"]["titleAsk"], "the reply is exactly the one short title question")
check(st["stage"] == "guest" and st.get("guestDraft", {}).get("email") == "nour@example.com", "the other details stay saved in the draft meanwhile")
r = T.set_guest_details(st, {"title": "السيدة"})
check(r.ok and st["guest"]["title"] == "السيدة" and st["stage"] == "requests", "the guest's answer «السيدة» is saved and the flow continues")

st = T.fresh(); to_guest_stage(st, "نور")
r = T.set_guest_details(st, {"first_name": "نور"})
txt = "".join(i.get("text", "") for i in T._items(r.items))
check((not r.ok) and S["live"]["titleAsk"] not in txt and "اللقب" not in txt and "اسم العائلة" in txt, "with other fields still missing, the reply asks for them and not for the title yet")
r = T.set_guest_details(st, {"family_name": "العتيبي", "email": "nour2@example.com", "mobile": "0551234567", "title": "سيد"})
check(r.ok and st["guest"]["title"] == "السيد", "a title given as «سيد» is saved as «السيد»")

section("a correction of the title shows in the review")
st = T.fresh(); to_guest_stage(st, "محمد")
T.set_guest_details(st, {"first_name": "محمد", "family_name": "باز", "email": "m2@example.com", "mobile": "0551234567"})
T.record_request(st, None, True)
check(st["stage"] == "review" and st["guest"]["title"] == "السيد", "review reached with the inferred title")
r = T.set_guest_details(st, {"title": "الأستاذ"})
card = SB.card_block("review", st, ORIGIN)
check(r.ok and st["guest"]["title"] == "الأستاذ" and "الأستاذ محمد باز" in card, "the guest's own title replaces the inferred one and the review card shows it")
check("اللقب" not in S["live"]["guestAsk"], "the details request no longer asks for a title")

print("\n%d failure(s)" % len(FAILS))
sys.exit(1 if FAILS else 0)
