# RSG V2 concierge: presenter script (English)

Presenter: Clouding, for Red Sea Global stakeholders
Experience: Visit Red Sea concierge, version 2 (chat-only journey)
Running time: about 9 to 10 minutes of demonstration, plus the opening and closing. Allow 1 to 2 extra minutes for typing and e-mail delivery.

Source of truth: the current application in `D:\Clouding\RSG\visitredsea-chat-mockup-v2` (conversation in `data/script.js`, logic in `js/chat.js`, prices in `data/booking.js`, resort facts in `data/resorts.js`). Every message, label and value below is taken from the current app and from a full run on 25 October 2026.

How to read this script:
- **On-screen action** and **Wait / transition** are private instructions for you.
- **Customer input** is what you type or press. The app speaks Arabic, so inputs and labels are given in Arabic with an English translation.
- **Say this** is what you say aloud, in English.
- **Draw attention to** is the one point worth making at that step.

---

## 1. Opening brief (about 50 seconds, before opening the chat)

> Thank you for having us. What we'd like to show you today is a concierge conversation built around a guest planning a stay at Red Sea Global.
>
> The guest starts the way people naturally do, by saying what they're looking for. From there, the concierge helps them discover resorts, compare the ones they're torn between, choose a villa and dates, arrange transfers, and move through the booking steps, all in one conversation.
>
> Clouding built this experience end to end: the conversation design in a warm Saudi voice, the booking logic behind it, and the rich components that appear in the chat, such as resort cards, comparisons, a calendar, summaries and forms. Those components are where the guest acts, not just reads. They tap to choose, confirm and review.
>
> For your business, the point is simple. The guest gets help making a decision, a returning guest doesn't have to type their details again, and the whole journey stays in one continuous thread, with a clear summary at the end. Let me show you.

---

## 2. Presentation script

Starting state: the V2 page is open at `http://127.0.0.1:8090/`, freshly loaded, chat closed. Your mailbox for muhammed.baz@clouding.ai is open in a second tab.

Golden rule for every step: wait until the header under «رفيق رحلتك» no longer reads «المساعد يكتب…» ("the assistant is typing…") and the send arrow is active again before you type or click. Cards from a turn arrive after its messages.

---

### Step 1 · Open the concierge (0:00)

**On-screen action:** Click the round launcher at the bottom right of the page, labelled «تحدث مع رفيق رحلتك» ("Talk to your trip companion").

**Customer input:** None.

**Say this:**
> The concierge lives on the Visit Red Sea page as a companion the guest can open at any time. It greets them and asks what to call them.

**Wait / transition:** Wait for the greeting: «يا هلا بك في البحر الأحمر. أنا رفيق رحلتك لترتيب الإقامة من أول خطوة إلى الوصول. وش الاسم اللي تحب نناديك فيه؟» ("Welcome to the Red Sea. I'm your trip companion, from the first step to arrival. What would you like us to call you?")

**Draw attention to:** The tone. It's hospitality first, not a form.

---

### Step 2 · The guest's name (0:20)

**On-screen action:** Click the message box («كيف نقدر نساعدك؟»), type, press the send arrow.

**Customer input:** «أنا محمد» ("I'm Mohammed")

**Say this:**
> I'll play the guest, Mohammed. From here on the concierge uses his name naturally.

**Wait / transition:** Agent replies «حياك الله يا محمد. كيف أقدر أساعدك؟» ("Welcome, Mohammed. How can I help?")

**Draw attention to:** Nothing to click yet. Keep this quick.

---

### Step 3 · What he's looking for (0:35)

**On-screen action:** Type and send.

**Customer input:** «أبي إجازة هادئة أنا وزوجتي» ("I'd like a quiet holiday for my wife and me")

**Say this:**
> He tells us what he wants in his own words: a quiet holiday with his wife. The concierge answers with three suggestions right in the conversation, each with a photo, the official resort name and a single action to choose it.

**Wait / transition:** Wait for «أقترح لكم هذه الوجهات يا محمد…» and the three cards: Shebara, Desert Rock, and Six Senses Southern Dunes, The Red Sea, with «استكشف المزيد» ("Explore more") underneath.

**Draw attention to:** The guest never leaves the chat to browse, but «استكشف المزيد» is there if he wants the full resort list on visitredsea.com.

---

### Step 4 · Photos open the official resort pages (1:10)

**On-screen action:** On the Shebara card, click the photo (the small arrow icon at its lower corner marks the link). A new tab opens the official Shebara page. Let it load for two or three seconds, then switch back to the chat tab.

