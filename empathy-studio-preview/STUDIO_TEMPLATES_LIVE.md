# Empathy Studio templates for the RSG web channel, from the live agent's real conversations

8 November 2026. Source of evidence: the Claude Managed Agent's own session event logs (12 sessions "RSG concierge …", read with `client.beta.sessions.events.list`), the live browser run on server 8102 recorded in `visitredsea-chat-live/README.md`, and the application code that attaches each component (`agent/state.py`, `js/chat.js`). The V2 mockup is used only for card appearance and labels, never as evidence of what the live agent says.

## What the live conversation actually looks like

Every turn has the same shape: guest text → one `agent.custom_tool_use` → the application applies the step and **appends the approved lead-in sentence and the component itself** → the tool result tells the agent what was shown (`"shown": …`) → the agent adds nothing or one sentence. Examples (session ids abbreviated):

| Guest (live) | Tool the agent called | Tool result (live) | What the guest saw (live browser run) |
|---|---|---|---|
| «هلا، أنا محمد» | `set_guest_name {"name":"محمد"}` | `{"ok":true,"name":"محمد","stage":"intent"}` | «حياك الله يا محمد. كيف أقدر أساعدك؟» (text only) |
| «ودي أتصفح المنتجعات عندكم على الصفحة» | `navigate_to_resorts {"target":"all"}` | `{"ok":true,"visible":["Shebara","Desert Rock"]}` | «خلني أوريك المنتجعات على الصفحة نفسها…», page scrolled, spotlight; agent: «أبشر يا محمد، عرضت لك المنتجعات على الصفحة…» |
| «وريني كل المنتجعات اللي عندكم في الصفحة» (page cards absent) | `navigate_to_resorts` → `{"error":"cards_missing"}` → `show_resort_suggestions {}` | `{"ok":true,"shown":"resort suggestions carousel","resorts":["Shebara","Desert Rock","Six Senses Southern Dunes, The Red Sea"]}` | «أقترح لكم هذه الوجهات يا خالد…» + 3-card carousel; agent: «يا خالد، بطاقات المنتجعات مو متاحة في الصفحة الحين، فعرضت لك ثلاثة اقتراحات هنا في المحادثة.» |
| «محتارة بين Shebara وDesert Rock» | `show_resort_comparison {}` | `{"ok":true,"shown":"comparison carousel, recommendation (Shebara), selection carousel"}` | «سؤال في محلّه يا سارة…» + 5 cards, the recommendation sentence, 2-card choice carousel |
| «خلاص نروح Shebara» / «طيب نكمل على شباره» | `select_resort {"resort":"Shebara"}` | `{"ok":true,"resort":"Shebara","shown":"resort details, villas carousel","stage":"villa"}` | «اختيار موفّق. هذه نبذة سريعة عن Shebara:» + card; «وهذه خيارات الفلل، وأقدر أرتب لك التفاصيل بعدها:» + 8 cards |
| «أبي فيلا شاطئية بغرفتين» | `select_villa {"villa":"Two Bedroom Beach Villa"}` | `{"ok":false,"villa":"Two Bedroom Beach Villa","note":"no confirmed price…"}` | «سعر Two Bedroom Beach Villa لهذه التواريخ أحتاج أتأكد منه…» + quick reply (text, no card) |
| «الفيلا فوق الماء بغرفة وحدة» | `select_villa {"villa":"One Bedroom Overwater Villa"}` | `{"ok":true,"villa":"One Bedroom Overwater Villa","rate":"Villa Flat Rate","total":28980,"stage":"party"}` | «اختيار جميل لإقامتكم. أتأكد منك: الإقامة لك ولزوجتك فقط؟» (text) |
| «أنا وزوجتي بس» | `set_party {"adults":2,"children":0}` | `{"ok":true,…,"shown":"calendar"}` | «تمام. متى تحبون يكون الوصول والمغادرة؟» + the RSG calendar (no Studio component) |
| calendar 23 → 25 (card event, no model call) | — | — | «توقيت جميل. هذا ملخص الإقامة:» + confirmation card; «إذا الملخص مناسب، نكمل لترتيب الوصول.» |
| «تمام؟ وش بعد؟» | none | — | agent text only (summary kept live) |
| «ممتاز، نكمل» | `approve_stay {}` | `{"ok":true,"shown":"arrival modes picker"}` | «كيف بتوصلون للبحر الأحمر؟» + 4-row picker |
| «بنجي بالطيارة» | `set_transfer_mode {"mode":"By Plane"}` | `{"ok":true,"shown":"airports picker"}` | «حدد مطار الوصول ومطار المغادرة. تفاصيل الرحلات اختيارية.» + grouped picker |
| «نوصل مطار ينبع ونطلع من مطار البحر الأحمر الدولي» | `set_airports {…}` | `{"ok":true,"arrival":"Yanbu Airport","departure":"Red Sea International Airport - RSIA","shown":"transfer legs, updated summary","grandTotal":33793.9}` | «سجّلت المطارات. هذه تنقلاتكم من المطار إلى Shebara وبالعكس:» + 2 cards; «وهذا الملخص بعد إضافة التنقلات:» + confirmation card; «إذا كل شيء واضح، نعتمد ونكمل.» |
| «كل شي واضح، اعتمد» | `approve_transfers {}` | `{"ok":true,"shown":"experiences carousel + quick reply"}` | «وهذه تجارب ممكن تستكشفونها خلال الإقامة…» + 3 cards + quick reply |
| «أبي أضيف تجربة التجديف» | `experience_interest {}` | `{"ok":false,"note":"experiences are arranged with the resort team after the booking…"}` | «بكل سرور. أقدر أرتب لكم التجارب مع فريق المنتجع بعد ما نثبّت الحجز…» + quick reply; agent sentence |
| «نقرر التجارب عند الوصول» | `defer_experiences {}` | `{"ok":true,"shown":"account choice picker"}` | «ولا يهمك. ما أضفت أي تجربة…»; «نحتاج بياناتك وبيانات زوجتك يا محمد…» + 2-row picker |
| «عندي حساب عندكم من قبل» | `choose_account_mode {"mode":"account"}` | `{"ok":true,"shown":"sign-in card (e-mail + code)"}` | «أبشر. اكتب بريدك الإلكتروني اللي سجّلت فيه…» + RSG sign-in card |
| «أول مرة أحجز، ضيفة جديدة» | `choose_account_mode {"mode":"guest"}` | `{"ok":true,"shown":"guest form"}` | «حيّاك. أدخل بياناتك وبيانات زوجتك هنا…» + RSG form |
| «إيه، نبغى تسجيل وصول متأخر لو أمكن» (after the code) | `record_special_request {"none":false,"request":"تسجيل وصول متأخر"}` | `{"ok":true,"request":"تسجيل وصول متأخر","shown":"prefilled guest form"}` | «تمام يا محمد، جهّزت لك النموذج ببياناتك المحفوظة وأضفت طلبكم…» + prefilled RSG form |
| form submitted (event) | — | — | «شكرًا لك يا محمد. راجع التفاصيل…» + review confirmation card |
| «البيانات صحيحة نكمل» (terms unticked) | `confirm_review {}` | `{"ok":false,"note":"the guest has not ticked the terms checkbox…"}` | «قبل ما نكمل، أحتاج موافقتك على الشروط…» + quick reply; agent sentence |
| «وافقت على الشروط، كمل» | `confirm_review {}` | `{"ok":true,"shown":"payment hand-off card","grandTotal":33793.9}` | «تمام. هذا رابط الدفع الآمن على موقع Visit Red Sea…» + payment card |
| return from the checkout tab (event) | — | — | «رجعت من صفحة الدفع يا محمد…»; «هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة PDF:» + confirmation card |

**Flag for the connection work:** the card content (resort facts, villa facts, amounts, dates, guest names) is in the application's data files and booking state, not in the agent's reply text. Tool results carry only a few values (`total`, `grandTotal`, `resorts`, `villa`, `arrival`, `departure`, `request`). When the backend is connected to Studio as the agent, it must add the card data to the reply after the lead-in; each template below lists exactly which data. The `rsg:` marker idea from the earlier guide is **not** something the live output contains and is not used here.

Status key: **Verified** = the lead-in, the component and its labels appeared in the live run and the component exists as a Web component in your library. Every template still depends on the backend adding the listed data to the reply.

---

### Template 1 — `rsg-resort-suggestions`

Template name: RSG resort suggestions
Conversation step: the guest wants suggestions (intent step), or the page hand-off failed and the agent fell back to in-chat suggestions.
Components to add, in order: Text (`text`), Carousel (`carousel`)

WHEN TO SELECT — paste this:
```
Select when the reply begins with the application sentence "أقترح لكم هذه الوجهات يا <name>. أيها أقرب لجوّكم؟ وإذا تحب تتصفح أكثر، فرابط «استكشف المزيد» تحت الاقتراحات." followed by the resort data the application attaches (three resorts). This is the first discovery step, or the fallback after the page could not show its resort cards.
Do NOT select the comparison reply ("سؤال في محلّه…"), the details reply ("اختيار موفّق…" / "خيار جميل…"), the page hand-off reply ("خلني أوريك المنتجعات على الصفحة نفسها…", which has no card), or any plain answer to a question.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = the sentence "أقترح لكم هذه الوجهات يا <name>. أيها أقرب لجوّكم؟ وإذا تحب تتصفح أكثر، فرابط «استكشف المزيد» تحت الاقتراحات." exactly as it appears in the reply, plus any following sentence the agent added in its own words (for example "يا خالد، بطاقات المنتجعات مو متاحة في الصفحة الحين، فعرضت لك ثلاثة اقتراحات هنا في المحادثة."). Remove the resort data lines. Never reword.
```

