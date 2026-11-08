/* ============================================================
   Resort catalog shown in the discovery step.
   Names are the official English names as published on
   visitredsea.com / amaala.com / thuwalretreat.sa (12 Oct 2026).
   Status wording follows the research inventory; nothing here
   claims availability for the eventual stay.
   ============================================================ */
window.RESORTS = [
  { group: "The Red Sea", items: [
    { name: "Six Senses Southern Dunes, The Red Sea", place: "Inland desert, Southern Dunes", placeAr: "صحراء داخلية، الكثبان الجنوبية", facts: "36 rooms and suites plus 40 pool villas", factsAr: "36 غرفة وجناحًا و40 فيلا بمسبح", image: "assets/resorts/six-senses-southern-dunes.webp", status: "Open" },
    { name: "The St. Regis Red Sea Resort", place: "Ummahat Island", placeAr: "جزيرة أمهات", facts: "90 villas", factsAr: "90 فيلا", image: "assets/resorts/st-regis-red-sea.webp", status: "Open" },
    { name: "Nujuma, a Ritz-Carlton Reserve", place: "Ummahat Islands", placeAr: "جزر أمهات", facts: "Private island reserve", factsAr: "محمية في جزيرة خاصة", image: "assets/resorts/nujuma.webp", status: "Open" },
    { name: "Turtle Bay Hotel", place: "Mainland coast, 19 km from the airport", placeAr: "الساحل البري، على بعد 19 كم من المطار", facts: "144 keys", factsAr: "144 مفتاحًا", image: "assets/resorts/turtle-bay-hotel.webp", status: "Open" },
    { name: "Shebara", place: "Sheybarah Island", placeAr: "جزيرة شيبارة", facts: "73 villas: 38 overwater, 35 beachfront", factsAr: "73 فيلا: 38 فوق الماء و35 على الشاطئ", image: "assets/resorts/shebara.webp", status: "Open", featured: true,
      url: "https://www.visitredsea.com/en/resorts/shebara" },
    { name: "Desert Rock", place: "Mountain valley near Umluj", placeAr: "وادٍ جبلي قرب أملج", facts: "64 keys: 54 villas, 10 suites", factsAr: "64 مفتاحًا: 54 فيلا و10 أجنحة", image: "assets/resorts/desert-rock.webp", status: "Open" },
    { name: "The Red Sea EDITION", place: "Shura Island", placeAr: "جزيرة شورى", facts: "240 rooms", factsAr: "240 غرفة", image: "assets/resorts/red-sea-edition.webp", status: "Open" },
    { name: "InterContinental The Red Sea Resort", place: "Shura Island", placeAr: "جزيرة شورى", facts: "210 rooms and suites", factsAr: "210 غرف وأجنحة", image: "assets/resorts/intercontinental-red-sea.webp", status: "Open" },
    { name: "SLS The Red Sea", place: "Shura Island", placeAr: "جزيرة شورى", facts: "150 rooms, suites and villas", factsAr: "150 غرفة وجناحًا وفيلا", image: "assets/resorts/sls-red-sea.webp", status: "Open" },
    { name: "Miraval The Red Sea", place: "Shura Island", placeAr: "جزيرة شورى", facts: "Adults only, all-inclusive wellness", factsAr: "للبالغين فقط، إقامة عافية شاملة", image: "assets/resorts/miraval-red-sea.webp", status: "Open" },
    { name: "Four Seasons Resort and Residences Red Sea at Shura Island", place: "Shura Island", placeAr: "جزيرة شورى", facts: "149 rooms and suites", factsAr: "149 غرفة وجناحًا", image: "assets/resorts/four-seasons-shura.webp", status: "Open" }
  ]},
  { group: "AMAALA", items: [
    { name: "Four Seasons Resort and Residences AMAALA at Triple Bay", place: "Triple Bay", placeAr: "تريبل باي", facts: "202 rooms, suites and garden villas", factsAr: "202 غرفة وجناحًا وفيلا حدائقية", image: "assets/resorts/four-seasons-amaala.webp", status: "Open" },
    { name: "Six Senses AMAALA", place: "Triple Bay", placeAr: "تريبل باي", facts: "100 suites and villas", factsAr: "100 جناح وفيلا", image: "assets/resorts/six-senses-amaala.webp", status: "Open" },
    { name: "Rosewood AMAALA", place: "Triple Bay", placeAr: "تريبل باي", facts: "110 keys", factsAr: "110 مفاتيح", image: "assets/resorts/rosewood-amaala.webp", status: "Open" },
    { name: "Equinox Resort AMAALA", place: "Marina Village, Triple Bay", placeAr: "قرية المارينا، تريبل باي", facts: "128 rooms and suites, adults only", factsAr: "128 غرفة وجناحًا، للبالغين فقط", image: "assets/resorts/equinox-amaala.webp", status: "Open" },
    { name: "Nammos Resort AMAALA", place: "Triple Bay", placeAr: "تريبل باي", facts: "110 keys", factsAr: "110 مفاتيح", image: "assets/resorts/nammos-amaala.webp", status: "Open" },
    { name: "Jayasom Wellness Resort AMAALA", place: "Triple Bay", placeAr: "تريبل باي", facts: "153 keys, programme-based wellness stays", factsAr: "153 مفتاحًا، إقامات عافية ببرامج", image: "assets/resorts/jayasom-amaala.webp", status: "Open" }
  ]},
  { group: "Private island", items: [
    { name: "Thuwal Private Retreat", place: "Thuwal Island, off Jeddah", placeAr: "جزيرة ثول، قبالة جدة", facts: "Whole-island buy-out, up to 12 adults", factsAr: "حجز الجزيرة كاملة، حتى 12 بالغًا", image: "assets/resorts/thuwal-private-retreat.jpg", status: "Enquiry only" }
  ]}
];

