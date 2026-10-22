# Implement the approved Quiet Tide design in V2, with contextual quick replies

The owner has selected the **Quiet Tide / هدوء البحر** design, including its latest aqua, sand, deep teal and photographic component backgrounds. Implement this approved design in the existing V2 concierge and add contextual quick replies at every genuine approval/continuation question. This is an implementation request: inspect the project, make the changes, run appropriate checks and show the working result. Do not stop at a plan or another design proposal.

## Workspace and authoritative references

Workspace root: `D:\Clouding\RSG`

**Implementation target:**

`D:\Clouding\RSG\visitredsea-chat-mockup-v2`

**Approved design reference, including the latest background refinement:**

`D:\Clouding\RSG\design-proposals\quiet-tide`

Read the following before editing:

- Applicable `AGENTS.md` files, if present.
- V2 `README.md`, `js/chat.js`, `data/script.js`, `data/booking.js`, `data/villas.js`, `data/resorts.js`, `css/chat.css`, `css/v2.css`, `js/pdf.js`, and the relevant server interfaces in `server.py`.
- Approved design `HANDOFF.md`, `style.css` **including the later `Quiet Tide backgrounds` block**, `app.js`, `content.json`, `summary.html`, `preview.png`, and the `qa/background-*.png` captures. The browser preview at `http://127.0.0.1:4175/`, when running, is the visual reference.
- The current authoritative brief: `D:\Clouding\RSG\design-briefs\2026-10-20-rich-components\02_ChatGPT_Design_Prompt_EN.md`. Its factual/content requirements take precedence over conflicting legacy comments and wording. Apply the approved background refinement and the quick-reply requirements in this prompt on top of it.

The approved reference is a design/prototype, **not a replacement application backend**. Port its component styling and relevant markup into V2's working application. Preserve V2's existing state machine, recording, server-side email verification, checkout link, data editing and PDF behavior. Do not copy the prototype's visual-only voice/OTP handlers or its Node server into V2 in place of functioning integrations. Do not replace the V2 application with the component gallery or expose studio controls to guests.

Keep V1 (`visitredsea-chat-mockup`), the approved design folder and unrelated marketing-page sections untouched. Preserve existing uncommitted user work. Reuse the current stack and structure; avoid introducing a framework or backend migration merely to implement this UI.

## Apply the selected design completely

Bring **all 15 groups**, including their meaningful states, into V2 with a faithful visual match:

1. Three compact resort suggestions and selected/consumed state.
2. Shebara detail strip.
3. Eight genuine villa types with disclosure, photo-information links and selected rate.
4. Compact single date-range calendar: empty, first date, complete, invalid and confirmed.
5. Accommodation summary and the same pattern updated with transport.
6. Four arrival modes and selection state.
7. One coordinated airport form with optional flight disclosure.
8. Two simple transfer rows and subtotal.
9. Three adjacent image-and-name experience tiles.
10. One coordinated guest/wife form: remembered name, voice-populated except email, manual email, validation and edit/save/cancel.
11. Existing real microphone recorder in the composer, plus permission/error, recording, preview, cancellation and sent-audio states.
12. Final review with editing.
13. Real server-backed email verification and all visual states.
14. Official payment handoff and quiet waiting state.
15. Final information/confirmation card and matching RSG-branded PDF.

Use the **latest** coordinated backgrounds: pale aqua/sand gradients across the compact set; deep teal payment and confirmation; the supplied Shebara photographic layers where present in the approved reference. Keep light, readable field and OTP surfaces. Preserve typography, compact footprints, borders, image crops and text contrast. Do not regress to the older white-only cards or turn the chat into a checkout dashboard.

Use supplied photos, original logos and Fedra fonts. Agent messages/components remain **LEFT**, customer messages **RIGHT**, with Arabic text RTL and numbers, prices, email, phone and codes isolated LTR. All controls are Arabic; all digits are Western `0–9`. Preserve official resort spelling. Keep the recognizable real resort-photo chat backdrop and supplied turtle avatar.

Match the 440–480 px desktop panel and 390 px mobile target; verify a 360 px viewport without horizontal overflow. Keep controls comfortable to tap, labels readable and keyboard focus visible. Do not change the host page's resort-selection behavior: V2 selection happens inside the chat, without page scrolling, dimming, spotlighting or injected page buttons.

## New requirement: quick replies for every approval/continuation decision

Audit the entire conversation, including `ok`, `other`, `fallback`, edited-review and retry branches. Every time the agent genuinely asks the guest to approve, confirm or continue, offer an appropriate **clickable quick reply**. The guest must never have to type “موافق” or “نكمل” merely to pass an approval gate.