Component 2 — Carousel (`carousel`)
Instructions — paste this:
```
Build one card per resort in the data the application attached, in this order: Shebara, Desert Rock, Six Senses Southern Dunes, The Red Sea. For each card:
  main_title = the official English resort name (max 60).
  badge_title = the resort's setting in Arabic (جزيرة / جبال / صحراء, max 15). badge_position = "top-left".
  subtitle = "البحر الأحمر".
  description = the resort's one-line Arabic profile, a blank line, then three markdown bullets "- **الموقع:** <location>", "- **الإقامة:** <accommodation>", "- **أبرز المرافق:** <highlights>". Copy the supplied text verbatim; never add prices, availability, ratings or distances.
  image_url = the resort image URL supplied by the application; never invent one.
  primary_button_label = "اختيار". primary_button_payload = "نختار <English resort name>." (for example "نختار Shebara.").
  secondary_button_label, secondary_button_payload, tertiary_button_label, tertiary_button_payload = "". lock_after_selection = true.
```

Data Studio will need from the application (not in the live reply today): per resort the English name, `settingAr`, `aboutAr`, `locationAr`, `stayAr`, `highlightsAr`, image URL (`data/resorts.js`).
Live evidence: sessions ed4c002f, 66f8a930, d556e189: `show_resort_suggestions` → `"shown": "resort suggestions carousel", "resorts": [Shebara, Desert Rock, Six Senses Southern Dunes, The Red Sea]`; the carousel with «اختيار» rendered in the browser (test-double route, same application code). Card payload labels: `js/chat.js` `C.resortPick`.

---

### Template 2 — `rsg-resort-details`

Template name: RSG resort details
Conversation step: a resort was chosen (card, page button or typed name).
Components to add, in order: Text (`text`), Carousel (`carousel`) as a single card

WHEN TO SELECT — paste this:
```
Select when the reply begins with "اختيار موفّق. هذه نبذة سريعة عن <resort>:" (Shebara chosen) or "خيار جميل. هذه نبذة عن <resort>:" (another resort chosen), followed by that one resort's data. One card only.
Do NOT select the villas reply ("وهذه خيارات الفلل…"), the suggestions reply ("أقترح لكم هذه الوجهات…"), or a plain answer about a resort.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = the lead-in sentence exactly ("اختيار موفّق. هذه نبذة سريعة عن Shebara:" or "خيار جميل. هذه نبذة عن <resort>:"), plus the agent's own following sentence if there is one. Remove the data lines.
```

Component 2 — Carousel (`carousel`)
Instructions — paste this:
```
Build exactly one card for the resort in the attached data. main_title = English resort name (max 60). badge_title = Arabic setting (max 15). badge_position = "top-left". subtitle = "البحر الأحمر". description = the Arabic profile line, a blank line, then "- **الموقع:** …", "- **الإقامة:** …", "- **أبرز المرافق:** …" copied verbatim. image_url = the supplied image URL. All six button keys = "". lock_after_selection = true. Never add prices or availability.
```

Data Studio will need: the chosen resort's record (same fields as template 1).
Live evidence: sessions 8cc35a10, ac7a1d19, 685135c7: `select_resort {"resort":"Shebara"}` → `"shown": "resort details, villas carousel"`; browser run 8102: «اختيار موفّق. هذه نبذة سريعة عن Shebara:» + card after «اختر» on the page. The "خيار جميل…" variant is the application's reply for a non-Shebara choice (`agent/state.py choose_resort`, `data/script.js resort.other`), exercised through the card event in the protocol driver against the live server.

---

### Template 3 — `rsg-resort-compare`

Template name: RSG resort comparison (informational)
Conversation step: guest undecided between Shebara and Desert Rock; first of three replies in that turn.
Components to add, in order: Text (`text`), Carousel (`carousel`), no buttons

WHEN TO SELECT — paste this:
```
Select when the reply begins with "سؤال في محلّه يا <name>. هذه أهم الفروق بين المنتجعين، معيارًا بمعيار:" followed by the five comparison criteria the application attaches. Informational cards only.
Do NOT select the recommendation sentence that follows it ("بما إنك تخطط لإجازة مع زوجتك، أرشّح لك Shebara…", plain text), do NOT select the two-card choice that comes after the recommendation, and do NOT select a plain answer about one difference (for example the live answer "يا هلا سارة. Shebara جزيرة على بعد 25 كم من البر…", which has no cards).
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "سؤال في محلّه يا <name>. هذه أهم الفروق بين المنتجعين، معيارًا بمعيار:" exactly as in the reply. Remove the criteria data. Nothing else.
```

Component 2 — Carousel (`carousel`)
Instructions — paste this:
```
Build one card per criterion in the attached data, five cards in this order: المكان والطبيعة, العمارة وتجربة الإقامة, الإطلالة والأجواء, تجارب مميزة, يناسب من؟. For card i:
  main_title = the criterion title (max 60). subtitle = the criterion question (max 30, e.g. "بحر أم جبال؟"). badge_title = "<i> من 5". badge_position = "top-left". image_url = "".
  description = "- **Shebara:** <Shebara fact>" newline "- **Desert Rock:** <Desert Rock fact>"; when the criterion has a difference line, add a blank line and "**<label>:** <difference>" (labels are الفرق or مشترك; the fifth criterion has none). Copy every fact verbatim; never add facts, prices or judgements.
  All six button keys = "". lock_after_selection = true.
```

Data Studio will need: `RESORT_COMPARE` (5 rows: title, question, shebara, desertRock, diffLabel, diff) from `data/resorts.js`.
Live evidence: sessions ac7a1d19 («محتارة بين Shebara وDesert Rock») and 685135c7 («صراحة محتارة بين Shebara وDesert Rock، وش ترشحين لي؟»): `show_resort_comparison` → `"shown": "comparison carousel, recommendation (Shebara), selection carousel"`. Follow-up «وش الفرق في الوصول لكل واحد؟» was answered in text with no tool (685135c7). Card appearance: `js/chat.js` `C.compare`.

---

### Between templates 3 and 4: the recommendation (no template)

The second reply of the comparison turn is the approved sentence «بما إنك تخطط لإجازة مع زوجتك، أرشّح لك Shebara: جزيرة يحيط بها البحر، فيها فلل بمسبح خاص فوق الماء وعلى الشاطئ، والشعاب قريبة من الشاطئ، وأجواؤها تناسب الاسترخاء. ويتميّز Desert Rock بطابع جبلي ومغامرات لمن يحب ذلك في رحلة أخرى. والقرار لكم:». It must reach Studio as its own reply and match no template, so Studio sends it as text. Keep every WHEN TO SELECT conditioned on its lead-in so none can match this sentence.

---

### Template 4 — `rsg-resort-choice`

Template name: RSG resort choice (Shebara / Desert Rock)
Conversation step: third reply of the comparison turn.
Components to add, in order: Text (`text`), Carousel (`carousel`) with one button per card

WHEN TO SELECT — paste this:
```
Select when the reply is the two-resort choice that follows the recommendation sentence in the comparison turn: it carries exactly two resorts (Shebara, Desert Rock) and no lead-in sentence of its own, or the short lead-in "والقرار لكم:".
Do NOT select the five-criterion comparison, the three-resort suggestions, or any reply without resort data.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "والقرار لكم:" when the reply has no sentence of its own; otherwise the reply's sentence verbatim without the data lines.
```

Component 2 — Carousel (`carousel`)
Instructions — paste this:
```
Build two cards, Shebara first then Desert Rock. main_title = English name (max 60). badge_title = Arabic setting (جزيرة / جبال). badge_position = "top-left". subtitle = "البحر الأحمر". description = the resort's Arabic profile line verbatim. image_url = the supplied image URL.
primary_button_label = "اختيار". primary_button_payload = "نختار <English name>." ("نختار Shebara." / "نختار Desert Rock.").
secondary_button_label, secondary_button_payload, tertiary_button_label, tertiary_button_payload = "". lock_after_selection = true.
```

Data Studio will need: the two resort records (name, `settingAr`, `aboutAr`, image).
Live evidence: same sessions as template 3 (`"shown": "… selection carousel"`); the choice → `select_resort {"resort":"Shebara"}` → details + villas (ac7a1d19, 685135c7). Labels: `js/chat.js` `C.comparePick`.

---

### Template 5 — `rsg-villas`

Template name: RSG Shebara villas
Conversation step: second reply after Shebara is chosen.
Components to add, in order: Text (`text`), Carousel (`carousel`)

WHEN TO SELECT — paste this:
```
Select when the reply begins with "وهذه خيارات الفلل، وأقدر أرتب لك التفاصيل بعدها:" followed by the eight villa records the application attaches.
Do NOT select the unpriced-villa reply ("سعر <villa> لهذه التواريخ أحتاج أتأكد منه قبل ما أعطيك رقم…", text and a quick reply, no cards), the party question ("اختيار جميل لإقامتكم. أتأكد منك…"), or the details reply.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "وهذه خيارات الفلل، وأقدر أرتب لك التفاصيل بعدها:" exactly, plus the agent's own following sentence if present (for example "تمام يا محمد، اخترت Shebara. شوف الفلل المعروضة وقل لي أيها تناسبك."). Remove the villa data.
```

Component 2 — Carousel (`carousel`)
Instructions — paste this:
```
Build one card per villa in the attached data, eight cards, in the supplied order (One Bedroom Overwater Villa first).
  main_title = the Arabic villa name (e.g. فيلا فوق الماء بغرفة نوم واحدة, max 60). badge_position = "top-right".
  badge_title = "Villa Flat Rate" only on One Bedroom Overwater Villa, "" on every other card.
  subtitle = "SAR 28,980.00" only on One Bedroom Overwater Villa, "" on every other card. Never write a price for any other villa.
  description = "**<Arabic occupancy>**", blank line, one markdown bullet per fact (bedrooms, beds, view, area, pool), and on One Bedroom Overwater Villa a blank line then "ليلتان · شخصان بالغان · 23 - 25 أكتوبر 2026 · شامل جميع الضرائب".
  image_url = the supplied villa image URL. primary_button_label = "اختيار". primary_button_payload = "أختار <English villa name> على Villa Flat Rate.".
  secondary_button_label, secondary_button_payload, tertiary_button_label, tertiary_button_payload = "". lock_after_selection = true.
```

