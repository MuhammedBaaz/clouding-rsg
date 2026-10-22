# Tidal Atelier — photographic V2 concierge

The owner rejected the Quiet Tide appearance in the actual chat and requested rich luxury art direction with concise information. This replaces its visual layer in the working V2 application. The earlier proposal folder is unchanged.

## Implementation

- `css/atelier.css` replaces the old `quiet-tide.css` stylesheet link. It defines the complete V2 component system rather than adding another recolor over the rejected stylesheet. Legacy base site/chat styles remain; marketing-page sections are unchanged.
- `js/chat.js` retains the booking engine, Quick Reply map, recording, OTP calls and PDF binding. Component changes add an architectural airport heading and a compact, inspectable transfer disclosure in final review. Microphone labels/errors and remaining shell controls are Arabic. Technical verification notices were shortened for the guest UI; HTTP behavior and diagnostics remain separate.
- `tools/responsive-preview.html` resizes an iframe of the actual application. The iframe is not recreated when changing width, so conversation data survives. The default is the normal working application.
- `?walkthrough=1&context=1` is an explicit visual-review layout for the pre-existing recorded walkthrough. It removes its document annotations after playback and restores the real chat shell. `tools/responsive-preview.html?recorded=1` labels this mode outside the guest interface. It uses the existing prepared walkthrough behavior, makes no email/recording/checkout requests, and proves no real verification or payment result. Normal sessions do not enter this path.

## Visual system

Marine ink `#142f35`, deep marine `#153e44`, teal `#2c6663`, aqua accent `#9bd0c5`, ivory `#f7f1e7`, supporting text `#50655f`, error `#9d392c`. Corners are 4–10 px for controls/cards and 20 px on the desktop shell. Main control heights are 42–44 px. Essential text is 13–14 px; supporting labels 11–12 px. The desktop panel is 472 px wide and adapts to available height. Mobile fills the viewport at 390 and 360 px widths.

Components use separate `::before` photographic and `::after` contrast layers, controlled through `--component-image`, `--component-crop`, and `--component-overlay`. Content never inherits photographic opacity. Discovery tiles use their actual image elements as full surfaces, preserving image-to-property mapping and normal browser image semantics. Inputs and code cells remain solid, warm and readable. No stock/generated images, new libraries, or external font downloads were introduced.

### Typography

Component headlines: local `FedraSerifArabic-Book.woff2` and `FedraSerifArabic-Demi.woff2`, registered as `AtelierArabic`. Their real metadata was inspected; Arabic glyph coverage is present. Resort names and prices use local `FedSerDis-Regular.woff2`, registered as `AtelierDisplay`. Supporting text and input controls retain the supplied Fedra Sans AL for readability. The new pairing deliberately changes the component hierarchy and expression; it does not rely on a Latin font falling back silently for Arabic.

RSG PDF typography remains its documented supplied-font fallback because the corporate faces are absent. Its corporate logo/navy/gold identity remains separate from the chat art direction.

### Photographic families

| Component | Actual image / treatment |
|---|---|
| Resort suggestions | Each resort's supplied photo, full-width 87 px strips, directional marine contrast, ivory selection control |
| Resort details | The chosen resort's own photo, protected Arabic location and official link |
| Villas | Each of the eight mapped villa photographs, full linked surface with independent selection button and separate external-link affordance |
| Calendar | `assets/site/hero-video-poster.webp`, visible lagoon around an ivory date grid; transparent photographic footer |
| Accommodation / updated summaries | `assets/site/resorts-hero-shebara.webp`, dusk architecture and light numeric hierarchy |
| Arrival modes | Lagoon photograph with clear four-way selection |
| Airport / guest forms | Selected villa's actual interior, architectural photo heading and protected ivory fields |
| Transfers | Lagoon photograph around two small ivory product/price rows; no invented vehicle image |
| Experiences | Exactly the three mapped images, with names on protected lower image areas; image/name only |
| Review | Selected villa exterior, photographic heading, light body and transfer disclosure |
| Email verification | Selected villa interior, pale contrast plane and distinct code cells |
| Payment | Selected villa exterior with a dark marine contrast layer and large readable total |
| Confirmation | Shebara aerial photograph, graded protection over detail groups and PDF action |
| Composer / recording | Quiet photographic interior texture with opaque entry/recording area; real recorder unchanged |

All villa/resort/experience source identifiers, prices, occupancy and URLs stay in the existing `data/` files and match the source kit. Background photography never implies an additional amenity, vehicle or product.

## Preserved behavior

Agent messages/components stay LEFT; customer messages stay RIGHT. Text is RTL and contact details/brand names/prices are isolated LTR. All numerals remain Western. The three resort choices, all eight villa types, one range calendar, one airport form, deferred experiences and coordinated guest/wife form remain.

Quick Replies still use stable action IDs, stage guards, single customer-message dispatch, stale-action consumption and refusal detection. Review actions do not erase data. Terms acknowledgement is explicit and unchecked; marketing is separate and optional. Guest edits flow to later confirmation and PDF; changing email invalidates verification.

The microphone still uses `getUserMedia`, `MediaRecorder`, `AnalyserNode` and real playback, within the normal composer. Prepared voice extraction leaves email empty and is not speech recognition. Field markers are icon-only and disappear on edit. No microphone permission is requested by visual review.

OTP remains server-backed through `server.py`. No SMTP settings or secrets were changed. Checkout URL/parameters and the five-second prepared continuation remain. The timer is not payment verification and generates no booking reference or receipt.

Image sizes are reserved. Header typing status persists for the reply queue, and later messages do not move the reading position. The explicit new-messages action remains the guest's way to jump. Reduced-motion preferences are respected.

## Recorded scenario and limits

23–25 October 2026, 2 nights, 2 adults, 0 children; Shebara, One Bedroom Overwater Villa, Villa Flat Rate. Accommodation 28,980.00 SAR for the whole stay; arrival 3,622.50; departure 1,191.40; transport 4,813.90; total 33,793.90 including taxes; no activities. No new quote or availability is inferred for other choices. The seven missing prices, dedicated villa URLs and RSG corporate font files remain missing.

See [the contextual QA report](../reports/atelier/QA_REPORT.md) for actual application screenshots and verification results. Service-dependent tests and recorded visual review must be distinguished from live provider results. The normal journey, editing, terms, Quick Replies, reading position and PDF export were exercised. A temporary localhost SMTP sink verified code-entry, wrong-code, cooldown and server-confirmed success without delivering real email. Live microphone hardware and real payment were not exercised.
