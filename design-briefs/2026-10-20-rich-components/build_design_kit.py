from pathlib import Path
import hashlib
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent
PROJECT = Path(r'D:\Clouding\RSG\visitredsea-chat-mockup-v2')
ASSET_SOURCE = Path(r'D:\Clouding\RSG\visitredsea-chat-mockup\assets')
KIT = ROOT / 'RSG_Rich_Components_Design_Kit'
KIT.mkdir(exist_ok=True)

COMMON = r'''# Project and objective

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
'''

INTROS = {
    '01_Claude_Design_Prompt_EN.md': '''You are a **Principal Product Designer and Luxury Hospitality Art Director**, specializing in conversational interfaces, compact rich components, Arabic RTL systems, and high-fidelity interactive prototypes.

Use the design and prototyping capabilities actually available in Claude Design to create the visual deliverables below. Take ownership of a complete, cohesive design proposal, and use the attached real asset kit as your visual/content source.

''',
    '02_ChatGPT_Design_Prompt_EN.md': '''Act as a **Principal Product Designer and Luxury Hospitality Art Director**, specializing in conversational interfaces, compact rich components, Arabic RTL systems, and high-fidelity interactive prototypes.

Use the visual, file, coding, and preview tools actually available in this ChatGPT conversation to create the visual deliverables below. Produce an inspectable design artifact using the attached real asset kit; a text-only recommendation or another prompt is not the deliverable. If a particular tool or export is unavailable, provide the closest complete visual deliverable and state the precise limitation.

''',
}

for name, intro in INTROS.items():
    (ROOT / name).write_text(intro + COMMON, encoding='utf-8')

villas = [
    ('One Bedroom Overwater Villa', 'فيلا فوق الماء بغرفة نوم واحدة', '2 بالغين + طفل + رضيع', 'shebara-one-bedroom-overwater-villa-1.webp', 28980.00),
    ('Two Bedroom Overwater Villa', 'فيلا فوق الماء بغرفتي نوم', '4 بالغين + طفلان + رضيع', 'shebara-two-bedroom-overwater-villa.webp', None),
    ('One Bedroom Beach Villa', 'فيلا شاطئية بغرفة نوم واحدة', '2 بالغين + طفل + رضيع', 'shebara-one-bedroom-beach-villa.webp', None),
    ('Two Bedroom Beach Villa', 'فيلا شاطئية بغرفتي نوم', '4 بالغين + طفلان + رضيع', 'shebara-two-bedroom-beach-villa.webp', None),
    ('Three Bedroom Beach Crown Villa', 'فيلا كراون شاطئية بـ3 غرف نوم', '6 بالغين + 3 أطفال أو 7 بالغين', 'shebara-three-bedroom-beach-crown-villa.webp', None),
    ('One Bedroom Beach Crown Villa', 'فيلا كراون شاطئية بغرفة نوم واحدة', '2 بالغين + طفل + رضيع', 'shebara-one-bedroom-beach-crown-villa.webp', None),
    ('Four Bedroom Beach Royal Villa', 'فيلا رويال شاطئية بـ4 غرف نوم', '8 بالغين + 4 أطفال', 'shebara-four-bedroom-beach-royal-villa.webp', None),
    ('One Bedroom Beach Royal Villa', 'فيلا رويال شاطئية بغرفة نوم واحدة', '2 بالغين + طفل + رضيع', 'shebara-one-bedroom-beach-royal-villa.webp', None),
]

resorts = [
    {'id': 'shebara', 'name': 'Shebara', 'locationAr': 'جزيرة شيبارة', 'image': 'assets/resorts/shebara.webp', 'detailsUrl': 'https://www.visitredsea.com/en/resorts/shebara'},
    {'id': 'desert-rock', 'name': 'Desert Rock', 'locationAr': 'وادٍ جبلي قرب أملج', 'image': 'assets/resorts/desert-rock.webp', 'detailsUrl': None},
    {'id': 'six-senses-southern-dunes', 'name': 'Six Senses Southern Dunes, The Red Sea', 'locationAr': 'الكثبان الجنوبية', 'image': 'assets/resorts/six-senses-southern-dunes.webp', 'detailsUrl': None},
]