**Customer input:** None.

**Say this:**
> If he wants more depth, every resort photo opens that resort's official page on visitredsea.com, in a new tab. Choosing and browsing are separate, so looking never selects anything, and the conversation is exactly where he left it.

**Wait / transition:** Confirm you're back on the chat tab and nothing has changed in the conversation.

**Draw attention to:** The guest's place in the conversation is kept.

---

### Step 5 · Undecided between two resorts (1:40)

**On-screen action:** Type and send.

**Customer input:** «صراحة محتار بين Shebara وDesert Rock، وش ترشح لي؟» ("Honestly, I'm torn between Shebara and Desert Rock. What would you recommend?")

Type the resort names in English exactly as shown.

**Say this:**
> Here's a very real moment: he likes two resorts and can't decide. Instead of a long block of text, the concierge compares them criterion by criterion.

**Wait / transition:** Wait for «سؤال في محلّه يا محمد. هذه أهم الفروق بين المنتجعين، معيارًا بمعيار:» and the comparison cards («1 من 5» to «5 من 5»). Don't type yet: a recommendation message and a second carousel follow.

**Draw attention to:** The next step walks through the cards.

---

### Step 6 · The comparison (2:00)

**On-screen action:** Use the ‹ › arrows on the comparison carousel to move through the five cards. Pause briefly on cards 1, 2 and 4.

**Customer input:** None.

**Say this:**
> Each card asks one question and answers it for both resorts.
>
> The setting: Shebara is an island about 25 kilometres offshore, reached by car and then boat or seaplane. Desert Rock is in a mountain valley near Umluj, reached by car from Red Sea International Airport.
>
> The stay: Shebara has 73 villas, all with private pools, 38 over the water and 35 on the beach. Desert Rock has 54 villas and 10 suites set into the landscape, including villas on the cliff and a suite in a mountain cave.
>
> And what's distinctive: a dive centre near the reef at Shebara; an adventure centre, a listening room and vinyl bar, and a lagoon oasis at Desert Rock. Both offer a spa and stargazing.
>
> The small photo beside each resort's name keeps it obvious which resort you're reading about, on every card.

**Wait / transition:** Make sure the recommendation message below the cards has finished.

**Draw attention to:** The small thumbnails beside «Shebara» and «Desert Rock» on every card. These are real contrasts, not one resort described as better than the other.

---

### Step 7 · The recommendation (2:50)

**On-screen action:** Scroll to the message under the comparison. If «رسائل جديدة» ("New messages") appears, click it.

**Customer input:** None.

**Say this:**
> Only then does the concierge give its view, as a separate message. It starts from what he actually told us, that he's planning a holiday with his wife, and recommends Shebara: an island surrounded by the sea, villas with private pools over the water and on the beach, a reef close to the shore, and an atmosphere suited to relaxing. It still presents Desert Rock positively, for anyone drawn to the mountains and adventure, and leaves the decision to him.

**Wait / transition:** The two-card selection carousel (Shebara and Desert Rock) appears under the message.

**Draw attention to:** The comparison gives facts and the recommendation gives advice, and the two are kept apart. The sea comes in as a reason for the recommendation, not as something the guest asked for.

---

### Step 8 · Choosing Shebara (3:25)

**On-screen action:** In the two-card carousel, click «اختيار» ("Choose") on the **Shebara** card.

**Customer input:** Button «اختيار». The chat posts his choice as «نختار Shebara.» ("We'll choose Shebara.")

**Say this:**
> One tap, and his choice is written into the conversation as his own reply, so the thread always reads as a record of what he decided.

**Wait / transition:** Wait for «اختيار موفّق. هذه نبذة سريعة عن Shebara:» ("Good choice. Here's a short profile of Shebara"), the Shebara card, then «وهذه خيارات الفلل…» and the villa carousel.

**Draw attention to:** The choice appears as a customer message. The Shebara card's photo also links to the official page.

---

### Step 9 · Choosing the villa (3:50)

**On-screen action:** Point to the first villa card, «فيلا فوق الماء بغرفة نوم واحدة» (One Bedroom Overwater Villa), which shows **SAR 28,980.00**. Scroll the carousel briefly to show the other villa types, then click «اختيار» on the One Bedroom Overwater Villa.

**Customer input:** Button «اختيار». Posted as «أختار One Bedroom Overwater Villa على Villa Flat Rate.»

