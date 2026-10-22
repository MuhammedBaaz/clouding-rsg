# Quiet Tide / هدوء البحر — developer handoff

## Background refinement

All 15 rich-component groups now share coordinated coastal backgrounds without changing content, dimensions, typography or interactions. Resort suggestions, villas, experiences and forms use warm sand / soft aqua gradients; calendar, transport, summaries, review and verification use aqua with sand accents. Payment and confirmation use deep teal with high-contrast pale text and light action buttons. The supplied Shebara photograph adds a subtle layer to the resort detail strip and confirmation card. Fields and OTP cells retain light solid fills. The composer uses the same aqua-to-sand family, including voice states. These rules are in the `Quiet Tide backgrounds` block of `style.css` and apply to the board and contextual chat simultaneously. The separate RSG A4 document retains its existing corporate treatment.

Surface tokens: `--surface-aqua: #e1f1ec`, `--surface-sand: #f1e8d8`, `--surface-teal: #285b57`, `--surface-border: #c4d8ce`, `--surface-light: #f4fbf5`. State colors remain explicit for selected, invalid and disabled controls.

## Scope and entry points

This is a separate inspectable design proposal. Neither `visitredsea-chat-mockup` nor `visitredsea-chat-mockup-v2` was edited. Launch `node server.cjs`, then visit `http://127.0.0.1:4175`. The board exposes all 15 groups through state selectors. The contextual prototype includes eleven journey shortcuts and 472 / 390 / 360 size controls. `summary.html` is the A4 source, and `final-information.pdf` is the exported original scenario.

## Tokens

| Role | Value |
|---|---|
| Aqua / subtle brand accent | `#71bfb7` |
| Deep teal / primary control / selected state | `#37706c` |
| Charcoal / main text | `#1e282f` |
| Pale aqua / selection support | `#e6f6f5` |
| Off-white / readable card surface | `#fafaf7` |
| Canvas | `#f5f5f0` |
| Sand / secondary stage | `#f1eee7` |
| Divider | `#dce3df` |
| Secondary text | `#596967` |
| Validation | `#a54035` |
| RSG PDF navy | `#04253c` |
| RSG PDF dark navy | `#0a1d2d` |
| RSG PDF restrained gold | `#b89c67` |

Type: supplied `FedraSansAL-Book.woff2`, Medium, and Bold. Verified font metadata: **Fedra Sans AL Book**, Arabic glyph coverage present. Selective Arabic headings: supplied `FedraSerifArabic-Book.woff2` (**Fedra Serif Arabic Book**, Arabic glyph coverage present). Brand names: supplied `FedSerDis-Regular.woff2`. Fallbacks: Arial/sans-serif and serif. The PDF uses these supplied Fedra faces as explicit fallbacks for absent Questa Grande / Paralucent; it does not claim the corporate typefaces are installed.

Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 px. Card radius 15 px, input 7 px, thumbnails 8 px, shell 19 px. Card padding 12 px on mobile, 15 px on desktop. Card shadow `0 3px 9px #12332b05`; contextual cards have a slightly stronger shadow for photograph contrast. Essential input text 13 px, chat text 13–14 px, headings 14–19 px, secondary information 11–12 px. Small legal/metadata 10 px. Teal uses white type; aqua is not used behind white essential text.

## Dimensions, structure and responsive behavior

- Desktop chat 472 × 790 px. Target mobile 390 × 760 and 360 × 760 px. On a narrow page the surrounding studio gutters reduce the panel; it remains fully usable at that width. Dedicated QA captures also exercise the chat at exactly 390 and 360 px.
- Agent components align **left**, customer bubbles **right**, independently of document RTL. Message columns use 89% of the conversation width (92% on mobile). No horizontal page scroll.
- Photographs reserve width/height. The chat backdrop is the actual `assets/resorts/shebara.webp`, positioned at 43% center with a restrained transparent overlay. No near-opaque wash. Card surfaces carry text contrast.
- Resort rows: 50–57 px thumbnails, three rows in one turn. Villa rows: 63 × 68 px crops, first two shown, remaining six through disclosure. Selected villa collapses to one row; its sole rate choice appears immediately below its selection area. Experiences remain three adjacent columns with 71–81 px thumbnails, names only.
- Calendar is one range surface, Sunday-first Gregorian October 2026. Four leading blanks align 1 October with Thursday. Selected endpoints 23 and 25 and intermediate 24 are distinct. 36 px cells are a deliberate compact calendar exception; preserve adequate pointer spacing and screen reader labels. The production calendar should extend date navigation and use actual pricing constraints.
- Forms have a coordinated two-guest structure. Main first name is remembered. Wife names and request remain optional. Main title, names, email, code, phone match source fields. Marketing is optional and unchecked in the original scenario. Flight details are optional and unfilled.
- A4: 210 × 297 mm, at least 15 mm lower/safe print margin and 17 mm side margins. RSG horizontal logo retains the original artwork and aspect ratio; its white lettering sits on navy.

## Content contract

`content.json` is the source dataset from the kit. Arabic villa/transport/experience labels are working UI translations, not claimed official localized brand names.

