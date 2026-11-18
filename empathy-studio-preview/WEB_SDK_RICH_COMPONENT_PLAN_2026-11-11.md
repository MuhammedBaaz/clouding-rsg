# Clouding Web SDK: adding a date-range calendar and a guest-details form for the RSG journey

Read-only review and implementation plan, 11 November 2026. Nothing was implemented, committed or changed in the SDK, in Empathy Studio or in the agent. First version written from the published bundle only; this version adds the repository evidence after GitLab access was granted the same day.

## Review status

| Item | Status |
|---|---|
| Repository `https://git.clouding.ai/sdk/web-sdk` (GitLab project 91) | **Read through the GitLab web UI and API**, branch `main`, head commit `a9251dcc` ("Merge branch 'docs/refresh-claude-md' into 'main'", Mohamed Gaber, about one week before 11 Nov 2026). `package.json` version `1.15.0`; `CHANGELOG.md` dates 1.15.0 to 2026-10-28. Files were read one by one over the API; no local clone (HTTPS and SSH clones are refused for this account). |
| `docs/new-rich-component-guide.md` | **Read in full.** It is a scaffolding recipe (an agent skill with `$ARGUMENTS`) for a component inside a **prefix bundle**, not for the core bundle. |
| Built SDK `https://cdn.clouding.ai/sdk/web/next/core.min.js` | **Read** (version string `1.15.0`, 203,053 bytes, fetched 11 Nov 2026; no source map published). The RSG site loads this exact URL (`visitredsea-chat-fresh/server.py`, `STUDIO_SDK_URL`). |
| Decoded TypeScript of five renderers, `empathy-studio-preview/reference/sdk/rich-components/` | Read earlier; now superseded by the repository sources where they differ. |
| Empathy Studio | From the walkthrough notes in `STUDIO_CONFIGURATION_GUIDE.md` and the live RSG channel runs of 10 and 11 Nov. The JSON Studio emits for a **custom** component was not observed. |
| RSG flow rules | `reports/Red Sea Global POC due diligence.md` (captures R099, R223), `reports/csv/coverage_matrix.csv`, live backend `visitredsea-chat-live/agent/state.py`. |
| Not read | `examples/kitchen-sink.html` script bodies (the page's visible text only), `specs/` beyond the search hits, `INTEGRATION.md` beyond the search hits, `tests/unit/rich-components/grouped-list-picker.test.ts` body (its imports only). |

**Verified** = read in the repository, the bundle or the RSG evidence named. **Proposed** = a design choice for the implementer. **Unverified** = evidence missing; section 5 says what is needed.

---

## 1. Verified component lifecycle: the grouped list picker

Chosen because it is the closest built-in to a form: several groups of choices, a multi-select mode, a submit button, lock after submission and state restored on re-render. The financing calculator in the `aam` bundle is the closest **custom** component with real inputs and is used in section 2 and 4.

### 1.1 Name, type keys, payload and incoming message

- **Type keys.** `src/core/widget.ts` (around line 639) registers `registry.register('grouped-list-picker', (payload, onSelect, selection) => renderGroupedListPicker(payload as …, onSelect, selection))`; the 1.15.0 bundle registers the same renderer under `grouped_list_picker` and `grouped-list-picker` (both spellings also for carousel, carousel card, confirmation card, selection list picker and buttons). `docs/rich-components/grouped-list-picker.md` names them "v1" (`grouped_list_picker`) and "v2" (`grouped-list-picker`). Studio's slug `grouped-list-picker` is the v2 key.
- **Payload** (`src/rich-components/grouped-list-picker/index.ts`, interface `GroupedListPickerPayload`): `main_title?`, `is_multiple_selection?`, `lock_after_selection?` (default `true`), `send_button_label?` (default `"Done"`), `groups: [{ title, options: string[] }]`. The doc adds limits of 30 characters for titles and labels. Groups with an empty title or no options are skipped.
- **Schema.** There is no payload validation in the SDK: `src/rich-components/types.ts` types `RichComponent.payload` as `unknown` and each renderer reads its fields directly. The schema lives in Studio's component definition and constrains what Rendering Intelligence produces.
- **Incoming message.** `src/transport/v2/chat-v2-transport.ts` parses SSE events (`src/transport/v2/parse-sse-v2.ts`) with `handleEvent`: `ack`, `status`, `streaming`, `message`, `stream_end`, `error` (types in `src/transport/v2/types.ts`, contract in `docs/api-v2.md`). A `message` event carries one `V2SingleMessage` or `messages[]`; `emitSingleMessage` turns `{ type: "rich_components", text, components: [{ type, payload }] }` into the internal message `{ id, content: text, sender: "agent", timestamp, type: "rich_components", components }`. For RSG the bridge never writes this JSON: it returns `{ "reply": "<lead-in>\n[picker: airports]…" }` to Studio and Rendering Intelligence produces the component (verified by the live run of 11 Nov: the widget received `grouped-list-picker` with `main_title`, `groups`, `is_multiple_selection: true`, `send_button_label: "اعتماد المطارات"`).

### 1.2 How the widget recognises the message and picks the renderer

- `src/messages/message-renderer.ts` checks `message.type === "rich_components"` and calls `renderRichMessage(components, registry, onSelect, { onUnknownType, hasFailedPrefix })` from `src/rich-components/rich-renderer.ts`.
- `renderRichMessage` builds `div.rc-container`; for each component, `registry.get(type)` (`src/rich-components/registry.ts`, a `Map` with `register`, `get`, `has`, `getAll`, `onRegister`). A hit calls `renderer(payload, wrappedSelect, component.selection)`.
- **Unknown type.** Only when the type contains an underscore does `renderRichMessage` derive a prefix (`type.substring(0, indexOf('_'))`) and show `div.rc-loading`; `src/rich-components/auto-loader.ts` (`AutoLoader`) then loads one script per prefix from the directory the core bundle came from: `<base>/<prefix>.min.js` when the core file is `core.min.js`, `<base>/chat-widget-<prefix>.js` otherwise (`buildScriptUrl`). After the script loads, every pending type of that prefix must be registered, or the prefix is marked failed and the placeholder becomes `div.rc-load-failed` "Component unavailable". A message where nothing rendered shows `span.rc-fallback` "Message content not supported" (`tests/integration/auto-loader-widget.test.ts` covers the whole flow).
- `registry.onRegister` re-sets the messages state (`src/core/widget.ts`), so a component registered after its message arrived is drawn in place.
- **Public registration (verified):** `widget.registerComponent(type, renderer)` on the instance and `window.ChatWidget.registerComponent(type, renderer)` (`INTEGRATION.md` "widget.registerComponent — Custom Rich Components" around line 1350; spec `specs/016-rich-components/spec.md` FR-015). Renderer contract `ComponentRendererFn = (payload: unknown, onSelect: SelectCallback, selection?: RichSelection) => HTMLElement` (`src/rich-components/types.ts`).

### 1.3 Data, validation and interaction state inside the renderer

- `renderGroupedListPicker(payload, onSelect, selection?)` keeps state in closures: a `Set` of keys `"<group title>: <option>"`, `locked = lock_after_selection !== false && selection !== undefined`, and the chip buttons. Multi-select toggles chips and enables `button.glp-send-btn`; single-select submits on the first tap.
- Restore: multi-select splits `selection.value` on `", "` to re-mark chips; single-select compares `selection.value`; locked components disable everything.
- Validation is "at least one selection". No built-in renderer contains a text input; the only text input in the widget is the composer (`src/input/`).
- Styles are injected once into the shadow root through `injectStyles(root, 'data-glp-styles', getGroupedListPickerStyles)` (`src/aam/shared/inject-styles.ts`, shared by core pickers and the aam bundle).

### 1.4 What is emitted on submission, where it goes, how the conversation receives it

- The renderer calls `onSelect(value, 0)` with `value = Array.from(selectedSet).join(", ")`.
- `renderRichMessage` wraps `onSelect`: it writes `component.selection = { index, value, cardIndex? }` on the component object first, then calls the widget's rich-select callback.
- In `src/core/widget.ts` that callback does three things: `messagesAPI.add({ content: value, sender: "visitor" })`, `transportManager.send(value)`, `callbacks.onSend(value)` if configured. `TransportManager.send` (`src/transport/transport-manager.ts`) throws on an empty string, builds `{ clientId, content, timestamp }` and queues it while the transport is busy (`src/transport/message-queue.ts`).
- `ChatV2Transport.send` posts `POST <transport.sseEndpoint>` (`https://acp-test.clouding.ai/api/v1/chat` for RSG) with headers `X-API-Key`, `Content-Type: application/json`, `X-Visitor-ID`, `X-Session-ID` and body `{ "data": { "type": "text", "text": "<value>" }, "timestamp": "<ISO>", "user_metadata"?: {…} }` (`buildHeaders`, `buildBody`; `V2OutboundPayload`). `docs/api-v2.md`: `data.type` is always `"text"`, `text` is limited to **1000 characters**, attachments are audio only.
- **So a rich-component submission is a plain visitor text message with no component id, no action type and no field map.** Studio forwards the text to the bound agent; for RSG it arrives at `POST /studio/sessions/<id>/messages` as `message`, and `visitredsea-chat-live/agent/studio_bridge.py:event_for()` recognises approved lines (the airports line on 11 Nov) while anything else goes to the Managed Agent.

### 1.5 Errors, repeated submissions, history

- **Errors.** HTTP failure, a request timeout (`transport.requestTimeout`, default 60,000 ms) or an SSE `error` frame call `emitFailed(clientId, reason)`; the visitor message gets `status: "failed"`, the bubble gets `message-bubble--failed` and a retry hook (`callbacks.onMessageRetry`). A body that ends without `stream_end` is treated as truncated (1.15.0 fix). Nothing is reported back into the component.
- **Repeated submissions.** In-session, the lock prevents a second submit. The SDK has no idempotency key; the RSG bridge keeps its own duplicate guard per session.
- **History.** The widget subscribes to the messages state and calls `sessionStore.saveMessages(messages)` (`src/session/session-store.ts`) under the localStorage key `chatwidget_v2_chatHistory` (seen on the RSG site on 11 Nov). Because `selection` was written on the component object before the visitor message was added, the saved component carries it; on reload `messagesAPI.set(history)` re-renders through the same path and the renderer receives `selection`, so submitted pickers come back locked with the chosen values.
- **Discrepancy, spec versus code.** `specs/016-rich-components/spec.md` (clarifications) says interaction state is "session-scoped, persists across widget close/reopen but resets on page refresh". The current code persists messages, and with them the selection, across a page refresh. The code is what ships; the spec is stale on this point.

### 1.6 Guide and documentation versus code

| Topic | Guide / docs | Code (`main`, `a9251dcc`) | What holds today |
|---|---|---|---|
| Prefix of a custom type | Guide and `INTEGRATION.md` ("Auto-Loading Custom Bundles", around line 1461): text before the first `_` | `auto-loader.ts:extractPrefix` accepts `_` or `-`; `rich-renderer.ts` derives the prefix **only from `_`** before asking the loader | Only underscore types (`rsg_date_range`) auto-load. A kebab type (`rsg-date-range`) renders "Message content not supported" unless it was registered before the message arrived. |
| Bundle file name | `INTEGRATION.md`: `chat-widget-{prefix}.js`; `docs/aam-components.md`: `aam.min.js` | `buildScriptUrl`: `<prefix>.min.js` when the core file is `*.min.js`, else `chat-widget-<prefix>.js`; CI (`scripts/ci/r2-upload.mjs`) uploads `dist/chat-widget-aam.js` **as** `aam.min.js` | On the CDN the name is `<prefix>.min.js` next to `core.min.js`; locally (`vite` dev, `chat-widget.js`) it is `chat-widget-<prefix>.js`. Both docs are each half right. |
| Style injection | Guide: `requestAnimationFrame` + `getRootNode()` + `style[data-…-styles]` | `src/aam/shared/inject-styles.ts` `injectStyles(root, attr, getStyles)` used by the calculator and the core pickers | Use the helper; same intent as the guide's inline snippet. |
| Calculator message | `docs/aam-components.md`: "Get offer for {TRIM} with …" | `src/aam/financing-calculator/index.ts` `offerMessage`: "Submit Enquiry about {trim} with {amount} QAR down payment for {months} months as {status}" (and an Arabic variant) | Doc drift; the code string is the one the backend receives. |
| Component restore | Guide: "apply disabled + highlighted state immediately" from `selection` | The calculator sets `submitted = true` from `selection` and locks, but does **not** restore slider or trim values from `selection.value` | A new renderer must parse `selection.value` itself if it wants to show what was submitted. |

---

## 2. Checklist for adding a new rich component

Three verified ways, with owners:

| Path | Mechanism | Owner | Fit |
|---|---|---|---|
| **A. In-core renderer** | `src/rich-components/<name>/` + `registry.register(...)` in `src/core/widget.ts`, shipped in `core.min.js` | Web SDK repository, stable release to `sdk/web/latest/` | Product-wide components. Not what the guide describes. |
| **B. Prefix bundle (the guide's path)** | `src/<prefix>/…` self-registering through `ChatWidget.registerComponent`, built by `vite.config.<prefix>.ts` into `dist/chat-widget-<prefix>.js`, deployed by CI as `<prefix>.min.js` beside `core.min.js`, auto-loaded on the first `<prefix>_…` type | Web SDK repository + CI deploy (`.gitlab-ci.yml`, `scripts/ci/r2-upload.mjs`) | The documented path. Today only the `aam` bundle exists: `BUNDLES` in `r2-upload.mjs` and `build:all` in `package.json` list core and aam only, so a new prefix needs both edited. |
| **C. Host-page registration** | `widget.registerComponent(type, renderer)` from the site that embeds the widget | The RSG fresh site (`visitredsea-chat-fresh/index.html`) | No SDK release or CDN change; the renderer is a plain script on the page. Enough for the demo; kebab or underscore type both work because registration precedes the message. |

Studio side (all paths): "Create component" (Name, Slug, Channel compatibility "Web SDK", default Instruction, Schema) plus a template with WHEN TO SELECT. **Verified in the backend and admin-panel sources (same day, after this section was first written):** the wire `type` is the template's component-reference slug, which the admin panel sets to the component's own slug (`backend/agent_control_plane`, `internal/services/chat.go` line 880: `RichComponent{Type: rc.ComponentSlug, Payload: rc.Payload}`; `backend/admin-panel`, `src/pages/channels/components/ChannelRIPanels.tsx`: `component_slug: buildUniqueRefSlug(component.slug, siblings)`). The slug is stored exactly as typed (`internal/services/component.go`: `Slug: req.Slug`, no normalisation); the create form auto-derives a kebab-case slug from the name but lets the operator overwrite it, and its pattern `^[a-z0-9][a-z0-9-_]*$` accepts underscores (`src/pages/components/ComponentFormFields.tsx`). Two cautions: the slug is immutable after creation, and a reference label in the template editor turns the type into `<slug>__<label>` (`refSlug.ts`), which the SDK would not find. So for path B type the slug `rsg_date_range` by hand and leave the reference label empty; with path C any spelling works. The system components confirm the rule: they arrive as `carousel`, `confirmation-card`, `selection-list-picker`, `grouped-list-picker` (`internal/domain/models/component.go`), which is what the RSG widget received on 11 Nov.

### Ordered steps for path B (verified against the guide and the `aam` bundle)

| # | File(s) | Change | Why | Pattern |
|---|---|---|---|---|
| 1 | `src/rsg/index.ts` (new) | Bundle entry: `declare const ChatWidget`, guard, `ChatWidget.registerComponent('rsg_date_range', …)` and `'rsg_guest_form'` (register the kebab spellings too) | The auto-loader expects the bundle to self-register every pending type | `src/aam/index.ts` |
| 2 | `vite.config.rsg.ts` (new), `package.json` `build:rsg` and `build:all` | IIFE build `dist/chat-widget-rsg.js`, `emptyOutDir: false` | The guide's "bundle infrastructure" | `vite.config.aam.ts`, `package.json` scripts |
| 3 | `scripts/ci/r2-upload.mjs` `BUNDLES`, `.gitlab-ci.yml` build size report | Add `{ name: 'rsg', src: 'dist/chat-widget-rsg.js', file: 'rsg.min.js' }` | Otherwise the bundle is never deployed and the widget shows "Component unavailable" | Existing `aam` entry |
| 4 | `tests/unit/rsg/date-range.test.ts`, `tests/unit/rsg/guest-form.test.ts` (new, written first) | Rendering group (container class, title, fields, empty-payload fallback, hidden fields) and interaction group (message sent on submit, lock, second interaction ignored, restore from `selection`) | Guide step 2, TDD; vitest + happy-dom (`vitest.config.ts`, `tests/setup/storage-polyfill.ts`) | `tests/unit/aam/financing-calculator.test.ts`, `tests/unit/rich-components/grouped-list-picker.test.ts` |
| 5 | `src/rsg/date-range/styles.ts`, `src/rsg/guest-form/styles.ts` | `get…Styles()` with unique class prefixes (`dr-`, `gf-`), card border `1.5px solid var(--border-color)`, radius 14px, theme variables | Guide step 3 | `src/aam/financing-calculator/styles.ts` |
| 6 | `src/rsg/date-range/index.ts`, `src/rsg/guest-form/index.ts` | `render…(payload, onSelect, selection?)`, `injectStyles`, empty fallback, `submitted` from `selection`, `<button type="button">`, no imports from core internals (only `../shared/*`, `../../utils/rtl` as the calculator does) | Guide step 4 | `src/aam/financing-calculator/index.ts` |
| 7 | `examples/kitchen-sink.html` | Demo buttons in "Custom Components (Auto-Loaded)" injecting sample messages | Guide step 6 | Existing aam button |
| 8 | `docs/rsg-components.md` (new) | Type, payload example, field table, behaviour, submission text | Guide step 7 | `docs/aam-components.md` |
| 9 | Validate: `npm test -- --run`, `npm run lint`, `npm run build:rsg` | Gates CI runs on every MR (`lint`, `test:coverage`, `build:all`) | Guide step 8, `.gitlab-ci.yml` | |
| 10 | Release: `npm run release:next` (tag `v1.15.1-next.N` → `sdk/web/next/`), later a stable tag → `sdk/web/latest/` | Deploy runs only on tags; `next` never touches `latest` | `scripts/release-next.mjs`, `r2-upload.mjs` | |
| 11 | Studio: create the two components (slug, Web SDK, schema, default instruction), two templates with WHEN TO SELECT on the bridge's lead-in sentence, mark Required | So Rendering Intelligence emits them | Templates 12 to 14 in `STUDIO_TEMPLATES_LIVE.md` | Studio owner |
| 12 | Backend / agent (RSG): `card_block()` blocks, `event_for()` parsing of the two submission lines, approved lines in `data/script.js`, `node tools/dump_data.mjs`, `tools/console_update.py` | The submission is text; the application must map it deterministically | `[picker: airports]` and `_airport_from_label` in `agent/studio_bridge.py` | RSG backend owner |

Path C needs steps 6 (as a page script), 11 and 12 only, plus a `<script>` in `visitredsea-chat-fresh/index.html` before `studio-widget.js` that calls `ChatWidget.registerComponent` once `ChatWidget` exists.

---

## 3. Check-in / check-out calendar

### 3.1 Reuse and new work

- **Reuse (verified):** renderer contract and lifecycle (lock after submit, restore from `selection.value`, submit disabled until valid) from the grouped list picker; the card chrome of the confirmation card; `injectStyles`; `detectBaseDirection` from `src/utils/rtl.ts` for the locale switch the calculator uses; icons through `widget.resolveIcon`.
- **New:** the month grid and all date logic. No renderer in `src/rich-components/` or `src/aam/` has a date input. The RSG website's own calendar (`visitredsea-chat-live/js/chat.js`) is the behavioural reference for Arabic RTL and two-tap range selection.

### 3.2 Incoming payload (proposed, type `rsg_date_range`)

```json
{
  "type": "rsg_date_range",
  "payload": {
    "main_title": "متى تحبون يكون الوصول والمغادرة؟",
    "locale": "ar",
    "min_date": "2026-11-12",
    "max_date": "2027-11-11",
    "initial": { "check_in": "2026-10-23", "check_out": "2026-10-25" },
    "min_nights": 1,
    "max_nights": 30,
    "disabled_dates": [],
    "submit_label": "اعتماد التواريخ",
    "lock_after_selection": true
  }
}
```

- Dates are `YYYY-MM-DD` strings everywhere; the renderer compares strings and builds the grid from integers, never from `new Date("2026-10-23")` (UTC midnight, shifts a day in Riyadh).
- `initial` pre-selects a range and enables the submit at once; `min_date` is supplied by the application (not derived from the browser clock); `disabled_dates` stays empty in the demo.
- Arabic month and weekday names, Gregorian months, Western digits (project rule).

### 3.3 Submission (proposed) and how the flow continues

The transport sends text only (1.4), so the renderer must submit a line the application parses. **Recommended:** the approved customer line already in `data/script.js` → `customer.dates`: `الوصول 23 أكتوبر 2026 والمغادرة 25 أكتوبر 2026، ليلتان.` The bridge maps it in `event_for()` to `state.set_dates(st, "2026-10-23", "2026-10-25")` deterministically (no agent turn), the way the airports line is handled. On restore the renderer re-parses the line it wrote with its own month table. Alternative: a machine line (`rsg:dates 2026-10-23 2026-10-25`) is easier to parse but shows as the guest's own message and in the saved history, which the wording rules do not allow.

Example as it leaves the widget (verified shape, proposed content):

```json
{ "data": { "type": "text", "text": "الوصول 23 أكتوبر 2026 والمغادرة 25 أكتوبر 2026، ليلتان." }, "timestamp": "2026-11-11T13:05:12.000Z" }
```

`set_dates` then moves the priced dates to `approve1` (stay summary card) and answers other dates with the approved "price needs confirming" line (`agent/state.py`).

### 3.4 Validation and RSG rules

| Rule | Where | Evidence |
|---|---|---|
| Check-out after check-in, at least one night | Renderer (submit disabled, inline hint) and backend (`set_dates`: `n < 1` → `checkout_not_after_checkin`) | `agent/state.py` |
| Today and past dates disabled | Renderer via application-supplied `min_date` = tomorrow | visitredsea.com picker "disables today and past dates" and shows "For bookings under 24 hours, please chat with us directly." [R099], due diligence report line 444 |
| Minimum stay | **Not enforced.** No minimum stay is published for Shebara; the register says minimum stays are "not published" (`coverage_matrix.csv` line 20). The only minimum found is an AMAALA opening offer, another resort. | evidence only |
| Availability | **Not enforced.** No inventory feed; one priced route. The backend's "needs confirming" reply covers other dates. | project rule |

### 3.5 Mobile and RTL (proposed)

- Root `dir="rtl"` for `locale: "ar"`; logical start/end for the range highlight; weekday order needs a product decision (the English site starts on Sunday).
- One month per screen under 480 px (the widget is full-screen there), two months on desktop; swipe or arrows; 44 px targets; tap 1 = check-in, tap 2 = check-out, an earlier tap restarts; nights count under the grid; inline errors; submit disabled until valid; lock after submit with the range still highlighted; keyboard arrows, Enter, Escape.

### 3.6 Acceptance checks

1. `initial` renders the highlighted range with submit enabled; without it submit is disabled.
2. Dates before `min_date` are not selectable; a check-out before the check-in restarts the range.
3. Submit sends exactly one visitor text message equal to the approved line; the bridge replies with the stay summary for 23 to 25 Oct 2026 and with the "needs confirming" line otherwise.
4. Reload: the calendar is locked and shows the submitted range; no second message is sent.
5. 375 px, RTL: one month, no horizontal scroll, Western digits, correct mirroring.
6. Transport failure: the visitor bubble shows the failed state; retry resends the same line once; the calendar stays locked.
7. Unit tests per the guide's two groups in `tests/unit/rsg/date-range.test.ts`; `npm run build:rsg` succeeds; `rsg.min.js` appears next to `core.min.js` after a `next` release.

---

## 4. Guest details form

### 4.1 Existing patterns

- Labels, grouping, submit button, lock: grouped list picker. Native inputs with live state and a locked submit: the financing calculator (`<input type="radio">`, `<input type="range">`, `fc-offer-btn`, `fc-calculator--submitted`), which also shows the locale switch (`detectBaseDirection`) and `root.dir = 'rtl'`.
- Required markers, prefilled values and field-level errors: **nothing in the SDK today**; the new renderer builds them. The V2 guest form on the RSG site (`visitredsea-chat-mockup-v2/js/chat.js`, `C.guestForm`) is the visual and behavioural reference.

### 4.2 Fields required by the active RSG flow (verified)

From the live visitredsea.com "Guest information" step captured on 13 Oct 2026 [R223], due diligence report line 830:

| Field | Required | Notes |
|---|---|---|
| Title | yes | Site choices Mr., Mrs., Ms., Master. The live app stores «السيد» / «السيدة» (`agent/state.py`, `REQUIRED`). |
| First Name | yes | |
| Family Name | yes | |
| E-Mail | yes | Site sends a verification code (website path only). |
| Mobile Number | yes | Country selector, default +966. |
| Adult Guest 2: First Name, Family Name | optional | |
| Other Requirements | optional | |
| Marketing subscription | optional | Unticked by default. |

The backend requires `title, firstName, familyName, email, mobile` and accepts `mobileCode, guest2First, guest2Family, requests, marketing` as optional, so the form maps one to one.

### 4.3 Prefill and the title rule

- **First name:** known after `set_guest_name` (`state.name`); the bridge sends it as the field's `value`.
- **Title, resolved by the application and never by the SDK:** `agent/state.py:infer_title()` gives «السيد» for a clearly masculine first name, «السيدة» for a clearly feminine one, nothing for an ambiguous one (Round 8, 11 Nov 2026). The bridge sends either a prefilled, editable title select or an empty required select whose label is the one question «وش اللقب اللي تفضّله في بيانات الحجز، السيد أو السيدة؟». Whatever the guest chooses or later corrects is submitted as the title and wins, as the chat path does today. The renderer carries no name lists.

### 4.4 Incoming payload (proposed, type `rsg_guest_form`)

```json
{
  "type": "rsg_guest_form",
  "payload": {
    "main_title": "بيانات الحجز",
    "locale": "ar",
    "fields": [
      { "name": "title", "label": "اللقب", "type": "select", "required": true, "options": ["السيد", "السيدة"], "value": "السيد" },
      { "name": "first_name", "label": "الاسم الأول", "type": "text", "required": true, "value": "محمد" },
      { "name": "family_name", "label": "اسم العائلة", "type": "text", "required": true },
      { "name": "email", "label": "البريد الإلكتروني", "type": "email", "required": true },
      { "name": "mobile_code", "label": "رمز الدولة", "type": "select", "required": false, "options": ["+966", "+971", "+20"], "value": "+966" },
      { "name": "mobile", "label": "رقم الجوال", "type": "tel", "required": true },
      { "name": "companion_first_name", "label": "الاسم الأول للمرافق", "type": "text", "required": false },
      { "name": "companion_family_name", "label": "اسم عائلة المرافق", "type": "text", "required": false },
      { "name": "requests", "label": "طلبات خاصة", "type": "textarea", "required": false }
    ],
    "errors": {},
    "submit_label": "اعتماد البيانات",
    "lock_after_selection": true
  }
}
```

Ambiguous first name: the title field arrives as `{ "name": "title", "label": "وش اللقب اللي تفضّله في بيانات الحجز، السيد أو السيدة؟", "type": "select", "required": true, "options": ["السيد", "السيدة"], "value": "" }`.

### 4.5 Submission and how it reaches the booking flow

- **Verified:** the transport sends `{ data: { type: "text", text } }` only, `text` limited to 1000 characters (`docs/api-v2.md`). Form data has to be serialised into one visitor line and parsed by the application; the SDK has no structured form action.
- **Proposed line**, parsed by `event_for()` and passed to `state.set_guest_details()` without an agent turn (well under 1000 characters):

```
بياناتي: اللقب السيد؛ الاسم الأول محمد؛ اسم العائلة باز؛ البريد mohammed.baz.demo@example.com؛ الجوال +966 551234567؛ المرافق نورة الحربي؛ طلبات: لا
```

```json
{ "data": { "type": "text", "text": "بياناتي: اللقب السيد؛ الاسم الأول محمد؛ اسم العائلة باز؛ البريد mohammed.baz.demo@example.com؛ الجوال +966 551234567؛ المرافق نورة الحربي؛ طلبات: لا" }, "timestamp": "2026-11-11T13:07:40.000Z" }
```

- The visitor bubble shows the e-mail and mobile, as today's typed path does (product decision, 5.5).
- **Pending state:** the visitor bubble appears at once; `ack` marks it delivered (`messageDelivered`); the typing indicator runs until the reply; the form locks on submit.
- **Success:** the next reply (special-request question or review card).
- **Validation errors:** client side in the renderer (required, e-mail syntax, mobile digits, inline, submit disabled until valid). Server side (`set_guest_details` rejects a field): the bridge re-sends the form with `errors: { "email": "…" }` and the saved values, because a locked component receives nothing from the server (1.5); the lead-in text keeps the approved `guestInvalid` sentence.

### 4.6 Acceptance checks

1. Every field renders with label, required marker on the five required fields, prefilled first name, prefilled or asked-for title.
2. «محمد» and «نورة» arrive with the title prefilled; an ambiguous name arrives with the question as the label and no default; a changed title is what gets submitted.
3. Submit disabled until valid; invalid e-mail and mobile show inline messages; nothing is sent.
4. One submission sends one visitor line in the agreed format; the bridge saves the details and replies with the special-request question; the review card shows title and names.
5. Reload: the form is locked with the submitted values restored from `selection.value`; no second message.
6. A server rejection re-renders a new form with the field error and saved values; the old one stays locked.
7. 375 px, RTL: right-aligned labels, full-width inputs, numeric keyboard for mobile, no horizontal scroll.
8. Unit tests per the guide; the submitted line never exceeds 1000 characters even with a long request.

---

## 5. Open decisions and missing evidence

| # | Needed | Affects |
|---|---|---|
| 1 | **Resolved from source (section 2):** `type` = the component slug exactly as typed at creation, provided the template reference carries no label suffix. Still unverified: whether Rendering Intelligence validates the populated payload against the component schema before sending (the backend normalises the schema on create, `validateAndNormalizeSchema`, and uses it for structured output in `pkg/message_templates/template_population.go`, which suggests the payload is produced under the schema rather than checked after). No captured session with a custom component exists in the SDK fixtures (`tests/fixtures/sse/a-additive-stream-with-ri.jsonl` carries a built-in `carousel`); the Sessions console in Studio shows the type of any past turn under "Inspect → Component". | Type keys; path B needs an underscore slug typed by hand. |
| 2 | **Path choice:** B (repo bundle `rsg.min.js`, CI changes in `r2-upload.mjs` and `build:all`, a `next` release) or C (host-page registration on the RSG site, no release). C is enough for the demo. | Section 2 steps 1 to 3 and 10. |
| 3 | **SDK version pin:** the RSG snippet loads `/sdk/web/next/core.min.js`; `next` moved from 1.14.0 to 1.15.0 since 9 Nov and will move again. Pin `/sdk/web/1.15.0/core.min.js` (immutable, `r2-upload.mjs`) for the demo. | All renderer work. |
| 4 | **Calendar locale decisions:** first weekday in Arabic, one or two months on desktop, `min_date` policy. | 3.2, 3.5. |
| 5 | **Personal data in the visible submission line** and in `chatwidget_v2_chatHistory`. Same exposure as typing today; a shorter visible line would need a structured action type the transport does not have (`data.type` is always `"text"`). | 4.5. |
| 6 | **Structured actions:** true form submissions would be an SDK transport change plus a Studio and agent-contract change, outside a renderer. | Both components. |
| 7 | **Approved Arabic wording** for the two submission lines and the new labels, added to `data/script.js` and approved like every other sentence. | 3.3, 4.5. |
| 8 | Files not read: `examples/kitchen-sink.html` script bodies and the body of `tests/unit/rich-components/grouped-list-picker.test.ts`; both only refine steps 4 and 7 of the checklist. | Section 2. |

Scratch material from this review (not part of the repository): the downloaded bundle at `C:\Users\COMPUM~1\AppData\Local\Temp\claude\d8fb03837fbb2c26\b59c030e-e01d-4f57-8b5a-500a412c2c8c\scratchpad\sdk-review\bundle\core.min.js`.