**Say this:**
> The villa choice comes before the details. Each card shows the villa, who it suits and its key features. For the One Bedroom Overwater Villa we show the price for the whole stay on the Villa Flat Rate: SAR 28,980 for two nights, taxes included. That's the rate we've evidenced for this scenario. In production, prices and availability would come from Red Sea Global's booking system.

**Wait / transition:** Agent asks «اختيار جميل لإقامتكم. أتأكد منك: الإقامة لك ولزوجتك فقط؟» ("Lovely choice. Just to confirm, the stay is for you and your wife only?")

**Draw attention to:** The whole-stay price and its basis are on the card. Be clear that it isn't live inventory.

---

### Step 10 · Party size (4:25)

**On-screen action:** Type and send.

**Customer input:** «إي نعم، بس أنا وزوجتي» ("Yes, just my wife and me")

**Say this:**
> A quick confirmation of who's travelling, because that drives the rate and the transfers.

**Wait / transition:** Agent asks «تمام. متى تحبون يكون الوصول والمغادرة؟» ("When would you like to arrive and leave?") and the calendar appears on October 2026.

**Draw attention to:** It's a short confirmation, not a questionnaire.

---

### Step 11 · Dates on the calendar (4:40)

**On-screen action:** In the calendar, click **23**, then **25**, then «تأكيد التواريخ» ("Confirm dates").

**Customer input:** Calendar selection. Posted as «الوصول الجمعة 23 أكتوبر 2026 والمغادرة الأحد 25 أكتوبر 2026، ليلتان.» ("Arriving Friday 23 October 2026, leaving Sunday 25 October 2026, two nights.")

**Say this:**
> Dates are picked on a calendar rather than typed, and the nights are worked out for him. Two nights, Friday to Sunday.

**Wait / transition:** Wait for «توقيت جميل. هذا ملخص الإقامة:» and the stay summary card.

**Draw attention to:** No date formats to get wrong, and the selection comes back as a plain sentence.

---

### Step 12 · Accommodation summary (5:00)

**On-screen action:** Point to the summary rows, then click «مناسب، نكمل» ("Looks good, let's continue") on the card.

**Customer input:** Button «مناسب، نكمل».

**Say this:**
> Before moving on, he sees the stay in one place: Shebara, the overwater villa on the Villa Flat Rate, the dates, two adults, and the stay total of SAR 28,980, taxes included. He approves with one tap.

**Wait / transition:** Agent asks «كيف بتوصلون للبحر الأحمر؟» ("How will you travel to the Red Sea?") with four options.

**Draw attention to:** A checkpoint before each new cost.

---

### Step 13 · Getting there (5:20)

**On-screen action:** Click «بالطائرة» ("By plane"). Then, in the airport card:
- under «مطار الوصول» ("Arrival airport") choose «مطار ينبع» (Yanbu Airport);
- under «مطار المغادرة» ("Departure airport") choose «مطار البحر الأحمر الدولي – RSIA» (Red Sea International Airport);
- click «اعتماد المطارات» ("Confirm airports").

**Customer input:** «بالطائرة», the two airport chips, «اعتماد المطارات». Posted as «مطار الوصول: مطار ينبع, مطار المغادرة: مطار البحر الأحمر الدولي – RSIA».

**Say this:**
> He's flying in. Arrival and departure airports can differ, so he picks each one: Yanbu on the way in, Red Sea International on the way out. Flight details are optional at this point.

**Wait / transition:** Wait for «سجّلت المطارات. هذه تنقلاتكم من المطار إلى Shebara وبالعكس:» and the two transfer cards.

**Draw attention to:** Two separate legs, chosen in one card.

---

### Step 14 · Transfers, with both legs pictured (5:50)

**On-screen action:** Point to both transfer cards. No click needed.

**Customer input:** None.

**Say this:**
> The concierge sets out both legs with a photo of each. Arriving: a private luxury car and a shared leisure boat from Yanbu to Shebara, SAR 3,622.50. Leaving: a shared speed boat and a private luxury car to Red Sea International, SAR 1,191.40. For an island resort, seeing the car-and-boat combination helps the guest picture the journey.

**Wait / transition:** Wait for «وهذا الملخص بعد إضافة التنقلات:» and the updated summary.

**Draw attention to:** Pictures for both legs, not just the arrival.

---

### Step 15 · Updated total (6:15)

**On-screen action:** Point to the totals, then click «اعتمد ونكمل» ("Approve and continue").

**Customer input:** Button «اعتمد ونكمل».

**Say this:**
> The summary updates as decisions are made: stay SAR 28,980, transfers SAR 4,813.90, and a total of SAR 33,793.90, taxes included. Nothing gets added without him seeing it first.