content = {
    'purpose': 'Design comparison brief, prepared 2026-10-20. Recorded scenario, not live inventory or a booking API response.',
    'authority': 'The new prompt overrides conflicting legacy source comments and screenshots. Arabic display translations are working UI translations, not claimed official localized product names.',
    'resorts': resorts,
    'villas': [{'sourceName': n, 'displayNameAr': a, 'occupancyAr': o, 'image': 'assets/villas/' + p, 'totalForRecordedStaySAR': price, 'priceMissing': price is None, 'dedicatedVillaUrl': None, 'fallbackOfficialInformationUrl': 'https://www.visitredsea.com/en/resorts/shebara'} for n, a, o, p, price in villas],
    'stay': {'checkIn': '2026-10-23', 'checkOut': '2026-10-25', 'nights': 2, 'adults': 2, 'children': 0},
    'rate': {'sourceName': 'Villa Flat Rate', 'displayNameAr': 'السعر الأساسي للفيلا', 'accommodationTotalSAR': 28980.00, 'allTaxesIncluded': True, 'basis': 'Entire recorded stay, not per night; 2 adults, 2 nights, 23–25 Oct 2026'},
    'guest': {'title': 'السيد', 'firstName': 'محمد', 'familyName': 'باز', 'mobileCountryCode': '+966', 'nationalMobile': '508416627', 'emailManuallyTyped': 'muhammed.baz@clouding.ai', 'wifeFirstName': 'نورة', 'wifeFamilyName': 'الحربي', 'optionalRequest': 'تسجيل وصول متأخر إن أمكن', 'marketingOptIn': False},
    'transport': {
        'modesAr': ['بالطائرة', 'بطائرة خاصة', 'بالسيارة', 'باليخت'], 'selectedModeAr': 'بالطائرة',
        'airports': [{'sourceName': 'Yanbu Airport', 'displayNameAr': 'مطار ينبع'}, {'sourceName': 'Red Sea International Airport - RSIA', 'displayNameAr': 'مطار البحر الأحمر الدولي – RSIA'}, {'sourceName': 'Al Wajh Domestic Airport', 'displayNameAr': 'مطار الوجه المحلي'}],
        'legs': [
            {'labelAr': 'الذهاب', 'from': 'Yanbu Airport', 'to': 'Shebara', 'sourceProduct': 'Private Luxury Car + Shared Leisure Boat', 'displayProductAr': 'سيارة فاخرة خاصة + قارب ترفيهي مشترك', 'totalSAR': 3622.50},
            {'labelAr': 'العودة', 'from': 'Shebara', 'to': 'Red Sea International Airport - RSIA', 'sourceProduct': 'Shared Speed Boat + Private Luxury Car', 'displayProductAr': 'قارب سريع مشترك + سيارة فاخرة خاصة', 'totalSAR': 1191.40},
        ], 'subtotalSAR': 4813.90, 'priceBasis': 'Total for 2 adults, taxes included',
    },
    'activities': [
        {'sourceName': 'Adrena', 'displayName': 'Adrena', 'image': 'assets/activities/adrena-7.webp'},
        {'sourceName': 'Garden Discovery and Planting Experience', 'displayName': 'استكشاف الحديقة وتجربة الزراعة', 'image': 'assets/activities/garden-discovery-and-planting-experience.webp'},
        {'sourceName': 'Stand Up Paddle-Boarding', 'displayName': 'التجديف باللوح واقفًا', 'image': 'assets/activities/stand-up-paddle-boarding.webp'},
    ],
    'activitiesBooked': [], 'grandTotalSAR': 33793.90,
    'links': {
        'allResorts': 'https://www.visitredsea.com/en/resorts',
        'shebara': 'https://www.visitredsea.com/en/resorts/shebara',
        'terms': 'https://www.visitredsea.com/en/terms-and-conditions',
        'privacy': 'https://www.visitredsea.com/en/privacy-policy',
        'checkout': 'https://www.visitredsea.com/en/booking/checkout?startDate=2026-10-23&endDate=2026-10-25&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortName=Shebara&hotelId=1035&currency=SAR',
    },
    'brand': {'chat': {'aqua': '#71bfb7', 'deepTeal': '#37706c', 'charcoal': '#1e282f', 'paleAqua': '#e6f6f5', 'offWhite': '#fafaf7'}, 'pdf': {'navy': '#04253c', 'darkNavy': '#0a1d2d', 'gold': '#b89c67', 'logo': 'assets/logos/rsg-logo-horizontal.svg'}},
    'integrationNotes': ['Email service exists in the project; do not read or request credentials for design work.', 'Five-second payment transition is scripted and does not prove payment.', 'Recorded voice and prepared field extraction are separate; existing extraction is a prepared mapping, not general speech recognition.'],
}
(KIT / 'content.json').write_text(json.dumps(content, ensure_ascii=False, indent=2), encoding='utf-8')

