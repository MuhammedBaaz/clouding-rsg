# RSG concierge proof of concept: handover for Hazzem

Prepared 19 November 2026 from the code on `main` (repository `MuhammedBaaz/clouding-rsg`). Everything below was checked against the current code and configuration. Where a statement rests on older notes or could not be tested, it says so.

Read this file first, then `CLAUDE.md` (project rules for Claude), then the README of the folder you are about to change. The READMEs are the detailed history, written as dated "Round N" sections; the newest round is not always at the top.

## 1. What this is

A proof of concept for Red Sea Global (RSG): a guest books a stay at Shebara through a chat in Saudi Arabic on a copy of the visitredsea.com home page. Clouding AI built it to show Empathy Studio (our chat platform) driving a Claude agent, with rich cards in the chat and larger booking views on the page.

It is a demo, not a booking system. One stay is priced: Shebara, One Bedroom Overwater Villa, Villa Flat Rate, 2 adults, 23 to 25 October 2026, SAR 33,793.90 payable. Every price, name and policy comes from the research files and RSG screenshots in the repo. Nothing takes a payment or creates a reservation.

### The booking journey today (the Studio widget on the fresh site)

1. Greeting, then the guest's first name.
2. Intent. The guest can get resort suggestions as cards, ask to browse on the page (the page scrolls to the resort cards and runs a spotlight, and «اختر» on a card continues the chat), or compare Shebara and Desert Rock.
3. Resort details and villas. Only the One Bedroom Overwater Villa is priced; any other villa gets "the price needs confirming" and an offer to continue on the priced one.
4. Party (2 adults is the priced party), then dates in a calendar card. Nothing is preselected and only 23 to 25 October 2026 is priced.
5. Stay summary, approval.
6. Arrival by air, airports, transfer legs with totals, approval.
7. Activities. Interest is noted («بكل سرور… بعد ما نثبّت الحجز») and nothing is added to the booking, or the guest chooses at arrival.
8. Guest path (returning or new). In the widget there is no e-mail code; the details are collected in a form card. The title (السيد/السيدة) is inferred from the first name, with one question when the name is unclear.
9. Special request, then the review. The widget has no terms step.
10. Payment link: the official visitredsea.com checkout URL as a link. About 5 seconds after it appears, the page sends a hidden line (`rsg:continue`) and the backend records the booking once.
11. Trip summary with the amount, the loyalty points earned on this booking, and «تحميل PDF», which opens `trip.html` and builds the PDF in the browser.

At steps 3 to 9 the page opens a larger view of the same step by itself (section 7).

## 2. Repository map

| Path | What it is | Status |
|---|---|---|
| `visitredsea-chat-fresh/` | **The active website.** Approved Visit Red Sea page, Empathy Studio web widget as the only chat, website booking views, page hand-off (scroll and spotlight), trip PDF page, two WhatsApp mockups. Port 8100. | Active |
| `visitredsea-chat-live/` | **The active backend.** `server.py` plus `agent/`: booking state machine, tools, Claude Managed Agent connection, the Studio Custom Agent bridge, loyalty points, spend cap. Runs on 8110 behind a tunnel. It also serves its own older page (V2 look, website chat) at its port. | Active |
| `visitredsea-chat-live/agent/` | `studio_bridge.py` (Studio contract, card blocks, website-view state), `state.py` (stages and rules), `tools.py` + `tools.json` (21 agent tools), `chat.py` (sessions, guards), `provider.py` (Managed Agents), `loyalty.py`, `budget.py`, `system_prompt.md`, `data.json` (generated) | Active |
| `visitredsea-chat-live/data/` | Approved facts and wording (`booking.js`, `resorts.js`, `villas.js`, `script.js`). `agent/data.json` is generated from these. | Source of truth |
| `empathy-studio-preview/` | Studio configuration record: template texts to paste (`STUDIO_TEMPLATES_LIVE.md`), custom components (`STUDIO_SETUP_CALENDAR_FORM_2026-11-11.md`), component mapping, decoded SDK sources in `reference/sdk/` | Reference for Studio work |
| `visitredsea-chat-fresh/js/rsg-components.js` | The two custom Studio components rendered by the page: calendar (`rsg_date_range`) and guest form (`rsg_guest_form`) | Active |
| `visitredsea-chat-live/studio/` | Port of the Studio SDK renderers used by the backend's own website chat | Website channel only |
| `visitredsea-chat-mockup/` (V1, 8080), `visitredsea-chat-mockup-v2/` (V2, 8090) | Earlier scripted versions, no language model. Kept as reference and rollback. | Reference, do not port changes into them |
| `design-proposals/`, `design-briefs/`, `prompts/` | Superseded design proposal and earlier briefs | Reference |
| `research_notes/`, `reports/`, `evidence/` | Research, CSV registers and dated screenshots that every fact traces back to | Source of truth for facts |
| `demo-film/`, `Recordings/`, `*.mp4` | Demo film scripts, storyboard, recordings (videos are in Git LFS) | Deliverables |
| `Clouding_RSG_POC_Presentation.html` and loose images at the root | Presentation and reference images | Deliverables |

## 3. How the pieces connect