**Wait / transition:** Wait for «وهذه تجارب ممكن تستكشفونها خلال الإقامة…» ("Here are experiences you could explore during your stay"), the experience cards and a reply button underneath.

**Draw attention to:** A running total the guest can trust.

---

### Step 16 · Experiences, decided later (6:35)

**On-screen action:** Scroll the experience cards briefly, then click the reply button «نختار عند الوصول» ("We'll choose on arrival").

**Customer input:** Button «نختار عند الوصول».

**Say this:**
> The concierge suggests three experiences, Adrena, the garden discovery and planting experience, and stand-up paddle-boarding, with prices shown. He'd rather decide when he's there, and that's respected: nothing is added and the total doesn't change.

**Wait / transition:** Wait for «ولا يهمك. ما أضفت أي تجربة، والإجمالي كما هو…» ("No problem. I haven't added any experience and the total is unchanged…"), then «نحتاج بياناتك وبيانات زوجتك يا محمد…» and the two-option card «كيف تحب نكمل؟» ("How would you like to continue?").

**Draw attention to:** Suggestions without pressure. Deferring is a first-class choice.

---

### Step 17 · Returning guest (7:00)

**On-screen action:** Click «لدي حساب سابق» ("I have an existing account").

**Customer input:** «لدي حساب سابق».

**Say this:**
> Now we need the guests' details. A returning guest can sign in with his e-mail and have his saved details brought back, while a new guest can simply fill them in. Mohammed has stayed with us before.

**Wait / transition:** Wait for «أبشر. اكتب بريدك الإلكتروني اللي سجّلت فيه، ونرسل لك رمز تحقق من 6 أرقام…» and the sign-in card «الدخول بحسابك» ("Sign in to your account").

**Draw attention to:** Two clear paths, explained in one sentence.

---

### Step 18 · E-mail and verification code (7:20)

**On-screen action:**
1. Click the «البريد الإلكتروني» field in the sign-in card and type `muhammed.baz@clouding.ai`.
2. Click «إرسال الرمز» ("Send code").
3. When six boxes appear, switch to the mailbox tab and open the message titled **"Your verification code"**.
4. Switch back and type the six digits from that e-mail into the boxes.
5. Click «تحقق» ("Verify").

Never type a code from memory or from a previous rehearsal. Use the one in the newest e-mail.

**Customer input:** The approved e-mail address and the code it receives. The chat posts «أدخلت الرمز.» ("I've entered the code.")

**Say this (while you click send):**
> To protect his information, his saved details are released only after he proves the e-mail is his. A one-time code goes to that address now.

**Say this (while waiting for the e-mail):**
> It usually lands within a few seconds. The code is valid for five minutes, and he can request a new one after thirty seconds.

**Wait / transition:** Wait for the e-mail, enter the code, then wait for the card to show «تم التحقق من البريد» ("E-mail verified").

**Draw attention to:** A real code to a real inbox. Nothing personal appears in the chat before verification.

---

### Step 19 · Saved details retrieved, and the request question (8:00)

**On-screen action:** Point to the new agent message. No form has appeared yet; that's intended.

**Customer input:** None yet.

**Say this:**
> Verified, and his saved details are retrieved. Notice what the concierge does before showing any form: it asks whether there's anything special they'd like for this stay. It doesn't carry over requests from a previous visit, and it doesn't add any by itself.

**Wait / transition:** The message reads «أهلًا بعودتك، تم التحقق من بريدك واسترجعت بياناتك المحفوظة. هل عندكم أي طلب خاص تحبون نضيفه لإقامتكم يا محمد؟ وإذا ما عندكم طلبات، نكمل بدونها.» ("Welcome back. Your e-mail is verified and I've retrieved your saved details. Is there any special request you'd like added to your stay, Mohammed? If not, we'll continue without one.")

**Draw attention to:** The guest decides what goes into this booking.

---

### Step 20 · His request (8:20)

**On-screen action:** Type and send.

**Customer input:** «تسجيل حضور متأخر ان امكن» ("A late check-in, if possible")

(This is the approved response used in the full-conversation record. If you prefer no request, type «لا، ما عندنا طلبات» ("No, we don't have any requests"); the request field then stays empty.)

**Say this:**
> He asks for a late check-in, if possible. The concierge adds it to the booking and makes clear that requests are subject to availability.

