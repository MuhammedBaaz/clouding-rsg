# Studio setup and wiring plan: RSG date-range calendar and guest-details form

11 November 2026. Companion to `WEB_SDK_RICH_COMPONENT_PLAN_2026-11-11.md` (the read-only review). Part A is what to enter in Empathy Studio, in order. Part B is how the RSG web chat will load the two renderers and how the bridge will turn each submission into the next booking step. The SDK repository stays untouched: both renderers load from the RSG site itself.

Everything below marked **(proposed design)** is ours: the two components do not exist in Studio or the SDK yet. Everything marked **(verified)** was read in the SDK, backend or admin-panel sources on 11 Nov.

## Decisions carried from the review

| Decision | Choice | Why |
|---|---|---|
| Loading approach | **Host-page registration** on `visitredsea-chat-fresh` through `widget.registerComponent(type, renderer)` (verified public API) | No SDK release, no CDN change, no bundle entry in CI. The renderers are one script on the page that already serves the widget. |
| Slugs | `rsg_date_range` and `rsg_guest_form` (underscore) | The backend sends the component slug as the wire `type`, exactly as typed (verified). Underscore keeps the SDK's auto-loader path open for a future `rsg.min.js` bundle without renaming the Studio components (slugs are immutable). The page registers both spellings (`rsg_…` and `rsg-…`) so a later rename on either side still renders. |
| Submission format | One visitor text message per submission (verified: the SDK transport sends `{data:{type:"text",text}}` only, max 1000 characters) | The bridge recognises each line deterministically, like the airports line today, and runs the existing transition without an agent turn. |
| Reference Label in templates | **Blank** | A label turns the wire type into `slug__label` (verified in `refSlug.ts`), which the page would not recognise. |
| Schemas | Flat, every property required, **plain types only** (`string`, `integer`, `boolean`); an absent value is the empty string `""` | The backend parses the schema with `invopop/jsonschema` v0.13.0, whose `type` is a single string: a JSON Schema type array such as `["string","null"]` fails to parse and Studio answers "schema must be a valid OpenAPI schema object" (verified in `component.go`, `validateAndNormalizeSchema`, and `go.mod`). It then runs `EnforceOpenAIStrictMode`, which rewrites `required` to list every property. |

---

# Part A. Enter this in Studio, in this order

Prerequisites: the RSG Web channel is bound to the Custom Agent "RSG Concierge Bridge", its System templates stay off (as in `STUDIO_CONFIGURATION_GUIDE.md`), and the existing custom templates 1 to 14 stay as they are.

## A1. Component 1: the calendar

Screen: sidebar **Components** → **New component** (Create component).

| Field | Enter exactly |
|---|---|
| Name | `RSG Date Range` |
| Slug | `rsg_date_range` (type it over the auto-derived value; the form derives `rsg-date-range` from the name, and the slug cannot be changed after saving) |
| Channel compatibility | `Web SDK` only |
| Instruction | paste the block below |
| Schema | paste the JSON below |

Instruction (component default, no angle brackets):
```
Read the lines under the "[calendar: dates]" label in the agent reply. Each line is "key = value". Copy each value into the field of the same name exactly as written, without translating, reformatting or inventing anything.
Dates are calendar strings "YYYY-MM-DD" and stay that way. A value of "-" means an empty string "". min_nights and max_nights are whole numbers. lock_after_selection is always true. Never add dates, limits or labels that are not in the lines.
```

