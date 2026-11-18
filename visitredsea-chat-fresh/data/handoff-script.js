/* ERP-to-WhatsApp handoff scene (11 Nov 2026): the booking system assigns the guest's Shebara booking to the concierge
   Faisal and sends him the guest file on WhatsApp. One source for the ERP panel (js/handoff.js), the WhatsApp exchange
   and the PDF (tools/handoff-pdf.html → assets/handoff/guest-file.pdf, built by tools/build_handoff_pdf.py).

   Booking values are read from data/booking.js (load it first). Guest values follow the approved scenario: السيد
   محمد باز, companion نورة الحربي, special request «تسجيل وصول متأخر إن أمكن». The mobile number and e-mail are
   fictional (example.com is reserved). No booking reference is shown: none is evidenced. Transcript:
   docs/HANDOFF_TRANSCRIPT.md. Local scripted playback only; nothing is sent anywhere. */
(function () {
  "use strict";
  var B = window.BOOKING;
  if (!B) { if (window.console) console.warn("handoff-script.js: data/booking.js must load first"); return; }
  var MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  var DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  function parts(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso); return { y: +m[1], m: +m[2], d: +m[3] }; }
  function arDate(iso) { var p = parts(iso); return DAYS[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()] + " " + p.d + " " + MONTHS[p.m - 1] + " " + p.y; }
  function money(n) { return B.currency + " " + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  var nightsWord = { 1: "ليلة واحدة", 2: "ليلتان" }[B.stay.nights] || (B.stay.nights + " ليالٍ");
  var adultsWord = { 1: "شخص بالغ واحد", 2: "شخصان بالغان" }[B.stay.adults] || (B.stay.adults + " أشخاص بالغين");
  var pin = parts(B.stay.checkIn), pout = parts(B.stay.checkOut);
  var rangeWords = pin.m === pout.m && pin.y === pout.y
    ? "من " + pin.d + " إلى " + pout.d + " " + MONTHS[pin.m - 1] + " " + pin.y
    : "من " + pin.d + " " + MONTHS[pin.m - 1] + " إلى " + pout.d + " " + MONTHS[pout.m - 1] + " " + pout.y;
  var legIn = B.transport.legs[0], legOut = B.transport.legs[1], AP = B.transport.airportsAr;

  var guest = {
    title: "السيد", firstName: "محمد", familyName: "باز", fullName: "السيد محمد باز",
    mobile: "+966 55 123 4567",                                   /* fictional */
    email: "mohammed.baz@example.com",                            /* fictional (reserved domain) */
    category: "فئة الضيافة المميزة", categoryCode: "A",           /* internal service category (Class A) */
    companion: { name: "نورة الحربي", relation: "زوجته" },
    request: "تسجيل وصول متأخر إن أمكن"
  };
  var booking = {
    resort: B.resort.name, villaAr: B.villa.nameAr, villa: B.villa.name, rate: B.rate.name,
    checkIn: arDate(B.stay.checkIn), checkOut: arDate(B.stay.checkOut), range: rangeWords, nights: nightsWord, adults: adultsWord,
    arrival: { from: AP[legIn.from] || legIn.from, to: legIn.to, product: legIn.productAr, duration: legIn.durationAr || "" },
    departure: { from: legOut.from, to: AP[legOut.to] || legOut.to, product: legOut.productAr },
    accommodation: money(B.rate.total), transfers: money(B.transport.transfersTotal), total: money(B.grandTotal), taxNote: B.rate.taxNoteAr
  };
  var assignment = {
    concierge: "فيصل", role: "الكونسيرج الشخصي", photo: "assets/concierge/faisal.jpg",
    date: arDate("2026-10-19"), assignedAt: "2:05 م", sentAt: "2:06 م"            /* before Faisal's first message to the guest at 4:12 م */
  };
  var pdf = {
    file: "assets/handoff/guest-file.pdf",
    name: "ملف الضيف وتفاصيل الحجز.pdf",
    meta: "1 page · 166 kB · PDF"                                 /* rewritten by tools/build_handoff_pdf.py from the built file */
  };

  window.HANDOFF_SCENE = {
    guest: guest, booking: booking, assignment: assignment, pdf: pdf,
    erp: {
      app: "نظام الحجوزات", unit: "Shebara", section: "الحجوزات",
      stages: ["جديد", "مُسند للكونسيرج", "سُلّم عبر واتساب"],
      conciergeLabel: "الكونسيرج المسؤول", unassigned: "بانتظار الإسناد",
      send: "إرسال إلى واتساب فيصل", sending: "جارٍ الإرسال…", sent: "أُرسل إلى واتساب فيصل",
      log: [
        { time: assignment.assignedAt, text: "أُسند الحجز إلى فيصل" },
        { time: assignment.sentAt, text: "أُرسل ملف الضيف إلى واتساب فيصل" }
      ]
    },
    /* the iPhone is Faisal's: the booking system is the contact (incoming), Faisal's reply is outgoing */
    phone: {
      ui: "en", dir: "ltr", outSide: "end", outFrom: "faisal",
      contact: { name: "نظام الحجوزات · Shebara", subtitle: "Online", typing: "typing…", avatar: "assets/logos/vrs-turtle-mark.svg", avatarFit: "contain", initials: "S" },
      composerPlaceholder: "Type a message",
      statusTime: "2:08 PM",
      unreadBadge: "",
      days: [{
        label: "Oct 19, 2026",
        messages: [
          { from: "system", time: "2:05 PM", text: "مرحبًا فيصل، تم إسناد حجز جديد لك في " + booking.resort + " للضيف " + guest.fullName + "." },
          { from: "system", time: "2:05 PM", text: "الضيف ضمن " + guest.category + ". الإقامة في " + booking.villaAr + " " + booking.range + " (" + booking.nights + ") ل" + booking.adults.replace("شخصان بالغان", "شخصين بالغين") + "، مع " + guest.companion.relation + " " + guest.companion.name + "." },
          { from: "system", time: "2:06 PM", text: "جوال الضيف: " + guest.mobile + "\nتقدر تتواصل معه مباشرة لتنسيق الإقامة." },
          { from: "system", time: "2:06 PM", type: "document", file: pdf.file, name: pdf.name, meta: pdf.meta, caption: "التفاصيل الكاملة للضيف والحجز في الملف المرفق." },
          { from: "faisal", time: "2:08 PM", text: "استلمت الملف، شكرًا. بتواصل مع " + guest.title + " " + guest.firstName + " اليوم وأنسّق معه تفاصيل الإقامة." }
        ]
      }]
    }
  };
})();
