# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Clouding AI's proof of concept for a Red Sea Global (RSG) concierge chat. No build step, no package manager, no test suite, no language model. The two working apps are static HTML/JS served by a stdlib Python server. Everything else is research, design proposals and client deliverables.

| Path | Role |
|---|---|
| `visitredsea-chat-mockup/` | **V1**. Replica of the visitredsea.com home page; resort choice happens on the page (spotlight, `js/spotlight.js`). Port 8080. |
| `visitredsea-chat-mockup-v2/` | **V2**. Compact chat-only journey; resort choice inside the chat. Port 8090. Current design is "Tidal Atelier" (`docs/PHOTOGRAPHIC_ATELIER.md`). |
| `visitredsea-chat-live/` | **Live**. V2's chat driven by a Claude Managed Agent instead of the scripted engine, plus V1's page hand-off (scroll + spotlight) as an agent tool. Port 8100. Backend in `agent/` (state transitions, 18 tools, provider, chat protocol); setup in `docs/CONSOLE_SETUP.md`. Needs `pip install -r requirements.txt` and `ANTHROPIC_*` in `.env`. |
| `visitredsea-chat-fresh/` | **Fresh**. The approved page with Empathy Studio's web widget as the only chat (`/studio-widget.js` built from `.env`); no scripted engine, no backend of its own. Page hand-off (`js/site.js` + V1 spotlight) kept. `js/widget-rtl.js` fixes Arabic RTL inside the widget's shadow root; `js/site.js` opens the trip-summary card's «تحميل PDF» payload (signed `trip.html` link) on click without a chat turn. Two scripted iPhone WhatsApp mockups, each opened only by its own bottom-right launcher (`js/mockup-launchers.js`): the guest conversation with the concierge Faisal (`js/whatsapp.js` scene factory, `data/whatsapp-script.js`, `docs/WHATSAPP_TRANSCRIPT.md`) and the ERP-to-WhatsApp handoff (`js/handoff.js`, `data/handoff-script.js`, `docs/HANDOFF_TRANSCRIPT.md`, PDF `assets/handoff/guest-file.pdf` built by `tools/build_handoff_pdf.py` from PowerShell); the trip-PDF flow opens neither; fixture `tools/whatsapp-preview.html`. Port 8100, refuses a busy port. `tools/check_origin.py` tests the channel's allowed origins. |
| `empathy-studio-preview/` | Approved proposal record for mapping RSG components onto Empathy Studio rich components (`MAPPING.md`, decoded SDK sources in `reference/sdk/`). Not a live app. |
| `design-proposals/quiet-tide/` | Superseded design proposal (Node preview server, `qa/*.cjs` scripts). |
| `research_notes/`, `reports/` | Due-diligence research and CSV registers that every price, name and policy in the apps is sourced from. |
| `design-briefs/`, `prompts/` | Briefs handed to design tools and earlier Claude Code prompts. |
| `evidence/` | Booking-flow reference images (`mockup_references/`) and dated captures of the live RSG booking flow (`screenshots/`) that screenshot-sourced details trace back to. |

Each app's `README.md` is the detailed record of behaviour, round-by-round changes and evidence rules. Read it before changing an app. V2's README defers to V1's for shared details.

## Running

From inside an app folder:

```bash
python server.py 8090
```

`start.cmd` does the same on Windows; in V1 and V2 it picks the next free port, in the live build it refuses to start when 8100 is busy (the Studio web channel only allows that exact origin). The page must be loaded from `server.py` over HTTP (never `file://` or a plain static server), because the OTP API lives on the same origin.

Useful URLs: `index.html?open=1` (chat open on load), `index.html?walkthrough=1` (whole scripted route rendered as a document, the source of `RSG_Full_Conversation*.pdf`), V2 `tools/responsive-preview.html` (desktop/390/360 frames, `?recorded=1` for a no-network visual review).

### Testing safely

There are no automated tests. Verification is done by driving the real route in a browser.

