# -*- coding: utf-8 -*-
"""Local checks for the website views' link to the conversation (18 Nov 2026; no agent, no network):

  - a Studio session is found by the widget's visitor id; an unknown id finds nothing;
  - each reply that calls for a website view raises view_seq once, and the view is offered only at its own steps;
  - prices appear only after the step that establishes them (no price at the villa step);
  - the guest-form draft is kept beside the conversation, refused outside the guest steps;
  - a rejected form field reaches the page, and a corrected request is kept when the form is resubmitted at the review.

Run from the app folder:  python tools/check_page_views.py
"""
import os
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TMP = tempfile.mkdtemp(prefix="rsg-page-views-check-")
os.environ["LOYALTY_STORE"] = os.path.join(TMP, "loyalty.json")
os.environ["AGENT_SPEND_LEDGER"] = os.path.join(TMP, "spend.json")
os.environ["LIVE_AGENT_TEST_DOUBLE"] = "1"
sys.path.insert(0, ROOT)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from agent import state as T, studio_bridge as SB   # noqa: E402
from agent.provider import make_provider             # noqa: E402

SB.CHAT.PROVIDER = make_provider()                   # the keyword test double (LIVE_AGENT_TEST_DOUBLE=1 above), as server.py does
ORIGIN = "http://127.0.0.1:8100"
B = T.B
FAILS = []


def check(cond, label):
    print(("ok   " if cond else "FAIL ") + label)
    if not cond:
        FAILS.append(label)


def say(sid, text):
    status, payload = SB.handle_message(sid, text, None, ORIGIN)
    assert status == 200, (status, payload)
    return payload["reply"]


VID = "vi_00000000-0000-4000-8000-000000000001"
sid = SB.start_session([{"name": "visitor_id", "value": VID}, {"name": "channel_slug", "value": "x"}, {"name": "current_page_context", "value": ""}])
st = SB.CHAT.get_session(sid).state

print("== visitor link")
check(SB.page_state(VID) and SB.page_state(VID)["stage"] == "name", "the visitor id finds its conversation")
check(SB.page_state("vi_unknown") is None and SB.page_state("") is None, "an unknown or empty id finds nothing")

print("\n== resort and villa steps")
say(sid, "أنا محمد")
say(sid, "أبي أحجز إجازة في منتجع")
say(sid, "نختار Shebara.")
p = SB.page_state(VID)
check(p["stage"] == "villa" and p["view"] == "villas" and p["viewSeq"] == 1, "Shebara chosen: the villas view is offered (seq 1)")
check(p["catalog"] and len(p["catalog"]["villas"]) == len(T.D.VILLAS), "the villa catalogue comes with the state at the villa step")
check(not p["prices"] and "SAR" not in str(p), "no price, nights or tax anywhere in the state at the villa step")
say(sid, "أختار Two Bedroom Beach Villa على Villa Flat Rate.")
p = SB.page_state(VID)
check(p["stage"] == "villa" and p["viewSeq"] == 1, "an unpriced villa keeps the villa step and does not offer the view twice")
say(sid, "أختار %s على Villa Flat Rate." % B["villa"]["name"])
p = SB.page_state(VID)
check(p["stage"] == "party" and p["view"] is None and p["villaAr"] == B["villa"]["nameAr"], "the priced villa moves on to the party; the villa view closes (read-only)")
check(not p["prices"], "still no price at the party step")