**Wait / transition:** Wait for «تمام يا محمد، جهّزت لك النموذج ببياناتك المحفوظة وأضفت طلبكم، والطلبات حسب التوفر…» and the complete form «بيانات الضيفين» ("Guest details").

**Draw attention to:** The request is his own words, honestly framed.

---

### Step 21 · The complete prefilled form (8:40)

**On-screen action:** Point, top to bottom, to: title «السيد», first name «محمد», family name «باز», the e-mail, «+966» and «508416627», the wife's details «نورة» «الحربي», and the request field. Then click «اعتماد البيانات» ("Confirm details").

**Customer input:** Button «اعتماد البيانات». Posted as «اعتمدت بياناتي وبيانات زوجتي.» ("I've confirmed my details and my wife's.")

**Say this:**
> This is a fresh, complete form, prefilled from his saved profile, including his wife Noura's details and the request he just made. Every field stays editable. The small marker beside a field shows it came from his saved details. For a returning guest, that's the difference between retyping everything and checking it.

**Wait / transition:** Wait for «شكرًا لك يا محمد. راجع التفاصيل…» and the review card «مراجعة رحلتك» ("Review your trip").

**Draw attention to:** Less repeated typing, and the guest is still in control.

---

### Step 22 · Final review, with the option to edit (9:10)

**On-screen action:**
1. Click «تعديل البيانات» ("Edit details") on the review card. The form opens filled with what he confirmed.
2. Click «إلغاء» ("Cancel") to close it unchanged.
3. Under the card, tick «قرأت ووافقت على الشروط والأحكام وسياسة الخصوصية» ("I have read and accept the terms and conditions and privacy policy").
4. Click «البيانات صحيحة، نكمل» ("Details are correct, continue").

**Customer input:** The checkbox and the button. Posted as «البيانات صحيحة، نكمل».

**Say this:**
> One last look before payment: the villa, dates, airports, both guests, transfers, contact details and his request, marked subject to availability. If anything's wrong, he can edit it right here without starting over. He accepts the terms himself, and because his e-mail is already verified, he isn't asked for a second code.

**Wait / transition:** Wait for «تمام. هذا رابط الدفع الآمن على موقع Visit Red Sea لإتمام الحجز…» and the payment card «إجمالي رحلتك» ("Your trip total").

**Draw attention to:** Review and editing keep the guest in control. Consent is his own action.

---

### Step 23 · Payment hand-off (9:40)

**On-screen action:** Click «المتابعة للدفع» ("Continue to payment"). The official Visit Red Sea checkout opens in a new tab. Show it for two or three seconds, then switch back to the chat tab. The conversation continues on its own after about five seconds.

**Customer input:** Button «المتابعة للدفع». Posted as «المتابعة إلى الدفع على Visit Red Sea».

**Say this:**
> Payment happens where it should: on the official Visit Red Sea checkout, opened in a new tab with the stay already set. The concierge doesn't take or verify payment itself. In this demonstration, it continues the conversation after a short pause to show what the guest sees next.

**Wait / transition:** Back on the chat tab, wait for «تفاصيل رحلتك جاهزة يا محمد. هذا ملخص الحجز، وتقدر تحمّله بصيغة PDF:» ("Your trip details are ready, Mohammed. Here's the booking summary, and you can download it as a PDF") and the card «رحلتك بانتظارك» ("Your trip awaits").

**Draw attention to:** The official checkout. Be clear that no transaction is processed or confirmed in this demonstration.

---

### Step 24 · Confirmation, PDF and closing line (10:05)

**On-screen action:** Point to the summary, then click «تحميل PDF» ("Download PDF"). The file `Shebara_Booking_Summary_2026-10-23.pdf` downloads; open it from the browser's download bar for a few seconds. Return to the chat for the last message.

**Customer input:** Button «تحميل PDF».

**Say this:**
> He leaves with a clear record: the resort, villa, dates, airports, both guests, transfers, contact details and his request, all in one place, plus a branded PDF he can keep. And the concierge closes the way a good host would.

**Wait / transition:** The final message reads «نتمنى لك ولنورة إقامة هادئة في Shebara. حاضرين لأي تفاصيل تحتاجونها.» ("We wish you and Noura a peaceful stay at Shebara. We're here for anything you need.")

**Draw attention to:** The personal close, using his wife's name, and a summary the guest can keep.

---

## 3. Optional branch: new guest with a voice message

Use this only if someone asks to see the new-guest or voice path, after the main journey is complete. Don't switch mid-journey: the main conversation can't step back once «لدي حساب سابق» is chosen, and reloading the page starts a new conversation.

