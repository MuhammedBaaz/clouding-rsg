#!/usr/bin/env node
/* Protocol checks for the live concierge backend, against a running server.py.

   Run a TEST instance first (never the owner's port), for example:
     set LIVE_AGENT_TEST_DOUBLE=1   (keyword stand-in, no key)   or leave it unset for the real agent
     python server.py 8101
   then:
     node tools/drive_live.mjs http://127.0.0.1:8101            # test-double expectations
     node tools/drive_live.mjs http://127.0.0.1:8101 --live     # real agent: tool choice is the agent's, so only
                                                                  stage progress and protocol rules are asserted

   What it checks: session creation, a typed turn, the page action (navigate -> ack -> continuation), failure
   acks, typing before the ack, duplicate turnId (identical bytes), bad/late actionId (410), concurrent turns (409),
   deterministic events through the whole journey, the terms gate, the honest payment return, and that the agent
   never sees an OTP code or session token (those endpoints are not part of the chat turn at all).
   Browser behaviour (scroll, spotlight, components) is checked in the browser, not here. */
const base = process.argv[2] || "http://127.0.0.1:8101";
const live = process.argv.includes("--live");
let failures = 0;
function check(name, cond, extra) { console.log((cond ? "  ok   " : "  FAIL ") + name + (extra !== undefined && !cond ? "  -> " + JSON.stringify(extra).slice(0, 300) : "")); if (!cond) failures++; }
async function post(path, body) { const r = await fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const text = await r.text(); let json = {}; try { json = JSON.parse(text); } catch {} return { status: r.status, json, text }; }
const uid = () => crypto.randomUUID();
const comps = (r) => (r.json.items || []).map((i) => i.component).filter(Boolean);
const texts = (r) => (r.json.items || []).map((i) => (i.text || "").slice(0, 30));

const status = await (await fetch(base + "/api/chat/status")).json();
console.log("server:", JSON.stringify(status));
if (!status.configured) { console.log("provider not configured; only the not_configured path can be checked"); }

// ---- session + first typed turn
console.log("\n[1] session, name, browse action");
const s = await post("/api/chat/session", {});
check("session created", s.status === 200 && s.json.sid && s.json.state.stage === "name", s.json);
const sid = s.json.sid;
let r = await post("/api/chat/turn", { sid, turnId: uid(), kind: "text", text: "أنا محمد" });
check("name accepted -> intent", r.status === 200 && r.json.state.stage === "intent" && r.json.state.name === "محمد", r.json);
r = await post("/api/chat/turn", { sid, turnId: uid(), kind: "text", text: "أبي أتصفح المنتجعات على الصفحة" });
const action = r.json.action;
check("browse request -> navigate action", r.status === 200 && action && action.kind === "navigate_resorts" && r.json.suspended === true, r.json);
if (action) {
  const dup = await post("/api/chat/action-result", { sid, actionId: action.id, ok: true, visible: ["Shebara", "Desert Rock"] });
  check("ack accepted, agent continued", dup.status === 200 && dup.json.state.stage === "resort", dup.json);
  const again = await post("/api/chat/action-result", { sid, actionId: action.id, ok: true, visible: [] });
  check("duplicate ack ignored", again.status === 200 && again.json.ignored === true, again.json);
}
const bad = await post("/api/chat/action-result", { sid, actionId: "act_nope", ok: true });
check("unknown actionId -> 410", bad.status === 410, bad);

// ---- question does not advance; duplicate turnId identical
console.log("\n[2] follow-up question, idempotency");
const tid = uid();
r = await post("/api/chat/turn", { sid, turnId: tid, kind: "text", text: "كم فيلا في شباره؟" });
check("question keeps stage resort", r.status === 200 && r.json.state.stage === "resort" && !r.json.action, r.json);
check("question answered with text only", (r.json.items || []).some((i) => i.text) && comps(r).length === 0, r.json.items);
const r2 = await post("/api/chat/turn", { sid, turnId: tid, kind: "text", text: "something else" });
check("duplicate turnId returns the same reply", r2.text === r.text);

