# RSG agent instructions, tool definitions and Studio prompts: audit of 9 November 2026

Scope: the live application (`visitredsea-chat-live/`, Claude Managed Agent `agent_01D3yFvZ2ZTDBwxa8i5g8YN3`, Studio bridge `agent/studio_bridge.py`), the fresh widget page (`visitredsea-chat-fresh/js/site.js`) and the Studio template texts (`STUDIO_TEMPLATES_LIVE.md`). V1/V2 (`data/script.js`, `js/chat.js`) were used as the record of approved behaviour. Read-only evidence from the Console: `client.beta.agents.retrieve` on 9 Nov 00:5x UTC. Studio's own configuration could not be inspected (the admin UI asks for a sign-in link), so every Studio item below is classified **local source only**.

## Inventory and classification

| Item | Location | Class |
|---|---|---|
| Managed Agent system prompt + persona + rules | Console agent `agent_01D3…` (authoritative); source `visitredsea-chat-live/agent/system_prompt.md` + facts from `agent/data.json` | **active**; Console content was byte-identical to the local build before this audit (23,675 chars, `updated_at` 8 Nov 13:28 UTC, version 2) |
| 18 custom tools | Console agent (authoritative); source `agent/tools.json`; handlers `agent/tools.py` → `agent/state.py` | **active**; identical except server-added defaults (`required: null`, toolset `permission_policy`) |
| Context block injected before every guest message | `agent/chat.py _context()` | **active** |
| Tool-result contracts (`ok`, `note`, `shown`, `error`) | `agent/state.py` | **active** |
| Customer-facing wording and fallbacks | `data/script.js` → `agent/data.json` | **active** (hash-checked at start) |
| Studio bridge: markers, payload→event mapping, widget notices | `agent/studio_bridge.py`, `server.py /studio/*` | **active code, not yet bound in Studio** (channel still points at the Claude agent) |
| Studio templates: 14 WHEN TO SELECT + 28 component instructions | Studio RI canvas (inaccessible); copy-ready source `STUDIO_TEMPLATES_LIVE.md` | **local source only**; what the owner pasted is unverified |
| `rsg:` marker protocol and templates §2/§5 | `STUDIO_CONFIGURATION_GUIDE.md` | **draft, superseded** (the bridge never emits it; §6 says so) |
| Page hand-off trigger (`LEAD` sentence watch), «اختر» → «نختار <Resort>.» | `visitredsea-chat-fresh/js/site.js` | **active** |
| Studio channel binding, allowed domains, RI toggle | Studio UI | **inaccessible** |

Approved behaviour vs. what the configuration supports, where they differ: (1) the approved comparison turn is three bubbles and the approved Shebara turn is two; the Studio contract delivers one reply per message, so the templates written for separate replies cannot render the second component. (2) The approved journey continues through a guest form, an e-mail code and a terms checkbox; the widget has none, so a widget session ends at the guest-path step. Neither is a new requirement: both are recorded as gaps, not papered over.

## Review table

Decision key: Rewrite / Correct / Retain with evidence / Unverified. "Applied" = the local source is changed. "Prepared" = exact text ready, destination outside my access.

### A. Managed Agent prompt (`agent/system_prompt.md` → Console)