**Where to start:** a **second browser window** that you prepared before the session and advanced to the account choice «كيف تحب نكمل؟». To prepare it, open `http://127.0.0.1:8090/`, then:
1. Open the chat and send «أنا محمد», then «أبي إجازة هادئة أنا وزوجتي».
2. Press «اختيار» on Shebara in the first carousel.
3. Press «اختيار» on the One Bedroom Overwater Villa.
4. Send «إي نعم، بس أنا وزوجتي».
5. Pick 23 and 25 and press «تأكيد التواريخ», then «مناسب، نكمل».
6. Choose «بالطائرة», then «مطار ينبع» and «مطار البحر الأحمر الدولي – RSIA», then «اعتماد المطارات».
7. Press «اعتمد ونكمل», then «نختار عند الوصول».

Stop there and don't reload that window. If you didn't prepare one, the same steps take about two minutes in a fresh tab.

Microphone permission for `127.0.0.1:8090` must already be granted in that browser.

**Bridge line:**
> Let me show you the other path, a first-time guest who'd rather speak than type. I've set up a second conversation at the same point in the journey.

### V1 · Continue as a new guest

**On-screen action:** Click «متابعة كضيف جديد» ("Continue as a new guest").

**Say this:**
> A new guest goes straight to the details form, with no sign-in. His first name is already there from the conversation.

**Wait:** «حيّاك. أدخل بياناتك وبيانات زوجتك هنا، ونكمل الحجز على طول.» and the form.

### V2 · Record a voice message from the normal composer

**On-screen action:** Click the microphone button next to the send arrow («تسجيل رسالة صوتية», "Record a voice message"). The message box turns into a recorder with a live waveform and timer. Speak the line below in Arabic, then click «إيقاف» ("Stop"). Optionally press play to preview, then click the send arrow.

**What to say into the microphone (Arabic):** «أنا محمد باز. رقم جوالي 508416627. زوجتي نورة الحربي. وإذا أمكن، نبغى تسجيل وصول متأخر.» ("I'm Mohammed Baz. My mobile is 508416627. My wife is Noura Alharbi. And if possible, we'd like a late check-in.")

Say exactly this. In this build, the details taken from a voice message follow a prepared mapping for this scenario, so what you say must match what the form will show.

**Say this (to the audience):**
> Instead of typing, he records his details as a voice note, right from the same message box. In this build, extracting the details from the voice note uses a prepared mapping for this scenario. In production, that step would connect to a speech-to-text and extraction service.

### V3 · The new prefilled form

**Wait:** His voice bubble appears on the right with its duration and a play button. The agent replies «رتّبت لك البيانات اللي ذكرتها يا محمد، وتلقاها في النموذج تحت…» and names what's still missing, the e-mail address. A **new** form is added below, and the earlier form stays in the thread but inactive.

**Say this:**
> The concierge sends a new form, filled with what he said, and tells him exactly what's still missing. The e-mail address isn't taken from voice, so he types it himself. The earlier form stays in the conversation but is no longer active, so there's never confusion about which one counts.

**Draw attention to:** The marker on each field filled from the voice note, and the honest "still missing" line.

### V4 · Complete and continue without a code

**On-screen action:** Type `muhammed.baz@clouding.ai` in «البريد الإلكتروني», check the other fields, click «اعتماد البيانات». At the review, tick the terms box and click «البيانات صحيحة، نكمل». Stop at the payment card.

**Say this:**
> A new guest continues straight to review and payment. There's no e-mail code here, because there are no saved details to protect.

---

## 4. Closing (about 25 seconds)

> So that's the journey from one guest's point of view: a natural first message, help choosing between two resorts, a stay built step by step with the costs always visible, his saved details brought back securely, and a clear summary to keep at the end.
>
> We'd love your reaction on three things. Does the experience feel right for your guests and your brand voice? What would your teams need operationally? And which systems, such as booking, pricing, guest profiles and payment, would it need to connect to for a production rollout?

---

## 5. One-page rehearsal cheat sheet