Data Studio will need: `data/villas.js` (English and Arabic names, `occupancyAr`, `factsAr`, image) and `BOOKING.rate` (`total` 28980.00, `basisAr`, `taxNoteAr`).
Live evidence: sessions 8cc35a10, 685135c7, ac7a1d19: after `select_resort` the result says `"shown": "resort details, villas carousel"`; `select_villa {"villa":"One Bedroom Overwater Villa"}` → `{"ok":true,"rate":"Villa Flat Rate","total":28980}`; `select_villa {"villa":"Two Bedroom Beach Villa"}` → `{"ok":false,"note":"no confirmed price for this villa…"}` (1543d48c). Labels: `js/chat.js` `C.villas`.

---

### Template 6 — `rsg-stay-summary`

Template name: RSG stay summary
Conversation step: the quoted dates were confirmed (calendar event).
Components to add, in order: Text (`text`), Confirmation Card (`confirmation-card`)

WHEN TO SELECT — paste this:
```
Select when the reply begins with "توقيت جميل. هذا ملخص الإقامة:" followed by the stay data. The sentence "إذا الملخص مناسب، نكمل لترتيب الوصول." is a separate plain reply that follows and must not be selected.
Do NOT select the totals-with-transfers reply ("وهذا الملخص بعد إضافة التنقلات:"), the other-dates reply ("للتواريخ من … إلى … أحتاج تحديث السعر…", no card), or a question asked while the summary is on screen (the live agent answered "تمام؟ وش بعد؟" in text).
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "توقيت جميل. هذا ملخص الإقامة:" exactly. Remove the data lines. Nothing else.
```

Component 2 — Confirmation Card (`confirmation-card`)
Instructions — paste this:
```
image_url = the Shebara hero image URL supplied by the application. badge_text = "ملخص الإقامة". main_title = "Shebara". subtitle = "فيلا فوق الماء بغرفة نوم واحدة · Villa Flat Rate".
primary_card_title = "التواريخ". primary_card_subtitle = the supplied Arabic date range and nights, e.g. "الجمعة 23 أكتوبر 2026 – الأحد 25 أكتوبر 2026 · ليلتان" (max 150). primary_card_icon = the supplied calendar icon URL.
secondary_card_title = "الضيوف". secondary_card_subtitle = "2 بالغين". secondary_card_icon = the supplied users icon URL.
tertiary_card_title = "إجمالي الإقامة". tertiary_card_subtitle = "SAR 28,980.00 · شامل جميع الضرائب". tertiary_card_icon = the supplied credit-card icon URL.
instructions = "عدد الغرف يكفي مجموعتكم، ويمكنكم إضافة المزيد عند الحاجة.".
primary_button_label = "مناسب، نكمل". primary_button_payload = "مناسب، نكمل". primary_button_icon = "check". secondary_button_label, secondary_button_payload, secondary_button_icon = "". Never compute, round or alter an amount or a date.
```

Data Studio will need: check-in/check-out labels and nights from the booking state, `BOOKING.rate.total`, `occupancyNoteAr`, image and icon URLs (`assets/site/resorts-hero-shebara.webp`, `studio/icons/calendar.svg`, `users.svg`, `credit-card.svg`).
Live evidence: browser run 8102: calendar 23 → 25 → «توقيت جميل. هذا ملخص الإقامة:» + card + «إذا الملخص مناسب، نكمل لترتيب الوصول.»; «تمام؟ وش بعد؟» → agent text, card kept live; «ممتاز، نكمل» → `approve_stay` (session 1543d48c). Labels: `js/chat.js` `summary()`.

---

### Template 7 — `rsg-arrival-mode`

Template name: RSG arrival mode
Conversation step: after the stay summary is approved.
Components to add, in order: Text (`text`), Selection List Picker (`selection-list-picker`)

WHEN TO SELECT — paste this:
```
Select when the reply begins with "كيف بتوصلون للبحر الأحمر؟" and offers the four arrival modes.
Do NOT select the other-mode reply ("هذه الرحلة مُعدّة للوصول بالطائرة، مع تنقلات خاصة من المطار إلى Shebara وبالعكس. نكمل عليها؟", text and a quick reply) or the airports reply.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "كيف بتوصلون للبحر الأحمر؟" exactly. Nothing else.
```

Component 2 — Selection List Picker (`selection-list-picker`)
Instructions — paste this:
```
main_title = "كيف بتوصلون للبحر الأحمر؟". lock_after_selection = true. items, in this order:
  {title: "بالطائرة", icon: "plane", payload: "بالطائرة.", subtitle: "", badge: ""}
  {title: "بطائرة خاصة", icon: "plane-takeoff", payload: "بطائرة خاصة.", subtitle: "", badge: ""}
  {title: "بالسيارة", icon: "car", payload: "بالسيارة.", subtitle: "", badge: ""}
  {title: "باليخت", icon: "ship", payload: "باليخت.", subtitle: "", badge: ""}
```

Data Studio will need: none beyond the constants above (`BOOKING.transport.modes`, `S.words.modes`).
Live evidence: session 1543d48c: `approve_stay` → `"shown": "arrival modes picker"`; «بنجي بالطيارة» → `set_transfer_mode {"mode":"By Plane"}` → `"shown": "airports picker"`. Browser run: the picker rendered and the first row was selected. Labels: `js/chat.js` `C.modes`.

---

### Template 8 — `rsg-airports`

Template name: RSG airports
Conversation step: after the plane is chosen.
Components to add, in order: Text (`text`), Sectioned Multi-Select (`grouped-list-picker`)

WHEN TO SELECT — paste this:
```
Select when the reply begins with "حدد مطار الوصول ومطار المغادرة. تفاصيل الرحلات اختيارية." and offers the two airport groups.
Do NOT select the incomplete-selection reply ("اختر مطار الوصول ومطار المغادرة في النموذج ثم اعتمدها."), the other-airports reply ("لهذه المطارات أحتاج تحديث خيارات التنقل وأسعارها قبل المتابعة…"), or the transfer-legs reply ("سجّلت المطارات…").
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "حدد مطار الوصول ومطار المغادرة. تفاصيل الرحلات اختيارية." exactly. Nothing else.
```

Component 2 — Sectioned Multi-Select (`grouped-list-picker`)
Instructions — paste this:
```
main_title = "مطار الوصول ومطار المغادرة". send_button_label = "اعتماد المطارات". lock_after_selection = true. is_multiple_selection = true.
groups = [
  {title: "مطار الوصول", options: ["مطار البحر الأحمر الدولي – RSIA", "مطار ينبع", "مطار الوجه المحلي"]},
  {title: "مطار المغادرة", options: ["مطار البحر الأحمر الدولي – RSIA", "مطار ينبع", "مطار الوجه المحلي"]}
]
```

Data Studio will need: none beyond the constants (`BOOKING.transport.airports`, `airportsAr`).
Live evidence: session 1543d48c: `set_transfer_mode` → `"shown": "airports picker"`; typed «نوصل مطار ينبع ونطلع من مطار البحر الأحمر الدولي» → `set_airports {"arrival":"Yanbu Airport","departure":"Red Sea International Airport - RSIA"}` → `"shown": "transfer legs, updated summary"`. Browser run: chips مطار ينبع + مطار البحر الأحمر الدولي – RSIA → «اعتماد المطارات» → legs. Labels: `js/chat.js` `C.airports`. Note: the picker's message to the application is "مطار الوصول: X, مطار المغادرة: Y"; the application checks one option per group.

---

### Template 9 — `rsg-transfer-legs`

Template name: RSG transfer legs
Conversation step: airports confirmed; first of the two replies.
Components to add, in order: Text (`text`), Carousel (`carousel`), no buttons

WHEN TO SELECT — paste this:
```
Select when the reply begins with "سجّلت المطارات. هذه تنقلاتكم من المطار إلى Shebara وبالعكس:" followed by the two transfer legs the application attaches.
Do NOT select the totals reply that follows ("وهذا الملخص بعد إضافة التنقلات:") or a plain answer about transfers.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "سجّلت المطارات. هذه تنقلاتكم من المطار إلى Shebara وبالعكس:" exactly. Remove the data lines.
```

Component 2 — Carousel (`carousel`)
Instructions — paste this:
```
Two cards from the attached legs.
Card 1: badge_title = "الوصول", main_title = "سيارة فاخرة خاصة + قارب ترفيهي مشترك", subtitle = "SAR 3,622.50", description = "**Yanbu Airport → Shebara**", blank line, bullets "4 ساعات", "سعة السيارة الفاخرة الخاصة: حتى 3 ضيوف", "سعة القارب الترفيهي المشترك: حتى 18 ضيفًا", "المطلوب: سيارة فاخرة خاصة واحدة وقارب ترفيهي مشترك واحد", blank line, "السعر الإجمالي (شامل جميع الضرائب) | شخصان بالغان". image_url = the supplied image URL for the arrival leg.
Card 2: badge_title = "المغادرة", main_title = "قارب سريع مشترك + سيارة فاخرة خاصة", subtitle = "SAR 1,191.40", description = "**Shebara → Red Sea International Airport - RSIA**", blank line, "السعر الإجمالي (شامل جميع الضرائب) | شخصان بالغان". image_url = the supplied image URL for the departure leg.
badge_position = "top-left" on both. All six button keys = "". lock_after_selection = true. Amounts exactly as supplied, never recomputed.
```

Data Studio will need: `BOOKING.transport.legs` (productAr, price, from/to, durationAr, capacityAr, neededAr, priceBasisAr, image).
Live evidence: session 1543d48c `set_airports` result `"shown": "transfer legs, updated summary", "grandTotal": 33793.9`; browser run: «سجّلت المطارات…» + two cards. Labels: `js/chat.js` `C.transportTrip`.

---

### Template 10 — `rsg-totals`

Template name: RSG totals with transfers
Conversation step: airports confirmed; second reply.
Components to add, in order: Text (`text`), Confirmation Card (`confirmation-card`)

WHEN TO SELECT — paste this:
```
Select when the reply begins with "وهذا الملخص بعد إضافة التنقلات:" followed by the stay, transfers and total amounts. The sentence "إذا كل شيء واضح، نعتمد ونكمل." that follows is a separate plain reply.
Do NOT select the stay summary ("توقيت جميل. هذا ملخص الإقامة:"), the review, or a plain answer about the price.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "وهذا الملخص بعد إضافة التنقلات:" exactly. Remove the data lines.
```