| Item | Finding and evidence | Decision | Applied or prepared |
|---|---|---|---|
| A1 Persona, dialect, journey summary | Matches the approved V2 voice (`data/script.js`) and `T.STAGES` (voice is a website-only stage, correctly absent). | Retain with evidence | — |
| A2 `<context>` rule | The block had no channel, so the agent could not know the widget has no calendar/form/checkbox. `_context()` now sends `channel`. | Correct | Applied locally and on the Console |
| A3 Greeting when no name yet | No rule; the first widget message «السلام عليكم» got an improvised greeting (session `sesn_01SGYS…`). The approved greeting (`SCRIPT.greeting`) is not in the facts JSON, so it is quoted in the prompt. | Rewrite | Applied (local + Console) |
| A4 Decision rule, "write nothing after ok:true" | Sound (guards in `chat.py` enforce it). "One tool per message" contradicted the fallback the prompt itself orders after a failed hand-off; `chat.py` allows a second tool only after an error result. | Correct (exception named) | Applied (local + Console) |
| A5 Questions, remarks, partial answers | Questions were covered; nothing said that a follow-up or a partial answer must not advance the step or be completed by guessing. | Correct (rule added) | Applied (local + Console) |
| A6 `not_allowed_in_stage` / `ok:false` handling | Every `ok:false` in `state.py` carries a `note` and the application's reply; `call_tool` returns `allowed_now`. Wording matches. | Retain with evidence | — |
| A7 Rephrasing, approval words in questions, refusals | Live evidence «تمام؟ وش بعد؟» handled as a question (README 8 Nov). | Retain with evidence | — |
| A8 `navigate_to_resorts` rule | Said "moves the page and highlights"; the agent must describe only the browser's report. Error reasons now listed (`cards_missing`, `no_ack`, `interrupted` from `chat.py`; `not_on_page`, `unknown_target` from `state.py`); fallback call named. | Rewrite | Applied (local + Console) |
| A9 Comparison rule | Correct, plus: a question about one difference is answered from `RESORT_COMPARE` in text (live evidence session 685135c7). | Correct | Applied (local + Console) |
| A10 Channel `studio_widget` section | Missing entirely; without it the agent would describe the calendar, form or checkbox and might collect personal details in the chat. | Rewrite (new section) | Applied (local + Console) |
| A11 Evidence-only hard rule | Facts block = BOOKING, RESORTS, VILLAS, RESORT_COMPARE (`console_setup.build_system`). | Retain with evidence | — |
| A12 Single priced route | Matches `BOOKING` and every `state.py` price check. | Retain with evidence | — |
| A13 Payment / verification | Did not separate a shown link, a click, a payment and a reservation. Now explicit. | Correct | Applied (local + Console) |
| A14 Voice not configured | Matches `voice_message()`. | Retain with evidence | — |
| A15 Digits, months, English names | Matches `bidiPayload`/`fill` conventions. | Retain with evidence | — |
| A16 Name and companion | «زوجتك» forced on a female guest in the agent's own words (README known limitation). Approved copy untouched; the agent's own sentences follow the guest's word and `state.guest.secondGuestFirstName`. | Correct | Applied (local + Console) |
| A17 Concision | Matches the live behaviour. | Retain with evidence | — |
| A18 Approved facts section | Accurate description of the JSON appended by `console_setup.py`. | Retain with evidence | — |

### B. Tool definitions (`agent/tools.json` → Console), traced to `tools.py` → `state.py`

| Tool | Finding and evidence | Decision | Applied or prepared |
|---|---|---|---|
| `set_guest_name` | Stage `name` only; handler strips greeting words, first token, ≤20 chars. Description accurate. | Retain with evidence | — |
| `show_resort_suggestions` | Stages intent/resort; result lists `D.SUGGESTED`. | Retain with evidence | — |
| `navigate_to_resorts` | Description promised minimising the chat (website only) and did not name the result shapes. Now: result `{ok, visible}` or `{error}` with the five error names; "describe only what it reports"; fallback. Target ids checked = the 11 page cards. | Rewrite | Applied (local + Console) |
| `show_resort_comparison` | Matches `show_comparison()`; informational + choice in one tool. | Retain with evidence | — |
| `select_resort` | Did not say an unknown name returns `error unknown_resort` or that non-Shebara returns `ok:false`; also "choice, not question". | Correct | Applied (local + Console) |
| `select_villa` | Arabic card names accepted by the handler; seven unpriced villas return `ok:false`; unknown → `unknown_villa`. Added. | Correct | Applied (local + Console) |
| `set_party` | Did not say that anything but 2 adults returns `ok:false`; invited guessing. | Correct | Applied (local + Console) |
| `set_dates` | "The month is October 2026 unless the guest says otherwise" invents a guest input. Now: ask when month or year is missing; check-out after check-in (`checkout_not_after_checkin`). | Correct | Applied (local + Console) |
| `approve_stay` | Stage approve1; "never on a question or refusal". | Retain with evidence | — |
| `set_transfer_mode` | Enum equals `BOOKING.transport.modes` (checked). | Retain with evidence | — |
| `set_airports` | Did not require both airports; handler also matches Arabic names and substrings. Now: call only with both; one → ask. | Correct | Applied (local + Console) |
| `approve_transfers` | Stage approve2. | Retain with evidence | — |
| `defer_experiences` | Moves to `account`; matches. | Retain with evidence | — |
| `experience_interest` | `ok:false` + approved "arranged after booking" reply; matches. | Retain with evidence | — |
| `choose_account_mode` | Stages account/login, login→guest only; matches `account_mode()`. | Retain with evidence | — |
| `record_special_request` | Unclear → `unclear_request` + clarify text; matches. | Retain with evidence | — |
| `confirm_review` | "Checks the terms checkbox" is website-only; the widget passes written consent. | Correct | Applied (local + Console) |
| `show_current_step` | Any stage; table covers all 20 stages. | Retain with evidence | — |