Schema **(proposed design)** (plain types only; "" = not given):
```json
{
  "type": "object",
  "properties": {
    "main_title": { "type": "string", "description": "Heading above the calendar, Arabic, max 60 characters. From the main_title line." },
    "min_date": { "type": "string", "description": "First selectable day, YYYY-MM-DD. From the min_date line." },
    "max_date": { "type": "string", "description": "Last selectable day, YYYY-MM-DD. From the max_date line." },
    "initial_check_in": { "type": "string", "description": "Pre-selected check-in, YYYY-MM-DD, or an empty string when the line is -. From the initial_check_in line." },
    "initial_check_out": { "type": "string", "description": "Pre-selected check-out, YYYY-MM-DD, or an empty string when the line is -. From the initial_check_out line." },
    "min_nights": { "type": "integer", "description": "Minimum nights, usually 1. From the min_nights line." },
    "max_nights": { "type": "integer", "description": "Maximum nights. From the max_nights line." },
    "submit_label": { "type": "string", "description": "Submit button text, Arabic. From the submit_label line." },
    "lock_after_selection": { "type": "boolean", "description": "Always true." }
  },
  "required": ["main_title", "min_date", "max_date", "initial_check_in", "initial_check_out", "min_nights", "max_nights", "submit_label", "lock_after_selection"],
  "additionalProperties": false
}
```

Save. Note the slug shown on the component page; it must read `rsg_date_range`.

## A2. Component 2: the guest details form

Screen: **Components** → **New component**.

| Field | Enter exactly |
|---|---|
| Name | `RSG Guest Form` |
| Slug | `rsg_guest_form` (typed over the auto-derived value) |
| Channel compatibility | `Web SDK` only |
| Instruction | paste the block below |
| Schema | paste the JSON below |

Instruction (component default):
```
Read the lines under the "[form: guest_details]" label in the agent reply. Each line is "key = value". Copy each value into the field of the same name exactly as written. A value of "-" means an empty string "". title_ask is true or false exactly as written. Never invent a name, an e-mail, a phone number or a title: a field whose line is "-" stays an empty string. Labels are not in the lines; the widget supplies them. lock_after_selection is always true.
```

Schema **(proposed design)** (plain types only; "" = not given). Labels, required markers and field order live in the renderer, so the payload carries only values, the title rule and one optional error:
```json
{
  "type": "object",
  "properties": {
    "main_title": { "type": "string", "description": "Heading above the form, Arabic. From the main_title line." },
    "title_value": { "type": "string", "description": "Pre-resolved title, السيد or السيدة, or an empty string when not resolved. From the title_value line." },
    "title_ask": { "type": "boolean", "description": "true when the application could not resolve the title from the first name and the form must ask. From the title_ask line." },
    "title_question": { "type": "string", "description": "The one question to show as the title field label when title_ask is true, else an empty string. From the title_question line." },
    "first_name": { "type": "string", "description": "Prefilled first name or an empty string. From the first_name line." },
    "family_name": { "type": "string", "description": "Prefilled family name or an empty string. From the family_name line." },
    "email": { "type": "string", "description": "Prefilled e-mail or an empty string. From the email line." },
    "mobile_code": { "type": "string", "description": "Country code, for example +966. From the mobile_code line." },
    "mobile": { "type": "string", "description": "Prefilled mobile digits or an empty string. From the mobile line." },
    "companion_first_name": { "type": "string", "description": "Prefilled companion first name or an empty string. From the companion_first_name line." },
    "companion_family_name": { "type": "string", "description": "Prefilled companion family name or an empty string. From the companion_family_name line." },
    "requests": { "type": "string", "description": "Prefilled special request or an empty string. From the requests line." },
    "error_field": { "type": "string", "description": "Name of one field the application rejected, or an empty string. From the error_field line." },
    "error_text": { "type": "string", "description": "The rejection sentence to show under that field, or an empty string. From the error_text line." },
    "submit_label": { "type": "string", "description": "Submit button text, Arabic. From the submit_label line." },
    "lock_after_selection": { "type": "boolean", "description": "Always true." }
  },
  "required": ["main_title", "title_value", "title_ask", "title_question", "first_name", "family_name", "email", "mobile_code", "mobile", "companion_first_name", "companion_family_name", "requests", "error_field", "error_text", "submit_label", "lock_after_selection"],
  "additionalProperties": false
}
```

Save and check the slug reads `rsg_guest_form`.

## A3. Template 15: the calendar template

Screen: **Channels** → RSG Web channel → **Rendering Intelligence** → **New template**.

| Field | Enter exactly |
|---|---|
| Name | `RSG dates calendar` |
| Slug | `rsg-dates-calendar` |
| WHEN TO SELECT | paste below |