Distinguish a real decision from incidental wording. For example, `نحتاج بياناتك وبيانات زوجتك عشان نكمل الحجز` requests form data; it must not gain a generic approval button that bypasses the required form. Open questions about name, dates, airports or guest data should keep their existing input controls. Do not add duplicate quick-reply strips when an existing component action already serves the same decision clearly.

Examples of contextual labels and behavior:

| Decision | Primary quick reply | Optional secondary action |
|---|---|---|
| Confirm two adults / wife | `نعم، أنا وزوجتي` | A supported way to correct party details |
| Approve accommodation summary | `مناسب، نكمل` | `أراجع التفاصيل` |
| Approve transfers / updated total | `اعتمد ونكمل` | `أراجع الملخص` |
| Defer experiences | `نختار عند الوصول` | Only a genuinely supported alternative |
| “نكمل الحجز الآن ونرجع للتجارب؟” | `نعم، نكمل الحجز` | A relevant, supported alternative if needed |
| Confirm final details | `البيانات صحيحة، نكمل` | `تعديل البيانات` |
| Return to a supported resort, villa, date or airport route | A specific label describing that choice | Keep a review/edit path where supported |

These are semantic examples, not instructions to create unsupported editing flows or unnecessary buttons. Review actions should reopen or bring the relevant existing details into view without erasing inputs or starting the conversation over. Unsupported priced changes must enter the re-quote state; they cannot retain the recorded total. Fallback prompts must retain/re-offer the correct current choices.

### Quick-reply implementation contract

- Build one reusable rendering/action pattern, driven by **explicit structured metadata or a stage/action map**. Do not detect questions by searching for the words `موافق` or `نكمل` in rendered text. A mention of continuation is not sufficient to infer the intended action.
- Extend the existing `SCRIPT` reply structure and engine where appropriate. V2 already has `stageSpec`, `deliver`, `customer` and `act` in `js/chat.js`. Route quick replies through the same validation, state and message-delivery pipeline as the corresponding typed/component action.
- Use stable action identifiers independent from visible Arabic labels. In particular, new labels such as `نعم، نكمل الحجز` must resolve explicitly to the intended activity-deferral action; do not rely on the old substring parser accidentally recognizing them.
- On activation, append exactly **one customer-side message** representing the chosen reply, then deliver the ordinary next turn. Do not mutate the stage directly in an isolated click handler or duplicate logic in a second state machine.
- Bind a reply group to its conversation/turn and expected stage. Ignore stale or wrong-stage actions. Disable or consume the group after an accepted action, and prevent rapid double-clicks from producing duplicate messages or transitions. Failed validation must leave an actionable correction path.
- Display choices at the relevant assistant turn, after that turn's necessary messages/cards have been delivered. Keep older choices consumed or disabled. Do not permit an early click to bypass a still-running reply queue.
- Render compact, RTL, wrapping chips/buttons directly below the relevant assistant message/card, aligned to the **left-side agent column**. Match the approved background palette; do not create large new cards, float a new tray or displace the permanent microphone/composer. Give controls accessible names, keyboard support, visible focus and suitable touch targets, ideally 44 px.
- Preserve free-text input. Typed approval and clicking the matching quick reply must lead to equivalent validated outcomes. Explicit negative phrases such as `غير موافق` or `مو موافق` must not be treated as approval merely because they contain an approval word.
- Do not interpret generic continuation as consent to legal terms. Preserve an explicit unchecked terms/privacy acknowledgement and real links at final review. A continue/approve quick reply must respect that validation and cannot silently check a consent box. Marketing consent remains separate, optional and unchecked by default.
- Quick replies cannot submit incomplete guest data, skip OTP, set email as verified, claim payment success or execute a purchase. Do not add a `تم الدفع` quick reply; the recorded payment journey continues automatically.

## Preserve the recorded journey and factual constraints

The route remains: greeting/name once → holiday with wife → three resorts → Shebara details → villas before party/dates → two adults → one date-range calendar → accommodation approval → arrival mode → one airport form → transfers/updated total approval → experiences deferred → coordinated guest/wife form and voice → manually entered email → review/edit/terms → email verification → payment → automatic prepared closure and PDF.

Fixed scenario:

