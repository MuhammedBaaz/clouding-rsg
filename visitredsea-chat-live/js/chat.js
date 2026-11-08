/* ============================================================
   Live concierge (visitredsea-chat-live).
   The customer types or acts on a component. A typed message goes
   to server.py (/api/chat/turn), which runs the live Claude agent:
   the agent reads the message, calls one of the application tools
   and the backend returns the approved reply items from
   data/script.js, the updated booking state and, for a page
   hand-off, a browser action (scroll to the resort cards and run
   the spotlight) that this file performs and acknowledges
   (/api/chat/action-result). Card buttons and forms are events the
   backend handles deterministically, without a model call. The
   components are built here from data/booking.js, data/resorts.js
   and data/villas.js and the state the server returned.

   E-mail verification stays on server.py (/api/otp/*, /api/profile).
   The page must be served by server.py over http.
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
      .replace(/\{(\w+)\}/g, function (_, k) { if (!(k in vars)) return _; var v = esc(vars[k]); return /[A-Za-z0-9]/.test(vars[k]) ? "<bdi>" + v + "</bdi>" : v; });   /* an Arabic value stays in the Arabic run so an attached prefix joins it (ول + نورة = ولنورة); only Latin or digits are isolated */
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

  /* ---------- conversation state ----------
     The server owns the booking state and returns a snapshot with every turn. The browser keeps only what the
     server never sees: the OTP challenge, the terms checkbox, the payment click time. The chosen resort object
     and the Arabic date labels are derived here from the snapshot. */
  var state;
  var CLIENT_ONLY = ["otp", "voiceData", "paymentClickedAt", "termsAccepted"];
  function freshState() {
    return { stage: "name", name: "", resortName: "", resort: null, villaName: "", rateName: "", adults: 2, children: 0,
      checkIn: "", checkOut: "", checkInLabel: "", checkOutLabel: "", nights: 0, mode: "", arrivalAirport: "", departureAirport: "", flight: {}, voice: null, voiceData: null, formSeed: null, guest: null, otp: null, verifiedEmail: "", authMode: "", loginEmail: "", profile: null, termsAccepted: false, paymentClickedAt: 0, paid: false, paymentStatus: "none" };
  }
  function applySnapshot(snap) {
    if (!snap || typeof snap !== "object") return;
    var next = Object.assign(freshState(), snap);
    CLIENT_ONLY.forEach(function (k) { next[k] = state[k]; });
    next.resort = next.resortName ? ALL_RESORTS.filter(function (r) { return r.name === next.resortName; })[0] || null : null;
    next.checkInLabel = next.checkIn ? fmtDate(next.checkIn) : "";
    next.checkOutLabel = next.checkOut ? fmtDate(next.checkOut) : "";
    state = next;
  }
  var sid = null, turnSeq = 0;
  function newTurnId() { turnSeq++; return (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(16).slice(2)); }
  function chatApi(path, body) {
    return fetch(path, { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json().then(function (b) { return { ok: r.ok, status: r.status, body: b || {} }; }, function () { return { ok: false, status: r.status, body: { error: "bad_response" } }; }); },
            function () { return { ok: false, status: 0, body: { error: "unreachable" } }; });
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
  function consume(comp) { comp.classList.add("used"); comp.querySelectorAll("button, input, select, textarea").forEach(function (c) { if (!c.classList.contains("rc-carousel-arrow") && !c.hasAttribute("data-keep")) c.disabled = true; }); }

  /* ---------- Empathy Studio rich components ----------
     Cards, pickers and reply buttons are rendered by the Empathy Studio
     web-SDK renderers (studio/studio-renderers.js, with the SDK's own CSS in
     studio/studio-components.css and the RTL mirroring in studio/studio-rtl.css).
     Payloads are built here from the booking data and the conversation state
     and checked against the registered Studio schemas (studio/schemas.js); a
     mismatch is logged for the team, never shown to the customer. A Studio
     button sends its payload as the customer message; the handlers below map
     that message to the engine's act(). Elements that have no slot in a
     Studio component (external links, consent, PDF status) sit in a small RSG
     aside under the component. */
  var studioIcons = new EmpathyStudio.IconResolver({ baseUrl: "studio/icons" }), studioRegistry = EmpathyStudio.createRegistry(studioIcons);
  function ICON(n) { return "studio/icons/" + n + ".svg"; }
  function iso(s) { return "\u2066" + s + "\u2069"; }   /* LTR isolate: the Confirmation Card sets row text with textContent inside the RTL host */
  /* Mixed-direction text inside Arabic content. English runs (names, products, airports, amounts with their
     currency, e-mail, URLs) become Unicode isolates; a leading RLM keeps an RTL base on the SDK nodes that use
     dir="auto", so a line that opens with an English name or a number still reads right to left. */
  var LATIN_RUN = /[A-Za-z][A-Za-z0-9@_&.,'’+\-–→\/ ]*[A-Za-z0-9]|[A-Za-z]/g;
  function isoLatin(s) { return String(s == null ? "" : s).replace(LATIN_RUN, function (m) { return iso(m); }); }
  function rtl(s) { s = String(s == null ? "" : s); if (!/[\u0600-\u06FF]/.test(s)) return s; s = isoLatin(s); var lead = s.match(/^(\s*[-*] )?(\*\*)?/)[0]; return lead + "\u200F" + s.slice(lead.length); }   /* the RLM goes after a leading list marker (and inside a leading bold label, which the SDK lays out as a block), so the Markdown still parses */
  /* a route: one LTR phrase when both ends are English, otherwise the Arabic arrow pointing to the destination */
  function routeText(a, b) { var n = B.transport.airportsAr || {}; a = n[a] || a; b = n[b] || b; var latin = function (x) { return !/[\u0600-\u06FF]/.test(x); }; return latin(a) && latin(b) ? iso(a + " → " + b) : a + " ← " + b; }
  /* text fields of a Studio payload that carry Arabic sentences, with their schema length limits (0 = none) */
  var BIDI_FIELDS = { description: 0, subtitle: 30, instructions: 150, primary_card_subtitle: 150, secondary_card_subtitle: 150, tertiary_card_subtitle: 150 };
  function bidiPayload(o, type) {
    if (Array.isArray(o)) { o.forEach(function (x) { bidiPayload(x, type); }); return; }
    if (!o || typeof o !== "object") return;
    Object.keys(o).forEach(function (k) {
      var v = o[k];
      if (typeof v === "string" && Object.prototype.hasOwnProperty.call(BIDI_FIELDS, k)) {
        var r = rtl(v), max = type === "confirmation_card" && k === "subtitle" ? 0 : BIDI_FIELDS[k];
        if (!max || Array.from(r).length <= max) o[k] = r;                  /* never exceed a schema limit: an over-long field keeps its plain text */
      } else if (v && typeof v === "object") bidiPayload(v, type);
    });
  }
  function clip(s, n) { s = String(s == null ? "" : s); var a = Array.from(s); return a.length <= n ? s : a.slice(0, n - 1).join("") + "…"; }
  function bullets(list) { return (list || []).map(function (x) { return "- " + x; }).join("\n"); }
  function sCard(o) { return Object.assign({ image_url: "", badge_title: "", badge_position: "top-left", main_title: "", subtitle: "", description: "", primary_button_label: "", primary_button_payload: "", secondary_button_label: "", secondary_button_payload: "", tertiary_button_label: "", tertiary_button_payload: "", lock_after_selection: true }, o); }
  function sConf(o) { return Object.assign({ image_url: "", badge_text: "", main_title: "", subtitle: "", primary_card_title: "", primary_card_subtitle: "", primary_card_icon: "", secondary_card_title: "", secondary_card_subtitle: "", secondary_card_icon: "", tertiary_card_title: "", tertiary_card_subtitle: "", tertiary_card_icon: "", instructions: "", primary_button_label: "", primary_button_payload: "", primary_button_icon: "", secondary_button_label: "", secondary_button_payload: "", secondary_button_icon: "" }, o); }
  function sItem(o) { return Object.assign({ title: "", subtitle: "", icon: "", badge: "", payload: "" }, o); }
  /* One Studio component in a .rich row. onSelect(value, index, cardIndex) runs while the row is live (or always, with keep) and never during a reply */
  function studio(kind, type, payload, onSelect, keep) {
    bidiPayload(payload, type);
    var errs = EmpathyStudio.validate(type, payload);
    if (errs.length) console.warn("Empathy Studio payload check (" + kind + "):", errs);
    var c = h("div", { "class": "rich studio", "data-component": kind }), host = h("div", { "class": "rc-container", dir: "rtl" });
    var rendered = EmpathyStudio.renderRichMessage([{ type: type, payload: payload }], studioRegistry, function (value, index, cardIndex) {
      if ((c.classList.contains("used") && !keep) || busy || !onSelect) return;
      onSelect(value, index, cardIndex);
    });
    host.appendChild(rendered.firstChild); c.appendChild(host);
    return c;
  }
  function aside(c, html, cls) { var a = h("div", { "class": "studio-aside" + (cls ? " " + cls : ""), lang: "ar", dir: "rtl", html: html || "" }); c.appendChild(a); return a; }
  function stayLine(st) { return st.checkInLabel + " – " + st.checkOutLabel + " · " + nightsWord(st.nights); }
  function villaTitle() { return B.villa.nameAr || B.villa.name; }
  function transfersLine() { var l = B.transport.legs; return "الوصول: " + (l[0].productAr || l[0].product) + "\nالمغادرة: " + (l[1].productAr || l[1].product); }
  function airportsLine(st) { return routeText(st.arrivalAirport, st.departureAirport); }
  function guestsLine(st, joiner) { var g = st.guest, second = (g.guest2First + " " + g.guest2Family).trim(); return g.title + " " + g.firstName + " " + g.familyName + (second ? joiner + second : ""); }
  /* a special request that does not fit the card's 150-character instructions line is shown in full right under the card */
  function requestNote(c, st) {
    var req = st.guest && st.guest.requests; if (!req) return;
    var ins = c.querySelector(".bc-instructions"), shown = ins ? ins.textContent.replace(/[\u200e\u200f\u2066-\u2069]/g, "") : "";
    if (shown.indexOf(req) >= 0) return;
    aside(c, "<p><strong>طلب إضافي:</strong> " + esc(req) + " · حسب التوفر</p>", "request-note");
  }
  /* the instructions row is limited to 150 characters: the request line is included only when it fits */
  function withRequest(base, st) { var r = st.guest && st.guest.requests ? base + " · " + st.guest.requests + " (حسب التوفر)" : base; return Array.from(rtl(r)).length <= 150 ? r : base; }

  /* ---------- rich components (Arabic, RTL; independent left-side agent placement) ---------- */
  var C = {};
  /* Shared line icons; visual surfaces and typography are in atelier.css. */
  var Q = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>',
    loader: '<svg class="spinner" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>',
    circleCheck: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5Z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  };
  function comp(kind, inner, cls) { return h("div", { "class": "rich" }, [h("div", { "class": "component " + (cls || ""), "data-component": kind, html: inner })]); }
  function externalLink(url, text, cls) { return '<a class="' + (cls || "text-action") + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + text + " " + Q.ext + "</a>"; }
  function adultsWord(n) { return n === 1 ? "شخص بالغ واحد" : n === 2 ? "2 بالغين" : n + " بالغين"; }
  var AR_MONTH = new Intl.DateTimeFormat("ar-EG-u-ca-gregory-nu-latn", { month: "long", year: "numeric", timeZone: "UTC" });
  function compactDateRange(a, b) {
    var pa = a.split("-"), pb = b && b.split("-");
    var month = AR_MONTH.format(new Date(Date.UTC(+pa[0], +pa[1] - 1, 1)));
    if (pb && pa[0] === pb[0] && pa[1] === pb[1]) return '<bdi>' + (+pa[2]) + '–' + (+pb[2]) + '</bdi> ' + esc(month);
    return '<bdi>' + (+pa[2]) + '</bdi> ' + esc(month) + (b ? ' – ' + compactDateRange(b) : '');
  }
  var SUGGESTED = ["Shebara", "Desert Rock", "Six Senses Southern Dunes, The Red Sea"];
  var GROUP_AR = { "The Red Sea": "البحر الأحمر", "AMAALA": "أمالا", "Private island": "Red Sea Global" };
  var VILLA_URL = B.resort.detailsUrl;      /* no dedicated villa pages are evidenced; the official Shebara page lists the villas */

  /* resort cards: the setting as the badge, the destination as the subtitle, a one-line description and
     grouped highlights from the sourced profiles in data/resorts.js (a resort without a profile keeps its facts) */
  function resortCard(r, extra) {
    var facts = ["**الموقع:** " + (r.locationAr || r.placeAr || r.place), "**الإقامة:** " + (r.stayAr || r.factsAr || r.facts) + (r.status === "Enquiry only" ? " · بالطلب فقط" : "")];
    if (r.highlightsAr && r.highlightsAr.length) facts.push("**أبرز المرافق:** " + r.highlightsAr.join("، "));
    return sCard(Object.assign({ image_url: r.image, badge_title: clip(r.settingAr || GROUP_AR[r.group] || r.group, 15), main_title: clip(r.name, 60), subtitle: clip(GROUP_AR[r.group] || r.group, 30), description: (r.aboutAr ? r.aboutAr + "\n\n" : "") + bullets(facts) }, extra || {}));
  }
  function hostOf(u) { return String(u).replace(/^https?:\/\/(www\.)?/, "").split("/")[0]; }
  /* Resort photographs open that resort's own official page in a new tab. The Studio card has no link slot, so the
     link is an RSG layer over the rendered photo: it is separate from اختيار and never selects or advances anything. */
  /* the same link on a Confirmation Card header that shows a resort photograph (stay summaries, final confirmation) */
  function linkHeaderImage(c, r) {
    var hd = c.querySelector(".bc-header"); if (!hd || !r || !r.url) return;
    var label = "صفحة " + r.name + " الرسمية على " + hostOf(r.url) + "، تفتح في تبويب جديد";
    hd.appendChild(h("a", { "class": "cc-media-link", href: r.url, target: "_blank", rel: "noopener noreferrer", "aria-label": label, title: label, html: '<span class="cc-media-ext" aria-hidden="true">' + Q.ext + "</span>" }));
  }
  function linkResortImages(c, list) {
    c.querySelectorAll(".cc-card").forEach(function (card, i) {
      var r = list[i], media = card.querySelector(".cc-media"); if (!r || !r.url || !media) return;
      var label = "صفحة " + r.name + " الرسمية على " + hostOf(r.url) + "، تفتح في تبويب جديد";
      media.appendChild(h("a", { "class": "cc-media-link", href: r.url, target: "_blank", rel: "noopener noreferrer", "aria-label": label, title: label, html: '<span class="cc-media-ext" aria-hidden="true">' + Q.ext + "</span>" }));
    });
  }

  /* 1 resort suggestions: a Studio carousel of three cards; استكشف المزيد stays an RSG link beside it */
  C.resortPick = function () {
    var picks = SUGGESTED.map(function (n) { return ALL_RESORTS.filter(function (x) { return x.name === n; })[0]; }).filter(Boolean);
    var c = studio("resorts", "carousel", { cards: picks.map(function (r) {
      return resortCard(r, { primary_button_label: "اختيار", primary_button_payload: S.customer.resort.replace("{{{resort}}}", r.name) });
    }) }, function (value, index, cardIndex) { var r = picks[cardIndex]; if (r) act({ type: "resort", name: r.name }, null); });
    linkResortImages(c, picks);
    aside(c, externalLink("https://www.visitredsea.com/en/resorts", "استكشف المزيد", "link"));
    return c;
  };

  /* 2 selected resort: Studio information card (a single-card carousel); the official page link stays an RSG link */
  C.resortDetails = function (st) {
    var r = st.resort;
    var c = studio("detail", "carousel", { cards: [resortCard(r)] });
    linkResortImages(c, [r]);
    if (r.url) aside(c, externalLink(r.url, "التفاصيل", "link"));
    return c;
  };

  /* 3 villas: one Studio carousel card per villa; اختيار sends the customer line, the official page stays an RSG link */
  C.villas = function () {
    var c = studio("villas", "carousel", { cards: V.map(function (v) {
      var priced = v.name === B.villa.name;
      return sCard({ image_url: v.image, badge_title: priced ? clip(B.rate.name, 15) : "", badge_position: "top-right", main_title: clip(v.nameAr || v.name, 60), subtitle: priced ? money(B.rate.total) : "",
        description: "**" + (v.occupancyAr || v.occupancy) + "**\n\n" + bullets(String(v.factsAr || v.facts).split(" · ")) + (priced ? "\n\n" + B.rate.basisAr + " · " + B.rate.taxNoteAr : ""),
        primary_button_label: "اختيار", primary_button_payload: S.customer.villa.replace("{{{villa}}}", v.name).replace(/\{\{|\}\}/g, "") });
    }) }, function (value, index, cardIndex) {
      var v = V[cardIndex]; if (v) act({ type: "villa", villa: v.name }, S.customer.villa.replace("{{{villa}}}", "{{" + v.name + "}}"));
    });
    aside(c, externalLink(VILLA_URL, "معلومات الفلل على صفحة " + esc(B.resort.name), "link"));
    return c;
  };

  /* Shebara or Desert Rock: one Studio information card per criterion (a carousel without buttons), each naming
     what Shebara offers, what Desert Rock offers and the difference that matters to the guest
     (data/resorts.js, RESORT_COMPARE). The recommendation is a separate message, the choice a separate carousel. */
  var COMPARE = ["Shebara", "Desert Rock"];
  function byName(n) { return ALL_RESORTS.filter(function (x) { return x.name === n; })[0]; }
  C.compare = function () {
    var rows = window.RESORT_COMPARE || [];
    var c = studio("compare", "carousel", { cards: rows.map(function (x, i) {
      var desc = "- **Shebara:** " + x.shebara + "\n- **Desert Rock:** " + x.desertRock + (x.diff ? "\n\n**" + x.diffLabel + ":** " + x.diff : "");
      return sCard({ badge_title: (i + 1) + " من " + rows.length, main_title: clip(x.title, 60), subtitle: clip(x.question, 30), description: desc });
    }) });
    compareThumbs(c);
    return c;
  };
  /* each resort's entry in the comparison is identified by a small photo of that resort (the same image and official
     page as the selection carousel). A Studio carousel card carries one image per card, so this is an RSG hook. */
  function compareThumbs(c) {
    var list = COMPARE.map(byName);
    c.querySelectorAll(".cc-description li strong").forEach(function (s) {
      var name = s.textContent.replace(/[^A-Za-z ]/g, "").trim(), r = list.filter(function (x) { return x.name === name; })[0];
      if (!r || !r.image) return;
      var label = "صفحة " + r.name + " الرسمية على " + hostOf(r.url || "") + "، تفتح في تبويب جديد";
      var t = r.url ? h("a", { "class": "cmp-thumb", href: r.url, target: "_blank", rel: "noopener noreferrer", "aria-label": label, title: label }) : h("span", { "class": "cmp-thumb" });
      t.appendChild(h("img", { src: r.image, alt: "", loading: "lazy" }));
      s.classList.add("cmp-name"); s.insertBefore(t, s.firstChild);
    });
  }
  C.comparePick = function () {
    var list = COMPARE.map(byName);
    var c = studio("resortsCompare", "carousel", { cards: list.map(function (r) {
      return sCard({ image_url: r.image, badge_title: clip(r.settingAr || "", 15), main_title: clip(r.name, 60), subtitle: clip(GROUP_AR[r.group] || r.group, 30), description: r.aboutAr || r.factsAr || r.facts, primary_button_label: "اختيار", primary_button_payload: S.customer.resort.replace("{{{resort}}}", r.name) });
    }) }, function (value, index, cardIndex) { var r = list[cardIndex]; if (r) act({ type: "resort", name: r.name }, null); });
    linkResortImages(c, list);
    return c;
  };

  /* 4 calendar: one range surface, Sunday-first Gregorian, Western digits */
  C.calendar = function () {
    var c = comp("calendar", "", "calendar"), box = c.firstChild, cur = { y: +B.stay.checkIn.slice(0, 4), m: +B.stay.checkIn.slice(5, 7) - 1 }, sel = { a: "", b: "" }, invalid = false;
    function iso(y, m, d) { return y + "-" + ("0" + (m + 1)).slice(-2) + "-" + ("0" + d).slice(-2); }
    function render() {
      var first = new Date(Date.UTC(cur.y, cur.m, 1)).getUTCDay(), days = new Date(Date.UTC(cur.y, cur.m + 1, 0)).getUTCDate();
      var html = '<div class="cal-top"><div class="cal-month"><button type="button" class="prev" aria-label="الشهر السابق">' + Q.chevR + "</button><strong>" + AR_MONTH.format(new Date(Date.UTC(cur.y, cur.m, 1))) + '</strong><button type="button" class="next" aria-label="الشهر التالي">' + Q.chevL + '</button></div><div class="weekdays">' + ["ح", "ن", "ث", "ر", "خ", "ج", "س"].map(function (x) { return "<span>" + x + "</span>"; }).join("") + '</div><div class="days">';
      for (var i = 0; i < first; i++) html += '<span class="blank"></span>';
      for (var d = 1; d <= days; d++) {
        var k = iso(cur.y, cur.m, d), cls = k === sel.a || k === sel.b ? "endpoint" : (sel.a && sel.b && k > sel.a && k < sel.b) ? "middle" : "";
        html += '<button type="button" data-d="' + k + '" class="' + cls + '" aria-label="' + d + " " + AR_MONTH.format(new Date(Date.UTC(cur.y, cur.m, 1))) + (k === sel.a ? "، الوصول" : k === sel.b ? "، المغادرة" : "") + '" aria-pressed="' + (k === sel.a || k === sel.b) + '"><span>' + d + "</span></button>";
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
        act({ type: "dates", a: sel.a, b: sel.b }, null, function (res) {
          if (res.consume) { var bot = box.querySelector(".cal-bottom .row"); if (bot) bot.innerHTML = '<span class="chosen-tag">' + Q.check + "اعتُمدت التواريخ</span>"; }
        });
      };
    }
    render();
    return c;
  };

  /* summaries: Studio Confirmation Cards; the primary button carries the approval line the stage already accepts */
  function summary(st, withTransfers) {
    var t = B.transport, p;
    if (withTransfers) p = sConf({ image_url: "assets/site/resorts-hero-shebara.webp", badge_text: "الملخص المحدّث", main_title: clip(B.resort.name, 30), subtitle: villaTitle() + " · " + stayLine(st) + " · " + adultsWord(st.adults),
      primary_card_title: "الإقامة", primary_card_subtitle: money(B.rate.total), primary_card_icon: ICON("bed"),
      secondary_card_title: "التنقلات", secondary_card_subtitle: money(t.transfersTotal), secondary_card_icon: ICON("plane"),
      tertiary_card_title: "الإجمالي", tertiary_card_subtitle: money(B.grandTotal) + " · " + B.rate.taxNoteAr, tertiary_card_icon: ICON("credit-card"),
      instructions: "الإقامة والتنقلات · " + adultsWord(st.adults) + " · " + B.rate.taxNoteAr, primary_button_label: "اعتمد ونكمل", primary_button_payload: "اعتمد ونكمل", primary_button_icon: "check" });
    else p = sConf({ image_url: "assets/site/resorts-hero-shebara.webp", badge_text: "ملخص الإقامة", main_title: clip(B.resort.name, 30), subtitle: villaTitle() + " · " + B.rate.name,
      primary_card_title: "التواريخ", primary_card_subtitle: stayLine(st), primary_card_icon: ICON("calendar"),
      secondary_card_title: "الضيوف", secondary_card_subtitle: adultsWord(st.adults), secondary_card_icon: ICON("users"),
      tertiary_card_title: "إجمالي الإقامة", tertiary_card_subtitle: money(B.rate.total) + " · " + B.rate.taxNoteAr, tertiary_card_icon: ICON("credit-card"),
      instructions: B.occupancyNoteAr, primary_button_label: "مناسب، نكمل", primary_button_payload: "مناسب، نكمل", primary_button_icon: "check" });
    var c = studio("summary", "confirmation_card", p, function (value) { act({ type: "approve" }, value); });
    linkHeaderImage(c, { name: B.resort.name, url: B.resort.detailsUrl });   /* the header is a Shebara photograph */
    return c;
  }
  C.summary1 = function (st) { return summary(st, false); };
  C.summary2 = function (st) { return summary(st, true); };

  /* arrival modes: Studio Selection List Picker with Lucide icons; the row payload is the customer line */
  C.modes = function () {
    var icons = { "By Plane": "plane", "By Private Jet": "plane-takeoff", "By Car": "car", "By Yacht": "ship" };
    return studio("modes", "selection_list_picker", { main_title: "كيف بتوصلون للبحر الأحمر؟", lock_after_selection: true, items: B.transport.modes.map(function (m) { var w = S.words.modes[m] || m; return sItem({ title: clip(w, 30), icon: icons[m] || "", payload: S.customer.mode.replace("{modeWord}", w) }); }) },
      function (value, index) { var m = B.transport.modes[index]; if (m) act({ type: "mode", mode: m }, null); });
  };

  /* airports: Studio grouped list picker (multi-select with a send button). The Studio line
     "مطار الوصول: X, مطار المغادرة: Y" is the customer message; the adapter reads one airport per group. */
  C.airports = function () {
    var names = B.transport.airportsAr || {}, GA = "مطار الوصول", GD = "مطار المغادرة";
    function label(a) { return names[a] || a; }
    return studio("airports", "grouped_list_picker", { main_title: "مطار الوصول ومطار المغادرة", send_button_label: "اعتماد المطارات", lock_after_selection: true, is_multiple_selection: true, groups: [{ title: GA, options: B.transport.airports.map(label) }, { title: GD, options: B.transport.airports.map(label) }] },
      function (value) {
        var picks = {}; picks[GA] = []; picks[GD] = [];
        value.split(", ").forEach(function (part) { var i = part.indexOf(": "); if (i < 0) return; var g = part.slice(0, i), a = B.transport.airports.filter(function (x) { return label(x) === part.slice(i + 2); })[0]; if (picks[g] && a) picks[g].push(a); });
        var shown = value; B.transport.airports.forEach(function (a) { var l = label(a); if (!/[\u0600-\u06FF]/.test(l)) shown = shown.split(l).join("{{" + l + "}}"); });
        if (picks[GA].length === 1 && picks[GD].length === 1) act({ type: "airports", arrival: picks[GA][0], departure: picks[GD][0], flight: {}, text: shown }, null);
        else customer(shown, { type: "airportsBad" });                       /* not one airport per group: the stage asks again */
      });
  };

  /* transfer legs: two Studio information cards, each with its photograph, route, details and price basis */
  C.transportTrip = function () {
    return studio("transport", "carousel", { cards: B.transport.legs.map(function (l, i) {
      var list = [];
      if (l.duration) list.push(l.durationAr || l.duration);
      (l.capacityAr || l.capacity || []).forEach(function (x) { list.push(x); });
      if (l.needed) list.push(l.neededAr || l.needed);
      var blocks = ["**" + routeText(l.from, l.to) + "**"];
      if (list.length) blocks.push(bullets(list));
      if (l.priceBasisAr || l.priceBasis) blocks.push(l.priceBasisAr || l.priceBasis);
      return sCard({ image_url: l.image || "", badge_title: i ? "المغادرة" : "الوصول", main_title: clip(l.productAr || l.product, 60), subtitle: money(l.price), description: blocks.join("\n\n") });
    }) });
  };

  /* experiences: three Studio information cards; the decision stays with the reply buttons */
  C.activities = function () {
    return studio("experiences", "carousel", { cards: B.activities.map(function (a) {
      var price = a.priceAr || a.price || "", short = Array.from(price).length <= 30 ? price : price.split("،")[0];
      return sCard({ image_url: a.image, badge_title: clip(a.categoryAr || a.category, 15), badge_position: "bottom-left", main_title: clip(a.nameAr || a.name, 60), subtitle: clip(short, 30), description: bullets(a.tagsAr || a.tags) + (short !== price ? "\n\n" + price : "") });
    }) });
  };

  /* 10 one coordinated guest and wife form (initial, voice-populated, edit) */
  var MARK_VOICE = '<span class="field-marker" role="img" aria-label="قيمة مستخلصة من الرسالة الصوتية" title="قيمة مستخلصة من الرسالة الصوتية">' + Q.spark + "</span>";
  var MARK_SAVED = '<span class="field-marker saved" role="img" aria-label="من بياناتك المحفوظة" title="من بياناتك المحفوظة">' + Q.user + "</span>";
  var MARK_CHAT = '<span class="field-marker chat" role="img" aria-label="محفوظ من المحادثة" title="محفوظ من المحادثة">' + Q.chat + "</span>";
  function watchMark(l) {
    var ctl = l.querySelector("input, select, textarea"); if (!ctl) return;
    function clear() { var m = l.querySelector(".field-marker"); if (m) m.remove(); l.classList.remove("ai"); ctl.removeEventListener("input", clear); ctl.removeEventListener("change", clear); }
    ctl.addEventListener("input", clear); ctl.addEventListener("change", clear);
  }
  /* After a voice message a NEW guest form is sent, already filled; the open one is retired (kept in the
     history, inactive, with a short note) so only one form is active for this step. */
  var formSeq = 0, SEED_KEYS = ["title", "firstName", "familyName", "email", "mobileCode", "mobile", "guest2First", "guest2Family", "requests"];
  function retireGuestForms() {
    scroll.querySelectorAll(".rich:not(.used) form.guest-form:not(.edit)").forEach(function (f) {
      var r = f.closest(".rich"); consume(r); r.classList.add("superseded");
      r.appendChild(h("p", { "class": "superseded-note", lang: "ar", dir: "rtl", text: S.words.formSuperseded }));
    });
  }
  /* values for that form: what the customer already typed in the open form, the first name known from the
     conversation, then the extracted values; nothing else is added */
  C.guestForm = function (st, opts) {
    var edit = !!(opts && opts.edit), vd = edit ? st.guest : (st.formSeed || {}), ex = edit ? {} : (st.formSeed ? st.voiceData || {} : {}), pf = edit ? {} : (st.profile || {}), gf = B.guestForm, first = edit ? vd.firstName : (vd.firstName || st.name), id = ++formSeq;
    if (!edit) retireGuestForms();
    function val(k) { return vd && vd[k] ? esc(vd[k]) : ""; }
    function mark(k) { return edit ? "" : (k === "firstName" ? (pf.firstName && pf.firstName === first ? MARK_SAVED : st.name && first === st.name ? MARK_CHAT : "") : (ex[k] && ex[k] === vd[k] ? MARK_VOICE : pf[k] && pf[k] === vd[k] ? MARK_SAVED : "")); }   /* voice-extracted and saved-profile values carry different markers */
    function fld(label, name, attrs, k, cls) { return '<label class="field' + (cls ? " " + cls : "") + (mark(k) ? " ai" : "") + '"><span class="field-label">' + label + mark(k) + "</span><input name=\"" + name + '" value="' + val(k) + '" ' + attrs + "></label>"; }
    var c = comp("guest", "", "guest-form"), box = c.firstChild; box.classList.add("guest-form");
    var form = h("form", { "class": "guest-form" + (edit ? " edit" : ""), "data-form-id": String(id), novalidate: "", html:
      "<header><h3>" + (edit ? "تعديل بيانات الضيفين" : "بيانات الضيفين") + "</h3>" + (edit ? Q.pencil : Q.user) + "</header>" +
      '<div class="guest-name-grid"><label class="field' + (mark("title") ? " ai" : "") + '"><span class="field-label">اللقب' + mark("title") + '</span><select name="title" required><option value="">اختر</option>' + gf.titles.map(function (x) { return "<option" + (vd && vd.title === x ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field' + (mark("firstName") ? " ai" : "") + '"><span class="field-label">الاسم الأول' + mark("firstName") + '</span><input name="firstName" value="' + esc(first) + '" autocomplete="given-name" required></label>' +
      fld("اسم العائلة", "familyName", 'autocomplete="family-name" required', "familyName") + "</div>" +
      '<div style="margin-top:10px"><label class="field"><span class="field-label">البريد الإلكتروني</span><input name="email" type="email" dir="ltr" autocomplete="email" inputmode="email" required' + (vd.email ? ' value="' + esc(vd.email) + '"' : "") + "></label></div>" +
      '<div class="phone-grid" style="margin-top:10px"><label class="field' + (mark("mobileCode") ? " ai" : "") + '"><span class="field-label">رمز الدولة' + mark("mobileCode") + '</span><select name="mobileCode" dir="ltr">' + gf.countryCodes.map(function (x) { return "<option" + (x === ((vd && vd.mobileCode) || gf.defaultCountryCode) ? " selected" : "") + ">" + esc(x) + "</option>"; }).join("") + "</select></label>" +
      fld("الجوال", "mobile", 'type="tel" dir="ltr" inputmode="tel" autocomplete="tel-national" required', "mobile") + "</div>" +
      '<div class="subheading">بيانات الزوجة <span class="muted">· اختياري</span></div><div class="form-grid">' + fld("الاسم الأول", "guest2First", 'autocomplete="off"', "guest2First") + fld("اسم العائلة", "guest2Family", 'autocomplete="off"', "guest2Family") + "</div>" +
      '<div style="margin-top:10px"><label class="field' + (mark("requests") ? " ai" : "") + '"><span class="field-label">طلب إضافي <span class="muted">· اختياري</span>' + mark("requests") + '</span><textarea name="requests" maxlength="200">' + val("requests") + '</textarea></label></div><p class="muted" style="margin-top:3px">يُنظر في الطلب حسب الإمكانية.</p>' +
      '<label class="check-label"><input type="checkbox" name="marketing"' + (vd.marketing ? " checked" : "") + "><span>أرغب في تلقي أخبار وعروض البحر الأحمر.</span></label>" +
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

  /* 12 review: Studio Confirmation Card with تعديل البيانات as its secondary button; the explicit, unchecked
     terms acknowledgement has no slot in the component and stays an RSG control beneath the card */
  C.review = function (st) {
    var g = st.guest, t = B.transport;
    var p = sConf({ image_url: B.villa.terraceImage, badge_text: "مراجعة رحلتك", main_title: clip(B.resort.name, 30), subtitle: villaTitle() + " · " + B.rate.name + " · " + stayLine(st) + " · " + adultsWord(st.adults) + " · " + airportsLine(st),
      primary_card_title: "الضيوف", primary_card_subtitle: clip(guestsLine(st, " · "), 150), primary_card_icon: ICON("users"),
      secondary_card_title: "التنقلات", secondary_card_subtitle: transfersLine(), secondary_card_icon: ICON("plane"),
      tertiary_card_title: "التواصل", tertiary_card_subtitle: iso(g.email) + "\n" + iso(g.mobileCode + " " + g.mobile), tertiary_card_icon: ICON("mail"),
      instructions: withRequest("الإجمالي " + money(B.grandTotal) + " · " + B.rate.taxNoteAr + " · الإقامة " + money(B.rate.total) + " + التنقلات " + money(t.transfersTotal) + " · لا تجارب مضافة", st),
      primary_button_label: "البيانات صحيحة، نكمل", primary_button_payload: "البيانات صحيحة، نكمل", primary_button_icon: "check",
      secondary_button_label: "تعديل البيانات", secondary_button_payload: "تعديل البيانات", secondary_button_icon: "user" });
    var c = studio("review", "confirmation_card", p, function (value, index) {
      if (index === 1) { if (scroll.querySelector(".rich:not(.used) form.guest-form")) return; noteUnread(addComponent(C.guestForm(state, { edit: true }))); return; }
      act({ type: "confirm", termsAccepted: !!state.termsAccepted }, value);
    });
    requestNote(c, st);
    var a = aside(c, '<label class="consent"><input type="checkbox" name="terms"' + (st.termsAccepted ? " checked" : "") + '><span>قرأت ووافقت على <a href="' + esc(B.legal.termsUrl) + '" target="_blank" rel="noopener noreferrer">الشروط والأحكام</a> و<a href="' + esc(B.legal.privacyUrl) + '" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a>.</span></label>' + (g.marketing ? "<p>مشترك في أخبار وعروض البحر الأحمر</p>" : "") + '<div class="form-error error" role="alert"></div>', "review-terms");
    a.querySelector("[name=terms]").addEventListener("change", function (e) { state.termsAccepted = e.target.checked; a.querySelector(".form-error").textContent = ""; });   /* the live `state`, which the server snapshot replaces each turn */
    return c;
  };
  function termsError() { var r = Array.prototype.slice.call(scroll.querySelectorAll(".rich:not(.used) .review-terms .form-error")).pop(); if (r) r.innerHTML = Q.alert + "يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية."; }

  /* 13 e-mail verification: all states come from server.py; nothing is accepted locally */
  var FILE_ORIGIN = location.protocol === "file:";
  /* opts.signin: the returning-customer sign-in. The customer types (and may correct) the e-mail; only after the
     server verifies the code does it release the saved profile, through a session bound to that e-mail. */
  C.verify = function (st, opts) {
    var signin = !!(opts && opts.signin);
    function mask(e) { return String(e || "").replace(/^(.{2}).*(@.*)$/, "$1••••$2"); }
    var email = signin ? (st.loginEmail || "") : st.guest.email, masked = mask(email);
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
      var editing = signin && (stateName === "initial" || stateName === "failure");
      var html = "<header><h3>" + (signin ? "الدخول بحسابك" : "تأكيد بريدك الإلكتروني") + "</h3>" + Q.mail + '</header><p class="muted">' + (stateName === "verified" ? (signin ? "تم التحقق، ونسترجع بياناتك المحفوظة." : "بريدك جاهز للمتابعة.") : initial ? (signin ? "اكتب بريدك المسجّل، ونرسل لك رمزًا من 6 أرقام." : "نرسل لك رمزًا لتأكيد البريد.") : "أدخل الرمز المرسل إلى بريدك.") + "</p>" +
        (editing ? '<label class="field vemail" style="margin:10px 0 12px"><span class="field-label">البريد الإلكتروني</span><input name="loginEmail" type="email" dir="ltr" autocomplete="email" inputmode="email" value="' + esc(email) + '"></label>' : '<div class="otp-email"><bdi>' + esc(initial ? email : masked) + "</bdi></div>");
      if (stateName === "verified") html += '<div class="status-message success">' + Q.circleCheck + "تم التحقق من البريد</div>";
      else if (initial) html += (extra ? '<p class="error" style="margin-bottom:10px">' + Q.alert + esc(extra) + "</p>" : "") + '<button type="button" class="primary full vsend"' + (stateName === "sending" || stateName === "blocked" ? " disabled" : "") + ">" + (stateName === "sending" ? Q.loader + " جارٍ الإرسال…" : stateName === "failure" ? "إعادة المحاولة" : stateName === "blocked" ? "إرسال الرمز" : "إرسال الرمز") + "</button>" + (stateName === "blocked" ? '<div class="row between" style="margin-top:6px"><span class="muted"></span><button type="button" class="text-action vcheck">تحقق مرة أخرى</button></div>' : "");
      else html += '<form class="vform" novalidate><div class="otp-boxes' + (stateName === "invalid" || stateName === "expired" ? " invalid" : "") + '">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<input maxlength="1" inputmode="numeric" pattern="[0-9]" aria-label="الرقم ' + (i + 1) + ' من رمز التحقق" autocomplete="' + (i === 0 ? "one-time-code" : "off") + '" placeholder="–">'; }).join("") + '</div><div class="otp-note" role="alert">' + (extra ? '<p class="error">' + Q.alert + esc(extra) + "</p>" : "") + '</div><button type="submit" class="primary full">تحقق</button></form><div class="row between" style="margin-top:6px">' + (signin ? '<button type="button" class="text-action vchange">تغيير البريد</button>' : '<span class="muted">لم يصلك الرمز؟</span>') + '<button type="button" class="text-action vresend"' + (cooldown > 0 ? " disabled" : "") + ">" + (cooldown > 0 ? "إعادة الإرسال بعد 00:" + ("0" + cooldown).slice(-2) : "إعادة الإرسال") + "</button></div>";
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
    function startSignin() {
      var inp = box.querySelector(".vemail input"), v = inp ? inp.value.trim().toLowerCase() : "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { email = v; view("failure", "أدخل بريدًا إلكترونيًا صحيحًا."); var i2 = box.querySelector(".vemail input"); if (i2) i2.focus(); return; }
      email = v; st.loginEmail = v; masked = mask(v); request();
    }
    /* returning customer: the chat backend reads the saved profile itself for the session the server issued for
       this verified e-mail; the page only forwards that session token (never the profile, never to the agent) */
    function signedIn(session) { act({ type: "signedIn", session: session }, null); }
    function wire(stateName) {
      var sendB = box.querySelector(".vsend"), check = box.querySelector(".vcheck"), resend = box.querySelector(".vresend"), form = box.querySelector(".vform");
      if (sendB) sendB.addEventListener("click", signin ? startSignin : request);
      var change = box.querySelector(".vchange");                        /* correct the address: the new one is verified from scratch */
      if (change) change.addEventListener("click", function () { if (inflight || c.classList.contains("used")) return; st.otp = null; clearInterval(cdTimer); cooldown = 0; view("initial"); var i = box.querySelector(".vemail input"); if (i) i.focus(); });
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
            if (r.kind === "json" && r.ok && r.body.verified) { clearInterval(cdTimer); view("verified"); if (signin) signedIn(r.body.session); else act({ type: "verify", session: r.body.session }, null); return; }
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

  /* Guest details: a returning customer signs in with the e-mail (verified first), a new guest continues without a code */
  C.accountChoice = function () {
    var items = [{ title: "لدي حساب سابق", subtitle: "الدخول ببريدك الإلكتروني واسترجاع بياناتك المحفوظة", icon: "lock", mode: "account" },
                 { title: "متابعة كضيف جديد", subtitle: "إدخال بياناتك وبيانات زوجتك للحجز", icon: "user", mode: "guest" }];
    return studio("account", "selection_list_picker", { main_title: "كيف تحب نكمل؟", lock_after_selection: true, items: items.map(function (x) { return sItem({ title: x.title, subtitle: x.subtitle, icon: x.icon, payload: x.title }); }) },
      function (value, index) { var x = items[index]; if (x) act({ type: "account", mode: x.mode }, x.title); });
  };
  C.signIn = function (st) { return C.verify(st, { signin: true }); };

  /* 14 payment hand-off: Studio Confirmation Card. Its button sends the payload as the customer line; the adapter
     opens the official checkout in a new tab, starts the five-second timer and shows the quiet waiting state. */
  C.payment = function (st) {
    var wait;
    var c = studio("payment", "confirmation_card", sConf({ image_url: B.villa.terraceImage, badge_text: "visitredsea.com", main_title: "إجمالي رحلتك", subtitle: money(B.grandTotal) + " · " + B.rate.taxNoteAr,
      primary_card_title: "المنتجع", primary_card_subtitle: B.resort.name, primary_card_icon: ICON("hotel"),
      secondary_card_title: "الفيلا", secondary_card_subtitle: villaTitle(), secondary_card_icon: ICON("bed"),
      tertiary_card_title: "التواريخ", tertiary_card_subtitle: st.checkInLabel + " – " + st.checkOutLabel + " · " + adultsWord(st.adults), tertiary_card_icon: ICON("calendar"),
      instructions: "دفع آمن على visitredsea.com", primary_button_label: "المتابعة للدفع", primary_button_payload: "المتابعة إلى الدفع على Visit Red Sea", primary_button_icon: "lock" }),
      function (value) {
        window.open(B.checkoutUrl, "_blank", "noopener");
        if (state.paymentClickedAt) return;                                  /* the link still opens; only the first press starts the wait */
        addMsg("guest", fill(value.replace("Visit Red Sea", "{{Visit Red Sea}}"), state)); scrollToEnd();
        startPaymentTimer();
        wait.innerHTML = '<div class="status-message">' + Q.loader + "لحظات ونكمل معك</div>";
      });
    wait = aside(c, "", "pay-wait");
    return c;
  };

  /* 15 final confirmation: Studio Confirmation Card; تحميل PDF builds the same PDF and does not echo a customer line */
  C.confirmation = function (st) {
    var g = st.guest, pdfBusy = false, status;
    var c = studio("confirmation", "confirmation_card", sConf({ image_url: B.resort.image, badge_text: "رحلتك بانتظارك", main_title: clip(B.resort.name, 30), subtitle: villaTitle() + " · " + B.rate.name + " · " + stayLine(st) + " · " + airportsLine(st),
      primary_card_title: "الضيوف", primary_card_subtitle: clip(guestsLine(st, " و") + " · " + adultsWord(st.adults), 150), primary_card_icon: ICON("users"),
      secondary_card_title: "التنقلات", secondary_card_subtitle: transfersLine(), secondary_card_icon: ICON("plane"),
      tertiary_card_title: "التواصل", tertiary_card_subtitle: iso(g.email) + "\n" + iso(g.mobileCode + " " + g.mobile), tertiary_card_icon: ICON("mail"),
      instructions: withRequest("الإجمالي " + money(B.grandTotal) + " · " + B.rate.taxNoteAr + " · لا تجارب مضافة", st),
      primary_button_label: "تحميل PDF", primary_button_payload: "تحميل PDF", primary_button_icon: "download" }),
      function () {
        if (pdfBusy) return; pdfBusy = true; status.textContent = "جارٍ تجهيز ملف PDF…";
        window.BookingPdf.make(st, B).then(function (blob) { window.BookingPdf.download(blob, B.resort.name + "_Booking_Summary_" + st.checkIn + ".pdf"); status.textContent = "تم التحميل."; pdfBusy = false; })
          .catch(function () { status.textContent = "تعذر تجهيز الملف. حاول مرة أخرى."; pdfBusy = false; });
      }, true);
    requestNote(c, st);
    status = aside(c, "", "pdfstatus"); status.setAttribute("aria-live", "polite");
    linkHeaderImage(c, { name: B.resort.name, url: B.resort.detailsUrl });
    c.querySelector(".bc-btn--primary").setAttribute("data-keep", "");
    return c;
  };


  /* Quick replies: the Studio `buttons` component inside the agent turn, bound to the stage it was rendered for.
     Ids resolve through QUICK (never through the label); a press is ignored when the group is consumed, a reply
     is being delivered or the stage has moved on. An accepted press consumes the group, posts exactly one
     customer message and sends the same event a card button would (act(), handled by the server). */
  C.quick = function (st, choices) {
    var c = h("div", { "class": "rich quick", "data-stage": st.stage, role: "group", "aria-label": "ردود مقترحة" }), host = h("div", { "class": "rc-container", dir: "rtl" });
    scroll.querySelectorAll(".rich.quick:not(.used)").forEach(consume);          /* only the latest group stays live */
    var rendered = EmpathyStudio.renderRichMessage([{ type: "buttons", payload: { text: "", buttons: choices.map(function (ch) { return { label: ch.label, value: ch.label }; }) } }], studioRegistry, function (value, index) {
      var ch = choices[index];
      if (!ch || c.classList.contains("used") || busy || c.getAttribute("data-stage") !== state.stage) return;
      var q = QUICK[ch.id]; if (!q || q.stages.indexOf(state.stage) < 0) return;
      consume(c);
      act(q.meta(), q.label || ch.label);
    });
    host.appendChild(rendered.firstChild); c.appendChild(host);
    c.querySelectorAll(".rc-btn").forEach(function (b, i) { b.setAttribute("data-id", choices[i].id); });
    return c;
  };

  /* ---------- page: Resorts section hand-off (from V1) ----------
     Runs only when the agent asks for it (browser action "navigate_resorts"): the chat minimises to a bar, the
     page scrolls to the resort cards, the cards show an assistant-added اختر button and the spotlight walks over
     them. Choosing a card (or the carousel in the chat), Escape, the bar and a new conversation clean it up. */
  function stickyHeaderHeight() {
    var hd = document.querySelector(".site-header"); if (!hd) return 0;
    var pos = getComputedStyle(hd).position;
    return pos === "fixed" || pos === "sticky" ? hd.getBoundingClientRect().height : 0;
  }
  function scrollToCards(behavior, target) {
    var card = (target && cardFor(target)) || rail.querySelector(".rcard") || rail, r = card.getBoundingClientRect();
    var top = r.top + window.scrollY, hdr = stickyHeaderHeight() + (document.getElementById("choose-status") ? STATUS_H : 0), vh = window.innerHeight, gap = 16;
    var y = top - hdr - gap;
    if (r.height + hdr + 2 * gap > vh) y = top + r.height + gap - vh;      /* tall card: keep the Choose row on screen */
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: behavior });
  }
  function cardFor(target) { return Array.prototype.filter.call(rail.querySelectorAll(".rcard"), function (c) { return c.getAttribute("data-resort") === target; })[0] || null; }
  var STATUS_H = 44;
  function showChooseStatus() {
    if (document.getElementById("choose-status")) return;
    document.body.appendChild(h("div", { id: "choose-status", lang: "ar", dir: "rtl", role: "status", html: I.spark + "<span>بانتظار اختيارك للمنتجع</span>" }));
  }
  function hideChooseStatus() { var el = document.getElementById("choose-status"); if (el) el.remove(); }
  /* revealChoose(target, done): done(ok, visibleNames | reason) is called once the spotlight is running (or could not be) */
  function revealChoose(target, done) {
    var cards = Array.prototype.slice.call(rail ? rail.querySelectorAll(".rcard") : []);
    if (!cards.length) { done(false, "cards_missing"); return; }
    if (!window.ResortSpotlight) { done(false, "spotlight_unavailable"); return; }
    var focus = target && target !== "all" ? cardFor(target) : null;
    if (target && target !== "all" && !focus) { done(false, "cards_missing"); return; }
    document.body.classList.add("choose-stage");
    resortsSection.classList.add("is-highlighted");
    showChooseStatus();
    minimize();
    /* measure after the Choose buttons and the minimised chat have laid out (a timer, not requestAnimationFrame,
       so the action still completes and is acknowledged when the tab is in the background) */
    later(function () { later(function () {
      scrollToCards(reduced ? "auto" : "smooth", target);
      var lastY = -1, stable = 0, tries = 0;
      (function settle() {
        later(function () {
          tries++; if (window.scrollY === lastY) stable++; else { stable = 0; lastY = window.scrollY; }
          if (stable >= 2 || tries > 25) {
            if (!document.body.classList.contains("choose-stage")) { done(false, "interrupted"); return; }
            scrollToCards("auto", target);                               /* final alignment once images and layout settled */
            window.ResortSpotlight.run(focus ? [focus] : cards, { dwell: 1800 });
            var visible = (focus ? [focus] : cards).filter(function (c) { var r = c.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth; })
              .map(function (c) { return c.getAttribute("data-name") || ""; });
            done(true, visible);
          } else settle();
        }, 120);
      })();
    }, 30); }, 30);
  }
  function endChoose() { document.body.classList.remove("choose-stage"); if (resortsSection) resortsSection.classList.remove("is-highlighted"); hideChooseStatus(); if (window.ResortSpotlight) window.ResortSpotlight.stop(); }
  function minimize() { if (!miniBar) return; savedScroll = scroll.scrollTop; document.body.classList.add("chat-min"); panel.hidden = true; miniBar.hidden = false; setMiniText(S.navigate.miniBar); }
  function restore() { if (!miniBar) return; document.body.classList.remove("chat-min"); miniBar.hidden = true; open(); }
  function setMiniText(t) { if (miniText) miniText.textContent = t; }
  if (miniBar) miniBar.addEventListener("click", function () { restore(); });
  /* the agent's page action: perform it, acknowledge it to the server, then deliver the agent's continuation */
  function runAction(action, done) {
    if (!action || action.kind !== "navigate_resorts") { done(); return; }
    var acked = false;
    function ack(ok, detail) {
      if (acked) return; acked = true;
      var body = { sid: sid, actionId: action.id, ok: !!ok };
      if (ok) body.visible = detail || []; else body.reason = detail || "failed";
      chatApi("/api/chat/action-result", body).then(function (r) {
        if (!r.ok) { if (r.status !== 410) addMsg("agent", fill(S.live.unavailable, state)); done(); return; }
        applySnapshot(r.body.state);
        if (r.body.consume) scroll.querySelectorAll(".rich:not(.used)").forEach(consume);
        var items = r.body.items || [];
        deliver(items, function () { if (items.length && document.body.classList.contains("chat-min")) setMiniText(S.navigate.miniBarNew); done(); }, { quiet: true });
      });
    }
    revealChoose(action.target, ack);
  }

  /* ---------- engine ----------
     The transitions live in server.py (agent/state.py); the page keeps the quick-reply ids it can press. */
  /* Quick replies: stable ids, valid stages, and the event they resolve to. Labels live in data/script.js. */
  var QUICK = {
    approve1_ok: { stages: ["approve1"], meta: function () { return { type: "approve" }; } },
    approve2_ok: { stages: ["approve2"], meta: function () { return { type: "approve" }; } },
    activities_defer: { stages: ["activities"], meta: function () { return { type: "defer" }; } },
    review_confirm: { stages: ["review"], meta: function () { return { type: "confirm" }; } },
    resort_shebara: { stages: ["resort"], meta: function () { return { type: "resort", name: "Shebara" }; } },
    villa_supported: { stages: ["villa"], meta: function () { return { type: "villa", villa: B.villa.name }; } },
    dates_supported: { stages: ["dates"], meta: function () { return { type: "dates", a: B.stay.checkIn, b: B.stay.checkOut }; } },
    mode_plane: { stages: ["mode"], meta: function () { return { type: "mode", mode: B.transport.supportedMode }; } },
    airports_supported: { stages: ["airports"], meta: function () { return { type: "airports", arrival: B.transport.arrivalAirport, departure: B.transport.departureAirport, flight: {} }; } }
  };
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
    var i = 0, first = true, quick = !!(opts && opts.quickFirst), pendingQuick = null;
    setTypingStatus(true);
    function finish() {                                 /* quick replies come after the whole turn: every message and component */
      if (pendingQuick) noteUnread(addComponent(C.quick(state, pendingQuick)));
      setTypingStatus(false); done();
    }
    function nextItem() {
      if (i >= items.length) { finish(); return; }
      var it = items[i++]; if (typeof it === "string") it = { text: it };
      if (!it.text) {                                   /* a component attached to the previous message */
        if (it.component && C[it.component]) noteUnread(addComponent(C[it.component](state)));
        if (it.quick) pendingQuick = it.quick;
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
          if (it.quick) pendingQuick = it.quick;
          if (isFirst && !(opts && opts.quiet)) revealFirstReply(el); else noteUnread(el);
          if (comp) noteUnread(comp);
          nextItem();
        }, typing);
      }, gap);
    }
    nextItem();
  }

  /* One turn: the customer's line (or a card action) goes to the server; the reply items, the new state and an
     optional page action come back. A typed line runs the live agent, so the typing indicator shows at once. */
  var queuedResort = null;
  function ensureSession() {
    if (sid) return Promise.resolve(true);
    return chatApi("/api/chat/session", {}).then(function (r) { if (r.ok && r.body.sid) { sid = r.body.sid; applySnapshot(r.body.state); return true; } return false; });
  }
  function customer(text, meta, cb, opts) {
    if (busy) return; busy = true; sendBtn.disabled = true; scroll.classList.add("busy");
    var isEvent = !!(meta && meta.type), silent = !!(meta && meta.silent);
    if (!silent) { if (meta && meta.type === "voice") addVoiceMsg(meta.url, meta.seconds); else addMsg("guest", fill(text, state)); scrollToEnd(); }
    if (!isEvent) { showTyping(); setTypingStatus(true); }
    function finish(res) {
      busy = false; scroll.classList.remove("busy"); sendBtn.disabled = rec.state !== "idle";
      if (cb) cb(res || {});
      if (queuedResort) { var q = queuedResort; queuedResort = null; act(q, null); return; }
      if (rec.state === "idle" && !panel.hidden) composer.focus();
    }
    function fail(key) { hideTyping(); setTypingStatus(false); noteUnread(addMsg("agent", fill(S.live[key] || S.live.unavailable, state))); finish({ consume: false, error: key }); }
    ensureSession().then(function (ok) {
      if (!ok) { fail("unavailable"); return; }
      var body = { sid: sid, turnId: newTurnId(), client: { termsAccepted: !!state.termsAccepted } };
      if (isEvent) { body.kind = "event"; body.event = meta; } else { body.kind = "text"; body.text = text; }
      (function send(attempt) {
        chatApi("/api/chat/turn", body).then(function (r) {
          if (r.status === 409 && attempt < 3) { later(function () { send(attempt + 1); }, (r.body && r.body.retryAfterMs) || 1500); return; }
          hideTyping();
          if (!r.ok) { fail(r.status === 404 ? "expired" : "unavailable"); return; }
          var res = r.body; applySnapshot(res.state);
          if (res.consume && !(meta && meta.type === "voice")) scroll.querySelectorAll(".rich:not(.used)").forEach(consume);
          deliver(res.items || [], function () {
            if (res.after === "termsError") termsError();
            if (res.action) runAction(res.action, function () { finish(res); }); else finish(res);
          }, opts);
        });
      })(0);
    });
  }
  /* Component action: builds the customer line and sends the action as an event (no model call) */
  function act(meta, customerText, cb) {
    if (busy) { if (meta && meta.type === "resort" && meta.source === "page") queuedResort = meta; return; }
    var text = customerText;
    if (meta.type === "dates") { var n = daysBetween(meta.a, meta.b); text = S.customer.dates.replace("{in}", fmtDate(meta.a)).replace("{out}", fmtDate(meta.b)).replace("{nightsWord}", nightsWord(n)); }
    if (meta.type === "mode") text = S.customer.mode.replace("{modeWord}", S.words.modes[meta.mode] || meta.mode);
    if (meta.type === "airports") text = meta.text || S.customer.airports.replace("{{{arrival}}}", "{{" + meta.arrival + "}}").replace("{{{departure}}}", "{{" + meta.departure + "}}");
    if (meta.type === "guest") text = meta.data.guest2First || meta.data.guest2Family ? S.customer.guest : S.customer.guestSolo;
    if (meta.type === "guestEdit") text = S.customer.guestEdit;
    if (meta.type === "verify" || meta.type === "signedIn") text = S.customer.verify;
    if (meta.type === "voice") text = S.words.voiceLabel;
    if (meta.type === "resort") { text = S.customer.resort.replace("{{{resort}}}", "{{" + meta.name + "}}"); endChoose(); if (document.body.classList.contains("chat-min")) restore(); }
    customer(text, meta, cb);
  }

  /* ---------- after the checkout hand-off ----------
     The first click on Proceed to payment opens the official checkout (normal link). Five seconds later, or when
     the customer comes back to this tab, the page tells the server once (event paymentReturned) and the concierge
     explains that this demo receives no payment result and hands over the trip summary and the PDF. Nothing here
     is a payment-provider response. */
  var payTimer = null, paymentSent = false;
  function startPaymentTimer() {
    if (state.paymentClickedAt || state.stage !== "payment") return;
    state.paymentClickedAt = Date.now();
    payTimer = later(paymentContinue, 5000);
  }
  function paymentContinue() {
    if (paymentSent || state.stage !== "payment" || !state.paymentClickedAt) return;
    if (busy) { payTimer = later(paymentContinue, 300); return; }
    if (payTimer) { clearTimeout(payTimer); timers = timers.filter(function (t) { return t !== payTimer; }); payTimer = null; }
    paymentSent = true;
    var waiting = scroll.querySelector(".pay-wait .status-message"); if (waiting) waiting.outerHTML = '<div class="chosen-tag" style="justify-content:center;width:100%">' + Q.check + "عدنا من صفحة الدفع</div>";
    customer("", { type: "paymentReturned", silent: true }, null, { quickFirst: true });
  }
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && state.paymentClickedAt && !paymentSent && Date.now() - state.paymentClickedAt >= 5000) paymentContinue();
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
    if (["voice", "guest", "account"].indexOf(state.stage) >= 0) act({ type: "voice", url: url, seconds: seconds }, null);
    else customer(S.words.voiceLabel, { type: "voiceOther", url: url, seconds: seconds });   /* outside the guest-details step: the server asks to type */
  }
  micBtn.addEventListener("click", function () { if (rec.state === "rec") voiceStop(); else voiceStart(); });
  composer.addEventListener("input", function () { errEl.textContent = ""; });
  stopB.addEventListener("click", voiceStop);
  cancelB.addEventListener("click", voiceCancel);
  window.addEventListener("resize", function () { if (rec.state === "rec") drawWave(); });

  /* ---------- page resort cards (backdrop + assistant-added اختر, shown only during the page hand-off) ---------- */
  var ASSIST_TIP = "أظهر المساعد هذا الزر لمساعدتك على اختيار المنتجع.";
  function resortId(name) { return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }   /* same rule as agent/data.py */
  if (rail) {
    R[0].items.forEach(function (r) {
      var tags = r.name === "Shebara" ? ["Overwater", "Beachfront"] : [r.place.split(",")[0]];
      var cardEl = h("article", { "class": "rcard", "data-name": r.name, "data-resort": resortId(r.name), html:
        '<img src="' + esc(r.image) + '" alt="' + esc(r.name) + '" loading="lazy"><div class="body"><div class="dest">The Red Sea</div><h3>' + esc(r.name) + '</h3><div class="tags">' +
        tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div><div class="acts"><a class="explore" href="#">Explore</a><span class="assist" lang="ar" dir="rtl"><span class="abadge" role="img" aria-label="أضافه المساعد" title="' + ASSIST_TIP + '">' + I.spark + '</span><button type="button" class="choose" data-name="' + esc(r.name) + '" title="' + ASSIST_TIP + '" aria-label="اختر ' + esc(r.name) + '">اختر</button></span></div></div>' });
      cardEl.querySelector(".choose").addEventListener("click", function () { act({ type: "resort", name: r.name, source: "page" }, null); });
      rail.appendChild(cardEl);
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
  launcher.addEventListener("click", function () { if (document.body.classList.contains("chat-min")) restore(); else open(); });
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!menu.hidden) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); }
    else if (document.body.classList.contains("choose-stage") && window.ResortSpotlight && window.ResortSpotlight.active()) { hideChooseStatus(); }   /* spotlight.js stops itself on Escape; the cards keep their اختر until a choice */
    else if (!panel.hidden) close();
  });
  menuBtn.addEventListener("click", function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; menuBtn.setAttribute("aria-expanded", String(!menu.hidden)); });
  document.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target)) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); } });
  document.getElementById("chat-new").addEventListener("click", function () { menu.hidden = true; start(); });

  function start() {
    cancelTimers(); payTimer = null; paymentSent = false; queuedResort = null; state = freshState(); busy = false; scroll.innerHTML = ""; savedScroll = 0; clearUnread(); setTypingStatus(false); voiceCancel(); composer.value = ""; sendBtn.disabled = false;
    endChoose(); if (document.body.classList.contains("chat-min")) restore();
    sid = null; ensureSession().then(function (ok) { if (!ok) console.warn("live concierge: could not open a chat session (is this page served by server.py?)"); });
    addMsg("agent", fill(S.greeting, state));
  }
  start();
  var qs = new URLSearchParams(location.search);
  if (qs.get("open") === "1") open();

})();