```
 Guest's browser  http://127.0.0.1:8100  (visitredsea-chat-fresh/server.py)
 +----------------------------------------------------------------------------+
 | Visit Red Sea page                    Empathy Studio web widget (SDK)      |
 |  js/site.js        (hand-off, PDF)     loaded from cdn.clouding.ai          |
 |  js/booking-views.js (website views)   config from /studio-widget.js        |
 |  js/rsg-components.js (calendar, form)                                      |
 +-------|------------------------------------------------|-------------------+
         | /api/booking/state, /api/booking/draft,         | chat messages (SSE)
         | /api/trip  (same origin, proxied)               | X-API-Key = channel key
         v                                                 v
 fresh server.py --> http://127.0.0.1:8110          Empathy Studio (acp-test.clouding.ai)
   /api/studio/state, /api/studio/draft               channel "RSG Web"
     (answer locally only)                            Rendering Intelligence templates
   /api/booking/<id>?t=<token> (signed link)          Custom Agent "RSG Concierge Bridge"
                                                           |
                                                           | POST <Base URL>/sessions
                                                           | POST <Base URL>/sessions/<id>/messages
                                                           | header X-Bridge-Key
                                                           v
                                     Cloudflare tunnel  https://<random>.trycloudflare.com
                                                           |
                                                           v
                    visitredsea-chat-live/server.py :8110  (agent/studio_bridge.py)
                      card lines  -> deterministic events (no model call)
                      typed text  -> Claude Managed Agent (one tool per message)
                      reply = lead-in text + [card: ...] blocks for Rendering Intelligence
                                                           |
                                                           v
                    Claude Managed Agent "RSG Concierge (Clouding)"
                      agent_01D3yFvZ2ZTDBwxa8i5g8YN3, model claude-sonnet-5-5
```

How a turn flows:

- **The guest types.** Studio sends the text to the bridge. Text that matches an approved card line (for example «نختار Shebara.», «مناسب، نكمل», the calendar's dates line, the form's «بياناتي: …» line) becomes a deterministic event with no model call. Anything else goes to the Managed Agent, which calls one tool; the backend runs the tool and owns the state.
- **The reply.** One string per guest message: approved Arabic lines plus labelled blocks such as `[cards: villas]`, `[card: review]`, `[calendar: …]`, `[form: …]`. Studio's Rendering Intelligence picks a template by the block and fills a card, carousel, picker or custom component.
- **A card button** sends its payload as the guest's message, so it comes back to the bridge as a card line.
- **Website views.** The page reads the widget's visitor id from `localStorage["chatwidget_v2_visitorId"]`. Studio passes the same id to the bridge as `visitor_id`, which is how the page finds its conversation. The page polls `GET /api/booking/state?v=<id>` every few seconds. A decision made in a view is sent through the widget as the same card line, so the chat continues in order.
- **Completion.** When the payment message appears, `js/site.js` waits 5 s and sends `rsg:continue` through the SDK with no visible bubble. The bridge records the booking once, under an id derived from the quote, and replies with the trip summary.
- **PDF.** The trip card's button payload is a signed link `http://127.0.0.1:8100/trip.html?b=<id>&t=<token>`, where the token is an HMAC with the bridge secret. The page opens it on click. `trip.html` fetches the saved record through `/api/trip` and draws the PDF with `js/pdf.js`.

The backend's state and draft endpoints answer only on 127.0.0.1 and refuse requests that carry Cloudflare or proxy headers, so they are not reachable through the tunnel. The booking record behind the PDF (`/api/booking/<id>`) is reachable through the tunnel, but only with the signed token; a wrong token gets 404.

## 4. Setup from a fresh checkout

Verified on 19 November 2026 on Windows 11: fresh clone, new virtual environment, backend on 8121 with the test stand-in, site on 8120, all four check scripts, the protocol driver, the bridge with and without its key, the state proxy, and the views fixture in a browser with no console errors. The macOS/Linux commands below are the same steps but were not run.

### Prerequisites

- Python 3.11 (3.11.9 used here). The site needs only the standard library; the backend needs `anthropic` (2.10.0 installed from `requirements.txt` in the test).
- Node.js (v24 used here), only for `tools/dump_data.mjs` and `tools/drive_live.mjs`.
- Git with Git LFS (`git lfs install`), otherwise the `.mp4` files arrive as small pointer files. The apps do not need the videos.
- For the live widget only: `cloudflared` (Windows: `winget install --id Cloudflare.cloudflared --exact`).
- Windows is the tested platform. The `.cmd` scripts are Windows only; on macOS/Linux run the `python` commands directly.

### Step 1. Clone

```
git clone https://github.com/MuhammedBaaz/clouding-rsg.git
cd clouding-rsg
git lfs pull
```

### Step 2. Backend environment

```
cd visitredsea-chat-live
python -m venv .venv
.venv\Scripts\activate            (macOS/Linux: source .venv/bin/activate)
python -m pip install -r requirements.txt
```

`.venv/` is ignored by the root `.gitignore`.

### Step 3. Offline run with no credentials (start here)

This proves the checkout works and costs nothing. Use spare ports, never 8100/8110 if Muhammed's servers might be running on the same machine.

Backend with the test stand-in (Windows `cmd`):

```
cd visitredsea-chat-live
set LIVE_AGENT_TEST_DOUBLE=1
set STUDIO_BRIDGE_SECRET=local-test-secret
set STUDIO_PAGE_ORIGIN=http://127.0.0.1:8120
set LOYALTY_STORE=%TEMP%\rsg-loyalty.test.json
set AGENT_SPEND_LEDGER=%TEMP%\rsg-spend.test.json
set PROFILE_STORE=%TEMP%\rsg-profiles.test.json
python server.py 8121
```

Site, in a second window:

```
cd visitredsea-chat-fresh
set RSG_BACKEND_URL=http://127.0.0.1:8121
python server.py 8120
```

Then:

- http://127.0.0.1:8120/ shows the page with 11 resort cards. There is no chat widget without a channel key; that is expected.
- http://127.0.0.1:8120/?viewsFixture=villa opens the villa view after about 8 seconds from recorded data. Other stages: `resort`, `airports`, `approve2`, `activities`, `guest`, `review`.
- http://127.0.0.1:8121/api/chat/status reports `"provider": "test_double"`.