- Shebara; `One Bedroom Overwater Villa` / `فيلا فوق الماء بغرفة نوم واحدة`; sole `Villa Flat Rate` / `السعر الأساسي للفيلا`.
- Check-in `2026-10-23`, checkout `2026-10-25`; 2 nights, 2 adults, 0 children.
- Accommodation **28,980.00 SAR for the entire stay, including taxes**. Not nightly. No additional VAT and no 10% discount.
- Arrival: `Yanbu Airport` → Shebara; `Private Luxury Car + Shared Leisure Boat`; **3,622.50 SAR**.
- Departure: Shebara → `Red Sea International Airport - RSIA`; `Shared Speed Boat + Private Luxury Car`; **1,191.40 SAR**.
- Transport subtotal **4,813.90**; grand total **33,793.90 SAR**, taxes included. No activities booked.
- Guest: السيد محمد باز; `+966` / `508416627`; wife نورة الحربي; optional request `تسجيل وصول متأخر إن أمكن`, not guaranteed.
- Email `muhammed.baz@clouding.ai` is entered **manually**. The prepared voice mapping must never supply it. Preserve remembered first name; do not request it again.
- Voice extraction markers are restrained icons only with accessible labels. Remove a field's extraction marker once the user edits that value.
- Other seven villas retain genuine photos/names/occupancy without invented prices or availability. Villa-photo links use the honest Shebara-page fallback, distinct from selection. Preserve the exact official links from the design dataset.
- Keep the official checkout URL unchanged, including all query parameters. Preserve the existing approximately five-second scripted continuation; document internally that it is presentation behavior, not a payment-provider result. Do not display claims such as `تم التحقق من الدفع` on the strength of that timer alone, and do not invent a receipt or reservation number.
- Remove conflicting legacy copy about unneeded child policies, unverified villa amenities or availability, and asking for nights separately. Follow the approved brief and restrained Saudi Arabic tone.

## Integration, scrolling and PDF

Preserve real V2 microphone recording/playback and cleanup, including the user's normal permission flow. Do not replace it with the design prototype's animated-only recorder. Keep recording within the existing composer entry area, beside Send; preserve drafts on cancel. The existing extraction remains the documented prepared mapping, not general speech recognition.

Preserve existing server-side email verification, validation, resend/cooldown and error handling. Only a successful server response may mark the email verified. Changing email clears verification and requires it again. Do not expose credentials or server diagnostics in the guest UI. Do not read/print `.env` contents or ask for new credentials for this UI change; preserve the existing configuration mechanism.

Keep guest edit/save/cancel bound to the same booking data used by review, confirmation and PDF. Use the approved `summary.html` and supplied horizontal RSG logo as the PDF layout reference. Preserve RSG navy/gold identity and document the supplied Fedra font fallback. Do not export a fixed original guest snapshot after the user edits their data.

Preserve paced sequential replies and persistent `المساعد يكتب…` header status. A user action may position the conversation once at the first reply of its turn; later queued messages, images and quick-reply rendering must not pull the view to the bottom. A secondary “review details” action may move to the requested details because the guest explicitly asked for it. Keep the explicit new-messages control and reserved image dimensions.

## Verify and deliver

Run the app and inspect the actual implemented UI, not only the reference gallery. Use appropriate existing checks and focused regression checks for the new quick-reply behavior. Verify:

1. All 15 component groups match the approved latest backgrounds, content and compact layout at desktop, 390 px and 360 px.
2. Every actual approval/continuation prompt, including fallback/edited/retry branches, has a valid contextual action or its existing equivalent component control. Audit `approve1`, `approve2`, `party`, `activities`, `review` and relevant `other` branches explicitly.
3. Each valid quick reply emits one customer message and one correct transition; rapid clicks and stale historical buttons do not duplicate or advance the flow. Typed negative responses do not approve.
4. No quick reply bypasses required fields, legal acknowledgement, server OTP or re-quote requirements.
5. Voice leaves email empty, guest editing preserves data, email changes invalidate verification, and PDF reflects the latest saved details.
6. Amounts/dates/images remain correct, all eight villa types remain accessible, and no horizontal overflow or unreadable gradient text is introduced.
7. New replies and quick-reply rendering do not steal reading position. Microphone and Send remain in their normal positions.

Use isolated mocks/local test facilities for email and payment checks; do not send a real email, open/submit checkout or execute a purchase as part of implementation verification. Do not automatically request the microphone during automated testing. Preserve working services and document any test limitation honestly.

Update V2 documentation concisely with the approved design source, quick-reply mapping/behavior and relevant integration limits. Finish with a short list of changes, files touched, checks run and the local preview URL, plus screenshots of the implemented desktop/mobile result. Do not modify or claim completion of unrelated systems.
