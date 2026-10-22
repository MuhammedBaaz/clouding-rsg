# RSG concierge × Empathy Studio rich components — Phase 1 proposal

Status: **approved and implemented (Phase 2, 22 October 2026)** in both applications with the defaults listed under section 3; this folder stays as the proposal record. Live-route captures of the integrated apps: `screenshots/phase2/`.

Open the board: `python -m http.server 8095` in this folder, then http://127.0.0.1:8095/index.html (toggle V1 / V2 at the top). Chat-context frames: `chat-context.html?v=v1|v2&at=N`. Screenshots: `screenshots/` (board-*.png, chat-{v1,v2}-{desktop,390,360}-{component}.png captured through the DevTools Protocol at true viewport widths).

## 1. References actually inspected

Google Drive folder `1a72TILGy2kVlpwDnCilPvqhovpOxavGd` ("previous demos") holds demo videos (MP4) and one PDF only; no component source there. The implementation came from the chat-widget repository upload in the same Drive (owner hazem.salah@clouding.ai, uploaded 2026-09-21, folder `chat-widget` → `src`, `docs`, `specs`, `examples`):

| Need | Source file (Drive) | Used for |
|---|---|---|
| Carousel renderer | `src/rich-components/carousel.ts` | scroll track, snap, arrows, card width rule (320 px floor, peek), per-card selection |
| Carousel card renderer + CSS | `src/rich-components/carousel-card/index.ts`, `styles.ts` | media/badge/title/subtitle/markdown/3-button layout, lock_after_selection |
| Selection List Picker + CSS | `src/rich-components/selection-list-picker/index.ts`, `styles.ts` | rows, icon via IconResolver, badge, lock |
| Grouped List Picker (= Sectioned Multi-Select) + CSS | `src/rich-components/grouped-list-picker/index.ts`, `styles.ts` | chips, single vs multi select, send button, `Group: Option` message format |
| Confirmation Card + CSS | `src/rich-components/booking-confirmation/index.ts`, `styles.ts` | header image, badge, 3 detail rows (SVG url icons), instructions, non-locking buttons |
| Reply buttons (web) | `src/rich-components/buttons.ts`, `button-group.ts`, `styles.ts` | pill buttons, single use |
| Dispatch | `src/rich-components/rich-renderer.ts`, `registry.ts`, `types.ts`, `auto-loader.ts` | `rc-container`, selection persistence, type names |
| Icons | `src/icons/icon-resolver.ts`, `icons/types.ts` | Lucide SVG fetched from `https://unpkg.com/lucide-static@1.7.0/icons/{name}.svg`, cached, `iconBaseUrl` configurable |
| Theme hooks | `src/theme/styles.ts`, `theme/css-vars.ts` | `--primary-color`, `--background-color`, `--text-color`, `--border-radius`, `--font-family` |
| Message envelope | `specs/016-rich-components/contracts/rich-messages.md`, `docs/api-v2.md` | `data.type: "rich_components"`, `components[{type,payload}]`; outbound = plain text message = button payload/label |
| Component docs | `docs/rich-components/carousel.md`, `carousel-card.md`, `selection-list-picker.md`, `grouped-list-picker.md`, `confirmation-card.md`, `buttons.md`, `docs/aam-components.md`, `docs/new-rich-component-guide.md` | field tables, behaviour, v1 snake_case / v2 kebab-case type names |
| Shell | `src/messages/styles.ts`, `specs/013-chat-ui-refresh/spec.md` | agent bubble transparent full-width, visitor bubble `#f6f3f4` (not adopted: RSG keeps its shells) |

Schemas: the six Studio schemas (Carousel, Confirmation Card, Selection List Picker, Image, Text, Sectioned Multi-Select = List Picker) were taken from the registered-component reference supplied by Clouding AI in the `empathy-studio` skill (`references/components.md`); their required-property lists match the summary in the request exactly. Copied verbatim into `studio/schemas.js`. The Reply Buttons Message schema (WhatsApp contract) is there too.

Decoded copies of the SDK sources: `reference/sdk/`. Verbatim CSS: `studio/studio-components.css`. Line-by-line JS port of the renderers: `studio/studio-renderers.js`.

## 2. Component mapping

