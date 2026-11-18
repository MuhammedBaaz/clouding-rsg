# RSG website × Empathy Studio × Claude Managed Agent: configuration guide (RI on)

Read-only review, 8 November 2026, revision 3. Decision taken by the owner: **Rendering Intelligence ON for the RSG web channel; the application sends approved data under an `rsg:` marker; Studio selects the template and populates the card.** Nothing in the website, the Studio workspace or the Claude agent was changed to produce this guide; no template is enabled.

## 0. Evidence reviewed

| Reference | What it is | How it was reviewed |
|---|---|---|
| **"Empathy Studio - Agentforce.mp4"** (Drive folder `1a72TILGy2kVlpwDnCilPvqhovpOxavGd`, 5:34) | Product walkthrough: account, agent, WhatsApp channel, voice, RI canvas, Web SDK channel, widget customizer, web RI templates, custom component, custom template | Frames every 6 s; no narration transcript (no speech-to-text service in this environment), so timestamps are ±6 s and the findings are what is **shown on screen** |
| **"Sabiq Agent.mp4"** (same folder, 7:54) | Working demo: Agentforce agent "Sapiq / Sahm Motors Agent" in the Studio **web widget** on a car-dealer website, Arabic, with Salesforce lead updates | Frames every 6 s plus the burned-in English captions |
| Your screenshots: Masdar City RI canvas (template "Masdar — compare all packages") and the Components page | This workspace's UI and component library | Read directly |
| Component instructions and schemas you pasted (Image, Text, Sectioned Multi-Select, Carousel, Confirmation Card, Selection List Picker) | The registered web components | Compared with `visitredsea-chat-live/studio/schemas.js`: identical schemas (descriptions added) |
| `D:\Clouding\New Masdar POC\docs\empathy-studio.md` | Control-plane handoff (codebase-verified by Hazem) | Read |
| `visitredsea-chat-live/` (chat.js builders 300-735, `agent/tools.json`, `agent/state.py`, `agent/chat.py`, `server.py`), `empathy-studio-preview/MAPPING.md` | The approved V2 cards, the live backend and the October mapping | Read |

Other items in the Drive folder that were **not** reviewed: "Empathy Studio.mp4" (a second, differently named walkthrough), the Masdar Agentforce PDF, the other demo videos.

### 0.1 What the Agentforce walkthrough shows (file "Empathy Studio - Agentforce.mp4")

| Time | Seen on screen | What it establishes |
|---|---|---|
| 0:12–0:24 | Account "Sahm", Agents list, Connect Agent dialog | Agent is created under an account, then channels are bound to it |
| 0:30 | **Type** dropdown: Agentforce (by Salesforce) · **Claude Agent (by Anthropic)** "Connect an agent you built on Anthropic's Claude platform" · **Custom Agent (self-hosted)** "Point Clouding at your own HTTP agent endpoint" · greyed: Azure AI, OpenAI, Gemini, GCP Vertex, AWS Bedrock, LangChain Cloud | Studio can bind a channel either to a Claude agent directly or to **our own HTTP endpoint** |
| 0:48 | Create Channel: Account, Agent, Name, **Type: WhatsApp / Mobile App / Web SDK**, Voice Enabled | Web SDK is a first-class channel type |
| 1:30–1:48 | WhatsApp channel config (phone, API key, base URL), voice toggle; "Rendering Intelligence — Turn on RI to compose templates and let the agent pick the right one each turn. Set up Rendering Intelligence" | RI is a per-channel switch |
| 1:54–2:12 | RI canvas: Entry "Inbound WhatsApp message" → **System** (6 templates, toggles) → **Custom** (0 templates); Library: CTA Button, Reply Buttons, WhatsApp Carousel, Image, WhatsApp List Picker, Geolocation, Text, "New custom component" | Canvas structure; system templates are toggled, custom ones are created |
| 2:12–2:18 | System template "Geolocation Preview": Enabled, **WHEN TO SELECT** = `**geolocation**: Geolocation information - Physical location details with coordinates`, "Reset to system default", Components: Text (`text-intro`), Geolocation (REQ), Text (`text-follow-up`) | A template = WHEN TO SELECT + ordered components, each with a slug reference, some marked required |
| 2:24 | WhatsApp: "Where can I find the showroom?" → text address + a rendered location card | RI output on WhatsApp |
| 2:36–2:42 | Create Channel "Sahm - Web Channel", Type **Web SDK**; channels list: Web channel (voice Jeddawy, Rendering Intelligence) and WhatsApp channel ("1 active template") | A web channel with RI and voice exists in the product |
| 2:48–3:30 | Web channel page: tabs Channels / Customize / Rendering Intelligence / Edit; Agent, Type Web SDK, **API Key `acp_…`**; Widget customizer (branding, agent name, welcome card, introduction with quick actions, input, typing, position, dimensions, features) | The web widget is Studio's own, configured per channel |
| 3:36 | **Widget snippet**: `<script src="https://smb-api-dev.clouding.ai/cdn/chat-widget-v2.js"></script>` then `ChatWidget.init({ transport: { sseEndpoint: "https://acp-test.clouding.ai/api/v1/chat", apiKey: "acp_…" }, agent: { name, subtitle, avatarUrl, betaBadge }, theme: { primaryColor, backgroundColor, textColor, borderRadius, fontFamily }, position: { placement: "bottom-right", … } })` | The web transport is **SSE on `/api/v1/chat` with the channel API key**; the widget is embeddable in any page |
| 3:54 | Web channel RI canvas: Entry "Inbound Web message" → System templates **Carousel, List Picker, Confirmation Card, Selection List Picker, Image Preview, List Picker**; Library: Confirmation Card, Carousel, Image, Grouped List Picker, Selection List Picker, Text | The web canvas offers exactly the six components in your library |
| 4:00–4:18 | Widget chat: "show me SUV cars" → a **carousel** (Raize "From 57,700 QAR", Veloz…) with buttons "Book Test Drive", "Compare", "View Details"; clicking **View Details** posts the visitor bubble **"View Details of Toyota Urban Cruiser"**, then "Thinking…", then the agent's detail reply | **A card button sends its payload as the visitor's message in the same conversation, and the agent answers it** |
| 4:24–4:42 | System toggles Carousel / Image Preview / List Picker on; **Create component** dialog: Name, Slug (auto-derived), **Channel compatibility** (Web SDK…), **Instruction** ("Default LLM instruction for this component. Templates can override per-reference."), Schema; channel RI toggle On | Component = slug + channel compatibility + default instruction + schema |
| 4:48–5:06 | **New template** dialog: Create (name "Sahm car financing calculator"), Slug "sahm-car-financing-calculator" ("Stable identifier used internally. Cannot be changed after create."), **WHEN TO SELECT** "Select this template whenever the agent replies with car financing informations"; template components with **Required** toggle and per-reference **INSTRUCTION** ("summarize the agent reply", "Use component default"); "Calculate payment for toyota corolla" → the financing calculator renders in the widget | Template creation flow; per-component instruction overrides; a custom component renders on web |

### 0.2 What the Sabiq demo shows (file "Sabiq Agent.mp4", Agentforce agent, **Web** channel, Arabic)

| Time | Seen on screen | What it establishes |
|---|---|---|
| 0:00–0:18 | Studio widget "Sapiq – Sahm Motors Agent" on the dealer website, launcher "Ask Sahm AI", welcome with quick actions; after «السلام عليكم» a **Selection List Picker** "اختر الخدمة المطلوبة" (3 rows with icons) | Web widget + selection list picker in Arabic RTL |
| 0:24–0:42 | Voice note recorded in the widget → agent replies with text **and** a voice note (caption "He sent a voice note… replied via both text and voice") | Studio's voice layer (STT in, TTS out) works on the web channel |
| 2:00–2:18 | **Carousel** of cars (Toyota Camry "من SAR 89,500", Lexus RX, Land Cruiser) with three buttons each (حجز تجربة القيادة · عرض الفئات · **عرض التفاصيل**); clicking عرض التفاصيل posts the visitor bubble **«عرض تفاصيل Toyota Land Cruiser»** then "Grabbing it…" | Button payload → visitor message → agent, in Arabic |
| 2:24–2:36 | A **single-card** spec view (badge «دفع رباعي 7 مق», price, long markdown body) with three buttons; «عرض فئات تويوتا لاندكروزر 2025» → a **trims carousel** (VX, GR Sport, GX) with one «اختر GR Sport»-style button per card, then a recommendation text | Single-card carousel; selection carousel with one primary button per card, as the RSG resort choice needs |
| 3:36–3:54 | Financing **calculator** (custom component) with sliders and «إرسال الطلب» | Custom components render on web |
| 4:00–4:12 | «طيب فيني احجز تجربة قيادة» → **Selection List Picker** "اختر المعرض الأنسب لك" (3 showrooms, map-pin icons); the chosen row posts **«المواعيد المتاحة في معرض سهم موتورز - العليا (الرياض)»** (a payload different from the row title) | Row payload ≠ title is supported |
| 4:24 | **Sectioned Multi-Select** (grouped list picker): day groups «يوم الثلاثاء الموافق 28 يوليو» … with time chips; the picked chip stays highlighted; posts **«يوم الأربعاء الموافق 5 أغسطس: الساعه 12 ظهراً»** | Grouped picker in single-select mode; the message carries "group: option" |
| 4:42 | **Confirmation Card** «تم تأكيد حجز تجربة القيادة», badge «تم الحجز», subtitle, rows السيارة / المعرض / التاريخ والوقت, an instructions line with a phone number, buttons «عرض الموقع على الخريطة» (primary) and «أضف إلى التقويم» (secondary) | Confirmation card with two buttons on web. **What those two buttons do when clicked is not shown** |
| 5:36–7:06 | Returning customer: phone number → «أهلاً بعودتك أستاذ Omar» + service-type **Selection List Picker** with a badge «مستحقة» on one row; showroom picker; time-slot grouped picker («الإثنين/الثلاثاء/الأربعاء» × 9:00 AM–3:00 PM); confirmation card «موعد صيانة تويوتا برادو» with «الاتجاه إلى الفرع» / «إضافة إلى التقويم» | Row badges render; the same component set carries a whole journey |