print("\n== dates, quote and transport")
say(sid, "أنا وزوجتي شخصين")
say(sid, "الوصول 23 أكتوبر 2026 والمغادرة 25 أكتوبر 2026، ليلتان.")
p = SB.page_state(VID)
check(p["stage"] == "approve1" and p["prices"].get("stay") == "SAR 28,980.00" and "total" not in p["prices"], "after the dates: the stay quote, no total yet")
check(p["dates"].startswith("الجمعة 23 أكتوبر 2026") and p["party"], "dates and party are in the state")
say(sid, "مناسب، نكمل")
say(sid, "بالطائرة")
p = SB.page_state(VID)
check(p["stage"] == "airports" and p["view"] == "transport", "airports step: the transport view is offered")
seq = p["viewSeq"]
say(sid, "مطار الوصول: مطار الوجه المحلي, مطار المغادرة: مطار ينبع")
p = SB.page_state(VID)
check(p["stage"] == "airports" and not p["transportSet"], "an unpriced airport pair keeps the airports step")
say(sid, "مطار الوصول: مطار ينبع, مطار المغادرة: مطار البحر الأحمر الدولي – RSIA")
p = SB.page_state(VID)
check(p["stage"] == "approve2" and p["view"] == "transport" and p["viewSeq"] == seq, "the priced pair: legs and totals, same view (not offered twice)")
check(p["prices"].get("transfers") == "SAR 4,813.90" and p["prices"].get("total") == "SAR 33,793.90", "transfers and total appear after the airports")
say(sid, "اعتمد ونكمل")
rep = say(sid, "مهتم بتجربة التجديف باللوح واقفًا")
p = SB.page_state(VID)
check(p["stage"] == "activities" and "بكل سرور" in rep and p["prices"].get("total") == "SAR 33,793.90", "activity card interest: the step stays, the rule's reply, nothing added to the total")
say(sid, "نختار عند الوصول")
p = SB.page_state(VID)
check(p["stage"] == "account" and p["view"] is None, "after transport: the transport view is read-only")

print("\n== guest details, draft and review")
check(SB.save_draft(VID, {"email": "x@example.com"}) == 409, "a draft is refused before the guest step")
say(sid, "متابعة كضيف جديد")
p = SB.page_state(VID)
check(p["stage"] == "guest" and p["view"] == "guest", "guest step: the guest-details view is offered")
check(p["guest"]["firstName"] == "محمد" and p["guest"]["title"] == "السيد" and p["guest"]["mobileCode"] == "+966", "prefill: name from the chat, inferred title, default code")
check(SB.save_draft(VID, {"familyName": "باز", "email": "m@example.com", "bogus": "x"}) == 200, "a draft is kept at the guest step")
p = SB.page_state(VID)
check(p["guest"]["familyName"] == "باز" and p["guest"]["email"] == "m@example.com" and "bogus" not in p["guest"], "the draft comes back in the prefill (unknown keys dropped)")
check(SB.save_draft("vi_unknown", {"email": "a@b.c"}) == 404, "an unknown visitor cannot write a draft")
bad = "بياناتي: اللقب السيد؛ الاسم الأول محمد؛ اسم العائلة باز؛ البريد not-an-email؛ الجوال +966 551234567؛ المرافق نورة الحربي؛ طلبات: لا"
say(sid, bad)
p = SB.page_state(VID)
check(p["stage"] == "guest" and p["formError"] and p["formError"]["field"] == "email", "a rejected e-mail reaches the page as formError")
good = bad.replace("not-an-email", "m@example.com").replace("طلبات: لا", "طلبات: تسجيل وصول متأخر")
say(sid, good)
p = SB.page_state(VID)
check(p["stage"] == "review" and p["view"] == "review" and p["formError"] is None, "corrected form: the review view is offered, the error cleared")
check(p["prices"].get("payable") == "SAR 33,793.90" and p["guestEditable"], "review: payable amount, guest details still editable")
say(sid, good.replace("تسجيل وصول متأخر", "سرير إضافي للأطفال"))
p = SB.page_state(VID)
check(p["stage"] == "review" and p["guest"]["requests"] == "سرير إضافي للأطفال", "a changed request is kept when the form is resubmitted at the review")
say(sid, "البيانات صحيحة، نكمل")
p = SB.page_state(VID)
check(p["stage"] == "payment" and p["view"] is None and p["guestEditable"], "payment: no view offered; guest details editable until payment")

print("\n== comparison (agent tool through the test double) and a new chat")
VID2 = "vi_00000000-0000-4000-8000-000000000002"
sid2 = SB.start_session([{"name": "visitor_id", "value": VID2}])
say(sid2, "أنا نورة")
say(sid2, "محتارة بين شبارة وديزرت روك")
p = SB.page_state(VID2)
check(p["stage"] == "resort" and p["view"] == "compare", "an undecided guest: the comparison view is offered")
sid3 = SB.start_session([{"name": "visitor_id", "value": VID2}])
check(SB.page_state(VID2)["stage"] == "name", "a restarted conversation for the same visitor replaces the old one")

print("\n%d failure(s)" % len(FAILS))
sys.exit(1 if FAILS else 0)