/* ------------------------------------------------------------
   Resort profiles for the chat cards: a one-line description,
   the setting, location, accommodation style and a few
   facilities. Every statement comes from the research inventory
   research_notes/Red Sea Global POC due diligence/
   04_inventory_the_red_sea.md (A1 to A11) and
   05_inventory_amaala_and_other.md (2.11); source ids in [].
   Nothing here states availability, prices, ratings or policies.
   AMAALA resorts have no profile yet (not shown in the chat).
   ------------------------------------------------------------ */
(function () {
  var P = {
    "Shebara": { /* [S26] [S05] */ aboutAr: "أول منتجع فاخر تملكه Red Sea Global وتديره بالكامل، على جزيرة في عرض البحر الأحمر.", settingAr: "جزيرة", locationAr: "جزيرة شيبارة، على بعد 25 كم من البر",
      stayAr: "73 فيلا بمسبح خاص: 38 فوق الماء و35 على الشاطئ", highlightsAr: ["سبا بخمس غرف علاج", "مركز غوص والشعاب على بعد 30 إلى 40 مترًا من الشاطئ", "جلسات رصد النجوم", "بادل وتنس"] },
    "Desert Rock": { /* [S38] [S41] [S14] [S27] */ aboutAr: "منتجع في وادٍ بين الجبال قرب أملج، تملكه Red Sea Global وتديره.", settingAr: "جبال", locationAr: "وادٍ جبلي قرب أملج",
      stayAr: "54 فيلا و10 أجنحة، منها فلل معلّقة على الجرف وأجنحة في كهف جبلي", highlightsAr: ["سبا", "مركز مغامرات", "جلسات رصد النجوم", "واحة بحيرة"] },
    "Six Senses Southern Dunes, The Red Sea": { /* [S50] [S28] [S06] */ aboutAr: "منتجع صحراوي داخلي بعلامة Six Senses، يجمع برامج العافية والطبيعة.", settingAr: "صحراء", locationAr: "الكثبان الجنوبية، نحو 60 دقيقة بالسيارة من مطار البحر الأحمر الدولي",
      stayAr: "36 غرفة وجناحًا و40 فيلا بمسبح", highlightsAr: ["Six Senses Spa", "تسلّق ومشي ودراجات كهربائية", "رصد النجوم"] },
    "The St. Regis Red Sea Resort": { /* [S03] [S47] */ aboutAr: "منتجع على جزيرة ضمن جزر أمهات، كل فلله بمسبح خاص.", settingAr: "جزيرة", locationAr: "جزيرة أمهات",
      stayAr: "90 فيلا بمسبح خاص، على الكثبان وفوق الماء", highlightsAr: ["سبا", "غوص مع Galaxea", "رياضات مائية مع WAMA", "تنس"] },
    "Nujuma, a Ritz-Carlton Reserve": { /* [S04] [S48] */ aboutAr: "محمية Ritz-Carlton على جزر أمهات، بفلل على الشاطئ وفوق الماء.", settingAr: "جزيرة", locationAr: "جزر أمهات",
      stayAr: "فلل من غرفة إلى ثلاث غرف، كلها بمسبح خاص", highlightsAr: ["سبا", "غوص وسنوركل", "رياضات مائية", "دراجات"] },
    "Turtle Bay Hotel": { /* [S45] [S13] [S29] */ aboutAr: "فندق على الساحل في قرية Turtle Bay، قريب من المطار.", settingAr: "ساحل", locationAr: "على بعد 19 كم من مطار البحر الأحمر الدولي، نحو 25 دقيقة بالسيارة",
      stayAr: "144 غرفة ديلوكس بإطلالة على الحديقة أو البحر", highlightsAr: ["نادي أطفال", "مطعم نادي الشاطئ", "بار عصائر على المسبح"] },
    "The Red Sea EDITION": { /* [S12] [S49] */ aboutAr: "فندق على جزيرة شورى، مع وصول إلى ملعب Shura Links للغولف.", settingAr: "جزيرة", locationAr: "جزيرة شورى",
      stayAr: "240 غرفة، وأجنحة بعضها بمسبح", highlightsAr: ["سبا Omorovicza بخمس غرف علاج", "Recovery Dome", "نادي شاطئ"] },
    "InterContinental The Red Sea Resort": { /* [S51] [S09] */ aboutAr: "منتجع على جزيرة شورى بغرف وأجنحة تطل على الشاطئ والبحيرة.", settingAr: "جزيرة", locationAr: "جزيرة شورى",
      stayAr: "210 غرف وأجنحة", highlightsAr: ["سبا ومسابح", "رياضات مائية مع WAMA", "غوص مع Galaxea", "Adrena على بعد 15 دقيقة"] },
    "SLS The Red Sea": { /* [S15] [S34] */ aboutAr: "منتجع على جزيرة شورى بغرف وأجنحة وفلل شاطئية.", settingAr: "جزيرة", locationAr: "جزيرة شورى",
      stayAr: "117 غرفة و18 جناحًا و15 فيلا على الشاطئ", highlightsAr: ["Ciel Spa بست غرف علاج", "أكبر مسبح في جزيرة شورى", "سينما مفتوحة", "بادل"] },
    "Miraval The Red Sea": { /* [S10] [S35] [S56] */ aboutAr: "منتجع عافية على جزيرة شورى بإقامة شاملة.", settingAr: "جزيرة", locationAr: "جزيرة شورى",
      stayAr: "غرف وأجنحة وفلل، للبالغين فقط", highlightsAr: ["سبا Life in Balance", "أكثر من 20 نشاطًا جماعيًا يوميًا ضمن الإقامة الشاملة", "مركز مائي"] },
    "Four Seasons Resort and Residences Red Sea at Shura Island": { /* [S54] [S55] [S11] */ aboutAr: "منتجع في شرق جزيرة شورى، مطاعمه حلال وخالية من الكحول.", settingAr: "جزيرة", locationAr: "شرق جزيرة شورى",
      stayAr: "149 غرفة وجناحًا بإطلالة على البحر أو الحديقة", highlightsAr: ["ثلاثة مسابح منها مسبح للبالغين", "سبا", "مركز الاكتشاف البحري", "1.3 كم من الشاطئ"] },
    "Thuwal Private Retreat": { /* [S31] [S50] */ aboutAr: "جزيرة خاصة تُحجز كاملة، تملكها Red Sea Global وتديرها، والإقامة شاملة الوجبات.", settingAr: "جزيرة خاصة", locationAr: "جزيرة ثول، قبالة جدة",
      stayAr: "فيلا رئيسية بثلاث غرف وثلاث أجنحة بغرفة واحدة، حتى 12 بالغًا", highlightsAr: ["مسبح Turquoise Hole الطبيعي", "رحلات يخت خاصة", "غوص وسنوركل", "سينما على الشاطئ"] }
  };
  window.RESORTS.forEach(function (g) { g.items.forEach(function (r) { if (P[r.name]) Object.assign(r, P[r.name]); }); });
})();

