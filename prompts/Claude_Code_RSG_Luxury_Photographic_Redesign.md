# Completely redesign the V2 concierge: visually rich luxury, concise information

Act as a Principal Product Designer, Luxury Hospitality Art Director, and senior frontend engineer. Implement a **new visual direction for the rich components inside the actual Arabic concierge chat**.

The owner has reviewed the implemented Quiet Tide design in the chat and **rejected its visual appearance**. They want the information to stay simple, but the design to feel rich, distinctive, sophisticated, and luxurious. The current cards feel too basic. This is a complete visual redesign, not approval of the current styling.

This request supersedes the old visual approval of Quiet Tide, including any README or earlier prompt calling that direction approved. Preserve the current functional work and Quick Replies; replace the visual direction. Make the changes and inspect the actual running chat rather than returning a written proposal.

## Project and source discipline

Workspace: `D:\Clouding\RSG`

Implementation target: `D:\Clouding\RSG\visitredsea-chat-mockup-v2`

Read applicable `AGENTS.md`, then inspect the current target before editing. Another implementation pass has already integrated Quiet Tide and contextual Quick Replies. Preserve those working features and any unrelated user changes. Read `README.md`, `docs/QUIET_TIDE.md` if present, the component rendering/state/action logic in `js/chat.js`, `data/script.js`, data files, CSS, PDF export, and relevant server interfaces.

Authoritative factual/content brief:

`D:\Clouding\RSG\design-briefs\2026-10-20-rich-components\02_ChatGPT_Design_Prompt_EN.md`

Real asset kit:

`D:\Clouding\RSG\design-briefs\2026-10-20-rich-components\RSG_Rich_Components_Design_Kit`

Read its `README_FIRST.md`, `CONTENT_AND_ASSET_MANIFEST.md`, and `content.json`, and inspect the actual pictures before choosing crops. Its photographs, logos, fonts, villa mappings, prices, and links are available. The same assets also exist under `D:\Clouding\RSG\design-proposals\quiet-tide\assets`.

The old `design-proposals\quiet-tide` folder can supply assets and functional/content reference. **Do not use its screenshots, card styling, pastel surfaces, or typography as the visual target.** Preserve that folder as an earlier proposal. Work in V2; keep V1 and unrelated host marketing-page sections untouched.

Keep the existing application stack and real integrations. Do not replace V2 with a component board, a marketing website, or a visual-only prototype. Do not transplant the old design prototype's simulated voice/OTP handlers over the working application.

## The essential design distinction

**Simple information. Rich visual design.**

Keep each component focused on the small amount of information needed for its decision. Express luxury through art direction, photography, typography, composition, layering, materials, lighting, depth, and precise details—not through additional text, amenities, badges, or larger cards.

Create one coherent direction inspired by an intimate private resort concierge and a premium hospitality editorial. Explore a more immersive palette of deep marine teal, charcoal, dusk tones, warm ivory and sand, with controlled aqua accents that keep the Visit Red Sea identity recognizable. Use light and dark surfaces intentionally. Avoid making every component identical or uniformly dark.

You have creative freedom to change component composition, hierarchy, type pairing, crop strategy, surface treatment, buttons, separators, corners, and subtle motion. The result must feel meaningfully different from the current implementation, while keeping the booking journey and concise content intact.

Avoid generic chat UI, dashboard/form-template styling, repetitive white boxes, interchangeable pastel gradients, excessive gold, giant rounded pills, noisy decorations, or neon AI effects. An expensive-looking interface does not require gold everywhere. Do not solve the task by applying one new color or one shared background gradient to every old card.

## Photographic component backgrounds are central to this direction

The owner explicitly wants component backgrounds that can contain **real photography with controlled transparency/overlays**, rather than only a color.

