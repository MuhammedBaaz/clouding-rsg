/* ============================================================
   Scripted concierge: a deterministic, local replay engine.
   The customer types (or acts on a component); the engine matches
   the input against the current stage and appends the prepared
   reply from data/script.js with components built from
   data/booking.js, data/resorts.js and data/villas.js.

   The only network calls are the e-mail verification requests to
   server.py (/api/otp/status, /request, /verify) on the same origin.
   No AI provider. The page must be served by server.py over http;
   under file:// the verification card explains how to open it.
   ============================================================ */
(function () {
  "use strict";
  var B = window.BOOKING, R = window.RESORTS, V = window.VILLAS, S = window.SCRIPT;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return B.currency + " " + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function h(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "html") e.innerHTML = attrs[k];
      else if (k === "text") e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function nowLabel() { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  /* Arabic normalisation for matching: diacritics, alef forms, taa marbuta, digits, punctuation */
  function norm(t) {
    return String(t || "").normalize("NFKC").toLowerCase()
      .replace(/[ً-ْٰـ]/g, "")
      .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
      .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
      .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); })
      .replace(/[^\p{L}\p{N}\s@.+-]/gu, " ").replace(/\s+/g, " ").trim();
  }
  function has(t, list) {
    var toks = t.split(" ");
    return list.some(function (w) { return w.length <= 3 ? toks.indexOf(w) >= 0 : t.indexOf(w) >= 0; });
  }
  /* {{English}} inside Arabic text becomes an LTR <bdi> island; {name}-style tokens come from state */
  function fill(text, st) {
    var vars = {
      name: st.name || "", wife: st.guest && st.guest.guest2First ? st.guest.guest2First : S.words.wifeDefault,
      email: st.guest ? st.guest.email : "", resort: st.resortName || "", villa: st.villaName || "",
      "in": st.checkInLabel || "", out: st.checkOutLabel || "", nights: st.nights || "",
      nightsWord: nightsWord(st.nights), modeWord: S.words.modes[st.mode] || st.mode || "",
      arrival: st.arrivalAirport || "", departure: st.departureAirport || ""
    };
    return esc(text).replace(/\{\{\{(\w+)\}\}\}/g, function (_, k) { return '<bdi dir="ltr">' + esc(vars[k]) + "</bdi>"; })
      .replace(/\{\{(.+?)\}\}/g, '<bdi dir="ltr">$1</bdi>')
      .replace(/\{(\w+)\}/g, function (_, k) { return k in vars ? "<bdi>" + esc(vars[k]) + "</bdi>" : _; });
  }
  function nightsWord(n) {
    var w = S.words.nights; if (!n) return "";
    if (n === 1) return w[1]; if (n === 2) return w[2]; if (n <= 10) return w.many.replace("{n}", n); return w.lots.replace("{n}", n);
  }
  var AR_DATE = new Intl.DateTimeFormat("ar-EG-u-ca-gregory-nu-latn", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  function fmtDate(iso) { var p = iso.split("-"); return AR_DATE.format(new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]))).replace(/،/g, ""); }   /* e.g. الجمعة 23 أكتوبر 2026 */
  function daysBetween(a, b) { var pa = a.split("-"), pb = b.split("-"); return Math.round((Date.UTC(+pb[0], +pb[1] - 1, +pb[2]) - Date.UTC(+pa[0], +pa[1] - 1, +pa[2])) / 86400000); }

  var I = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    chevUp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18V8a2 2 0 0 1 2-2h7v6M3 12h18v6M21 18v-4a2 2 0 0 0-2-2h-7"/><path d="M6 9.5h3"/></svg>',
    route: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8 17h5a3 3 0 0 0 3-3V9"/></svg>',
    plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 13.5L4 11l1.5-1.5 6 .8 4.3-4.3a2 2 0 0 1 2.8 2.8L14.3 13l.8 6-1.5 1.5-2.5-6.5-3 3 .3 2.3-1.2 1.2-1.4-3.4L3.4 15l1.2-1.2z"/></svg>',
    jet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13l8-2 5-7 2 1-3 7 5 2v2l-6-1-2 5-2 .5V15l-6 1z"/></svg>',
    car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16l1.5-5a2 2 0 0 1 1.9-1.4h7.2a2 2 0 0 1 1.9 1.4L19 16"/><rect x="3.5" y="16" width="17" height="4" rx="1"/><circle cx="7.5" cy="20" r="1.5"/><circle cx="16.5" cy="20" r="1.5"/></svg>',
    yacht: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17h18l-2 3H5z"/><path d="M5 17l1-5h12l1 5M12 12V5l6 7"/></svg>',
    boat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15h18l-2.5 4h-13z"/><path d="M6 15l1-4h10l1 4M12 11V7h4l1 4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M4 19h16"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>',
    stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    wave: '<svg class="wave" viewBox="0 0 24 16" aria-hidden="true"><path d="M2 8v1M5 5v6M8 7v3M11 2v12M14 6v4M17 4v8M20 7v3M23 8v1"/></svg>',
    chatMark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9zM4 14l.7 1.9 1.9.7-1.9.7L4 19l-.7-1.7-1.9-.7 1.9-.7z"/></svg>'
  };
  var ALL_RESORTS = R.reduce(function (a, g) { return a.concat(g.items.map(function (r) { r.group = g.group; return r; })); }, []);

  /* ---------- conversation state ---------- */
  var state;
  function freshState() {
    return { stage: "name", name: "", resortName: "", resort: null, villaName: "", rateName: "", adults: 2, children: 0,
      checkIn: "", checkOut: "", checkInLabel: "", checkOutLabel: "", nights: 0, mode: "", arrivalAirport: "", departureAirport: "", flight: {}, voice: null, voiceData: null, guest: null, otp: null, verified: false, termsAccepted: false, paymentClickedAt: 0, paid: false };
  }

  /* ---------- DOM ---------- */
  var scroll = document.getElementById("chat-scroll"), panel = document.getElementById("chat-panel"), launcher = document.getElementById("chat-launcher"),
    closeBtn = document.getElementById("chat-close"), composer = document.getElementById("chat-input"), sendBtn = document.getElementById("chat-send"),
    menuBtn = document.getElementById("chat-menu"), menu = document.getElementById("chat-menu-list"), miniBar = document.getElementById("chat-minibar"),
    miniText = document.getElementById("chat-minibar-text"), resortsSection = document.getElementById("resorts"), rail = document.getElementById("resort-rail");
  var busy = false, savedScroll = 0, typingEl = null;

  function scrollToEnd() { scroll.scrollTo({ top: scroll.scrollHeight, behavior: reduced ? "auto" : "smooth" }); }
  /* Reading position: the customer's own message goes to the bottom; the first reply of a turn is brought into
     view once; later replies and components only light the "رسائل جديدة" control. */
  var newMsgsBtn = document.getElementById("chat-newmsgs"), unreadFirst = null;
  function isVisible(el) { var top = el.offsetTop, bot = top + el.offsetHeight, vTop = scroll.scrollTop, vBot = vTop + scroll.clientHeight; return bot <= vBot + 4 && top >= vTop - 4; }
  function revealFirstReply(el) {
    var top = el.offsetTop, bot = top + el.offsetHeight, vh = scroll.clientHeight;
    if (isVisible(el)) return;
    var target = el.offsetHeight > vh - 24 ? top - 12 : bot - vh + 12;
    scroll.scrollTo({ top: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
  }
  function noteUnread(el) { if (!el || isVisible(el)) return; if (!unreadFirst) unreadFirst = el; if (newMsgsBtn) newMsgsBtn.hidden = false; }
  function clearUnread() { unreadFirst = null; if (newMsgsBtn) newMsgsBtn.hidden = true; }
  if (newMsgsBtn) newMsgsBtn.addEventListener("click", function () { if (unreadFirst) scroll.scrollTo({ top: Math.max(0, unreadFirst.offsetTop - 12), behavior: reduced ? "auto" : "smooth" }); clearUnread(); });
  scroll.addEventListener("scroll", function () { if (scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 40) clearUnread(); });
  function setTypingStatus(on) { panel.classList.toggle("typing", !!on); }
  function addMsg(from, html) {
    var msg = h("div", { "class": "msg " + from });
    if (from === "agent") msg.appendChild(h("img", { "class": "av", src: "assets/logos/vrs-turtle-mark.svg", alt: "" , width: "28", height: "28" }));
    var col = h("div", { "class": "col" });
    col.appendChild(h("div", { "class": "bubble", lang: "ar", dir: "rtl", html: html }));
    col.appendChild(h("div", { "class": "meta", html: '<span class="time">' + esc(nowLabel()) + "</span>" + (from === "guest" ? ' <span class="tick" aria-label="أُرسلت">✓✓</span>' : "") }));
    msg.appendChild(col);
    scroll.appendChild(msg);
    return msg;
  }
  function addComponent(el) { scroll.appendChild(el); return el; }
  /* Minimal player: play/pause button, progress bar, time label. Returns a stop() for cleanup. */
  function wirePlayer(url, seconds, btn, bar, timeEl) {
    var au = new Audio(url), dur = seconds || 0;
    btn.innerHTML = I.play;
    function toggle() { if (au.paused) { var p = au.play(); if (p && p.catch) p.catch(function () {}); } else au.pause(); }
    btn.addEventListener("click", toggle);
    au.addEventListener("play", function () { btn.innerHTML = I.pause; });
    au.addEventListener("pause", function () { btn.innerHTML = I.play; });
    au.addEventListener("timeupdate", function () { var d = isFinite(au.duration) && au.duration > 0 ? au.duration : dur; if (d) bar.style.width = Math.min(100, au.currentTime / d * 100) + "%"; if (timeEl) timeEl.textContent = fmtSecs(au.currentTime); });
    au.addEventListener("ended", function () { bar.style.width = "0%"; if (timeEl) timeEl.textContent = fmtSecs(dur); btn.innerHTML = I.play; });
    return function () { au.pause(); au.removeAttribute("src"); btn.removeEventListener("click", toggle); btn.innerHTML = I.play; };   /* the preview button is reused per recording */
  }
  function fmtSecs(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  /* Customer-side audio bubble with a real player for the recorded message */
  function addVoiceMsg(url, seconds) {
    var msg = h("div", { "class": "msg guest audio" }), col = h("div", { "class": "col" });
    var bubble = h("div", { "class": "bubble", lang: "ar", dir: "rtl", html: '<div class="vm"><button type="button" class="vmplay" aria-label="تشغيل الرسالة الصوتية">' + I.play + '</button><span class="vmbar"><i></i></span><span class="vmtime">' + fmtSecs(seconds) + "</span>" + I.wave + '</div><div class="vmlabel">' + esc(S.words.voiceLabel) + "</div>" });
    col.appendChild(bubble);
    col.appendChild(h("div", { "class": "meta", html: '<span class="time">' + esc(nowLabel()) + '</span> <span class="tick" aria-label="أُرسلت">✓✓</span>' }));
    msg.appendChild(col); scroll.appendChild(msg);
    if (url) {
      wirePlayer(url, seconds, bubble.querySelector(".vmplay"), bubble.querySelector(".vmbar i"), bubble.querySelector(".vmtime"));
    } else { msg.classList.add("static"); bubble.querySelector(".vmplay").disabled = true; bubble.querySelector(".vmtime").textContent = ""; }   /* document representation: no invented duration */
    return msg;
  }
  function showTyping() { typingEl = h("div", { "class": "msg agent typing", html: '<img class="av" src="assets/logos/vrs-turtle-mark.svg" alt="" width="28" height="28"><div class="col"><div class="bubble"><span></span><span></span><span></span></div></div>' }); scroll.appendChild(typingEl); }
  function hideTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }
  function card(cls, inner) { return h("div", { "class": "rich " + (cls || "") }, [h("div", { "class": "cardbox", html: inner })]); }
  function head(title, sub) { return '<div class="chead"><h4 class="ctitle">' + esc(title) + '</h4>' + (sub ? '<p class="csub">' + sub + '</p>' : "") + "</div>"; }
  function consume(comp) { comp.classList.add("used"); comp.querySelectorAll("button, input, select, textarea").forEach(function (c) { c.disabled = true; }); }

  /* ---------- rich components (Arabic, RTL; independent left-side agent placement) ---------- */
  var C = {};
  /* Shared line icons; visual surfaces and typography are in atelier.css. */
  var Q = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>',
    loader: '<svg class="spinner" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>',
    circleCheck: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>',
    arrIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 7 7 17M17 17H7V7"/></svg>',
    arrOut: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5Z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'
  };
  var MODE_ICONS = { "By Plane": I.plane, "By Private Jet": I.jet, "By Car": I.car, "By Yacht": I.yacht };
  function rial(n) { return '<bdi class="money">' + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "<small>ر.س</small></bdi>"; }
  function comp(kind, inner, cls) { return h("div", { "class": "rich" }, [h("div", { "class": "component " + (cls || ""), "data-component": kind, html: inner })]); }
  function externalLink(url, text, cls) { return '<a class="' + (cls || "text-action") + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + text + " " + Q.ext + "</a>"; }
  function adultsWord(n) { return n === 1 ? "شخص بالغ واحد" : n === 2 ? "2 بالغين" : n + " بالغين"; }
  function stayStrip(st) {
    var a = st.checkIn.split("-"), b = st.checkOut.split("-");
    var same = a[1] === b[1];
    var range = same ? "<bdi>" + (+a[2]) + "–" + (+b[2]) + "</bdi> " + AR_MONTH.format(new Date(Date.UTC(+a[0], +a[1] - 1, 1))) : esc(st.checkInLabel) + " – " + esc(st.checkOutLabel);
    return '<div class="stay-strip">' + Q.calendar + "<span>" + range + "</span><span>·</span><span>" + nightsWord(st.nights) + "</span><span>·</span><span>" + adultsWord(st.adults) + "</span></div>";
  }
  var AR_MONTH = new Intl.DateTimeFormat("ar-EG-u-ca-gregory-nu-latn", { month: "long", year: "numeric", timeZone: "UTC" });
  function compactDateRange(a, b) {
    var pa = a.split("-"), pb = b && b.split("-");
    var month = AR_MONTH.format(new Date(Date.UTC(+pa[0], +pa[1] - 1, 1)));
    if (pb && pa[0] === pb[0] && pa[1] === pb[1]) return '<bdi>' + (+pa[2]) + '–' + (+pb[2]) + '</bdi> ' + esc(month);
    return '<bdi>' + (+pa[2]) + '</bdi> ' + esc(month) + (b ? ' – ' + compactDateRange(b) : '');
  }
  var SUGGESTED = ["Shebara", "Desert Rock", "Six Senses Southern Dunes, The Red Sea"];
  var VILLA_URL = B.resort.detailsUrl;      /* no dedicated villa pages are evidenced; the official Shebara page lists the villas */

  /* 1 resort suggestions */
  C.resortPick = function () {
    var rows = SUGGESTED.map(function (n) {
      var r = ALL_RESORTS.filter(function (x) { return x.name === n; })[0]; if (!r) return "";
      return '<div class="resort-row" data-name="' + esc(r.name) + '"><img src="' + esc(r.image) + '" alt="' + esc(r.name) + '" width="57" height="56" loading="lazy"><span class="resort-name">' + esc(r.name) + '</span><button type="button" class="choose" aria-label="اختيار ' + esc(r.name) + '">اختيار</button></div>';
    }).join("");
    var c = comp("resorts", '<div class="resort-list">' + rows + "</div>" + externalLink("https://www.visitredsea.com/en/resorts", "استكشف المزيد", "text-action rpick-more"));
    c.querySelectorAll(".resort-row").forEach(function (row) {
      row.querySelector(".choose").addEventListener("click", function () {
        if (c.classList.contains("used")) return;
        var name = row.getAttribute("data-name");
        act({ type: "resort", name: name }, null);
        if (name === "Shebara") { c.querySelector(".resort-list").classList.add("consumed"); row.classList.add("is-selected"); row.querySelector(".choose").outerHTML = '<span class="chosen-tag">' + Q.check + "اختير</span>"; }
      });
    });
    return c;
  };

  /* 2 selected resort strip */
  C.resortDetails = function (st) {
    var r = st.resort;
    return comp("detail", '<img src="' + esc(r.image) + '" width="70" height="70" alt="' + esc(r.name) + '"><div><span class="resort-name">' + esc(r.name) + '</span><span class="muted">' + esc(r.placeAr || r.place) + "</span></div>" + (r.url ? externalLink(r.url, "التفاصيل") : ""), "resort-details");
  };

  /* 3 villas: two rows, the other six behind disclosure; photo opens the official page */
  function villaRow(v, priced) {
    return '<div class="villa-row" data-villa="' + esc(v.name) + '"><a class="villa-photo" href="' + esc(VILLA_URL) + '" target="_blank" rel="noopener noreferrer" aria-label="معلومات الإقامة على صفحة Shebara: ' + esc(v.nameAr || v.name) + '" title="معلومات الإقامة على صفحة Shebara"><img src="' + esc(v.image) + '" width="63" height="68" alt="' + esc(v.nameAr || v.name) + '" loading="lazy">' + Q.ext + '</a><div><p class="villa-title">' + esc(v.nameAr || v.name) + '</p><p class="villa-meta">' + esc(v.occupancyAr || v.occupancy) + '</p><div class="villa-bottom">' + (priced ? rial(B.rate.total) : "<span></span>") + '<button type="button" class="mini-select">اختيار</button></div>' + (priced ? '<p class="price-basis">23–25 أكتوبر · للإقامة كاملة شامل الضرائب</p>' : "") + "</div></div>";
  }
  C.villas = function () {
    var first = V[0], second = V[1], rest = V.slice(2);
    var c = comp("villas", villaRow(first, first.name === B.villa.name) + villaRow(second, second.name === B.villa.name) + '<details class="catalog-more"><summary>عرض بقية الفلل <bdi>(' + rest.length + ")</bdi></summary>" + rest.map(function (v) { return villaRow(v, v.name === B.villa.name); }).join("") + "</details>");
    c.querySelectorAll(".villa-photo").forEach(function (a) { a.addEventListener("click", function (e) { e.stopPropagation(); }); });
    c.querySelectorAll(".villa-row").forEach(function (row) {
      row.querySelector(".mini-select").addEventListener("click", function () {
        if (c.classList.contains("used")) return;
        var name = row.getAttribute("data-villa");
        if (name !== B.villa.name) {                                  /* unsupported choice: re-quote state, nothing is carried over */
          var old = c.querySelector(".requote"); if (old) old.remove();
          row.insertAdjacentHTML("afterend", '<p class="requote">نحتاج تحديث السعر لهذه الفيلا قبل المتابعة.</p>');
        }
        act({ type: "villa", villa: name }, S.customer.villa.replace("{{{villa}}}", "{{" + name + "}}"));
        if (name === B.villa.name && state.villaName === name) {
          c.querySelectorAll(".villa-row").forEach(function (r) { if (r !== row) r.hidden = true; });
          var det = c.querySelector("details"); if (det) det.hidden = true;
          row.classList.add("is-selected");
          row.querySelector(".mini-select").innerHTML = Q.check + " محددة";
          row.querySelector(".price-basis").insertAdjacentHTML("afterend", '<div class="rate-choice">' + Q.circleCheck + esc(B.rate.nameAr) + "</div>");
        }
      });
    });
    return c;
  };

  /* 4 calendar: one range surface, Sunday-first Gregorian, Western digits */
  C.calendar = function () {
    var c = comp("calendar", "", "calendar"), box = c.firstChild, cur = { y: 2026, m: 9 }, sel = { a: "", b: "" }, invalid = false;
    var minMonth = 2026 * 12 + 9, maxMonth = 2027 * 12 + 2, today = new Date().toISOString().slice(0, 10);
    function iso(y, m, d) { return y + "-" + ("0" + (m + 1)).slice(-2) + "-" + ("0" + d).slice(-2); }
    function render() {
      var first = new Date(Date.UTC(cur.y, cur.m, 1)).getUTCDay(), days = new Date(Date.UTC(cur.y, cur.m + 1, 0)).getUTCDate(), idx = cur.y * 12 + cur.m;
      var html = '<div class="cal-top"><div class="cal-month"><button type="button" class="prev" aria-label="الشهر السابق"' + (idx <= minMonth ? " disabled" : "") + ">" + Q.chevR + "</button><strong>" + AR_MONTH.format(new Date(Date.UTC(cur.y, cur.m, 1))) + '</strong><button type="button" class="next" aria-label="الشهر التالي"' + (idx >= maxMonth ? " disabled" : "") + ">" + Q.chevL + '</button></div><div class="weekdays">' + ["ح", "ن", "ث", "ر", "خ", "ج", "س"].map(function (x) { return "<span>" + x + "</span>"; }).join("") + '</div><div class="days">';
      for (var i = 0; i < first; i++) html += '<span class="blank"></span>';
      for (var d = 1; d <= days; d++) {
        var k = iso(cur.y, cur.m, d), cls = k === sel.a || k === sel.b ? "endpoint" : (sel.a && sel.b && k > sel.a && k < sel.b) ? "middle" : (k < today ? "past" : "");
        html += '<button type="button" data-d="' + k + '" class="' + cls + '" aria-label="' + d + " " + AR_MONTH.format(new Date(Date.UTC(cur.y, cur.m, 1))) + (k === sel.a ? "، الوصول" : k === sel.b ? "، المغادرة" : "") + '" aria-pressed="' + (k === sel.a || k === sel.b) + '"' + (k < today ? " disabled" : "") + "><span>" + d + "</span></button>";
      }
      var n = sel.a && sel.b ? daysBetween(sel.a, sel.b) : 0;
      var msg = invalid ? '<p class="error">' + Q.alert + "المغادرة يجب أن تكون بعد الوصول.</p>" : !sel.a ? "<p>اختر يوم الوصول ثم يوم المغادرة.</p>" : !sel.b ? "<p>الوصول " + compactDateRange(sel.a) + " · اختر يوم المغادرة.</p>" : "<p>" + compactDateRange(sel.a, sel.b) + " · " + nightsWord(n) + " · " + adultsWord(state.adults) + "</p>";
      html += '</div></div><div class="cal-bottom">' + msg + '<div class="row between"><button type="button" class="primary calconfirm"' + (sel.a && sel.b ? "" : " disabled") + '>تأكيد التواريخ</button><span class="small muted">الدخول والمغادرة معًا</span></div></div>';
      box.innerHTML = html;
      box.querySelector(".prev").onclick = function () { cur.m--; if (cur.m < 0) { cur.m = 11; cur.y--; } render(); };
      box.querySelector(".next").onclick = function () { cur.m++; if (cur.m > 11) { cur.m = 0; cur.y++; } render(); };
      box.querySelectorAll(".days button").forEach(function (b) {
        b.onclick = function () {
          if (c.classList.contains("used")) return;
          var k = b.getAttribute("data-d"); invalid = false;
          if (!sel.a || (sel.a && sel.b)) sel = { a: k, b: "" };
          else if (k <= sel.a) { sel = { a: k, b: "" }; invalid = true; }
          else sel.b = k;
          render();
        };
      });
      box.querySelector(".calconfirm").onclick = function () {
        if (c.classList.contains("used") || !sel.a || !sel.b) return;
        act({ type: "dates", a: sel.a, b: sel.b }, null);
        if (state.checkIn === sel.a && state.checkOut === sel.b) { var bot = box.querySelector(".cal-bottom .row"); bot.innerHTML = '<span class="chosen-tag">' + Q.check + "اعتُمدت التواريخ</span>"; }
      };
    }
    render();
    return c;
  };

  /* 5 summaries: the same pattern with and without transport */
  function summary(st, withTransfers) {
    var t = B.transport;
    var html = '<span class="resort-name">' + esc(B.resort.name) + '</span><p class="villa-title">' + esc(B.villa.nameAr || B.villa.name) + '</p><div style="margin-top:10px">' + stayStrip(st) + "</div>";
    if (withTransfers) html += '<div class="row between" style="margin-top:12px"><span class="muted">الإقامة</span>' + rial(B.rate.total) + '</div><div class="row between"><span class="muted">التنقلات</span>' + rial(t.transfersTotal) + "</div>";
    html += '<div class="divider"></div><div class="total-line"><strong>' + (withTransfers ? "الإجمالي" : "إجمالي الإقامة") + "</strong>" + rial(withTransfers ? B.grandTotal : B.rate.total) + '</div><p class="muted" style="margin:5px 0 0">للإقامة كاملة · شامل جميع الضرائب</p>';
    return comp("summary", html, "cost-summary");
  }
  C.summary1 = function (st) { return summary(st, false); };
  C.summary2 = function (st) { return summary(st, true); };

  /* 6 arrival modes */
  C.modes = function () {
    var c = comp("modes", '<div class="mode-grid">' + B.transport.modes.map(function (m) { return '<button type="button" class="mode" data-mode="' + esc(m) + '" aria-pressed="false">' + MODE_ICONS[m] + "<span>" + esc(S.words.modes[m] || m) + "</span></button>"; }).join("") + "</div>");
    c.querySelectorAll(".mode").forEach(function (b) {
      b.addEventListener("click", function () {
        if (c.classList.contains("used")) return;
        c.querySelectorAll(".mode").forEach(function (x) { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
        act({ type: "mode", mode: b.getAttribute("data-mode") }, null);
      });
    });
    return c;
  };

  /* 7 one airport form with optional flight disclosure */
  C.airports = function () {
    var names = B.transport.airportsAr || {};
    function sel(label, name) { return '<label class="field"><span class="field-label">' + label + ' <span aria-hidden="true">*</span></span><select name="' + name + '" required aria-label="' + label + '"><option value="">اختر المطار</option>' + B.transport.airports.map(function (a) { return '<option value="' + esc(a) + '">' + esc(names[a] || a) + "</option>"; }).join("") + "</select></label>"; }
    function fld(label, name, type, wide) { return '<label class="field' + (wide ? " wide" : "") + '"><span class="field-label">' + label + '</span><input name="' + name + '" type="' + (type || "text") + '" autocomplete="off"></label>'; }
    var c = comp("airports", "", "airport-form"), box = c.firstChild;
    var form = h("form", { novalidate: "", html:
      '<div class="stack">' + sel("مطار الوصول", "arrival") + sel("مطار المغادرة", "departure") + "</div>" +
      '<details class="optional"><summary>تفاصيل الرحلات <span class="muted">· اختياري</span></summary>' +
      '<div class="muted" style="margin:8px 0">رحلة الوصول</div><div class="form-grid">' + fld("وقت الوصول", "arrTime", "time") + fld("شركة الطيران", "arrAirline") + fld("رقم الرحلة", "arrFlight", "text", true) + "</div>" +
      '<div class="muted" style="margin:8px 0">رحلة المغادرة</div><div class="form-grid">' + fld("وقت المغادرة", "depTime", "time") + fld("شركة الطيران", "depAirline") + fld("رقم الرحلة", "depFlight", "text", true) + "</div></details>" +
      '<div class="form-error error" role="alert"></div><button type="submit" class="primary full">اعتماد المطارات</button>' });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); if (c.classList.contains("used")) return;
      var f = form.elements, err = form.querySelector(".form-error");
      form.querySelectorAll(".field").forEach(function (l) { l.classList.remove("invalid"); });
      if (!f.arrival.value || !f.departure.value) { err.innerHTML = Q.alert + "اختر مطار الوصول ومطار المغادرة."; if (!f.arrival.value) f.arrival.closest(".field").classList.add("invalid"); if (!f.departure.value) f.departure.closest(".field").classList.add("invalid"); return; }
      err.textContent = "";
      act({ type: "airports", arrival: f.arrival.value, departure: f.departure.value, flight: { arrTime: f.arrTime.value, arrAirline: f.arrAirline.value, arrFlight: f.arrFlight.value, depTime: f.depTime.value, depAirline: f.depAirline.value, depFlight: f.depFlight.value } }, null);
    });
    box.insertAdjacentHTML("afterbegin", '<header class="surface-heading"><h3>الوصول والمغادرة</h3>' + Q.arrIn + '</header>');
    box.appendChild(form);
    return c;
  };

  /* 8 two transfer rows and the subtotal */
  C.transportTrip = function () {
    var t = B.transport;
    return comp("transport", t.legs.map(function (l, i) { return '<div class="transport-leg"><div><span class="leg-label">' + (i ? Q.arrOut : Q.arrIn) + (i ? "المغادرة" : "الوصول") + "</span><strong>" + esc(l.productAr || l.product) + "</strong></div>" + rial(l.price) + "</div>"; }).join("") + '<div class="divider"></div><div class="total-line"><strong>إجمالي التنقلات</strong>' + rial(t.transfersTotal) + '</div><p class="muted" style="margin:5px 0 0">لـ2 بالغين · شامل الضرائب</p>');
  };

  /* 9 three adjacent experiences, image and name only */
  C.activities = function () {
    return comp("experiences", '<div class="experience-grid">' + B.activities.map(function (a) { var latin = !/[؀-ۿ]/.test(a.nameAr || a.name); return '<div class="experience' + (latin ? " latin" : "") + '"><img src="' + esc(a.image) + '" width="100" height="81" alt="' + esc(a.nameAr || a.name) + '" loading="lazy"><span>' + esc(a.nameAr || a.name) + "</span></div>"; }).join("") + "</div>", "experiences");
  };

  /* 10 one coordinated guest and wife form (initial, voice-populated, edit) */
  var MARK_VOICE = '<span class="field-marker" role="img" aria-label="قيمة مستخلصة من الرسالة الصوتية" title="قيمة مستخلصة من الرسالة الصوتية">' + Q.spark + "</span>";
  var MARK_CHAT = '<span class="field-marker chat" role="img" aria-label="محفوظ من المحادثة" title="محفوظ من المحادثة">' + Q.chat + "</span>";
  function watchMark(l) {
    var ctl = l.querySelector("input, select, textarea"); if (!ctl) return;
    function clear() { var m = l.querySelector(".field-marker"); if (m) m.remove(); l.classList.remove("ai"); ctl.removeEventListener("input", clear); ctl.removeEventListener("change", clear); }
    ctl.addEventListener("input", clear); ctl.addEventListener("change", clear);
  }
  function fillPendingForm(vd) {
    var forms = scroll.querySelectorAll(".rich:not(.used) form.guest-form"), form = forms[forms.length - 1]; if (!form) return false;
    ["title", "familyName", "mobileCode", "mobile", "guest2First", "guest2Family", "requests"].forEach(function (k) {
      var ctl = form.elements[k]; if (!ctl || !vd[k]) return;
      ctl.value = vd[k];
      var l = ctl.closest(".field"); if (!l || l.querySelector(".field-marker")) return;
      l.querySelector(".field-label").insertAdjacentHTML("beforeend", MARK_VOICE); l.classList.add("ai"); watchMark(l);
    });
    form.elements.email.focus();
    return true;
  }
  C.guestForm = function (st, opts) {
    var edit = !!(opts && opts.edit), vd = edit ? st.guest : (st.voiceData || null), gf = B.guestForm;
    function val(k) { return vd && vd[k] ? esc(vd[k]) : ""; }
    function mark(k) { return edit ? "" : (k === "firstName" ? (st.name ? MARK_CHAT : "") : (vd && vd[k] ? MARK_VOICE : "")); }
    function fld(label, name, attrs, k, cls) { return '<label class="field' + (cls ? " " + cls : "") + (mark(k) ? " ai" : "") + '"><span class="field-label">' + label + mark(k) + "</span><input name=\"" + name + '" value="' + val(k) + '" ' + attrs + "></label>"; }
    var c = comp("guest", "", "guest-form"), box = c.firstChild; box.classList.add("guest-form");
    var form = h("form", { "class": "guest-form", novalidate: "", html:
      "<header><h3>" + (edit ? "تعديل بيانات الضيفين" : "بيانات الضيفين") + "</h3>" + (edit ? Q.pencil : Q.user) + "</header>" +
      '<div class="guest-name-grid"><label class="field' + (mark("title") ? " ai" : "") + '"><span class="field-label">اللقب' + mark("title") + '</span><select name="title" required><option value="">اختر</option>' + gf.titles.map(function (x) { return "<option" + (vd && vd.title === x ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field' + (mark("firstName") ? " ai" : "") + '"><span class="field-label">الاسم الأول' + mark("firstName") + '</span><input name="firstName" value="' + esc(edit ? vd.firstName : st.name) + '" autocomplete="given-name" required></label>' +
      fld("اسم العائلة", "familyName", 'autocomplete="family-name" required', "familyName") + "</div>" +
      '<div style="margin-top:10px"><label class="field"><span class="field-label">البريد الإلكتروني</span><input name="email" type="email" dir="ltr" autocomplete="email" inputmode="email" required' + (edit ? ' value="' + esc(vd.email) + '"' : "") + "></label></div>" +
      '<div class="phone-grid" style="margin-top:10px"><label class="field' + (mark("mobileCode") ? " ai" : "") + '"><span class="field-label">رمز الدولة' + mark("mobileCode") + '</span><select name="mobileCode" dir="ltr">' + gf.countryCodes.map(function (x) { return "<option" + (x === ((vd && vd.mobileCode) || gf.defaultCountryCode) ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + "</select></label>" +
      fld("الجوال", "mobile", 'type="tel" dir="ltr" inputmode="tel" autocomplete="tel-national" required', "mobile") + "</div>" +
      '<div class="subheading">بيانات الزوجة <span class="muted">· اختياري</span></div><div class="form-grid">' + fld("الاسم الأول", "guest2First", 'autocomplete="off"', "guest2First") + fld("اسم العائلة", "guest2Family", 'autocomplete="off"', "guest2Family") + "</div>" +
      '<div style="margin-top:10px"><label class="field' + (mark("requests") ? " ai" : "") + '"><span class="field-label">طلب إضافي <span class="muted">· اختياري</span>' + mark("requests") + '</span><textarea name="requests" maxlength="200">' + val("requests") + '</textarea></label></div><p class="muted" style="margin-top:3px">يُنظر في الطلب حسب الإمكانية.</p>' +
      '<label class="check-label"><input type="checkbox" name="marketing"' + (edit && vd.marketing ? " checked" : "") + "><span>أرغب في تلقي أخبار وعروض البحر الأحمر.</span></label>" +
      '<p class="legal">اطّلع على <a href="' + esc(B.legal.termsUrl) + '" target="_blank" rel="noopener noreferrer">الشروط والأحكام</a> و<a href="' + esc(B.legal.privacyUrl) + '" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a>.</p>' +
      '<div class="form-error error" role="alert"></div>' + (edit ? '<div class="row"><button type="submit" class="primary full">حفظ التعديلات</button><button type="button" class="secondary cancel">إلغاء</button></div>' : '<button type="submit" class="primary full">اعتماد البيانات</button>') });
    form.querySelectorAll(".field.ai").forEach(watchMark);
    if (edit) form.querySelector(".cancel").addEventListener("click", function () { c.remove(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); if (c.classList.contains("used")) return;
      var f = form.elements, errs = [];
      form.querySelectorAll(".field").forEach(function (l) { l.classList.remove("invalid"); });
      function bad(name, msg) { errs.push(msg); f[name].closest(".field").classList.add("invalid"); }
      if (!f.title.value) bad("title", "اللقب مطلوب.");
      if (!f.firstName.value.trim()) bad("firstName", "الاسم الأول مطلوب.");
      if (!f.familyName.value.trim()) bad("familyName", "اسم العائلة مطلوب.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) bad("email", "أدخل بريدًا إلكترونيًا صحيحًا.");
      if (!/^\d[\d\s]{6,14}$/.test(f.mobile.value.trim())) bad("mobile", "أدخل رقم جوال صحيحًا.");
      var err = form.querySelector(".form-error"); err.innerHTML = errs.length ? Q.alert + esc(errs.join(" ")) : "";
      if (errs.length) return;
      var data = { title: f.title.value, firstName: f.firstName.value.trim(), familyName: f.familyName.value.trim(), email: f.email.value.trim(), mobileCode: f.mobileCode.value, mobile: f.mobile.value.trim(), guest2First: f.guest2First.value.trim(), guest2Family: f.guest2Family.value.trim(), requests: f.requests.value.trim(), marketing: f.marketing.checked };
      act({ type: edit ? "guestEdit" : "guest", data: data }, null);
    });
    box.innerHTML = ""; box.appendChild(form);
    return c;
  };

  /* 12 review with editing and an explicit, unchecked terms acknowledgement */
  C.review = function (st, opts) {
    var g = st.guest, t = B.transport, names = B.transport.airportsAr || {};
    var html = "<header><h3>مراجعة رحلتك</h3><button type=\"button\" class=\"text-action editbtn\">" + Q.pencil + "تعديل البيانات</button></header>" +
      (opts && opts.updated ? '<div class="chosen-tag">' + Q.check + "حُفظت التعديلات</div>" : "") +
      '<div class="review-group"><div class="group-title">الإقامة</div><p><bdi>' + esc(B.resort.name) + "</bdi> · " + esc(B.villa.nameAr || B.villa.name) + "</p><p>" + esc(st.checkInLabel) + " – " + esc(st.checkOutLabel) + " · " + nightsWord(st.nights) + " · " + adultsWord(st.adults) + " · 0 أطفال</p></div>" +
      '<details class="review-group review-disclosure"><summary class="group-title">التنقلات' + rial(t.transfersTotal) + '</summary><div class="review-legs"><p>الوصول: ' + esc(names[st.arrivalAirport] || st.arrivalAirport) + " ← <bdi>" + esc(B.resort.name) + "</bdi></p><p>" + esc(t.legs[0].productAr || t.legs[0].product) + "</p><p>المغادرة: <bdi>" + esc(B.resort.name) + "</bdi> ← " + esc(names[st.departureAirport] || st.departureAirport) + "</p><p>" + esc(t.legs[1].productAr || t.legs[1].product) + "</p></div></details>" +
      '<div class="review-group"><div class="group-title">الضيوف والتواصل</div><p>' + esc(g.title + " " + g.firstName + " " + g.familyName) + (g.guest2First || g.guest2Family ? " · " + esc((g.guest2First + " " + g.guest2Family).trim()) : "") + "</p><p><bdi>" + esc(g.mobileCode + " " + g.mobile) + "</bdi></p><p><bdi>" + esc(g.email) + "</bdi></p></div>" +
      '<div class="review-group"><div class="group-title">التجارب والطلبات</div><p>لم تُضف تجارب · الاختيار عند الوصول</p><p>' + (g.requests ? esc(g.requests) + " · حسب الإمكانية" : "لا توجد طلبات إضافية") + "</p>" + (g.marketing ? "<p>مشترك في أخبار وعروض البحر الأحمر</p>" : "") + "</div>" +
      '<div class="total-line"><strong>الإجمالي</strong>' + rial(B.grandTotal) + '</div><p class="muted">شامل الضرائب · الإقامة <bdi>' + Number(B.rate.total).toLocaleString("en-US", { minimumFractionDigits: 2 }) + "</bdi> + التنقلات <bdi>" + Number(t.transfersTotal).toLocaleString("en-US", { minimumFractionDigits: 2 }) + "</bdi></p>" +
      '<label class="check-label"><input type="checkbox" name="terms"' + (st.termsAccepted ? " checked" : "") + '><span>قرأت ووافقت على <a href="' + esc(B.legal.termsUrl) + '" target="_blank" rel="noopener noreferrer">الشروط والأحكام</a> و<a href="' + esc(B.legal.privacyUrl) + '" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a>.</span></label><div class="form-error error" role="alert"></div>';
    var c = comp("review", html, "review");
    c.querySelector("[name=terms]").addEventListener("change", function (e) { st.termsAccepted = e.target.checked; c.querySelector(".form-error").textContent = ""; });
    c.querySelector(".editbtn").addEventListener("click", function () {
      if (c.classList.contains("used") || busy || scroll.querySelector(".rich:not(.used) form.guest-form")) return;
      var f = addComponent(C.guestForm(st, { edit: true })); noteUnread(f);
    });
    return c;
  };
  function termsError() { var r = Array.prototype.slice.call(scroll.querySelectorAll(".rich:not(.used) .review")).pop(); if (r) r.querySelector(".form-error").innerHTML = Q.alert + "يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية."; }

  /* 13 e-mail verification: all states come from server.py; nothing is accepted locally */
  var FILE_ORIGIN = location.protocol === "file:";
  C.verify = function (st) {
    var email = st.guest.email, masked = email.replace(/^(.{2}).*(@.*)$/, "$1••••$2");
    var c = comp("otp", "", "otp"), box = c.firstChild;
    var inflight = false, cooldown = 0, cdTimer = null;
    var MSG = {
      file_origin: "تعذر الاتصال بخدمة التحقق. حاول مرة أخرى.",
      unreachable: "تعذر الاتصال بخدمة التحقق. حاول مرة أخرى.", static_server: "خدمة التحقق غير متاحة حاليًا. حاول مرة أخرى.",
      email_not_configured: "خدمة التحقق غير متاحة حاليًا. حاول مرة أخرى.", recipient_not_allowed: "تعذر إرسال الرمز إلى هذا البريد. راجع العنوان وحاول مرة أخرى.",
      invalid_email: "أدخل بريدًا إلكترونيًا صحيحًا.", cooldown: "يرجى الانتظار قليلًا قبل طلب رمز آخر.", send_failed: "تعذر إرسال الرمز. حاول مرة أخرى.", bad_response: "أجابت الخدمة بطريقة غير متوقعة."
    };
    function api(method, path, body) {
      var opts = { method: method, headers: { "Accept": "application/json" } };
      if (body) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
      return fetch(path, opts).then(function (r) {
        var ct = r.headers.get("content-type") || "";
        if (ct.indexOf("application/json") < 0) return { kind: r.status === 404 || r.status === 501 ? "static_server" : "bad_response", status: r.status, body: {} };
        return r.json().then(function (b) { return { kind: "json", ok: r.ok, status: r.status, body: b || {} }; }, function () { return { kind: "bad_response", status: r.status, body: {} }; });
      }, function () { return { kind: "unreachable", status: 0, body: {} }; });
    }
    function view(stateName, extra) {
      var initial = stateName === "initial" || stateName === "sending" || stateName === "failure" || stateName === "blocked";
      var html = "<header><h3>تأكيد بريدك الإلكتروني</h3>" + Q.mail + '</header><p class="muted">' + (stateName === "verified" ? "بريدك جاهز للمتابعة." : initial ? "نرسل لك رمزًا لتأكيد البريد." : "أدخل الرمز المرسل إلى بريدك.") + '</p><div class="otp-email"><bdi>' + esc(initial ? email : masked) + "</bdi></div>";
      if (stateName === "verified") html += '<div class="status-message success">' + Q.circleCheck + "تم التحقق من البريد</div>";
      else if (initial) html += (extra ? '<p class="error" style="margin-bottom:10px">' + Q.alert + esc(extra) + "</p>" : "") + '<button type="button" class="primary full vsend"' + (stateName === "sending" || stateName === "blocked" ? " disabled" : "") + ">" + (stateName === "sending" ? Q.loader + " جارٍ الإرسال…" : stateName === "failure" ? "إعادة المحاولة" : stateName === "blocked" ? "إرسال الرمز" : "إرسال الرمز") + "</button>" + (stateName === "blocked" ? '<div class="row between" style="margin-top:6px"><span class="muted"></span><button type="button" class="text-action vcheck">تحقق مرة أخرى</button></div>' : "");
      else html += '<form class="vform" novalidate><div class="otp-boxes' + (stateName === "invalid" || stateName === "expired" ? " invalid" : "") + '">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<input maxlength="1" inputmode="numeric" pattern="[0-9]" aria-label="الرقم ' + (i + 1) + ' من رمز التحقق" autocomplete="' + (i === 0 ? "one-time-code" : "off") + '" placeholder="–">'; }).join("") + '</div><div class="otp-note" role="alert">' + (extra ? '<p class="error">' + Q.alert + esc(extra) + "</p>" : "") + '</div><button type="submit" class="primary full">تحقق</button></form><div class="row between" style="margin-top:6px"><span class="muted">لم يصلك الرمز؟</span><button type="button" class="text-action vresend"' + (cooldown > 0 ? " disabled" : "") + ">" + (cooldown > 0 ? "إعادة الإرسال بعد 00:" + ("0" + cooldown).slice(-2) : "إعادة الإرسال") + "</button></div>";
      box.innerHTML = html; wire(stateName);
    }
    function startCooldown(sec) {
      cooldown = sec; clearInterval(cdTimer);
      cdTimer = setInterval(function () { cooldown--; var b = box.querySelector(".vresend"); if (c.classList.contains("used") || !b) { clearInterval(cdTimer); return; } if (cooldown <= 0) { clearInterval(cdTimer); b.disabled = false; b.textContent = "إعادة الإرسال"; } else b.textContent = "إعادة الإرسال بعد 00:" + ("0" + cooldown).slice(-2); }, 1000);
      timers.push(cdTimer);
    }
    function probe() {
      if (FILE_ORIGIN) { view("blocked", MSG.file_origin); return; }
      view("sending");
      api("GET", "/api/otp/status").then(function (r) {
        if (r.kind !== "json" || r.body.service !== "otp") { console.warn("otp status", r.kind, r.status); view("blocked", MSG[r.kind === "json" ? "bad_response" : r.kind]); return; }
        if (!r.body.configured) { console.warn("otp not configured"); view("blocked", MSG.email_not_configured); return; }
        view("initial");
      });
    }
    function request() {
      if (inflight || c.classList.contains("used") || FILE_ORIGIN) return;
      inflight = true; view("sending");
      api("POST", "/api/otp/request", { email: email }).then(function (r) {
        inflight = false;
        if (r.kind === "json" && r.ok && r.body.challengeId) { st.otp = { challengeId: r.body.challengeId, email: email }; startCooldown(r.body.resendAfterSec || 30); view("sent"); box.querySelector(".otp-boxes input").focus(); return; }
        console.warn("otp request", r.kind, r.status, r.body && r.body.error, r.body && r.body.reason);
        var e = r.kind === "json" ? r.body.error : r.kind;
        if (e === "cooldown") { startCooldown(r.body.retryAfterSec || 30); view("sent", MSG.cooldown); return; }
        view("failure", MSG[e] || MSG.send_failed);
      });
    }
    function wire(stateName) {
      var sendB = box.querySelector(".vsend"), check = box.querySelector(".vcheck"), resend = box.querySelector(".vresend"), form = box.querySelector(".vform");
      if (sendB) sendB.addEventListener("click", request);
      if (check) check.addEventListener("click", probe);
      if (resend) resend.addEventListener("click", request);
      if (form) {
        var inputs = form.querySelectorAll(".otp-boxes input");
        inputs.forEach(function (inp, i) {
          inp.addEventListener("input", function () { inp.value = inp.value.replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); }).replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); }).replace(/\D/g, "").slice(-1); if (inp.value && inputs[i + 1]) inputs[i + 1].focus(); });
          inp.addEventListener("keydown", function (e) { if (e.key === "Backspace" && !inp.value && inputs[i - 1]) inputs[i - 1].focus(); });
          inp.addEventListener("paste", function (e) { var t = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, ""); if (t.length >= 2) { e.preventDefault(); inputs.forEach(function (x, j) { x.value = t[j] || ""; }); (inputs[Math.min(t.length, 5)]).focus(); } });
        });
        form.addEventListener("submit", function (ev) {
          ev.preventDefault(); if (inflight || c.classList.contains("used") || !st.otp) return;
          var code = Array.prototype.map.call(inputs, function (x) { return x.value; }).join("");
          if (!/^\d{6}$/.test(code)) { form.querySelector(".otp-note").innerHTML = '<p class="error">' + Q.alert + "أدخل الأرقام الستة.</p>"; return; }
          inflight = true; form.querySelector("button[type=submit]").disabled = true;
          api("POST", "/api/otp/verify", { challengeId: st.otp.challengeId, email: email, code: code }).then(function (r) {
            inflight = false;
            if (r.kind === "json" && r.ok && r.body.verified) { clearInterval(cdTimer); view("verified"); act({ type: "verify" }, null); return; }
            var e = r.kind === "json" ? r.body.error : r.kind;
            console.warn("otp verify", r.status, e);
            if (e === "wrong") view("invalid", "الرمز غير صحيح. راجعه وحاول مرة أخرى." + (r.body.attemptsLeft ? " تبقّت " + r.body.attemptsLeft + " محاولات." : ""));
            else if (e === "expired" || e === "consumed") view("expired", "انتهت صلاحية الرمز. اطلب رمزًا جديدًا.");
            else if (e === "locked") view("expired", "محاولات كثيرة. اطلب رمزًا جديدًا.");
            else view("expired", "تعذر التحقق من الرمز. اطلب رمزًا جديدًا.");
          });
        });
      }
    }
    probe();
    return c;
  };

  /* 14 payment handoff and quiet waiting */
  C.payment = function () {
    var c = comp("payment", '<span class="lock">' + Q.lock + '</span><p style="margin-top:9px">إجمالي رحلتك</p>' + rial(B.grandTotal) + '<span class="muted">شامل الضرائب</span><div class="destination">' + Q.globe + " الوجهة الرسمية <bdi>visitredsea.com</bdi></div>" +
      '<a class="primary full cta" href="' + esc(B.checkoutUrl) + '" target="_blank" rel="noopener noreferrer">المتابعة للدفع ' + Q.ext + "</a>", "payment");
    c.querySelector(".cta").addEventListener("click", function () {
      if (state.paymentClickedAt) return;                            /* the link still opens; only the first click starts the wait */
      startPaymentTimer();
      c.querySelector(".cta").outerHTML = '<div class="status-message">' + Q.loader + "لحظات ونكمل معك</div>";
    });
    return c;
  };

  /* 15 final information card with the PDF action */
  C.confirmation = function (st) {
    var g = st.guest, t = B.transport, names = B.transport.airportsAr || {};
    var c = comp("confirmation", '<div class="confirmation-header">' + Q.circleCheck + '<h3>رحلتك بانتظارك</h3></div><p class="muted" style="margin-bottom:12px">هذه تفاصيل إقامتك يا ' + esc(g.firstName) + '.</p><span class="resort-name" style="font-size:23px;text-align:right">' + esc(B.resort.name) + '</span><p style="margin:4px 0 10px">' + esc(B.villa.nameAr || B.villa.name) + "</p>" + stayStrip(st) +
      '<div class="review-group"><p>' + esc(g.firstName + " " + g.familyName) + (g.guest2First || g.guest2Family ? " · " + esc((g.guest2First + " " + g.guest2Family).trim()) : "") + "</p><p><bdi>" + esc(g.email) + "</bdi></p><p><bdi>" + esc(g.mobileCode + " " + g.mobile) + "</bdi></p></div>" +
      '<details class="optional"><summary>التنقلات والطلب الإضافي</summary><p>الوصول: ' + esc(names[st.arrivalAirport] || st.arrivalAirport) + " · " + esc(t.legs[0].productAr || t.legs[0].product) + "</p><p>المغادرة: " + esc(names[st.departureAirport] || st.departureAirport) + " · " + esc(t.legs[1].productAr || t.legs[1].product) + "</p><p>لا تجارب مضافة</p>" + (g.requests ? "<p>" + esc(g.requests) + " · حسب الإمكانية</p>" : "") + "</details>" +
      '<div class="total-line"><strong>الإجمالي</strong>' + rial(B.grandTotal) + '</div><p class="muted" style="margin:3px 0 13px">شامل الضرائب</p><div class="row"><button type="button" class="primary full pdf">' + Q.download + ' تحميل PDF</button></div><span class="pdfstatus" aria-live="polite"></span>', "confirmation");
    var btn = c.querySelector(".pdf"), status = c.querySelector(".pdfstatus");
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      btn.disabled = true; status.textContent = "جارٍ تجهيز ملف PDF…";
      window.BookingPdf.make(st, B).then(function (blob) { window.BookingPdf.download(blob, B.resort.name + "_Booking_Summary_" + st.checkIn + ".pdf"); status.textContent = "تم التحميل."; btn.disabled = false; })
        .catch(function () { status.textContent = "تعذر تجهيز الملف. حاول مرة أخرى."; btn.disabled = false; });
    });
    return c;
  };

  /* Quick replies: one reusable group bound to the stage it was rendered for */
  C.quick = function (st, choices) {
    var c = h("div", { "class": "rich quick", "data-stage": st.stage, role: "group", "aria-label": "ردود سريعة" });
    var wrap = h("div", { "class": "qrs" });
    scroll.querySelectorAll(".rich.quick:not(.used)").forEach(consume);          /* only the latest group stays live */
    choices.forEach(function (ch) {
      var b = h("button", { type: "button", "class": "qr" + (ch.primary ? " primary" : ""), "data-id": ch.id, html: (ch.primary ? Q.check : "") + esc(ch.label) });
      b.addEventListener("click", function () {
        if (c.classList.contains("used") || busy || c.getAttribute("data-stage") !== state.stage) return;
        var q = QUICK[ch.id]; if (!q || q.stages.indexOf(state.stage) < 0) return;
        if (q.reveal) { var target = Array.prototype.slice.call(scroll.querySelectorAll(q.reveal)).pop(); if (target) scroll.scrollTo({ top: Math.max(0, target.closest(".rich").offsetTop - 12), behavior: reduced ? "auto" : "smooth" }); return; }
        b.classList.add("chosen"); consume(c);
        act(q.meta(), q.label || ch.label);
      });
      wrap.appendChild(b);
    });
    c.appendChild(wrap);
    return c;
  };

  /* V2: no page hand-off. The page is never scrolled, dimmed or decorated. */
  function endChoose() {}
  function minimize() {}
  function restore() {}

  /* ---------- engine ---------- */
  var APPROVE = ["تمام", "موافق", "مناسب", "اوكي", "اوك", "ok", "okay", "نعم", "ايه", "ايوه", "اي", "كمل", "نكمل", "ماشي", "زين", "مضبوط", "اكيد", "ابشر", "يصير", "يصلح", "اعتمد", "وافق", "ممتاز", "جميل", "حلو", "يس", "yes", "تم", "صحيح", "صحيحه"];
  /* Typed approval: an explicit negative never counts as consent */
  function approves(t) { if (/(غير|مو|مب|ما|لا|لست|مش)\s*(موافق|اوافق|مناسب|نكمل|اعتمد|صحيح|تمام)/.test(t) || /^(لا|كلا)\b/.test(t)) return false; return has(t, APPROVE); }
  /* Quick replies: stable ids, valid stages, and the engine action they resolve to. Labels live in data/script.js. */
  var QUICK = {
    party_yes: { stages: ["party"], meta: function () { return { type: "party" }; } },
    approve1_ok: { stages: ["approve1"], meta: function () { return { type: "approve" }; } },
    approve1_review: { stages: ["approve1"], reveal: ".cost-summary" },
    approve2_ok: { stages: ["approve2"], meta: function () { return { type: "approve" }; } },
    approve2_review: { stages: ["approve2"], reveal: ".cost-summary" },
    activities_defer: { stages: ["activities"], meta: function () { return { type: "defer" }; } },
    review_confirm: { stages: ["review"], meta: function () { return { type: "confirm" }; } },
    resort_shebara: { stages: ["resort"], meta: function () { return { type: "resort", name: "Shebara" }; } },
    villa_supported: { stages: ["villa"], meta: function () { return { type: "villa", villa: B.villa.name }; } },
    dates_supported: { stages: ["dates"], meta: function () { return { type: "dates", a: B.stay.checkIn, b: B.stay.checkOut }; } },
    mode_plane: { stages: ["mode"], meta: function () { return { type: "mode", mode: B.transport.supportedMode }; } },
    airports_supported: { stages: ["airports"], meta: function () { return { type: "airports", arrival: B.transport.arrivalAirport, departure: B.transport.departureAirport, flight: {} }; } }
  };
  function stageSpec(text, meta) {
    var t = norm(text), st = state, M = meta || {};
    if (M.type === "voiceOther") return { ok: false, reply: S.voice.other };     /* a voice message outside the guest-details stage */
    switch (st.stage) {
      case "name": {
        var toks = t.replace(/^(انا|اسمي|معك|معاك|اسمى|هلا|حياك|مرحبا|السلام عليكم|اهلا)\s*/g, "").split(" ").filter(Boolean);
        if (!toks.length || toks.length > 4) return { ok: false, reply: S.name.fallback };
        var raw = String(text).trim().replace(/^(أنا|انا|اسمي|إسمي|معك|معاك)\s+/i, "").replace(/[.!؟?]+$/, "").split(/\s+/)[0];
        if (!raw || raw.length > 20) return { ok: false, reply: S.name.fallback };
        st.name = raw; return { ok: true, next: "intent", reply: S.name.ok };
      }
      case "intent":
        if (has(t, ["منتجع", "منتجعات", "اجازه", "اجازة", "رحله", "رحلة", "resort", "resorts", "اقامه", "اقامة", "نبي نروح", "فندق", "فنادق", "اشوف", "استكشف"])) return { ok: true, next: "resort", reply: S.intent.ok };
        return { ok: false, reply: S.intent.fallback };
      case "resort": {
        var r = M.type === "resort" ? ALL_RESORTS.filter(function (x) { return x.name === M.name; })[0] : matchResort(t);
        if (!r) return { ok: false, reply: S.resort.fallback };
        st.resort = r; st.resortName = r.name;
        if (r.id === "shebara" || r.name === "Shebara") return { ok: true, next: "villa", reply: S.resort.ok };
        return { ok: false, reply: S.resort.other };
      }
      case "villa": {
        var vn = M.type === "villa" ? M.villa : matchVilla(t);
        if (!vn) return { ok: false, reply: S.villa.fallback };
        st.villaName = vn;
        if (vn === B.villa.name) { st.rateName = B.rate.name; return { ok: true, next: "party", reply: S.villa.ok }; }
        return { ok: false, reply: S.villa.other };
      }
      case "party":
        if (M.type === "party" || has(t, ["زوجتي", "زوجه", "اثنين", "شخصين", "نفرين", "بس انا", "فقط", "احنا الاثنين", "2", "ثنين", "انا وزوجتي", "لا احد", "ما في احد", "محد"])) { st.adults = 2; st.children = 0; return { ok: true, next: "dates", reply: S.party.ok }; }
        return { ok: false, reply: S.party.fallback };
      case "dates": {
        var a = M.type === "dates" ? M.a : null, b = M.type === "dates" ? M.b : null;
        if (!a) { var m = t.match(/(\d{1,2})\D+(\d{1,2})/); if (m && has(t, ["اكتوبر", "10", "october", "oct"])) { a = "2026-10-" + ("0" + m[1]).slice(-2); b = "2026-10-" + ("0" + m[2]).slice(-2); } }
        if (!a || !b) return { ok: false, reply: S.dates.fallback };
        var n = daysBetween(a, b); if (n < 1) return { ok: false, reply: S.dates.invalid };
        st.checkIn = a; st.checkOut = b; st.nights = n; st.checkInLabel = fmtDate(a); st.checkOutLabel = fmtDate(b);
        if (a === B.stay.checkIn && b === B.stay.checkOut) return { ok: true, next: "approve1", reply: S.dates.ok };
        return { ok: false, reply: S.dates.other };
      }
      case "approve1": if (M.type === "approve" || approves(t)) return { ok: true, next: "mode", reply: S.approve1.ok }; return { ok: false, reply: S.approve1.fallback };
      case "mode": {
        var mode = M.type === "mode" ? M.mode : matchMode(t);
        if (!mode) return { ok: false, reply: S.mode.fallback };
        st.mode = mode;
        if (mode === B.transport.supportedMode) return { ok: true, next: "airports", reply: S.mode.ok };
        return { ok: false, reply: S.mode.other };
      }
      case "airports": {
        var ar = M.type === "airports" ? M.arrival : (has(t, ["ينبع", "yanbu"]) ? B.transport.arrivalAirport : ""), dp = M.type === "airports" ? M.departure : (has(t, ["البحر الاحمر", "الدولي", "rsia", "red sea international"]) ? B.transport.departureAirport : "");
        if (!ar || !dp) return { ok: false, reply: S.airports.fallback };
        st.arrivalAirport = ar; st.departureAirport = dp; st.flight = M.flight || {};
        if (ar === B.transport.arrivalAirport && dp === B.transport.departureAirport) return { ok: true, next: "approve2", reply: S.airports.ok };
        return { ok: false, reply: S.airports.other };
      }
      case "approve2": if (M.type === "approve" || approves(t)) return { ok: true, next: "activities", reply: S.approve2.ok }; return { ok: false, reply: S.approve2.fallback };
      case "activities":
        if (M.type === "defer" || has(t, ["بعد ما نوصل", "بعدين", "لاحقا", "نقرر", "مو الحين", "مب الحين", "لا", "خلنا", "later", "no", "مو ضروري", "بعد الوصول", "عند الوصول"])) return { ok: true, next: "voice", reply: S.activities.ok };
        if (has(t, ["اضف", "ضيف", "ابغى", "ابي", "نعم", "yes"])) return { ok: false, reply: S.activities.add };
        return { ok: false, reply: S.activities.fallback };
      case "voice":
      case "guest":
        if (M.type === "voice") { st.voice = { seconds: M.seconds || 0 }; st.voiceData = extraction(); return { ok: true, next: "guest", reply: S.voice.ok, after: function () { if (!fillPendingForm(st.voiceData)) noteUnread(addComponent(C.guestForm(st))); } }; }
        if (M.type === "guest") { st.guest = M.data; return { ok: true, next: "review", reply: S.guest.ok }; }
        return { ok: false, reply: S.voice.fallback };
      case "review":
        if (M.type === "guestEdit") {                                       /* saved from تعديل البيانات */
          var emailChanged = !st.guest || st.guest.email !== M.data.email;
          st.guest = M.data; if (emailChanged) { st.otp = null; st.verified = false; }
          st.termsAccepted = false; return { ok: true, next: "review", reply: S.review.updated };
        }
        if (M.type === "confirm" || approves(t)) {
          if (!st.termsAccepted) return { ok: false, reply: S.review.terms, after: termsError };   /* consent is never inferred from continuation */
          return { ok: true, next: "verify", reply: S.review.ok };
        }
        return { ok: false, reply: S.review.fallback };
      case "verify":
        if (M.type === "verify") { st.verified = true; return { ok: true, next: "payment", reply: S.verify.ok }; }   /* only after server.py confirmed the code */
        return { ok: false, reply: S.verify.fallback };
      case "payment":
        return { ok: false, reply: S.payment.fallback };                      /* the continuation comes from the payment timer, not from a typed message */
      default: return { ok: true, next: "done", reply: S.done.ok };
    }
  }
  /* Prepared mapping applied when the voice message is sent (see data/script.js). E-mail is never part of it. */
  function extraction() {
    var v = S.scenario.voice;
    return { title: v.title, familyName: v.familyName, mobileCode: v.mobileCode, mobile: v.mobile, guest2First: v.guest2First, guest2Family: v.guest2Family, requests: v.requests };
  }
  function matchResort(t) {
    var names = { "شباره": "Shebara", "شبارة": "Shebara", "shebara": "Shebara", "ديزرت روك": "Desert Rock", "desert rock": "Desert Rock", "نجوما": "Nujuma, a Ritz-Carlton Reserve", "nujuma": "Nujuma, a Ritz-Carlton Reserve", "سانت ريجيس": "The St. Regis Red Sea Resort", "st regis": "The St. Regis Red Sea Resort", "st. regis": "The St. Regis Red Sea Resort", "ميرافال": "Miraval The Red Sea", "miraval": "Miraval The Red Sea", "اديشن": "The Red Sea EDITION", "edition": "The Red Sea EDITION", "انتركونتيننتال": "InterContinental The Red Sea Resort", "intercontinental": "InterContinental The Red Sea Resort", "sls": "SLS The Red Sea", "سيكس سينسز": "Six Senses Southern Dunes, The Red Sea", "six senses southern": "Six Senses Southern Dunes, The Red Sea", "تيرتل باي": "Turtle Bay Hotel", "turtle bay": "Turtle Bay Hotel", "فور سيزونز": "Four Seasons Resort and Residences Red Sea at Shura Island", "four seasons": "Four Seasons Resort and Residences Red Sea at Shura Island", "ثول": "Thuwal Private Retreat", "thuwal": "Thuwal Private Retreat" };
    var hit = Object.keys(names).filter(function (k) { return t.indexOf(k) >= 0; }).sort(function (a, b) { return b.length - a.length; })[0];
    return hit ? ALL_RESORTS.filter(function (r) { return r.name === names[hit]; })[0] : null;
  }
  function matchVilla(t) {
    if (has(t, ["فوق الماء", "فوق الما", "overwater", "اوفر ووتر"])) return has(t, ["غرفتين", "two bedroom", "2 bedroom"]) ? "Two Bedroom Overwater Villa" : "One Bedroom Overwater Villa";
    var hit = V.filter(function (v) { return t.indexOf(v.name.toLowerCase()) >= 0; })[0];
    return hit ? hit.name : null;
  }
  function matchMode(t) {
    if (has(t, ["طائره خاصه", "طياره خاصه", "جت", "private jet", "خاصه"])) return "By Private Jet";
    if (has(t, ["طائره", "طياره", "طيران", "plane", "بالطائره", "بالطياره", "نطير"])) return "By Plane";
    if (has(t, ["سياره", "سيارتنا", "car", "بالسياره", "نسوق"])) return "By Car";
    if (has(t, ["يخت", "yacht", "قارب", "باليخت"])) return "By Yacht";
    return null;
  }

  /* Natural pacing: a typing indicator before each reply, typing time by
     message length with a little variation, and a pause between messages.
     A component with no text of its own belongs to the message before it
     and appears right after that message. All timers are cancellable. */
  var timers = [];
  function later(fn, ms) { var id = setTimeout(function () { timers = timers.filter(function (t) { return t !== id; }); fn(); }, ms); timers.push(id); return id; }
  function cancelTimers() { timers.forEach(clearTimeout); timers = []; hideTyping(); }
  function jitter(min, max) { return min + Math.random() * (max - min); }
  function typingTime(text) {
    var n = (text || "").replace(/\{\{\{?|\}\}\}?/g, "").length;
    if (n <= 70) return jitter(1500, 2500);
    if (n <= 170) return jitter(2500, 4500);
    return jitter(4500, 7000);
  }
  function deliver(items, done, opts) {
    var i = 0, first = true, quick = !!(opts && opts.quickFirst);
    setTypingStatus(true);
    function finish() { setTypingStatus(false); done(); }
    function nextItem() {
      if (i >= items.length) { finish(); return; }
      var it = items[i++]; if (typeof it === "string") it = { text: it };
      if (!it.text) {                                   /* component or quick replies attached to the previous message */
        if (it.component && C[it.component]) noteUnread(addComponent(C[it.component](state)));
        if (it.quick) noteUnread(addComponent(C.quick(state, it.quick)));
        nextItem(); return;
      }
      var gap = reduced ? 0 : (first ? (quick ? 150 : jitter(350, 700)) : jitter(900, 1800));
      var typing = reduced ? 0 : (first && quick ? 700 : typingTime(it.text));
      var isFirst = first; first = false;
      later(function () {
        showTyping();
        later(function () {
          hideTyping();
          var el = addMsg("agent", fill(it.text, state));
          var comp = it.component && C[it.component] ? addComponent(C[it.component](state)) : null;
          var qk = it.quick ? addComponent(C.quick(state, it.quick)) : null;
          if (isFirst) revealFirstReply(el); else noteUnread(el);
          if (comp) noteUnread(comp);
          if (qk) noteUnread(qk);
          nextItem();
        }, typing);
      }, gap);
    }
    nextItem();
  }

  function customer(text, meta) {
    if (busy) return; busy = true; sendBtn.disabled = true;
    if (meta && meta.type === "voice") addVoiceMsg(meta.url, meta.seconds); else addMsg("guest", fill(text, state));
    scrollToEnd();
    var res = stageSpec(text, meta);
    var replies = Array.isArray(res.reply) ? res.reply : [res.reply];
    if (res.ok && res.next) state.stage = res.next;
    deliver(replies, function () { busy = false; sendBtn.disabled = rec.state !== "idle"; if (res.after) res.after(); if (rec.state === "idle") composer.focus(); });
  }
  /* Component action: builds the customer line, marks the component as used, then runs the engine */
  function act(meta, customerText) {
    if (busy) return;
    var comps = scroll.querySelectorAll(".rich:not(.used)");
    var text = customerText;
    if (meta.type === "dates") { var n = daysBetween(meta.a, meta.b); text = S.customer.dates.replace("{in}", fmtDate(meta.a)).replace("{out}", fmtDate(meta.b)).replace("{nightsWord}", nightsWord(n)); }
    if (meta.type === "mode") text = S.customer.mode.replace("{modeWord}", S.words.modes[meta.mode] || meta.mode);
    if (meta.type === "airports") text = S.customer.airports.replace("{{{arrival}}}", "{{" + meta.arrival + "}}").replace("{{{departure}}}", "{{" + meta.departure + "}}");
    if (meta.type === "guest") text = meta.data.guest2First || meta.data.guest2Family ? S.customer.guest : S.customer.guestSolo;
    if (meta.type === "guestEdit") text = S.customer.guestEdit;
    if (meta.type === "verify") text = S.customer.verify;
    if (meta.type === "voice") text = S.words.voiceLabel;
    if (meta.type === "resort") text = S.customer.resort.replace("{{{resort}}}", "{{" + meta.name + "}}");
    /* mark the component the action came from as used, except selectors that may legitimately be reused after an "other" reply */
    var peek = stageSpec.length && (function () { var saved = JSON.parse(JSON.stringify(state)); var r = stageSpec(text, meta); Object.assign(state, saved); return r; })();
    if (peek && peek.ok && meta.type !== "voice") comps.forEach(consume);
    customer(text, meta);
  }

  /* ---------- payment continuation ----------
     The first click on Proceed to payment opens the official checkout
     (normal link) and starts one five-second timer in the conversation.
     When it elapses the prepared continuation is delivered. The timer is
     part of the scripted journey; it is not a payment-provider response. */
  var payTimer = null;
  function startPaymentTimer() {
    if (state.paid || state.paymentClickedAt || state.stage !== "payment") return;
    state.paymentClickedAt = Date.now();
    payTimer = later(paymentContinue, 5000);
  }
  function paymentContinue() {
    if (state.paid || state.stage !== "payment") return;
    if (busy) { payTimer = later(paymentContinue, 300); return; }
    if (payTimer) { clearTimeout(payTimer); timers = timers.filter(function (t) { return t !== payTimer; }); payTimer = null; }
    state.paid = true; state.stage = "done"; busy = true; sendBtn.disabled = true;
    scroll.querySelectorAll(".rich:not(.used)").forEach(consume);
    var waiting = scroll.querySelector(".payment .status-message"); if (waiting) waiting.outerHTML = '<div class="chosen-tag" style="justify-content:center;width:100%">' + Q.check + "تفاصيل رحلتك جاهزة</div>";
    deliver(S.payment.ok, function () { busy = false; sendBtn.disabled = false; if (!panel.hidden) composer.focus(); }, { quickFirst: true });
  }
  /* coming back from the checkout tab: complete an elapsed continuation once */
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && state.paymentClickedAt && !state.paid && Date.now() - state.paymentClickedAt >= 5000) paymentContinue();
  });

  /* ---------- composer ---------- */
  function sendFromComposer() {
    var v = composer.value.trim(); if (!v || busy || rec.state !== "idle") return;
    composer.value = ""; composer.style.height = ""; errEl.textContent = "";
    customer(v, null);
  }
  sendBtn.addEventListener("click", function () { if (rec.state === "done") voiceSend(); else sendFromComposer(); });
  composer.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendFromComposer(); } });
  composer.addEventListener("input", function () { composer.style.height = ""; composer.style.height = Math.min(composer.scrollHeight, 140) + "px"; });

  /* ---------- composer microphone, in place ----------
     The microphone beside Send swaps the text field for a recorder in the
     same slot: a live level waveform driven by an AnalyserNode on the real
     microphone stream, the elapsed time, Stop and Cancel. After Stop the
     slot shows a playback preview; Send sends the recording as one audio
     bubble, Cancel brings the text field back with its draft untouched. */
  var micBtn = document.getElementById("chat-mic"), box = document.getElementById("chat-rec"), wave = document.getElementById("chat-rec-wave"),
    preview = document.getElementById("chat-rec-preview"), playBtn = document.getElementById("chat-rec-play"), timeEl = document.getElementById("chat-rec-time"),
    stopB = document.getElementById("chat-rec-stop"), cancelB = document.getElementById("chat-rec-cancel"), errEl = document.getElementById("chat-rec-err");
  var rec = { state: "idle", recorder: null, stream: null, chunks: [], startedAt: 0, tick: 0, blob: null, url: null, seconds: 0, ctx: null, analyser: null, source: null, raf: 0, levels: [], stopPlayer: null };
  var canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  var BARS = 48;
  function releaseMic() {
    if (rec.stream) { rec.stream.getTracks().forEach(function (t) { t.stop(); }); rec.stream = null; }
    cancelAnimationFrame(rec.raf); rec.raf = 0;
    if (rec.source) { try { rec.source.disconnect(); } catch (e) {} rec.source = null; }
    rec.analyser = null;
    if (rec.ctx) { try { rec.ctx.close(); } catch (e) {} rec.ctx = null; }
  }
  function drawWave() {
    var cv = wave, g = cv.getContext("2d"), w = cv.clientWidth || 300, hgt = cv.height;
    if (cv.width !== Math.round(w * 2)) { cv.width = Math.round(w * 2); }     /* crisp on high-dpi, keeps the 40 px height */
    g.clearRect(0, 0, cv.width, cv.height);
    var n = rec.levels.length, gap = cv.width / BARS, bw = Math.max(2, gap * 0.55), mid = cv.height / 2;
    for (var i = 0; i < n; i++) {
      var lv = rec.levels[i], bh = Math.max(3, lv * (cv.height - 6));
      g.fillStyle = i === n - 1 ? "#37706c" : "rgba(55,112,108," + (0.35 + 0.65 * (i / BARS)) + ")";
      var x = cv.width - (n - i) * gap;
      g.beginPath(); g.roundRect(x, mid - bh / 2, bw, bh, bw / 2); g.fill();
    }
  }
  function meter() {
    if (!rec.analyser) return;
    var buf = new Uint8Array(rec.analyser.fftSize); rec.analyser.getByteTimeDomainData(buf);
    var sum = 0; for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
    var rms = Math.sqrt(sum / buf.length);                                   /* 0 in silence, ~0.3 for normal speech */
    var level = Math.min(1, Math.pow(rms * 3.2, 0.8));
    var prev = rec.levels.length ? rec.levels[rec.levels.length - 1] : 0;
    rec.levels.push(prev + (level - prev) * 0.6);                              /* light smoothing, still follows the voice */
    if (rec.levels.length > BARS) rec.levels.shift();
    drawWave();
    rec.raf = requestAnimationFrame(meter);
  }
  function voiceUi(st) {
    rec.state = st;
    composer.hidden = st !== "idle"; box.hidden = st === "idle";
    box.classList.toggle("recording", st === "rec"); box.classList.toggle("ready", st === "done");
    preview.hidden = st !== "done"; stopB.hidden = st !== "rec"; cancelB.hidden = st === "idle";
    wave.style.display = st === "rec" ? "" : "none";
    micBtn.setAttribute("aria-pressed", st === "rec" ? "true" : "false"); micBtn.classList.toggle("on", st === "rec"); micBtn.classList.toggle("ready", st === "done");
    micBtn.setAttribute("aria-label", st === "rec" ? "إيقاف التسجيل" : st === "done" ? "تسجيل رسالة جديدة" : "تسجيل رسالة صوتية");
    sendBtn.disabled = busy || (st !== "idle" && st !== "done");
    sendBtn.setAttribute("aria-label", st === "done" ? "إرسال الرسالة الصوتية" : "إرسال");
  }
  function voiceCancel() {
    if (rec.recorder && rec.recorder.state !== "inactive") { rec.recorder.onstop = null; try { rec.recorder.stop(); } catch (e) {} }
    releaseMic(); clearInterval(rec.tick);
    if (rec.stopPlayer) { rec.stopPlayer(); rec.stopPlayer = null; }
    if (rec.url) URL.revokeObjectURL(rec.url);
    rec.recorder = null; rec.chunks = []; rec.blob = null; rec.url = null; rec.seconds = 0; rec.levels = [];
    timeEl.textContent = "0:00"; errEl.textContent = ""; preview.querySelector(".pbar i").style.width = "0%";
    voiceUi("idle");                                                        /* the text field returns with its draft */
  }
  function voiceError(msg) { voiceCancel(); errEl.textContent = msg; }     /* text entry stays usable; the microphone button is the retry */
  function voiceStart() {
    if (busy || rec.state === "rec") return;
    if (rec.state === "done") voiceCancel();
    errEl.textContent = "";
    if (!canRecord) { voiceError("التسجيل الصوتي غير متاح في هذا المتصفح. تقدر تكمل بالكتابة."); return; }
    micBtn.disabled = true;                                                 /* nothing shows as recording until permission is granted */
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      micBtn.disabled = false;
      if (rec.state !== "idle" || busy) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
      rec.stream = stream; rec.chunks = []; rec.levels = [];
      var mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].filter(function (m) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m); })[0];
      try { rec.recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); }
      catch (e) { voiceError("تعذر بدء التسجيل. حاول مرة أخرى أو أكمل بالكتابة."); return; }
      try {
        rec.ctx = new (window.AudioContext || window.webkitAudioContext)();
        rec.source = rec.ctx.createMediaStreamSource(stream);
        rec.analyser = rec.ctx.createAnalyser(); rec.analyser.fftSize = 1024; rec.analyser.smoothingTimeConstant = 0.4;
        rec.source.connect(rec.analyser);                                     /* analyser only; nothing is routed to the speakers */
        if (rec.ctx.state === "suspended") rec.ctx.resume();
      } catch (e) { rec.analyser = null; }
      rec.recorder.ondataavailable = function (e) { if (e.data && e.data.size) rec.chunks.push(e.data); };
      rec.recorder.onstop = function () {
        releaseMic(); clearInterval(rec.tick);
        rec.seconds = (Date.now() - rec.startedAt) / 1000;
        rec.blob = rec.chunks.length ? new Blob(rec.chunks, { type: rec.recorder.mimeType || "audio/webm" }) : null;
        if (!rec.blob || rec.blob.size < 1024 || rec.seconds < 1) { voiceError("ما وصلنا صوت في التسجيل. راجع الميكروفون وحاول مرة أخرى، أو أكمل بالكتابة."); return; }
        rec.url = URL.createObjectURL(rec.blob);
        timeEl.textContent = fmtSecs(rec.seconds);
        rec.stopPlayer = wirePlayer(rec.url, rec.seconds, playBtn, preview.querySelector(".pbar i"), timeEl);
        voiceUi("done");
      };
      rec.startedAt = Date.now(); rec.recorder.start(250); voiceUi("rec"); timeEl.textContent = "0:00";
      rec.tick = setInterval(function () { var sec = (Date.now() - rec.startedAt) / 1000; timeEl.textContent = fmtSecs(sec); if (sec >= 120) voiceStop(); }, 250);
      meter();
    }).catch(function (e) {
      micBtn.disabled = false;
      voiceError(e && (e.name === "NotAllowedError" || e.name === "SecurityError") ? "لم يُسمح باستخدام الميكروفون. اسمح به من إعدادات المتصفح أو أكمل بالكتابة." : "تعذر استخدام الميكروفون. حاول مرة أخرى أو أكمل بالكتابة.");
    });
  }
  function voiceStop() { if (rec.recorder && rec.recorder.state !== "inactive") rec.recorder.stop(); }
  function voiceSend() {
    if (busy || rec.state !== "done" || !rec.blob) return;
    var url = rec.url, seconds = rec.seconds; rec.url = null;              /* the bubble owns the URL from here on */
    if (rec.stopPlayer) { rec.stopPlayer(); rec.stopPlayer = null; }
    rec.blob = null; rec.chunks = []; rec.seconds = 0; rec.levels = []; timeEl.textContent = "0:00"; preview.querySelector(".pbar i").style.width = "0%";
    voiceUi("idle");
    if (state.stage === "voice") act({ type: "voice", url: url, seconds: seconds }, null);
    else customer(S.words.voiceLabel, { type: "voiceOther", url: url, seconds: seconds });
  }
  micBtn.addEventListener("click", function () { if (rec.state === "rec") voiceStop(); else voiceStart(); });
  composer.addEventListener("input", function () { errEl.textContent = ""; });
  stopB.addEventListener("click", voiceStop);
  cancelB.addEventListener("click", voiceCancel);
  window.addEventListener("resize", function () { if (rec.state === "rec") drawWave(); });

  /* ---------- page resort cards (backdrop only) ---------- */
  if (rail) {
    R[0].items.forEach(function (r) {
      var tags = r.name === "Shebara" ? ["Overwater", "Beachfront"] : [r.place.split(",")[0]];
      rail.appendChild(h("article", { "class": "rcard", html:
        '<img src="' + esc(r.image) + '" alt="' + esc(r.name) + '" loading="lazy"><div class="body"><div class="dest">The Red Sea</div><h3>' + esc(r.name) + '</h3><div class="tags">' +
        tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div><div class="acts"><a class="explore" href="#">Explore</a></div></div>' }));
    });
  }

  /* ---------- widget shell ---------- */
  function open() {
    panel.hidden = false; document.body.classList.add("chat-open"); launcher.setAttribute("aria-expanded", "true");
    scroll.scrollTop = savedScroll; composer.focus();
  }
  function close() {
    if (rec.state === "rec") voiceStop();                                 /* release the microphone; a finished recording stays for review */
    savedScroll = scroll.scrollTop; panel.hidden = true; document.body.classList.remove("chat-open"); launcher.setAttribute("aria-expanded", "false"); launcher.focus();
  }
  launcher.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!menu.hidden) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); } else if (!panel.hidden) close(); } });
  menuBtn.addEventListener("click", function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; menuBtn.setAttribute("aria-expanded", String(!menu.hidden)); });
  document.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target)) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); } });
  document.getElementById("chat-new").addEventListener("click", function () { menu.hidden = true; start(); });

  function start() {
    cancelTimers(); payTimer = null; state = freshState(); busy = false; scroll.innerHTML = ""; savedScroll = 0; clearUnread(); setTypingStatus(false); voiceCancel(); composer.value = ""; sendBtn.disabled = false;
    addMsg("agent", fill(S.greeting, state));
  }
  start();
  var qs = new URLSearchParams(location.search);
  if (qs.get("open") === "1") open();

  /* ---------- Walkthrough (index.html?walkthrough=1) ----------
     Plays the complete supported route with no pauses and lays the
     conversation out as a document, with action notes, so it can be
     printed to RSG_Full_Conversation.pdf. It uses the live engine and
     components, so wording and order are exactly what the page does. */
  if (qs.get("walkthrough") === "1") (function walkthrough() {
    reduced = true;
    var link = document.createElement("link"); link.rel = "stylesheet"; link.href = "css/walkthrough.css"; document.head.appendChild(link);
    document.body.classList.add("walkthrough");
    var docHead = h("div", { "class": "wt-doc-head", html: '<h1>رفيق رحلتك: المحادثة الكاملة (الإصدار الثاني، التصميم الفوتوغرافي)</h1><p>' + esc(B.resort.name) + " · " + esc(B.villa.name) + " · " + esc(B.rate.name) + " · " + esc(B.rate.basisAr) + '</p><div class="legend"><span class="a">المساعد (يسار)</span><span class="c">ما تكتبه أنت (يمين)</span><span class="n">إجراء على بطاقة أو على الصفحة</span></div>' });
    panel.parentNode.insertBefore(docHead, panel);
    open();
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function idle() { return new Promise(function (r) { (function tick() { if (!busy) r(); else setTimeout(tick, 30); })(); }); }
    function note(html) { scroll.appendChild(h("div", { "class": "wt-note", html: html })); }
    function step(label) { scroll.appendChild(h("div", { "class": "wt-step", text: label })); }
    function send(t) { composer.value = t; sendFromComposer(); return idle(); }
    function last(sel) { var all = scroll.querySelectorAll(sel); return all[all.length - 1]; }
    var W = S.scenario, VD = W.voice;
    (async function () {
      function chip(id) { var b = Array.prototype.slice.call(scroll.querySelectorAll('.rich.quick:not(.used) .qr[data-id="' + id + '"]')).pop(); b.click(); return idle(); }
      step("1 · الترحيب واسمك الأول");
      note("افتح المحادثة من الزر أسفل يمين الصفحة. يرحّب بك المساعد ويسألك كيف يناديك.");
      await send("أنا " + W.name); await sleep(50);
      step("2 · السؤال عن المنتجعات");
      await send("أبي إجازة هادئة أنا وزوجتي"); await sleep(50);
      note("<b>إجراء على البطاقة.</b> يعرض المساعد ثلاثة اقتراحات مدمجة داخل المحادثة (صورة واسم وزر اختيار) ورابط <b>استكشف المزيد</b> يفتح قائمة المنتجعات الرسمية في تبويب جديد دون أن تفقد المحادثة. الصفحة نفسها لا تتحرك ولا تُعتَّم. اضغط <b>اختيار</b> بجانب <b>Shebara</b>.");
      step("3 · تفاصيل Shebara والفلل");
      last('.resort-row[data-name="Shebara"] .choose').click(); await idle(); await sleep(50);
      note("<b>إجراء على البطاقة.</b> اضغط <b>اختيار</b> بجانب <b>فيلا فوق الماء بغرفة نوم واحدة</b>؛ السعر الكامل للإقامة (ليلتان) معروض تحتها، وبقية الفلل تظهر من «عرض بقية الفلل». الضغط على صورة أي فيلا يفتح صفحة Shebara الرسمية في تبويب جديد دون اختيار الفيلا.");
      last('.villa-row[data-villa="One Bedroom Overwater Villa"] .mini-select').click(); await idle(); await sleep(50);
      step("4 · عدد الضيوف");
      note("<b>رد سريع.</b> اضغط <b>نعم، أنا وزوجتي</b>. تظهر رسالتك على اليمين كما لو كتبتها.");
      await chip("party_yes"); await sleep(50);
      note("<b>إجراء على التقويم.</b> اضغط <b>23</b> (الوصول) ثم <b>25</b> أكتوبر (المغادرة)، ثم <b>تأكيد التواريخ</b>. لا يُسأل عن عدد الليالي؛ يُحسب تلقائيًا.");
      step("5 · التواريخ وملخص الإقامة");
      last('.days button[data-d="2026-10-23"]').click(); last('.days button[data-d="2026-10-25"]').click(); last(".calconfirm").click(); await idle(); await sleep(50);
      note("<b>رد سريع.</b> <b>مناسب، نكمل</b> يعتمد ملخص الإقامة. <b>أراجع التفاصيل</b> يعيدك إلى الملخص دون إرسال أي رسالة.");
      step("6 · اعتماد ملخص الإقامة");
      await chip("approve1_ok"); await sleep(50);
      note("<b>إجراء على البطاقة.</b> اختر <b>بالطائرة</b>.");
      step("7 · طريقة الوصول والمطارات");
      last('.mode[data-mode="By Plane"]').click(); await idle(); await sleep(50);
      note("<b>إجراء على النموذج.</b> مطار الوصول: <b>مطار ينبع</b>. مطار المغادرة: <b>مطار البحر الأحمر الدولي – RSIA</b>. تفاصيل الرحلات اختيارية وتبقى فارغة. اضغط <b>اعتماد المطارات</b>.");
      var tf = last(".airport-form form"); tf.elements.arrival.value = B.transport.arrivalAirport; tf.elements.departure.value = B.transport.departureAirport; tf.querySelector("button[type=submit]").click(); await idle(); await sleep(50);
      note("<b>رد سريع.</b> <b>اعتمد ونكمل</b> يعتمد التنقلات والإجمالي المحدّث.");
      step("8 · اعتماد التنقلات والإجمالي");
      await chip("approve2_ok"); await sleep(50);
      note("<b>رد سريع.</b> <b>نختار عند الوصول</b> يؤجل التجارب؛ لا تُضاف تجربة ولا يتغير الإجمالي.");
      step("9 · التجارب");
      await chip("activities_defer"); await sleep(50);
      note("<b>الخيار لك.</b> يظهر نموذج بيانات الضيفين مع الطلب، واسمك الأول فيه مسبقًا. يمكنك تعبئته مباشرة، أو إرسال بياناتك برسالة صوتية: اضغط زر <b>الميكروفون</b> المجاور لزر الإرسال واسمح باستخدام الميكروفون. يتحول حقل الكتابة إلى مسجّل بموجة حيّة ووقت منقضٍ وزري إيقاف وإلغاء؛ بعد الإيقاف تستمع للمعاينة ثم تضغط <b>إرسال</b>. تظهر رسالتك على اليمين كفقاعة صوتية، ثم تُعبّأ حقول النموذج نفسه.");
      step("10 · رسالة صوتية ببياناتك");
      note("<b>ما يقوله التسجيل</b> (المحتوى المُعدّ لهذه الرحلة؛ البريد الإلكتروني لا يُذكر عمدًا): <bdi dir=\"rtl\" lang=\"ar\">" + esc(VD.transcript) + "</bdi>");
      act({ type: "voice", url: null, seconds: 0, size: 0 }, null); await idle(); await sleep(50);
      note("<b>إجراء على النموذج.</b> الحقول التي تحمل أيقونة الشرارة عُبّئت من الرسالة الصوتية، ويحمل اسمك الأول أيقونة المحادثة؛ تعديل أي حقل يزيل أيقونته. حقل <b>البريد الإلكتروني</b> متروك فارغًا عمدًا: اكتب <b>" + esc(W.emailTyped) + "</b> بنفسك، ثم اضغط <b>اعتماد البيانات</b>. مربع الأخبار والعروض يبقى غير محدد ما لم تحدده أنت.");
      step("11 · مراجعة البيانات المستخرجة وإضافة البريد الإلكتروني");
      var gf = last("form.guest-form"); gf.elements.email.value = W.emailTyped; gf.querySelector("button[type=submit]").click(); await idle(); await sleep(50);
      step("12 · المراجعة النهائية، التعديل، والموافقة على الشروط");
      note("<b>إجراء على البطاقة.</b> <b>تعديل البيانات</b> يفتح نموذج البيانات معبّأً بما اعتمدته، لتصحيح بياناتك أو بيانات زوجتك أو التواصل أو الطلب الإضافي؛ <b>حفظ التعديلات</b> يحدّث المراجعة وكل ما يليها، و<b>إلغاء</b> يغلق النموذج دون تغيير. تغيير البريد الإلكتروني يلغي أي تحقق سابق. هنا نحفظ دون تغيير.");
      last(".review .editbtn").click();
      for (var k = 0; k < 40 && !scroll.querySelector(".rich:not(.used) form.guest-form"); k++) await sleep(50);
      var ef = scroll.querySelector(".rich:not(.used) form.guest-form"); if (ef) { ef.querySelector("button[type=submit]").click(); await idle(); } await sleep(50);
      note("<b>الموافقة والرد السريع.</b> حدّد مربع <b>قرأت ووافقت على الشروط والأحكام وسياسة الخصوصية</b> في المراجعة، ثم اضغط <b>البيانات صحيحة، نكمل</b>. بدون تحديد المربع يطلب المساعد الموافقة أولًا ولا يكمل.");
      var tbox = last(".review [name=terms]"); tbox.checked = true; tbox.dispatchEvent(new Event("change", { bubbles: true }));
      await chip("review_confirm"); await sleep(50);
      note("<b>إجراء على البطاقة.</b> اضغط <b>إرسال الرمز</b>. يرسل الخادم رمزًا من 6 أرقام بالبريد الإلكتروني إلى العنوان الذي كتبته؛ لا يُعرض الرمز على الشاشة أبدًا. افتح بريدك، وأدخل الأرقام الستة في الخانات، ثم اضغط <b>تحقق</b>. يبقى الرمز صالحًا 5 دقائق، و<b>إعادة الإرسال</b> يصدر رمزًا بديلًا بعد فترة الانتظار.");
      act({ type: "verify" }, null); await idle(); await sleep(50);
      note("<b>إجراء على البطاقة.</b> زر <b>المتابعة للدفع</b> يفتح صفحة الدفع الرسمية في تبويب جديد، وتظهر حالة انتظار هادئة «لحظات ونكمل معك». بعد نحو خمس ثوانٍ يكمل المساعد هنا من تلقاء نفسه؛ لا تحتاج أن تكتب شيئًا، ولا يُعرض هذا الانتظار كتحقق من عملية الدفع.");
      step("13 · الاستكمال التلقائي بعد الضغط على الدفع");
      paymentContinue(); await idle(); await sleep(50);
      note("<b>إجراء على البطاقة.</b> زر <b>تحميل PDF</b> يحفظ الملف <b>" + esc(B.resort.name + "_Booking_Summary_" + state.checkIn + ".pdf") + "</b>، وهو ملف تفاصيل الرحلة بهوية Red Sea Global مبنيٌّ من آخر بيانات محفوظة.");
      scroll.querySelectorAll(".msg .meta .time").forEach(function (t) { t.remove(); });
      document.body.classList.add("walkthrough-ready");
      /* Explicit visual-review variant of the existing recorded walkthrough.
         It uses the real chat shell and components, without service calls.
         Normal sessions do not enter this branch or bypass verification. */
      if (qs.get("context") === "1") {
        docHead.remove();
        scroll.querySelectorAll(".wt-note,.wt-step").forEach(function (el) { el.remove(); });
        document.body.classList.remove("walkthrough");
        document.body.classList.add("recorded-chat-review");
        clearUnread(); savedScroll = 0; scroll.scrollTop = 0;
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    })();
  })();
})();