Never demo with `LIVE_AGENT_TEST_DOUBLE=1`. It is a keyword stand-in for tests and prints a banner.

### Step 4. Full live setup (needs credentials, section 5)

Startup order matters: backend, then tunnel, then Studio Base URL, then the site.

1. `visitredsea-chat-live/.env` from `.env.example`: `ANTHROPIC_API_KEY`, `ANTHROPIC_AGENT_ID`, `ANTHROPIC_ENVIRONMENT_ID`, `ANTHROPIC_MODEL`. SMTP values are needed only for the backend's own website chat (e-mail codes), not for the widget.
2. `visitredsea-chat-live/private/bridge_secret.txt`: one line, the value Studio sends as `X-Bridge-Key`.
3. `visitredsea-chat-live/start_bridge.cmd`: starts the backend on 8110 in its own window and a Cloudflare quick tunnel in another, then prints the Base URL (`https://<random>.trycloudflare.com/studio`) and saves it to `private/base_url.txt`.
4. In Empathy Studio, paste that Base URL into the Custom Agent (section 6).
5. `visitredsea-chat-fresh/.env` from `.env.example`: `STUDIO_CHANNEL_KEY` and the endpoint lines.
6. `visitredsea-chat-fresh/private/studio-widget.snippet.html`: Studio's Customize, then Copy snippet, pasted unchanged. Without it the widget shows the SDK's default look.
7. `visitredsea-chat-fresh/start.cmd`: site on http://127.0.0.1:8100/. It refuses to start when 8100 is busy, because the Studio channel allows that exact origin only. If the process it names is `python`, the site is most likely already running; open the URL before stopping anything.

After a backend code change, close the "RSG backend 8110" window and run `start_backend.cmd`. The tunnel window stays open, so the Base URL does not change.

Do not run `visitredsea-chat-live/start.cmd` for this setup. It starts the backend's own page on 8100 and collides with the fresh site.

### Ports and URLs

| Port | What |
|---|---|
| 8100 | Fresh site, the only origin the Studio channel allows |
| 8110 | Live backend and Studio bridge (behind the tunnel) |
| 8080 / 8090 | V1 / V2 scripted references |
| any spare port | Tests (the Studio channel refuses spare origins, so the widget does not load there) |

Useful URLs: `/?viewsFixture=<stage>` (views from recorded data), `tools/components-preview.html` (calendar and form without the SDK), `tools/whatsapp-preview.html`, `http://127.0.0.1:8110/api/chat/status` (agent configured, spend against the cap).

## 5. Environment variables, credentials and external services

### Credentials Hazzem needs, and where they come from

| Credential | Where it lives | Where to get it |
|---|---|---|
| Anthropic API key | `visitredsea-chat-live/.env` `ANTHROPIC_API_KEY` | Claude Console, https://platform.claude.com/settings/keys. To reach the existing agent `agent_01D3yFvZ2ZTDBwxa8i5g8YN3`, issue it in the same Console organization and workspace as that agent (I did not test a key from another workspace). |
| Agent and environment ids | same `.env` | Not secret. `agent_01D3yFvZ2ZTDBwxa8i5g8YN3`, `env_014yGcQKoVVA6nP1zVTQz5yN`, model `claude-sonnet-5-5`. `python tools/console_setup.py` prints them when run with a key from that workspace. |
| Studio channel browser key (`acp_…`) | `visitredsea-chat-fresh/.env` `STUDIO_CHANNEL_KEY`, and inside the snippet file | Empathy Studio, the RSG Web channel page |
| Bridge secret | `visitredsea-chat-live/private/bridge_secret.txt` (read into `STUDIO_BRIDGE_SECRET` by the start scripts) | Must equal the `X-Bridge-Key` Secret Header on the Studio Custom Agent. For your own Custom Agent, generate one: `python -c "import secrets; print(secrets.token_hex(24))"` |
| SMTP account (optional) | `visitredsea-chat-live/.env` `OTP_SMTP_*` | Only for the backend's own website chat. Use `tools/local_smtp_sink.py` for tests. |

I could not find our team's approved route for handing over credentials documented anywhere in the repo. Ask Muhammed for access to the Claude Console workspace and to Empathy Studio, and receive the values through that route. Never send them in chat, commit them, or paste them into Lovable.

### Variables, with safe example values

Backend (`visitredsea-chat-live/.env`; the process environment wins over the file):

```
ANTHROPIC_API_KEY=sk-ant-REPLACE_ME
ANTHROPIC_AGENT_ID=agent_01D3yFvZ2ZTDBwxa8i5g8YN3
ANTHROPIC_ENVIRONMENT_ID=env_014yGcQKoVVA6nP1zVTQz5yN
ANTHROPIC_MODEL=claude-sonnet-5-5
# ANTHROPIC_STREAM_TIMEOUT=120
STUDIO_BRIDGE_SECRET=set-by-start_bridge.cmd-from-private/bridge_secret.txt
STUDIO_PAGE_ORIGIN=http://127.0.0.1:8100
# STUDIO_ASSET_ORIGIN=https://<public host>     card image origin behind a proxy without X-Forwarded-Proto
# STUDIO_DEBUG_FIELDS=1                        logs Studio's field names and hashed values, off by default
# AGENT_BUDGET_USD=2.00
# AGENT_BUDGET_START=2026-11-10T13:31:15Z
# AGENT_SPEND_LEDGER=private/agent_spend.json
# LOYALTY_STORE=private/loyalty.json
# LOYALTY_EARN_SAR_PER_POINT=10
# LOYALTY_REDEEM_SAR_PER_POINT=0.10
# PROFILE_STORE=private/profiles.json
# OTP_SMTP_HOST=smtp.example.com  OTP_SMTP_PORT=587  OTP_SMTP_SECURITY=starttls
# OTP_SMTP_USER=sender@example.com  OTP_SMTP_PASSWORD=  OTP_SMTP_FROM=Red Sea Concierge <sender@example.com>
# OTP_ALLOWED_RECIPIENTS=you@example.com
# LIVE_AGENT_TEST_DOUBLE=1                     tests only
```