What neither recording shows: the JSON of the SSE events, how the widget encodes a click (the visitor bubble is visible, the wire format is not), the `custom-http-agent` request/response, whether `""` is accepted for unused required keys, whether a Confirmation Card button can open a URL on web, and the marker-structured text the Agentforce agents emit (the templates in the Masdar canvas prove the convention; the agent's raw reply is never on screen).

## 1. Field semantics (verified)

| Studio field | Where | Stage | What to write |
|---|---|---|---|
| **WHEN TO SELECT** | Template (one per template) | Select | A description of the **text pattern in the agent's reply** plus the moment in the conversation and "Do NOT select when…" conditions. Masdar: "Select when the reply contains a 'cards:' marker followed by numbered package rows beginning with # and containing ' :: ' separators…" |
| **Instruction** | Component (default, on the Components page) and **per reference inside a template** ("Use component default" or an override) | Populate | An extraction prompt: which marker/row feeds which schema key, constants as `field = "value"`, `""` for keys the reply never carries, length limits, "never invent" rules. Masdar: "Build one card per '#' row. Each row is #N <name> :: <features> :: <price> :: <image key> … never invent a URL" |
| **Required** | Component reference inside a template | Validate | Whether the template fails (and falls back to raw text) when that component cannot be populated |
| **Enabled** | Template | Select | Whether the template is in the channel's library |

Your "When to use" is **WHEN TO SELECT**; your "Prompt" is the per-reference **Instruction** of each component in the template. The RI pipeline behind them (Select → Populate → Validate & render, fallback to raw text on any failure; slugs unique within a template, `text`, `text__2`) is from the Masdar handoff document and the canvas at 4:48–4:54.

## 2. The `rsg:` marker protocol and its consequences

RI renders from the agent's **text**. Today the live backend returns JSON items to its own front-end; nothing emits markers yet. With RI on, the reply text that reaches Studio must carry a block the templates key on:

```
<approved Arabic lead-in sentence(s), exactly as data/script.js has them>
rsg:<template-key>
#1 <field> :: <field> :: …
#2 …
```

Rules: one `rsg:` block per reply at most; the lead-in lines come first; ` :: ` separates fields; a field without a value is `-`; English names, amounts (`SAR 28,980.00`) and dates stay exactly as the application prints them; `key = value` lines for confirmation cards; `group <title> :: a | b | c` lines for the airports picker. Template keys: `resort_suggestions`, `resort_details`, `resort_compare`, `resort_choice`, `villas`, `stay_summary`, `arrival_modes`, `airports`, `transfer_legs`, `totals`, `experiences`, `guest_path`, `review`, `checkout`, `trip_summary`.

**How the marker stays hidden from the guest.** Every RSG template has a `text` component whose instruction says "text = the lead-in verbatim with the `rsg:` line and the `#` rows removed". When the template is selected and populated, the guest sees the lead-in and the card, never the block (this is how the Masdar template hides its `cards:` lines: "with the 'cards:' line and every '#' row removed"). **Verified by construction, not yet by a web test.** The one leak path: when Select picks no template or Populate/Validate fails, Studio falls back to the **raw reply text** (Masdar doc §6), and the guest would see the marker block. Two mitigations, both application-side: keep the block short and rigid so Select never misses, and verify on the pilot that a deliberately malformed block falls back gracefully (if raw-text fallback shows markers, the backend must send the marker block as a **separate** reply after the lead-in, so a fallback leaks only the block, or we ask Hazem for a per-template fallback setting, which no screen shows).

**Ordering (comparison → recommendation → choice).** Studio selects one template per agent reply. The approved comparison turn is three messages, so the backend must deliver them as **three replies**: (1) lead-in + `rsg:resort_compare`, (2) the approved recommendation sentence with no block, (3) `rsg:resort_choice`. Reply 2 matches no template and is sent as text by design. The same holds for details + villas and legs + totals. The backend already emits ordered items once per step and refuses a second card in the same guest turn (`agent/chat.py turn_complete`); whether the `custom-http-agent` contract lets one agent turn return several messages is one of the open questions (§4.2).

## 3. Selection table

Slugs are the ones on your Components page. Web icon confirmed on all six; `cta-button` and `reply-buttons` carry the WhatsApp icon only and are not used.

| Journey step | Current V2/live component | Studio component (slug) | Template slug to create | Renders where | Evidence | Status |
|---|---|---|---|---|---|---|
| Resort suggestions (3 cards + استكشف المزيد) | `C.resortPick` | `text` + `carousel` | `rsg-resort-suggestions` | Studio web widget / website renderer | `chat.js:300-308`; Sabiq 2:00 (3-button carousel on web) | **Ready to configure** |
| Resort details (single card) | `C.resortDetails` | `text` + `carousel` (1 card, no buttons) | `rsg-resort-details` | same | `chat.js:311-317`; Sabiq 2:24 (single-card view) | Ready |
| Comparison (5 criterion cards, informational) | `C.compare` | `text` + `carousel` (no buttons) | `rsg-resort-compare` | same; the resort thumbnails are a website hook and have no Studio slot | `chat.js:338-359`, `RESORT_COMPARE` | Ready (thumbnails lost if the Studio widget renders) |
| Recommendation | approved bubble | plain text, no template | none | same | `script.js compare.ok[1]` | Application-owned wording |
| Resort choice after the comparison (2 cards, اختيار) | `C.comparePick` | `text` + `carousel` | `rsg-resort-choice` | same | `chat.js:360-367`; Sabiq 2:36 (trims carousel, one button per card) | **Ready; pilot template** |
| Official page from the photo | `linkResortImages` | none (no link slot) | — | website only | `chat.js:286-297` | Application-owned |
| Browse resorts on the page (scroll + spotlight) | `navigate_to_resorts` → `revealChoose()` | none | — | website page | `agent/tools.json`, `chat.js` | Application-owned |
| Villas (8 cards) | `C.villas` | `text` + `carousel` | `rsg-villas` | same | `chat.js:320-331` | Ready |
| Dates | `C.calendar` | none | — | website | MAPPING.md | Application-owned |
| Stay summary + approval | `C.summary1` | `text` + `confirmation-card` | `rsg-stay-summary` | same | `chat.js:408-426`; Sabiq 4:42 (card with 2 buttons) | Ready |
| Arrival mode | `C.modes` | `text` + `selection-list-picker` | `rsg-arrival-mode` | same | `chat.js:429-433`; Sabiq 0:18, 4:00 | Ready |
| Airports | `C.airports` | `text` + `grouped-list-picker` | `rsg-airports` | same | `chat.js:437-448`; Sabiq 4:24 | Ready (one-per-group enforced by the application, not the schema) |
| Transfer legs (2 info cards) | `C.transportTrip` | `text` + `carousel` (no buttons) | `rsg-transfer-legs` | same | `chat.js:451-462` | Ready |
| Totals + approval | `C.summary2` | `text` + `confirmation-card` | `rsg-totals` | same | `chat.js:408-415` | Ready |
| Experiences (3 info cards) | `C.activities` | `text` + `carousel` (no buttons) | `rsg-experiences` | same; the decision quick reply stays in the website | `chat.js:465-470` | Ready |
| Guest path (returning / new) | `C.accountChoice` | `text` + `selection-list-picker` | `rsg-guest-path` | same | `chat.js:661-667`; Sabiq 6:00 (row with subtitle and badge) | Ready |
| Sign-in (e-mail + code), special-request question, guest form, voice recorder | RSG components | none | — | website + `server.py` | MAPPING.md "keep" rows | Application-owned |
| Review (+ تعديل البيانات; terms checkbox) | `C.review` | `text` + `confirmation-card` | `rsg-review` | same; terms checkbox stays a website control | `chat.js:535-553` | Ready |
| Checkout hand-off | `C.payment` | `text` + `confirmation-card` | `rsg-checkout` | same | `chat.js:671-688`; Sabiq 4:42 shows the buttons but **not** what they do | **Pending: a Studio button on web is only seen posting text; keep the website handler that opens the checkout URL** |
| Trip summary + PDF | `C.confirmation` | `text` + `confirmation-card` | `rsg-trip-summary` | same; PDF = `js/pdf.js` | `chat.js:690-708` | Ready for the card; the PDF button needs the website handler |
| Quick replies (9 ids) | `C.quick` (web SDK `buttons`) | none in the library | — | website | `chat.js:715-728` | Application-owned |

## 4. The six open questions

| # | Question | Confirmed | Evidence | Still missing |
|---|---|---|---|---|
| 1 | Web-channel message format; how a selection returns to the right session | The web channel is Studio's widget: `ChatWidget.init({ transport: { sseEndpoint: ".../api/v1/chat", apiKey: "acp_…" } })`; a card button or picker row posts its **payload as the visitor's next message in the same conversation** and the agent answers it («عرض تفاصيل Toyota Land Cruiser», «المواعيد المتاحة في معرض …», "View Details of Toyota Urban Cruiser"). Session continuity is the widget's and the channel's job; the application never sees a session id in what is shown | Agentforce 3:36, 4:12; Sabiq 2:18, 4:12, 4:24 | The **SSE event JSON** (what the widget receives) and the **POST body of a visitor message** (what it sends), needed only if the RSG website keeps its own UI and must speak the same protocol instead of embedding the widget. Ask Hazem for `docs/api-v2.md` + `specs/016-rich-components/contracts/rich-messages.md` or one captured session (`/api/v1/sessions/:id/messages`) |
| 2 | `custom-http-agent` request/response to deliver text + `rsg:` markers | Studio offers "Custom Agent (self-hosted): Point Clouding at your own HTTP agent endpoint"; the Masdar doc lists `custom-http-agent` with a `base_url` and says it "speaks the agent HTTP contract" | Agentforce 0:30; Masdar doc §4 | **The contract itself** (request fields, how the reply text is returned, whether one turn may return several messages, whether a `rich_components` envelope may be returned directly). Ask for the "agent HTTP contract" page of `agent_control_plane` or an example custom agent |
| 3 | Exact slugs and channels | `image`, `text`, `grouped-list-picker`, `carousel`, `confirmation-card`, `selection-list-picker`: Web (and Mobile) icons; `wa-carousel`, `wa-list-picker`, `cta-button`, `reply-buttons`, `geolocation`: WhatsApp only. The web RI canvas lists Carousel, List Picker, Confirmation Card, Selection List Picker, Image Preview as system templates and the six components in its library | Components screenshot; Agentforce 3:54 | Nothing |
| 4 | `""` for required-but-unused keys on web | **Not confirmed.** The schemas mark every key required with `additionalProperties:false`; the Masdar WhatsApp templates show other components; no web payload was seen. The library instructions say "extract if present", so the populator itself may emit `""` or omit keys; what the validator does is unknown | — | One accepted web payload for `carousel` and `confirmation-card` (from a session log), or Hazem's word on the validator. Until then the pilot's instruction says `= ""` explicitly, which is the Masdar `initial_choice` convention |
| 5 | A web CTA that opens the official checkout URL | **Not confirmed.** `cta-button` is WhatsApp-only in your library. Confirmation Card buttons on web were seen («عرض الموقع على الخريطة», «الاتجاه إلى الفرع») but never clicked on camera; every button click that was shown posted text | Components screenshot; Sabiq 4:42, 7:00 | Either a recording/session where «عرض الموقع على الخريطة» is clicked, or the widget/SDK doc for button behaviour. Until then **the checkout stays an application-rendered card**: the website's handler opens `BOOKING.checkoutUrl` (`chat.js:671-688`) |
| 6 | Public image URLs | **Yes if the Studio widget renders.** Every image seen in both demos is an absolute URL (the Masdar template resolves image keys to `https://…/servlet/servlet.ImageServer?id=…`; the Agentforce widget's avatar is `https://www.vectorlogo.zone/…`). The populator copies a URL string; the widget loads it from its own origin, so a relative `assets/…` path only works when the **website** renders the card | Masdar template instructions; Agentforce 3:36 | **The public base URL where the RSG assets will be served** (the live server is `127.0.0.1` today). Send the host you intend (the demo page's origin or a static host) and I replace `assets/…` in every marker row with absolute URLs. Not invented here |

## 5. Templates: WHEN TO SELECT and component instructions

Format: template name and slug · **WHEN TO SELECT** (template field) · **Text instruction** (per-reference override of `text`) · **component instruction** (per-reference override of the rich component) · the reply the backend must send · data · guest actions · evidence. Component instructions are written in the Masdar style (row format, field mapping, constants, `""`). English for Studio, approved Arabic labels kept. Nothing invents a price, date, availability, verification or payment status.

Status key: **Ready** = component, fields and web rendering verified; depends only on the backend emitting the block. **Pending** = also depends on an open question in §4.

Image paths below are the website's relative `assets/…` paths; replace with absolute URLs once §4.6 is answered.

### 5.1 `rsg-resort-suggestions` (text + carousel) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:resort_suggestions' followed by three rows beginning with # and containing ' :: ' separators. This is the answer to a guest who said what holiday or stay they want, asked for suggestions, or whose request to see the resort cards on the page could not be fulfilled; the lead-in is the approved sentence starting 'أقترح لكم هذه الوجهات'.
Do NOT select for 'rsg:resort_compare', 'rsg:resort_choice' or 'rsg:resort_details' blocks, do NOT select when the reply has no rsg: block (a plain answer or a question), and do NOT select when the guest asked to browse the resorts on the page (that reply carries no block; the page scrolls instead).
```

Text instruction — paste this:
```
text = the agent's lead-in sentence(s) verbatim, with the 'rsg:resort_suggestions' line and every '#' row removed. Nothing else. Never add, translate or reword.
```

Carousel instruction — paste this:
```
Build one card per '#' row, in row order. Each row is
  #N <English resort name> :: <Arabic setting> :: <Arabic profile line> :: <Arabic location> :: <Arabic accommodation> :: <Arabic highlights, comma-separated> :: <image URL>
For every card:
  main_title = the English resort name, verbatim (max 60 chars).
  badge_title = the Arabic setting (max 15 chars). badge_position = "top-left".
  subtitle = "البحر الأحمر".
  description = the profile line, then a blank line, then three markdown bullets: "- **الموقع:** " + location, "- **الإقامة:** " + accommodation, "- **أبرز المرافق:** " + highlights. Copy the text exactly; never add prices, availability, ratings or distances that are not in the row.
  image_url = the image URL at the end of the row, verbatim; never invent a URL.
  primary_button_label = "اختيار". primary_button_payload = "نختار " + the English resort name + "." (for example "نختار Shebara.").
  secondary_button_label, secondary_button_payload, tertiary_button_label, tertiary_button_payload = "".
  lock_after_selection = true.
There must be exactly as many cards as '#' rows (three).
```

Reply the backend must send (values from `data/resorts.js`):
```
أقترح لكم هذه الوجهات يا محمد. أيها أقرب لجوّكم؟ وإذا تحب تتصفح أكثر، فرابط «استكشف المزيد» تحت الاقتراحات.
rsg:resort_suggestions
#1 Shebara :: جزيرة :: أول منتجع فاخر تملكه Red Sea Global وتديره بالكامل، على جزيرة في عرض البحر الأحمر. :: جزيرة شيبارة، على بعد 25 كم من البر :: 73 فيلا بمسبح خاص: 38 فوق الماء و35 على الشاطئ :: سبا بخمس غرف علاج، مركز غوص والشعاب على بعد 30 إلى 40 مترًا من الشاطئ، جلسات رصد النجوم، بادل وتنس :: assets/resorts/shebara.webp
#2 Desert Rock :: جبال :: منتجع في وادٍ بين الجبال قرب أملج، تملكه Red Sea Global وتديره. :: وادٍ جبلي قرب أملج :: 54 فيلا و10 أجنحة، منها فلل معلّقة على الجرف وأجنحة في كهف جبلي :: سبا، مركز مغامرات، جلسات رصد النجوم، واحة بحيرة :: assets/resorts/desert-rock.webp
#3 Six Senses Southern Dunes, The Red Sea :: صحراء :: منتجع صحراوي داخلي بعلامة Six Senses، يجمع برامج العافية والطبيعة. :: الكثبان الجنوبية، نحو 60 دقيقة بالسيارة من مطار البحر الأحمر الدولي :: 36 غرفة وجناحًا و40 فيلا بمسبح :: Six Senses Spa، تسلّق ومشي ودراجات كهربائية، رصد النجوم :: assets/resorts/six-senses-southern-dunes.webp
```

Data: `data/resorts.js` profiles (`settingAr`, `aboutAr`, `locationAr`, `stayAr`, `highlightsAr`, `image`), `SUGGESTED` order; stage ∈ {intent, resort}; the guest's first name for the lead-in. Guest actions: `اختيار` posts `نختار <Name>.` → the backend maps that approved line to the `resort` event (`agent/state.py choose_resort`): Shebara → details + villas (stage villa); another resort → its details + the Shebara offer (stage unchanged). The «استكشف المزيد» link and the photo links are website asides. Evidence: `chat.js:300-308`, Sabiq 2:00–2:18.

### 5.2 `rsg-resort-details` (text + carousel, single card) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:resort_details' followed by exactly one '#' row with ' :: ' separators. This is the information card for the resort the guest has just chosen (by card, by the page button or by name); the lead-in is 'اختيار موفّق. هذه نبذة سريعة عن …:' or 'خيار جميل. هذه نبذة عن …:'.
Do NOT select for 'rsg:resort_suggestions' (three rows), 'rsg:resort_compare' or 'rsg:resort_choice', and do NOT select when the reply has no rsg: block.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim, with the 'rsg:resort_details' line and the '#' row removed. Nothing else.
```

Carousel instruction — paste this:
```
Build exactly one card from the single '#' row:
  #1 <English resort name> :: <Arabic setting> :: <Arabic profile line> :: <Arabic location> :: <Arabic accommodation> :: <Arabic highlights> :: <image URL>
  main_title = English name (max 60). badge_title = Arabic setting (max 15). badge_position = "top-left". subtitle = "البحر الأحمر".
  description = profile line, blank line, then "- **الموقع:** …", "- **الإقامة:** …", "- **أبرز المرافق:** …" copied from the row. image_url = the image URL verbatim.
  All six button keys = "". lock_after_selection = true. Never add prices or availability.
```

Reply: the 5.1 row format for the chosen resort, after the approved lead-in. No guest action. Evidence: `chat.js:311-317`, Sabiq 2:24 (single-card view on web).

### 5.3 `rsg-resort-compare` (text + carousel, informational) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:resort_compare' followed by five '#' rows with ' :: ' separators. This answers a guest who is undecided between Shebara and Desert Rock or asks how they differ; the lead-in is 'سؤال في محلّه يا …. هذه أهم الفروق بين المنتجعين، معيارًا بمعيار:'. The cards are informational and carry no buttons.
Do NOT select for 'rsg:resort_choice' (two rows with buttons, which arrives two replies later), do NOT select for 'rsg:resort_suggestions', and do NOT select a plain-text follow-up about one criterion, which has no rsg: block.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim, with the 'rsg:resort_compare' line and every '#' row removed. Nothing else.
```

Carousel instruction — paste this:
```
Build one card per '#' row (five), in row order. Each row is
  #N <criterion title> :: <criterion question> :: <Shebara fact> :: <Desert Rock fact> :: <difference label or -> :: <difference or ->
  main_title = criterion title (max 60). subtitle = criterion question (max 30). badge_title = N + " من 5" (for example "1 من 5"). badge_position = "top-left". image_url = "".
  description = "- **Shebara:** " + Shebara fact, newline, "- **Desert Rock:** " + Desert Rock fact; when the difference label is not '-', add a blank line then "**" + label + ":** " + difference. Copy every fact verbatim; never add a fact, a price or a judgement.
  All six button keys = "". lock_after_selection = true.
```

Reply (first of five rows, from `RESORT_COMPARE`):
```
سؤال في محلّه يا محمد. هذه أهم الفروق بين المنتجعين، معيارًا بمعيار:
rsg:resort_compare
#1 المكان والطبيعة :: بحر أم جبال؟ :: جزيرة في عرض البحر الأحمر على بعد 25 كم من البر، تصلها بالسيارة ثم القارب أو بالطائرة المائية. :: منتجع جبلي داخلي في وادٍ بين الجبال قرب أملج، تصله بالسيارة من مطار البحر الأحمر الدولي. :: الفرق :: جزيرة يحيط بها البحر، مقابل وادٍ تحيط به الجبال.
```

No guest action. The website's resort thumbnails inside the comparison (`compareThumbs`) have no Studio slot and are lost when the Studio widget renders. Evidence: `chat.js:338-359`, `data/resorts.js:116-135`.

### 5.4 Recommendation — plain text, no template

Second reply of the comparison turn: `بما إنك تخطط لإجازة مع زوجتك، أرشّح لك Shebara: …والقرار لكم:` with no block. Matches no template; Studio sends it as text. Do not create a template; keep every WHEN TO SELECT conditioned on its `rsg:` line so no template can match this reply. Evidence: `script.js compare.ok[1]`, Round 6 decision.

### 5.5 `rsg-resort-choice` (text + carousel, two cards with اختيار) — Ready, **pilot template**

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:resort_choice' followed by exactly two '#' rows with ' :: ' separators. This is the third reply of the comparison turn, after the comparison cards and the recommendation sentence; the guest now picks Shebara or Desert Rock.
Do NOT select for 'rsg:resort_compare' (five rows, no buttons) or 'rsg:resort_suggestions' (three rows), and do NOT select a reply without an rsg: block.
```

Text instruction — paste this:
```
text = the agent's lead-in verbatim with the 'rsg:resort_choice' line and the '#' rows removed; if the reply has no lead-in sentence, text = "والقرار لكم:".
```

Carousel instruction — paste this:
```
Build two cards from the two '#' rows, Shebara first:
  #N <English resort name> :: <Arabic setting> :: <Arabic profile line> :: <image URL>
  main_title = English name (max 60). badge_title = Arabic setting. badge_position = "top-left". subtitle = "البحر الأحمر". description = the profile line verbatim. image_url = the image URL verbatim.
  primary_button_label = "اختيار". primary_button_payload = "نختار " + English name + ".".
  secondary_button_label, secondary_button_payload, tertiary_button_label, tertiary_button_payload = "". lock_after_selection = true.
```

Reply the backend must send:
```
rsg:resort_choice
#1 Shebara :: جزيرة :: أول منتجع فاخر تملكه Red Sea Global وتديره بالكامل، على جزيرة في عرض البحر الأحمر. :: assets/resorts/shebara.webp
#2 Desert Rock :: جبال :: منتجع في وادٍ بين الجبال قرب أملج، تملكه Red Sea Global وتديره. :: assets/resorts/desert-rock.webp
```

Guest action: `اختيار` on Shebara posts `نختار Shebara.` → backend `choose_resort` → stage villa → next replies: details (`rsg:resort_details`) then villas (`rsg:villas`). Evidence: `chat.js:360-367`; Sabiq 2:36 (same shape: one primary button per card, click posts the payload).

### 5.6 `rsg-villas` (text + carousel, eight cards) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:villas' followed by eight '#' rows with ' :: ' separators. This is the second reply after Shebara is chosen; the lead-in is 'وهذه خيارات الفلل، وأقدر أرتب لك التفاصيل بعدها:'.
Do NOT select when the guest picked an unpriced villa (that reply is plain text starting 'سعر … أحتاج أتأكد منه' and has no rsg: block), and do NOT select for any resort other than Shebara.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the 'rsg:villas' line and the '#' rows removed. Nothing else.
```

Carousel instruction — paste this:
```
Build one card per '#' row (eight), in row order. Each row is
  #N <English villa name> :: <Arabic villa name> :: <Arabic occupancy> :: <Arabic facts separated by ' · '> :: <price or -> :: <rate badge or -> :: <price basis or -> :: <image URL>
  main_title = Arabic villa name (max 60). badge_position = "top-right". badge_title = the rate badge when it is not '-' ("Villa Flat Rate" on one row only), otherwise "". subtitle = the price when it is not '-' (for example "SAR 28,980.00"), otherwise "". Never write a price on a row whose price field is '-'.
  description = "**" + occupancy + "**", blank line, one markdown bullet per fact (split the facts on ' · '), and when the price basis is not '-' a blank line then the price basis verbatim.
  image_url = the image URL verbatim. primary_button_label = "اختيار". primary_button_payload = "أختار " + English villa name + " على Villa Flat Rate.".
  secondary and tertiary label/payload keys = "". lock_after_selection = true.
```

Reply (first two of eight rows):
```
وهذه خيارات الفلل، وأقدر أرتب لك التفاصيل بعدها:
rsg:villas
#1 One Bedroom Overwater Villa :: فيلا فوق الماء بغرفة نوم واحدة :: 2 بالغين + طفل + رضيع :: غرفة نوم واحدة · سرير كينغ · فيلا فوق الماء · 188 م² · مسبح خاص :: SAR 28,980.00 :: Villa Flat Rate :: ليلتان · شخصان بالغان · 23 - 25 أكتوبر 2026 · شامل جميع الضرائب :: assets/villas/shebara-one-bedroom-overwater-villa-1.webp
#2 Two Bedroom Overwater Villa :: فيلا فوق الماء بغرفتي نوم :: 4 بالغين + طفلان + رضيع :: غرفتا نوم · سرير كينغ + سريران كوين · إطلالة فوق الماء · 288 م² · مسبح خاص :: - :: - :: - :: assets/villas/shebara-two-bedroom-overwater-villa.webp
```

Guest action: `اختيار` posts `أختار <villa> على Villa Flat Rate.` → `villa` event: the priced villa → party question; another villa → the re-quote text (+ website quick reply), stage unchanged. Evidence: `chat.js:320-331`, `state.py choose_villa`.

### 5.7 `rsg-stay-summary` (text + confirmation-card) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:stay_summary' followed by 'key = value' lines. This confirms the stay after the guest picked the quoted dates (23 to 25 October 2026); the lead-in is 'توقيت جميل. هذا ملخص الإقامة:'.
Do NOT select for 'rsg:totals' (the summary with transfers), do NOT select when other dates were picked (plain text starting 'للتواريخ من … أحتاج تحديث السعر', no block), and do NOT select a question asked while the summary is on screen.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the 'rsg:stay_summary' block removed. Nothing else.
```

Confirmation Card instruction — paste this:
```
Fill the card from the 'key = value' lines after 'rsg:stay_summary'; copy values verbatim.
  image_url = the 'image' line. badge_text = "ملخص الإقامة". main_title = "Shebara". subtitle = the 'subtitle' line.
  primary_card_title = "التواريخ". primary_card_subtitle = the 'dates' line (max 150). primary_card_icon = the 'icon_calendar' line.
  secondary_card_title = "الضيوف". secondary_card_subtitle = the 'guests' line. secondary_card_icon = the 'icon_users' line.
  tertiary_card_title = "إجمالي الإقامة". tertiary_card_subtitle = the 'total' line. tertiary_card_icon = the 'icon_card' line.
  instructions = the 'note' line (max 150). primary_button_label = "مناسب، نكمل". primary_button_payload = "مناسب، نكمل". primary_button_icon = "check".
  secondary_button_label, secondary_button_payload, secondary_button_icon = "". Never compute, round or alter an amount or a date.
```

Reply the backend must send:
```
توقيت جميل. هذا ملخص الإقامة:
rsg:stay_summary
image = assets/site/resorts-hero-shebara.webp
subtitle = فيلا فوق الماء بغرفة نوم واحدة · Villa Flat Rate
dates = الجمعة 23 أكتوبر 2026 – الأحد 25 أكتوبر 2026 · ليلتان
guests = 2 بالغين
total = SAR 28,980.00 · شامل جميع الضرائب
note = عدد الغرف يكفي مجموعتكم، ويمكنكم إضافة المزيد عند الحاجة.
icon_calendar = studio/icons/calendar.svg
icon_users = studio/icons/users.svg
icon_card = studio/icons/credit-card.svg
```

Guest action: `مناسب، نكمل` → `approve` event → arrival modes. The approved follow-up «إذا الملخص مناسب، نكمل لترتيب الوصول.» is a separate plain reply. Icons are SVG URLs (schema: "URL to SVG icon"), so they follow the same hosting rule as images. Evidence: `chat.js:408-426`; Sabiq 4:42 (confirmation card with rows and two buttons on web).

### 5.8 `rsg-arrival-mode` (text + selection-list-picker) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:arrival_modes' followed by four '#' rows with ' :: ' separators. This asks how the guests arrive, right after the stay summary is approved; the lead-in is 'كيف بتوصلون للبحر الأحمر؟'.
Do NOT select when a mode other than the plane was chosen (plain text starting 'هذه الرحلة مُعدّة للوصول بالطائرة', no block), and do NOT select for 'rsg:airports'.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the block removed. Nothing else.
```

Selection List Picker instruction — paste this:
```
main_title = "كيف بتوصلون للبحر الأحمر؟". lock_after_selection = true.
Build one item per '#' row, in order. Each row is  #N <Arabic label> :: <Lucide icon name>
  title = the Arabic label (max 30). icon = the icon name. payload = the Arabic label + "." (for example "بالطائرة."). subtitle = "". badge = "".
```

Reply:
```
كيف بتوصلون للبحر الأحمر؟
rsg:arrival_modes
#1 بالطائرة :: plane
#2 بطائرة خاصة :: plane-takeoff
#3 بالسيارة :: car
#4 باليخت :: ship
```

Guest action: a row posts its payload → `mode` event (By Plane → airports; others → the offer, stage unchanged). Evidence: `chat.js:429-433`; Sabiq 0:18, 4:00, 6:00.

### 5.9 `rsg-airports` (text + grouped-list-picker) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:airports' followed by two lines beginning with 'group '. This collects the arrival and departure airports after the guest chose to arrive by plane; the lead-in is 'حدد مطار الوصول ومطار المغادرة. تفاصيل الرحلات اختيارية.'.
Do NOT select when the selection was not one airport per group (plain text 'اختر مطار الوصول ومطار المغادرة في النموذج ثم اعتمدها.', no block), do NOT select for other airport pairs (plain text starting 'لهذه المطارات أحتاج تحديث خيارات التنقل'), and do NOT select for 'rsg:transfer_legs'.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the block removed. Nothing else.
```

Sectioned Multi-Select instruction — paste this:
```
main_title = "مطار الوصول ومطار المغادرة". send_button_label = "اعتماد المطارات". lock_after_selection = true. is_multiple_selection = true.
groups = one group per 'group' line, in order. Each line is  group <Arabic group title> :: <option> | <option> | <option>
  title = the group title (max 30). options = the options split on ' | ', verbatim, in order.
```

Reply:
```
حدد مطار الوصول ومطار المغادرة. تفاصيل الرحلات اختيارية.
rsg:airports
group مطار الوصول :: مطار البحر الأحمر الدولي – RSIA | مطار ينبع | مطار الوجه المحلي
group مطار المغادرة :: مطار البحر الأحمر الدولي – RSIA | مطار ينبع | مطار الوجه المحلي
```

Guest action: send → the Studio line `مطار الوصول: X, مطار المغادرة: Y` (Sabiq 4:24 shows the "group: option" form) → the backend parses it and applies the `airports` event when exactly one option per group was chosen (Yanbu → RSIA advances), otherwise answers `airportsBad`. Evidence: `chat.js:437-448`.

### 5.10 `rsg-transfer-legs` (text + carousel, two info cards) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:transfer_legs' followed by two '#' rows. This shows the two priced transfer legs once Yanbu arrival and RSIA departure are confirmed; the lead-in is 'سجّلت المطارات. هذه تنقلاتكم من المطار إلى Shebara وبالعكس:'. The updated totals follow in the next reply ('rsg:totals').
Do NOT select for 'rsg:totals', and do NOT select a plain-text answer about transfers.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the block removed. Nothing else.
```

Carousel instruction — paste this:
```
Build two cards from the two '#' rows. Each row is
  #N <Arabic badge> :: <Arabic product> :: <price> :: <route> :: <details separated by ' | ' or -> :: <price basis> :: <image URL>
  badge_title = the badge (الوصول / المغادرة). badge_position = "top-left". main_title = the product (max 60). subtitle = the price (for example "SAR 3,622.50").
  description = "**" + route + "**", then, when details are not '-', a blank line and one markdown bullet per detail, then a blank line and the price basis verbatim.
  image_url = the image URL verbatim. All six button keys = "". lock_after_selection = true. Never alter an amount.
```

Reply:
```
سجّلت المطارات. هذه تنقلاتكم من المطار إلى Shebara وبالعكس:
rsg:transfer_legs
#1 الوصول :: سيارة فاخرة خاصة + قارب ترفيهي مشترك :: SAR 3,622.50 :: Yanbu Airport → Shebara :: 4 ساعات | سعة السيارة الفاخرة الخاصة: حتى 3 ضيوف | سعة القارب الترفيهي المشترك: حتى 18 ضيفًا | المطلوب: سيارة فاخرة خاصة واحدة وقارب ترفيهي مشترك واحد :: السعر الإجمالي (شامل جميع الضرائب) | شخصان بالغان :: assets/transport/getting-to-and-around-5.webp
#2 المغادرة :: قارب سريع مشترك + سيارة فاخرة خاصة :: SAR 1,191.40 :: Shebara → Red Sea International Airport - RSIA :: - :: السعر الإجمالي (شامل جميع الضرائب) | شخصان بالغان :: assets/transport/driving-to-the-red-sea.webp
```

No guest action. Evidence: `chat.js:451-462`.

### 5.11 `rsg-totals` (text + confirmation-card) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:totals' followed by 'key = value' lines. This confirms the grand total after the transfers; the lead-in is 'وهذا الملخص بعد إضافة التنقلات:'.
Do NOT select for 'rsg:stay_summary' or 'rsg:review', and do NOT select a plain-text answer about the price.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the block removed. Nothing else.
```

Confirmation Card instruction — paste this:
```
Fill from the 'key = value' lines; copy values verbatim.
  image_url = the 'image' line. badge_text = "الملخص المحدّث". main_title = "Shebara". subtitle = the 'subtitle' line.
  primary_card_title = "الإقامة", primary_card_subtitle = the 'stay' line, primary_card_icon = the 'icon_bed' line.
  secondary_card_title = "التنقلات", secondary_card_subtitle = the 'transfers' line, secondary_card_icon = the 'icon_plane' line.
  tertiary_card_title = "الإجمالي", tertiary_card_subtitle = the 'total' line, tertiary_card_icon = the 'icon_card' line.
  instructions = the 'note' line (max 150). primary_button_label = "اعتمد ونكمل". primary_button_payload = "اعتمد ونكمل". primary_button_icon = "check". Secondary button keys = "". Never compute or alter an amount.
```

Reply:
```
وهذا الملخص بعد إضافة التنقلات:
rsg:totals
image = assets/site/resorts-hero-shebara.webp
subtitle = فيلا فوق الماء بغرفة نوم واحدة · الجمعة 23 أكتوبر 2026 – الأحد 25 أكتوبر 2026 · ليلتان · 2 بالغين
stay = SAR 28,980.00
transfers = SAR 4,813.90
total = SAR 33,793.90 · شامل جميع الضرائب
note = الإقامة والتنقلات · 2 بالغين · شامل جميع الضرائب
icon_bed = studio/icons/bed.svg
icon_plane = studio/icons/plane.svg
icon_card = studio/icons/credit-card.svg
```

Guest action: `اعتمد ونكمل` → `approve` event → experiences. Evidence: `chat.js:408-415`.

### 5.12 `rsg-experiences` (text + carousel, three info cards) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:experiences' followed by three '#' rows. This presents the optional experiences once after the totals are approved; the lead-in is 'وهذه تجارب ممكن تستكشفونها خلال الإقامة. تقدرون تقررون الآن أو عند الوصول:'. The cards have no buttons; the decision is taken in words or with the website's quick reply.
Do NOT select when the guest wants to add an experience (plain text starting 'بكل سرور. أقدر أرتب لكم التجارب مع فريق المنتجع', no block), and do NOT select for any later step.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the block removed. Nothing else.
```

Carousel instruction — paste this:
```
Build three cards from the '#' rows. Each row is
  #N <Arabic name> :: <Arabic category> :: <price line> :: <Arabic tags separated by ' | '> :: <image URL>
  main_title = the name (max 60). badge_title = the category (max 15). badge_position = "bottom-left". image_url = the image URL verbatim.
  subtitle = the price line when it is 30 characters or fewer; otherwise the part of the price line before the first '،'.
  description = one markdown bullet per tag; when the subtitle was shortened, add a blank line and the full price line verbatim.
  All six button keys = "". lock_after_selection = true. Never change a price.
```

Reply:
```
وهذه تجارب ممكن تستكشفونها خلال الإقامة. تقدرون تقررون الآن أو عند الوصول:
rsg:experiences
#1 Adrena :: أدرينا :: ابتداءً من SAR 500.00 للشخص :: منطقة المغامرات :: assets/activities/adrena-7.webp
#2 استكشاف الحديقة وتجربة الزراعة :: الطبيعة :: ابتداءً من SAR 184.58 للشخص :: ساعة إلى ساعتين | للمبتدئين | نشاط فردي أو جماعي :: assets/activities/garden-discovery-and-planting-experience.webp
#3 التجديف باللوح واقفًا :: رياضات مائية :: SAR 200.00، شخص بالغ واحد، ساعة واحدة، شامل جميع الضرائب :: ساعة واحدة | العمر: 8+ | للمبتدئين :: assets/activities/stand-up-paddle-boarding.webp
```

No card action; «نختار عند الوصول» is a website quick reply (`activities_defer` → `defer` event) or typed. Evidence: `chat.js:465-470`.

### 5.13 `rsg-guest-path` (text + selection-list-picker) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:guest_path' followed by two '#' rows. This asks whether the guest signs in with an e-mail code to retrieve saved details or continues as a new guest without a code; the lead-in contains 'نحتاج بياناتك وبيانات زوجتك يا … عشان نكمل الحجز'.
Do NOT select for the sign-in card, the special-request question or the guest form (website components; their replies carry no rsg: block), and never select it again after the choice.
```

Text instruction — paste this:
```
text = the agent's lead-in sentences verbatim with the block removed. Nothing else.
```

Selection List Picker instruction — paste this:
```
main_title = "كيف تحب نكمل؟". lock_after_selection = true.
Build one item per '#' row, in order. Each row is  #N <Arabic title> :: <Arabic subtitle> :: <Lucide icon name>
  title = the title (max 30). subtitle = the subtitle (max 60). icon = the icon name. payload = the title, verbatim. badge = "".
```

Reply:
```
ولا يهمك. ما أضفت أي تجربة، والإجمالي كما هو. فريق المنتجع يساعدكم تختارون ما يناسبكم عند الوصول، حسب التوفر.
نحتاج بياناتك وبيانات زوجتك يا محمد عشان نكمل الحجز. إذا سبق وسجّلت معنا، تقدر تدخل ببريدك الإلكتروني ونسترجع بياناتك المحفوظة، أو تكمل كضيف جديد.
rsg:guest_path
#1 لدي حساب سابق :: الدخول ببريدك الإلكتروني واسترجاع بياناتك المحفوظة :: lock
#2 متابعة كضيف جديد :: إدخال بياناتك وبيانات زوجتك للحجز :: user
```

Guest action: a row posts its title → `account` event (account → sign-in card, stage login; guest → guest form, stage guest). Branch rules stay in the backend, not in Studio: the returning guest verifies the e-mail with a real code (`server.py` OTP) before `/api/profile`, then answers the special-request question (`stage requests`) before the prefilled form; the new guest never gets a code; no request is added unless the guest gave one for this stay. Evidence: `chat.js:661-667`, `state.py signed_in / record_request`; Sabiq 6:00 (row with subtitle and badge).

### 5.14 `rsg-review` (text + confirmation-card) — Ready

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:review' followed by 'key = value' lines. This shows everything the guest is about to confirm after the guest form was submitted or edited; the lead-in is 'شكرًا لك يا …. راجع التفاصيل، وتقدر تعدّل بياناتكم من هنا…' or 'حُفظت التعديلات يا …. هذه المراجعة بعد التعديل…'.
Do NOT select the terms reminder (plain text starting 'قبل ما نكمل، أحتاج موافقتك على الشروط', no block), do NOT select for 'rsg:checkout' or 'rsg:trip_summary'.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the block removed. Nothing else.
```

Confirmation Card instruction — paste this:
```
Fill from the 'key = value' lines; copy values verbatim, never add or infer a value.
  image_url = the 'image' line. badge_text = "مراجعة رحلتك". main_title = "Shebara". subtitle = the 'subtitle' line.
  primary_card_title = "الضيوف", primary_card_subtitle = the 'guests' line (max 150), primary_card_icon = the 'icon_users' line.
  secondary_card_title = "التنقلات", secondary_card_subtitle = the 'transfers' line, secondary_card_icon = the 'icon_plane' line.
  tertiary_card_title = "التواصل", tertiary_card_subtitle = the 'contact' line, tertiary_card_icon = the 'icon_mail' line.
  instructions = the 'totals' line (max 150). When a 'request' line exists and the totals line plus " · " plus the request plus " (حسب التوفر)" stays within 150 characters, append it; otherwise leave the totals line alone. Never invent a request.
  primary_button_label = "البيانات صحيحة، نكمل". primary_button_payload = "البيانات صحيحة، نكمل". primary_button_icon = "check".
  secondary_button_label = "تعديل البيانات". secondary_button_payload = "تعديل البيانات". secondary_button_icon = "user".
```

Reply (values from the submitted form; the approved demo account shown):
```
شكرًا لك يا محمد. راجع التفاصيل، وتقدر تعدّل بياناتكم من هنا. إذا كل شيء صحيح، أكّد الموافقة على الشروط ونكمل للتحقق من البريد.
rsg:review
image = assets/villas/shebara-one-bedroom-overwater-villa-exterior.webp
subtitle = فيلا فوق الماء بغرفة نوم واحدة · Villa Flat Rate · الجمعة 23 أكتوبر 2026 – الأحد 25 أكتوبر 2026 · ليلتان · 2 بالغين · Yanbu Airport → Red Sea International Airport - RSIA
guests = السيد محمد باز · نورة الحربي
transfers = الوصول: سيارة فاخرة خاصة + قارب ترفيهي مشترك / المغادرة: قارب سريع مشترك + سيارة فاخرة خاصة
contact = <e-mail as submitted> / <country code and mobile as submitted>
totals = الإجمالي SAR 33,793.90 · شامل جميع الضرائب · الإقامة SAR 28,980.00 + التنقلات SAR 4,813.90 · لا تجارب مضافة
request = تسجيل وصول متأخر
icon_users = studio/icons/users.svg
icon_plane = studio/icons/plane.svg
icon_mail = studio/icons/mail.svg
```

Guest actions: `البيانات صحيحة، نكمل` posts that line → `confirm` event; **the terms acknowledgement is a website checkbox under the card** (no Studio slot), and the backend refuses to advance without it. `تعديل البيانات` must open the website's guest form in edit mode: a website handler, since a Studio button only posts text. Evidence: `chat.js:535-553`.

### 5.15 `rsg-checkout` (text + confirmation-card) — **Pending (§4.5)**

Define it, keep it **disabled**. A Studio button on web was only ever seen posting its payload as text; the approved hand-off must open `BOOKING.checkoutUrl` in a new tab, which the website handler does (`chat.js:671-688`). Until a web CTA that opens a URL is evidenced, the payment card stays application-rendered.

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:checkout' followed by 'key = value' lines. This hands the guest over to the official Visit Red Sea checkout after the review is confirmed and the terms are accepted (and, for an account holder who changed the e-mail, after the new address is verified); the lead-in starts 'تمام. هذا رابط الدفع الآمن على موقع Visit Red Sea' or 'تم التحقق. هذا رابط الدفع الآمن'.
Do NOT select before the terms are accepted, do NOT select for 'rsg:trip_summary', and never select it twice.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the block removed. Nothing else.
```

Confirmation Card instruction — paste this:
```
Fill from the 'key = value' lines; copy values verbatim.
  image_url = the 'image' line. badge_text = "visitredsea.com". main_title = "إجمالي رحلتك". subtitle = the 'subtitle' line.
  primary_card_title = "المنتجع", primary_card_subtitle = "Shebara", primary_card_icon = the 'icon_hotel' line.
  secondary_card_title = "الفيلا", secondary_card_subtitle = the 'villa' line, secondary_card_icon = the 'icon_bed' line.
  tertiary_card_title = "التواريخ", tertiary_card_subtitle = the 'dates' line, tertiary_card_icon = the 'icon_calendar' line.
  instructions = "دفع آمن على visitredsea.com". primary_button_label = "المتابعة للدفع". primary_button_payload = "المتابعة إلى الدفع على Visit Red Sea". primary_button_icon = "lock". Secondary button keys = "". Never state a payment or reservation result.
```

Reply:
```
تمام. هذا رابط الدفع الآمن على موقع Visit Red Sea لإتمام الحجز، والإجمالي SAR 33,793.90 شامل الضرائب:
rsg:checkout
image = assets/villas/shebara-one-bedroom-overwater-villa-exterior.webp
subtitle = SAR 33,793.90 · شامل جميع الضرائب
villa = فيلا فوق الماء بغرفة نوم واحدة
dates = الجمعة 23 أكتوبر 2026 – الأحد 25 أكتوبر 2026 · 2 بالغين
icon_hotel = studio/icons/hotel.svg
icon_bed = studio/icons/bed.svg
icon_calendar = studio/icons/calendar.svg
```

Guest action (website handler): opens `BOOKING.checkoutUrl`, echoes the customer line once, starts the return timer; on return the website sends `paymentReturned`. No payment status is claimed. Evidence: `chat.js:671-688`, MAPPING.md "Payment hand-off".

### 5.16 `rsg-trip-summary` (text + confirmation-card) — Ready for the card; the PDF button is a website handler

WHEN TO SELECT — paste this:
```
Select when the reply contains a line that is exactly 'rsg:trip_summary' followed by 'key = value' lines. This hands over the trip summary and the PDF after the guest comes back from the checkout tab, without claiming a payment result; the lead-in is 'هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة PDF:' (the previous reply said 'رجعت من صفحة الدفع يا …. هذه النسخة التجريبية ما تستلم نتيجة الدفع').
Do NOT select for 'rsg:checkout', do NOT select a second return (the application sends nothing new), and never let the badge or titles say the booking or payment is confirmed.
```

Text instruction — paste this:
```
text = the agent's lead-in sentence verbatim with the block removed. Nothing else.
```

Confirmation Card instruction — paste this:
```
Fill from the 'key = value' lines; copy values verbatim.
  image_url = the 'image' line. badge_text = "رحلتك بانتظارك". main_title = "Shebara". subtitle = the 'subtitle' line.
  primary_card_title = "الضيوف", primary_card_subtitle = the 'guests' line, primary_card_icon = the 'icon_users' line.
  secondary_card_title = "التنقلات", secondary_card_subtitle = the 'transfers' line, secondary_card_icon = the 'icon_plane' line.
  tertiary_card_title = "التواصل", tertiary_card_subtitle = the 'contact' line, tertiary_card_icon = the 'icon_mail' line.
  instructions = the 'totals' line, with " · " + request + " (حسب التوفر)" appended only when a 'request' line exists and the result stays within 150 characters.
  primary_button_label = "تحميل PDF". primary_button_payload = "تحميل PDF". primary_button_icon = "download". Secondary button keys = "". The badge and titles must not say the booking or payment is confirmed.
```

Reply: same keys as `rsg:review` with `image = assets/resorts/shebara.webp`, `guests = السيد محمد باز ونورة الحربي · 2 بالغين`, `totals = الإجمالي SAR 33,793.90 · شامل جميع الضرائب · لا تجارب مضافة`.

Guest action: `تحميل PDF` → `BookingPdf.make(state, BOOKING)` in the browser (`js/pdf.js`). A Studio button cannot build a file; if the Studio widget renders this card, its click will arrive as the text «تحميل PDF» and the application must answer with a download link it hosts (not built yet). Evidence: `chat.js:690-708`.

### 5.17 Quick replies — application-owned

No web quick-reply component exists in your library. The website keeps its nine quick replies (`chat.js QUICK`), rendered once after the whole agent turn and gated to the stage they were issued in.

## 6. Connection and ownership

```
Guest ── Studio web widget (ChatWidget.init, sseEndpoint /api/v1/chat, channel acp_ key)   [Agentforce 3:36]
          or the RSG website's own chat UI speaking the same transport                        [contract: §4.1, missing]
   │ visitor message (typed text, or a button/row payload posted as text)                     [Sabiq 2:18, 4:12, 4:24]
   ▼
Empathy Studio channel "RSG – Web" (type Web SDK, RI on) ── agent of type Custom Agent (self-hosted)   [Agentforce 0:30, 0:48]
   │ agent HTTP contract                                                                        [§4.2, missing]
   ▼
server.py (custom agent endpoint): maps the visitor line to a typed turn or to the approved event
(«نختار Shebara.» → resort event; «مناسب، نكمل» → approve; «مطار الوصول: X, مطار المغادرة: Y» → airports …),
runs the Managed Agent for typed text (agent/chat.py, 18 tools), applies the transition (agent/state.py),
returns the approved lead-in + rsg: block (one block per reply, several replies per step when the journey needs them)
   ▼
Studio Rendering Intelligence: Select (WHEN TO SELECT matches the rsg: line) → Populate (component instructions copy the rows) → Validate → render in the widget; on any failure the raw text is sent   [Masdar doc §6; canvas 4:48]
```

Ownership: the **Claude Managed Agent** (`agent_01D3yFvZ2ZTDBwxa8i5g8YN3`) keeps model, system prompt, persona and tool choice, unchanged in Claude Console. **`server.py`** keeps the booking state, every transition, the OTP/profile boundary, the checkout hand-off and the `navigate_to_resorts` page action, and gains the custom-agent endpoint plus marker emission. **Studio** owns the channel, sessions, history, the Select/Populate pipeline and (if its widget is used) the rendering. The **website** keeps everything Studio has no component or behaviour for: the date calendar, the guest form and microphone, the OTP sign-in and verification cards, the special-request question, the resort photo links, the page spotlight, the terms checkbox, the URL-opening payment button, the PDF download, the quick replies.

Consequence to decide before building: if the Studio **widget** is the guest's chat, those website controls are not there. Either the RSG website keeps its own chat UI and uses Studio only as transport + RI (needs §4.1), or the journey steps that need those controls stay plain text in the widget and lose the approved components. The two-resort pilot below works in the widget without any of them.

**Implemented on 9 November 2026** (`visitredsea-chat-live/agent/studio_bridge.py`): the custom-agent endpoint exists at `/studio/sessions` and `/studio/sessions/<id>/messages`, following the contract Studio's own UI documents (two JSON endpoints, `{"session_id"}` and `{"reply"}`, Secret Headers on every request, 404/410 → restart, duplicates possible). The reply format differs from the `rsg:` sketch in §2: it is the approved lead-in sentence(s) followed by labelled data blocks such as `[cards: resort_suggestions]` with `key = value` lines and `button = label -> payload`. The WHEN TO SELECT texts in `STUDIO_TEMPLATES_LIVE.md` are conditioned on those lead-in sentences and stay valid; the component instructions read the lines under the block. What is still missing is a public HTTPS Base URL for the backend and the channel's agent switched to the Custom Agent.

### 6.1 Worked example: comparison → recommendation → choice → Shebara

1. Guest types «صراحة محتار بين Shebara وDesert Rock، وش ترشح لي؟» in the widget → Studio → `server.py` custom endpoint → `user.message` with the context block to the Managed Agent session.
2. The agent emits `agent.custom_tool_use` `show_resort_comparison {}`; `server.py` runs `state.show_comparison` (stage → resort), answers the tool, closes the turn (`turn_complete`), and returns **three replies**: (1) «سؤال في محلّه يا محمد…» + `rsg:resort_compare` block, (2) the approved recommendation sentence, (3) `rsg:resort_choice` block.
3. Studio: reply 1 matches `rsg-resort-compare` → Text (lead-in without the block) + 5-card carousel; reply 2 matches nothing → text; reply 3 matches `rsg-resort-choice` → 2-card carousel with «اختيار». Order holds because they are three replies.
4. Guest presses «اختيار» on Shebara → the widget posts the visitor message «نختار Shebara.» (Sabiq 2:18 pattern) → `server.py` recognises the approved customer line and applies the `resort` event (`choose_resort`, no model call) → stage villa → two replies: «اختيار موفّق…» + `rsg:resort_details`, then «وهذه خيارات الفلل…» + `rsg:villas`.
5. Studio renders the details card, then the villas carousel; the clicked Shebara card is locked (`lock_after_selection`).

## 7. The first web-channel test: the two-resort choice carousel

Goal: prove, with one template, that Studio receives the `rsg:` marker and selects `rsg-resort-choice`, that the approved two cards render in the web chat, that the guest never sees the marker, and that «اختيار» on Shebara returns to the same session and advances the flow exactly once. **Not enabled in this review.**

Prerequisites (owner / Hazem):
1. The `custom-http-agent` contract (§4.2) and the SSE/visitor message format (§4.1) if the RSG website, not the widget, will be the chat.
2. A test Studio account or a channel Hazem approves for mutations (standing rule from the Masdar handoff).
3. A public base URL for two images (`shebara.webp`, `desert-rock.webp`) or confirmation that the pilot may run image-less (`image_url = ""`), which §4.4 also tests.
4. A reachable URL for `server.py` (Studio's control plane must call it; a tunnel to the owner's machine or a small deployment).

Prerequisite (application, out of this review's scope, small): a custom-agent endpoint in `server.py` that, for the pilot only, answers any visitor message with the reply block of §5.5 preceded by its lead-in, answers «نختار Shebara.» with the `resort` event's approved lead-in («اختيار موفّق. هذه نبذة سريعة عن Shebara:», no block for the pilot), and logs each inbound message with its Studio session identifier.

Steps:
1. Components page: confirm `text` and `carousel` show the Web icon (done in the screenshot).
2. Agents → Create → Type **Custom Agent (self-hosted)** → endpoint = the reachable `server.py` URL → Connect.
3. Channels → Create → Account, Agent = that agent, Name "RSG – Web pilot", Type **Web SDK** → Create. Open the channel page, copy the `acp_…` API key (Studio keeps it; do not paste it anywhere else).
4. Channel → Rendering Intelligence → Set up. Leave the **System** templates (Carousel, List Picker, Confirmation Card, Selection List Picker, Image Preview) **off**: a system Carousel template could also match a carousel-shaped reply and compete with the custom one.
5. Custom → Add template → Name "RSG resort choice (Shebara / Desert Rock)", Slug `rsg-resort-choice`, WHEN TO SELECT = §5.5 text. Add component `text` (Required on, Instruction = §5.5 Text instruction) then `carousel` (Required on, Instruction = §5.5 Carousel instruction). Enabled on. Save (the header shows "Saved · just now").
6. Channel → Customize → Live preview, or embed the "Copy snippet" in a blank local HTML page (same mechanism as Agentforce 3:36).
7. Send «محتار بين Shebara وDesert Rock».

Expected results and the checks behind them:
- Studio shows an agent text bubble with **only** the lead-in (or «والقرار لكم:») and a **two-card carousel** (Shebara, Desert Rock, badge جزيرة / جبال, subtitle البحر الأحمر, button اختيار). Check: no `rsg:` or `#` text visible anywhere in the chat (marker hidden).
- Sessions → the pilot session → messages: one inbound visitor message, one outbound rendered template; the server log shows one inbound call.
- Press «اختيار» on Shebara: a visitor bubble «نختار Shebara.» appears, the Shebara card locks, the agent answers «اختيار موفّق…». Check in the server log: exactly **one** inbound «نختار Shebara.» with the **same session identifier** as the first message, and the state moved to villa once.
- Negative checks: (a) send a plain question («كم تبعد شباره؟», which the pilot endpoint answers as plain text): no card must render and the text must appear unchanged; (b) send the block with `image_url = ""` once and with an absolute URL once: both must render, or the `""` result answers §4.4 negatively; (c) break the block deliberately (one row instead of two) and observe the fallback: if the raw text with markers appears, §2's mitigation (block in a separate reply) becomes mandatory.
- Latency: note the time from send to card; RI adds two LLM calls on top of the backend.

Rollback: toggle the template's Enabled off, or the channel's RI off; delete the pilot channel afterwards (Hazem's approval).

## 8. What I still need from you

| Item | Why | Smallest useful thing to send |
|---|---|---|
| `custom-http-agent` contract | Build the `server.py` endpoint; know whether one turn may return several replies and whether the reply is text only | The contract page from `agent_control_plane`, or Hazem's existing custom agent as an example |
| Web transport format | Only if the RSG website keeps its own chat UI instead of the Studio widget | `docs/api-v2.md` and `specs/016-rich-components/contracts/rich-messages.md` from the chat-widget repo, or one web session export (`/api/v1/sessions/:id/messages`) |
| `""` acceptance on web | Decide whether unused required keys may be `""` | Any accepted web payload for `carousel` and `confirmation-card`, or Hazem's answer; otherwise the pilot measures it |
| Web button opening a URL | Enable `rsg-checkout` instead of the website handler | A recording or session where a Confirmation Card button («عرض الموقع على الخريطة») is clicked, or the widget doc for button behaviour |
| Public asset host | Absolute `image_url` and icon URLs for the marker rows | The origin you intend to serve `visitredsea-chat-live/assets` and `studio/icons` from |
| Reachable `server.py` | Studio must call the backend | A tunnel URL or a deployment target for the pilot |
| Widget vs website decision | Decides what happens to the calendar, forms, OTP, spotlight and PDF | One sentence: Studio widget on the page, or the RSG chat UI over Studio's transport |

## 9. Configuration order (checklist)

1. **[Your input]** Send the custom-agent contract and the pilot prerequisites (§7, §8). Decide widget vs website.
2. Application (out of this review): custom-agent endpoint in `server.py`, marker emission per §5, visitor-line → event mapping, reply splitting.
3. Run the two-resort pilot (§7) on a test channel. Record the four results and the §4.4 / fallback observations.
4. If the pilot passes: create the remaining **Ready** templates in journey order, pasting §5: `rsg-resort-suggestions`, `rsg-resort-details`, `rsg-resort-compare`, `rsg-villas`, `rsg-stay-summary`, `rsg-arrival-mode`, `rsg-airports`, `rsg-transfer-legs`, `rsg-totals`, `rsg-experiences`, `rsg-guest-path`, `rsg-review`, `rsg-trip-summary`. Each: `text` first (Required), the rich component second (Required), Enabled on, system templates off.
5. **[Your input]** `rsg-checkout` stays disabled until §4.5 is answered; the website handler opens the checkout URL meanwhile.
6. Keep in the website, untouched: calendar, guest form + microphone, OTP sign-in and verification, special-request question, resort photo links, page spotlight, terms checkbox, checkout URL opening, PDF, quick replies.
7. Full-route test with the mail sink and the protocol driver before any demo channel is touched.
