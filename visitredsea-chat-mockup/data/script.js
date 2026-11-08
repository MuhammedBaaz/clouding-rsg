/* ============================================================
   Concierge script (Saudi Arabic). The engine in js/chat.js moves
   through the stages below; this file holds only the words.

   Placeholders: {name} = customer's first name, {wife} = second
   guest's first name (or "زوجتك"), {email} = submitted email,
   {in}/{out} = chosen dates, {nights} = stay length,
   {resort} = resort chosen on the page, {villa} = villa chosen.
   Wrap English names in {{...}} to keep them LTR inside Arabic.
   Each stage has:  ok = replies when the customer's input fits,
                    fallback = a neutral request when it does not.
   A reply item is a string or { text, component, quick }. `quick` lists
   the quick replies shown beneath that turn: { id, label, primary }; the
   id resolves to an engine action in js/chat.js (QUICK), never the label.
   ============================================================ */
window.SCRIPT = {
  greeting: "حيّاك الله في {{Visit Red Sea}}، ومساء الخير. أنا مساعدك الشخصي للحجز في البحر الأحمر، وبكل سرور أرتّب لك إقامة على ذوقك من أول خطوة إلى آخرها. قبل ما نبدأ، كيف تحب أناديك؟",

  name: {
    ok: ["يا هلا {name}، نوّرتنا. قل لي وش في بالك، وأنا أرتّب لك كل شي."],
    fallback: "يسعدني أخدمك. بس عشان أناديك باسمك على مدار حديثنا، وش اسمك الكريم؟"
  },

  intent: {
    ok: ["خذ راحتك يا {name} في تصفّح المنتجعات، أنا بانتظار اختيارك. إذا شدّك منتجع، اضغط «اختر» ونكمل تفاصيله مع بعض."],
    fallback: "على راحتك تمامًا. تحب أعرض لك منتجعاتنا تتصفحها أول، ولا عندك طلب محدد نبدأ فيه؟"
  },

  resort: {
    ok: [
      "ما شاء الله، ذوقك عالي يا {name}. {{{resort}}} من أرقى منتجعات الجزر عندنا، وهذي نبذة عنه:",
      { component: "resortDetails" },
      "وهذي أنواع الفلل في {{{resort}}}، وكلها بمسبح خاص وإطلالة مفتوحة على البحر. اختر اللي يناسبكم:",
      { component: "villas" }
    ],
    other: [
      "خيار جميل. هذي نبذة عن {{{resort}}}:",
      { component: "resortDetails" },
      { text: "حاليًا أقدر أكمل لك الحجز في {{Shebara}} مباشرة. إذا يناسبك، اختره من قسم المنتجعات، وإذا تحب تشوف منتجع ثاني فأنا معك.", quick: [{ id: "resort_shebara", label: "نكمل مع Shebara", primary: true }] }
    ],
    fallback: { text: "اختر المنتجع اللي يعجبك من قسم المنتجعات في الصفحة، أو اكتب لي اسمه وأعرض لك تفاصيله.", quick: [{ id: "resort_shebara", label: "نكمل مع Shebara", primary: true }] }
  },

  villa: {
    ok: ["اختيار يليق فيك. بس أتأكد منك قبل ما نكمل: الإقامة لك ولزوجتك فقط، ولا بينضم لكم أحد؟ وللعلم، الأطفال تحت 12 سنة إقامتهم مجانية إذا شاركوا الوالدين نفس الفيلا، بحسب سعة الفيلا والشروط المعلنة. الوجبات والمواصلات والأنشطة تُحسب على حدة."],
    other: [{ text: "سعر {{{villa}}} لتواريخكم أحتاج أتأكد منه أولًا قبل ما أعطيك رقم. إذا تحب، نكمل على {{One Bedroom Overwater Villa}} وسعرها مؤكد عندي.", quick: [{ id: "villa_supported", label: "نكمل على One Bedroom Overwater Villa", primary: true }] }],
    fallback: "اختر الفيلا اللي تناسبكم من القائمة فوق، وأكمل لك على طول."
  },

  party: {
    ok: [
      { text: "تمام، شخصين بالغين. متى يناسبكم الوصول، وكم ليلة ودكم تقضون؟ حدّد الوصول والمغادرة في التقويم وأنا أرتّب لك المدة.", component: "calendar" }
    ],
    fallback: "بس أتأكد منك: الإقامة لك ولزوجتك فقط، ولا بينضم لكم أحد؟"
  },

  dates: {
    ok: [
      "توقيت جميل، الجو في أكتوبر من أحلى ما يكون. هذا ملخص الإقامة:",
      { component: "summary1" },
      "إذا الملخص على كيفك، نكمل لترتيب المواصلات."
    ],
    other: [{ text: "للتواريخ من {in} إلى {out} أحتاج أتأكد لك من التوفر والسعر قبل ما أأكد. إذا تحب نكمل الآن، اختر 23 إلى 25 أكتوبر 2026 وسعرها جاهز عندي.", quick: [{ id: "dates_supported", label: "اختيار 23 إلى 25 أكتوبر 2026", primary: true }] }],
    invalid: "تاريخ المغادرة لازم يكون بعد تاريخ الوصول. حدّد الوصول أولًا ثم المغادرة.",
    fallback: "حدّد تاريخ الوصول وتاريخ المغادرة في التقويم، وأكمل لك."
  },

  approve1: {
    ok: [{ text: "ممتاز. وكيف ودكم توصلون للوجهة؟ اختر الأنسب لكم:", component: "modes" }],
    fallback: { text: "إذا ملخص الإقامة مناسب، أكد لي ونكمل للمواصلات. وإذا تحب تعديل شي، قل لي وش هو وأعدّله لك.", quick: [{ id: "approve1_ok", label: "مناسب، نكمل", primary: true }] }
  },

  mode: {
    ok: [{ text: "تمام. من أي مطار بتوصلون، ومن أي مطار بتغادرون؟ وقت الرحلة وشركة الطيران ورقم الرحلة اختيارية، تقدر تضيفها الآن أو تزوّدني فيها قبل السفر.", component: "airports" }],
    other: [{ text: "حاليًا أرتّب لكم الوصول بالطائرة، مع مواصلات خاصة من المطار إلى {{Shebara}} وبالعكس. يناسبك نكمل عليها؟", quick: [{ id: "mode_plane", label: "نعم، بالطائرة", primary: true }] }],
    fallback: "اختر طريقة الوصول اللي تناسبكم من الخيارات فوق."
  },

  airports: {
    ok: [
      "سجّلت المطارات. هذي تفاصيل المواصلات من المطار إلى {{Shebara}} وبالعكس، والأسعار شاملة الضرائب لشخصين:",
      { component: "transportTrip" },
      "وهذا الملخص بعد إضافة المواصلات:",
      { component: "summary2" },
      "إذا كل شي واضح ومناسب، أكد لي ونكمل."
    ],
    other: [{ text: "لهذي المطارات أحتاج أتأكد من خيارات المواصلات وأسعارها أولًا. إذا تحب نكمل الآن، اختر الوصول على {{Yanbu Airport}} والمغادرة من {{Red Sea International Airport - RSIA}} وترتيبها جاهز عندي.", quick: [{ id: "airports_supported", label: "نكمل على مطار ينبع ومطار البحر الأحمر الدولي", primary: true }] }],
    fallback: "اختر مطار الوصول ومطار المغادرة في النموذج، ثم أكّد."
  },

  approve2: {
    ok: [{ text: "ودكم تضيفون شي من التجارب خلال الإقامة؟ هذي ثلاث تجارب يحبها ضيوفنا في {{Shebara}}، وتقدرون تقررون الحين أو بعدين:", component: "activities", quick: [{ id: "activities_defer", label: "نختار عند الوصول", primary: true }] }],
    fallback: { text: "إذا الملخص بعد المواصلات مناسب، أكد لي ونكمل.", quick: [{ id: "approve2_ok", label: "اعتمد ونكمل", primary: true }] }
  },

  activities: {
    ok: [
      "ولا يهمك، خذوا راحتكم. ما أضفت أي نشاط الآن والإجمالي يبقى كما هو. وفريق المنتجع بيكون سعيد يساعدكم تختارون اللي يناسبكم خلال الإقامة، حسب التوفر.",
      { text: "نحتاج بياناتك وبيانات زوجتك يا {name} عشان نكمل الحجز. إذا سبق وسجّلت معنا، تقدر تدخل ببريدك الإلكتروني ونسترجع بياناتك المحفوظة، أو تكمل كضيف جديد.", component: "accountChoice" }
    ],
    add: [{ text: "بكل سرور. أقدر أرتّب لكم الأنشطة مع فريق المنتجع بعد ما نثبّت الحجز. نكمل الحجز الآن ونرجع لها؟", quick: [{ id: "activities_defer", label: "نعم، نكمل الحجز", primary: true }] }],
    fallback: { text: "تحبون تضيفون نشاط الآن، ولا تقررون بعد الوصول؟", quick: [{ id: "activities_defer", label: "نقرر بعد الوصول", primary: true }] }
  },

  /* Details stage: the form is already shown; a voice message sent from the
     composer fills it, typing into it works as well. No method is suggested. */
  voice: {
    /* sent with a NEW prefilled form; {missing} lists the required fields that are still empty */
    ack: "رتّبت لك البيانات اللي ذكرتها في رسالتك يا {name}، وتلقاها في النموذج تحت. باقي {missing}؛ راجع البيانات وأكمل الناقص عشان نكمل الحجز.",
    ackComplete: "رتّبت لك البيانات اللي ذكرتها في رسالتك يا {name}، وتلقاها في النموذج تحت. راجعها، وإذا كل شي مضبوط أرسلها ونكمل الحجز.",
    other: ["وصلتني رسالتك الصوتية. عشان أضمن لك الدقة، اكتب لي اللي تحتاجه هنا نصًا أو استخدم الخيارات في البطاقة، وأكمل لك على طول."],
    fallback: "خذ راحتك يا {name}، وأكمل بياناتك وبيانات زوجتك في النموذج أعلاه، وأنا أكمل لك على طول."
  },

  /* Guest details: returning customer (verify the e-mail first, then the saved profile) or new guest (no code) */
  account: {
    guest: [{ text: "حيّاك الله. عبّ بياناتك وبيانات زوجتك هنا، ونكمل الحجز على طول.", component: "guestForm" }],
    login: [{ text: "أبشر. اكتب بريدك الإلكتروني اللي سجّلت فيه، ونرسل لك رمز تحقق من 6 أرقام. بعد التحقق نسترجع بياناتك المحفوظة.", component: "signIn" }],
    askRequests: "أهلًا بعودتك، تم التحقق من بريدك واسترجعت بياناتك المحفوظة. هل عندكم أي طلب خاص تحبون نضيفه لإقامتكم يا {name}؟ وإذا ما عندكم طلبات، عادي نكمل بدونها.",
    requestsClarify: "أبشر، وش الطلب اللي تحبون نضيفه؟ وإذا ما عندكم طلب، قل لي «لا» ونكمل.",
    readyWithRequest: "تمام يا {name}، جهّزت لك النموذج ببياناتك المحفوظة وأضفت طلبكم، والطلبات حسب التوفر. راجع البيانات وعدّل اللي تحب، ثم أرسلها ونكمل الحجز.",
    readyNoRequest: "تمام يا {name}، جهّزت لك النموذج ببياناتك المحفوظة. راجع البيانات وعدّل اللي تحب، ثم أرسلها ونكمل الحجز.",
    stillMissing: "باقي {missing}؛ أكمله قبل الإرسال.",
    notFound: "تم التحقق من بريدك، بس ما لقيت بيانات محفوظة مرتبطة فيه. عادي تكمل كضيف جديد: عبّ بياناتك وبيانات زوجتك في النموذج تحت ونكمل الحجز.",
    profileError: "تم التحقق من بريدك، بس تعذّر علي أسترجع بياناتك الحين. تقدر تعبّي بياناتك في النموذج تحت ونكمل الحجز.",
    fallback: "اختر من البطاقة: «لدي حساب سابق» أو «متابعة كضيف جديد».",
    loginFallback: "اكتب بريدك في البطاقة واضغط إرسال الرمز. وإذا تحب تكمل كضيف جديد، قل لي."
  },

  /* Undecided between Shebara and Desert Rock: comparison (facts), then a separate recommendation, then the choice */
  compare: {
    ok: [
      { text: "سؤال في محلّه يا {name}. هذي أهم الفروق بين المنتجعين، معيار بمعيار:", component: "compare" },
      "بما إنك تخطط لإجازة مع زوجتك، أرشّح لك {{Shebara}}: جزيرة يحيط بها البحر، فيها فلل بمسبح خاص فوق الماء وعلى الشاطئ، والشعاب قريبة من الشاطئ، وأجواؤها تناسب الاسترخاء. و{{Desert Rock}} له طابع جبلي ومغامرات مميزة لو حبيتوا تغيّرون الجو في رحلة ثانية. والقرار لكم:",
      { component: "comparePick" }
    ]
  },

  guest: {
    ok: [
      "شكرًا لك يا {name}. هذي المراجعة النهائية للحجز قبل الدفع. إذا كل شي مضبوط، أكد لي موافقتك على الشروط والأحكام وسياسة الخصوصية ونكمل.",
      { component: "review" }
    ],
    fallback: "راجع البيانات في النموذج فوق، وأضف بريدك الإلكتروني، ثم اضغط إرسال وأكمل لك."
  },

  review: {
    /* new guest, or an account holder whose verified e-mail is unchanged: straight to the payment hand-off */
    ok: [{ text: "تم. هذا رابط الدفع الآمن على موقع {{Visit Red Sea}} لإتمام الحجز، والمبلغ الإجمالي {{SAR 33,793.90}} شامل الضرائب:", component: "payment" }],
    /* only an account holder who changed the verified e-mail */
    verifyNew: [{ text: "غيّرت بريدك الإلكتروني، فنحتاج نتحقق من العنوان الجديد قبل الدفع. اضغط إرسال الرمز في البطاقة وبيوصلك رمز من 6 أرقام على {{{email}}}.", component: "verify" }],
    fallback: { text: "إذا البيانات مضبوطة، أكد لي موافقتك على الشروط والأحكام وسياسة الخصوصية. وإذا تحب تعديل شي، قل لي وش هو.", quick: [{ id: "review_confirm", label: "موافق على الشروط، نكمل", primary: true }] }
  },

  verify: {
    ok: [{ text: "تم التحقق بنجاح. هذا رابط الدفع الآمن على موقع {{Visit Red Sea}} لإتمام الحجز، والمبلغ الإجمالي {{SAR 33,793.90}} شامل الضرائب:", component: "payment" }],
    fallback: "أدخل رمز التحقق اللي وصلك على بريدك في البطاقة فوق، وإذا ما وصلك اطلب إرساله من جديد."
  },

  /* After the customer clicks Proceed to payment, the concierge continues on its own */
  payment: {
    ok: [
      "تم التحقق من الدفع يا {name}، وتفاصيل إقامتكم صارت جاهزة. هذا ملخص الحجز النهائي، وتقدر تحمّله بصيغة {{PDF}}:",
      { component: "confirmation" },
      "يسعدنا نستقبلك أنت و{wife} يوم {in}، والفريق بيكون بانتظاركم من لحظة الوصول. أي سؤال قبل الرحلة، أنا موجود في أي وقت. أتمنى لكم إقامة جميلة في {{Shebara}}."
    ],
    fallback: "أكمل الدفع من الرابط في البطاقة فوق، وأنا أكمل لك هنا مباشرة."
  },

  done: {
    ok: ["حجزكم مؤكد ومرتّب. إذا احتجت أي شي قبل الرحلة أو خلالها، أنا موجود."]
  },

  /* Customer-side messages that component actions generate */
  customer: {
    resort: "أختار {{{resort}}}.",
    villa: "أختار {{{villa}}} على {{Villa Flat Rate}}.",
    dates: "الوصول {in} والمغادرة {out}، {nightsWord}.",
    mode: "{modeWord}.",
    airports: "الوصول على {{{arrival}}} والمغادرة من {{{departure}}}.",
    guest: "أرسلت بياناتي وبيانات زوجتي.",
    guestSolo: "أرسلت بياناتي.",
    verify: "أدخلت الرمز."
  },

  words: {
    fieldNames: { title: "اللقب", firstName: "اسمك الأول", familyName: "اسم العائلة", email: "بريدك الإلكتروني", mobile: "رقم جوالك" },
    formSuperseded: "حلّ محل هذا النموذج نموذج محدّث أدناه.",
    nights: { 1: "ليلة واحدة", 2: "ليلتين", many: "{n} ليالٍ", lots: "{n} ليلة" },
    modes: { "By Plane": "بالطائرة", "By Private Jet": "بطائرة خاصة", "By Car": "بالسيارة", "By Yacht": "باليخت" },
    wifeDefault: "زوجتك",
    voiceLabel: "رسالة صوتية"
  },

  /* The prepared journey. `voice` is the configured mapping applied when the
     customer's voice message is sent: the recording is real, the fields are
     filled from this prepared scenario (no speech recognition runs). Email is
     never part of it; the customer types it. */
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

  menu: { newConversation: "Start a new conversation" }
};