WHEN TO SELECT:
```
Select this template whenever the agent reply contains the line "[calendar: dates]".
Do NOT select it for the other-dates reply ("لهذه التواريخ ما عندي سعر مؤكد…" or any reply that offers 23 to 25 October without the "[calendar: dates]" line), for the stay summary ("توقيت جميل. هذا ملخص الإقامة:"), or for any reply without that line.
```

Components to add, in this order (use **Add component** on the template; leave **Reference Label** blank for both; set **Required** on for the second):

1. **Text** (`text`). Instruction, paste this:
```
text = every plain sentence that comes before the "[calendar: dates]" line, in order, exactly as written. Remove the "[calendar: dates]" label and every "key = value" line. Never reword, translate or add.
```

2. **RSG Date Range** (`rsg_date_range`), Required = on. Instruction: leave on "Use component default" (the default from A1), or paste the same text.

Save, and make sure the template is **enabled** on the channel.

## A4. Template 16: the guest form template

Screen: same channel → **Rendering Intelligence** → **New template**.

| Field | Enter exactly |
|---|---|
| Name | `RSG guest form` |
| Slug | `rsg-guest-form` |
| WHEN TO SELECT | paste below |

WHEN TO SELECT:
```
Select this template whenever the agent reply contains the line "[form: guest_details]".
Do NOT select it for the guest-path picker ("[picker: guest_path]"), for the review ("[card: review]"), for the special-request question ("هل عندكم أي طلب خاص…"), or for any reply without the "[form: guest_details]" line.
```

Components, in order, Reference Label blank:

1. **Text** (`text`). Instruction:
```
text = every plain sentence that comes before the "[form: guest_details]" line, in order, exactly as written. Remove the label and every "key = value" line. Never reword, translate or add.
```

2. **RSG Guest Form** (`rsg_guest_form`), Required = on. Instruction: "Use component default" (from A2).

Save and enable.

## A5. What Studio will send, and what the widget will submit

### Calendar

The bridge reply the template reads (lead-in approved wording; values from `data/booking.js`):
```
متى تحبون يكون الوصول والمغادرة؟
[calendar: dates]
main_title = متى تحبون يكون الوصول والمغادرة؟
min_date = 2026-10-23
max_date = 2027-10-23
initial_check_in = 2026-10-23
initial_check_out = 2026-10-25
min_nights = 1
max_nights = 30
submit_label = اعتماد التواريخ
```

Sample payload Studio sends to the widget (the shape the backend writes, verified; the `type` is the slug):
```json
{
  "type": "rich_components",
  "text": "",
  "components": [
    {
      "type": "rsg_date_range",
      "payload": {
        "main_title": "متى تحبون يكون الوصول والمغادرة؟",
        "min_date": "2026-10-23",
        "max_date": "2027-10-23",
        "initial_check_in": "2026-10-23",
        "initial_check_out": "2026-10-25",
        "min_nights": 1,
        "max_nights": 30,
        "submit_label": "اعتماد التواريخ",
        "lock_after_selection": true
      }
    }
  ]
}
```

What the widget submits (verified request shape; the text is the approved customer line `customer.dates` from `data/script.js`):
```json
{ "data": { "type": "text", "text": "الوصول 23 أكتوبر 2026 والمغادرة 25 أكتوبر 2026، ليلتان." }, "timestamp": "2026-11-11T15:00:00.000Z" }
```

About `min_date`: the live RSG site disables today and past dates, but the demo's only priced stay is 23 to 25 October 2026, which is already in the past on 11 November. The bridge therefore sends `min_date` = the priced check-in so the demo route stays selectable, and `max_date` one year later. In production `min_date` becomes tomorrow; nothing in the renderer changes.

### Guest form

The bridge reply for a guest whose first name is «محمد» (title resolved by `infer_title`):
```
تمام يا محمد. عشان أكمل الحجز، عبّي بياناتك في النموذج، وإذا زوجتك معك أضف اسمها.
[form: guest_details]
main_title = بيانات الحجز
title_value = السيد
title_ask = false
title_question = -
first_name = محمد
family_name = -
email = -
mobile_code = +966
mobile = -
companion_first_name = -
companion_family_name = -
requests = -
error_field = -
error_text = -
submit_label = اعتماد البيانات
```