Site (`visitredsea-chat-fresh/.env`; only `STUDIO_*` and `RSG_*` names are read):

```
STUDIO_CHANNEL_KEY=acp_REPLACE_ME
STUDIO_SSE_ENDPOINT=https://acp-test.clouding.ai/api/v1/chat
STUDIO_SDK_URL=https://cdn.clouding.ai/sdk/web/next/core.min.js
STUDIO_AVATAR_URL=https://i.postimg.cc/TYg4S1HH/image-1794154482438.png
RSG_BACKEND_URL=http://127.0.0.1:8110
```

### External services

| Service | Used for | Notes |
|---|---|---|
| Claude Managed Agents (Anthropic, beta) | The concierge's understanding of typed messages | Sessions persist on Anthropic's side. Spend is capped by `agent/budget.py` at USD 2.00 counted across all sessions of the agent since 10 Nov. On 19 Nov the backend reported **USD 1.67 spent, 0.33 left**. |
| Empathy Studio, test environment `acp-test.clouding.ai` | Web channel, widget SDK, Rendering Intelligence templates, Custom Agent | Channel "RSG Web", Custom Agent "RSG Concierge Bridge", widget agent name "Rafiq". SDK observed as `core.min.js` 1.15.0. |
| Cloudflare quick tunnel (`trycloudflare.com`) | Public HTTPS address for the bridge | Free, random address on every start, no uptime guarantee. On 18 Nov Cloudflare deleted the running tunnel overnight and the agent went silent until a new tunnel was started and its URL pasted into Studio. |
| visitredsea.com | The checkout URL the payment link opens | Opened only; no result is read back |

## 6. Tunnel, Base URL, Allowed domains and the widget snippet

| Setting | Where | Current value | When it must change |
|---|---|---|---|
| Custom Agent Base URL | Empathy Studio, Custom Agent "RSG Concierge Bridge" | `https://<current tunnel>/studio` (also in `private/base_url.txt`) | Every time the tunnel restarts. Closing the tunnel window, a reboot, or Cloudflare dropping the tunnel all give a new address. |
| Secret Header `X-Bridge-Key` | same Custom Agent | value of `private/bridge_secret.txt` | Only if the secret changes. It also signs the PDF links, so a change breaks links already issued. |
| Channel's agent | Studio, channel "RSG Web" | the Custom Agent above | If the channel is bound directly to the Claude agent, the first tool call stalls (seen 9 Nov). Keep it on the Custom Agent. |
| Allowed domains | Studio, channel "RSG Web" | `http://127.0.0.1:8100` | Any new page origin: another port, `localhost` instead of `127.0.0.1`, a hosted site, a Lovable preview. Origins must match exactly. |
| Widget look | Studio Customize, then Copy snippet into `visitredsea-chat-fresh/private/studio-widget.snippet.html` | the owner's last snippet | After any Customize change. The file is read on every request; hard refresh (Ctrl+F5). |
| Channel key | `visitredsea-chat-fresh/.env` | `acp_…` | If the key is rotated in Studio. Restart the site. |

When the tunnel address changes: run `start_bridge.cmd` (or restart `cloudflared tunnel --url http://127.0.0.1:8110`), copy the new `…/studio` address into the Custom Agent's Base URL, save, then check with one message. The free check used on 19 Nov: from the browser console on the site, `window.__rsgStudioInstance.transport.send("rsg:continue")`. It is answered without a model call and shows the current step's prompt. Use it only before the payment step; at the payment step it completes the booking and credits points.

**A decision for Muhammed before Hazzem runs the live widget.** A Custom Agent has one Base URL. If Hazzem points "RSG Concierge Bridge" at his own tunnel, Muhammed's widget stops talking to Muhammed's backend. Options:

1. Recommended: Hazzem gets his own Studio channel and Custom Agent, with `http://127.0.0.1:8100` in its Allowed domains and his own bridge secret, and uses that channel's key in his `visitredsea-chat-fresh/.env`. The Studio templates are per channel or per workspace; I could not confirm which, so check whether they need copying.
2. Share one setup and agree who runs the backend at any time.

The Managed Agent and its budget are shared either way. `console_setup.py` finds the existing agent by name, so with a key from the same workspace both machines drive the same agent and count against the same USD 2.00 cap. Raising the cap (`AGENT_BUDGET_USD`) is Muhammed's call. Do not push prompt or tool changes (`tools/console_update.py`) without telling him, because they change his running demo too.

## 7. Product decisions and behaviour in the current build

Implemented and verified unless marked otherwise.

**Evidence and honesty**
- Prices, villa and transfer names, policies and URLs come only from `data/*.js`, which cite `research_notes/`, `reports/` and `evidence/`. No invented nightly rates, references or prices for other villas.
- Nothing claims a payment, a verified transaction or a confirmed reservation. No guest-facing text says demo, test or تجريبي.
- The agent never receives OTP codes, session tokens, e-mails, phones or saved profiles. Guest details reach the backend's state, not the model.

**Booking rules** (`agent/state.py`, `agent/studio_bridge.py`)
- One priced route. Other villas, parties and dates get the approved "needs confirming" replies and an offer to continue on the priced route.
- Villa cards carry no price, party, dates or tax note. Prices appear from the stay summary on.
- The calendar opens with no dates selected.
- No terms step in the widget; «البيانات صحيحة، نكمل» goes to the payment link. The backend's own website chat keeps its terms checkbox.
- Title inferred from the first name (lists in `agent/state.py`); one question for an unclear name; a stated title wins.
- Activity interest is acknowledged and nothing is added.