- The owner usually has their own servers running on 8080/8090 with a real SMTP `.env`. Check `netstat -ano | findstr :8080` (and `:8090`) first. Never bind a second server there and never press "Send code" against the owner's instance.
- Test on a spare port with the SMTP sink, which prints the e-mail (and the code) to stdout instead of delivering it:

```bash
python tools/local_smtp_sink.py 2525
```

  then start `server.py` on e.g. 8091 with `OTP_SMTP_HOST=127.0.0.1 OTP_SMTP_PORT=2525 OTP_SMTP_SECURITY=none OTP_SMTP_USER=sink OTP_SMTP_PASSWORD=sink OTP_SMTP_FROM=sink@localhost` in the environment. Environment values override `.env`.
- Never read or print `.env` or `private/profiles.json`.

## Architecture (both apps)

Script load order in `index.html`: `data/booking.js`, `data/resorts.js`, `data/villas.js`, `data/script.js`, `js/pdf.js`, (V1 only: `js/spotlight.js`), `studio/studio-renderers.js`, `studio/schemas.js`, `js/chat.js`. All are plain globals, no modules.

- **Data vs wording.** `data/booking.js` is the one fixed priced route (Shebara, One Bedroom Overwater Villa, Villa Flat Rate, 2 adults, 23 to 25 Oct 2026); every amount is read from it. `data/script.js` holds all Arabic concierge wording, quick-reply items and the prepared voice mapping (`scenario.voice`). `data/resorts.js` holds resort cards plus sourced profiles and `RESORT_COMPARE` at the end. V2 data has `*Ar` name fields; V1 data does not, and V2 data must not be copied into V1.
- **Engine (`js/chat.js`).** Deterministic stage machine. `norm()` normalises Arabic input, `stageSpec(text, meta)` matches it against keyword sets for the current stage and returns the next stage plus reply items, `act(meta, text)` is the single entry point that both typed messages and card buttons go through, `deliver()` paces replies and renders quick replies once at the end of a turn. A quick reply resolves through the `QUICK` map by id (never by its label) and is ignored unless the current stage is in that entry's `stages`, so a new chip needs a `QUICK` entry with the right stages. Unmatched input gets a neutral reply from `data/script.js`.
- **Rich components.** Cards, carousels, pickers, confirmation cards and reply buttons are rendered by `studio/studio-renderers.js`, a line-for-line port of the Empathy Studio web SDK, with the SDK's own CSS in `studio/studio-components.css`. `studio(kind, type, payload, onSelect, keep)` in `chat.js` builds the payload, runs `bidiPayload()` and validates against `studio/schemas.js` (a mismatch is logged, never shown). A Studio button's payload is sent as the customer's message and mapped back to `act()`. Do not edit the `studio/` files for looks; RSG adjustments go in `css/studio-rsg.css`. The calendar, guest form + voice composer and e-mail verification are RSG components (no Studio equivalent), styled in `css/atelier.css` (V2) or `css/atelier-components.css` (V1).
- **RTL/bidi.** Components are Arabic RTL with English proper names, amounts and URLs Unicode-isolated via `rtl()`, `iso()` and `bidiPayload()`. Keep Western digits and Gregorian dates.
- **Server (`server.py`).** Stdlib `http.server`. Serves the folder but refuses dot-files, `private/` and `.py`. Endpoints: `GET /api/otp/status`, `POST /api/otp/request`, `POST /api/otp/verify` (returns a short-lived session), `POST /api/profile` (saved profile for a verified session only, never for an e-mail alone). Codes are hashed in memory, 5 min TTL, 5 attempts, 30 s resend cooldown, recipients limited by `OTP_ALLOWED_RECIPIENTS`. Returning-customer profiles live in `PROFILE_STORE` (default `private/profiles.json`, gitignored), seeded once from `private/profiles.seed.json`.
- **PDF (`js/pdf.js`).** Draws the booking summary on a canvas with the bundled Fedra fonts and writes a minimal JPEG-page PDF by hand. No library.

`server.py`, everything under `studio/` and `tools/local_smtp_sink.py` are byte-identical between V1 and V2. When changing one, decide explicitly whether the other app gets the same change. `js/pdf.js`, `js/chat.js`, data and CSS differ.