/* ------------------------------------------------------------
   Official detail pages: each resort's own page on
   visitredsea.com as recorded (with its content) in the research
   source register, 12 October 2026. Thuwal Private Retreat has no
   visitredsea.com page in the register; its own official site
   (thuwalretreat.sa, research source S46) is used instead.
   Comparison facts for Shebara and Desert Rock: setting and
   access from the arrival sections ([S05], [S14]); drive and boat
   times are left out because the sources conflict.
   ------------------------------------------------------------ */
(function () {
  var V = "https://www.visitredsea.com/en/resorts/";
  var U = {
    "Shebara": V + "shebara", "Desert Rock": V + "desert-rock", "Six Senses Southern Dunes, The Red Sea": V + "six-senses-southern-dunes-the-red-sea",
    "The St. Regis Red Sea Resort": V + "the-st-regis-red-sea-resort", "Nujuma, a Ritz-Carlton Reserve": V + "nujuma-a-ritz-carlton-reserve",
    "Turtle Bay Hotel": V + "turtle-bay", "The Red Sea EDITION": V + "shura-the-red-sea-edition", "InterContinental The Red Sea Resort": V + "shura-intercontinental-the-red-sea-resort",
    "SLS The Red Sea": V + "shura-sls-the-red-sea", "Miraval The Red Sea": V + "miraval-the-red-sea", "Four Seasons Resort and Residences Red Sea at Shura Island": V + "four-seasons-shura",
    "Thuwal Private Retreat": "https://www.thuwalretreat.sa/en/"
  };
  var X = {
    "Shebara": { characterAr: "جزيرة في عرض البحر، بفلل فوق الماء وعلى الشاطئ", accessAr: "بالسيارة إلى Turtle Bay ثم بالقارب، أو بالطائرة المائية", suitsAr: "من يبحث عن البحر والشاطئ والغوص" },
    "Desert Rock": { characterAr: "وادٍ بين الجبال، بفلل معلّقة على الجرف وأجنحة في كهف جبلي", accessAr: "بالسيارة من مطار البحر الأحمر الدولي", suitsAr: "من يبحث عن الجبال والمغامرة ورصد النجوم" }
  };
  window.RESORTS.forEach(function (g) { g.items.forEach(function (r) { if (U[r.name]) r.url = U[r.name]; if (X[r.name]) Object.assign(r, X[r.name]); }); });
})();

