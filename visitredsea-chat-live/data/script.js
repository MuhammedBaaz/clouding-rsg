/* ============================================================
   Concierge script (Saudi Arabic), V2 Quiet Tide edition.
   The engine in js/chat.js moves through the stages below; this file
   holds the words and the quick-reply metadata.

   Placeholders: {name} first name, {wife} second guest's first name,
   {email} submitted email, {in}/{out} chosen dates, {resort}, {villa}.
   {{...}} keeps English names LTR inside Arabic.
   A reply item is a string, { text, component } or { quick: [...] }.
   quick items carry stable action ids (see QUICK in js/chat.js); the
   label is display only. They are rendered after the turn's messages.
   ============================================================ */
window.SCRIPT = {
  greeting: "يا هلا بك في البحر الأحمر. أنا رفيق رحلتك لترتيب الإقامة من أول خطوة إلى الوصول. وش الاسم اللي تحب نناديك فيه؟",

  name: {
    ok: ["حياك الله يا {name}. كيف أقدر أساعدك؟"],
    fallback: "يسعدني أخدمك. عشان أناديك باسمك، وش اسمك الكريم؟"
  },

  intent: {
    ok: [{ text: "أقترح لكم هذه الوجهات يا {name}. أيها أقرب لجوّكم؟ وإذا تحب تتصفح أكثر، فرابط «استكشف المزيد» تحت الاقتراحات.", component: "resortPick" }],
    fallback: "على راحتك. تحب أقترح لك وجهات لإجازة لك ولزوجتك، ولا عندك طلب محدد نبدأ فيه؟"
  },

  resort: {
    ok: [
      { text: "اختيار موفّق. هذه نبذة سريعة عن {{{resort}}}:", component: "resortDetails" },
      { text: "وهذه خيارات الفلل، وأقدر أرتب لك التفاصيل بعدها:", component: "villas" }
    ],
    other: [
      { text: "خيار جميل. هذه نبذة عن {{{resort}}}:", component: "resortDetails" },
      { text: "حاليًا أقدر أكمل لك الحجز في {{Shebara}} مباشرة. إذا يناسبك، نكمل عليه.", quick: [{ id: "resort_shebara", label: "نكمل مع Shebara", primary: true }] }
    ],
    fallback: { text: "اختر أحد المنتجعات المقترحة، أو اكتب لي اسم المنتجع وأعرض لك نبذة عنه.", quick: [{ id: "resort_shebara", label: "نكمل مع Shebara", primary: true }] }
  },

  villa: {
    ok: ["اختيار جميل لإقامتكم. أتأكد منك: الإقامة لك ولزوجتك فقط؟"],
    other: [{ text: "سعر {{{villa}}} لهذه التواريخ أحتاج أتأكد منه قبل ما أعطيك رقم. إذا تحب، نكمل على {{One Bedroom Overwater Villa}} وسعرها مؤكد عندي.", quick: [{ id: "villa_supported", label: "نكمل على فيلا فوق الماء بغرفة نوم واحدة", primary: true }] }],
    fallback: "اختر الفيلا التي تناسبكم من القائمة، وأكمل لك على طول."
  },

  party: {
    ok: [{ text: "تمام. متى تحبون يكون الوصول والمغادرة؟", component: "calendar" }],
    fallback: "بس أتأكد منك: الإقامة لك ولزوجتك فقط؟ وإذا كان معكم أحد، اكتب لي عدد الضيوف."
  },

  dates: {
    ok: [
      { text: "توقيت جميل. هذا ملخص الإقامة:", component: "summary1" },
      "إذا الملخص مناسب، نكمل لترتيب الوصول."
    ],
    other: [{ text: "للتواريخ من {in} إلى {out} أحتاج تحديث السعر قبل التأكيد، فلا أقدر أثبّت المبلغ المعروض عليها. إذا تحب نكمل الآن على 23 إلى 25 أكتوبر 2026 وسعرها جاهز عندي.", quick: [{ id: "dates_supported", label: "اختيار 23 إلى 25 أكتوبر 2026", primary: true }] }],
    invalid: "المغادرة يجب أن تكون بعد الوصول.",
    fallback: "حدّد يوم الوصول ثم يوم المغادرة في التقويم، وأكمل لك."
  },

  approve1: {
    ok: [{ text: "كيف بتوصلون للبحر الأحمر؟", component: "modes" }],
    fallback: { text: "إذا ملخص الإقامة مناسب نكمل لترتيب الوصول، وإذا تحب تراجع التفاصيل فهي فوق.", quick: [{ id: "approve1_ok", label: "مناسب، نكمل", primary: true }] }
  },

  mode: {
    ok: [{ text: "حدد مطار الوصول ومطار المغادرة. تفاصيل الرحلات اختيارية.", component: "airports" }],
    other: [{ text: "هذه الرحلة مُعدّة للوصول بالطائرة، مع تنقلات خاصة من المطار إلى {{Shebara}} وبالعكس. نكمل عليها؟", quick: [{ id: "mode_plane", label: "نعم، بالطائرة", primary: true }] }],
    fallback: "اختر طريقة الوصول من الخيارات فوق."
  },

  airports: {
    ok: [
      { text: "سجّلت المطارات. هذه تنقلاتكم من المطار إلى {{Shebara}} وبالعكس:", component: "transportTrip" },
      { text: "وهذا الملخص بعد إضافة التنقلات:", component: "summary2" },
      "إذا كل شيء واضح، نعتمد ونكمل."
    ],
    other: [{ text: "لهذه المطارات أحتاج تحديث خيارات التنقل وأسعارها قبل المتابعة. إذا تحب نكمل الآن، الوصول على {{Yanbu Airport}} والمغادرة من {{Red Sea International Airport - RSIA}} وترتيبها جاهز عندي.", quick: [{ id: "airports_supported", label: "نكمل على مطار ينبع ومطار البحر الأحمر الدولي", primary: true }] }],
    fallback: "اختر مطار الوصول ومطار المغادرة في النموذج ثم اعتمدها."
  },

  approve2: {
    ok: [{ text: "وهذه تجارب ممكن تستكشفونها خلال الإقامة. تقدرون تقررون الآن أو عند الوصول:", component: "activities" }, { quick: [{ id: "activities_defer", label: "نختار عند الوصول", primary: true }] }],
    fallback: { text: "إذا الملخص بعد التنقلات مناسب، نعتمد ونكمل.", quick: [{ id: "approve2_ok", label: "اعتمد ونكمل", primary: true }] }
  },

  activities: {
    ok: [
      "ولا يهمك. ما أضفت أي تجربة، والإجمالي كما هو. فريق المنتجع يساعدكم تختارون ما يناسبكم عند الوصول، حسب التوفر.",
      { text: "نحتاج بياناتك وبيانات زوجتك يا {name} عشان نكمل الحجز. إذا سبق وسجّلت معنا، تقدر تدخل ببريدك الإلكتروني ونسترجع بياناتك المحفوظة، أو تكمل كضيف جديد.", component: "accountChoice" }
    ],
    add: [{ text: "بكل سرور. أقدر أرتب لكم التجارب مع فريق المنتجع بعد ما نثبّت الحجز. نكمل الحجز الآن ونرجع للتجارب؟", quick: [{ id: "activities_defer", label: "نعم، نكمل الحجز", primary: true }] }],
    fallback: { text: "تحبون تقررون التجارب الآن، ولا نختارها عند الوصول؟", quick: [{ id: "activities_defer", label: "نختار عند الوصول", primary: true }] }
  },

  voice: {
    /* sent with a NEW prefilled form; {missing} lists the required fields that are still empty */
    ack: "رتّبت لك البيانات اللي ذكرتها يا {name}، وتلقاها في النموذج تحت. باقي {missing}؛ راجع البيانات وأكمل الناقص عشان نتابع الحجز.",
    ackComplete: "رتّبت لك البيانات اللي ذكرتها يا {name}، وتلقاها في النموذج تحت. راجعها، وإذا كل شيء صحيح اعتمدها ونتابع الحجز.",
    other: ["وصلتني رسالتك الصوتية. عشان أضمن لك الدقة، اكتب لي ما تحتاجه هنا أو استخدم الخيارات في البطاقة، وأكمل لك على طول."],
    fallback: "خذ راحتك يا {name}، وأكمل بياناتك وبيانات زوجتك في النموذج فوق، وأنا أكمل لك على طول."
  },

  /* Guest details: returning customer (verify the e-mail first, then the saved profile) or new guest (no code) */
  account: {
    guest: [{ text: "حيّاك. أدخل بياناتك وبيانات زوجتك هنا، ونكمل الحجز على طول.", component: "guestForm" }],
    login: [{ text: "أبشر. اكتب بريدك الإلكتروني اللي سجّلت فيه، ونرسل لك رمز تحقق من 6 أرقام. بعد التحقق نسترجع بياناتك المحفوظة.", component: "signIn" }],
    askRequests: "أهلًا بعودتك، تم التحقق من بريدك واسترجعت بياناتك المحفوظة. هل عندكم أي طلب خاص تحبون نضيفه لإقامتكم يا {name}؟ وإذا ما عندكم طلبات، نكمل بدونها.",
    requestsClarify: "أبشر، ما الطلب الذي تحبون نضيفه؟ وإذا ما عندكم طلب، أخبرني «لا» ونكمل.",
    readyWithRequest: "تمام يا {name}، جهّزت لك النموذج ببياناتك المحفوظة وأضفت طلبكم، والطلبات حسب التوفر. راجع البيانات وعدّل ما تحتاجه، ثم اعتمدها ونتابع الحجز.",
    readyNoRequest: "تمام يا {name}، جهّزت لك النموذج ببياناتك المحفوظة. راجع البيانات وعدّل ما تحتاجه، ثم اعتمدها ونتابع الحجز.",
    stillMissing: "باقي {missing}؛ أكمله قبل الاعتماد.",
    notFound: "تم التحقق من بريدك، لكن ما لقيت بيانات محفوظة مرتبطة فيه. تقدر تكمل كضيف جديد: أدخل بياناتك وبيانات زوجتك في النموذج تحت ونتابع الحجز.",
    profileError: "تم التحقق من بريدك، لكن تعذّر استرجاع بياناتك الآن. تقدر تدخل بياناتك في النموذج تحت ونتابع الحجز.",
    fallback: "اختر من البطاقة: «لدي حساب سابق» أو «متابعة كضيف جديد».",
    loginFallback: "اكتب بريدك في البطاقة واضغط إرسال الرمز. وإذا تحب تكمل كضيف جديد، أخبرني."
  },

  /* Undecided between Shebara and Desert Rock: comparison (facts), then a separate recommendation, then the choice */
  compare: {
    ok: [
      { text: "سؤال في محلّه يا {name}. هذه أهم الفروق بين المنتجعين، معيارًا بمعيار:", component: "compare" },
      "بما إنك تخطط لإجازة مع زوجتك، أرشّح لك {{Shebara}}: جزيرة يحيط بها البحر، فيها فلل بمسبح خاص فوق الماء وعلى الشاطئ، والشعاب قريبة من الشاطئ، وأجواؤها تناسب الاسترخاء. ويتميّز {{Desert Rock}} بطابع جبلي ومغامرات لمن يحب ذلك في رحلة أخرى. والقرار لكم:",
      { component: "comparePick" }
    ]
  },

  guest: {
    ok: [
      { text: "شكرًا لك يا {name}. راجع التفاصيل، وتقدر تعدّل بياناتكم من هنا. إذا كل شيء صحيح، أكّد الموافقة على الشروط ونكمل للتحقق من البريد.", component: "review" }
    ],
    fallback: "راجع البيانات في النموذج فوق، وأضف بريدك الإلكتروني، ثم اعتمد البيانات وأكمل لك."
  },

  review: {
    /* new guest, or an account holder whose verified e-mail is unchanged: straight to the payment hand-off */
    ok: [{ text: "تمام. هذا رابط الدفع الآمن على موقع {{Visit Red Sea}} لإتمام الحجز، والإجمالي {{SAR 33,793.90}} شامل الضرائب:", component: "payment" }],
    /* only an account holder who changed the verified e-mail */
    verifyNew: [{ text: "غيّرت البريد الإلكتروني، فنؤكد العنوان الجديد قبل الدفع. اضغط إرسال الرمز، وبيوصلك رمز من 6 أرقام على {{{email}}}.", component: "verify" }],
    updated: [{ text: "حُفظت التعديلات يا {name}. هذه المراجعة بعد التعديل، وإذا كل شيء صحيح أكّد الموافقة على الشروط ونكمل.", component: "review" }],
    terms: { text: "قبل ما نكمل، أحتاج موافقتك على الشروط والأحكام وسياسة الخصوصية من المربع في المراجعة.", quick: [{ id: "review_confirm", label: "وافقت، نكمل", primary: true }] },
    fallback: { text: "إذا البيانات صحيحة، أكّد الموافقة على الشروط ونكمل. وإذا تحب تعديل شيء، اضغط «تعديل البيانات» في المراجعة.", quick: [{ id: "review_confirm", label: "البيانات صحيحة، نكمل", primary: true }] }
  },

  verify: {
    ok: [{ text: "تم التحقق. هذا رابط الدفع الآمن على موقع {{Visit Red Sea}} لإتمام الحجز، والإجمالي {{SAR 33,793.90}} شامل الضرائب:", component: "payment" }],
    fallback: "أدخل رمز التحقق الذي وصلك على بريدك في البطاقة فوق، وإذا ما وصلك اطلب إرساله من جديد."
  },

  /* Live build: delivered when the customer comes back from the official checkout tab (or five seconds after the
     click). This demo receives no payment-provider result, so the concierge says so and hands over the trip
     summary and the PDF; nothing here claims the payment or the reservation is confirmed. */
  payment: {
    unverified: [
      "رجعت من صفحة الدفع يا {name}. تأكيد الدفع وتأكيد الحجز يصلانك من {{Visit Red Sea}} مباشرة.",
      { text: "هذا ملخص رحلتك كما رتبناها، وتقدر تحمّله بصيغة {{PDF}}:", component: "confirmation" },
      "نتمنى لك ول{wife} إقامة هادئة في {{Shebara}}. حاضرين لأي تفاصيل تحتاجونها."
    ],
    fallback: "أكمل الدفع من الرابط في البطاقة فوق، وأنا أكمل لك هنا مباشرة."
  },

  /* Page hand-off (live build): the concierge asked the page to scroll to the resort cards and highlight them. */
  navigate: {
    lead: "خلني أوريك المنتجعات على الصفحة نفسها. أصغّر المحادثة لحظة، وتقدر تختار من البطاقات أو ترجع لي من الشريط تحت.",
    miniBar: "اختر منتجعًا من البطاقات، ثم ارجع إلى المحادثة",
    miniBarNew: "وصلتك رسالة جديدة في المحادثة"
  },

  /* Live agent connection states */
  live: {
    unavailable: "تعذر الاتصال بالمساعد الآن. حاول مرة أخرى بعد لحظات، وما راح تفقد مكانك في الحجز.",
    notConfigured: "اتصال المساعد غير مهيّأ على هذا الخادم بعد (مفتاح الاتصال أو معرّف الوكيل غير موجود).",
    expired: "انتهت هذه الجلسة. ابدأ محادثة جديدة من القائمة لنكمل.",
    voiceUnavailable: "وصلتني رسالتك الصوتية، لكن التفريغ الصوتي غير مهيّأ في هذه النسخة، فما أقدر أستخرج بياناتك منها. تقدر تكتب البيانات في النموذج ونكمل على طول.",
    /* Studio widget path (agent/studio_bridge.py): steps that exist only as website components are named, never faked */
    /* no terms step in the widget (12 Nov 2026): replaces «أكّد الموافقة على الشروط ونكمل…» in the review lines; the official checkout shows its own terms */
    reviewNextWidget: "نكمل للدفع",
    widgetStep: "هذه الخطوة (تسجيل الدخول ببريدك، أو نموذج البيانات، أو التحقق من البريد) تتم في صفحة الحجز الكاملة على الموقع، وليست داخل هذه المحادثة بعد. بياناتك الشخصية ما نستلمها هنا.",
    datesWidget: "اكتب لي تاريخ الوصول وتاريخ المغادرة بالشهر والسنة، مثل: الوصول 23 أكتوبر 2026 والمغادرة 25 أكتوبر 2026.",
    editWidget: "تعديل البيانات متاح في صفحة الحجز الكاملة على الموقع.",
    checkoutWidget: "هذا رابط الدفع الآمن على موقع Visit Red Sea، افتحه لإتمام الحجز. هذه المحادثة ما تستلم نتيجة الدفع، فتأكيد الحجز يصلك من الموقع مباشرة.",
    pdfLink: "ملف تفاصيل رحلتك جاهز يا {name}: {link}",
    pdfLinkLabel: "تحميل ملف PDF",
    checkoutLinkLabel: "المتابعة للدفع",
    pdfNotReady: "ملف تفاصيل الرحلة يصبح متاحًا بعد اكتمال الحجز.",
    /* Guest details collected in the chat (widget path, 10 Nov 2026): never card numbers or codes */
    guestAsk: "تمام يا {name}. عشان أكمل الحجز أحتاج بياناتك: الاسم الأول واسم العائلة، البريد الإلكتروني، ورقم الجوال. وإذا زوجتك معك، اسمها الأول واسم عائلتها. تقدر تكتبها كلها في رسالة واحدة.",
    /* The title (السيد / السيدة) is taken from the first name when it is clear; only an unclear name gets this one question */
    titleAsk: "وش اللقب اللي تفضّله في بيانات الحجز، السيد أو السيدة؟",
    guestMissing: "سجّلت اللي كتبته. باقي {missing}؛ اكتبها وأكمل لك.",
    guestInvalid: "ما قدرت أعتمد {invalid}، تأكد منها واكتبها من جديد لو سمحت.",
    askRequests: "هل عندكم أي طلب خاص تحبون نضيفه لإقامتكم يا {name}؟ وإذا ما عندكم طلبات، قول «لا» ونكمل.",
    signInWidget: "تسجيل الدخول برمز البريد غير متاح في هذه المحادثة، فما أقدر أسترجع بيانات محفوظة هنا. نكمل ببياناتك مباشرة:",
    editAsk: "اكتب لي البيانات اللي تحب تعدّلها (مثلًا البريد الإلكتروني أو رقم الجوال) وأحدّثها لك في المراجعة.",
    /* Widget components (11 Nov 2026): the website renders a calendar and a guest form from these blocks */
    calendarTitle: "متى تحبون يكون الوصول والمغادرة؟",
    calendarSubmit: "اعتماد التواريخ",
    formLead: "تمام يا {name}. عشان أكمل الحجز، عبّي بياناتك في النموذج، وإذا زوجتك معك أضف اسمها.",
    formLeadEdit: "تمام يا {name}، عدّل اللي تحتاجه في النموذج ثم اعتمده، وأحدّث لك المراجعة.",
    formLeadFix: "راجع الحقل المحدد في النموذج واعتمد البيانات من جديد.",
    formTitle: "بيانات الحجز",
    formSubmit: "اعتماد البيانات",
    /* Loyalty points (agent/loyalty.py; configurable rules) */
    redeemOffer: "عندك رصيد {balance} نقطة ولاء من حجوزاتك السابقة، تساوي {value}. تحب تستخدمها في هذا الحجز قبل الدفع؟",
    redeemApplied: "تم. استخدمت {points} نقطة بقيمة {value}، فالإجمالي للدفع {payable}. إذا البيانات صحيحة، أكّد الموافقة على الشروط ونكمل.",
    redeemCleared: "تمام، ما استخدمنا النقاط، والإجمالي {payable}. إذا البيانات صحيحة، أكّد الموافقة على الشروط ونكمل.",
    redeemTooMany: "أقصى ما تقدر تستخدمه {max} نقطة ({value}) حسب رصيدك وإجمالي الحجز. كم نقطة تحب تستخدم؟",
    redeemNone: "ما عندك رصيد نقاط ولاء بعد؛ تكسب نقاطك من هذا الحجز. إذا البيانات صحيحة، أكّد الموافقة على الشروط ونكمل.",
    /* After the payment link: the application prepares the trip details itself a few seconds later (no card is charged,
       no reservation is created, no provider result is received, and nothing below claims otherwise) */
    checkoutLead: "هذا رابط الدفع الآمن على موقع Visit Red Sea، والإجمالي {payable}.",
    checkoutNote: "وخلال لحظات أجهّز لك تفاصيل رحلتك هنا.",
    completed: "تفاصيل رحلتك جاهزة يا {name}. تأكيد الدفع وتأكيد الحجز يصلانك من موقع Visit Red Sea مباشرة.",
    /* Only this booking's award is quoted (never a running balance): {points} is the award with a thousands separator */
    loyaltyClose: "يا {name}، كسبت من حجزك هذا {points} نقطة ولاء، وتقدر تستخدمها في حجوزاتك الجاية. {redeemedLine}نتمنى لك {companion}إقامة جميلة في {{{resort}}}.",
    loyaltyRedeemedLine: "واستخدمت {redeemed} نقطة في هذا الحجز. ",
    cancelled: "تمام، أوقفت خطوة الدفع. هذه مراجعة حجزك؛ إذا تحب تعدّل شيء اكتبه لي، أو أكّد الموافقة على الشروط ونكمل."
  },

  done: {
    ok: ["إذا احتجت أي شيء قبل الرحلة أو خلالها، أنا موجود."]   /* live build: no claim that the booking is confirmed */
  },

  customer: {
    resort: "نختار {{{resort}}}.",
    villa: "أختار {{{villa}}} على {{Villa Flat Rate}}.",
    dates: "الوصول {in} والمغادرة {out}، {nightsWord}.",
    mode: "{modeWord}.",
    airports: "الوصول على {{{arrival}}} والمغادرة من {{{departure}}}.",
    guest: "اعتمدت بياناتي وبيانات زوجتي.",
    guestSolo: "اعتمدت بياناتي.",
    guestEdit: "عدّلت البيانات وحفظتها.",
    verify: "أدخلت الرمز."
  },

  words: {
    fieldNames: { title: "اللقب", firstName: "اسمك الأول", familyName: "اسم العائلة", email: "بريدك الإلكتروني", mobile: "رقم جوالك" },
    formSuperseded: "حلّ محل هذا النموذج نموذج محدّث أدناه.",
    nights: { 1: "ليلة واحدة", 2: "ليلتان", many: "{n} ليالٍ", lots: "{n} ليلة" },
    modes: { "By Plane": "بالطائرة", "By Private Jet": "بطائرة خاصة", "By Car": "بالسيارة", "By Yacht": "باليخت" },
    wifeDefault: "زوجتك",
    voiceLabel: "رسالة صوتية"
  },

  scenario: {
    name: "محمد",
    voice: {
      title: "السيد",
      familyName: "باز",
      mobileCode: "+966",
      mobile: "508416627",
      guest2First: "نورة",
      guest2Family: "الحربي",
      requests: "تسجيل وصول متأخر إن أمكن",
      transcript: "أنا محمد باز. رقم جوالي 508416627. زوجتي نورة الحربي. وإذا أمكن، نبغى تسجيل وصول متأخر."
    },
    emailTyped: "muhammed.baz@clouding.ai"
  },

  menu: { newConversation: "بدء محادثة جديدة" }
};