| Field | Exact source identifier | Display / recorded value |
|---|---|---|
| Resort | `Shebara` | Shebara / جزيرة شيبارة |
| Villa | `One Bedroom Overwater Villa` | فيلا فوق الماء بغرفة نوم واحدة |
| Rate | `Villa Flat Rate` | السعر الأساسي للفيلا |
| Dates | `2026-10-23` → `2026-10-25` | 2 nights, 2 adults, 0 children |
| Arrival airport | `Yanbu Airport` | مطار ينبع |
| Departure airport | `Red Sea International Airport - RSIA` | مطار البحر الأحمر الدولي – RSIA |
| Other selectable airport | `Al Wajh Domestic Airport` | مطار الوجه المحلي |
| Arrival transfer | `Private Luxury Car + Shared Leisure Boat` | سيارة فاخرة خاصة + قارب ترفيهي مشترك |
| Departure transfer | `Shared Speed Boat + Private Luxury Car` | قارب سريع مشترك + سيارة فاخرة خاصة |
| Main guest | محمد / باز / السيد | محمد باز |
| Contact | `+966` / `508416627` | `muhammed.baz@clouding.ai` entered manually |
| Wife | نورة / الحربي | Optional fields filled in the scenario |
| Request | تسجيل وصول متأخر إن أمكن | Request only, no guarantee |

Arithmetic: **28,980.00 + 3,622.50 + 1,191.40 = 33,793.90 SAR**. Transport subtotal **4,813.90**. All figures include taxes; accommodation is the **entire stay**, not per night. Zero activities booked, no additional tax, no discount or second rate plan. The villa discovery price is explicitly tied to 23–25 October. Other dates, villas, airports or party sizes require an integration re-quote; the prototype refuses to carry the amount into unsupported selections.

## Image map and crops

| Source identifier | Included image | Crop notes |
|---|---|---|
| Shebara | `assets/resorts/shebara.webp` | Sunset aerial: preserve visible overwater ring; 50% center in row, 43% center backdrop |
| Desert Rock | `assets/resorts/desert-rock.webp` | Night pool and mountain architecture; 50% center |
| Six Senses Southern Dunes, The Red Sea | `assets/resorts/six-senses-southern-dunes.webp` | Arrival canopy architecture; 50% center |
| One Bedroom Overwater Villa | `assets/villas/shebara-one-bedroom-overwater-villa-1.webp` | Frontal silver pod and pool; center |
| Two Bedroom Overwater Villa | `assets/villas/shebara-two-bedroom-overwater-villa.webp` | Frontal villa and pool; center |
| One Bedroom Beach Villa | `assets/villas/shebara-one-bedroom-beach-villa.webp` | Beachfront exterior; center |
| Two Bedroom Beach Villa | `assets/villas/shebara-two-bedroom-beach-villa.webp` | Dusk beachfront pool; center |
| Three Bedroom Beach Crown Villa | `assets/villas/shebara-three-bedroom-beach-crown-villa.webp` | Night pool/rounded villa; center |
| One Bedroom Beach Crown Villa | `assets/villas/shebara-one-bedroom-beach-crown-villa.webp` | Day pool facade; center |
| Four Bedroom Beach Royal Villa | `assets/villas/shebara-four-bedroom-beach-royal-villa.webp` | Aerial beachfront; center |
| One Bedroom Beach Royal Villa | `assets/villas/shebara-one-bedroom-beach-royal-villa.webp` | Sunset facade and planting; center |
| Adrena | `assets/activities/adrena-7.webp` | Aerial water park; center |
| Garden Discovery and Planting Experience | `assets/activities/garden-discovery-and-planting-experience.webp` | Palm avenue; center |
| Stand Up Paddle-Boarding | `assets/activities/stand-up-paddle-boarding.webp` | Paddleboard on aqua water; center, preserve board |
| Concierge | `assets/logos/vrs-turtle-mark.svg` | Original turtle artwork, unchanged |
| Chat brand | `assets/logos/vrs-logo-dark.svg` | Original artwork, unchanged |
| PDF corporate brand | `assets/logos/rsg-logo-horizontal.svg` | Original 140:53 aspect ratio, unchanged |

All photos were visually inspected in `qa/asset-contact-sheet.jpg` before choosing crops. Original rights/provenance is retained in `ASSET-PROVENANCE.md`. Unused alternative photographs remain in assets for future crop review.

## Links

- Resort collection, new tab: https://www.visitredsea.com/en/resorts
- Shebara details and **all villa photo information links**, new tab: https://www.visitredsea.com/en/resorts/shebara
- Villa photo accessible label says information on the **Shebara page**; no dedicated villa page or invented anchor is implied.
- Terms: https://www.visitredsea.com/en/terms-and-conditions
- Privacy: https://www.visitredsea.com/en/privacy-policy
- Checkout, unchanged, new tab:

```text
https://www.visitredsea.com/en/booking/checkout?startDate=2026-10-23&endDate=2026-10-25&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortName=Shebara&hotelId=1035&currency=SAR
```

