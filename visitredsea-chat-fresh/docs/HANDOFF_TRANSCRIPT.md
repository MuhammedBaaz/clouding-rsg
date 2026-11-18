# ERP-to-WhatsApp handoff: the booking system assigns the guest to Faisal (11 November 2026)

Scripted scene opened by the «تسليم الحجز للكونسيرج» launcher on the Visit Red Sea site. Local playback only; nothing is sent anywhere. Shown from Faisal's point of view: the iPhone is his, the contact is the company's booking system, and his reply is the outgoing message. A WhatsApp concierge and this handoff are a product concept, not a documented Shebara or Red Sea Global process.

Source for playback, the booking panel and the PDF: `data/handoff-script.js` (booking values read from `data/booking.js`). The PDF `assets/handoff/guest-file.pdf` is printed from `tools/handoff-pdf.html` by `python tools/build_handoff_pdf.py <site address>` (run it from PowerShell; Edge does not write the file when launched from Git Bash).

## Values shared by the panel, the messages and the PDF

| Field | Value | Source |
|---|---|---|
| Guest | السيد محمد باز | approved scenario |
| Service category | فئة الضيافة المميزة (Class A, internal) | owner, 11 Nov |
| Mobile | +966 55 123 4567 | fictional |
| E-mail (PDF only) | mohammed.baz@example.com | fictional, reserved domain |
| Companion | نورة الحربي (زوجته) | approved scenario |
| Resort, villa, rate | Shebara · فيلا فوق الماء بغرفة نوم واحدة (One Bedroom Overwater Villa) · Villa Flat Rate | `data/booking.js` |
| Stay | الجمعة 23 أكتوبر 2026 – الأحد 25 أكتوبر 2026 · ليلتان · شخصان بالغان | `data/booking.js` |
| Arrival transfer | من مطار ينبع إلى Shebara · سيارة فاخرة خاصة + قارب ترفيهي مشترك · 4 ساعات | `data/booking.js` |
| Departure transfer | من Shebara إلى مطار البحر الأحمر الدولي – RSIA · قارب سريع مشترك + سيارة فاخرة خاصة | `data/booking.js` |
| Special request | تسجيل وصول متأخر إن أمكن | approved scenario |
| Amounts (PDF, panel total) | الإقامة SAR 28,980.00 · التنقلات SAR 4,813.90 · الإجمالي SAR 33,793.90 شامل جميع الضرائب | `data/booking.js` |
| Assigned concierge | فيصل · الكونسيرج الشخصي · أُسند الاثنين 19 أكتوبر 2026، 2:05 م | before his first message to the guest at 4:12 م |

No booking reference is shown (none is evidenced), and nothing states a payment or a confirmed reservation.

## Scene order

1. Assignment: the panel's stage bar moves from «جديد» to «مُسند للكونسيرج», Faisal's photo and name fill the concierge slot, the log shows «2:05 م · أُسند الحجز إلى فيصل».
2. Transfer: «إرسال إلى واتساب فيصل» switches to «جارٍ الإرسال…», the PDF leaves the attachment chip and travels into the phone (once per opening), the panel ends on «سُلّم عبر واتساب» and «2:06 م · أُرسل ملف الضيف إلى واتساب فيصل».
3. Delivery: the WhatsApp exchange below plays only after the transfer lands.
4. Review: the exchange stays visible and scrollable; closing returns to the site; the next opening plays again from step 1.

## WhatsApp header (Faisal's phone)

- Contact: **نظام الحجوزات · Shebara**, subtitle "Online" ("typing…" while a system message is being typed), avatar the Visit Red Sea mark
- Status bar 2:08 PM, date pill "Oct 19, 2026" (the phone's own strings are English, as in scene 1)
- Beside the phone: «فيصل · الكونسيرج الشخصي · Shebara» with his portrait, tagged «المستلم»

## Exchange

| # | Sender | Time | Message |
|---|---|---|---|
| 1 | نظام الحجوزات (incoming) | 2:05 PM | مرحبًا فيصل، تم إسناد حجز جديد لك في Shebara للضيف السيد محمد باز. |
| 2 | نظام الحجوزات (incoming) | 2:05 PM | الضيف ضمن فئة الضيافة المميزة. الإقامة في فيلا فوق الماء بغرفة نوم واحدة من 23 إلى 25 أكتوبر 2026 (ليلتان) لشخصين بالغين، مع زوجته نورة الحربي. |
| 3 | نظام الحجوزات (incoming) | 2:06 PM | جوال الضيف: +966 55 123 4567 / تقدر تتواصل معه مباشرة لتنسيق الإقامة. |
| 4 | نظام الحجوزات (incoming, document) | 2:06 PM | «ملف الضيف وتفاصيل الحجز.pdf» (1 page · 166 kB · PDF) with the caption «التفاصيل الكاملة للضيف والحجز في الملف المرفق.» Opens `assets/handoff/guest-file.pdf`. |
| 5 | فيصل (outgoing, read) | 2:08 PM | استلمت الملف، شكرًا. بتواصل مع السيد محمد اليوم وأنسّق معه تفاصيل الإقامة. |