### C. Application-injected context and result contracts

| Item | Finding and evidence | Decision | Applied or prepared |
|---|---|---|---|
| `_context()` block | Added `channel`; `allowed_now` and `recent_events` already accurate. | Correct | Applied (`agent/chat.py`) |
| `action_result()` | Could not carry a note; the widget bridge needs to say the highlight is unconfirmed. | Correct | Applied (`agent/chat.py`) |
| `confirm()` terms note | Said "checkbox under the review card" for both channels. | Correct | Applied (`agent/state.py`) |
| Other `state.py` notes (`shown`, price notes) | Each matches the reply it accompanies. | Retain with evidence | — |

### D. Studio bridge (`agent/studio_bridge.py`)

| Item | Finding and evidence | Decision | Applied or prepared |
|---|---|---|---|
| Hand-off acknowledgement | Told the agent `ok:true, visible: first three resorts` before any page confirmed anything (fabricated result). Now `visible` = the page's card list plus a note that the highlight is not confirmed; the prompt tells the agent what it may say. | Correct | Applied |
| Website-only steps (`signIn`, `guestForm`, `verify`) | Reply was the approved lead-in («اكتب بريدك الإلكتروني… ونرسل لك رمز») followed by a bracketed `[widget: …]` label and a contradicting note, all visible to the guest. Now one plain sentence (`live.widgetStep`), no label, no personal-data collection. | Rewrite | Applied |
| Calendar step | `[widget: no calendar…]` label leaked as text. Now a plain sentence (`live.datesWidget`); the dates fallback «في التقويم» is swapped for it. | Rewrite | Applied |
| Airports picker payload | The grouped picker sends "group: option" pairs in click order (`studio-renderers.js` line 254); the regex required arrival first. Now order-independent, one option per group, else `airportsBad`. | Correct | Applied |
| Written consent | Counted only for the message that contained it. Now remembered for the session (widget has no checkbox). | Correct | Applied |
| Confirmation-card icons | Templates require icon URLs; the bridge supplied none. Now `icons = …` line with the website's SVGs. | Correct | Applied |
| Edit / PDF buttons | Answered with the generic "step on the website" line. Now a specific one (`live.editWidget`). | Correct | Applied |
| Markers (15 keys), card payload lines, duplicate guard, 404/400 | Every emitted `button`/`payload` maps back to the intended event (static check); duplicate within 3 min returns the stored reply, failed turns are not replayed. | Retain with evidence | — |

### E. Studio templates (`STUDIO_TEMPLATES_LIVE.md`; Studio canvas inaccessible)