- Make photography part of the actual component surface and composition, beyond a small thumbnail beside a generic panel. Use carefully chosen cover crops, partial photographic panels, masked edges, tonal image layers, or a subtle photographic underlay.
- Build a deliberate material system: photograph, tonal overlay, selective local contrast surface, content, and controls. Soft gradients may support the photograph, but should not be the entire background treatment across the set.
- Adjust transparency on the **background layer**, not on the parent component. Text, prices, buttons, icons and fields must remain crisp and fully legible. A component-level `opacity` that fades all content is unacceptable.
- Keep the image meaningful and visible. An almost opaque wash that leaves no discernible photography does not satisfy this direction. Conversely, do not put essential small text directly over busy image details without sufficient protection.
- Use the correct property's photograph for each resort, each villa's genuine image for that villa, and the mapped activity photos. Do not substitute a different resort or villa to obtain a prettier crop. Generic scenery must not imply an unprovided transport vehicle, airport, product, or amenity.
- For calendar, form, transport, review, verification, payment and confirmation, a quiet crop of the selected resort's water, architecture or landscape can provide atmosphere. Inputs and dense interaction areas may sit on opaque or sufficiently solid local surfaces while photography remains visible elsewhere in the component.
- Avoid repeating the same obvious full photograph identically across every card. Establish a small number of coherent visual families with distinct crops/intensities suited to their content.
- Preserve concise component dimensions. No tall hero image on every card. Photography must improve the existing message-column experience, including at 360 px.
- Keep the three experience tiles adjacent with image and name only; their photos already form their visual surfaces. Do not add descriptions, pricing or decorative labels.
- Keep transport as two concise product/price rows. A restrained shared photographic surface is allowed; do not add large vehicle photos or expand transport information.
- Keep the actual resort photograph recognizable behind the conversation. Inspect the interaction between the chat backdrop and component backgrounds so the whole scene is composed and legible.
- Use sensible CSS image/overlay tokens and stable image sizing. Avoid unnecessary heavy blur, expensive effects or image-loading layout shifts. Respect reduced motion.

Choose and execute the treatments yourself. Do not require the owner to specify an opacity for every component.

## Reconsider typography inside the components

The owner permits changing the component fonts and wants a more luxurious appearance. Make typography a deliberate part of the new direction instead of preserving the current generic-looking treatment automatically.

- Inspect the real included font files. Arabic display candidates already available include `FedraSerifArabic-Book.woff2`, Medium, Demi, and Bold. The kit also includes `FedSerDis-*` for suitable Latin display use and `FedraSansAL-*` for supporting Arabic text.
- Consider an expressive Arabic serif for component headings and a refined readable companion for body text, controls and forms. Use a disciplined pairing and weight system, not a different unrelated font for each card.
- Choose based on the result in the actual Arabic chat. You may use a different suitable Arabic font if genuinely available with appropriate usage rights and real files; document its source/license and load it reliably. Do not invent font availability or silently substitute an unrelated system fallback.
- Verify Arabic shaping, diacritics where present, Arabic/Latin pairing, line height, long villa labels, official resort names, and Western price numerals. An attractive Latin font with no Arabic coverage is not an Arabic typography solution.
- Prices must remain easy to scan; use clear numeric forms and tabular numerals where supported. Form labels and controls must stay readable and comfortable. Do not make essential text tiny to fit a luxurious-looking composition.
- Headings can have more editorial expression; practical input text can remain in the most readable supporting face. Adjust font size, weight and spacing together rather than applying an ornamental face indiscriminately.
- Do not modify original logo artwork or typeset replacements for it. The RSG PDF has a separate corporate identity; keep its original supplied logo and documented font fallback requirements.

## Apply the new system to the complete component set

Redesign all 15 groups and their relevant states coherently:

1. Exactly three compact resort suggestions, with selection and consumed state.
2. Selected Shebara detail strip.
3. All eight villa options, progressive disclosure, independent photo-information links, selected villa and its single rate.
4. Single compact date-range calendar, empty/first/complete/invalid/confirmed.
5. Accommodation summary and the same summary pattern updated with transport.
6. Four arrival-mode choices with selection states.
7. One airport form with optional flight details.
8. Two transport rows, subtotal and approval.
9. Three adjacent experience tiles, image and name only.
10. Coordinated guest/wife form: remembered first name, voice-populated data with empty email, manual email, validation and edit/save/cancel.
11. Existing composer and real voice recorder: idle, permission/error, recording, preview, cancel and sent audio.
12. Final review and editing states.
13. Email verification: sending, sent, code entry, invalid/expired, retry, cooldown and verified.
14. Official payment handoff and quiet waiting state.
15. Final information/confirmation and PDF action.

State design is part of the visual work. Selected items, errors, consumed choices, disabled actions and loading must remain legible on the new surfaces. Do not convey states only by fading entire cards until their content becomes unreadable.

## Preserve the current functionality and Quick Replies

