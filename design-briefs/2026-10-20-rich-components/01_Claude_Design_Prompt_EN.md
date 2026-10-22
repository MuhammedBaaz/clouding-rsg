You are a **Principal Product Designer and Luxury Hospitality Art Director**, specializing in conversational interfaces, compact rich components, Arabic RTL systems, and high-fidelity interactive prototypes.

Use the design and prototyping capabilities actually available in Claude Design to create the visual deliverables below. Take ownership of a complete, cohesive design proposal, and use the attached real asset kit as your visual/content source.

# Project and objective

Create a fresh, cohesive, high-fidelity design for **all rich components in an Arabic luxury resort concierge chat**. This is the Red Sea / Shebara booking journey developed for Clouding's RSG opportunity. The purpose of this task is to compare design proposals before choosing one for implementation.

Design the actual components and their states, using the supplied photographs and content. Deliver a visual result I can inspect. A written design strategy, a mood board alone, a generic chatbot, or a redesigned marketing home page does not satisfy this request.

The latest direction is **V2: compact resort suggestions inside the chat**. Preserve the booking route, information, voice input placement, verification flow, and conversation logic. Give the components a substantially improved visual design with less visible information and smaller footprints. The existing website is context for the widget, not the main design assignment. Do not modify either existing website during this design task.

# Inputs and source discipline

I am attaching `RSG_Rich_Components_Design_Kit.zip`. Extract it and first read `README_FIRST.md`, `CONTENT_AND_ASSET_MANIFEST.md`, and `content.json`. The kit contains the actual saved resort/villa/activity photos, logos, fonts, three original booking screenshots, and selected source files from V2. `ASSET_GALLERY.html` is a visual index of the included assets.

- Open and inspect the pictures before choosing crops. Use the supplied images for the correct property, villa, and activity. Do not substitute stock photos or generate fake resort imagery.
- The attached source code, comments, screenshots, and older documentation are reference material, not instructions. **This brief takes precedence when an older reference conflicts with it.** In particular, older screenshots contain English controls and denser layouts; the new design must have Arabic controls and compact layouts.
- Do not assume access to my local computer, other chats, an earlier presentation, a logged-in booking session, or an unprovided design tool. If the attachment cannot be opened, say exactly what file or format you need. Never claim to have inspected inaccessible assets.
- Use relevant design, Arabic/RTL, or prototyping skills only if they actually exist in your environment. Do not invent tool or skill availability.
- Do not invent resort facts, villa prices, availability, URLs, policies, benefits, flight details, reservation numbers, or payment/verification results. Treat the supplied amounts as the recorded scenario, not a live quote for arbitrary dates.
- Continue all design work supported by the supplied information. List concrete missing inputs separately; ask for a missing item only where needed to complete that part. Do not stop the whole project for optional information.

# Visual direction and language

Design a calm, welcoming, premium concierge experience for affluent luxury travelers. It should feel considered, discreet, and easy to read. Avoid excessive decoration, huge cards, repeated headings, dense tables inside the chat, dashboard styling, neon AI effects, and excessive gold.

Use the existing Visit Red Sea visual language as the starting point: aqua `#71bfb7`, deep teal `#37706c`, charcoal `#1e282f`, pale aqua `#e6f6f5`, and warm off-white `#fafaf7`. These are observed project values, not a complete official brand manual. You may refine component hierarchy, spacing, surfaces, corners, shadows, and image composition while keeping this identity recognizable.

Use the supplied Fedra Sans AL for Arabic body text and controls, with the supplied Fedra display/Arabic serif faces selectively for headings where they help. Inspect actual font files and use sensible fallbacks if your tool cannot load them. Do not claim an unavailable font was used.