| # | Do | Type or press (Arabic) | Meaning | Key line |
|---|---|---|---|---|
| 1 | Click launcher, bottom right | «تحدث مع رفيق رحلتك» | Talk to your trip companion | "A companion the guest can open at any time." |
| 2 | Send | «أنا محمد» | I'm Mohammed | "I'll play Mohammed." |
| 3 | Send | «أبي إجازة هادئة أنا وزوجتي» | A quiet holiday for my wife and me | "Three suggestions right in the conversation." |
| 4 | Click Shebara photo, return to tab | (photo link) | | "Looking never selects anything." |
| 5 | Send | «صراحة محتار بين Shebara وDesert Rock، وش ترشح لي؟» | Torn between the two | "Criterion by criterion." |
| 6 | Arrows ‹ › through 5 cards | | | Island vs valley · 73 villas vs 54 + 10 suites · dive centre vs adventure centre · thumbnails |
| 7 | Read recommendation | | | "Starts from what he told us." |
| 8 | Two-card carousel: Shebara | «اختيار» | Choose | "His choice becomes his reply." |
| 9 | One Bedroom Overwater Villa | «اختيار» | Choose | "SAR 28,980, two nights, taxes included, evidenced rate." |
| 10 | Send | «إي نعم، بس أنا وزوجتي» | Yes, just my wife and me | "Drives rate and transfers." |
| 11 | Calendar 23 → 25 | «تأكيد التواريخ» | Confirm dates | "Nights worked out for him." |
| 12 | Summary card | «مناسب، نكمل» | Looks good, continue | "A checkpoint before each new cost." |
| 13 | By plane, airports | «بالطائرة» · «مطار ينبع» · «مطار البحر الأحمر الدولي – RSIA» · «اعتماد المطارات» | By plane · Yanbu · RSIA · Confirm | "Arrival and departure can differ." |
| 14 | Point to both transfers | | | "SAR 3,622.50 in, SAR 1,191.40 out, both pictured." |
| 15 | Updated summary | «اعتمد ونكمل» | Approve and continue | "Total SAR 33,793.90, taxes included." |
| 16 | Reply button | «نختار عند الوصول» | We'll choose on arrival | "Nothing added, total unchanged." |
| 17 | Account card | «لدي حساب سابق» | I have an existing account | "Sign in, or fill in as new." |
| 18 | E-mail, send, inbox, code, verify | muhammed.baz@clouding.ai · «إرسال الرمز» · «تحقق» | Send code · Verify | "Details released only after verification." |
| 19 | Read question | | | "No request is carried over or added by itself." |
| 20 | Send | «تسجيل حضور متأخر ان امكن» | A late check-in, if possible | "Subject to availability." |
| 21 | Form | «اعتماد البيانات» | Confirm details | "Checking, not retyping." |
| 22 | Edit, cancel, tick terms, continue | «تعديل البيانات» · «إلغاء» · terms box · «البيانات صحيحة، نكمل» | Edit · Cancel · Correct, continue | "No second code for a verified e-mail." |
| 23 | Payment, new tab, return | «المتابعة للدفع» | Continue to payment | "Official checkout. No payment processed here." |
| 24 | Download | «تحميل PDF» | Download PDF | "A clear record to keep." |

Wait signal before every action: «المساعد يكتب…» has cleared and the send arrow is active.

---

## 6. Private preparation and recovery notes

### Launch and readiness

- **Start V2:** double-click `D:\Clouding\RSG\visitredsea-chat-mockup-v2\start.cmd`, or run `python server.py 8090` in that folder. Use `http://127.0.0.1:8090/` only, never the `index.html` file directly. V1 uses 8080; don't open it by mistake.
- Neither server was running when this script was written. If a V2 server was already running before the latest changes, stop it and start it again, so it loads the current server code.
- **Readiness check:** open `http://127.0.0.1:8090/api/otp/status` and confirm both of these. This check sends nothing.
  - `"configured": true` means the mail settings in `.env` are loaded.
  - `"profileStore": true` means the app's own profile store exists. It currently holds the approved account, muhammed.baz@clouding.ai.
- **E-mail:** codes go only to approved addresses. The default is muhammed.baz@clouding.ai, set by `OTP_ALLOWED_RECIPIENTS`. Do one full rehearsal on the day, including a real code, to confirm delivery and spam-folder behaviour.
- **What the saved profile is:** the record is stored in the application's own profile store, not in an RSG customer database. If asked, say so plainly.

### Tabs and windows

1. Chat tab: `http://127.0.0.1:8090/`, freshly loaded, chat closed. Don't reload it during the demo, because conversations aren't saved and a reload starts over.
2. Mailbox tab for muhammed.baz@clouding.ai, newest first.
3. Optional second window, prepared for the voice branch and paused at «كيف تحب نكمل؟», with microphone permission granted. It's also your fallback if e-mail fails.
4. Close the official resort and checkout tabs after each use, so you return to the chat cleanly.

### The approved scenario

Every value here comes from the app's data.

