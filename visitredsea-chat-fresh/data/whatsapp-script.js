/* The approved WhatsApp follow-up (docs/WHATSAPP_TRANSCRIPT.md), as data for js/whatsapp.js.
   Local scripted playback only. No HTML in texts; "\n" allowed for a line break.

   Presentation follows the owner's iOS references (11 Nov 2026): an iPhone whose system language is English, so the
   chrome strings the phone renders itself (status clock, date separators, message times, "Online", "typing…",
   "Type a message") are English with Western digits, while the conversation text is the approved Saudi Arabic.
   The Arabic alternates approved earlier are kept as labelAr / timeAr: set ui = "ar" to switch back to them
   (then dir should be "rtl" and the frame mirrors). */
window.WHATSAPP_SCRIPT = {
  ui: "en",
  dir: "ltr",
  outSide: "end",
  contact: {
    name: "فيصل · Shebara",
    subtitle: "Online",
    subtitleAr: "آخر ظهور اليوم",
    typing: "typing…",
    typingAr: "يكتب…",
    avatar: "assets/concierge/faisal.jpg",                 /* approved portrait, 11 Nov 2026 (circular crop in CSS) */
    initials: "ف"
  },
  composerPlaceholder: "Type a message",
  statusTime: "11:17 AM",
  unreadBadge: "",
  days: [
    {
      label: "Oct 19, 2026",
      labelAr: "الاثنين، 19 أكتوبر 2026",
      messages: [
        { from: "concierge", time: "4:12 PM", timeAr: "4:12 م", text: "يا هلا بك يا محمد، معك فيصل من فريق Shebara. أنا الكونسيرج الشخصي اللي بيكون معكم طول إقامتكم، ويسعدنا إنكم اخترتونا." },
        { from: "concierge", time: "4:13 PM", timeAr: "4:13 م", text: "من لحظة وصولكم للجزيرة أنا معكم في كل تفصيلة. وإذا احتجت شي قبل السفر، أو ودّك نرتّب لكم شي معيّن، راسلني هنا على الواتساب في أي وقت." },
        { from: "guest", time: "4:25 PM", timeAr: "4:25 م", text: "حياك الله يا فيصل، وشكرًا على الترحيب. حاليًا كل شي تمام، وإذا احتجنا شي بتواصل معك." }
      ]
    },
    {
      label: "Oct 21, 2026",
      labelAr: "الأربعاء، 21 أكتوبر 2026",
      messages: [
        { from: "guest", time: "11:08 AM", timeAr: "11:08 ص", text: "هلا فيصل، شفت التجارب المتاحة في المنتجع وودّي أحجز وحدة منها." },
        { from: "concierge", time: "11:10 AM", timeAr: "11:10 ص", text: "يا هلا بك من جديد يا محمد، أبشر. أي تجربة في بالك؟" },
        { from: "guest", time: "11:11 AM", timeAr: "11:11 ص", text: "التجديف بالكاياك." },
        { from: "concierge", time: "11:12 AM", timeAr: "11:12 ص", text: "اختيار جميل. أي يوم من أيام إقامتكم يناسبكم؟" },
        { from: "guest", time: "11:13 AM", timeAr: "11:13 ص", text: "يوم 24." },
        { from: "concierge", time: "11:16 AM", timeAr: "11:16 ص", text: "تم يا محمد، حجزت لكم الكاياك يوم السبت 24 أكتوبر، وبأكد لك الوقت بالضبط قبل الموعد. وإذا احتجت أي شي ثاني أنا موجود." },
        { from: "guest", time: "11:17 AM", timeAr: "11:17 ص", text: "شكرًا لك يا فيصل، الله يعطيك العافية." }
      ]
    }
  ]
};
