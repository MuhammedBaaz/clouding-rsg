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
      { text: "نحتاج بياناتك وبيانات زوجتك يا {name} عشان نكمل الحجز.", component: "guestForm" }
    ],
    add: [{ text: "بكل سرور. أقدر أرتب لكم التجارب مع فريق المنتجع بعد ما نثبّت الحجز. نكمل الحجز الآن ونرجع للتجارب؟", quick: [{ id: "activities_defer", label: "نعم، نكمل الحجز", primary: true }] }],
    fallback: { text: "تحبون تقررون التجارب الآن، ولا نختارها عند الوصول؟", quick: [{ id: "activities_defer", label: "نختار عند الوصول", primary: true }] }
  },

  voice: {
    ok: ["وصلتني رسالتك يا {name}، ورتّبت البيانات لك في النموذج. راجع الخانات وعدّل ما تحتاجه، وأضف بريدك الإلكتروني بنفسك، ثم اعتمد البيانات."],
    other: ["وصلتني رسالتك الصوتية. عشان أضمن لك الدقة، اكتب لي ما تحتاجه هنا أو استخدم الخيارات في البطاقة، وأكمل لك على طول."],
    fallback: "خذ راحتك يا {name}، وأكمل بياناتك وبيانات زوجتك في النموذج فوق، وأنا أكمل لك على طول."
  },

  guest: {
    ok: [
      { text: "شكرًا لك يا {name}. راجع التفاصيل، وتقدر تعدّل بياناتكم من هنا. إذا كل شيء صحيح، أكّد الموافقة على الشروط ونكمل للتحقق من البريد.", component: "review" }
    ],
    fallback: "راجع البيانات في النموذج فوق، وأضف بريدك الإلكتروني، ثم اعتمد البيانات وأكمل لك."
  },

  review: {
    ok: [{ text: "نؤكد البريد قبل المتابعة. اضغط إرسال الرمز، وبيوصلك رمز من 6 أرقام على {{{email}}}.", component: "verify" }],
    updated: [{ text: "حُفظت التعديلات يا {name}. هذه المراجعة بعد التعديل، وإذا كل شيء صحيح أكّد الموافقة على الشروط ونكمل.", component: "review" }],
    terms: { text: "قبل ما نكمل، أحتاج موافقتك على الشروط والأحكام وسياسة الخصوصية من المربع في المراجعة.", quick: [{ id: "review_confirm", label: "وافقت، نكمل", primary: true }] },
    fallback: { text: "إذا البيانات صحيحة، أكّد الموافقة على الشروط ونكمل. وإذا تحب تعديل شيء، اضغط «تعديل البيانات» في المراجعة.", quick: [{ id: "review_confirm", label: "البيانات صحيحة، نكمل", primary: true }] }
  },

  verify: {
    ok: [{ text: "تم التحقق. هذا رابط الدفع الآمن على موقع Visit Red Sea لإتمام الحجز، والإجمالي {{SAR 33,793.90}} شامل الضرائب:", component: "payment" }],
    fallback: "أدخل رمز التحقق الذي وصلك على بريدك في البطاقة فوق، وإذا ما وصلك اطلب إرساله من جديد."
  },

  /* Delivered about five seconds after the first click on the payment link.
     Presentation behaviour of the prepared journey; it does not claim a
     payment-provider result. */
  payment: {
    ok: [
      { text: "تفاصيل رحلتك جاهزة يا {name}. هذا ملخص الحجز، وتقدر تحمّله بصيغة PDF:", component: "confirmation" },
      "نتمنى لك ول{wife} إقامة هادئة في {{Shebara}}. حاضرين لأي تفاصيل تحتاجونها."
    ],
    fallback: "أكمل الدفع من الرابط في البطاقة فوق، وأنا أكمل لك هنا مباشرة."
  },

  done: {
    ok: ["حجزكم مرتّب. إذا احتجت أي شيء قبل الرحلة أو خلالها، أنا موجود."]
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