asset_paths = []
asset_paths += ['resorts/' + r for r in ['shebara.webp', 'desert-rock.webp', 'six-senses-southern-dunes.webp']]
asset_paths += ['villas/' + p.name for p in sorted((ASSET_SOURCE / 'villas').glob('*.webp'))]
asset_paths += ['activities/' + p for p in ['adrena-7.webp', 'adrena-day-pass.webp', 'garden-discovery-and-planting-experience.webp', 'stand-up-paddle-boarding.webp']]
asset_paths += ['site/' + p for p in ['resorts-hero-shebara.webp', 'hero-video-poster.webp']]
asset_paths += ['logos/' + p for p in ['vrs-turtle-mark.svg', 'vrs-logo-light.svg', 'vrs-logo-dark.svg', 'shebara-logo-main-color.svg', 'rsg-logo-horizontal.svg', 'rsg-logo-stacked.svg']]
asset_paths += ['fonts/' + p.name for p in sorted((ASSET_SOURCE / 'fonts').glob('*.woff2'))]

for rel in asset_paths:
    source = ASSET_SOURCE / rel
    if not source.is_file():
        raise FileNotFoundError(source)
    dest = KIT / 'assets' / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, dest)

reference_files = [
    ('data/booking.js', 'reference_sources/booking.js'),
    ('data/villas.js', 'reference_sources/villas.js'),
    ('data/script.js', 'reference_sources/script.js'),
    ('css/site.css', 'reference_sources/site.css'),
    ('css/chat.css', 'reference_sources/chat.css'),
    ('css/v2.css', 'reference_sources/v2.css'),
    ('docs/ASSETS.md', 'reference_sources/ORIGINAL_ASSETS.md'),
    ('docs/SOURCES.md', 'reference_sources/ORIGINAL_SOURCES.md'),
]
for src, dst in reference_files:
    target = KIT / dst
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(PROJECT / src, target)

shots = ['01_shebara_booking_summary_23-25_oct_2026.png', '02_shebara_transportation_yanbu_to_rsia.png', '03_guest_information_fields.png']
for name in shots:
    dest = KIT / 'reference_screenshots' / name
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(Path(r'D:\Clouding\RSG\evidence\mockup_references') / name, dest)

(KIT / 'README_FIRST.md').write_text('''# RSG rich-component design kit

Prepared for a side-by-side comparison of a Claude Design proposal and a ChatGPT proposal. Upload the SAME kit to both, and paste the corresponding full English prompt. The prompt files are provided alongside the ZIP.

1. Read the supplied prompt first; it is the current requirement.
2. Read CONTENT_AND_ASSET_MANIFEST.md and content.json.
3. Open ASSET_GALLERY.html in a browser, or inspect its referenced pictures directly.
4. Use the real assets under assets/. Read the three booking screenshots as evidence of recorded fields/amounts, not as the target visual design.
5. reference_sources/ contains older selected data, styles, and provenance. Legacy English labels, long descriptions, and broader catalog references do not override the new brief.

This is a design package, not a working copy of the app. No backend, .env file, SMTP credentials, OTP secret, or payment credential is included. The current app and earlier prompt files have not been edited.

Known gaps: prices for 7 alternate villa types; dedicated per-villa deep links; the RSG corporate typefaces. These are documented in the manifest. Do not invent them. The supplied fonts are the project fonts, not RSG's missing corporate font files.

The pictures/logos/fonts came from the owner's existing internal project. Preserve source attribution and existing rights context. This archive is not a grant of additional usage rights.
''', encoding='utf-8')