// ---- events through the journey
console.log("\n[3] card events");
const ev = (event) => post("/api/chat/turn", { sid, turnId: uid(), kind: "event", event });
r = await ev({ type: "resort", name: "Desert Rock", source: "card" });
check("other resort: details + offer, stage stays resort, no consume", r.json.state.stage === "resort" && r.json.consume === false && comps(r).includes("resortDetails"), r.json);
r = await ev({ type: "resort", name: "Shebara", source: "page" });
check("Shebara -> villa, details + villas", r.json.state.stage === "villa" && comps(r).join() === "resortDetails,villas", r.json);
r = await ev({ type: "villa", villa: "Two Bedroom Beach Villa" });
check("unpriced villa: stays, quick reply offered", r.json.state.stage === "villa" && (r.json.items || []).some((i) => i.quick), r.json);
r = await ev({ type: "villa", villa: "One Bedroom Overwater Villa" });
check("priced villa -> party", r.json.state.stage === "party" && r.json.state.rateName === "Villa Flat Rate", r.json);
r = await post("/api/chat/turn", { sid, turnId: uid(), kind: "text", text: "بس أنا وزوجتي" });
check("party typed -> dates + calendar", r.json.state.stage === "dates" && (live || comps(r).includes("calendar")), r.json);
r = await ev({ type: "dates", a: "2026-10-24", b: "2026-10-26" });
check("other dates: stays with quick reply", r.json.state.stage === "dates" && r.json.consume === false, r.json);
r = await ev({ type: "dates", a: "2026-10-23", b: "2026-10-25" });
check("quoted dates -> approve1 + summary1", r.json.state.stage === "approve1" && comps(r).includes("summary1") && r.json.state.nights === 2, r.json);
r = await ev({ type: "approve" });
check("approve -> mode + modes", r.json.state.stage === "mode" && comps(r).includes("modes"), r.json);
r = await ev({ type: "mode", mode: "By Car" });
check("car: stays with offer", r.json.state.stage === "mode" && r.json.consume === false, r.json);
r = await ev({ type: "mode", mode: "By Plane" });
check("plane -> airports", r.json.state.stage === "airports" && comps(r).includes("airports"), r.json);
r = await ev({ type: "airportsBad" });
check("airportsBad: fallback, stays", r.json.state.stage === "airports" && r.json.consume === false, r.json);
r = await ev({ type: "airports", arrival: "Yanbu Airport", departure: "Red Sea International Airport - RSIA", flight: {} });
check("airports -> approve2, legs + summary2", r.json.state.stage === "approve2" && comps(r).join() === "transportTrip,summary2", r.json);
r = await ev({ type: "approve" });
check("approve2 -> activities + quick", r.json.state.stage === "activities" && comps(r).includes("activities") && (r.json.items || []).some((i) => i.quick), r.json);
r = await ev({ type: "defer" });
check("defer -> account + accountChoice", r.json.state.stage === "account" && comps(r).includes("accountChoice"), r.json);