For an unclear first name («نور») the three title lines become `title_value = -`, `title_ask = true`, `title_question = وش اللقب اللي تفضّله في بيانات الحجز، السيد أو السيدة؟`.

Sample payload Studio sends:
```json
{
  "type": "rich_components",
  "text": "",
  "components": [
    {
      "type": "rsg_guest_form",
      "payload": {
        "main_title": "بيانات الحجز",
        "title_value": "السيد",
        "title_ask": false,
        "title_question": "",
        "first_name": "محمد",
        "family_name": "",
        "email": "",
        "mobile_code": "+966",
        "mobile": "",
        "companion_first_name": "",
        "companion_family_name": "",
        "requests": "",
        "error_field": "",
        "error_text": "",
        "submit_label": "اعتماد البيانات",
        "lock_after_selection": true
      }
    }
  ]
}
```

What the widget submits (fictional data; one line, Arabic semicolons between fields, 170 to 260 characters in practice, hard-capped by the renderer at 900):
```json
{ "data": { "type": "text", "text": "بياناتي: اللقب السيد؛ الاسم الأول محمد؛ اسم العائلة باز؛ البريد mohammed.baz.demo@example.com؛ الجوال +966 551234567؛ المرافق نورة الحربي؛ طلبات: لا" }, "timestamp": "2026-11-11T15:02:00.000Z" }
```

Without a companion the segment reads `المرافق: -`; a special request replaces `لا` with the text, cut to 150 characters by the renderer.

---

# Part B. Wiring plan (RSG site and bridge; the SDK stays read-only)

## B1. Loading the renderers on the current website

Files in `visitredsea-chat-fresh/`:

- **`js/rsg-components.js` (new).** One IIFE with two renderers following the SDK's verified contract `(payload, onSelect, selection) => HTMLElement`:
  - `renderRsgDateRange(payload, onSelect, selection)`: month grid built from `YYYY-MM-DD` strings (no `Date` parsing of ISO strings, no timezone), Arabic month and weekday names, Western digits, `dir="rtl"`, two taps for the range, `min_date`/`max_date`/`min_nights`/`max_nights` enforced with inline hints, submit disabled until valid, `initial_*` pre-selected, lock after submit, restore from `selection.value` by parsing the Arabic line it wrote. One month per view under 480 px, two on desktop.
  - `renderRsgGuestForm(payload, onSelect, selection)`: fixed field list in the backend's order (title select, first name, family name, e-mail, country code + mobile, companion first and family name, requests), labels from the approved `fieldNames` wording, required markers, prefill from the payload, the title select prefilled or labelled with `title_question` when `title_ask` is true, inline client validation (e-mail syntax, mobile digits, required), `error_field`/`error_text` shown under the field on arrival, submit disabled until valid, lock after submit, restore from `selection.value`.
  - Styles injected once into the widget's shadow root on first render (same mechanism as the SDK guide: `root.getRootNode()` and a `<style data-rsg-components>` element), using the widget's theme variables (`--primary-color`, `--text-color`, `--border-color`, `--font-family`).
  - Registration: the script waits for `window.__rsgStudioInstance` (the instance `studio-widget.js` creates; `js/site.js` already polls it the same way) and calls `instance.registerComponent(type, renderer)` for `rsg_date_range`, `rsg-date-range`, `rsg_guest_form`, `rsg-guest-form`. Registration right after init means a component in restored history renders through the registry (verified: `onRegister` re-renders the message list), and the auto-loader never requests `rsg.min.js` from the CDN.
  - Submission: `onSelect(line, 0)` with the approved line; the SDK adds the visitor bubble, posts the text and locks the component. Before calling, the renderer checks `line.length <= 900` and trims the requests text to 150 characters, so the 1000-character limit of `POST /api/v1/chat` is never hit.