**Website views** (`visitredsea-chat-fresh/js/booking-views.js`, `css/booking-views.css`)
- Each view opens by itself once per conversation when the booking reaches its step: villa, airports, transfer legs, activities, guest details (also at the special-request step), review. The resort comparison opens from a card the page adds in the chat («عرض على الصفحة»).
- Independent photo cards on a blurred backdrop with no enclosing panel; airports as white tiles; guest form and review on one solid sheet.
- At 1200 px and wider the chat docks as a full-height column on the left; narrower, it closes to its button.
- Decisions go back through the widget as card lines. Views redraw only when the booking changes, keeping scroll position, picks and typing. The guest form's draft is saved on the backend.
- «حجزك» summary pill with «عرض الخطوة الحالية».
- Guest details are editable until payment; other steps are read-only once passed.
- Screenshots: `visitredsea-chat-fresh/docs/views-2026-11-18b/`.

**Chat rendering fixes on the page**
- `js/widget-rtl.js` fixes Arabic right-to-left inside the widget's shadow root: list padding, `dir="rtl"` on Arabic content, no-wrap dates, amounts and phone numbers.
- `js/site.js` opens the trip card's PDF link on click without a chat turn, and runs the page hand-off when the agent's message carries «خلني أوريك المنتجعات على الصفحة».

**PDF**
- `trip.html` builds the PDF in the browser from the saved record (`js/pdf.js`, bundled Fedra fonts, no library). Downloading again changes nothing.

