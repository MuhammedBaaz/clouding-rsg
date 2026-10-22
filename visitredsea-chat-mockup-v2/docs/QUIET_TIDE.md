# Quiet Tide design and quick replies (V2)

Historical implementation notes. The Quiet Tide appearance was rejected after contextual review and superseded by [PHOTOGRAPHIC_ATELIER.md](PHOTOGRAPHIC_ATELIER.md). Its functional Quick Reply mapping below is retained; its visual styling is no longer the active design.

Previously implemented 20 October 2026 from `D:\Clouding\RSG\design-proposals\quiet-tide` (HANDOFF.md, style.css including the "Quiet Tide backgrounds" block, app.js markup, content.json, summary.html). That visual direction is now superseded. V2 keeps its own engine, real microphone recording, server-side e-mail verification, guest editing, checkout link and in-browser PDF.

## What was ported

- `css/quiet-tide.css`: the component rules and the coordinated backgrounds (pale aqua/sand gradients, deep teal payment and confirmation, Shebara photo layers on the detail strip and the confirmation card), the 472 px panel with the Shebara backdrop at 43% center, header, bubbles, composer family and the quick-reply chips. Loaded after `chat.css` and `v2.css`.
- `js/chat.js` components: all 15 groups use the design markup (`.component[data-component=…]`): resort suggestions with consumed state, detail strip, eight villas with disclosure and the honest photo link to the Shebara page, range calendar on a tinted surface, summary with and without transport, arrival modes, one airport form with optional flight disclosure, two transfer rows, three experience tiles, the coordinated guest form (remembered name mark, voice marks, manual e-mail, edit/save/cancel), review with an unchecked terms acknowledgement, verification with six boxes and all server states, payment with the quiet waiting state, and the final information card. Inline SVG icons replace the prototype's icon font.
- `data/script.js`: shorter Saudi Arabic copy in the design's tone; the child-policy, amenity and "how many nights" wording was removed. Villa, rate, transfer, airport and experience display names come from the design dataset as working translations (`nameAr`, `productAr`, `airportsAr` beside the English identifiers in `data/`).
- `js/pdf.js`: the A4 final-information page follows `summary.html` (navy band with the official horizontal RSG logo, gold rule, headline, hero, stay grid, guests, transfers, totals, footer) and renders the latest saved guest values. Fedra faces are the documented fallback for RSG's Questa Grande and Paralucent.

## Quick replies

Reply items in `SCRIPT` may carry `quick: [{ id, label, primary }]`. `deliver()` renders the group after that turn's messages and cards, bound to the stage current at render time; older groups are consumed when a new one appears. A click is ignored when the group is consumed, a reply is still being delivered, or the stage no longer matches. An accepted click consumes the group, appends exactly one customer message (the label, or the engine's own line for dates, airports, villa and resort actions) and runs the normal `act() → stageSpec()` transition. Ids resolve through `QUICK` in `js/chat.js`, never through the visible label or a text search.

| Stage / branch | Chips | Action id → engine meta |
|---|---|---|
| resort `other`, fallback | نكمل مع Shebara | `resort_shebara` → resort Shebara |
| villa `ok` | none (21 Oct 2026: the guest-count question is answered by typing) | – |
| villa `other` | نكمل على فيلا فوق الماء بغرفة نوم واحدة | `villa_supported` → villa (priced one) |
| party fallback | none | – |
| dates `ok`, approve1 fallback | مناسب، نكمل / أراجع التفاصيل | `approve1_ok` → approve; `approve1_review` → scroll to the summary, no message |
| dates `other` | اختيار 23 إلى 25 أكتوبر 2026 | `dates_supported` → dates 23–25 Oct |
| mode `other` | نعم، بالطائرة | `mode_plane` → mode By Plane |
| airports `ok`, approve2 fallback | اعتمد ونكمل / أراجع الملخص | `approve2_ok` → approve; `approve2_review` → scroll, no message |
| airports `other` | نكمل على مطار ينبع ومطار البحر الأحمر الدولي | `airports_supported` → the recorded airports |
| approve2 `ok`, activities `add`, fallback | نختار عند الوصول / نعم، نكمل الحجز | `activities_defer` → defer |
| guest `ok`, review `updated`, `terms`, fallback | البيانات صحيحة، نكمل / وافقت، نكمل | `review_confirm` → confirm; refused with a message while the terms box is unchecked |

No chip submits a form, checks the terms box, skips the server OTP, marks the e-mail verified or claims payment. Typed approvals go through `approves()`, which rejects explicit negatives such as مو موافق or غير موافق. The guest-details request has no chip; the form is the action. Since 21 October 2026 the chips carry no visible heading and are rendered inside the agent message they answer (after the bubble, before its time label), as rounded aqua/teal suggestion chips.

## Limits

- Per-villa pages are not evidenced; villa photos open the official Shebara page and say so in their accessible name. The other seven villas show no price.
- The five-second continuation after the payment click is presentation behaviour, not a payment-provider result; the closing copy says the details are ready, not that payment was verified.
- The prepared voice mapping fills the form from `scenario.voice`; it is not speech recognition. E-mail is never part of it.
- Verification states come from `server.py`; configuration problems are shown as short Arabic notices, details go to the browser console only.