| RSG component (V1 / V2) | Studio component | Payload (RSG data) | Action → customer message | Open points |
|---|---|---|---|---|
| V2 resort suggestions (3 rows + استكشف المزيد) | Carousel, 3 cards | photo, official name, place (subtitle ≤30), facts (description), primary اختيار, payload = `نختار Shebara.` | payload sent as the customer line; adapter → `act({type:'resort'})` | external link stays an RSG link beside the card; Studio locks one card, RSG retires all (adapter disables the rest) |
| V1 resort selection on the page | unchanged | — | — | V1 flow preserved |
| Resort details strip (both) | Carousel, 1 card (standalone info card) | photo, badge = destination, name, place, facts, no buttons | none | V1 details link stays beside the card |
| Villas (8) | Carousel, 8 cards | badge `Villa Flat Rate` on the priced villa, subtitle = whole-stay price, description = occupancy + facts bullets + price basis, primary اختيار, payload = `أختار … على Villa Flat Rate.` | adapter → `act({type:'villa'})`; unsupported villas keep the re-quote reply | villa photo link to the official page has no slot |
| Date-range calendar | **keep** | — | — | no Studio date component |
| Stay summary + approval | Confirmation Card | badge ملخص الإقامة, rows التواريخ / الضيوف / إجمالي الإقامة, instructions = occupancy note, primary مناسب، نكمل | payload = the approval line already accepted by `stageSpec` | replaces the two chips for this turn (decision) |
| Arrival modes | Selection List Picker | 4 rows, Lucide plane / plane-takeoff / car / ship, payload = `بالطائرة.` etc. | adapter → `act({type:'mode'})` | subtitle/badge sent as "" |
| Airports + optional flight details | Sectioned Multi-Select (grouped list picker, multi) | groups مطار الوصول / مطار المغادرة, send تأكيد المواصلات | Studio format `مطار الوصول: X, مطار المغادرة: Y`; adapter parses | one-per-group cannot be enforced; optional flight fields unsupported (drop or keep RSG disclosure) |
| Transfer legs | Carousel, 2 info cards | badge الوصول/المغادرة, product, price, route + duration + capacity + basis | none | departure leg has no photo (media hidden) |
| Updated totals + approval | Confirmation Card | rows الإقامة / المواصلات / الإجمالي, primary اعتمد ونكمل | approval line | as above |
| Experiences | Carousel, 3 info cards | badge category, price (≤30) or first clause + full line in description, tags | none; chips stay | no add-to-booking path in RSG |
| Guest + wife form, voice | **keep** | — | — | free-text inputs unsupported |
| Final review (+ edit in V2) | Confirmation Card | rows الضيوف + المواصلات (pair) / التواصل (full width: the e-mail cannot wrap inside the SDK flex pair), subtitle = villa · rate · dates · airports, instructions = totals + request, primary = the version's approval line (V1 موافق على الشروط، نكمل / V2 البيانات صحيحة، نكمل), secondary (V2) تعديل البيانات | approval line / edit opens the existing form | terms links stay in the agent message |
| E-mail verification | **keep** | — | — | OTP entry unsupported |
| Payment hand-off | Confirmation Card | badge visitredsea.com, amount, rows المنتجع / الفيلا / التواريخ, primary المتابعة إلى الدفع | **conflict**: Studio buttons send text, never open URLs; adapter would `window.open(checkoutUrl)` + start the 5-second timer | needs a decision (or keep the RSG card) |
| Final confirmation + PDF | Confirmation Card | badge تم تأكيد الحجز, rows, instructions = paid total, primary تحميل PDF (download icon) | adapter calls `BookingPdf.make`; echo of "تحميل PDF" as a customer line can be suppressed | — |
| Quick replies | web `buttons` renderer | `{text:"", buttons:[{label,value}]}` beneath the agent message | value = existing chip line | Studio Reply Buttons schema is the WhatsApp contract (≤14-char titles); confirm the web contract |
| Image / Text | not needed | photos live in cards; text stays in RSG bubbles | — | — |

## 3. Assumptions to confirm

1. Every schema key is required with `additionalProperties:false`, while the Studio instructions call most of them optional. Payloads send `""` for unused optional fields (the Studio's own `initial_choice` convention). Confirm that `""` is accepted by the Studio validator.
2. RTL: the SDK sets `dir="auto"` on text nodes but uses physical left/right CSS. The preview hosts components in a `dir="rtl"` container plus six override rules (`studio/studio-rtl.css`). Approve or reject this customization.
3. `visible_count` is an SDK option, not a schema key; it is not used.
4. Theme: `--primary-color` V1 `#37706c` / V2 `#2c6663`, `--font-family` Fedra Sans AL, `--text-color`, `--border-color` per version; card surfaces stay the SDK white `#fff`.
5. Markdown descriptions use bold + bullets only (subset of the SDK parser). Phase 2 would port `src/markdown/*` for fidelity.