**Loyalty points** (`agent/loyalty.py`; our demo rules, not RSG's programme)
- Earn 1 point per SAR 10 payable, rounded down (SAR 33,793.90 gives 3,379 points). Redeem at SAR 0.10 per point, offered at the review when the guest has a balance.
- Identity is the guest's e-mail. Store: `private/loyalty.json` (gitignored).
- The guest is told only the points earned on this booking. The same quote completed again credits nothing twice.

**WhatsApp mockups** (scripted, local, no backend)
- Two buttons at the bottom left of the page, each opening its own scene. They hide while a booking view is open.
- «محادثة الضيف»: the resort concierge Faisal's WhatsApp conversation with the guest (`js/whatsapp.js`, `data/whatsapp-script.js`, transcript `docs/WHATSAPP_TRANSCRIPT.md`).
- «تسليم الحجز للكونسيرج»: a booking panel assigns the booking to Faisal, a guest-file PDF travels to his phone, and the WhatsApp exchange plays (`js/handoff.js`, `data/handoff-script.js`, `docs/HANDOFF_TRANSCRIPT.md`, PDF `assets/handoff/guest-file.pdf` built by `tools/build_handoff_pdf.py`).
- A WhatsApp concierge is a concept, not documented RSG practice. Guest contact details in it are fictional.

## 8. Where settings live and how changes reach the running app

| What | Lives in | How a change takes effect |
|---|---|---|
| Agent system prompt and tool definitions | Repo: `agent/system_prompt.md`, `agent/tools.json`. Copy on Anthropic: Managed Agent (Console agent version 10 as of 12 Nov) | `python tools/console_update.py` pushes system and tools only (never the model). Then restart the backend. |
| Approved facts and wording | Repo: `visitredsea-chat-live/data/*.js` | `node tools/dump_data.mjs`, then `python tools/console_update.py` (the facts are part of the prompt), then restart the backend. The backend refuses to start if `agent/data.json` is older than the data files. |
| Booking rules, card blocks, bridge | Repo: `agent/*.py` | Restart the backend (`start_backend.cmd`); the tunnel stays. |
| Website views, page scripts, styles | Repo: `visitredsea-chat-fresh/js`, `css` | Hard refresh the page; no restart. |
| Studio templates (which card renders for which block, field mapping) | Empathy Studio only. Paste texts kept in `empathy-studio-preview/STUDIO_TEMPLATES_LIVE.md` | Edit in Studio. Takes effect on the next message. |
| Custom components (`rsg_date_range`, `rsg_guest_form`) | Definition in Studio; rendering in `visitredsea-chat-fresh/js/rsg-components.js` | Studio for the schema, page refresh for the renderer |
| Base URL, Secret Header, channel binding, Allowed domains | Empathy Studio only | Save in Studio |
| Widget look | Studio Customize, then the snippet file | Overwrite the file, hard refresh |
| Model choice | Console agent; `ANTHROPIC_MODEL` is used only when creating the agent | Not changed by `console_update.py` |
| Spend cap, loyalty rates | Environment variables of the backend | Restart the backend |

## 9. Tests, fixtures and troubleshooting

### Checks (no network, no model, temporary stores)

From `visitredsea-chat-live/`:

```
python tools/check_widget_flow.py     # villa block, review to payment without terms, PDF payload
python tools/check_page_views.py      # website-view state, drafts, activity line
python tools/check_components.py      # calendar and form blocks
python tools/check_loyalty_title.py   # points, repeat completion, title inference
```

All four end with `0 failure(s)` on a fresh clone (19 Nov).

Protocol driver for the backend's website-channel API, against a test instance with the stand-in (the mail sink must run for the e-mail path):

```
python tools/local_smtp_sink.py 2525
(backend with LIVE_AGENT_TEST_DOUBLE=1 and OTP_SMTP_HOST=127.0.0.1 OTP_SMTP_PORT=2525 OTP_SMTP_SECURITY=none OTP_SMTP_USER=sink OTP_SMTP_PASSWORD=sink OTP_SMTP_FROM=sink@localhost)
node tools/drive_live.mjs http://127.0.0.1:8121
```

It ends with `all checks passed`. There is no automated browser test; behaviour on the page is checked by driving the route in a browser.

### Fixtures

- `visitredsea-chat-fresh/tools/views-fixture.json` with `?viewsFixture=<stage>`: website views from recorded states, fictional guest, nothing sent.
- `visitredsea-chat-fresh/tools/components-preview.html`: calendar and form with a fake widget.
- `visitredsea-chat-fresh/tools/whatsapp-preview.html`: WhatsApp scene without the page.
- `visitredsea-chat-live/tools/mobile-frame.html`, `responsive-preview.html`: frames for the backend's own page.

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Widget shows the guest's message, no reply | Tunnel dead or Base URL old. Check `curl -X POST <Base URL>/sessions`: 401 means the bridge answers, 000 or a DNS error means the tunnel is gone. | Restart the tunnel, paste the new Base URL |
| The new tunnel URL fails for a minute | DNS for a new quick-tunnel name takes a short while | Wait and retry |
| No widget on the page | Missing `STUDIO_CHANNEL_KEY`, or the origin is not in Allowed domains (`python tools/check_origin.py` in the fresh folder shows which) | Fix `.env` or Allowed domains; use exactly `http://127.0.0.1:8100` |
| `start.cmd` says something answers on 8100 | The site is already running, or the backend's own `start.cmd` took 8100 | Open the URL, or stop the other process from its own window |
| Backend refuses to start: `agent/data.json is out of date` | `data/*.js` changed without a new dump | `node tools/dump_data.mjs`, then `python tools/console_update.py` |
| «تعذر الاتصال بالمساعد الآن» | Anthropic error, budget reached, or `session.error unknown_error` (seen a few times) | `http://127.0.0.1:8110/api/chat/status` shows the budget; the backend log shows the error |
| Website views never open | Backend not reachable from the site (`RSG_BACKEND_URL`), or the conversation is on another backend instance | `/api/booking/state?v=<id>` should return 200 for an active conversation |
| A view or the chat restarts from the greeting after a backend restart | Conversations live in memory (`agent/chat.py`, 2-hour expiry). Studio gets 404 and opens a new session. | Expected; completed bookings persist in `private/loyalty.json` |
| A card shows the wrong text or no card | Studio template not updated (section 10) | Compare with `empathy-studio-preview/STUDIO_TEMPLATES_LIVE.md` |

### Confirming a successful setup

- [ ] Fresh clone: the four check scripts print `0 failure(s)`.
- [ ] Offline run: the site on a spare port shows 11 resort cards; `?viewsFixture=villa` opens the villa cards.
- [ ] Backend status shows `"provider": "managed_agents"`, `"configured": true` and the remaining budget.
- [ ] `POST <Base URL>/sessions` without the key returns 401 through the tunnel.
- [ ] On http://127.0.0.1:8100/ the widget opens; a free `rsg:continue` from the browser console gets the current step's prompt.
- [ ] Only with Muhammed's OK, because it costs agent budget: one typed message gets a reply in the widget.

## 10. Known limitations, pending work and next tasks

### Verified limitations

- **The tunnel address is temporary.** Quick tunnels change on every start and can be deleted by Cloudflare. A named Cloudflare tunnel on a domain we control would keep one Base URL. It needs a Cloudflare account and a DNS record; not set up.
- **The agent budget is nearly spent:** USD 0.33 of 2.00 left on 19 Nov.
- **Conversations are in memory.** A backend restart drops conversations in progress.
- **Studio does not pass page data to the bridge.** `widget.setContext` reaches Studio as `user_metadata`, but Studio forwards only `visitor_id`, `channel_slug` and an empty `current_page_context`. The page links to its conversation through the stored visitor id. «New chat» creates a new visitor id.
- **Only the One Bedroom Overwater Villa has photos** (three). Sourcing more from RSG's official pages was approved and not started. Other villa prices are not evidenced and must not be invented.
- **Localhost only.** Allowed domains contain `http://127.0.0.1:8100`; nobody outside the machine can use the widget. Hosting the site would need HTTPS, a new allowed origin, and a way for the site to reach the backend's state API. That API is deliberately refused through the tunnel today.
- **Voice is not configured.** Transcription was left for Empathy Studio.
- **Windows-first tooling.** The `.cmd` scripts and the PowerShell PDF build are Windows only.
- **Asset licensing.** Fedra fonts (Typotheque, commercial), RSG and Shebara logos and photography were taken from public RSG sites for internal use only. Written confirmation from Red Sea Global is needed before any use beyond the project team (`visitredsea-chat-live/docs/MISSING_INPUTS.md`, item 7).

### Not confirmed (Studio-side changes prepared in the repo; I cannot see Studio)

Paste texts are in `empathy-studio-preview/STUDIO_TEMPLATES_LIVE.md`, sections from "12 November 2026". At the last check they were not applied:

- Template 12, guest path: the old Text instruction makes the widget show «<name>».
- Template 14, trip summary: `primary_button_payload` must be the bridge's `pdf` line. Otherwise «تحميل PDF» sends the label and the link comes back as a message (seen as "the PDF link twice").
- Template 6, stay summary: Studio sent only the text and no card on 12 Nov.
- Trip summary secondary title cut as «نقاط الولاء مكت»; shorten to «نقاط الولاء».

Check each in Studio before assuming either way.

### Documentation drift found while preparing this handover

- `visitredsea-chat-live/docs/CONSOLE_SETUP.md` and older README rounds say 18 tools; `agent/tools.json` has 21. Its smoke test describes the backend's own website chat on 8100, not the widget setup.
- The bridge module's docstring mentions a `channel_key` variable; Studio does not send one.
- Fixed in this commit: the live README said the stored visitor id looks like `vi_<uuid>`; it is `vid_<uuid>`. `CLAUDE.md` now gives the backend's port as 8110 and the tool count as 21.
- Tracked run-state files `visitredsea-chat-fresh/pidfresh814*.txt` and `visitredsea-chat-live/pidtunnel8110.txt` are stale process ids from earlier runs; harmless.

### Next practical tasks, in order

1. Muhammed decides: separate Studio channel and Custom Agent for Hazzem, and the agent budget.
2. Apply or verify the pending Studio template changes above, then run one complete widget booking.
3. Set up a named Cloudflare tunnel so the Base URL stops changing.
4. Source the approved extra villa photos from RSG's official pages, recording the source of each in `visitredsea-chat-live/docs/ASSETS.md`.
5. If the demo must run beyond one machine: host the site over HTTPS, add its origin to Allowed domains, and design an authenticated way for the views to read booking state.

## 11. Using Lovable with this project

Checked on 19 November 2026 against Lovable's official documentation (docs.lovable.dev; the pages are undated, and the changelog's latest entry is 16 Nov 2026).

