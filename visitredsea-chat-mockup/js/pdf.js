/* ============================================================
   Booking summary PDF in the Red Sea Global corporate identity,
   built in the browser with no libraries. The summary is drawn on
   a canvas (so Arabic text is shaped by the browser with the page's
   own fonts), encoded as JPEG and wrapped in a minimal PDF (one DCT
   image per A4 page). Nothing leaves the browser.

   Layout is right-to-left with Arabic labels; names, airports,
   products, e-mail and amounts stay as they are (Western digits).

   Identity values (observed on redseaglobal.com, see docs/SOURCES.md):
     logo    assets/logos/rsg-logo-horizontal.svg (official footer lockup)
     blue    #04253c (rsg-blue-800), #0a1d2d (900), #1f415a (700)
     gold    #bd9a5f (logo), #b89c67 (400), #c3af8a (300), #f2efe8 (50)
     grey    #6f7271 (volcanic ash 500), #e6e6e6 (rules)
   Typography: RSG's Questa Grande and Paralucent are not available
   locally, so the page's Fedra faces are used.
   ============================================================ */
window.BookingPdf = (function () {
  "use strict";
  var W = 1240, H = 1754;                 /* A4 at 150 dpi */
  var PT_W = 595.28, PT_H = 841.89;

  function loadImage(src) {
    return new Promise(function (res, rej) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = rej; im.src = src; });
  }

  function wrap(ctx, text, maxW) {
    var words = String(text).split(" "), lines = [], cur = "";          /* single-space split keeps the double spaces around separators */
    words.forEach(function (w) {
      var t = cur ? cur + " " + w : w;
      if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function newPage(pages) {
    var c = document.createElement("canvas"); c.width = W; c.height = H;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
    pages.push(c);
    return ctx;
  }

  /* Draw the summary; returns an array of canvases */
  function draw(data, imgs) {
    var pages = [], ctx = newPage(pages), y = 0;
    var sans = '"Fedra Sans AL", Arial, sans-serif', arabic = '"Fedra Sans AL", "Fedra Serif Arabic AR", Arial, sans-serif', serif = '"Fedra Serif Display", Georgia, serif';
    var M = 96, colW = W - 2 * M, R = W - M;
    var BLUE = "#04253c", INK = "#0a1d2d", BLUE7 = "#1f415a", GOLD = "#b89c67", GOLD3 = "#c3af8a", MUTED = "#6f7271", RULE = "#e6e6e6";

    function rtl() { ctx.direction = "rtl"; ctx.textAlign = "right"; }
    function ltrText() { ctx.direction = "ltr"; ctx.textAlign = "left"; }
    function footer() {
      ctx.strokeStyle = RULE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(M, H - 92); ctx.lineTo(R, H - 92); ctx.stroke();
      ctx.fillStyle = MUTED; ctx.font = "21px " + arabic; rtl();
      ctx.fillText("Red Sea Global  ·  ملخص الحجز  ·  " + data.resort + "، " + data.destinationAr, R, H - 54);
      ltrText(); ctx.fillText("صفحة " + pages.length, M, H - 54);
    }
    function ensure(h) { if (y + h > H - 120) { footer(); ctx = newPage(pages); y = 96; } }

    /* header band: RSG blue with the corporate lockup and a gold rule */
    ctx.fillStyle = BLUE; ctx.fillRect(0, 0, W, 230);
    ctx.fillStyle = GOLD; ctx.fillRect(0, 230, W, 5);
    if (imgs.logo) { var lh = 108, lw = lh * (imgs.logo.width / imgs.logo.height); ctx.drawImage(imgs.logo, M, 61, lw, lh); }
    ctx.fillStyle = "#ffffff"; ctx.font = "600 50px " + arabic; rtl();
    ctx.fillText("ملخص الحجز", R, 110);
    ctx.fillStyle = GOLD3; ctx.font = "24px " + arabic;
    ctx.fillText(data.generatedLabel, R, 156);
    y = 235;

    /* resort photograph */
    if (imgs.photo) {
      var ph = 290, sw = imgs.photo.width, sh = sw / (W / ph);
      if (sh > imgs.photo.height) { sh = imgs.photo.height; sw = sh * (W / ph); }
      ctx.drawImage(imgs.photo, (imgs.photo.width - sw) / 2, (imgs.photo.height - sh) / 2, sw, sh, 0, y, W, ph);
      y += ph;
    }
    y += 56;

    /* resort title line (right) with the resort mark on the left */
    rtl(); ctx.fillStyle = INK; ctx.font = "500 54px " + serif; ctx.fillText(data.resort, R, y);
    if (imgs.mark) { var mw = 190, mh = mw * (imgs.mark.height / imgs.mark.width); ctx.drawImage(imgs.mark, M, y - 14 - mh / 2, mw, mh); }
    y += 42;
    ctx.fillStyle = MUTED; ctx.font = "25px " + arabic; ctx.fillText(data.destinationAr + "   ·   " + data.villa + "   ·   " + data.rateName, R, y); y += 30;

    function section(title) {
      ensure(96); y += 34;
      ctx.fillStyle = BLUE7; ctx.font = "600 23px " + arabic; rtl();
      ctx.fillText(title, R, y);
      ctx.fillStyle = GOLD; ctx.fillRect(R - 44, y + 12, 44, 3);
      ctx.strokeStyle = RULE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(M, y + 13.5); ctx.lineTo(R - 44, y + 13.5); ctx.stroke();
      y += 50;
    }
    /* key on the right, value to its left; each value line keeps its own direction */
    function row(k, v, opts) {
      opts = opts || {};
      var KW = 300, VR = R - KW - 30, VW = colW - KW - 30, LH = 34;
      ctx.font = "25px " + arabic; var klines = wrap(ctx, k, KW - 10);
      ctx.font = (opts.bold ? "600 " : "") + "27px " + arabic; var vlines = wrap(ctx, v, VW);
      var n = Math.max(klines.length, vlines.length);
      ensure(n * LH + 12);
      ctx.fillStyle = MUTED; ctx.font = "25px " + arabic; rtl();
      klines.forEach(function (ln, i) { ctx.fillText(ln, R, y + i * LH); });
      ctx.fillStyle = INK; ctx.font = (opts.bold ? "600 " : "") + "27px " + arabic;
      vlines.forEach(function (ln, i) {
        var first = ln.match(/[؀-ۿ]|[A-Za-z]/);                 /* first strong character decides the base direction */
        var isRtl = !!(first && /[؀-ۿ]/.test(first[0]));
        ctx.direction = isRtl ? "rtl" : "ltr"; ctx.textAlign = "right";
        ctx.fillText(ln, VR, y + i * LH);
      });
      rtl();
      y += n * LH + 12;
    }
    function amount(k, v, note) {
      ensure(48);
      ctx.fillStyle = MUTED; ctx.font = "25px " + arabic; rtl(); ctx.fillText(k, R, y);
      var kw = ctx.measureText(k).width;
      if (note) { ctx.fillStyle = "#9a9c9b"; ctx.font = "21px " + arabic; ctx.fillText(note, R - 28 - kw, y); }
      ctx.fillStyle = INK; ctx.font = "27px " + sans; ltrText(); ctx.fillText(v, M, y);
      rtl(); y += 46;
    }

    section("الإقامة");
    row("المنتجع", data.resort + " · " + data.destinationAr);
    row("الفيلا", data.villa);
    row("الباقة", data.rateName);
    row("تاريخ الوصول", data.checkIn);
    row("تاريخ المغادرة", data.checkOut);
    row("الليالي", data.nightsLabel);
    row("الضيوف", data.guestsLabel);

    section("الضيوف");
    row("الضيف الرئيسي", data.mainGuest);
    row("البريد الإلكتروني", data.email);
    row("الجوال", data.mobile);
    if (data.secondGuest) row("الضيف الثاني", data.secondGuest);
    if (data.requests) { row("طلبات خاصة", data.requests); row("", "طلب فقط، حسب التوفر"); }

    section("المواصلات");
    row("الوصول", data.legs[0].from + " → " + data.legs[0].to); row("", data.legs[0].product + "  ·  " + data.legs[0].priceLabel);
    row("المغادرة", data.legs[1].from + " → " + data.legs[1].to); row("", data.legs[1].product + "  ·  " + data.legs[1].priceLabel);

    section("الأنشطة");
    row("المحجوز", "لا يوجد");

    section("المبالغ");
    amount("الإقامة", data.accommodationLabel, data.taxNote);
    amount("مواصلات الوصول", data.legs[0].priceLabel, data.taxNote);
    amount("مواصلات المغادرة", data.legs[1].priceLabel, data.taxNote);
    amount("إجمالي المواصلات", data.transfersLabel);

    ensure(150); y += 8;
    ctx.fillStyle = BLUE; ctx.fillRect(M, y, colW, 116);
    ctx.fillStyle = GOLD; ctx.fillRect(R - 8, y, 8, 116);
    ctx.fillStyle = "#ffffff"; ctx.font = "600 25px " + arabic; rtl(); ctx.fillText("الإجمالي الكلي", R - 36, y + 48);
    ctx.font = "21px " + arabic; ctx.fillStyle = GOLD3; ctx.fillText(data.taxNote + "  ·  الإقامة والمواصلات", R - 36, y + 84);
    ctx.fillStyle = "#ffffff"; ctx.font = "600 50px " + sans; ltrText(); ctx.fillText(data.grandLabel, M + 32, y + 76);
    y += 156;
    footer();
    return pages;
  }

  /* ---- minimal PDF writer: one JPEG per page ---- */
  function b64ToBytes(b64) { var bin = atob(b64), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
  function strBytes(s) { var out = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff; return out; }
  function buildPdf(jpegs) {
    var parts = [], offsets = [], len = 0;
    function push(bytes) { parts.push(bytes); len += bytes.length; }
    function obj(n, body) { offsets[n] = len; push(strBytes(n + " 0 obj\n")); if (typeof body === "string") push(strBytes(body)); else body.forEach(function (b) { push(typeof b === "string" ? strBytes(b) : b); }); push(strBytes("\nendobj\n")); }
    push(strBytes("%PDF-1.4\n%âãÏÓ\n"));
    var n = jpegs.length, kids = [];
    for (var i = 0; i < n; i++) kids.push((3 + i * 3) + " 0 R");
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    obj(2, "<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + n + " >>");
    jpegs.forEach(function (jpg, i) {
      var p = 3 + i * 3, im = p + 1, ct = p + 2;
      obj(p, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + PT_W + " " + PT_H + "] /Resources << /XObject << /Im" + i + " " + im + " 0 R >> >> /Contents " + ct + " 0 R >>");
      obj(im, ["<< /Type /XObject /Subtype /Image /Width " + W + " /Height " + H + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpg.length + " >>\nstream\n", jpg, "\nendstream"]);
      var content = "q " + PT_W + " 0 0 " + PT_H + " 0 0 cm /Im" + i + " Do Q";
      obj(ct, "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream");
    });
    var xref = len, count = 3 + n * 3;
    var x = "xref\n0 " + count + "\n0000000000 65535 f \n";
    for (var k = 1; k < count; k++) x += ("0000000000" + offsets[k]).slice(-10) + " 00000 n \n";
    x += "trailer\n<< /Size " + count + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
    push(strBytes(x));
    return new Blob(parts, { type: "application/pdf" });
  }

  function money(n) { return "SAR " + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function nightsLabel(n) { return n === 1 ? "ليلة واحدة" : n === 2 ? "ليلتان" : n <= 10 ? n + " ليالٍ" : n + " ليلة"; }
  function adultsLabel(n) { return n === 1 ? "شخص بالغ واحد" : n === 2 ? "شخصان بالغان" : n + " بالغين"; }
  var AR_LONG = new Intl.DateTimeFormat("ar-EG-u-ca-gregory-nu-latn", { day: "numeric", month: "long", year: "numeric" });

  /* data = conversation state + booking constants; returns a Promise<Blob> */
  function make(state, B) {
    var g = state.guest || {};
    var data = {
      resort: B.resort.name, destinationAr: "البحر الأحمر", villa: B.villa.name, rateName: B.rate.name,
      checkIn: state.checkInLabel, checkOut: state.checkOutLabel, nightsLabel: nightsLabel(state.nights),
      guestsLabel: adultsLabel(state.adults) + (state.children ? "، " + state.children + " أطفال" : ""),
      mainGuest: [g.title, g.firstName, g.familyName].filter(Boolean).join(" "),
      email: g.email || "", mobile: g.mobileCode ? g.mobileCode + " " + g.mobile : (g.mobile || ""),
      secondGuest: [g.guest2First, g.guest2Family].filter(Boolean).join(" "),
      requests: g.requests || "",
      legs: B.transport.legs.map(function (l) { return { from: l.from, to: l.to, product: l.product, priceLabel: money(l.price) }; }),
      accommodationLabel: money(B.rate.total), taxNote: B.rate.taxNoteAr || "شامل جميع الضرائب", transfersLabel: money(B.transport.transfersTotal), grandLabel: money(B.grandTotal),
      generatedLabel: "أُعدّ في " + AR_LONG.format(new Date())
    };
    var fontsReady = document.fonts ? Promise.all([document.fonts.load('500 54px "Fedra Serif Display"'), document.fonts.load('25px "Fedra Sans AL"'), document.fonts.load('600 27px "Fedra Sans AL"')]) : Promise.resolve();
    function img(src) { return loadImage(src).catch(function () { return null; }); }
    return fontsReady.then(function () {
      return Promise.all([img(B.resort.image), img("assets/logos/rsg-logo-horizontal.svg"), img("assets/logos/shebara-logo-main-color.svg")]);
    }).then(function (res) {
      var imgs = { photo: res[0], logo: res[1], mark: res[2] }, pages;
      try { pages = draw(data, imgs); pages[0].toDataURL("image/jpeg", 0.5); }
      catch (e) { pages = draw(data, { photo: null, logo: null, mark: null }); }   /* tainted canvas under file://: redraw without images */
      var jpegs = pages.map(function (c) { return b64ToBytes(c.toDataURL("image/jpeg", 0.88).split(",")[1]); });
      return buildPdf(jpegs);
    });
  }

  function download(blob, filename) {
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  return { make: make, download: download };
})();
