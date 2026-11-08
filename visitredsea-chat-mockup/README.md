# Visit Red Sea concierge: scripted booking conversation

A local replica of the visitredsea.com home page with a concierge chat. The reviewer types the customer's side of the conversation in Saudi Arabic (or acts on the cards and on the page); a deterministic script returns the concierge's prepared replies and English rich components for one fixed route: Shebara, One Bedroom Overwater Villa, Villa Flat Rate, 2 adults, 23 to 25 October 2026. The guest details are spoken into the composer microphone and filled into the form from a prepared mapping, the e-mail is verified with a real code sent by `server.py`, and the final card downloads a Red Sea Global branded booking-summary PDF generated in the browser.

Prepared by Clouding, October 2026. Nothing here is operated by or affiliated with Red Sea Global. At the project owner's request the page itself carries no label saying so; this README and `docs/` are the record.

## Run it

The page and its verification API must come from the same local HTTP origin. Opening `index.html` as a file, or serving the folder with a plain static server, breaks the e-mail step (the Verify card then says exactly that).

Windows, from this folder:

```bash
start.cmd
```

`start.cmd` picks port 8080 (or the next free one), starts `server.py` and opens the browser at the printed address, normally http://127.0.0.1:8080/. Press Ctrl+C in that window to stop. The same without the helper:

```bash
python server.py 8080
```

`index.html?open=1` opens the chat on load. `index.html?walkthrough=1` renders the complete scripted route as a document (used to regenerate `RSG_Full_Conversation.pdf` with a headless browser print, then rasterised; nothing is e-mailed and no microphone is used during that export).

### E-mail verification settings

`server.py` sends the 6-digit code through an authorised SMTP account. Copy `.env.example` to `.env` next to `server.py` and fill in:

| Variable | Meaning |
|---|---|
| `OTP_SMTP_HOST`, `OTP_SMTP_PORT` | Mail host and port (587 STARTTLS, 465 SSL, 25 plain) |
| `OTP_SMTP_SECURITY` | `starttls` (default), `ssl` or `none` |
| `OTP_SMTP_USER`, `OTP_SMTP_PASSWORD` | Login of the authorised account |
| `OTP_SMTP_FROM` | Approved sender, for example `Red Sea Concierge <name@domain>` |
| `OTP_ALLOWED_RECIPIENTS` | Comma-separated list; defaults to `muhammed.baz@clouding.ai` |

Values already present in the process environment win over `.env`. `.env` is ignored by git and must never be shared. Until the four SMTP values are set, `GET /api/otp/status` reports `configured: false` and the Verify card says that sending is not configured; there is no console fallback and no code is ever shown in the browser. The server keeps the code hashed in memory for 5 minutes, allows 5 attempts, applies a 30-second resend cooldown, invalidates an earlier code when a new one is issued, and consumes a code once verified.

`tools/local_smtp_sink.py` is a test aid only: it accepts SMTP connections on a local port and prints what it receives. Pointing `server.py` at it exercises the sending path without any real mailbox. A send that the sink accepted says nothing about delivery to a real inbox.

## How the conversation works

Every rich component (cards, forms, calendar, summaries, verification, confirmation) is in Arabic and laid out right-to-left, with Western digits, Gregorian dates (for example الجمعة 23 أكتوبر 2026), SAR amounts, and the published English names of resorts, villas, transfer products and airports kept as they are. The Arabic strings for data items live beside the English ones in `data/booking.js`, `data/villas.js` and `data/resorts.js` (`*Ar` fields); component wording is in `js/chat.js`. Speaker placement is unchanged: concierge on the left, customer on the right. The page replica itself stays in English; only the assistant-added اختر buttons and their icon-only sparkle marker (tooltip: أظهر المساعد هذا الزر لمساعدتك على اختيار المنتجع) are Arabic.

**Component design and Quick Replies (20 October 2026).** The rich components use the photographic design approved in V2: every card is a real photo layer with its own contrast layer (`--component-image`, `--component-crop`, `--component-overlay` in `css/atelier-components.css`), Fedra Serif Arabic headings, ivory form controls and one price hierarchy; only those component rules were carried over, the panel, header, bubbles, background and composer are V1's own. Wherever the concierge asks for an approval or a continuation (both summaries, the unsupported villa/dates/mode/airport replies, the experiences step, the final review, the resort reply on the page flow) a row of rounded suggestion chips appears inside that assistant message, directly under its bubble on the left, in the aqua/teal palette. A chip posts exactly one customer message and runs the same stage transition as a typed answer; the ids resolve through `QUICK` in `js/chat.js`, a group is retired once used or once the turn is answered by typing, and a stale or busy click does nothing. The two review chips only scroll to the summary. Forms, the e-mail code, the checkout link and the PDF keep their own actions; the guest-count question and the guest-details request have no chip.