Component 2 — Confirmation Card (`confirmation-card`)
Instructions — paste this:
```
image_url = the Shebara hero image URL supplied. badge_text = "الملخص المحدّث". main_title = "Shebara". subtitle = "فيلا فوق الماء بغرفة نوم واحدة · <Arabic date range> · ليلتان · 2 بالغين" using the supplied dates.
primary_card_title = "الإقامة", primary_card_subtitle = "SAR 28,980.00", primary_card_icon = the supplied bed icon URL.
secondary_card_title = "التنقلات", secondary_card_subtitle = "SAR 4,813.90", secondary_card_icon = the supplied plane icon URL.
tertiary_card_title = "الإجمالي", tertiary_card_subtitle = "SAR 33,793.90 · شامل جميع الضرائب", tertiary_card_icon = the supplied credit-card icon URL.
instructions = "الإقامة والتنقلات · 2 بالغين · شامل جميع الضرائب". primary_button_label = "اعتمد ونكمل". primary_button_payload = "اعتمد ونكمل". primary_button_icon = "check". secondary_button_label, secondary_button_payload, secondary_button_icon = "". Never compute or alter an amount.
```

Data Studio will need: `BOOKING.rate.total`, `transport.transfersTotal`, `grandTotal` (33,793.90 also appears in the live tool result), the date labels, image and icon URLs.
Live evidence: session 1543d48c: `"grandTotal": 33793.9` in the `set_airports` result; «كل شي واضح، اعتمد» → `approve_transfers` → `"shown": "experiences carousel + quick reply"`. Browser run: «وهذا الملخص بعد إضافة التنقلات:» + card. Labels: `js/chat.js` `summary(st, true)`.

---

### Template 11 — `rsg-experiences`

Template name: RSG experiences
Conversation step: totals approved.
Components to add, in order: Text (`text`), Carousel (`carousel`), no buttons

WHEN TO SELECT — paste this:
```
Select when the reply begins with "وهذه تجارب ممكن تستكشفونها خلال الإقامة. تقدرون تقررون الآن أو عند الوصول:" followed by the three experiences. The cards have no buttons; the decision is taken in words or with the website's quick reply "نختار عند الوصول".
Do NOT select the add-experience reply ("بكل سرور. أقدر أرتب لكم التجارب مع فريق المنتجع بعد ما نثبّت الحجز. نكمل الحجز الآن ونرجع للتجارب؟", text and a quick reply) or the guest-path reply.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "وهذه تجارب ممكن تستكشفونها خلال الإقامة. تقدرون تقررون الآن أو عند الوصول:" exactly. Remove the data lines.
```

Component 2 — Carousel (`carousel`)
Instructions — paste this:
```
Three cards from the attached experiences, in order:
  1. main_title "Adrena", badge_title "أدرينا", subtitle "ابتداءً من SAR 500.00 للشخص", description "- منطقة المغامرات".
  2. main_title "استكشاف الحديقة وتجربة الزراعة", badge_title "الطبيعة", subtitle "ابتداءً من SAR 184.58 للشخص", description bullets "ساعة إلى ساعتين", "للمبتدئين", "نشاط فردي أو جماعي".
  3. main_title "التجديف باللوح واقفًا", badge_title "رياضات مائية", subtitle "SAR 200.00" (the price line is longer than 30 characters, so the subtitle is its first clause), description bullets "ساعة واحدة", "العمر: 8+", "للمبتدئين", blank line, then the full price line "SAR 200.00، شخص بالغ واحد، ساعة واحدة، شامل جميع الضرائب".
badge_position = "bottom-left". image_url = the supplied image URL per experience. All six button keys = "". lock_after_selection = true. Never change a price.
```

Data Studio will need: `BOOKING.activities` (nameAr, categoryAr, priceAr, tagsAr, image).
Live evidence: session 1543d48c: `approve_transfers` → `"shown": "experiences carousel + quick reply"`; «نقرر التجارب عند الوصول» → `defer_experiences`; session 685135c7: «أبي أضيف تجربة التجديف» → `experience_interest` → `{"ok":false,"note":"experiences are arranged with the resort team after the booking…"}` and the agent's sentence quoting SAR 200.00. Labels: `js/chat.js` `C.activities`.

---

### Template 12 — `rsg-guest-path`

Template name: RSG guest path (returning / new)
Conversation step: experiences deferred.
Components to add, in order: Text (`text`), Selection List Picker (`selection-list-picker`)

WHEN TO SELECT — paste this:
```
Select when the reply contains "نحتاج بياناتك وبيانات زوجتك يا <name> عشان نكمل الحجز. إذا سبق وسجّلت معنا، تقدر تدخل ببريدك الإلكتروني ونسترجع بياناتك المحفوظة، أو تكمل كضيف جديد." (usually preceded by "ولا يهمك. ما أضفت أي تجربة، والإجمالي كما هو…").
Do NOT select the sign-in reply ("أبشر. اكتب بريدك الإلكتروني اللي سجّلت فيه…"), the new-guest reply ("حيّاك. أدخل بياناتك وبيانات زوجتك هنا…"), the special-request question ("أهلًا بعودتك، تم التحقق من بريدك…"), or the prefilled-form reply ("تمام يا <name>، جهّزت لك النموذج…"): those steps use website components.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = the reply's sentences verbatim ("ولا يهمك. ما أضفت أي تجربة، والإجمالي كما هو. فريق المنتجع يساعدكم تختارون ما يناسبكم عند الوصول، حسب التوفر." then "نحتاج بياناتك وبيانات زوجتك يا <name> عشان نكمل الحجز. إذا سبق وسجّلت معنا، تقدر تدخل ببريدك الإلكتروني ونسترجع بياناتك المحفوظة، أو تكمل كضيف جديد."). Nothing else.
```

Component 2 — Selection List Picker (`selection-list-picker`)
Instructions — paste this:
```
main_title = "كيف تحب نكمل؟". lock_after_selection = true. items:
  {title: "لدي حساب سابق", subtitle: "الدخول ببريدك الإلكتروني واسترجاع بياناتك المحفوظة", icon: "lock", badge: "", payload: "لدي حساب سابق"}
  {title: "متابعة كضيف جديد", subtitle: "إدخال بياناتك وبيانات زوجتك للحجز", icon: "user", badge: "", payload: "متابعة كضيف جديد"}
```

Data Studio will need: none beyond the constants.
Live evidence: session 1543d48c: `defer_experiences` → `"shown": "account choice picker"`; «عندي حساب عندكم من قبل» → `choose_account_mode {"mode":"account"}` → `"shown": "sign-in card (e-mail + code)"`; sessions ac7a1d19 and 685135c7: «أول مرة أحجز، ضيفة جديدة» → `{"mode":"guest"}` → `"shown": "guest form"`. Labels: `js/chat.js` `C.accountChoice`.

---

### Template 13 — `rsg-review`

Template name: RSG final review
Conversation step: guest form submitted or edited (card/form event, no model call).
Components to add, in order: Text (`text`), Confirmation Card (`confirmation-card`)

WHEN TO SELECT — paste this:
```
Select when the reply begins with "شكرًا لك يا <name>. راجع التفاصيل، وتقدر تعدّل بياناتكم من هنا. إذا كل شيء صحيح، أكّد الموافقة على الشروط ونكمل للتحقق من البريد." or with "حُفظت التعديلات يا <name>. هذه المراجعة بعد التعديل، وإذا كل شيء صحيح أكّد الموافقة على الشروط ونكمل." followed by the review data.
Do NOT select the terms reminder ("قبل ما نكمل، أحتاج موافقتك على الشروط والأحكام وسياسة الخصوصية من المربع في المراجعة.", text and a quick reply), the payment reply ("تمام. هذا رابط الدفع الآمن…"), or the trip summary.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = the lead-in sentence exactly as in the reply. Remove the data lines. Nothing else.
```

Component 2 — Confirmation Card (`confirmation-card`)
Instructions — paste this:
```
image_url = the supplied villa exterior image URL. badge_text = "مراجعة رحلتك". main_title = "Shebara". subtitle = "فيلا فوق الماء بغرفة نوم واحدة · Villa Flat Rate · <Arabic date range> · ليلتان · 2 بالغين · Yanbu Airport → Red Sea International Airport - RSIA".
primary_card_title = "الضيوف", primary_card_subtitle = "<title> <first name> <family name> · <second guest full name>" from the supplied form data (max 150), primary_card_icon = the supplied users icon URL.
secondary_card_title = "التنقلات", secondary_card_subtitle = "الوصول: سيارة فاخرة خاصة + قارب ترفيهي مشترك" newline "المغادرة: قارب سريع مشترك + سيارة فاخرة خاصة", secondary_card_icon = the supplied plane icon URL.
tertiary_card_title = "التواصل", tertiary_card_subtitle = the supplied e-mail, newline, the supplied country code and mobile, tertiary_card_icon = the supplied mail icon URL.
instructions = "الإجمالي SAR 33,793.90 · شامل جميع الضرائب · الإقامة SAR 28,980.00 + التنقلات SAR 4,813.90 · لا تجارب مضافة"; when a special request was supplied and the line stays within 150 characters, append " · <request> (حسب التوفر)". Never invent a request.
primary_button_label = "البيانات صحيحة، نكمل". primary_button_payload = "البيانات صحيحة، نكمل". primary_button_icon = "check". secondary_button_label = "تعديل البيانات". secondary_button_payload = "تعديل البيانات". secondary_button_icon = "user".
```