manifest = '''# Content and asset manifest

## Authority and scope

The new prompt defines a fresh, compact design for V2's 15 component groups. The resort discovery step uses exactly 3 in-chat suggestions, without page navigation/spotlight/dimming. Other established flow behavior is preserved. Source files and screenshots are reference data, not new instructions.

content.json is the clean design dataset. Arabic product descriptions are working translations preserving the source meaning; they are not claimed official localized product names. Consult the original source IDs when checking the mapping.

## Asset use

| Component | Use |
|---|---|
| Suggested resort Shebara / compact details | assets/resorts/shebara.webp |
| Suggested resort Desert Rock | assets/resorts/desert-rock.webp |
| Suggested resort Six Senses Southern Dunes | assets/resorts/six-senses-southern-dunes.webp |
| Selected one-bedroom overwater villa | assets/villas/shebara-one-bedroom-overwater-villa-1.webp |
| Optional alternate crop of same selected villa | assets/villas/shebara-one-bedroom-overwater-villa-exterior.webp |
| Optional interior of same selected villa | assets/villas/shebara-one-bedroom-overwater-villa-interior.webp |
| All other villa types | Exact one-to-one mapping in content.json |
| Adrena tile | assets/activities/adrena-7.webp |
| Alternate Adrena image | assets/activities/adrena-day-pass.webp |
| Garden experience tile | assets/activities/garden-discovery-and-planting-experience.webp |
| Paddleboarding tile | assets/activities/stand-up-paddle-boarding.webp |
| Visible chat background | assets/resorts/shebara.webp or assets/site/resorts-hero-shebara.webp |
| Secondary general site context | assets/site/hero-video-poster.webp |
| Concierge avatar | assets/logos/vrs-turtle-mark.svg |
| Visit Red Sea identity | assets/logos/vrs-logo-light.svg / vrs-logo-dark.svg |
| Shebara resort mark, if useful | assets/logos/shebara-logo-main-color.svg |
| Final A4 summary PDF identity | assets/logos/rsg-logo-horizontal.svg; stacked variant also included |
| Arabic/body type | assets/fonts/FedraSansAL-*.woff2 |
| Selective display type | assets/fonts/FedSerDis-*.woff2; FedraSerifArabic-*.woff2 |

Do not assign a different resort's photo to Shebara, or a different villa's photo to the selected villa. Cropping is allowed; stretching, fake property imagery, and changing logos are not. Large transport photos are intentionally absent from the redesigned transport component.

## Recorded booking evidence

- reference_screenshots/01_shebara_booking_summary_23-25_oct_2026.png: accommodation, dates, adults, total 28,980.00 and taxes.
- reference_screenshots/02_shebara_transportation_yanbu_to_rsia.png: airport fields, arrival/departure products, 3,622.50 + 1,191.40 = 4,813.90.
- reference_screenshots/03_guest_information_fields.png: guest field structure, optional wife fields/requests and consent context.
- Grand total is arithmetic: 28,980.00 + 4,813.90 = 33,793.90, no booked activities and no added tax.
- The project owner supplied the prepared guest identity: محمد باز, +966 508416627, manually entered muhammed.baz@clouding.ai. Wife remains نورة الحربي. Existing prepared voice scenario includes an optional late-check-in request.

## Missing factual inputs / integration limits

1. Other 7 villa prices for 23–25 October 2026, 2 adults: not supplied. Do not invent them or assert inventory availability. Omit their price and note the gap in handoff; the one selected villa's amount is available.
2. Dedicated villa-page URLs: not evidenced. The known official Shebara page lists the accommodation types. It is the honest fallback for image links, until genuine dedicated URLs are provided/verified. Never invent an anchor.
3. Corporate RSG fonts Questa Grande / Paralucent: not present. Use an explicitly documented supplied-font fallback for the PDF.
4. Activity prices/date availability: not required for the simplified cards, which show image + name only. Source files contain historical examples; do not expose these as a live quote.
5. No reservation number is provided; do not manufacture one. The existing post-payment 5-second continuation is scripted, not an actual payment verification response. Existing voice extraction uses a prepared mapping, not general speech recognition.
6. Email verification service exists in the working project; this design kit deliberately excludes it and all credentials. Design its states without trying to send mail or requiring account setup.

## Brand references

Chat/site: aqua #71bfb7, deep teal #37706c, charcoal #1e282f, pale aqua #e6f6f5, off-white #fafaf7. Values were observed in the existing project; not a complete official manual.

RSG PDF: navy #04253c, darker navy #0a1d2d, restrained gold #b89c67. Preserve the actual supplied RSG logo.

The original source/provenance tables are in reference_sources/ORIGINAL_ASSETS.md and ORIGINAL_SOURCES.md. Some referenced assets or external evidence are outside this deliberately scoped package. Do not claim they are included or accessible without checking.

## Full included visual asset inventory

'''
for rel in asset_paths:
    p = KIT / 'assets' / rel
    manifest += f'- `assets/{rel}` — {p.stat().st_size:,} bytes\n'