| Template | Finding and evidence | Decision | Applied or prepared |
|---|---|---|---|
| All Text components | Instructions named one sentence each; the single-reply contract puts the lead-in, the agent's sentence, the hint and sometimes a second lead-in in one reply. | Rewrite (one generic rule) | Prepared (revision section) |
| All WHEN TO SELECT | Keyed on "begins with"; now also on the block label so plain replies never match. | Correct | Prepared |
| 1 suggestions | Reply = lead-in + `[cards: resort_suggestions]` (+ agent sentence after the block in the fallback case). Payloads «نختار X.» map to the resort event. | Correct (label) | Prepared |
| 2 details + 5 villas | One reply carries both; template 5 never selects. | Rewrite (merge) | Prepared |
| 3 comparison + 4 choice | One reply carries comparison, recommendation and choice; template 4 never selects. Informational carousel keeps no buttons; only the choice carousel has «اختيار». | Rewrite (merge) | Prepared |
| 6 stay summary | Trailing sentence is in the same reply; icon URLs now supplied. | Correct | Prepared |
| 7 arrival mode | Payloads «بالطائرة.» etc. map to the mode event. | Retain + label | Prepared |
| 8 airports | Groups/options match `BOOKING.transport`; payload order handled in the bridge. | Retain + label | Prepared |
| 9 legs + 10 totals | One reply carries both; template 10 never selects. | Rewrite (merge) | Prepared |
| 11 experiences | Hint line belongs to Text; no buttons. | Correct | Prepared |
| 12 guest path | Payloads map to the account event. | Retain + label | Prepared |
| 13 review, 14 trip summary | Correct as written but unreachable through the widget (form/code are website steps); never claim payment/booking. | Retain with evidence; reachability flagged | Prepared (labels, icons) |
| Checkout card (guide §5.15) | A web button posts text; the bridge answers «المتابعة للدفع» with the official URL as text. Whether a Studio web button can open a URL is unverified. | Unverified | — |

### F. Page and wording

| Item | Finding and evidence | Decision | Applied or prepared |
|---|---|---|---|
| `site.js` LEAD watch | Hand-off reply has no block → no template → `m.content` stays a string → trigger fires. «اختر» posts the approved line. | Retain with evidence | — |
| `live.*` widget sentences | `widgetStep` reworded to cover sign-in and to say personal data is not taken here; `datesWidget`, `editWidget` added. | Correct | Applied (`data/script.js`, dump regenerated) |
| Other fallbacks (`airports.fallback`, `account.*`, `review.terms`) | Reachable in the widget only where the component exists (picker) or appended with the widget note. | Retain with evidence | — |

## Not inspected

Studio's live template fields, channel binding and RI toggle (sign-in link required); the Managed Agent's runtime behaviour under the revised prompt (no live session was started, per scope).

## Static checks performed

`tools.json` parsed; tool names = `call_tool` branches = `TOOL_STAGES` keys; every tool refused by `call_tool` in a stage outside its table; `set_transfer_mode` enum = data modes; `navigate_to_resorts` description lists all 11 page ids; context block carries `channel`; every bridge component renders without a `[widget` label and every emitted button/payload maps to its event type (24 payloads); all 11 quick-reply labels map; airport payload parsed in both click orders, two arrivals rejected; consent regex accepts consent and rejects a question; the greeting quoted in the prompt equals `SCRIPT.greeting`; `agent/data.json` hash check passes after the dump. Script: `%TEMP%\static_checks.py` (session scratch).

## Copy-ready, not applied

1. **Console agent**: applied on 9 Nov 13:19 UTC (version 2 → 3) with `agents.update(system, tools)` only; read-back confirmed 26,203 system characters, the 18 audited descriptions, and model/name/description/MCP/skills/toolset unchanged. `console_setup.py --update` was not used because it also resends `model`.
2. **Studio templates**: the "Revision of 9 November 2026" section of `STUDIO_TEMPLATES_LIVE.md`.

## Evidence still needed

A read of the Studio canvas (screenshot or export of each template's WHEN TO SELECT and component instructions) to confirm what was pasted; confirmation that one template may hold two carousels; whether a web Confirmation Card button can open a URL; one live widget session after the rebinding to observe the hand-off sentence, the merged templates and the `session.error unknown_error` seen on 9 Nov.