Data Studio will need: the submitted guest form (title, names, second guest, e-mail, mobile, request) from the booking state, the amounts, dates, airports, image and icon URLs. Two controls stay in the website: the terms checkbox under the card (the live agent's `confirm_review` returned `"the guest has not ticked the terms checkbox"` until it was ticked) and the «تعديل البيانات» action, which opens the website's form.
Live evidence: browser run 8102: form → «شكرًا لك يا محمد. راجع التفاصيل…» + card with «تسجيل وصول متأخر» in the instructions line; session 1543d48c: `record_special_request {"request":"تسجيل وصول متأخر"}` → prefilled form; `confirm_review` → `{"ok":false,"note":"the guest has not ticked the terms checkbox…"}` then `{"ok":true,"shown":"payment hand-off card","grandTotal":33793.9}`. Labels: `js/chat.js` `C.review`.

---

### Template 14 — `rsg-trip-summary`

Template name: RSG trip summary and PDF
Conversation step: the guest came back from the official checkout tab (application event).
Components to add, in order: Text (`text`), Confirmation Card (`confirmation-card`)

WHEN TO SELECT — paste this:
```
Select when the reply begins with "هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة PDF:" followed by the trip data. The previous reply "رجعت من صفحة الدفع يا <name>. هذه النسخة التجريبية ما تستلم نتيجة الدفع من Visit Red Sea، فما أقدر أؤكد حالة الدفع من هنا؛ تأكيد الحجز يصلك من الموقع مباشرة." and the closing "نتمنى لك ول<second guest> إقامة هادئة في Shebara…" are plain replies and must not be selected.
Do NOT select the payment reply ("تمام. هذا رابط الدفع الآمن…") and never let the badge or titles say the booking or payment is confirmed.
```

Component 1 — Text (`text`)
Instructions — paste this:
```
text = "هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة PDF:" exactly. Remove the data lines.
```

Component 2 — Confirmation Card (`confirmation-card`)
Instructions — paste this:
```
image_url = the supplied Shebara image URL. badge_text = "رحلتك بانتظارك". main_title = "Shebara". subtitle = "فيلا فوق الماء بغرفة نوم واحدة · Villa Flat Rate · <Arabic date range> · ليلتان · Yanbu Airport → Red Sea International Airport - RSIA".
primary_card_title = "الضيوف", primary_card_subtitle = "<guest full name> و<second guest full name> · 2 بالغين", primary_card_icon = the supplied users icon URL.
secondary_card_title = "التنقلات", secondary_card_subtitle = "الوصول: سيارة فاخرة خاصة + قارب ترفيهي مشترك" newline "المغادرة: قارب سريع مشترك + سيارة فاخرة خاصة", secondary_card_icon = the supplied plane icon URL.
tertiary_card_title = "التواصل", tertiary_card_subtitle = e-mail, newline, country code and mobile, tertiary_card_icon = the supplied mail icon URL.
instructions = "الإجمالي SAR 33,793.90 · شامل جميع الضرائب · لا تجارب مضافة", plus " · <request> (حسب التوفر)" when a request was supplied and the line stays within 150 characters.
primary_button_label = "تحميل PDF". primary_button_payload = "تحميل PDF". primary_button_icon = "download". secondary_button_label, secondary_button_payload, secondary_button_icon = "". The badge and titles must not say the booking or payment is confirmed.
```

Data Studio will need: same as the review plus the PDF behaviour: today «تحميل PDF» builds the file in the browser (`js/pdf.js`); a Studio button only posts the text «تحميل PDF», so the application must answer that message with a hosted download (not built yet).
Live evidence: browser run 8102: payment click opened the official checkout URL; return → «رجعت من صفحة الدفع يا محمد…», «هذا ملخص رحلتك كما رتبناها…» + card with the request, «نتمنى لك ولنورة إقامة هادئة في Shebara…»; PDF built (235 KB). Labels: `js/chat.js` `C.confirmation`.

---

## Revision of 9 November 2026: what the bridge actually sends, and the template changes it needs (prepared, not applied in Studio)

Source: `visitredsea-chat-live/agent/studio_bridge.py` (the Custom Agent endpoint Studio will call). Two facts change the templates above:

1. **One reply per guest message.** Studio's Custom Agent contract returns a single `reply` string, so the application's multi-bubble turns arrive together: Shebara chosen = details **and** villas in one reply; the comparison turn = comparison, recommendation **and** choice in one reply; airports = legs **and** totals in one reply. A WHEN TO SELECT that keys on "the reply begins with…" selects only the first template of such a turn and the second component never renders. Templates 2+5, 3+4 and 9+10 must each become one template with four components (Text, Carousel, Text, Carousel or Confirmation Card). Whether the canvas accepts two carousels in one template is not verified; if it refuses, the fallback is one carousel with the details card first followed by the eight villas (2+5) and one carousel with the five criteria followed by the two choice cards (3+4), with the second text folded into the first.
2. **Data arrives as labelled blocks under the lead-in.** Every block is `[cards: <key>]`, `[card: <key>]` or `[picker: <key>]` followed by `key = value` lines, one record per blank-line-separated group; a card button is `button = <label> -> <payload>`; confirmation cards carry `icons = dates: <url> | guests: <url> | total: <url>` (the same SVGs the website uses). Keys emitted: `resort_suggestions`, `resort_details`, `resort_compare`, `resort_choice`, `villas`, `stay_summary`, `totals`, `arrival_modes`, `airports`, `transfer_legs`, `experiences`, `guest_path`, `review`, `checkout`, `trip_summary`. The older `rsg:` / `#1 ::` format from the configuration guide is **not** emitted. Website-only steps (calendar, sign-in, guest form, e-mail code, edit, PDF) arrive as plain Arabic sentences with no block, so no template should match them.

Apply these edits to the texts above when pasting into Studio:

**All templates, Text component.** Replace each Text instruction with:
```
text = every plain sentence of the reply, in order, exactly as written (the application's lead-in, any sentence the agent added, and any "تقدر ترد بـ: …" hint). Remove every line that belongs to a data block: the "[cards: …]", "[card: …]" or "[picker: …]" label and the "key = value" lines under it. Never reword, translate or add.
```
Where a merged template has two Text components, the first takes the sentences before the second block's label and the second takes the sentences between the two blocks (for the comparison turn: the recommendation sentence «بما إنك تخطط لإجازة مع زوجتك، أرشّح لك Shebara…»).

**All templates, WHEN TO SELECT.** Add the block label to the condition so a plain reply can never match, for example "…followed by the block `[cards: resort_suggestions]`". Replace every "is a separate plain reply that follows" with "is in the same reply and belongs to the Text component".

**Template 2+5 → one template `rsg-resort-details-villas`** (Text, Carousel, Text, Carousel):
```
WHEN TO SELECT: Select when the reply contains the block "[card: resort_details]" (lead-in "اختيار موفّق. هذه نبذة سريعة عن <resort>:" or "خيار جميل. هذه نبذة عن <resort>:"). When the reply also contains "[cards: villas]" (Shebara chosen), fill all four components; when it does not (another resort), fill the first Text and the first Carousel only and leave the second Text and Carousel empty.
Do NOT select the suggestions reply ("[cards: resort_suggestions]"), the comparison reply ("[cards: resort_compare]") or a plain answer about a resort.
```
Carousel 1 = template 2's Carousel instruction (one card from the `name`, `setting`, `profile`, `location`, `accommodation`, `highlights`, `image` lines; no buttons). Carousel 2 = template 5's Carousel instruction, reading `name_ar`, `occupancy`, `facts`, `price`, `rate_badge`, `price_basis`, `image` and `button` per villa record: `badge_title` = `rate_badge` when it is not "-", `subtitle` = `price` when it is not "-" (never write a price for a record whose `price` is "-"), the last description line = `price_basis` when not "-", `primary_button_payload` = the text after "->" in the `button` line.

**Template 3+4 → one template `rsg-resort-compare-choice`** (Text, Carousel, Text, Carousel):
```
WHEN TO SELECT: Select when the reply contains the block "[cards: resort_compare]" (lead-in "سؤال في محلّه يا <name>. هذه أهم الفروق بين المنتجعين، معيارًا بمعيار:"). The same reply carries the recommendation sentence and the block "[cards: resort_choice]".
Do NOT select a plain answer about one difference (no block), the suggestions reply or the details reply.
```
Carousel 1 = template 3's instruction, reading `criterion`, `title`, `question`, `Shebara`, `Desert Rock`, `difference_label`, `difference` per record (a "-" means no difference line); informational, all button keys "". Text 2 = the recommendation sentence verbatim. Carousel 2 = template 4's instruction, reading the two `[cards: resort_choice]` records (`button = اختيار -> نختار Shebara.` / `نختار Desert Rock.`). The comparison is informational and the choice is the selection: only the second carousel has buttons.

**Template 6 `rsg-stay-summary`.** WHEN TO SELECT: "contains the block `[card: stay_summary]`". Confirmation Card: read `subtitle`, `dates` (→ primary_card_subtitle), `guests` (→ secondary_card_subtitle), `total` (→ tertiary_card_subtitle), `note` (→ instructions), `button` (→ primary button label and payload, icon "check") and the three URLs in the `icons` line (dates → primary_card_icon, guests → secondary_card_icon, total → tertiary_card_icon). `image_url` = the `image` line. Text = both sentences («توقيت جميل. هذا ملخص الإقامة:» and «إذا الملخص مناسب، نكمل لترتيب الوصول.») plus any agent sentence.

**Template 7 `rsg-arrival-mode`.** WHEN TO SELECT: "contains `[picker: arrival_modes]`". Items from the `option = <title> | icon = <icon> | payload = <payload>` lines, in order.

**Template 8 `rsg-airports`.** WHEN TO SELECT: "contains `[picker: airports]`". Groups from the two `group = <title> :: a | b | c` lines; `send_button_label` from `send_button`. The picker's message back is "<group>: <option>, <group>: <option>" in click order; the application reads one option per group whatever the order and asks again otherwise.

**Template 9+10 → one template `rsg-transfers-totals`** (Text, Carousel, Text, Confirmation Card):
```
WHEN TO SELECT: Select when the reply contains the block "[cards: transfer_legs]" (lead-in "سجّلت المطارات. هذه تنقلاتكم من المطار إلى Shebara وبالعكس:"). The same reply carries "[card: totals]" and the closing sentence "إذا كل شيء واضح، نعتمد ونكمل.".
Do NOT select the stay summary ("[card: stay_summary]") or a plain answer about transfers.
```
Carousel = template 9's instruction reading `leg` (→ badge_title), `product` (→ main_title), `price` (→ subtitle), `route`, `details` (split on " | " into bullets), `price_basis`, `image` per record. Text 2 = «وهذا الملخص بعد إضافة التنقلات:». Confirmation Card = template 10's instruction reading `subtitle`, `stay`, `transfers`, `total`, `note`, `button`, `image` and the `icons` line (stay → primary, transfers → secondary, total → tertiary). The closing sentence goes into Text 1 or Text 2, never dropped.

**Template 11 `rsg-experiences`.** WHEN TO SELECT: "contains `[cards: experiences]`". Records: `name`, `category` (→ badge_title), `price` (→ subtitle, first clause when longer than 30 characters, full line as the last description line), `tags` (split on " | " into bullets), `image`. The hint line «تقدر ترد بـ: «نختار عند الوصول»» stays in the Text component.

**Template 12 `rsg-guest-path`.** WHEN TO SELECT: "contains `[picker: guest_path]`". Items from the `option = <title> | subtitle = … | icon = … | payload = …` lines.

**Templates 13 and 14 (`rsg-review`, `rsg-trip-summary`).** Keep as written, with the block labels `[card: review]` / `[card: trip_summary]` in WHEN TO SELECT and the `icons` line for the three icons. They cannot be reached through the widget today: the guest form and the e-mail code are website steps, so the bridge never advances a widget session past the guest-path step. The `[card: checkout]` block likewise exists only for a session that completed the review on the website.

**Update 10 November 2026:** `[card: review]` and `[card: trip_summary]` are now reachable through the widget (guest details are typed in the chat, the demo completion follows the payment link automatically), so templates 13 and 14 are live templates, not website-only ones; the review record now carries a `redeemed = …` line when demo loyalty points were used, and the trip-summary reply is followed by a plain closing sentence with the points earned (Text component, no card). The checkout is plain text in the widget (no `[card: checkout]` block).

**No template for:** the hand-off reply («خلني أوريك المنتجعات على الصفحة نفسها…», plain text; the page reacts to the sentence), the widget notices («اكتب لي تاريخ الوصول وتاريخ المغادرة…», «هذه الخطوة … تتم في صفحة الحجز الكاملة على الموقع…», «تعديل البيانات وتحميل ملف PDF متاحان في صفحة الحجز…»), the unpriced-villa / other-dates / other-mode / other-airports replies and the terms reminder (plain text plus a «تقدر ترد بـ: …» hint), and the connection-error line («تعذر الاتصال بالمساعد الآن…»).

## Template 14, second revision (10 November 2026, evening): explicit fields, labelled links

After the first live run the bridge now writes the final amount and the saved award as **their own lines** in the block, so the card maps them directly instead of reading the closing sentence:

```
amount_due = SAR 33,693.90 · شامل جميع الضرائب
points_earned = 3369
points_redeemed = 0
points_balance = 3369
totals = الإجمالي SAR 33,693.90 · شامل جميع الضرائب · لا تجارب مضافة
request = تسجيل وصول متأخر
pdf = http://127.0.0.1:8100/trip.html?b=RSGD-…&t=…
```

**Text component, corrected (the live run of 17:11 showed the points sentence disappearing):** keep the closing sentence with the points in the text as well; the card repeats the figure as a field, which is intended.
```
text = every plain sentence of the reply, in order, exactly as written: "تفاصيل رحلتك جاهزة يا <name>. تأكيد الدفع وتأكيد الحجز يصلانك من موقع Visit Red Sea مباشرة." and the whole closing ("يا <name>، كسبت <N> نقطة ولاء من حجزك، وتقدر تستخدمها في حجزك القادم. رصيدك الآن <M> نقطة. نتمنى لك … إقامة جميلة في <resort>.", including "استخدمت <R> نقطة في هذا الحجز، …" when present). Remove only the sentence "هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة PDF:", the "[card: trip_summary]" label and every "key = value" line. Never reword, translate or add.
```

Use these Confirmation Card instructions instead of the ones in the section below (everything else there still holds):
```
Read the "[card: trip_summary]" block.
image_url = the "image" line. badge_text = "تفاصيل رحلتك". main_title = "Shebara". subtitle = the "subtitle" line verbatim.
primary_card_title = "إجمالي المبلغ". primary_card_subtitle = the "amount_due" line verbatim (currency code, amount with two decimals, then "· شامل جميع الضرائب"). Never recompute, round or convert it. primary_card_icon = the "transfers" URL from the "icons" line with "plane.svg" replaced by "credit-card.svg".
secondary_card_title = "نقاط الولاء المكتسبة". secondary_card_subtitle = the "points_earned" value followed by " نقطة" (write "0 نقطة" when the value is 0; when the line is "-" leave the field "—"). secondary_card_icon = the "transfers" URL from the "icons" line with "plane.svg" replaced by "sparkles.svg".
tertiary_card_title = "الضيوف". tertiary_card_subtitle = the "guests" line verbatim. tertiary_card_icon = the "guests" URL from the "icons" line.
instructions = "الرصيد المتاح <points_balance> نقطة · تقدر تستخدمها في حجزك القادم"; when "points_redeemed" is greater than 0, prefix "استخدمت <points_redeemed> نقطة · "; when the "request" line is not "-" and the text still fits 150 characters, append " · طلب: <request>".
primary_button_label = "تحميل PDF". primary_button_payload = "تحميل PDF". primary_button_icon = "download". secondary_button_label, secondary_button_payload, secondary_button_icon = "".
The badge, titles and texts must not say that a payment was received or a reservation is confirmed.
```

## Template 14, third revision (11 November 2026): the award of this booking only, no balance

The bridge no longer writes a `points_balance` line, the award carries a thousands separator, and the closing sentence quotes only the current booking: «يا محمد، كسبت من حجزك هذا 3,379 نقطة ولاء، وتقدر تستخدمها في حجوزاتك الجاية. نتمنى لك ولنورة إقامة جميلة في Shebara.» (with «واستخدمت R نقطة في هذا الحجز.» before «نتمنى» only when points were redeemed). The block is now:

```
amount_due = SAR 33,793.90 · شامل جميع الضرائب
points_earned = 3,379
points_redeemed = 0
totals = الإجمالي SAR 33,793.90 · شامل جميع الضرائب · لا تجارب مضافة
request = -
pdf = http://127.0.0.1:8100/trip.html?b=RSGD-…&t=…
```

Paste these in Studio (no angle brackets: the instruction editor strips them). The Text component instruction stays as in the second revision. Confirmation Card:
```
Read the "[card: trip_summary]" block.
image_url = the "image" line. badge_text = "تفاصيل رحلتك". main_title = "Shebara". subtitle = the "subtitle" line verbatim.
primary_card_title = "إجمالي المبلغ". primary_card_subtitle = the "amount_due" line verbatim (currency code, amount with two decimals, then "· شامل جميع الضرائب"). Never recompute, round or convert it. primary_card_icon = the "transfers" URL from the "icons" line with "plane.svg" replaced by "credit-card.svg".
secondary_card_title = "نقاط الولاء". secondary_card_subtitle = the "points_earned" value exactly as written followed by " نقطة" (write "0 نقطة" when the value is 0; when the line is "-" leave the field "—"). Never add points from anywhere else. secondary_card_icon = the "transfers" URL from the "icons" line with "plane.svg" replaced by "sparkles.svg".
tertiary_card_title = "الضيوف". tertiary_card_subtitle = the "guests" line verbatim. tertiary_card_icon = the "guests" URL from the "icons" line.
instructions = "نقاط هذا الحجز تقدر تستخدمها في حجوزاتك الجاية"; when "points_redeemed" is greater than 0, prefix "استخدمت " then the "points_redeemed" value then " نقطة · "; when the "request" line is not "-" and the text still fits 150 characters, append " · طلب: " then the "request" line.
primary_button_label = "تحميل PDF". primary_button_payload = "تحميل PDF". primary_button_icon = "download". secondary_button_label, secondary_button_payload, secondary_button_icon = "".
Never write a balance, a total of points or the word "الرصيد". The badge, titles and texts must not say that a payment was received or a reservation is confirmed.
```
(`secondary_card_title` is shortened to «نقاط الولاء»: the live run of 11 Nov showed «نقاط الولاء المكتسبة» cut to «نقاط الولاء مكت» in the card.)

**Links.** Web card buttons post text; they cannot open a URL (SDK 1.14.0). The widget's formatter does render markdown links in message text as anchors that open in a new tab (`[label](https://…)`, schemes http/https). So the bridge now sends the checkout as «هذا رابط الدفع الآمن على موقع Visit Red Sea، والإجمالي SAR …» + **[المتابعة للدفع](checkout URL)** + «وخلال لحظات أجهّز لك تفاصيل رحلتك هنا.», and the «تحميل PDF» button is answered with «ملف تفاصيل رحلتك جاهز يا <name>: **[تحميل ملف PDF](trip.html?…)**». Neither reply has a block, so no template touches them and the long URLs are no longer shown. A PDF cannot be attached to a Studio message (the only attachment type the SDK handles is audio).

## Template 14, revision of 10 November 2026: final amount and loyalty points together, PDF button

**Who builds the final message.** The completion turn is the page's control line `rsg:continue`, which `agent/studio_bridge.py handle_message` maps to `demo_continue()` without calling the agent. That function reads the saved award from `agent/loyalty.py complete()` (earned points, redeemed points, balance after) and the amount payable from the pending quote, and writes the reply itself: `live.completed`, the `[card: trip_summary]` block, `live.loyaltyClose`. The agent only sees the result afterwards (`recent_events`: "booking recorded: <id>, loyalty points N, balance M"; context `payableTotal`, `loyaltyBalance`) if the guest writes again. So the guest sees application wording rendered by Studio's template, never the agent's wording: an agent-instruction change cannot move the points into that message. The template below does it.

**The recorded reply (test backend, fictional data, no agent call):**

```
تفاصيل رحلتك جاهزة يا خالد. تأكيد الدفع وتأكيد الحجز يصلانك من موقع Visit Red Sea مباشرة.

هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة PDF:

[card: trip_summary]
image = https://<backend host>/assets/resorts/shebara.webp
subtitle = فيلا فوق الماء بغرفة نوم واحدة · Villa Flat Rate · الجمعة 23 أكتوبر 2026 – الأحد 25 أكتوبر 2026 · Yanbu Airport → Red Sea International Airport - RSIA
guests = الأستاذ خالد العمري وريم الشهري · 2 بالغين
transfers = الوصول: سيارة فاخرة خاصة + قارب ترفيهي مشترك / المغادرة: قارب سريع مشترك + سيارة فاخرة خاصة
contact = khalid.demo@example.com / +966 509876543
totals = الإجمالي SAR 33,693.90 · شامل جميع الضرائب · لا تجارب مضافة
request = تسجيل وصول متأخر
note = http://127.0.0.1:8100/trip.html?b=RSGD-B9A5ACBAAB&t=9ebe9365af3bb0fbc9886964
icons = guests: https://<backend host>/studio/icons/users.svg | transfers: https://<backend host>/studio/icons/plane.svg | contact: https://<backend host>/studio/icons/mail.svg

يا خالد، كسبت 3369 نقطة ولاء من حجزك، وتقدر تستخدمها في حجزك القادم. رصيدك الآن 3369 نقطة. نتمنى لك ولريم إقامة جميلة في Shebara.
```

With points redeemed the closing's middle sentence reads «استخدمت 1000 نقطة في هذا الحجز، ورصيدك الآن 5748 نقطة.», and `totals` carries the amount after the discount. The `[card: trip_summary]` block, the amount and the points arrive in ONE reply, so one template renders them; the PDF link arrives in a second, plain-text reply after the button is pressed: «ملف تفاصيل رحلتك جاهز يا خالد، اضغط الرابط لتنزيله: http://127.0.0.1:8100/trip.html?b=…&t=…».

### Template (replace the existing `rsg-trip-summary`)

Template name: RSG trip summary, amount, points and PDF · slug `rsg-trip-summary`
Components, in order: 1. Text (`text`, Required) 2. Confirmation Card (`confirmation-card`, Required)

WHEN TO SELECT — paste this:
```
Select when the reply contains the block "[card: trip_summary]" (lead-in "تفاصيل رحلتك جاهزة يا <name>…" then "هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة PDF:") AND a closing sentence that begins "يا <name>، كسبت <N> نقطة ولاء من حجزك". This is the completed booking: the "totals" line carries the final amount payable and the closing sentence carries the saved loyalty points.
Do NOT select the pre-payment summaries ("[card: totals]" after "وهذا الملخص بعد إضافة التنقلات:", "[card: stay_summary]" after "توقيت جميل. هذا ملخص الإقامة:"), the review ("[card: review]"), the payment-link reply (plain text with the visitredsea.com checkout URL and "وخلال لحظات أجهّز لك تفاصيل رحلتك هنا."), or the PDF-link reply (plain text "ملف تفاصيل رحلتك جاهز يا <name>، اضغط الرابط لتنزيله: …"). If the reply has the block but no "كسبت" sentence, do not select.
```

Component 1 — Text — Instructions:
```
text = the first sentence of the reply exactly as written ("تفاصيل رحلتك جاهزة يا <name>. تأكيد الدفع وتأكيد الحجز يصلانك من موقع Visit Red Sea مباشرة."), a blank line, then only the last sentence of the closing exactly as written ("نتمنى لك … إقامة جميلة في <resort>.").
Remove: the sentence "هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة PDF:", the "[card: trip_summary]" label and every "key = value" line, and the closing sentences that state the points and the balance ("يا <name>، كسبت … نقطة ولاء من حجزك، وتقدر تستخدمها في حجزك القادم.", "رصيدك الآن … نقطة.", "استخدمت … نقطة في هذا الحجز، ورصيدك الآن … نقطة."): the card shows those values. Never reword, translate or add.
```

Component 2 — Confirmation Card — Instructions:
```
Read the "[card: trip_summary]" block and the closing sentence.
image_url = the "image" line. badge_text = "تفاصيل رحلتك". main_title = "Shebara" (the resort named in the closing sentence after "في"). subtitle = the "subtitle" line verbatim.
primary_card_title = "إجمالي المبلغ". primary_card_subtitle = the amount that follows "الإجمالي" in the "totals" line, exactly as written with its currency code and two decimals (for example "SAR 33,693.90"), then " · شامل جميع الضرائب". Never recompute, round or convert it. primary_card_icon = the "transfers" URL from the "icons" line with "plane.svg" replaced by "credit-card.svg".
secondary_card_title = "نقاط الولاء المكتسبة". secondary_card_subtitle = the number N from the closing sentence "كسبت N نقطة ولاء من حجزك", written as "N نقطة" (write "0 نقطة" when the sentence says 0; never estimate a number that is not in the sentence). secondary_card_icon = the "transfers" URL from the "icons" line with "plane.svg" replaced by "sparkles.svg".
tertiary_card_title = "الضيوف". tertiary_card_subtitle = the "guests" line verbatim. tertiary_card_icon = the "guests" URL from the "icons" line.
instructions = "الرصيد المتاح <M> نقطة · تقدر تستخدمها في حجزك القادم" where <M> is the number after "رصيدك الآن" in the closing; when the closing says "استخدمت <R> نقطة في هذا الحجز", prefix "استخدمت <R> نقطة · ". When the "request" line is not "-" and the text still fits 150 characters, append " · طلب: <request>".
primary_button_label = "تحميل PDF". primary_button_payload = "تحميل PDF". primary_button_icon = "download". secondary_button_label, secondary_button_payload, secondary_button_icon = "".
The badge, titles and texts must not say that a payment was received or a reservation is confirmed.
```

Field mapping (reply → component):

| Reply field | Component field |
|---|---|
| `image` | `image_url` |
| `subtitle` | `subtitle` |
| `totals` → amount after «الإجمالي» | `primary_card_subtitle` («إجمالي المبلغ») |
| closing «كسبت N نقطة ولاء» | `secondary_card_subtitle` («نقاط الولاء المكتسبة») |
| `guests` | `tertiary_card_subtitle` («الضيوف») |
| closing «رصيدك الآن M نقطة» (+ «استخدمت R نقطة») and `request` | `instructions` |
| `icons` URLs (`users.svg`; `plane.svg` → `credit-card.svg` / `sparkles.svg`, both files exist under `/studio/icons/` on the backend) | the three `*_card_icon` |
| fixed «تحميل PDF» | `primary_button_label` / `primary_button_payload` |
| `note` (the signed PDF URL) | not used by the card: the Confirmation Card has no link slot; the button posts text and the bridge answers with this URL |

What the guest sees: the ready sentence, the card with «إجمالي المبلغ SAR 33,693.90 · شامل جميع الضرائب», «نقاط الولاء المكتسبة 3369 نقطة», the guests line, the balance in the instructions line, and a «تحميل PDF» button; below it the wish sentence.

### PDF download, the verified mechanics

A Web Confirmation Card button posts its payload as the visitor's message (core.min.js 1.14.0: the rich-select callback adds the visitor bubble and sends the payload through the transport); it does not open a URL. The bridge answers «تحميل PDF» with the signed link, and the widget's text formatter turns any `https?://` string into a link that opens in a new tab (`<a target="_blank" rel="noopener noreferrer">`, verified in the SDK source). `trip.html` on the website origin fetches the saved record through `/api/trip` and builds the PDF in the browser with `js/pdf.js`; a repeated download reads the same record and changes nothing. No Studio template should match the PDF-link reply (it has no block), so it renders as plain, linked text. Verified: the link, the record endpoint, the generated PDF (238 KB, `%PDF-1.4`, Fedra fonts) on the test instances; not yet seen in the live widget.

## Not configured in Studio (website keeps them), with the live turn that shows why

| Step | Live turn | Why no template |
|---|---|---|
| Page hand-off (scroll + spotlight) | «ودي أتصفح المنتجعات عندكم على الصفحة» → `navigate_to_resorts` → `{"ok":true,"visible":[…]}` → «خلني أوريك المنتجعات على الصفحة نفسها…» + agent «أبشر يا محمد، عرضت لك المنتجعات على الصفحة…» | A browser action, no card |
| Calendar | `set_party` → `"shown": "calendar"` | No date component in the library |
| Sign-in (e-mail + code) and verification | `choose_account_mode account` → `"shown": "sign-in card (e-mail + code)"` | OTP entry has no component; codes never leave `server.py` |
| Special-request question | «أهلًا بعودتك، تم التحقق من بريدك…» → `record_special_request` | Plain text; the answer goes to the agent |
| Guest form (manual, prefilled, edit) and microphone | `"shown": "guest form"` / `"prefilled guest form"`; voice → «وصلتني رسالتك الصوتية، لكن التفريغ الصوتي غير مهيّأ…» | Free-text form has no component; no transcription configured |
| Terms checkbox | `confirm_review` → `"the guest has not ticked the terms checkbox"` | No slot in the Confirmation Card; the backend enforces it |
| Checkout hand-off card | `confirm_review` → `"shown": "payment hand-off card"`; the click opened the official URL | A Studio button only posts text; no verified web CTA that opens a URL |
| Quick replies (9) | e.g. after the unpriced villa, the terms reminder, the experiences | No web quick-reply component in the library |
| Official resort page from the photo | — | No link slot in any schema |

## Still waiting for a real conversation sample

1. **A live returning-guest turn end to end** (sign-in → code → «أهلًا بعودتك…» → request → prefilled form) was run in the browser against the live server and the agent handled `record_special_request`; the sign-in and form steps themselves are website components, so nothing is waiting there for Studio.
2. **`rsg-resort-details` for a non-Shebara choice** («خيار جميل. هذه نبذة عن Desert Rock:»): exercised only through the card event by the protocol driver against the live server, not by a typed turn. Same application reply; a typed sample would confirm the agent calls `select_resort` for it.
3. **Checkout card as a Studio template**: waiting for evidence that a web Confirmation Card button can open a URL. Until then it stays a website card.
4. **The reply format Studio will receive**: every template above assumes the backend will add the listed data after the lead-in. No live reply contains that data yet; this is the connection work you said you will do later.

## Templates 15 and 16 (11 November 2026): `rsg-dates-calendar`, `rsg-guest-form`

Custom components `rsg_date_range` and `rsg_guest_form`, rendered by the fresh site. The copy-ready component and template setup (schemas, WHEN TO SELECT, instructions, sample payloads, submission lines) is in `STUDIO_SETUP_CALENDAR_FORM_2026-11-11.md`; the bridge blocks are `[calendar: dates]` and `[form: guest_details]` (`visitredsea-chat-live/agent/studio_bridge.py`, `calendar_block` / `form_block`).

## Text components: no quoted examples (11 November 2026, night)

Found in a live widget run: the guest-path reply showed «نحتاج بياناتك وبيانات زوجتك يا <name> عشان نكمل الحجز…» although the bridge sent «يا محمد» (checked: `studio_bridge.reply_text` at the account step). Rendering Intelligence's Text component copied the sentence quoted in the Template 12 instruction above, placeholder included, instead of the reply. Every Text instruction that quotes a sentence with a placeholder carries the same risk (Templates 1, 3, 12, 14 and the merged ones). Replace the Text instruction in **every** RSG template with this one, which quotes nothing:

```
text = every plain sentence of the agent reply, in order, copied character for character from the reply (the application's lead-in, any sentence the agent added, and any "تقدر ترد بـ: …" hint). Remove every line that belongs to a data block: the line that starts with "[" and the "key = value" lines under it. Take the words only from the agent reply, never from this instruction. Keep the guest's name exactly as the reply writes it and never write a placeholder or angle brackets. Never reword, translate or add.
```

For `rsg-trip-summary` add one sentence at the end: `Leave out the sentence that introduces the card (it begins «هذا ملخص رحلتك»).`


## 12 November 2026: villa card without price, no terms step, one-click PDF (paste these)

What the bridge sends now (`visitredsea-chat-live/agent/studio_bridge.py`, checked by `tools/check_widget_flow.py`):

- `[cards: villas]`: each record is `name`, `name_ar`, `occupancy`, `facts`, `rate_badge`, `stay`, `image`, `button`. The `price` and `price_basis` lines are gone. The priced villa has `stay = شخصان بالغان · 23 - 25 أكتوبر 2026`; every other villa has `stay = -`. The amounts appear later, in `[card: stay_summary]`, `[card: totals]` and `[card: review]`.
- The review lead-in in the widget ends «إذا كل شيء صحيح، نكمل للدفع.» (no terms, no e-mail check). «البيانات صحيحة، نكمل» goes straight to the payment link. No terms reminder is ever sent in the widget, so no template needs to exclude it.
- `[card: trip_summary]` carries `pdf = <signed trip.html link>`. The fresh site opens that link when the card's button is clicked, provided the button's payload is the link.

### "RSG resort details and villas" (`rsg-resort-details-villas`): component 4, the second Carousel, Instructions (replace the whole text)

The live channel uses the merged template (Text, Carousel, Text, Carousel, all Optional); "RSG Shebara villas" (`rsg-villas`) is turned off. The Shebara reply arrives in that order: «اختيار موفّق. هذه نبذة سريعة عن Shebara:», `[card: resort_details]`, «وهذه خيارات الفلل، وأقدر أرتب لك التفاصيل بعدها:», `[cards: villas]` with eight records. Only component 4 changes; WHEN TO SELECT, both Text components and the first Carousel stay as they are.

```
Build one card per record under "[cards: villas]", in the supplied order.
  main_title = the "name_ar" line (max 60). badge_position = "top-right".
  badge_title = the "rate_badge" line when it is not "-", otherwise "".
  subtitle = "" on every card.
  description = "**" + the "occupancy" line + "**", a blank line, then one markdown bullet ("- ") per item of the "facts" line split on " · ", and, only when the "stay" line is not "-", a blank line then the "stay" line exactly as written.
  (Update, 12 Nov evening: the bridge no longer sends a "stay" line at all, on the owner's request. The text above still works unchanged, as verified through the live channel: the cards came back with no party or dates line.)
  The card shows no price, no amount, no number of nights and no tax note: take nothing from any other block of the reply.
  image_url = the "image" line. primary_button_label = "اختيار". primary_button_payload = the text after "->" in the "button" line, exactly as written.
  secondary_button_label, secondary_button_payload, tertiary_button_label, tertiary_button_payload = "". lock_after_selection = true.
```

### Template 13 `rsg-review` ("RSG final review")

WHEN TO SELECT (replace the whole text). The old text keyed on the lead-in «…أكّد الموافقة على الشروط ونكمل…», which the widget no longer sends, so the card would stop rendering until this is replaced:

```
Select when the reply contains the block "[card: review]" (the guest's details, transfers, contact and totals for a final check).
Do NOT select the payment-link reply (plain text with the visitredsea.com checkout link and no block), the trip summary ("[card: trip_summary]"), the guest form ("[form: guest_details]"), or any reply without the "[card: review]" block.
```

Text component: the universal instruction from the section above ("Text components: no quoted examples"). Confirmation Card: unchanged («البيانات صحيحة، نكمل» / «تعديل البيانات»).

### Template 14 `rsg-trip-summary`: Confirmation Card, one line to replace

In the Confirmation Card instructions, replace the line that begins `primary_button_label = "تحميل PDF". primary_button_payload = "تحميل PDF".` with:

```
primary_button_label = "تحميل PDF". primary_button_payload = the "pdf" line of the "[card: trip_summary]" block, copied character for character (the complete link that starts with http and contains "/trip.html?b="); never shorten, rewrite or build a link yourself; when the "pdf" line is "-", write "تحميل PDF". primary_button_icon = "download". secondary_button_label, secondary_button_payload, secondary_button_icon = "".
```

Why the payload and not a link field: the Web SDK's Confirmation Card has no URL action. core.min.js 1.15.0 calls `t(primary_button_payload ?? primary_button_label, 0)`, which posts the payload as the visitor's message. The fresh site (`visitredsea-chat-fresh/js/site.js`) listens for clicks in the capture phase. When a confirmation-card button's payload is a same-origin `/trip.html?b=…&t=…` link, it opens that link and stops the click before the SDK sees it, so the conversation gets no visitor bubble, no agent turn and no second link. If the template still sends «تحميل PDF», the button keeps the old two-step behaviour (the bridge answers with the link). If the link reaches the bridge as a message (no page handler), the bridge answers with the link as text.

## 12 November 2026, evening: stay-summary card missing, calendar without pre-selection

Verified through the live Studio channel (site `127.0.0.1:8100`, bridge behind the tunnel, backend briefly on the test stand-in so no agent turn was paid). The route was: name, resort request, «نختار Shebara.», villa, party, then the calendar.

- **Villa carousel** (`RSG resort details and villas`, Carousel 2): 8 cards. The first card carried badge «Villa Flat Rate», an empty subtitle, the occupancy, five feature bullets and «اختيار», with no price, party or dates.
- **Calendar** (`rsg-dates-calendar`): Studio passed `initial_check_in` and `initial_check_out` as empty strings, so it opened on October 2026 with nothing selected, «الوصول: —» and the submit button disabled.
- **Stay summary**: after the calendar line, the bridge replied «توقيت جميل. هذا ملخص الإقامة:» + `[card: stay_summary]` (every value within the Confirmation Card limits; the image and the three icons load) + «إذا الملخص مناسب، نكمل لترتيب الوصول.». Studio's stream to the widget held **one text message only**, «توقيت جميل. هذا ملخص الإقامة:», which is the old Text instruction of this template. No card was sent, also not after 15 more seconds. The review and trip-summary Confirmation Cards render, so the component works; the cause is in this template's setup in Studio, which is not visible from here (most likely the Confirmation Card is missing from the template or marked Optional and skipped).

### Template 6 `rsg-stay-summary` ("RSG stay summary"): replace all three texts, set both components to Required

Components, in order: 1. Text (Required) 2. Confirmation Card (Required).

WHEN TO SELECT:
```
Select when the reply contains the block "[card: stay_summary]" (the stay summary after the dates: villa, dates, guests and the stay total).
Do NOT select the totals with transfers ("[card: totals]"), the review ("[card: review]"), the calendar ("[calendar: dates]"), or any reply without the "[card: stay_summary]" block.
```

Component 1, Text, Instructions: the universal Text instruction above ("Text components: no quoted examples").

Component 2, Confirmation Card, Instructions:
```
Read the "[card: stay_summary]" block. Copy every value exactly as written; never compute, round or change an amount or a date.
image_url = the "image" line. badge_text = "ملخص الإقامة". main_title = "Shebara". subtitle = the "subtitle" line.
primary_card_title = "التواريخ". primary_card_subtitle = the "dates" line. primary_card_icon = the "dates" URL in the "icons" line.
secondary_card_title = "الضيوف". secondary_card_subtitle = the "guests" line. secondary_card_icon = the "guests" URL in the "icons" line.
tertiary_card_title = "إجمالي الإقامة". tertiary_card_subtitle = the "total" line. tertiary_card_icon = the "total" URL in the "icons" line.
instructions = the "note" line.
primary_button_label = the "button" line. primary_button_payload = the "button" line. primary_button_icon = "check". secondary_button_label, secondary_button_payload, secondary_button_icon = "".
```

The button line is «مناسب، نكمل», which the bridge maps to the approve step (`event_for` → `{"type": "approve"}`).

### Seen in the owner's run, 12 November evening: «<name>» and the PDF link twice

- **«<name>» in the guest-path reply.** The widget showed «نحتاج بياناتك وبيانات زوجتك يا <name> عشان نكمل الحجز…». That is the quoted sentence in Template 12's Text instruction. The bridge sends «يا محمد» (`reply_text` at the account step). Studio still has the old Text instruction there. Replace it (and the WHEN TO SELECT that quotes the same sentence) in **RSG guest path (returning / new)**:

WHEN TO SELECT:
```
Select when the reply contains the block "[picker: guest_path]" (the choice between signing in with an earlier account and continuing as a new guest).
Do NOT select any reply without the "[picker: guest_path]" block.
```
Text, Instructions: the universal Text instruction ("Text components: no quoted examples"). Selection List Picker: unchanged.

- **PDF link twice.** The visitor bubble read «تحميل PDF», so the card's button payload is still the label: Template 14's `primary_button_payload` line has not been replaced yet (paste text in "Template 14 `rsg-trip-summary`: Confirmation Card, one line to replace"). The page handler is served on 8100 (`js/site.js`, `Cache-Control: no-cache`) and opens the link only when the payload is the signed link.