- Preserve existing contextual Quick Replies for every actual approval/continuation question, including fallback and edited-review branches. Restyle them to belong to the new direction. Do not remove them during the redesign or add a parallel duplicate set.
- Each action produces one customer-side reply and the correct validated transition. Preserve stale-action guards, double-click prevention and free-text support. Keep quick replies near their relevant assistant turn, within the message column.
- Do not confuse neutral requests such as “نحتاج بياناتك عشان نكمل” with an approval gate that could bypass a form. Required fields, explicit terms/privacy acknowledgement and server OTP cannot be skipped by a continuation button.
- Preserve real V2 microphone recording/playback and the recorder's placement inside the existing composer entry area. Keep the microphone beside Send. Do not replace working audio with an animation-only mock.
- Preserve the documented prepared voice extraction mapping; it is not general speech recognition. It leaves email empty. Keep extraction markers icon-only, accessible, and removed when a marked value is edited.
- Preserve the one coordinated guest form, remembered first name, manual email, optional wife fields/request and unchecked optional marketing consent.
- Preserve guest edit/save/cancel, the latest data throughout review/confirmation/PDF, and invalidation of email verification when email changes.
- Preserve real server-side email verification and resend/error behavior. Do not replace a server response with a front-end verified state or ask for credentials for a visual redesign. Do not expose `.env` or diagnostic details.
- Preserve exact official links and checkout parameters. No card collection inside chat. The existing approximately five-second payment continuation is scripted presentation behavior, not evidence of a verified payment. Do not invent a reservation reference, payment receipt or payment-provider result.
- Preserve paced sequential replies, persistent header typing status while the guest reads earlier messages, image dimension reservations, and customer-controlled reading position. A user action can position the first reply once; subsequent messages/cards/quick replies must not drag the reader to the bottom. Keep the explicit new-messages control.

## Content and scenario remain concise and factual

Follow the original brief and `content.json` for content, actual image mappings and links. Do not add decorative content to make the design look richer.

- Shebara; `One Bedroom Overwater Villa` / `فيلا فوق الماء بغرفة نوم واحدة`; sole `Villa Flat Rate` / `السعر الأساسي للفيلا`.
- `2026-10-23` to `2026-10-25`; 2 nights, 2 adults, 0 children.
- Accommodation **28,980.00 SAR for the entire stay**, taxes included. No nightly reinterpretation, extra VAT, removed discount or second rate plan.
- Arrival from Yanbu: `Private Luxury Car + Shared Leisure Boat`, **3,622.50**.
- Departure to RSIA: `Shared Speed Boat + Private Luxury Car`, **1,191.40**.
- Transport subtotal **4,813.90**; grand total **33,793.90 SAR**, including taxes; no booked activities.
- السيد محمد باز; `+966` / `508416627`; manually entered `muhammed.baz@clouding.ai`; wife نورة الحربي; optional late-check-in request, not a guarantee.
- Other villa prices/availability and dedicated villa URLs remain unprovided. Do not invent them. Unsupported priced selection changes require a new quote.
- Keep all guest-facing labels Arabic and all digits Western. Preserve official resort spelling. Agent components/messages **LEFT**, customer messages **RIGHT**, Arabic text RTL, contact details/numbers isolated LTR.
- Keep the route intact: resort → villas → party/dates → accommodation → arrival/airports/transport → experiences deferred → guest/voice/manual email → review/edit/terms → email verification → payment → closure/PDF.

## Design and verify inside the real chat

The owner's criticism concerns the appearance **inside the chat**. The actual V2 chat is the acceptance surface. The old gallery at port 4175 is not proof that the new application looks good.

1. Run the current V2 application using its documented command/port; the README describes port 8090 or the next free one. Inspect the actual current implementation first.
2. Establish the new visual direction using representative discovery, transactional and form components **inside the real message column**. Check photography, typography, layering, button contrast and the surrounding chat before applying the system throughout.
3. Implement the coherent redesign across the full set. Choose the art direction autonomously; do not pause after producing a mood board or ask the owner to design the details for you.
4. Inspect actual desktop and mobile contexts: roughly 472 px desktop panel, 390 px mobile and 360 px viewport. Recompose layouts where needed while preserving concise information and touch usability.
5. Check long Arabic names, the longest resort brand, prices, email and phone, selected states, error states, guest edits, OTP and photo loading. Do not accept clipped text, decorative unreadability, horizontal overflow or cards that dominate the conversation with unnecessary height.
6. Use existing checks and focused regression verification for anything you change. Exercise the booking decisions and current Quick Replies. Use isolated mocks/local facilities when testing services; do not send real verification email, request microphone access automatically, follow/submit checkout or execute a purchase as part of automated review.

Deliver the implemented V2 redesign, its running preview URL, and screenshots from the **actual chat** showing resorts/villas, calendar, transport/experiences, guest form, review, OTP and final payment/confirmation treatments. Include desktop and mobile evidence and a concise note describing the chosen photographic/typographic system, files changed, checks performed and any real limitations. Update design documentation so it no longer describes the rejected Quiet Tide appearance as the current approved visual target.

The final result should visibly demonstrate **compact information presented through a richer, carefully art-directed luxury interface**.