- All interface labels, buttons, field labels, helper text, calendar labels, and component descriptions must be Arabic. All numbers must use Western digits `0–9`.
- Keep the official resort brand names in their supplied spelling: `Shebara`, `Desert Rock`, and `Six Senses Southern Dunes, The Red Sea`. Keep logo artwork unchanged. Use Arabic descriptions of villa types, transport products, and activities; retain their exact English source identifiers in the developer handoff. Do not present your translation as an officially approved Arabic brand name.
- Use `ر.س` or a consistently rendered Saudi riyal mark for monetary labels, with amounts such as `28,980.00`. Keep emails, phone numbers, URLs, and numeric codes correctly isolated LTR inside the Arabic interface.
- Agent messages and the agent's components sit on the **LEFT**. Customer messages sit on the **RIGHT**. Text inside Arabic bubbles remains RTL. Do not reverse these positions because the language is Arabic.
- Use the existing Visit Red Sea turtle mark as the concierge avatar. Keep an actual supplied resort photograph clearly visible behind the conversation. A restrained overlay is acceptable for contrast, but the photograph must remain recognizable. Use readable message/card surfaces rather than hiding the photograph beneath an almost opaque wash.
- No customer-facing labels such as Demo, Test, Mockup, Simulation, Fictional, placeholder, or equivalent Arabic labels. Internal handoff notes must accurately identify visual states and integration limits. Never fabricate a real booking reference, actual receipt, actual payment verification, or an OTP to create credibility.
- AI markers are **icons only**. Do not visibly write `أضافه المساعد`, `إضافة المساعد`, `استخرجه المساعد`, or `AI extracted`. A small restrained sparkle icon is suitable; its meaning must still have an accessible label and, if useful, a tooltip.

Show the design in a realistic desktop chat panel around 440–480 px wide and a mobile viewport around 390 px wide; verify it remains usable at 360 px. These are presentation targets, not reasons to shrink essential text or touch targets. Keep the component inside the message column and avoid horizontal page overflow. Small visual controls may have larger invisible hit areas.

# Fixed booking content

Use this exact journey throughout all components, review states, and the PDF preview:

| Item | Recorded scenario |
|---|---|
| Resort | Shebara |
| Villa | One Bedroom Overwater Villa — Arabic display: فيلا فوق الماء بغرفة نوم واحدة |
| Rate identifier | Villa Flat Rate — Arabic display: السعر الأساسي للفيلا |
| Check-in | 23 October 2026 / 2026-10-23 |
| Check-out | 25 October 2026 / 2026-10-25 |
| Stay | 2 nights, 2 adults, 0 children |
| Accommodation | 28,980.00 SAR for the entire stay, including all taxes |
| Arrival | Yanbu Airport → Shebara |
| Arrival transfer | Private Luxury Car + Shared Leisure Boat — سيارة فاخرة خاصة + قارب ترفيهي مشترك |
| Arrival transfer price | 3,622.50 SAR, total for 2 adults, taxes included |
| Departure | Shebara → Red Sea International Airport - RSIA |
| Departure transfer | Shared Speed Boat + Private Luxury Car — قارب سريع مشترك + سيارة فاخرة خاصة |
| Departure transfer price | 1,191.40 SAR, total for 2 adults, taxes included |
| Transport subtotal | 4,813.90 SAR |
| Activities booked | None |
| Grand total | 33,793.90 SAR, taxes included |
| Main guest | محمد باز; first name محمد, family name باز, title السيد |
| Country code / national mobile | +966 / 508416627 |
| Email, manually entered | muhammed.baz@clouding.ai |
| Wife / second guest | نورة الحربي |
| Optional request | تسجيل وصول متأخر إن أمكن — a request, not a guaranteed service |

The accommodation figure is **not a nightly rate**. Do not add VAT again. There is no 10% offer, no second rate-plan comparison card, no added activity charge, and no invented price for other villas. The supplied villa catalog contains 8 genuine types and photos; occupancy is recorded for all 8, but the other 7 prices are missing. Design the priced selected villa fully. For the other villas, show the supplied photo/name/occupancy without an invented amount; keep the missing-price explanation in the handoff. Do not imply these options are confirmed available for the dates.

The price is tied to the prepared dates even though villa discovery appears before the date question. Keep its basis concise and clear, and never reuse it as a quote for a different date range.

# Complete component inventory and requirements

## 1. Resort suggestions

Exactly 3 compact suggestions: **Shebara**, **Desert Rock**, **Six Senses Southern Dunes, The Red Sea**. Use their respective supplied real photographs, brand names, and a compact `اختيار` control. The whole group should feel light and fit naturally inside one agent turn. Show default and selected/consumed states.

Add one nearby `استكشف المزيد` action opening `https://www.visitredsea.com/en/resorts` in a new tab. Choosing Shebara generates a customer-side selection message and continues the journey. V2 must not scroll/navigate to a page resort section, dim the surrounding page, show a spotlight or animated pointer, inject page Choose buttons, or show a waiting-for-page-selection banner. Those belong to an earlier version.

## 2. Selected resort details