- **`index.html`:** one `<script src="js/rsg-components.js">` before `studio-widget.js`.
- **`tools/components-preview.html` (new fixture):** mounts both renderers inside a shadow root with the two sample payloads, buttons for a `selection` re-render, an error payload and the ambiguous-name case, and prints the submitted line and its length. No widget, no backend, no agent cost.

## B2. Connecting each submission to the booking step (live backend)

Files in `visitredsea-chat-live/`:

- **`data/script.js`:** `live.calendarLead` («متى تحبون يكون الوصول والمغادرة؟» already exists as the step's question; reused), `live.formLead` (the sentence in A5), `live.formTitle`, `live.calendarSubmit`, `live.formSubmit`, and `customer.guestLine` (the format of the submission line). `customer.dates` already exists. Then `node tools/dump_data.mjs`.
- **`agent/studio_bridge.py`:**
  - `reply_text()`: the `calendar` component no longer falls back to the typed-dates sentence `datesWidget`; it emits the `[calendar: dates]` block (`card_block("calendar", …)`) with values from `B["stay"]` and the booking data. The `guestForm` entry leaves `CHAT_ASK` and emits `[form: guest_details]` with prefill from `st["name"]`, `st.get("guestDraft")`/`st["guest"]`, and the title from `T.infer_title()`; `signIn` keeps its sentence and is followed by the same form block. `editAsk` («تعديل البيانات») re-sends the form prefilled with the saved details.
  - `event_for()`: two new deterministic lines. The dates line (`الوصول D M YYYY والمغادرة D M YYYY، …`) is parsed with `AR_MONTHS` into ISO dates and returned as the existing `{"type": "dates", "a", "b"}` event, so `state.set_dates` runs unchanged (priced dates → stay summary; other dates → the approved "needs confirming" reply, in which case the bridge re-sends the calendar block). The details line (`بياناتي: …`) is split on «؛» into the backend's field names and returned as a new `{"type": "guestForm", "fields": {...}, "requests": "..."}` event.
  - A new event handler for `guestForm` (in `agent/tools.py handle_event`, which `chat.py event_turn` already routes): `T.set_guest_details(st, fields)`; on `ok` with stage `requests`, `T.record_request(st, requests, none)` so one submission lands on the review; on `ok: false` the bridge re-sends the form block with `error_field`/`error_text` from the rejection and the saved values, under the approved `guestInvalid` sentence.
- **`agent/system_prompt.md` and `agent/tools.json`:** one sentence each, saying that in the widget the application shows a calendar and a form and handles their submissions itself; the agent still calls `set_dates` or `set_guest_details` only for details the guest types in prose. Pushed with `tools/console_update.py` (system and tools only, as before).
- **`README.md`** Round 9 paragraph, and the templates record in `STUDIO_TEMPLATES_LIVE.md` gains Templates 15 and 16.

Unchanged: `agent/state.py` transitions (`set_dates`, `set_guest_details`, `record_request`, `infer_title`), the loyalty and completion path, the PDF, the WhatsApp overlay.

## B3. Verification before any paid turn

1. Fixture page: both renderers with the sample payloads, RTL at 375 px and desktop, the ambiguous-name title question, an `error_field` payload, re-render with `selection` locks and shows the submitted values, every submitted line under 900 characters.
2. Bridge checks (extend `tools/check_loyalty_title.py` style, temporary store, no agent): the dates line → `set_dates` → stay summary for the priced dates and the "needs confirming" reply plus a fresh calendar block for others; the details line → `set_guest_details` + `record_request` → review card with the title; an invalid e-mail → form block with `error_field = email`; «نور» → `title_ask = true` in the block, then a line with «السيدة» → saved.
3. One live widget run (about $0.12): the calendar renders at the dates step, submit continues to the stay summary; the form renders at the guest step with «محمد» prefilled and «السيد» resolved, submit lands on the review; reload shows both locked; nothing else in the route changed.

## B4. Showing the completed form instead of the submission line (decided 11 Nov, evening)

Owner decision: on submit, the chat shows the completed form as a locked rich component and the serialised line never appears in the visible conversation. The values still reach the bridge.

### What the current SDK allows (verified in core.min.js 1.15.0 and `src/core/widget.ts`)

- The renderer's `onSelect(value)` always does three things in this order: adds a visitor bubble with `value`, posts `value` through the transport, fires `callbacks.onSend`. There is no flag to skip the bubble, and the bubble is also what the SDK marks "failed" with a retry control.
- The public instance API exposes `widget.transport.send(text)` separately. It posts the text with the same request shape (`{data:{type:"text",text}}`, 1000-character limit) and **does not add a bubble**. `js/site.js` already depends on this split: it calls `messages.add` and `transport.send` as two steps.
- Only `onSelect` writes `component.selection`, which is what the SDK persists so a submitted component comes back locked after a reload (`rich-renderer.ts`). A renderer that bypasses `onSelect` must persist its own submitted state.
- The transport contract has no structured form action: `data.type` is always `"text"` (backend `docs/chat_endpoint.md`). The values can only travel as text.

### How it will work (proposed, no SDK change)

1. On submit the form renderer validates, builds the line, and calls `widget.transport.send(line)` instead of `onSelect`. The widget shows the typing indicator and the bridge's reply as usual; no visitor bubble is added.
2. The renderer immediately re-draws itself as the **submitted form**: every field read-only with the entered values, the submit button replaced by a "تم الإرسال" state, same card chrome. This is the visible record in the conversation.
3. Persistence of the submitted state is the page's job: the renderer stores `{sessionId, payloadHash, values, sentAt}` under a site key in `localStorage` (session id from `widget.session.sessionId`, verified public API). On a re-render or a page reload the renderer finds the record for its payload and draws the submitted state again. "New chat" changes the session id, so old records no longer match.
4. Delivery and failure: because there is no bubble, the SDK's own failed/retry control never applies to this message. The renderer treats the bridge's reply (the next agent message, watched through `widget.messages.get()`, the way `site.js` already polls) as success. If nothing arrives within the transport timeout (60 s), it unlocks the form and shows one inline line, «ما وصلت البيانات، حاول مرة أخرى», and the guest submits again; the bridge's duplicate guard and the deterministic `set_guest_details` make a repeat harmless.
5. The calendar keeps the standard path (`onSelect` with the approved dates line as the visible bubble), unless the same silent treatment is wanted there too; both renderers share the same submit helper so switching is one flag.

### What Studio's session history will show

- The agent turn: the form component with the **prefill** values the bridge sent, rendered read-only, with Inspect → Component `rsg_guest_form` and the raw payload.
- The visitor turn: the **serialised line** as plain text («بياناتي: اللقب السيد؛ …»). The backend stores whatever `transport.send` posted; there is no visitor-side rich message in the data model, so the "completed form" view exists only in the guest's widget. The e-mail and mobile are therefore visible in Studio's history, as they are today when typed.
- The next agent turn: the review card.

### What would have to change in the SDK for a native version

Not needed for the demo; listed so the trade-offs above can be removed later:

- `src/rich-components/types.ts`: extend `SelectCallback` with an options argument, for example `onSelect(value, index, cardIndex, { display?: string | null })`, where `display: null` means "post without a bubble" and a string means "show this text instead of `value`".
- `src/rich-components/rich-renderer.ts`: pass the options through the wrapper while still writing `component.selection` (so persistence stays in the SDK).
- `src/core/widget.ts`, `registerRichComponents()`: honour `display` when adding the visitor bubble, and keep `transportManager.send(value)` as is.
- Tests in `tests/unit/rich-components/rich-renderer.test.ts` and `tests/integration/rich-components-widget.test.ts`, a note in `INTEGRATION.md` under `widget.registerComponent`, and a `next` release. Studio and the backend are unaffected: the wire stays text.

## Open points for you

- First weekday: **Saturday** (decided 11 Nov). Desktop view: two months unless you say otherwise.
- The e-mail and mobile stay out of the widget's visible conversation (B4) but remain in Studio's session history as the visitor's text message.
- After saving the two components, send me the slugs as Studio shows them, or a screenshot of each component page, before I wire the type names.