### What Lovable supports, and why it cannot edit this repo

- **Lovable cannot connect to an existing repository.** Its GitHub integration "always creates a new repository" from a Lovable project, and connecting to a repository that already exists is listed as a limitation (https://docs.lovable.dev/integrations/github, https://docs.lovable.dev/integrations/git-sync-overview).
- **Import rebuilds.** The documented way to bring existing code in is to upload a ZIP. Lovable "rebuilds the app the way it builds new Lovable apps, on TanStack Start" and treats the ZIP as source material (https://docs.lovable.dev/features/projects/import-project).
- **One stack.** New projects are React with TanStack Start and Tailwind; Lovable offers no choice of framework (https://docs.lovable.dev/introduction/faq, https://docs.lovable.dev/glossary). Our site is plain HTML, CSS and JavaScript with no build step, and our backend is Python. Nothing in the docs runs Python; server code runs as TanStack Start server functions or Edge Functions (https://docs.lovable.dev/features/edge-functions).
- **Sync.** Once Lovable has created its own repo, sync is two-way on one branch, by default `main`. Branches can be switched in Project settings, then Git. Commits from other tools appear in Lovable. Do not force-push or rebase the synced branch (https://docs.lovable.dev/integrations/git-sync-overview).
- **Publishing** goes to a public `<name>.lovable.app` address (https://docs.lovable.dev/features/hosting).
- **Project instructions.** Lovable reads `AGENTS.md` and `CLAUDE.md` at the project root (https://docs.lovable.dev/features/knowledge).

So Lovable is the wrong tool for changing the files in `clouding-rsg`. An import would produce a rewritten copy in a separate repository, and that copy would not be our approved page.

### The workflow I recommend

Use Lovable as a design sketchpad for the website views, and bring the result back into the static files with Claude:

1. Create a new Lovable project in our Lovable workspace. Do not connect it to `clouding-rsg`. If you want its code in GitHub, let Lovable create its own repository (for example `clouding-rsg-lovable-sketches`), which only a workspace owner or admin can connect.
2. Give it the brief below, the screenshots in `visitredsea-chat-fresh/docs/views-2026-11-18b/`, and the fixture data `visitredsea-chat-fresh/tools/views-fixture.json` as the data source. Work from recorded states, not the live backend.
3. Use Plan mode before Build mode, so each change is reviewed first.
4. When a design is agreed, take screenshots and the relevant component code, and ask Claude (in `clouding-rsg`) to port it into `js/booking-views.js` and `css/booking-views.css` without a framework, keeping the behaviour in section 7. Test with `?viewsFixture=` and then the live route.
5. Keep the two repositories separate. Nothing from the Lovable repo is merged into `clouding-rsg` directly.

What suits Lovable: layout and visual exploration of the views (villa cards, airports, legs, activities, guest form, review, «حجزك»), mobile layouts, and alternative directions to show the owner.

What does not: the bridge, booking rules, the Studio integration, the widget fixes, the PDF, anything that needs the live conversation.

### Compatibility work if a Lovable app ever has to run the live journey

None of this exists today, and the first three steps are unverified:

- Add the Lovable preview and published origins to the Studio channel's Allowed domains. The preview origin is not documented; find it in the browser.
- Give the Lovable app a way to read booking state. Our `/api/studio/state` answers only locally by design; exposing it needs authentication and a decision.
- Load the widget script in a React app and port `widget-rtl.js`, `rsg-components.js` and the hand-off logic.
- The bridge stays a Python service hosted elsewhere.

### Rules for Lovable

- Do not upload the Fedra fonts, RSG or Shebara logos, or RSG photography, and do not publish anything with them, until Red Sea Global confirms the licence (section 10). In the sketchpad, use placeholder images and a system font, or keep the project unpublished.
- Lovable's website import says to import only a site you own or have permission to copy (https://docs.lovable.dev/features/projects/import-website). Do not import visitredsea.com.
- Never paste keys, the channel key or the bridge secret into Lovable.

### Not verified

- Whether a Lovable project can be kept private when published.
- How the editor preview's origin is formed.
- Whether TypeScript and shadcn are defaults.
- CORS guidance for calling an external API from the browser.
- The docs contradict each other on whether reconnecting GitHub links back to the same repository.

### Lovable brief (paste as the first message, with the screenshots attached)

```
Build a design prototype, not a production app. It shows the booking "views" of a hotel-concierge chat on a
luxury resort website. Arabic, right to left, Western digits, Gregorian dates. Use the attached screenshots
as the approved direction and the attached views-fixture.json as the only data (recorded booking states,
fictional guest). No backend, no login, no database, no real chat; a static placeholder where the chat would be.

Context. The page is a copy of a luxury destination site. A chat widget runs the booking: name, resort,
villa, party, dates, stay summary, arrival by air, airports, transfer legs and totals, activities, guest
details, special request, review, payment link. At some steps the website opens a larger "view" of that
step over the page. Every decision in a view is sent back to the chat; the chat stays the source of truth.

Design rules (approved):
- No enclosing panel. Each option is its own card floating on a transparent backdrop that blurs the page
  (rgba(16,26,32,.5), blur 14px). The page stays visible beneath.
- Villas and activities: photo cards in portrait (aspect 3/4, 4/5 on phones), full-bleed photo, dark
  legibility gradient at the bottom, serif title, 12px radius, an aqua pill button. No price, party, dates
  or tax note on villa cards.
- Airports: white tiles with a small plane icon (no airport photos). Two picks: arrival and departure.
- Transfer legs: photo cards beside a totals card. Amounts as "SAR 33,793.90", always left-to-right isolated.
- Guest details and the review: one solid "folio" sheet with the resort's hero photo as a band at the top.
  Fields: title (السيد / السيدة), first name, family name, e-mail, mobile with country code, companion's
  first and family name, special request. Inline validation under the field.
- A floating action bar at the bottom of each view: one primary aqua pill and a status pill.
- Header on the backdrop: small uppercase kicker, serif title, one-line subtitle, back and close buttons.
- A small «حجزك» pill at the bottom centre summarising resort, villa and the price once known, with
  «عرض الخطوة الحالية» to reopen the current view.
- Desktop at 1200px and wider: leave a 448px column on the left for the docked chat. Narrower and on phones:
  full width, actions within reach, no horizontal scroll at 360px.
- Palette: aqua #71bfb7 (hover #a8e0db), charcoal #1e282f, sand #fafaf7, white. No gradients except the photo
  legibility gradient, no glows, no glassmorphism beyond the one backdrop blur.
- Type: a clean Arabic sans for body and an elegant serif for titles. Do not use any brand fonts or logos;
  use placeholders for logos and photos.

Behaviour to show (static is fine): a view per step (villas, airports, legs, activities, guest details,
review); a comparison of two or three villas as a table on desktop and stacked rows on phones; read-only
once a step is passed, except guest details, which stay editable until payment.

Do not add features beyond these views. Ask before changing the step order or the wording.
```

Attach: the 14 PNGs in `visitredsea-chat-fresh/docs/views-2026-11-18b/` and `visitredsea-chat-fresh/tools/views-fixture.json`. For reference only (do not upload): `visitredsea-chat-fresh/css/booking-views.css` holds the exact sizes and colours, and `css/site.css` the site's tokens.

## 12. Start here in Claude (paste into a new Claude Code session at the repository root)

```
You are continuing the Red Sea Global (RSG) concierge proof of concept in this repository. Before you change
anything, establish the current state.

1. Read HANDOVER_HAZZEM.md fully, then CLAUDE.md, then visitredsea-chat-fresh/README.md and
   visitredsea-chat-live/README.md (newest rounds first: Round 11 and the "second design" section).
2. Inspect the implementation that the handover describes: visitredsea-chat-live/agent/studio_bridge.py,
   agent/state.py, agent/chat.py, server.py; visitredsea-chat-fresh/server.py, js/booking-views.js, js/site.js,
   js/widget-rtl.js, js/rsg-components.js. Where the code and any document disagree, the code wins; list
   each disagreement.
3. Run, without credentials and without spending agent budget: the four check scripts in
   visitredsea-chat-live/tools (check_widget_flow, check_page_views, check_components, check_loyalty_title),
   then the offline run from section 4, step 3 of the handover on spare ports, including ?viewsFixture=villa.
4. Run git status and git log -5, and report: what works, what failed, which pending Studio changes
   (handover section 10) you cannot verify from here, and what you need from me (credentials, Studio access,
   decisions).

Rules: never read or print .env files, private/profiles.json, private/bridge_secret.txt or any key. Never set
LIVE_AGENT_TEST_DOUBLE=1 for a demo. Do not bind ports 8100 or 8110 if another copy might be running; use
spare ports. Do not send a typed message to the live agent, run console_update.py or console_setup.py --update,
or change anything in Empathy Studio without my explicit OK. Facts, prices and names come only from
visitredsea-chat-live/data/*.js and the research files. Wait for my go-ahead after the status report.
```

## 13. What is not in the repository

Kept out on purpose; ask Muhammed if you need any of them.

| File or folder | Why |
|---|---|
| `visitredsea-chat-fresh/.env`, `visitredsea-chat-live/.env`, `visitredsea-chat-mockup/.env` and `.env.txt`, `visitredsea-chat-mockup-v2/.env` | Credentials (channel key, Anthropic key, SMTP) |
| `visitredsea-chat-fresh/private/` | Widget snippet with the channel key |
| `visitredsea-chat-live/private/bridge_secret.txt` | Bridge secret |
| `visitredsea-chat-live/private/profiles.json`, `private/loyalty.json` and the mockups' `private/profiles.json` | Guest profiles and loyalty records |
| `visitredsea-chat-live/private/agent_spend.json`, `base_url.txt`, `tunnel.log`, `pidbridge*.txt` | Local run state |
| `Control Plane Admin — Clouding AI.html` and its `_files` folder | Saved copy of an authenticated admin page |
| `visitredsea-chat-fresh/.sf/` | Salesforce CLI cache, now ignored |
| `reports/tmp/`, Office lock files, `__pycache__/` | Scratch and caches |

`visitredsea-chat-live/private/profiles.seed.json` is committed on purpose: the one approved returning-customer account for the website chat's e-mail sign-in, prepared on the owner's instruction (20 Oct 2026). It holds a real team member's contact details, so keep the repository private.