No external payment link is followed by QA. Clicking payment in the **board** is local state inspection. In the **chat** it opens the given checkout address and starts the five-second presentation continuation. The prototype never submits checkout, collects cards, purchases, or receives a payment webhook.

## State and interaction contract

The board includes all supplied requirements: resort default/consumed; details; villa default/selected/full catalog/re-quote; calendar empty/first/completed/invalid/confirmed; accommodation and updated summary; arrival modes; airport empty/selected/optional/validation; transport selected; adjacent experiences; guest initial/voice/email-completed/invalid/editing; composer idle/permission/error/recording/preview/cancelled/sent; review/edit/saved; OTP initial/sending/sent/invalid/expired/delivery failure/verified; payment/quiet waiting/closure; final confirmation/PDF preview.

Production event names can mirror `data-action` handlers. The design stores only guest edits in this browser's localStorage (`quiet-tide-guest`). The final confirmation and PDF render the latest saved values; cancel restores the prior values. Changing email clears `verified`. After edit/save the next continue must re-verify before payment when email changed. Stay and transfer selections are not editable inside guest review; unsupported catalog and date selections show a re-quote requirement.

Prepared voice data: محمد باز, +966 508416627, نورة الحربي, optional late check-in request. It **does not contain email**. The microphone is a local animated presentation in the same composer entry area. Stop produces preview; cancel restores typing; send creates a customer-side audio bubble and fills the one coordinated form except email. No `getUserMedia`, audio capture, audio file, speech recognition, or server extraction is implemented. Playback icons show visual playback only; they do not play fabricated audio. The sparkle is an icon with Arabic accessible label/tooltip; remembered first name uses a conversation icon. Editing a marked field immediately removes its extraction marker.

OTP uses empty boxes and never supplies a code. The six entered characters are never accepted as a working verification secret; incomplete entry receives validation, complete entry demonstrates an invalid state. Sending in chat shows the retry failure state because no service is connected. The external studio button **عرض حالة التحقق المكتمل** is the explicit design-state control for advancement. In production, a server response must drive this transition. No emails were sent and no credentials were requested.

The **five-second** payment timer is scripted presentation behavior, **not evidence of payment-provider verification**. Production must replace it with an authenticated result. Final visual confirmation carries no invented reservation number or receipt. The PDF is a designed information document and is not claimed to be issued by RSG's booking system.

## Timing, reading position and motion

`reply(items)` uses short 1.8 s, normal 3.2 s, long 5 s, card 2.8 s delays, with 1.1 s between items. The review speed selector multiplies these delays; default is natural. Typing dots, recording waveform and loading icon honor reduced-motion preferences. A queued reply displays one item at a time.

On a customer-triggered turn, only the first typing/reply position may be brought into view once. Subsequent cards, messages and image loading never scroll the container. `overflow-anchor:none` prevents browser anchoring from shifting reading position. The stable header says `المساعد يكتب…` for the entire queue. An explicit `رسائل جديدة` control scrolls only when clicked. The external **عرض الكتابة أثناء قراءة السابق** control holds earlier content in view while later messages arrive over 22 seconds, so this behavior is inspectable.

## Arabic, numbers and accessibility

- Root and Arabic controls RTL; message layout container LTR independently controls side placement.
- `bdi` / `dir=ltr` isolate prices, Western digits, dates, email, codes, phone and brand names. All numeric formatting uses `en-US`; source resort spelling is retained.
- Labelled native inputs and selects; icon-only controls have Arabic names; visible focus indicators; form errors near affected fields. OTP inputs are numeric and advance focus, with per-digit labels. Marketing remains optional and unticked by default.
- Selected endpoints use color plus shape; selection rows have checks and labels. Light gradient cards and deep teal closing cards provide text contrast over recognizable photography; fields retain light solid surfaces.
- No tiny text was used to force fit essential controls. Calendar grid is the documented compact-control exception. Production should validate touch operation and screen readers, focus restoration after replaced state components, and final accessibility conformance; a generated PDF is not tagged as an accessible PDF/UA document.

## Missing facts and limits

1. Seven alternate villa prices, and actual date-specific inventory. The catalog omits those amounts and makes no availability statement.
2. Genuine dedicated deep links for each villa. The verified-from-kit Shebara page is the honest fallback; no new web verification was necessary or claimed.
3. RSG Questa Grande / Paralucent fonts, absent from kit.
4. Flight times, airline and flight number; kept empty. No duration, vehicle inventory, or unprovided benefit is added.
5. Real reservation ID, payment result, receipt and OTP response. None is fabricated. Service integration is outside this design task.
6. The preview's updated PDF download uses local Node + Playwright/Chrome for reliable Arabic shaping and WOFF2 embedding. Directly opening static HTML retains the original PDF fallback; use the preview server for a PDF reflecting edits. No external host was published.

## Verification

See `qa/QA-REPORT.md` for executed checks and screenshot paths. Browser QA and PDF export use the installed Chrome through Playwright. PDF pages are rendered with Poppler for visual inspection. No external booking action, email send, microphone request or purchase is part of verification.
