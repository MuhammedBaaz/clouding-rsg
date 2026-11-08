/* ============================================================
   Final information PDF (A4) in the Red Sea Global corporate identity,
   drawn on a canvas in the browser (Arabic shaped by the browser with
   the page's Fedra faces), encoded as JPEG and wrapped in a minimal
   PDF. Layout follows the approved design's summary.html:
   navy top band with the official horizontal logo, gold top rule,
   headline, hero photo with the resort name, stay grid, guests in two
   columns, optional request, two transfer columns, totals box, footer.
   Values come from the current booking state (latest saved edits).
   Fonts: RSG's Questa Grande / Paralucent are not available locally;
   the supplied Fedra faces are the documented fallback.
   ============================================================ */
window.BookingPdf = (function () {
  "use strict";
  var W = 1240, H = 1754, PT_W = 595.28, PT_H = 841.89;         /* A4 at 150 dpi */
  var MM = W / 210;                                               /* pixels per millimetre */
  function loadImage(src) { return new Promise(function (res, rej) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = rej; im.src = src; }); }
  function wrap(ctx, text, maxW) {
    var words = String(text).split(" "), lines = [], cur = "";
    words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur); return lines;
  }
  function money(n) { return Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function nightsLabel(n) { return n === 1 ? "ليلة واحدة" : n === 2 ? "ليلتان" : n <= 10 ? n + " ليالٍ" : n + " ليلة"; }
  var AR_DAY = new Intl.DateTimeFormat("ar-EG-u-ca-gregory-nu-latn", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  function arDate(iso) { var p = iso.split("-"); return AR_DAY.format(new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]))); }

  function draw(d, imgs) {
    var c = document.createElement("canvas"); c.width = W; c.height = H;
    var ctx = c.getContext("2d");
    var sans = '"Fedra Sans AL", Arial, sans-serif', serifAr = '"Fedra Serif Arabic AR", "Fedra Sans AL", serif', display = '"Fedra Serif Display", Georgia, serif';
    var NAVY = "#04253c", GOLD = "#b89c67", INK = "#04253c", MUTED = "#637779", LABEL = "#8d7549", RULE = "#dce3df";
    var L = 17 * MM, R = W - 17 * MM, CW = R - L, y;
    ctx.fillStyle = "#fcfcf9"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = GOLD; ctx.fillRect(0, 0, W, 3 * MM);
    function rtl() { ctx.direction = "rtl"; ctx.textAlign = "right"; }
    function ltr() { ctx.direction = "ltr"; ctx.textAlign = "left"; }
    function text(s, x, yy, font, color, align) { ctx.font = font; ctx.fillStyle = color; if (align === "ltr") ltr(); else if (align === "ltr-right") { ctx.direction = "ltr"; ctx.textAlign = "right"; } else rtl(); ctx.fillText(s, x, yy); }
    /* mixed line: Arabic base direction; numbers and Latin stay readable because the canvas applies the bidi algorithm per run */

    /* top band */
    var bandTop = 16 * MM - 3 * MM, bandH = 23 * MM;
    ctx.fillStyle = NAVY; ctx.fillRect(13 * MM, bandTop, W - 26 * MM, bandH);
    if (imgs.logo) { var lw = 40 * MM, lh = lw * (imgs.logo.height / imgs.logo.width); ctx.drawImage(imgs.logo, R - 6 * MM - lw + 4 * MM, bandTop + (bandH - lh) / 2, lw, lh); }
    text("تفاصيل إقامتك", L + 6 * MM - 4 * MM, bandTop + 10 * MM, "500 30px " + sans, "#fafaf7", "ltr");
    text(d.rangeLabel, L + 6 * MM - 4 * MM, bandTop + 16.5 * MM, "22px " + sans, "#c5d3d2", "ltr");
    y = bandTop + bandH + 8 * MM;

    text("أيام هادئة، وتفاصيل مرتبة.", R, y, "600 56px " + serifAr, INK); y += 11 * MM;
    text("يا " + d.firstName + "، جمعنا لك معلومات رحلتك في مكان واحد.", R, y, "25px " + sans, "#5d6e72"); y += 7 * MM;

    /* hero */
    var hh = 32 * MM;
    if (imgs.photo) {
      ctx.save(); ctx.beginPath(); ctx.roundRect(L, y, CW, hh, 2 * MM); ctx.clip();
      var sw = imgs.photo.width, sh = sw / (CW / hh); if (sh > imgs.photo.height) { sh = imgs.photo.height; sw = sh * (CW / hh); }
      ctx.drawImage(imgs.photo, (imgs.photo.width - sw) / 2, (imgs.photo.height - sh) * 0.52, sw, sh, L, y, CW, hh);
      var g = ctx.createLinearGradient(L, 0, L + CW * 0.8, 0); g.addColorStop(0, "rgba(4,37,60,0.63)"); g.addColorStop(1, "rgba(4,37,60,0)"); ctx.fillStyle = g; ctx.fillRect(L, y, CW, hh);
      ctx.restore();
      text(d.resort, L + 6 * MM, y + hh - 10 * MM, "56px " + display, "#ffffff", "ltr");
      text(d.villa, L + 6 * MM, y + hh - 4.5 * MM, "21px " + sans, "#ffffff", "ltr");
    }
    y += hh + 5 * MM;

    /* stay grid */
    ctx.strokeStyle = RULE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
    var colW = CW / 3, gy = y + 7 * MM;
    [["الوصول", d.checkIn], ["المغادرة", d.checkOut], ["الإقامة والضيوف", d.stay]].forEach(function (pair, i) {
      var x = R - i * colW;
      text(pair[0], x, gy, "22px " + sans, MUTED); text(pair[1], x, gy + 7 * MM, "29px " + sans, INK);
      if (i === 2) text("0 أطفال", x, gy + 13 * MM, "22px " + sans, MUTED);
    });
    y = gy + 17 * MM; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); y += 8 * MM;

    /* guests */
    text("ضيوف الرحلة", R, y, "500 24px " + sans, LABEL); y += 8 * MM;
    var half = (CW - 12 * MM) / 2, xr = R, xl = R - half - 12 * MM;
    text("الضيف الرئيسي", xr, y, "22px " + sans, MUTED); text("الضيفة الثانية", xl, y, "22px " + sans, MUTED); y += 8 * MM;
    text(d.mainGuest, xr, y, "33px " + sans, INK); text(d.secondGuest || "—", xl, y, "33px " + sans, INK); y += 9 * MM;
    text(d.email, xr, y, "24px " + sans, "#334f5e", "ltr-right"); text("التجارب أثناء الإقامة", xl, y, "22px " + sans, MUTED); y += 7 * MM;
    text(d.mobile, xr, y, "24px " + sans, "#334f5e", "ltr-right"); text("لا تجارب مضافة · الاختيار عند الوصول", xl, y, "24px " + sans, INK); y += 9 * MM;
    if (d.requests) { ctx.font = "24px " + sans; var rq = wrap(ctx, "طلب إضافي: " + d.requests + " · حسب الإمكانية", CW); rq.forEach(function (ln) { text(ln, R, y, "24px " + sans, "#4d626c"); y += 7 * MM; }); y += 1 * MM; }

    /* transfers */
    y += 2 * MM; text("التنقلات", R, y, "500 24px " + sans, LABEL); y += 8 * MM;
    var ty = y;
    d.legs.forEach(function (lg, i) {
      var x = i === 0 ? R : R - half - 9 * MM, yy = ty;
      ctx.fillStyle = GOLD; ctx.fillRect(x - 2, yy - 5 * MM, 3, 27 * MM);
      text(lg.label, x - 3 * MM, yy, "22px " + sans, MUTED); yy += 7 * MM;
      text(lg.route, x - 3 * MM, yy, "500 23px " + sans, INK); yy += 7 * MM;
      text(lg.product, x - 3 * MM, yy, "23px " + sans, INK); yy += 7 * MM;
      text(money(lg.price) + " ر.س", x - 3 * MM, yy, "500 25px " + sans, INK);
    });
    y = ty + 27 * MM; text("التنقلات لـ2 بالغين، شاملة الضرائب. لم تُضف تفاصيل رحلات جوية.", R, y, "22px " + sans, MUTED); y += 8 * MM;

    /* totals */
    var th = 36 * MM; ctx.fillStyle = "#eef1ef"; ctx.beginPath(); ctx.roundRect(L, y, CW, th, 2 * MM); ctx.fill();
    var px = R - 5 * MM, lx = L + 5 * MM, ry = y + 9 * MM;
    text("الإقامة كاملة · " + d.rateName, px, ry, "23px " + sans, INK); text(money(d.accommodation) + " ر.س", lx, ry, "500 23px " + sans, INK, "ltr"); ry += 8 * MM;
    text("التنقلات", px, ry, "23px " + sans, INK); text(money(d.transfers) + " ر.س", lx, ry, "500 23px " + sans, INK, "ltr"); ry += 4 * MM;
    ctx.strokeStyle = "#cdd8d6"; ctx.beginPath(); ctx.moveTo(lx, ry); ctx.lineTo(px, ry); ctx.stroke(); ry += 9 * MM;
    text("إجمالي الرحلة", px, ry, "500 27px " + sans, INK); text(money(d.grand) + " ر.س", lx, ry, "500 48px " + sans, INK, "ltr"); ry += 6 * MM;
    text("شامل جميع الضرائب", lx, ry, "21px " + sans, MUTED, "ltr");
    y += th + 8 * MM;

    /* footer */
    ctx.strokeStyle = RULE; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); y += 7 * MM;
    text("نتمنى لكما إقامة هادئة على البحر الأحمر.", R, y, "20px " + sans, MUTED); text("01", L, y + 2, "36px " + display, GOLD, "ltr"); y += 6 * MM;
    text("visitredsea.com", R, y, "20px " + sans, INK); y += 8 * MM;
    text("الشروط والأحكام: visitredsea.com/en/terms-and-conditions · سياسة الخصوصية: visitredsea.com/en/privacy-policy", R, y, "18px " + sans, "#667774");
    return c;
  }

  function b64ToBytes(b64) { var bin = atob(b64), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
  function strBytes(s) { var out = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff; return out; }
  function buildPdf(jpegs) {
    var parts = [], offsets = [], len = 0;
    function push(b) { parts.push(b); len += b.length; }
    function obj(n, body) { offsets[n] = len; push(strBytes(n + " 0 obj\n")); if (typeof body === "string") push(strBytes(body)); else body.forEach(function (b) { push(typeof b === "string" ? strBytes(b) : b); }); push(strBytes("\nendobj\n")); }
    push(strBytes("%PDF-1.4\n%âãÏÓ\n"));
    var n = jpegs.length, kids = []; for (var i = 0; i < n; i++) kids.push((3 + i * 3) + " 0 R");
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>"); obj(2, "<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + n + " >>");
    jpegs.forEach(function (jpg, i) {
      var p = 3 + i * 3, im = p + 1, ct = p + 2;
      obj(p, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + PT_W + " " + PT_H + "] /Resources << /XObject << /Im" + i + " " + im + " 0 R >> >> /Contents " + ct + " 0 R >>");
      obj(im, ["<< /Type /XObject /Subtype /Image /Width " + W + " /Height " + H + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpg.length + " >>\nstream\n", jpg, "\nendstream"]);
      var content = "q " + PT_W + " 0 0 " + PT_H + " 0 0 cm /Im" + i + " Do Q";
      obj(ct, "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream");
    });
    var xref = len, count = 3 + n * 3, x = "xref\n0 " + count + "\n0000000000 65535 f \n";
    for (var k = 1; k < count; k++) x += ("0000000000" + offsets[k]).slice(-10) + " 00000 n \n";
    x += "trailer\n<< /Size " + count + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n"; push(strBytes(x));
    return new Blob(parts, { type: "application/pdf" });
  }

  function make(state, B) {
    var g = state.guest || {}, names = B.transport.airportsAr || {};
    var a = state.checkIn.split("-"), b = state.checkOut.split("-");
    var d = {
      firstName: g.firstName || state.name || "", resort: B.resort.name, villa: B.villa.nameAr || B.villa.name, rateName: B.rate.nameAr || B.rate.name,
      rangeLabel: (a[1] === b[1] ? (+a[2]) + "–" + (+b[2]) + " " + arDate(state.checkIn).replace(/^\d+\s/, "") : arDate(state.checkIn) + " – " + arDate(state.checkOut)),
      checkIn: arDate(state.checkIn), checkOut: arDate(state.checkOut), stay: nightsLabel(state.nights) + " · " + state.adults + " بالغين",
      mainGuest: [g.title, g.firstName, g.familyName].filter(Boolean).join(" "), secondGuest: [g.guest2First, g.guest2Family].filter(Boolean).join(" "),
      email: g.email || "", mobile: (g.mobileCode || "") + " " + (g.mobile || ""), requests: g.requests || "",
      legs: B.transport.legs.map(function (l, i) { return { label: i ? "المغادرة" : "الوصول", route: i ? B.resort.name + " ← " + (names[l.to] || l.to) : (names[l.from] || l.from) + " ← " + B.resort.name, product: l.productAr || l.product, price: l.price }; }),
      accommodation: B.rate.total, transfers: B.transport.transfersTotal, grand: B.grandTotal
    };
    var fontsReady = document.fonts ? Promise.all([document.fonts.load('600 56px "Fedra Serif Arabic AR"'), document.fonts.load('24px "Fedra Sans AL"'), document.fonts.load('500 25px "Fedra Sans AL"'), document.fonts.load('56px "Fedra Serif Display"')]) : Promise.resolve();
    function img(src) { return loadImage(src).catch(function () { return null; }); }
    return fontsReady.then(function () { return Promise.all([img(B.resort.image), img("assets/logos/rsg-logo-horizontal.svg")]); }).then(function (res) {
      var imgs = { photo: res[0], logo: res[1] }, page;
      try { page = draw(d, imgs); page.toDataURL("image/jpeg", 0.5); } catch (e) { page = draw(d, { photo: null, logo: null }); }
      return buildPdf([b64ToBytes(page.toDataURL("image/jpeg", 0.9).split(",")[1])]);
    });
  }
  function download(blob, filename) { var url = URL.createObjectURL(blob), a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500); }
  return { make: make, download: download };
})();