/* ------------------------------------------------------------
   Shebara or Desert Rock, criterion by criterion. Every line is a
   documented fact from the research (04_inventory_the_red_sea.md
   A5 and A6; reports/Mockup spec R1 Shebara Desert Rock.md,
   section 10): island 25 km offshore, reef 30 to 40 m from the
   beach, 38 overwater + 35 beachfront villas with private pools,
   car + boat or seaplane [S05, S26]; hidden valley between the
   mountains near Umluj, inland "mountain resort", 54 villas and
   10 suites incl. Cliff Hanging Villas and a Mountain Cave Suite,
   The Observatory sunset lounge, adventure centre, listening room,
   vinyl bar, lagoon oasis, drive from RSI [S14, S27, S38, S41].
   Spa and astronomy exist at both, so they are named as shared.
   Drive and boat times are left out (the sources conflict).
   ------------------------------------------------------------ */
window.RESORT_COMPARE = [
  { title: "المكان والطبيعة", question: "بحر أم جبال؟",
    shebara: "جزيرة في عرض البحر الأحمر على بعد 25 كم من البر، تصلها بالسيارة ثم القارب أو بالطائرة المائية.",
    desertRock: "منتجع جبلي داخلي في وادٍ بين الجبال قرب أملج، تصله بالسيارة من مطار البحر الأحمر الدولي.",
    diffLabel: "الفرق", diff: "جزيرة يحيط بها البحر، مقابل وادٍ تحيط به الجبال." },
  { title: "العمارة وتجربة الإقامة", question: "فوق الماء أم في الصخر؟",
    shebara: "73 فيلا كلها بمسبح خاص: 38 فوق الماء و35 على الشاطئ.",
    desertRock: "54 فيلا و10 أجنحة بين الوادي والجبل، منها فلل معلّقة على الجرف وجناح في كهف جبلي.",
    diffLabel: "الفرق", diff: "في Shebara تسكن فوق الماء أو على الرمل، وفي Desert Rock تسكن داخل التضاريس الجبلية نفسها." },
  { title: "الإطلالة والأجواء", question: "أفق البحر أم الجبال؟",
    shebara: "إطلالة على البحر من الفلل فوق الماء وعلى الشاطئ، والشعاب على بعد 30 إلى 40 مترًا من الشاطئ.",
    desertRock: "الوادي والجبال حول الفلل، وصالة The Observatory لمشاهدة الغروب.",
    diffLabel: "الفرق", diff: "أجواء بحرية مفتوحة، مقابل أجواء جبلية بين الصخور." },
  { title: "تجارب مميزة", question: "ماذا يميز كل منتجع؟",
    shebara: "مركز غوص قريب من الشعاب، وملاعب بادل وتنس.",
    desertRock: "مركز مغامرات، وغرفة استماع وبار أسطوانات، وواحة بحيرة.",
    diffLabel: "مشترك", diff: "سبا ورصد النجوم في المنتجعين." },
  { title: "يناسب من؟", question: "حسب ما تحبون",
    shebara: "من يريد إجازة بحرية: سباحة وغوص واسترخاء على الشاطئ.",
    desertRock: "من يحب الجبال والمغامرة واستكشاف الطبيعة البرية.",
    diffLabel: "", diff: "" }
];