- **Resort and villa:** Shebara, One Bedroom Overwater Villa, Villa Flat Rate, SAR 28,980.00 for two nights, taxes included.
- **Guests and dates:** 2 adults; Friday 23 to Sunday 25 October 2026.
- **Travel:** by plane, arriving at Yanbu Airport and departing from Red Sea International Airport (RSIA).
- **Transfers:** arrival is a private luxury car and shared leisure boat, SAR 3,622.50. Departure is a shared speed boat and private luxury car, SAR 1,191.40. Transfers total SAR 4,813.90.
- **Total:** SAR 33,793.90, all taxes included.
- **Experiences:** deferred to arrival.
- **Guest profile:** returning guest muhammed.baz@clouding.ai. Title السيد, محمد باز, +966 508416627, wife نورة الحربي.
- **Request:** «تسجيل حضور متأخر ان امكن».

### Inconsistencies to know before presenting

1. **The booking dates are now in the past.** The scenario is fixed to 23 to 25 October 2026, the only dates with an evidenced rate, and today is after them. The calendar accepts them, but someone may notice. The official checkout page may also not accept past dates when it opens. If asked: "These are the dates of the rate we evidenced for this scenario. Live dates, availability and pricing would come from Red Sea Global's booking engine." Updating the scenario dates needs a new evidenced rate and an app change, which wasn't part of this script.
2. **The review message for a returning guest** says «…ونكمل للتحقق من البريد» ("…and continue to e-mail verification"). His e-mail is already verified, and no second code is requested. Don't read that sentence aloud.
3. **The calendar's caption** shows the range as «25–23 أكتوبر 2026». The customer message and summaries state the dates correctly.
4. **The party question** in V2 is «الإقامة لك ولزوجتك فقط؟» ("only you and your wife?"). Answer «إي نعم، بس أنا وزوجتي». The older walkthrough's «لا، بس أنا وزوجتي» is also accepted, but reads oddly against this question.
5. **Voice branch:** extraction uses a prepared mapping that includes a late check-in request, so speak the prepared line exactly. Don't describe it as live speech recognition.
6. **Payment:** the conversation's continuation is timed in the experience, about five seconds after the click. It isn't a response from a payment provider. Never say the payment went through.

### Pacing: don't get ahead of the agent

- Replies arrive with a typing pause, roughly 1.5 to 7 seconds per message, longer for long messages.
- While «المساعد يكتب…» shows in the header, the send arrow is disabled. Wait for it to clear.
- Components belong to the message before them, so wait for the card, not just the text.
- If «رسائل جديدة» appears, content arrived below the visible area. Click it to jump there.
- Only click the controls listed in each step. A used card is greyed out and won't respond again.

### Recovery lines (truthful and calm)

**E-mail code is slow**
> "Delivery can take a moment depending on the mail service. The important part is that nothing personal is released until this code is confirmed."
- After 30 seconds, click «إعادة الإرسال» ("Resend") and use the newest code. Codes last 5 minutes.
- If it still doesn't arrive: "Rather than keep you waiting, I'll show the same step from the new-guest side, and I'm happy to show sign-in again afterwards." Then move to the prepared second window.

**A reply is slow**
> "The concierge paces its replies the way a person would type. It'll be with us in a moment."

**An official resort page or the checkout loads slowly**
> "That's the official site loading in its own tab. The conversation stays exactly where we left it."
- Switch back to the chat tab. The conversation continues regardless.

**Unexpected input or a wrong click.** The concierge answers out-of-scope input with a short guiding reply.
> "It keeps the guest on track and asks for what it needs. Let me give it that."
- **Another villa:** the agent explains it needs to confirm that price first and offers the One Bedroom Overwater Villa. Accept that offer.
- **Other dates:** the agent says the price needs updating first. Select 23 and 25 again, or type «من 23 إلى 25 أكتوبر».
- **Wrong airport:** the agent offers the Yanbu and RSIA combination. Accept it.
- **Forgot the terms box:** the agent asks for consent first. Tick the box, then press «البيانات صحيحة، نكمل» again.
- **Mistyped e-mail before sending the code:** correct it in the field. After sending, use «تغيير البريد» ("Change e-mail").

### Things not to claim

- **Inventory and pricing:** no live inventory or live pricing.
- **Customer data:** no integration with an RSG customer database. The profile is stored by the application.
- **Payment:** the concierge doesn't process or verify payments.
- **Voice:** no live speech recognition in this build.
- **Readiness:** not production-ready, and no delivery dates.
- **Results:** no conversion, cost or accuracy figures.