## Live build (`visitredsea-chat-live/`)

- The browser no longer runs `stageSpec`. A typed line is `POST /api/chat/turn {kind:"text"}` (goes to the agent, which calls one tool from `agent/tools.json`); a card/form action is `{kind:"event"}` (deterministic, `agent/tools.py handle_event`). Transitions live in `agent/state.py`; the page renders the returned items with the unchanged `deliver()`/`C.*` and replaces its state with the returned snapshot (`applySnapshot`). Client-only state: `otp`, `termsAccepted`, `paymentClickedAt`.
- `agent/data.json` is dumped from `data/*.js` by `node tools/dump_data.mjs` and hash-checked at start: after any change to `data/booking.js`, `resorts.js`, `villas.js` or `script.js`, run the dump, then `python tools/console_setup.py --update` so the agent gets the same facts.
- `navigate_to_resorts` is the only browser action: the server suspends the agent's turn, the page runs `revealChoose()` and acknowledges with `POST /api/chat/action-result`. One action per turn; unacknowledged actions are closed with an error result.
- The agent never gets OTP codes, session tokens, e-mails, phones or profiles. `LIVE_AGENT_TEST_DOUBLE=1` is a test-only keyword stand-in; never run a demo with it. Regression: `node tools/drive_live.mjs http://127.0.0.1:8101` against a test instance.
- `?walkthrough=1` and `recorded=1` exist only in V2.
- Empathy Studio bridge: `agent/studio_bridge.py` serves Studio's Custom Agent contract at `/studio/sessions` and `/studio/sessions/<id>/messages`; a message equal to an approved card line is handled as that event, anything else goes to the agent, and the reply is lead-in text plus `[card: …]` data blocks for Rendering Intelligence. Needs a public HTTPS URL and the channel rebound to a Custom Agent. In the widget, guest details are typed in the chat (`set_guest_details`), the payment link is plain text, and the page's silent `rsg:continue` signal (5 s after the link appeared) records the booking once (id derived from the quote, so a repeat from a new session credits nothing twice) and tells the guest only the points earned on that booking (`agent/loyalty.py`, `private/loyalty.json`; configurable rules, not RSG's programme; the account total is kept for the redemption offer but never quoted). The title (السيد/السيدة) is inferred from the first name in `agent/state.py`; an unclear name gets one question (`live.titleAsk`). The trip-summary block's `pdf` line (signed link to the fresh site's `trip.html`) is the «تحميل PDF» button's payload, which the page opens on click; the label or the link sent as a message is answered with the link. `trip.html` builds the PDF from the saved record with `js/pdf.js`. The widget has no terms step: `state.confirm` checks the terms only for the website channel, and `widget_text()` swaps the review lines' terms phrase for «نكمل للدفع». The villa selection block carries no price, party, dates or tax note, and the calendar block pre-selects no dates (`initial_check_in/out = -`). Nothing claims a payment or a reservation, and no guest-facing text says demo or test. `agent/budget.py` caps the agent's list cost across all sessions (`AGENT_BUDGET_USD`, default 2.00, from `AGENT_BUDGET_START`); `tools/console_update.py` pushes system + tools only (never the model).

## Project rules that are easy to break

- **Evidence only.** Prices, villa/transfer product names, policies and URLs must come from the research files or the customer-supplied screenshots recorded in the README ("Evidence rules kept in the build"). Do not invent nightly rates, tax breakdowns, booking references, prices for other villas, or per-villa pages.
- **Never fake delivery.** No console fallback or on-screen OTP code. The payment step only opens the official checkout URL and then runs a scripted 5-second continuation; nothing claims a real payment result.
- **V1 is not V2.** V1 keeps its host-page resort selection and longer script. Don't port V2 behaviour into V1 unless asked.
- Each app README records changes as dated "Round N" paragraphs. Keep that record current when behaviour changes.
- Assets (fonts, logos, photography) are taken from public RSG sites for internal use only (`docs/ASSETS.md`, licensing note in V1 README).