A short Shebara detail strip/card: its real photo, name, a concise location line such as `جزيرة شيبارة`, and an official details link. Avoid repeating the full resort marketing description or packing in amenity facts. Use `https://www.visitredsea.com/en/resorts/shebara` for resort details. This is shown immediately after the resort selection, followed by the villas.

## 3. Villa options and selection

This appears **before** the guest-count and date questions. Use compact rows or another space-efficient collection, with genuine villa thumbnails. Each option should have only its identifying name, occupancy, price where evidenced, and a selection action. Omit floor area, bed configuration, pool specifications, long descriptions, amenity lists, and large hero images. The full 8-type catalog and its occupancy/image mapping are in `content.json`; do not invent extra types.

For the selected one-bedroom overwater villa, show `28,980.00` and a concise whole-stay/tax basis. Put the single `Villa Flat Rate` choice, labeled in Arabic, directly beneath/in the selected villa's selection control; do not create another rate component or add the removed discount.

Clicking a **villa photograph** opens the genuine official villa information, separately from selecting the villa. A direct URL for each individual villa has not been evidenced. Until one is supplied or verified from an official source, use the known Shebara page, which lists the accommodation types, and label the action honestly. Do not invent a path or anchor and do not pretend this is a dedicated villa page. Record the missing deep links in the handoff.

Keep the catalog visually short: a compact rail, short rows, or restrained progressive disclosure is acceptable. Keep all supplied types accessible rather than silently deleting them.

## 4. Compact date-range calendar and stay strip

One Gregorian range calendar selects **check-in and check-out together**. Use October 2026 with 23–25 selected in the completed state, Arabic month/day/control labels, and Western numerals. Show empty, first-date-selected, completed-range, invalid-range, and confirmed states. Clearly distinguish the endpoints and intermediate night.

Make the calendar smaller and more elegant than a full booking-page calendar. Its lower area must have a coherent tinted surface, pale aqua/sand, or a restrained photographic treatment, **not a large plain white block**. Keep `تأكيد التواريخ` compact, and show the derived dates / `2` nights / `2` adults concisely. Do not add a second question asking how many nights after the range has been chosen.

## 5. Accommodation cost summary

A compact initial summary with resort, selected villa, dates, 2 adults, accommodation total `28,980.00`, and one tax note. Avoid recreating a large checkout sidebar inside a bubble. Establish a reusable small summary pattern that can later include transport without repeating every detail.

## 6. Arrival-mode selection

Four compact choices with simple consistent line icons and Arabic labels: `بالطائرة`, `بطائرة خاصة`, `بالسيارة`, `باليخت`. The route selects `بالطائرة`. Do not display invented prices for these four mode choices: the evidenced prices belong to the transfer products below. Show selected and unselected states clearly.

## 7. Airport and optional flight information

Show this input component **once only**, with `مطار الوصول` and `مطار المغادرة` as required fields. Selected values are `مطار ينبع` and `مطار البحر الأحمر الدولي – RSIA`; retain the exact English identifiers in the handoff. The recorded selectable airports also include Al Wajh Domestic Airport / مطار الوجه المحلي.

Arrival/departure time, airline, and flight number are optional. Place them in restrained progressive disclosure if it helps reduce clutter. Leave unprovided flight details empty; do not invent them. After confirmation, show transport results rather than duplicating this airport form.

## 8. Transport details and updated total

Use two exceptionally simple rows/options: an understated arrival/departure identifier, the transport product type, and its price. Arrival: `سيارة فاخرة خاصة + قارب ترفيهي مشترك` / `3,622.50`. Departure: `قارب سريع مشترك + سيارة فاخرة خاصة` / `1,191.40`. Use `4,813.90` as the transport subtotal and `33,793.90` in the updated booking summary.

Do not show large transport pictures, capacity, journey duration, long route descriptions, repeated airport inputs, vehicle inventories, upgrade menus, or a second flight form. Keep the tax/2-adult basis concise and show it once where necessary.

## 9. Experiences during the stay

Three small **side-by-side options with image and name only**:

- Adrena — `assets/activities/adrena-7.webp`
- Garden Discovery and Planting Experience — Arabic display `استكشاف الحديقة وتجربة الزراعة`
- Stand Up Paddle-Boarding — Arabic display `التجديف باللوح واقفًا`

Use the mapped real photographs. No visible prices, duration, age badges, category tags, long descriptions, or large buttons on these tiles. Keep the three options adjacent on desktop, and choose an equally compact mobile row/rail that preserves readable names. The customer decides to choose experiences after arrival; no activity is added and the total stays unchanged.