(KIT / 'CONTENT_AND_ASSET_MANIFEST.md').write_text(manifest, encoding='utf-8')

import html
gallery_cards = []
for rel in asset_paths:
    if rel.startswith('fonts/'):
        continue
    label = 'assets/' + rel
    gallery_cards.append(f'<figure><div class="preview"><img src="{html.escape(label)}" alt="{html.escape(rel)}" loading="lazy"></div><figcaption>{html.escape(label)}</figcaption></figure>')
gallery = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RSG design kit — actual asset index</title><style>body{margin:0;padding:32px;background:#fafaf7;color:#1e282f;font:15px/1.5 Arial,sans-serif}h1{margin:0 0 8px}p{max-width:900px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:18px}figure{margin:0;border:1px solid #dadfe3;border-radius:12px;overflow:hidden;background:#fff}.preview{height:185px;background:#1e282f;display:flex;align-items:center;justify-content:center}.preview img{width:100%;height:100%;object-fit:contain}figcaption{padding:12px;overflow-wrap:anywhere;font-size:12px}</style><h1>RSG rich-component design kit</h1><p>Visual index of actual supplied project assets. This is an asset catalog, not a proposed new component design. Match each image to its content.json record. Original files retain their names and proportions.</p><div class="grid">''' + ''.join(gallery_cards) + '</div></html>'
(KIT / 'ASSET_GALLERY.html').write_text(gallery, encoding='utf-8')

hashes = {}
for p in sorted(KIT.rglob('*')):
    if p.is_file() and p.name != 'SHA256SUMS.json':
        hashes[p.relative_to(KIT).as_posix()] = hashlib.sha256(p.read_bytes()).hexdigest()
(KIT / 'SHA256SUMS.json').write_text(json.dumps(hashes, indent=2), encoding='utf-8')

zip_path = ROOT / 'RSG_Rich_Components_Design_Kit.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as archive:
    for p in sorted(KIT.rglob('*')):
        if p.is_file():
            archive.write(p, p.relative_to(ROOT))

print(json.dumps({'prompts': [str(ROOT / n) for n in INTROS], 'kitZip': str(zip_path), 'visualAssetCount': len(asset_paths), 'kitFileCount': len(hashes) + 1, 'zipBytes': zip_path.stat().st_size, 'commonPromptWords': len(COMMON.split())}, ensure_ascii=False, indent=2))
