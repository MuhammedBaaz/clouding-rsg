/* ============================================================
   Fixed booking route used by the scripted conversation.
   Every amount, date and name shown in the chat and the PDF is
   read from here, so a correction here updates every card.

   Evidence (see docs/SOURCES.md):
     SCREENSHOT = customer-supplied booking screenshots, Oct 2026
     RESEARCH   = verified property facts, 12 to 14 Oct 2026
     COMPUTED   = arithmetic on screenshot amounts
   ============================================================ */
window.BOOKING = {
  currency: "SAR",

  resort: {
    id: "shebara",
    name: "Shebara",                                   // SCREENSHOT 01
    destination: "The Red Sea",
    detailsUrl: "https://www.visitredsea.com/en/resorts/shebara",
    image: "assets/resorts/shebara.webp"
  },

  /* The only route with evidenced prices. The calendar accepts other ranges,
     but the concierge cannot confirm a price for them. */
  stay: {
    checkIn: "2026-10-23",                             // Friday
    checkOut: "2026-10-25",                            // Sunday
    nights: 2,
    adults: 2,
    children: 0
  },

  villa: {
    name: "One Bedroom Overwater Villa",               // SCREENSHOT 01 + RESEARCH (resort page)
    nameAr: "فيلا فوق الماء بغرفة نوم واحدة",            // working UI translation (design dataset), not an official localised name
    image: "assets/villas/shebara-one-bedroom-overwater-villa-1.webp",
    terraceImage: "assets/villas/shebara-one-bedroom-overwater-villa-exterior.webp"
  },

  rate: {
    name: "Villa Flat Rate",                           // SCREENSHOT 01
    nameAr: "السعر الأساسي للفيلا",
    total: 28980.00,                                   // SCREENSHOT 01, 2 nights, 2 adults, 23 to 25 Oct 2026
    basis: "2 nights · 2 Adults · Oct 23 - 25, 2026",
    basisAr: "ليلتان · شخصان بالغان · 23 - 25 أكتوبر 2026",
    taxNote: "All taxes included",                     // SCREENSHOT 01
    taxNoteAr: "شامل جميع الضرائب"
  },

  occupancyNote: "You've got enough rooms for your group, but feel free to add more if needed!", // SCREENSHOT 01
  occupancyNoteAr: "عدد الغرف يكفي مجموعتكم، ويمكنكم إضافة المزيد عند الحاجة.",

  transport: {
    modes: ["By Plane", "By Private Jet", "By Car", "By Yacht"],          // SCREENSHOT 02 tiles
    supportedMode: "By Plane",
    airports: ["Red Sea International Airport - RSIA", "Yanbu Airport", "Al Wajh Domestic Airport"], // RESEARCH, booking step 2 list
    airportsAr: { "Red Sea International Airport - RSIA": "مطار البحر الأحمر الدولي – RSIA", "Yanbu Airport": "مطار ينبع", "Al Wajh Domestic Airport": "مطار الوجه المحلي" }, // working UI translations
    arrivalAirport: "Yanbu Airport",                                      // SCREENSHOT 02
    departureAirport: "Red Sea International Airport - RSIA",             // SCREENSHOT 02
    legs: [
      {
        from: "Yanbu Airport", to: "Shebara",
        product: "Private Luxury Car + Shared Leisure Boat",              // SCREENSHOT 02
        productAr: "سيارة فاخرة خاصة + قارب ترفيهي مشترك",
        duration: "4h",                                                   // SCREENSHOT 02
        durationAr: "4 ساعات",
        capacity: ["Private Luxury Car capacity: Up to 3 guests", "Shared Leisure Boat capacity: Up to 18 guests"], // SCREENSHOT 02, small text
        capacityAr: ["سعة السيارة الفاخرة الخاصة: حتى 3 ضيوف", "سعة القارب الترفيهي المشترك: حتى 18 ضيفًا"],
        needed: "1 Private Luxury Car, 1 Shared Leisure Boat needed",
        neededAr: "المطلوب: سيارة فاخرة خاصة واحدة وقارب ترفيهي مشترك واحد",
        price: 3622.50,                                                   // SCREENSHOT 02
        priceBasis: "Total price (all taxes included) | 2 Adults",
        priceBasisAr: "السعر الإجمالي (شامل جميع الضرائب) | شخصان بالغان",
        image: "assets/transport/getting-to-and-around-5.webp",
        imageAlt: "Visit Red Sea transfer car on a destination road"
      },
      {
        from: "Shebara", to: "Red Sea International Airport - RSIA",
        product: "Shared Speed Boat + Private Luxury Car",                // SCREENSHOT 02
        productAr: "قارب سريع مشترك + سيارة فاخرة خاصة",
        duration: null, capacity: [], needed: null,                       // collapsed in the screenshot
        price: 1191.40,                                                   // SCREENSHOT 02
        priceBasis: "Total price (all taxes included) | 2 Adults",
        priceBasisAr: "السعر الإجمالي (شامل جميع الضرائب) | شخصان بالغان",
        upgradeSelector: "Shared Speed Boat + Private Luxury Car"
      }
    ],
    transfersTotal: 4813.90                                               // SCREENSHOT 02 and COMPUTED
  },

  activities: [
    { name: "Adrena", nameAr: "Adrena", category: "ADRENA", image: "assets/activities/adrena-7.webp", imageAlt: "Aerial view of ADRENA water and adventure park, The Red Sea",
      price: "From SAR 500.00 per person", tags: ["Adventure district"], categoryAr: "أدرينا", tagsAr: ["منطقة المغامرات"], priceAr: "ابتداءً من SAR 500.00 للشخص" },
    { name: "Garden Discovery and Planting Experience", nameAr: "استكشاف الحديقة وتجربة الزراعة", category: "NATURE", image: "assets/activities/garden-discovery-and-planting-experience.webp", imageAlt: "Garden Discovery and Planting Experience at Botanica, The Red Sea",
      price: "From SAR 184.58 per person", tags: ["1-2-hour", "Beginner", "Solo / Group Activity"], categoryAr: "الطبيعة", tagsAr: ["ساعة إلى ساعتين", "للمبتدئين", "نشاط فردي أو جماعي"], priceAr: "ابتداءً من SAR 184.58 للشخص" },
    { name: "Stand Up Paddle-Boarding", nameAr: "التجديف باللوح واقفًا", category: "WATER SPORTS", image: "assets/activities/stand-up-paddle-boarding.webp", imageAlt: "Stand-up paddle-boarding on The Red Sea",
      price: "SAR 200.00, 1 adult, 1 hour, all taxes included", tags: ["1 hr", "Age: 8+", "Beginner"], categoryAr: "رياضات مائية", tagsAr: ["ساعة واحدة", "العمر: 8+", "للمبتدئين"], priceAr: "SAR 200.00، شخص بالغ واحد، ساعة واحدة، شامل جميع الضرائب" }
  ],

  guestForm: {                                          // SCREENSHOT 03: required and optional status
    titles: ["السيد", "السيدة", "الآنسة", "الطفل"],          // Arabic labels for the site's Mr. / Mrs. / Ms. / Master.
    countryCodes: ["+966", "+971", "+965", "+973", "+974", "+968", "+20", "+44", "+1"],
    defaultCountryCode: "+966"
  },

  checkoutUrl: "https://www.visitredsea.com/en/booking/checkout?startDate=2026-10-23&endDate=2026-10-25&rooms=%5B%7B%22adultCount%22%3A2%2C%22childAges%22%3A%5B%5D%7D%5D&resortName=Shebara&hotelId=1035&currency=SAR",

  legal: {
    termsUrl: "https://www.visitredsea.com/en/terms-and-conditions",
    privacyUrl: "https://www.visitredsea.com/en/privacy-policy"
  }
};

/* Grand total = accommodation + both transfer legs, no activities. COMPUTED. */
window.BOOKING.grandTotal = +(window.BOOKING.rate.total
  + window.BOOKING.transport.legs.reduce(function (s, l) { return s + l.price; }, 0)).toFixed(2);