## 10. Guest and wife information

One coordinated rich component holds the main guest and wife details. Do not split them into separate conversation questions. The first name is already known from the greeting and must be prefilled, never requested again.

Include main-guest title, first name, family name, email, country code, and mobile. Wife's first/family names are optional in the source form but filled in this scenario. Include an optional request field and an unchecked optional marketing-consent control, with discreet real terms/privacy links. Do not add identity documents, passport details, date of birth, a second email, or extra mandatory fields unsupported by the reference.

Show these design states: initial with first name remembered; populated after a voice message with **email still empty**; manually completed email; field validation; final-review edit mode with save/cancel.

The voice-derived fields show a small **icon only** AI extraction marker. The remembered first name can use the existing discreet conversation marker. Once the user edits an extracted value, the unchanged-extraction marker should not remain on that value. Use labels/tooltips for accessibility without visible explanatory badges. Do not add a visible caption that restores the removed `استخرجه المساعد` wording.

Before this form, the agent simply says something in the tone of: `نحتاج بياناتك وبيانات زوجتك يا محمد عشان نكمل الحجز.` Do not instruct the guest to record audio, press a microphone, type, or choose an input method. The guest decides how to supply the data.

## 11. Composer, voice recording, and audio message

A permanent microphone control sits beside Send in the normal bottom composer. Recording replaces the **text-entry area in that same composer** with an elapsed timer, waveform/audio-level treatment, stop and cancel; then a compact preview/send state. It must not appear as a card among messages, in a floating recorder above the chat, or in a second tray outside the composer.

Design idle, microphone permission/error, recording, stopped/preview, cancelled, and sent-audio states. Show a convincing animated recording treatment where supported, and distinguish actual microphone-driven behavior from a visual motion preview in the handoff. The sent voice message appears on the customer side. Its prepared content supplies محمد باز / +966 508416627 / نورة الحربي / the optional late check-in request, but **does not include the email**. Design the populated-fields result; do not claim the design task implements speech recognition.

## 12. Final review with editing

Provide a concise, scannable review of the stay, dates, 2 adults, arrival/departure transfers, no activities, the two guests, contact details, optional request, and total `33,793.90`. Use hierarchy and short groups rather than another enormous wall of text. The key details must remain inspectable.

Include a clear `تعديل البيانات` action. Opening it retains entered guest/contact/request data, allows changes, and offers `حفظ التعديلات` and `إلغاء`. Saving returns to an updated review without restarting the conversation. Changes must be reflected in the later confirmation and PDF. Changing email invalidates the previous verification and requires verification again. If the design exposes editing of priced booking selections, explain the required re-quote state; never keep an old amount on a changed, unsupported stay.

## 13. Email verification

A compact Arabic component for the manually entered `muhammed.baz@clouding.ai`, sensibly masked where appropriate. Show `إرسال الرمز`, 6-digit entry, `تحقق`, and resend/cooldown. Include sending, sent, invalid/expired, delivery failure/retry, and verified states. Use empty/masked code boxes rather than inventing a working code. Existing project behavior uses a server-side email verification service; this assignment is its design, not a request to configure SMTP or send messages. Do not ask me for credentials or put technical diagnostics in customer-facing UI.

## 14. Payment handoff

A restrained payment card with the grand total, clear official destination, and `المتابعة للدفع`, opening this exact existing URL:

https://www.visitredsea.com/en/booking/checkout?startDate=2026-10-23&endDate=2026-10-25&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortName=Shebara&hotelId=1035&currency=SAR

Do not collect card data inside the chat. For the prepared journey, clicking the payment action is followed by about **5 seconds** of quiet waiting, then the existing automatic success/closure state; the customer does not have to send `تم الدفع`. Design this transition. In the internal handoff, explicitly state that this timer is scripted presentation behavior, not evidence that a payment provider verified anything. This design task must not execute a purchase or a payment.

## 15. Final confirmation and PDF

A refined final confirmation card contains the essential reservation summary and a clear `تحميل PDF` action. Do not invent a reservation/reference number. Include the final total, resort/villa, dates, guests, and concise transfer summary; detailed data can be hierarchically arranged rather than all equally prominent.

Also design a matching A4 final-information PDF page/preview using the **Red Sea Global corporate identity** and the supplied `rsg-logo-horizontal.svg`. This is different from the Visit Red Sea chat identity: existing RSG reference colors include navy `#04253c`, darker navy `#0a1d2d`, and restrained gold `#b89c67`. Preserve the actual logo and its proportions. RSG's Questa Grande and Paralucent fonts are not included; use a documented supplied-font fallback rather than inventing font files. The PDF contains the correct latest guest/contact/stay/transfer details and totals, not the entire conversation. Preserve Arabic shaping, Western numbers, and safe printable margins.

