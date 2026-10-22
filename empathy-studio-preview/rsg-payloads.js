/* ============================================================
   RSG → Empathy Studio payload mapping (Phase 1 proposal).
   Builds Studio component payloads from the canonical RSG data
   (data/v1, data/v2 copies of the live booking files). Every key
   the Studio schema lists as required is present; fields that the
   Studio component instructions describe as optional are sent as
   "" (the pattern the Studio's own AAM instructions use for
   initial_choice), which the SDK renderers treat as absent.
   Nothing here touches either RSG application.
   ============================================================ */
(function () {
  "use strict";
  var P = window.RSG_PAYLOADS = {};
  function money(n) { return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " SAR"; }
  function fill(t, vars) { return String(t).replace(/\{\{\{(\w+)\}\}\}/g, function (_, k) { return vars[k]; }).replace(/\{\{(.+?)\}\}/g, "$1").replace(/\{(\w+)\}/g, function (_, k) { return k in vars ? vars[k] : _; }); }
  /* required-key scaffolds */
  function card(o) { return Object.assign({ image_url: "", badge_title: "", badge_position: "top-left", main_title: "", subtitle: "", description: "", primary_button_label: "", primary_button_payload: "", secondary_button_label: "", secondary_button_payload: "", tertiary_button_label: "", tertiary_button_payload: "", lock_after_selection: true }, o); }
  function conf(o) { return Object.assign({ image_url: "", badge_text: "", main_title: "", subtitle: "", primary_card_title: "", primary_card_subtitle: "", primary_card_icon: "", secondary_card_title: "", secondary_card_subtitle: "", secondary_card_icon: "", tertiary_card_title: "", tertiary_card_subtitle: "", tertiary_card_icon: "", instructions: "", primary_button_label: "", primary_button_payload: "", primary_button_icon: "", secondary_button_label: "", secondary_button_payload: "", secondary_button_icon: "" }, o); }
  function item(o) { return Object.assign({ title: "", subtitle: "", icon: "", badge: "", payload: "" }, o); }
  var ICON = function (n) { return "studio/icons/" + n + ".svg"; };   /* SVG url fields of the Confirmation Card (local copies of lucide-static@1.7.0) */

  P.build = function (ver, D) {
    var B = D.BOOKING, V = D.VILLAS, S = D.SCRIPT, R = D.RESORTS, all = R.reduce(function (a, g) { return a.concat(g.items.map(function (r) { r.group = g.group; return r; })); }, []);
    var GROUP_AR = { "The Red Sea": "البحر الأحمر", "AMAALA": "أمالا", "Private island": "Red Sea Global" };
    var asset = function (p) { return p; };
    var villaName = function (v) { return ver === "v2" ? (v.nameAr || v.name) : v.name; };
    var product = function (l) { return ver === "v2" ? (l.productAr || l.product) : l.product; };
    var airport = function (a) { return ver === "v2" && B.transport.airportsAr ? (B.transport.airportsAr[a] || a) : a; };
    var stay = { "in": "الجمعة 23 أكتوبر 2026", out: "الأحد 25 أكتوبر 2026", nights: "ليلتين", adults: "شخصان بالغان" };
    var g = { title: "السيد", firstName: "محمد", familyName: "باز", email: "muhammed.baz@clouding.ai", mobileCode: "+966", mobile: "508416627", guest2First: "نورة", guest2Family: "الحربي", requests: "تسجيل وصول متأخر إن أمكن" };
    /* The Confirmation Card sets detail-row text with textContent (no dir attribute), so LTR values inside an RTL
       host are wrapped in Unicode isolates (LRI … PDI) in the payload string itself; the schema allows any string. */
    var ltr = function (s) { return "⁦" + s + "⁩"; };
    g.phone = ltr(g.mobileCode + " " + g.mobile); g.emailLtr = ltr(g.email);
    var out = {};

    /* 1 · resort suggestions (V2 only) */
    out.resorts = { type: "carousel", payload: { cards: ["Shebara", "Desert Rock", "Six Senses Southern Dunes, The Red Sea"].map(function (n) {
      var r = all.filter(function (x) { return x.name === n; })[0];
      return card({ image_url: asset(r.image), main_title: r.name, subtitle: r.placeAr || r.place, description: r.factsAr || r.facts, primary_button_label: "اختيار", primary_button_payload: fill(S.customer.resort, { resort: r.name }) });
    }) } };

    /* 2 · selected resort details (both versions): single-card carousel renders as a standalone info card */
    var sh = all.filter(function (x) { return x.name === "Shebara"; })[0];
    out.resortDetails = { type: "carousel", payload: { cards: [card({ image_url: asset(sh.image), badge_title: GROUP_AR[sh.group] || "", main_title: sh.name, subtitle: sh.placeAr || sh.place, description: sh.factsAr || sh.facts })] } };

    /* 3 · villas */
    out.villas = { type: "carousel", payload: { cards: V.map(function (v) {
      var priced = v.name === B.villa.name;
      return card({ image_url: asset(v.image), badge_title: priced ? B.rate.name : "", badge_position: "top-right", main_title: villaName(v), subtitle: priced ? money(B.rate.total) : "", description: "**" + (v.occupancyAr || v.occupancy) + "**\n\n" + (v.factsAr || v.facts).split(" · ").map(function (f) { return "- " + f; }).join("\n") + (priced ? "\n\n" + B.rate.basisAr + " · " + B.rate.taxNoteAr : ""), primary_button_label: "اختيار", primary_button_payload: fill(S.customer.villa, { villa: v.name }) });
    }) } };

    /* 5 · accommodation summary */
    out.summary1 = { type: "confirmation_card", payload: conf({ image_url: "assets/site/resorts-hero-shebara.webp", badge_text: "ملخص الإقامة", main_title: B.resort.name, subtitle: villaName(B.villa) + " · " + B.rate.name,
      primary_card_title: "التواريخ", primary_card_subtitle: stay["in"] + " – " + stay.out + " · " + stay.nights, primary_card_icon: ICON("calendar"),
      secondary_card_title: "الضيوف", secondary_card_subtitle: stay.adults, secondary_card_icon: ICON("users"),
      tertiary_card_title: "إجمالي الإقامة", tertiary_card_subtitle: money(B.rate.total) + " · " + B.rate.taxNoteAr, tertiary_card_icon: ICON("credit-card"),
      instructions: B.occupancyNoteAr, primary_button_label: "مناسب، نكمل", primary_button_payload: "مناسب، نكمل", primary_button_icon: "check" }) };

    /* 6 · arrival modes */
    var modeIcon = { "By Plane": "plane", "By Private Jet": "plane-takeoff", "By Car": "car", "By Yacht": "ship" };
    out.modes = { type: "selection_list_picker", payload: { main_title: "كيف ودكم توصلون للوجهة؟", lock_after_selection: true, items: B.transport.modes.map(function (m) { return item({ title: S.words.modes[m] || m, icon: modeIcon[m], payload: fill(S.customer.mode, { modeWord: S.words.modes[m] || m }) }); }) } };

    /* 7 · airports (two single choices expressed through the grouped picker) */
    out.airports = { type: "grouped_list_picker", payload: { main_title: "من أي مطار بتوصلون وبتغادرون؟", send_button_label: "تأكيد المواصلات", lock_after_selection: true, is_multiple_selection: true, groups: [
      { title: "مطار الوصول", options: B.transport.airports.map(airport) }, { title: "مطار المغادرة", options: B.transport.airports.map(airport) }] } };

    /* 8 · transfer legs (information cards) */
    out.transport = { type: "carousel", payload: { cards: B.transport.legs.map(function (l, i) {
      var lines = ["**" + l.from + " → " + l.to + "**"];
      if (l.duration) lines.push("- " + (l.durationAr || l.duration)); (l.capacityAr || l.capacity || []).forEach(function (c) { lines.push("- " + c); }); if (l.needed) lines.push("- " + (l.neededAr || l.needed));
      lines.push("\n" + (l.priceBasisAr || l.priceBasis));
      return card({ image_url: l.image ? asset(l.image) : "", badge_title: i ? "المغادرة" : "الوصول", main_title: product(l), subtitle: money(l.price), description: lines.join("\n") });
    }) } };   /* visible_count is an SDK option, not a Studio schema key, so it is not sent */

    /* 9 · summary with transfers */
    out.summary2 = { type: "confirmation_card", payload: conf({ image_url: "assets/site/resorts-hero-shebara.webp", badge_text: "الملخص المحدّث", main_title: B.resort.name, subtitle: villaName(B.villa) + " · " + stay["in"] + " – " + stay.out + " · " + stay.nights + " · " + stay.adults,
      primary_card_title: "الإقامة", primary_card_subtitle: money(B.rate.total), primary_card_icon: ICON("bed"),
      secondary_card_title: "المواصلات", secondary_card_subtitle: money(B.transport.transfersTotal), secondary_card_icon: ICON("plane"),
      tertiary_card_title: "الإجمالي", tertiary_card_subtitle: money(B.grandTotal) + " · " + B.rate.taxNoteAr, tertiary_card_icon: ICON("credit-card"),
      instructions: "الإقامة والمواصلات لشخصين بالغين · " + B.rate.taxNoteAr, primary_button_label: "اعتمد ونكمل", primary_button_payload: "اعتمد ونكمل", primary_button_icon: "check" }) };

    /* 10 · experiences (information cards; the decision stays with the quick replies) */
    out.experiences = { type: "carousel", payload: { cards: B.activities.map(function (a) {
      var nm = ver === "v2" ? (a.nameAr || a.name) : a.name, price = a.priceAr || a.price, short = Array.from(price).length <= 30 ? price : price.split("،")[0];
      return card({ image_url: asset(a.image), badge_title: a.categoryAr || a.category, badge_position: "bottom-left", main_title: nm, subtitle: short, description: (a.tagsAr || a.tags).map(function (t) { return "- " + t; }).join("\n") + (short !== price ? "\n\n" + price : "") });
    }) } };

    /* 12 · final review */
    var legs = B.transport.legs;
    var transfersLine = "الوصول: " + product(legs[0]) + "\nالمغادرة: " + product(legs[1]);   /* within the 150-character row limit; the airports travel in the subtitle */
    var airportsLine = airport(B.transport.arrivalAirport) + " → " + airport(B.transport.departureAirport);
    out.review = { type: "confirmation_card", payload: conf({ image_url: asset(B.villa.terraceImage), badge_text: "مراجعة نهائية", main_title: B.resort.name, subtitle: villaName(B.villa) + " · " + B.rate.name + " · " + stay["in"] + " – " + stay.out + " · " + stay.nights + " · " + stay.adults + " · " + airportsLine,
      primary_card_title: "الضيوف", primary_card_subtitle: g.title + " " + g.firstName + " " + g.familyName + " · " + g.guest2First + " " + g.guest2Family, primary_card_icon: ICON("users"),
      secondary_card_title: "المواصلات", secondary_card_subtitle: transfersLine, secondary_card_icon: ICON("plane"),
      tertiary_card_title: "التواصل", tertiary_card_subtitle: g.emailLtr + "\n" + g.phone, tertiary_card_icon: ICON("mail"),   /* full-width row: the e-mail cannot wrap, so it must not share the flex pair */
      instructions: "الإجمالي " + money(B.grandTotal) + " " + B.rate.taxNoteAr + " · الإقامة " + money(B.rate.total) + " + المواصلات " + money(B.transport.transfersTotal) + " · " + g.requests + " (حسب التوفر)",
      primary_button_label: ver === "v2" ? "البيانات صحيحة، نكمل" : "موافق على الشروط، نكمل", primary_button_payload: ver === "v2" ? "البيانات صحيحة، نكمل" : "موافق على الشروط، نكمل", primary_button_icon: "check",
      secondary_button_label: ver === "v2" ? "تعديل البيانات" : "", secondary_button_payload: ver === "v2" ? "تعديل البيانات" : "", secondary_button_icon: ver === "v2" ? "user" : "" }) };

    /* 14 · payment hand-off */
    out.payment = { type: "confirmation_card", payload: conf({ image_url: asset(B.villa.terraceImage), badge_text: "visitredsea.com", main_title: "المبلغ المطلوب دفعه", subtitle: money(B.grandTotal) + " · " + B.rate.taxNoteAr,
      primary_card_title: "المنتجع", primary_card_subtitle: B.resort.name, primary_card_icon: ICON("hotel"),
      secondary_card_title: "الفيلا", secondary_card_subtitle: villaName(B.villa), secondary_card_icon: ICON("bed"),
      tertiary_card_title: "التواريخ", tertiary_card_subtitle: stay["in"] + " – " + stay.out + " · " + stay.adults, tertiary_card_icon: ICON("calendar"),
      instructions: "دفع آمن على visitredsea.com", primary_button_label: "المتابعة إلى الدفع", primary_button_payload: "المتابعة إلى الدفع على Visit Red Sea", primary_button_icon: "lock" }) };

    /* 15 · final confirmation */
    out.confirmation = { type: "confirmation_card", payload: conf({ image_url: asset(B.resort.image), badge_text: "تم تأكيد الحجز", main_title: B.resort.name, subtitle: villaName(B.villa) + " · " + B.rate.name + " · " + stay["in"] + " – " + stay.out + " · " + stay.nights + " · " + airportsLine,
      primary_card_title: "الضيوف", primary_card_subtitle: g.title + " " + g.firstName + " " + g.familyName + " و" + g.guest2First + " " + g.guest2Family + " · " + stay.adults, primary_card_icon: ICON("users"),
      secondary_card_title: "المواصلات", secondary_card_subtitle: transfersLine, secondary_card_icon: ICON("plane"),
      tertiary_card_title: "التواصل", tertiary_card_subtitle: g.emailLtr + "\n" + g.phone, tertiary_card_icon: ICON("mail"),   /* full-width row: the e-mail cannot wrap, so it must not share the flex pair */
      instructions: "الإجمالي المدفوع " + money(B.grandTotal) + " · " + B.rate.taxNoteAr + " · لم تُحجز أنشطة · " + g.requests + " (حسب التوفر)",
      primary_button_label: "تحميل PDF", primary_button_payload: "تحميل PDF", primary_button_icon: "download" }) };

    /* 16 · quick replies as the Studio web `buttons` component (text left empty: no heading) */
    out.quickApprove1 = { type: "buttons", payload: { text: "", buttons: [{ label: "مناسب، نكمل", value: "مناسب، نكمل" }, { label: "أراجع التفاصيل", value: "أراجع التفاصيل" }] } };
    out.quickDefer = { type: "buttons", payload: { text: "", buttons: [{ label: "نختار عند الوصول", value: "نختار عند الوصول" }] } };
    return out;
  };
})();