**Round 6 (25 October 2026).** Inside the comparison, each Shebara and Desert Rock entry carries a small photo of that resort beside its name (the same image every time, linking to the resort's official page). A Studio carousel card has a single image field, so the thumbnails are an RSG hook (js/chat.js `compareThumbs`, css/studio-rsg.css); other resort cards are unchanged. The recommendation now opens from what the customer actually said (a holiday with his wife) and mentions the sea only as a reason for recommending Shebara.

**Round 5 (25 October 2026).** The Shebara or Desert Rock comparison is now one Studio information card per criterion (setting and access, architecture and stay, views and atmosphere, distinctive experiences, who it suits), each naming what Shebara offers, what Desert Rock offers and the difference; the facts are in `data/resorts.js` (`RESORT_COMPARE`) with their research sources. Returning customers: the approved demo account is an **application-stored profile**, not an RSG customer database record. `private/profiles.seed.json` holds it, and `server.py` inserts it into the profile store (`PROFILE_STORE`, default `private/profiles.json`) once at start; an address already in the store, or seeded before, is never overwritten or re-added. Special requests are never stored or restored: after the code is verified and the profile retrieved, the concierge asks whether the guests have a special request, waits, and only then sends the complete form with the saved details and the request just given (empty if they decline; an unclear answer gets one clarification). Arabic values such as the wife's name are no longer wrapped in an isolating element, so an attached prefix joins them (ولنورة).

**Round 4 (25 October 2026).** Every resort photo in a card (suggestions, details, the comparison and its selection carousel) opens that resort's official page in a new tab; the link is an RSG layer over the Studio card photo, separate from اختيار. A customer undecided between Shebara and Desert Rock gets a comparison (a Studio Carousel of two information cards with the same six facts), then a separate recommendation message, then a two-card selection Carousel. At the guest-details step a Studio Selection List Picker offers «لدي حساب سابق» or «متابعة كضيف جديد». A returning customer types the e-mail in the verification card, receives a real code, and only after `server.py` verifies it does `/api/otp/verify` issue a short-lived session; `/api/profile` returns the saved profile for that session only (never for an e-mail alone). The new form holds only the saved fields, marked with a "saved" icon, never the voice icon. The same verified e-mail is not asked for a second code; a changed e-mail is verified before payment. A new guest (manual or voice) gets no code: review and consent lead straight to the payment hand-off. Saved profiles come from the application's own store named by `PROFILE_STORE` (see `.env.example` and round 5). `server.py` also stops serving dot-files (such as `.env`), `private/` and `.py` files.

**Round 3 (25 October 2026).** Rich components fill the inner chat width (the widget keeps its size). Arabic text in cards and rows keeps an RTL base, and English names, products, airports, amounts, e-mail and URLs are Unicode-isolated inside it (`rtl()` and `bidiPayload()` in `js/chat.js`, applied only to the description, subtitle, instruction and detail-row fields of a Studio payload, within the schema limits). Resort cards carry a one-line description, the setting as the badge, location, accommodation style and a few facilities, from the sourced profiles at the end of `data/resorts.js` (research inventory sections A1 to A11 and 2.11). Quick replies appear once, after the whole agent turn. After a voice message the concierge sends a NEW guest form already filled with the extracted values and the first name, names the required fields still missing, and retires the earlier form. The chat background is a solid colour. The calendar accepts any past, present or future range; ranges other than the quoted stay get the existing "need to confirm the price" reply instead of a quote. Both transfer legs show a photo.

**Empathy Studio rich components (22 October 2026).** The cards, pickers and reply buttons in the chat are now rendered by the Empathy Studio web-SDK renderers: `studio/studio-renderers.js` is a line-for-line port of the SDK's `rich-components/*` sources, `studio/studio-components.css` is the SDK's own CSS, `studio/studio-rtl.css` mirrors its physical left/right rules inside the RTL host, `studio/schemas.js` holds the registered Studio schemas (every payload is checked against them at render time; a mismatch is logged, never shown) and `studio/icons/` carries the Lucide icons the SDK fetches by name. Mapping: resort details and transfer legs and experiences are Carousel information cards, villas are a Carousel with اختيار buttons, the stay summary, the updated totals, the final review, the payment hand-off and the final confirmation are Confirmation Cards whose primary button carries the line the stage already accepts, arrival modes are a Selection List Picker, airports are the Sectioned Multi-Select (grouped list picker, one chip per group, the optional flight fields were dropped) and quick replies are the Studio `buttons` component. A Studio button sends its payload as the customer message; `js/chat.js` maps it to the same `act()` transitions as before. The calendar, the guest form with the voice composer and the e-mail verification keep their RSG components (no Studio equivalent). Elements with no slot in a Studio component sit in a small RSG aside under the card: the official page links, the consent wording, the PDF status. The payment button opens the exact checkout URL and starts the five-second continuation; تحميل PDF builds the same PDF without echoing a customer line. `css/studio-rsg.css` holds only the RSG hooks (theme variables, placement, retired and busy states, the aside).

The engine in `js/chat.js` keeps a stage and a small state object. Each customer message is normalised (diacritics, alef and taa marbuta forms, Arabic digits, punctuation) and matched against keyword sets for the current stage; cards call the same engine through their buttons. An input that does not fit the stage gets a short neutral request from `data/script.js`. There is no language model.

Journey (stages in `stageSpec()`):

1. Greeting, the customer gives a first name.
2. Customer asks about resorts. The concierge says it is waiting for the choice, the page scrolls to the resort cards themselves (the card rail, below the section heading), an اختر button with an icon-only sparkle marker and a tooltip appears on every card, a fixed status bar reading بانتظار اختيارك للمنتجع sits at the top of the page, and the panel collapses to a bar. Status bar, badges and buttons disappear the moment a resort is chosen. The rest of the page is dimmed while the visible cards stay bright; a fine aqua frame and a small indicator move from card to card, about 1.8 s each, then rest. The dimming stays until a resort is chosen (or Escape, or a new conversation). Overlays never take pointer events, so Choose, the carousel scroll and the keyboard keep working (`js/spotlight.js`).
3. Choose on a card clears the effect, sends "أختار <resort>" and restores the panel. Shebara gets its details card and the villa list; any other resort gets its details card and a note that the concierge can continue with Shebara.
4. Villa list with Villa Flat Rate and its price under One Bedroom Overwater Villa (the only villa with an evidenced price). Other villas can be selected but receive a neutral reply because no price is on record.
5. Guest-count question with the child policy. Customer confirms two adults.
6. One combined date question with one range calendar. 23 to 25 October continues to the accommodation summary; other ranges get a neutral reply.
7. Approval, transport mode tiles, one airport form (airports required, flight details optional).
8. Transportation Trip Details, updated summary (SAR 33,793.90), approval.
9. Activities offered; customer declines.
10. The concierge asks for the guest details without suggesting a method, and the guest form appears with the request so it can be filled directly. Alternatively, The microphone button beside Send swaps the text field for a recorder in the same slot: a red indicator, a live level waveform fed by an AnalyserNode on the real microphone stream (louder speech, taller bars; silence settles), the elapsed time, Stop and Cancel. Permission is requested only on that click and nothing shows as recording before it is granted. After Stop the slot shows a playback preview with the duration; Send sends the recording, Cancel restores the text field with its draft. Tracks, analyser and audio context are released on stop, cancel, reset and close. Only the sent audio bubble, with its real duration and a player, enters the conversation. Sending it at this stage fills the guest form from the prepared mapping in `data/script.js` (`scenario.voice`): title, family name, country code, mobile, the second guest's names and the request, each marked with an icon-only sparkle (tooltip and accessible name explain it); the first name carries an icon-only chat mark. E-Mail is left empty and must be typed. Editing a marked field removes its mark. A voice message sent at any other stage gets a neutral reply and changes nothing. No speech recognition runs: the mapping is fixed for this prepared journey.
11. Final review, terms acknowledgement, then the Verify card: it checks `/api/otp/status`, explains any file-origin, static-server or missing-configuration problem, and only then enables Send code. The server generates and e-mails the code; the customer enters the code from the mailbox; the server checks it. Payment card linking to the official checkout URL in a new tab.
12. The first click on Proceed to payment starts one 5-second timer in the conversation (no customer message is needed or added). When it elapses, or on return to the tab if it already has, the concierge delivers the payment-verified acknowledgement, the booking card with Download PDF and the closing message. The timer is part of the scripted journey, not a payment-provider response.

Closing and reopening keeps the transcript, stage, scroll position, typed draft and any pending timer. The header menu has "Start a new conversation", which cancels pending replies, timers and recordings. Repeated clicks and Enter presses are ignored while a reply is in progress, while a recording is pending, and after a card has been used.

## PDF

`js/pdf.js` draws the summary on a canvas with the page's Fedra fonts (so Arabic names are shaped by the browser), encodes each page as JPEG and writes a minimal PDF by hand. The layout uses the Red Sea Global corporate identity as observed on redseaglobal.com: the official horizontal logo (`assets/logos/rsg-logo-horizontal.svg`), blue `#04253c` and `#0a1d2d`, gold `#b89c67` and `#c3af8a`, with the Shebara mark beside the resort name. RSG's own typefaces (Questa Grande, Paralucent) are not available locally, so the Fedra faces are used. Filename: `Shebara_Booking_Summary_2026-10-23.pdf`. No library and no upload. No booking reference, invoice number or transaction number is invented.

## Files

| Path | Purpose |
|---|---|
| `index.html` | Page replica and the chat shell, including the composer with the permanent microphone |
| `server.py` | Local HTTP server for the page plus the e-mail verification API (`/api/otp/status`, `/request`, `/verify`); reads `.env` |
| `start.cmd` | Windows helper: free port, start `server.py`, open the browser at the right address |
| `.env.example` | Template for the SMTP settings (copy to `.env`) |
| `css/site.css` | Page styles with the colour and type values observed on visitredsea.com, Choose buttons, the resort spotlight |
| `css/chat.css` | Chat panel, messages, audio bubble, cards, forms, calendar, composer, minimised bar |
| `css/atelier-components.css` | Photographic design of the RSG components that remain (calendar, guest form, verification); scoped to the components, the shell keeps `chat.css` |
| `js/chat.js` | Replay engine, Studio payload builders and handlers, the remaining RSG components, composer microphone, verification card, payment continuation, shell behaviour |
| `studio/` | Empathy Studio web-SDK renderers (JS port), SDK CSS, RTL mirroring, registered schemas, Lucide icons |
| `css/studio-rsg.css` | RSG hooks for the Studio components: theme variables, placement, retired and busy states, the aside |
| `js/spotlight.js` | Resort-selection spotlight (dimming, moving frame, cleanup) |
| `js/pdf.js` | Booking-summary PDF generator (Red Sea Global identity) |
| `css/walkthrough.css` | Document layout for `index.html?walkthrough=1`, printed to `RSG_Full_Conversation.pdf` |
| `RSG_Full_Conversation.pdf` | The complete expected conversation: every message to type, every reply, every card, the voice step, the verification step and the automatic payment continuation, with the actions annotated (concierge left, customer right) |
| `data/script.js` | All Arabic concierge wording, customer action lines, and the prepared voice mapping. Edit text here |
| `data/booking.js` | The fixed route: dates, villa, rate, transfers, totals, URLs. Every amount is read from here |
| `data/resorts.js`, `data/villas.js` | Resort cards and Shebara villa types |
| `assets/` | Fonts, logos (Visit Red Sea, the extracted turtle mark, Shebara, Red Sea Global), resort, villa, activity and site images (see `docs/ASSETS.md`) |
| `tools/local_smtp_sink.py` | Local SMTP sink for testing the sending path (delivers nothing) |
| `tools/mobile-frame.html` | Helper frame for 390 px headless captures |
| `docs/SOURCES.md`, `docs/ASSETS.md`, `docs/MISSING_INPUTS.md` | Source map, asset manifest, remaining gaps |

## Evidence rules kept in the build

Accommodation SAR 28,980.00, the two transfer products and prices (SAR 3,622.50 and SAR 1,191.40) and the transfers total SAR 4,813.90 are the customer-supplied screenshot values; SAR 33,793.90 is their sum. No tax is added again, no nightly rate or tax breakdown is invented, no price is shown for the other villas, and activity prices are the recorded examples with their original basis in the price text. The 10% rate plan was removed from the experience on the owner's instruction; the research files keep its history.

## Licensing note

The Fedra font files, the Visit Red Sea and Red Sea Global logos, the Shebara mark and all photography were taken from the public visitredsea.com, redseaglobal.com, amaala.com and thuwalretreat.sa pages for this internal build at the project owner's request. They remain the property of their owners. Confirm permission with Red Sea Global before showing this outside the project team or reusing the assets.