# Conversation context, motion, and scrolling

Use short, natural Saudi Arabic with a warm premium concierge persona. Avoid excessive praise, scripted-looking sales language, or unverified claims. Address محمد naturally without repeating his name in every sentence. The meaningful sequence must remain:

1. Greeting → ask preferred first name once → customer says محمد → ask how to help.
2. Customer wants a holiday with his wife → show the 3 resort suggestions → customer chooses Shebara.
3. Compact Shebara details → villas immediately → One Bedroom Overwater Villa / Villa Flat Rate selected.
4. Confirm the party is 2 adults → ask for arrival and departure together → select 23–25 October 2026, 2 nights.
5. Accommodation summary accepted → arrival mode → one airport form → transport details and updated summary accepted.
6. Three compact experiences → customer prefers to decide at the resort, with no activity added.
7. Neutral request for guest/wife details → customer chooses to send voice → one guest form populated except email → customer enters email and submits.
8. Final review, optional edits, terms/privacy acknowledgement → email verification → payment handoff.
9. Prepared wait of about 5 seconds → automatic success, final information/PDF action, and friendly closure.

Show several representative conversational states so I can judge how components feel in the chat. You may improve microcopy while preserving this meaning and order. Do not introduce blanket child-free-stay policies or other policies that are not needed for this two-adult route.

Messages should feel sequential: a reasonable typing treatment, then one message/card at a time, with short natural pauses. If a prototype includes the sequence, use approximately 1.5–2.5 seconds for a short reply, 2.5–4.5 for a normal reply, 4.5–7 for a longer reply, and 0.9–1.8 seconds between items; keep this configurable. Do not reveal an entire queued response instantly.

**Reading position is controlled by the customer.** A user send may position the conversation once at the first reply of the new turn; subsequent agent messages, cards, loading images, and typing must not pull the view to the bottom. While the customer reads earlier content, a persistent header/composer status such as `المساعد يكتب…` must remain visible until the reply queue finishes. Optionally show a discreet explicit new-messages control; it scrolls only when clicked. Reserve image dimensions so loading does not shift the reading position. Show this state in the design rather than only describing it.

# Deliverables and quality bar

Produce **one coherent design direction**, with the same quality and content across the whole set. Do not give me three incomplete concepts. I am comparing your result with another designer/model's result using the same assets and requirements.

1. A high-fidelity component board with **all 15 groups above**, plus meaningful selected, populated, editing, loading, validation, and success/error states. Organize it clearly outside the customer UI; the customer chat itself remains minimal.
2. Desktop and mobile contextual chat views showing the recognizable resort-photo background, avatar, message alignment, compact components, permanent microphone, and persistent typing status while reading earlier messages.
3. A browsable/clickable design prototype if your actual tools support it. Let me inspect resort and villa selection, the image external-link affordance, date range, transport choices, guest/edit states, OTP visual states, and final PDF-preview action. Use the real supplied assets. Keep service-dependent transitions as clearly documented prototype states internally; do not silently send email, record audio, or trigger payment while previewing the component board.
4. The A4 RSG-branded final-information PDF layout/preview. If PDF export is available, supply it; otherwise supply an accurate printable layout and explain the export limitation.
5. A concise developer handoff: color/type/spacing/radius tokens, image-to-component mapping, dimensions/responsive behavior, RTL/LTR rules, state/motion/scroll behavior, accessibility notes, actual link targets, and a short list of missing factual inputs or tool limits. Keep source IDs in this handoff, not as extra clutter on every customer card.

Prefer an inspectable visual artifact over a long narrative. If an HTML/CSS or React preview is available in your environment, use it for the component board and context screens, with reusable component patterns and real image files. If only static visual design is supported, provide complete high-fidelity screens at the requested sizes and the handoff. Do not promise features or exports your environment cannot produce.

Before delivering, inspect at actual desktop/mobile scale, verify Arabic shaping and line breaks, confirm all 3 resorts / 8 villa types / 3 experiences use the correct images, check all amounts and dates, confirm no removed discount/AI text badges remain, confirm no component overflows, and verify that none of the 15 component groups was omitted. Do not merely describe what you would design: create the design now.