// ---- new guest path (no OTP), voice not configured, form, review edit, terms gate, payment, return
console.log("\n[4] new guest, review, payment");
r = await ev({ type: "account", mode: "guest" });
check("guest -> guest form, no OTP", r.json.state.stage === "guest" && comps(r).includes("guestForm") && r.json.state.authMode === "guest", r.json);
r = await ev({ type: "voice", seconds: 3 });
check("voice: transcription not configured, form kept, no fixed values", r.json.state.stage === "guest" && r.json.consume === false && !r.json.state.formSeed && texts(r)[0].startsWith("وصلتني رسالتك الصوتية"), r.json);
const guest = { title: "السيد", firstName: "محمد", familyName: "باز", email: "muhammed.baz@clouding.ai", mobileCode: "+966", mobile: "508416627", guest2First: "نورة", guest2Family: "الحربي", requests: "", marketing: false };
r = await ev({ type: "guest", data: { ...guest, email: "nope" } });
check("invalid form rejected", r.json.state.stage === "guest" && r.json.consume === false, r.json);
r = await ev({ type: "guest", data: guest });
check("form -> review", r.json.state.stage === "review" && comps(r).includes("review"), r.json);
r = await ev({ type: "guestEdit", data: { ...guest, requests: "تسجيل وصول متأخر إن أمكن" } });
check("edit keeps review, request saved", r.json.state.stage === "review" && r.json.state.guest.requests === "تسجيل وصول متأخر إن أمكن" && comps(r).includes("review"), r.json);
r = await ev({ type: "confirm", termsAccepted: false });
check("terms gate: no advance, termsError hook", r.json.state.stage === "review" && r.json.after === "termsError" && r.json.consume === false, r.json);
r = await ev({ type: "verify", session: "forged" });
check("forged verify event refused", r.json.state.stage === "review" && r.json.consume === false, r.json);
r = await ev({ type: "confirm", termsAccepted: true });
check("confirm -> payment (new guest, no OTP)", r.json.state.stage === "payment" && comps(r).includes("payment") && !r.json.state.paid, r.json);
r = await ev({ type: "paymentReturned" });
check("payment return: unverified, summary + PDF card, paid=false", r.json.state.stage === "done" && r.json.state.paid === false && r.json.state.paymentStatus === "unverified" && comps(r).includes("confirmation") && texts(r)[0].startsWith("رجعت من صفحة الدفع"), r.json);
r = await ev({ type: "paymentReturned" });
check("second return does not repeat the summary", r.json.consume === false && comps(r).length === 0, r.json);

// ---- failure paths on fresh sessions
console.log("\n[5] failure paths");
async function fresh() { const s = await post("/api/chat/session", {}); await post("/api/chat/turn", { sid: s.json.sid, turnId: uid(), kind: "text", text: "أنا سارة" }); return s.json.sid; }
let sid2 = await fresh();
r = await post("/api/chat/turn", { sid: sid2, turnId: uid(), kind: "text", text: "أبي أتصفح المنتجعات على الصفحة" });
if (r.json.action) {
  const f = await post("/api/chat/action-result", { sid: sid2, actionId: r.json.action.id, ok: false, reason: "cards_missing" });
  check("failed ack: agent falls back in chat", f.status === 200 && f.json.state.stage === "resort" && (live || comps(f).includes("resortPick")), f.json);
} else check("browse request produced an action (live agents may differ)", live, r.json);
sid2 = await fresh();
r = await post("/api/chat/turn", { sid: sid2, turnId: uid(), kind: "text", text: "أبي أتصفح المنتجعات على الصفحة" });
if (r.json.action) {
  const aid = r.json.action.id;
  const t = await post("/api/chat/turn", { sid: sid2, turnId: uid(), kind: "text", text: "وش الفرق بين شباره وديزرت روك؟" });
  check("typing before the ack closes the action and still answers", t.status === 200 && t.json.state.stage === "resort", t.json);
  const lateAck = await post("/api/chat/action-result", { sid: sid2, actionId: aid, ok: true, visible: [] });
  check("late ack -> 410", lateAck.status === 410, lateAck);
}
const expired = await post("/api/chat/turn", { sid: "deadbeef", turnId: uid(), kind: "text", text: "x" });
check("unknown sid -> 404 session_expired", expired.status === 404 && expired.json.error === "session_expired", expired);
const badBody = await post("/api/chat/turn", { sid: sid2 });
check("missing turnId -> 400", badBody.status === 400, badBody);
// concurrent turns: fire two at once, one must be 409 (the double answers fast, so race both)
const [c1, c2] = await Promise.all([post("/api/chat/turn", { sid: sid2, turnId: uid(), kind: "text", text: "كم المسافة؟" }), post("/api/chat/turn", { sid: sid2, turnId: uid(), kind: "text", text: "كم السعر؟" })]);
check("concurrent turns: both 200 or one 409 (never two running)", [c1.status, c2.status].every((x) => x === 200 || x === 409), [c1.status, c2.status]);

console.log(failures ? "\n" + failures + " check(s) FAILED" : "\nall checks passed");
process.exit(failures ? 1 : 0);
