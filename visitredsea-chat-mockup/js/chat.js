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
      checkIn: "", checkOut: "", checkInLabel: "", checkOutLabel: "", nights: 0, mode: "", arrivalAirport: "", departureAirport: "", flight: {}, voice: null, voiceData: null, formSeed: null, guest: null, otp: null, verifiedEmail: "", authMode: "", loginEmail: "", profile: null, paymentClickedAt: 0, paid: false };
  }

  /* ---------- DOM ---------- */
  var scroll = document.getElementById("chat-scroll"), panel = document.getElementById("chat-panel"), launcher = document.getElementById("chat-launcher"),
    closeBtn = document.getElementById("chat-close"), composer = document.getElementById("chat-input"), sendBtn = document.getElementById("chat-send"),
    menuBtn = document.getElementById("chat-menu"), menu = document.getElementById("chat-menu-list"), miniBar = document.getElementById("chat-minibar"),
    miniText = document.getElementById("chat-minibar-text"), resortsSection = document.getElementById("resorts"), rail = document.getElementById("resort-rail");
  var busy = false, savedScroll = 0, typingEl = null;

  function scrollToEnd() { scroll.scrollTo({ top: scroll.scrollHeight, behavior: reduced ? "auto" : "smooth" }); }
  function addMsg(from, html) {
    var msg = h("div", { "class": "msg " + from });
    if (from === "agent") msg.appendChild(h("img", { "class": "av", src: "assets/logos/vrs-turtle-mark.svg", alt: "" , width: "28", height: "28" }));
    var col = h("div", { "class": "col" });
    col.appendChild(h("div", { "class": "bubble", lang: "ar", dir: "rtl", html: html }));
    col.appendChild(h("div", { "class": "meta", html: '<span class="time">' + esc(nowLabel()) + "</span>" + (from === "guest" ? ' <span class="tick" aria-label="sent">✓✓</span>' : "") }));
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
    var bubble = h("div", { "class": "bubble", lang: "ar", dir: "rtl", html: '<div class="vm"><button type="button" class="vmplay" aria-label="Play voice message">' + I.play + '</button><span class="vmbar"><i></i></span><span class="vmtime">' + fmtSecs(seconds) + "</span>" + I.wave + '</div><div class="vmlabel">' + esc(S.words.voiceLabel) + "</div>" });
    col.appendChild(bubble);
    col.appendChild(h("div", { "class": "meta", html: '<span class="time">' + esc(nowLabel()) + '</span> <span class="tick" aria-label="sent">✓✓</span>' }));
    msg.appendChild(col); scroll.appendChild(msg);
    if (url) {
      wirePlayer(url, seconds, bubble.querySelector(".vmplay"), bubble.querySelector(".vmbar i"), bubble.querySelector(".vmtime"));
    } else { msg.classList.add("static"); bubble.querySelector(".vmplay").disabled = true; bubble.querySelector(".vmtime").textContent = ""; }   /* document representation: no invented duration */
    return msg;
  }
  function showTyping() { typingEl = h("div", { "class": "msg agent typing", html: '<img class="av" src="assets/logos/vrs-turtle-mark.svg" alt="" width="28" height="28"><div class="col"><div class="bubble"><span></span><span></span><span></span></div></div>' }); scroll.appendChild(typingEl); scrollToEnd(); }
  function hideTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }
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

  /* ---------- rich components (Arabic, RTL; photographic design shared with V2) ----------
     Every component is one `.component[data-component]` surface: a real image
     layer, its own contrast layer and the content on top (css/atelier-components.css).
     The handlers, fields, validation and engine actions are V1's own. */
  var C = {};
  var AR_DAYS = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
  var GROUP_AR = { "The Red Sea": "البحر الأحمر", "AMAALA": "أمالا", "Private island": "Red Sea Global" };
  function adultsWord(n) { return n === 1 ? "شخص بالغ واحد" : n === 2 ? "شخصان بالغان" : n + " بالغين"; }
  function ltr(s) { return '<bdi dir="ltr">' + esc(s) + "</bdi>"; }
  /* Shared line icons for the component surfaces */
  var Q = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>',
    circleCheck: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  };
  function comp(kind, inner, cls) { return h("div", { "class": "rich" }, [h("div", { "class": "component " + (cls || ""), "data-component": kind, html: inner })]); }
  function externalLink(url, text, cls) { return '<a class="' + (cls || "text-action") + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + text + " " + Q.ext + "</a>"; }
  var AR_MONTH = new Intl.DateTimeFormat("ar-EG-u-ca-gregory-nu-latn", { month: "long", year: "numeric", timeZone: "UTC" });
  function stayStrip(st) {
    var a = st.checkIn.split("-"), b = st.checkOut.split("-");
    var range = a[1] === b[1] ? "<bdi>" + (+a[2]) + "–" + (+b[2]) + "</bdi> " + esc(AR_MONTH.format(new Date(Date.UTC(+a[0], +a[1] - 1, 1)))) : esc(st.checkInLabel) + " – " + esc(st.checkOutLabel);
    return '<div class="stay-strip">' + Q.calendar + "<span>" + range + "</span><span>·</span><span>" + nightsWord(st.nights) + "</span><span>·</span><span>" + adultsWord(st.adults) + "</span></div>";
  }
  var VILLA_URL = B.resort.detailsUrl;      /* no dedicated villa pages are evidenced; the official resort page lists the villas */

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

  /* selected resort: Studio information card (a single-card carousel); the official page link stays an RSG link */
  C.resortDetails = function (st) {
    var r = st.resort;
    var c = studio("detail", "carousel", { cards: [resortCard(r)] });
    linkResortImages(c, [r]);
    if (r.url) aside(c, externalLink(r.url, "التفاصيل على " + hostOf(r.url), "link"));
    return c;
  };

  /* villas: one Studio carousel card per villa; اختيار sends the customer line, the official page stays an RSG link */
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

  /* calendar: one range surface, Sunday-first Gregorian, Western digits; any past, present or future range */
  C.calendar = function () {
    var c = comp("calendar", "", "calendar"), box = c.firstChild, cur = { y: +B.stay.checkIn.slice(0, 4), m: +B.stay.checkIn.slice(5, 7) - 1 }, sel = { a: "", b: "" }, invalid = false;
    function iso(y, m, d) { return y + "-" + ("0" + (m + 1)).slice(-2) + "-" + ("0" + d).slice(-2); }
    function render() {
      var first = new Date(Date.UTC(cur.y, cur.m, 1)).getUTCDay(), days = new Date(Date.UTC(cur.y, cur.m + 1, 0)).getUTCDate();
      var monthName = AR_MONTH.format(new Date(Date.UTC(cur.y, cur.m, 1)));
      var html = '<div class="cal-top"><div class="cal-month"><button type="button" class="prev" aria-label="الشهر السابق">' + Q.chevR + "</button><strong>" + esc(monthName) + '</strong><button type="button" class="next" aria-label="الشهر التالي">' + Q.chevL + '</button></div><div class="weekdays">' + AR_DAYS.map(function (x) { return "<span>" + x + "</span>"; }).join("") + '</div><div class="days">';
      for (var i = 0; i < first; i++) html += '<span class="blank"></span>';
      for (var d = 1; d <= days; d++) {
        var k = iso(cur.y, cur.m, d), cls = k === sel.a || k === sel.b ? "endpoint" : (sel.a && sel.b && k > sel.a && k < sel.b) ? "middle" : "";
        html += '<button type="button" data-d="' + k + '" class="' + cls + '" aria-label="' + d + " " + esc(monthName) + (k === sel.a ? "، الوصول" : k === sel.b ? "، المغادرة" : "") + '" aria-pressed="' + (k === sel.a || k === sel.b) + '"><span>' + d + "</span></button>";
      }
      var n = sel.a && sel.b ? daysBetween(sel.a, sel.b) : 0;
      var status = !sel.a ? "حدّد تاريخ الوصول" : !sel.b ? "الآن حدّد تاريخ المغادرة" : "الوصول " + fmtDate(sel.a) + " · المغادرة " + fmtDate(sel.b) + " · " + nightsWord(n);
      html += '</div></div><div class="cal-bottom">' + (invalid ? '<p class="error">' + Q.alert + esc(S.dates.invalid) + "</p>" : "") + "<p>" + esc(status) + '</p><div class="row between"><button type="button" class="primary calconfirm"' + (sel.a && sel.b ? "" : " disabled") + '>تأكيد التواريخ</button><span class="small muted">الوصول والمغادرة معًا</span></div></div>';
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
        if (state.checkIn === sel.a && state.checkOut === sel.b && c.classList.contains("used")) { var bot = box.querySelector(".cal-bottom .row"); bot.innerHTML = '<span class="chosen-tag">' + Q.check + "اعتُمدت التواريخ</span>"; }
      };
    }
    render();
    return c;
  };

  C.stayStrip = function (st) { return comp("stay", stayStrip(st), "cost-summary"); };

  /* summaries: Studio Confirmation Cards; the primary button carries the approval line the stage already accepts */
  function summary(st, withTransfers) {
    var t = B.transport, p;
    if (withTransfers) p = sConf({ image_url: "assets/site/resorts-hero-shebara.webp", badge_text: "الملخص المحدّث", main_title: clip(B.resort.name, 30), subtitle: villaTitle() + " · " + stayLine(st) + " · " + adultsWord(st.adults),
      primary_card_title: "الإقامة", primary_card_subtitle: money(B.rate.total), primary_card_icon: ICON("bed"),
      secondary_card_title: "المواصلات", secondary_card_subtitle: money(t.transfersTotal), secondary_card_icon: ICON("plane"),
      tertiary_card_title: "الإجمالي", tertiary_card_subtitle: money(B.grandTotal) + " · " + B.rate.taxNoteAr, tertiary_card_icon: ICON("credit-card"),
      instructions: "الإقامة والمواصلات · " + adultsWord(st.adults) + " · " + B.rate.taxNoteAr, primary_button_label: "اعتمد ونكمل", primary_button_payload: "اعتمد ونكمل", primary_button_icon: "check" });
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
    return studio("modes", "selection_list_picker", { main_title: "كيف ودكم توصلون للوجهة؟", lock_after_selection: true, items: B.transport.modes.map(function (m) { var w = S.words.modes[m] || m; return sItem({ title: clip(w, 30), icon: icons[m] || "", payload: S.customer.mode.replace("{modeWord}", w) }); }) },
      function (value, index) { var m = B.transport.modes[index]; if (m) act({ type: "mode", mode: m }, null); });
  };

  /* airports: Studio grouped list picker (multi-select with a send button). The Studio line
     "مطار الوصول: X, مطار المغادرة: Y" is the customer message; the adapter reads one airport per group. */
  C.airports = function () {
    var names = B.transport.airportsAr || {}, GA = "مطار الوصول", GD = "مطار المغادرة";
    function label(a) { return names[a] || a; }
    return studio("airports", "grouped_list_picker", { main_title: "من أي مطار بتوصلون وبتغادرون؟", send_button_label: "تأكيد المواصلات", lock_after_selection: true, is_multiple_selection: true, groups: [{ title: GA, options: B.transport.airports.map(label) }, { title: GD, options: B.transport.airports.map(label) }] },
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

  /* Icon-only markers: the sparkle for a field filled from the voice message,
     a chat mark for the first name remembered from the conversation. The
     meaning stays in the accessible name and tooltip. */
  var AI_MARK = '<span class="field-marker" role="img" aria-label="عُبّئ من رسالتك الصوتية" title="عُبّئ من رسالتك الصوتية">' + I.spark + "</span>";
  var PF_MARK = '<span class="field-marker saved" role="img" aria-label="من بياناتك المحفوظة" title="من بياناتك المحفوظة">' + I.user + "</span>";
  var FC_MARK = '<span class="field-marker chat" role="img" aria-label="محفوظ من المحادثة" title="محفوظ من المحادثة">' + I.chatMark + "</span>";
  function watchMark(l) {
    var c = l.querySelector("input, select, textarea");
    function clear() { l.classList.remove("ai"); var b = l.querySelector(".field-marker"); if (b) b.remove(); c.removeEventListener("input", clear); c.removeEventListener("change", clear); }
    c.addEventListener("input", clear); c.addEventListener("change", clear);
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
  function voiceSeed(st) {
    var seed = {}, forms = scroll.querySelectorAll(".rich:not(.used) form.guest-form:not(.edit)"), f = forms[forms.length - 1];
    if (f) { SEED_KEYS.forEach(function (k) { var c = f.elements[k]; if (c && String(c.value).trim()) seed[k] = String(c.value).trim(); }); if (f.elements.marketing && f.elements.marketing.checked) seed.marketing = true; }
    if (!seed.firstName && st.name) seed.firstName = st.name;
    Object.keys(st.voiceData || {}).forEach(function (k) { if (st.voiceData[k]) seed[k] = st.voiceData[k]; });
    return seed;
  }
  function arList(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join("، ") + " و" + a[a.length - 1]; }
  /* the acknowledgement names exactly the required fields that are still empty */
  function missingNames(seed) { return ["title", "firstName", "familyName", "email", "mobile"].filter(function (k) { return !seed[k]; }).map(function (k) { return S.words.fieldNames[k]; }); }
  function voiceReply(st) {
    var need = missingNames(st.formSeed);
    return [{ text: need.length ? S.voice.ack.replace("{missing}", arList(need)) : S.voice.ackComplete, component: "guestForm" }];
  }
  function voiceTurn(st, M) { st.voice = { seconds: M.seconds || 0 }; st.voiceData = extraction(); st.formSeed = voiceSeed(st); return { ok: true, next: "guest", reply: voiceReply(st) }; }
  /* returning customer: the form holds only what the server released for the verified e-mail, plus the first name
     known from this conversation; nothing is assumed (a wife's details appear only if the profile has them) */
  var PROFILE_KEYS = ["title", "firstName", "familyName", "mobileCode", "mobile", "guest2First", "guest2Family"];   /* special requests are never restored from a profile */
  function profileSeed(st) {
    var seed = {}, p = st.profile || {};
    PROFILE_KEYS.forEach(function (k) { if (p[k]) seed[k] = p[k]; });
    if (!seed.firstName && st.name) seed.firstName = st.name;
    seed.email = st.verifiedEmail;
    return seed;
  }
  function signedInTurn(st, M) {
    st.verifiedEmail = String(M.email || "").toLowerCase(); st.profile = M.profile || null; st.voiceData = null; st.formSeed = profileSeed(st);
    var text;
    if (st.profile) return { ok: true, next: "requests", reply: [{ text: S.account.askRequests }] };   /* ask first; the complete form follows the answer */
    text = M.status === "error" ? S.account.profileError : S.account.notFound;
    return { ok: true, next: "guest", reply: [{ text: text, component: "guestForm" }] };
  }
  /* verification status (verifiedEmail) is separate from the requirement: a code is needed only for an account
     holder whose booking e-mail is not the address verified in this conversation; a new guest never needs one */
  function needsOtp(st) { return st.authMode === "account" && (!st.guest || String(st.guest.email).toLowerCase() !== st.verifiedEmail); }
  /* Special requests are asked for, never assumed: a refusal leaves the field empty, an unclear answer gets one
     short clarification, anything else is the customer's own request (honoured subject to availability). */
  var YES_ONLY = ["نعم", "ايه", "اي", "ايوه", "اكيد", "yes", "ok", "اوكي", "تمام", "طيب", "ممكن", "عندي", "عندنا", "فيه", "في", "طلب", "طلبات", "خاص", "واحد"];
  var DECLINE = ["ما عندنا", "ما عندي", "ماعندنا", "ماعندي", "مافي", "ما في", "ولا شي", "ولا شيء", "بدون", "لا شكرا", "no thanks", "nothing", "none", "مو لازم", "ما نحتاج", "مانحتاج", "لا يوجد", "لا توجد", "كذا تمام", "كذا زين"];
  function requestAnswer(raw) {
    var t = norm(raw), toks = t.split(" ").filter(Boolean);
    if (!toks.length || has(t, ["مدري", "ما ادري", "مادري", "ما اعرف", "وش تقترح", "وش تنصح", "وش عندكم"])) return null;
    var asks = has(t, ["ابي", "ابغى", "نبي", "نبغى", "نحتاج", "ودي", "ودنا", "ياليت", "اتمنى", "نتمنى", "بس", "لكن", "لو"]);
    if (!asks && (toks[0] === "لا" || toks[0] === "no" || has(t, DECLINE)) && toks.length <= 6) return "";
    if (toks.every(function (w) { return YES_ONLY.indexOf(w) >= 0; })) return null;     /* "نعم" or "عندي طلب" without saying what it is */
    var cleaned = String(raw).trim().replace(/^(نعم|ايه|إيه|أيوه|ايوه|أكيد|اكيد|طيب)[\s،,:.!-]+/, "").trim();
    return cleaned || null;
  }
  function asksCompare(t) { return has(t, ["شباره", "شيباره", "shebara"]) && has(t, ["ديزرت", "ديزيرت", "desert rock", "desertrock"]); }
  C.guestForm = function (st) {
    var vd = st.formSeed || {}, ex = st.formSeed ? st.voiceData || {} : {}, pf = st.profile || {}, gf = B.guestForm, first = vd.firstName || st.name, id = ++formSeq;
    retireGuestForms();
    function mk(k) { return ex[k] && ex[k] === vd[k] ? AI_MARK : pf[k] && pf[k] === vd[k] ? PF_MARK : ""; }   /* voice-extracted and saved-profile values carry different markers */
    function opt(list, selected) { return list.map(function (x) { return "<option" + (x === selected ? " selected" : "") + ">" + esc(x) + "</option>"; }).join(""); }
    function val(k) { return vd && vd[k] ? esc(vd[k]) : ""; }
    function fld(cls, label, control, badge) { return '<label class="field' + (cls ? " " + cls : "") + (badge ? " ai" : "") + '"><span class="field-label">' + label + (badge || "") + "</span>" + control + "</label>"; }
    var c = comp("guest", "", "guest-form"), box = c.firstChild;
    var form = h("form", { "class": "guest-form", "data-form-id": String(id), novalidate: "", html:
      "<header><h3>بيانات الضيوف</h3>" + Q.user + "</header>" +
      '<div class="subheading" style="border-top:0;padding-top:0;margin-top:0">الضيف الرئيسي</div><div class="guest-name-grid">' +
      fld("", "اللقب *", '<select name="title" required><option value="">اختر</option>' + opt(gf.titles, vd.title) + "</select>", mk("title")) +
      fld("", "الاسم الأول *", '<input name="firstName" required value="' + esc(first) + '" autocomplete="given-name">', pf.firstName && pf.firstName === first ? PF_MARK : first && first === st.name ? FC_MARK : "") +
      fld("", "اسم العائلة *", '<input name="familyName" required value="' + val("familyName") + '" autocomplete="family-name">', mk("familyName")) + "</div>" +
      '<div style="margin-top:10px">' + fld("", "البريد الإلكتروني *", '<input name="email" type="email" required value="' + val("email") + '" autocomplete="email" inputmode="email" dir="ltr">', "") + "</div>" +
      '<div class="phone-grid" style="margin-top:10px">' + fld("", "رمز الدولة *", '<select name="mobileCode" dir="ltr">' + opt(gf.countryCodes, (vd && vd.mobileCode) || gf.defaultCountryCode) + "</select>", mk("mobileCode")) +
      fld("", "رقم الجوال *", '<input name="mobile" required value="' + val("mobile") + '" type="tel" inputmode="tel" autocomplete="tel-national" dir="ltr">', mk("mobile")) + "</div>" +
      '<div class="subheading">الضيف الثاني <span class="muted">· اختياري</span></div><div class="form-grid">' +
      fld("", "الاسم الأول", '<input name="guest2First" value="' + val("guest2First") + '" autocomplete="off">', mk("guest2First")) +
      fld("", "اسم العائلة", '<input name="guest2Family" value="' + val("guest2Family") + '" autocomplete="off">', mk("guest2Family")) + "</div>" +
      '<div class="subheading">معلومات إضافية</div>' +
      fld("", 'طلبات أخرى <span class="muted">· اختياري</span>', '<textarea name="requests" rows="2" maxlength="200" placeholder="اكتب طلبك هنا">' + val("requests") + "</textarea>", mk("requests")) +
      '<label class="check-label"><input type="checkbox" name="marketing"' + (vd.marketing ? " checked" : "") + '><span>أرغب في استلام آخر التحديثات والعروض الحصرية والمحتوى المخصص.</span></label>' +
      '<p class="legal">بإرسال هذا النموذج تؤكد أنك قرأت ووافقت على <a href="' + esc(B.legal.termsUrl) + '" target="_blank" rel="noopener noreferrer">الشروط والأحكام</a> و<a href="' + esc(B.legal.privacyUrl) + '" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a></p>' +
      '<div class="form-error error" role="alert" aria-live="polite"></div><button type="submit" class="primary full">إرسال البيانات</button>' });
    /* a manual change removes the marker: the value no longer comes unchanged from extraction */
    form.querySelectorAll(".field.ai").forEach(watchMark);
    form.addEventListener("submit", function (e) {
      e.preventDefault(); if (c.classList.contains("used")) return;
      var f = form.elements, errs = [];
      form.querySelectorAll(".field").forEach(function (l) { l.classList.remove("invalid"); });
      function bad(name, msg) { errs.push(msg); form.elements[name].closest(".field").classList.add("invalid"); }
      if (!f.title.value) bad("title", "اللقب مطلوب.");
      if (!f.firstName.value.trim()) bad("firstName", "الاسم الأول مطلوب.");
      if (!f.familyName.value.trim()) bad("familyName", "اسم العائلة مطلوب.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) bad("email", "أدخل بريدًا إلكترونيًا صحيحًا.");
      if (!/^\d[\d\s]{6,14}$/.test(f.mobile.value.trim())) bad("mobile", "أدخل رقم جوال صحيحًا.");
      var err = form.querySelector(".form-error"); err.innerHTML = errs.length ? Q.alert + esc(errs.join(" ")) : "";
      if (errs.length) return;
      var data = { title: f.title.value, firstName: f.firstName.value.trim(), familyName: f.familyName.value.trim(), email: f.email.value.trim(), mobileCode: f.mobileCode.value, mobile: f.mobile.value.trim(), guest2First: f.guest2First.value.trim(), guest2Family: f.guest2Family.value.trim(), requests: f.requests.value.trim(), marketing: f.marketing.checked };
      act({ type: "guest", data: data }, null);
    });
    box.appendChild(form);
    return c;
  };

  /* final review: Studio Confirmation Card; the approval is its primary button, the consent wording and links stay in the RSG aside */
  C.review = function (st) {
    var g = st.guest, t = B.transport;
    var p = sConf({ image_url: B.villa.terraceImage, badge_text: "مراجعة نهائية", main_title: clip(B.resort.name, 30), subtitle: villaTitle() + " · " + B.rate.name + " · " + stayLine(st) + " · " + adultsWord(st.adults) + " · " + airportsLine(st),
      primary_card_title: "الضيوف", primary_card_subtitle: clip(guestsLine(st, " · "), 150), primary_card_icon: ICON("users"),
      secondary_card_title: "المواصلات", secondary_card_subtitle: transfersLine(), secondary_card_icon: ICON("plane"),
      tertiary_card_title: "التواصل", tertiary_card_subtitle: iso(g.email) + "\n" + iso(g.mobileCode + " " + g.mobile), tertiary_card_icon: ICON("mail"),
      instructions: withRequest("الإجمالي " + money(B.grandTotal) + " · " + B.rate.taxNoteAr + " · الإقامة " + money(B.rate.total) + " + المواصلات " + money(t.transfersTotal) + " · لم تُضف أنشطة", st),
      primary_button_label: "موافق على الشروط، نكمل", primary_button_payload: "موافق على الشروط، نكمل", primary_button_icon: "check" });
    var c = studio("review", "confirmation_card", p, function (value) { act({ type: "confirm" }, value); });
    requestNote(c, st);
    aside(c, "<p>النشرة البريدية: " + (g.marketing ? "مشترك" : "غير مشترك") + '</p><p class="legal">بتأكيدك توافق على <a href="' + esc(B.legal.termsUrl) + '" target="_blank" rel="noopener noreferrer">الشروط والأحكام</a> و<a href="' + esc(B.legal.privacyUrl) + '" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a>.</p>');
    return c;
  };

  /* E-mail verification: the code is generated, e-mailed and checked by
     server.py on the same origin. Nothing is accepted locally. The card
     first checks /api/otp/status so the customer sees exactly what is
     missing (file:// origin, static server, no mail settings) before a
     code is requested. Customer lines are Arabic; the smaller diagnostic
     line is for the project team. */
  var FILE_ORIGIN = location.protocol === "file:";
  /* opts.signin: the returning-customer sign-in. The customer types (and may correct) the e-mail; only after the
     server verifies the code does it release the saved profile, through a session bound to that e-mail. */
  C.verify = function (st, opts) {
    var signin = !!(opts && opts.signin);
    function mask(e) { return e ? e.slice(0, 2) + "••••••" + e.slice(e.indexOf("@") - 1) : ""; }
    var email = signin ? (st.loginEmail || "") : st.guest.email, masked = mask(email);
    var c = comp("otp", "<header><h3>" + (signin ? "الدخول بحسابك" : "تحقق من بريدك الإلكتروني") + "</h3>" + Q.mail + '</header><p class="muted">' + (signin ? "اكتب بريدك الإلكتروني المسجّل، ونرسل لك رمزًا من 6 أرقام يبقى صالحًا لمدة 5 دقائق." : "سنرسل رمزًا من 6 أرقام إلى بريدك. يبقى الرمز صالحًا لمدة 5 دقائق.") + "</p>" +
      (signin ? '<label class="field vemail" style="margin:10px 0"><span class="field-label">البريد الإلكتروني *</span><input name="loginEmail" type="email" dir="ltr" autocomplete="email" inputmode="email" value="' + esc(email) + '"></label>' : "") +
      '<div class="otp-email"' + (signin ? " hidden" : "") + ">" + ltr(masked) + "</div>" +
      '<button type="button" class="primary full vsend" disabled>إرسال الرمز</button>' +
      '<form class="vform" novalidate hidden><div class="otp-boxes">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<input maxlength="1" inputmode="numeric" pattern="[0-9]" aria-label="الرقم ' + (i + 1) + ' من رمز التحقق" autocomplete="' + (i === 0 ? "one-time-code" : "off") + '" placeholder="–">'; }).join("") + '</div><button type="submit" class="primary full">تحقق</button></form>' +
      '<div class="vstatus" aria-live="polite"></div><div class="row between"><button type="button" class="text-action vresend" hidden>إرسال رمز جديد</button><button type="button" class="text-action vchange" hidden>تغيير البريد</button><button type="button" class="text-action vcheck" hidden>تحقق مرة أخرى</button></div><div class="form-error error" role="alert" aria-live="polite"></div><div class="vdiag" dir="ltr"></div>', "otp");
    var box = c.firstChild, sendB = box.querySelector(".vsend"), form = box.querySelector("form"), status = box.querySelector(".vstatus"), resend = box.querySelector(".vresend"),
      err = box.querySelector(".form-error"), diag = box.querySelector(".vdiag"), check = box.querySelector(".vcheck"), inputs = form.querySelectorAll(".otp-boxes input"),
      change = box.querySelector(".vchange"), emailIn = box.querySelector(".vemail input"), emailBox = box.querySelector(".otp-email");
    var inflight = false, cooldown = 0;
    var ORIGIN_HELP = "Run start.cmd (or: python server.py) in the project folder and open the address it prints, normally http://127.0.0.1:8080/.";
    var MSG = {
      file_origin: ["فُتحت هذه الصفحة كملف، لذلك يتعذّر الوصول إلى خدمة التحقق.", ORIGIN_HELP],
      unreachable: ["خدمة التحقق لا تعمل على هذا العنوان.", ORIGIN_HELP],
      static_server: ["هذا العنوان يقدّمه خادم ملفات بسيط لا يحتوي على خدمة التحقق.", "Stop it and " + ORIGIN_HELP.charAt(0).toLowerCase() + ORIGIN_HELP.slice(1)],
      email_not_configured: ["إرسال البريد الإلكتروني غير مهيّأ على الخادم بعد، لذلك لا يمكن إرسال الرمز.", "Set OTP_SMTP_HOST, OTP_SMTP_USER, OTP_SMTP_PASSWORD and OTP_SMTP_FROM in .env (see .env.example) and restart server.py."],
      recipient_not_allowed: ["لا يمكن إرسال رسائل التحقق إلا إلى العنوان المعتمد لهذا الحجز.", "OTP_ALLOWED_RECIPIENTS on the server lists the approved address."],
      invalid_email: ["أدخل بريدًا إلكترونيًا صحيحًا في النموذج أعلاه.", ""],
      cooldown: ["يرجى الانتظار قليلًا قبل طلب رمز آخر.", ""],
      send_failed: ["تعذّر تسليم الرسالة إلى مزوّد البريد.", ""],
      bad_response: ["أجابت الخدمة بطريقة غير متوقعة.", "The response was not the verification API's JSON. Check that server.py is the program listening on this port."]
    };
    var REASON = { auth: "SMTP authentication was refused: check OTP_SMTP_USER and OTP_SMTP_PASSWORD.", connect: "The SMTP host could not be reached: check OTP_SMTP_HOST and OTP_SMTP_PORT.", tls: "The TLS handshake with the SMTP host failed: check OTP_SMTP_SECURITY (starttls, ssl or none) and the port.", sender_refused: "The provider refused the sender address in OTP_SMTP_FROM.", recipient_refused: "The provider refused the recipient address.", smtp: "The provider returned an SMTP error.", other: "An unexpected error occurred while sending." };
    function show(key, extra) { var m = MSG[key] || ["تعذّر إرسال الرمز.", ""]; err.innerHTML = Q.alert + esc(m[0]); diag.textContent = ((m[1] || "") + (extra ? " " + extra : "")).trim(); }
    function fail(text) { err.innerHTML = Q.alert + esc(text); }
    function clearMsgs() { err.textContent = ""; diag.textContent = ""; }
    function codeValue() { return Array.prototype.map.call(inputs, function (x) { return x.value; }).join(""); }
    function clearCode() { inputs.forEach(function (x) { x.value = ""; }); }
    function api(method, path, body) {
      var opts = { method: method, headers: { "Accept": "application/json" } };
      if (body) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
      return fetch(path, opts).then(function (r) {
        var ct = r.headers.get("content-type") || "";
        if (ct.indexOf("application/json") < 0) return { kind: r.status === 404 || r.status === 501 ? "static_server" : "bad_response", status: r.status, body: {} };
        return r.json().then(function (b) { return { kind: "json", ok: r.ok, status: r.status, body: b || {} }; }, function () { return { kind: "bad_response", status: r.status, body: {} }; });
      }, function () { return { kind: "unreachable", status: 0, body: {} }; });
    }
    /* readiness: exact state before anything is sent */
    function probe() {
      clearMsgs(); sendB.disabled = true; check.hidden = true;
      if (FILE_ORIGIN) { show("file_origin"); check.hidden = true; return; }
      status.textContent = "جارٍ التحقق من جاهزية خدمة التحقق…";
      api("GET", "/api/otp/status").then(function (r) {
        status.textContent = "";
        if (r.kind !== "json" || r.body.service !== "otp") { show(r.kind === "json" ? "bad_response" : r.kind); check.hidden = false; return; }
        if (!r.body.configured) {
          var missing = ["smtpHost", "smtpUser", "smtpPassword", "sender"].filter(function (k) { return !r.body[k]; }).map(function (k) { return { smtpHost: "OTP_SMTP_HOST", smtpUser: "OTP_SMTP_USER", smtpPassword: "OTP_SMTP_PASSWORD", sender: "OTP_SMTP_FROM" }[k]; });
          show("email_not_configured", missing.length ? "Missing: " + missing.join(", ") + "." : ""); check.hidden = false; return;
        }
        sendB.disabled = c.classList.contains("used");
      });
    }
    function startCooldown(sec) {
      cooldown = sec; resend.hidden = false; resend.disabled = true;
      (function tickC() { if (c.classList.contains("used")) return; if (cooldown <= 0) { resend.disabled = false; resend.textContent = "إرسال رمز جديد"; return; } resend.textContent = "إرسال رمز جديد (" + cooldown + " ث)"; cooldown--; later(tickC, 1000); })();
    }
    function request() {
      if (inflight || c.classList.contains("used") || FILE_ORIGIN) return;
      inflight = true; sendB.disabled = true; resend.disabled = true; clearMsgs(); status.textContent = "جارٍ الإرسال…";
      api("POST", "/api/otp/request", { email: email }).then(function (r) {
        inflight = false;
        if (r.kind === "json" && r.ok && r.body.challengeId) {
          st.otp = { challengeId: r.body.challengeId, email: email };
          sendB.hidden = true; form.hidden = false; clearCode(); inputs[0].focus();
          if (signin) { emailIn.readOnly = true; change.hidden = false; emailBox.innerHTML = ltr(masked); emailBox.hidden = false; }
          status.innerHTML = "قبل مزوّد البريد الرسالة الموجّهة إلى " + ltr(masked) + ". تحقق من صندوق الوارد، ومن مجلد الرسائل غير المرغوبة إذا لم تصل خلال دقيقة.";
          startCooldown(r.body.resendAfterSec || 30); return;
        }
        sendB.disabled = false; status.textContent = "";
        if (r.kind !== "json") { show(r.kind); check.hidden = false; return; }
        var e = r.body.error;
        show(e, e === "send_failed" ? (REASON[r.body.reason] || REASON.other) : "");
        if (e === "cooldown") startCooldown(r.body.retryAfterSec || 30);
        if (e === "email_not_configured") check.hidden = false;
      });
    }
    function startSignin() {
      var v = emailIn.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { fail("أدخل بريدًا إلكترونيًا صحيحًا."); emailIn.focus(); return; }
      email = v; st.loginEmail = v; masked = mask(v); request();
    }
    /* correct the address: back to the e-mail field; the new address is verified from scratch */
    change.addEventListener("click", function () {
      if (inflight || c.classList.contains("used")) return;
      st.otp = null; form.hidden = true; sendB.hidden = false; sendB.disabled = false; change.hidden = true; resend.hidden = true; emailBox.hidden = true;
      emailIn.readOnly = false; status.textContent = ""; clearMsgs(); clearCode(); emailIn.focus();
    });
    /* returning customer: the profile is requested with the session the server issued for this verified e-mail */
    function signedIn(session) {
      api("POST", "/api/profile", { session: session }).then(function (r) {
        var ok = r.kind === "json" && r.ok;
        if (!ok) console.warn("profile", r.kind, r.status); else if (!r.body.store) console.warn("profile store: not connected");
        act({ type: "signedIn", email: email, profile: ok && r.body.found ? r.body.profile : null, status: !ok ? "error" : r.body.found ? "found" : "none" }, null);
      });
    }
    sendB.addEventListener("click", signin ? startSignin : request); resend.addEventListener("click", request); check.addEventListener("click", probe);
    inputs.forEach(function (inp, i) {
      inp.addEventListener("input", function () { inp.value = inp.value.replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); }).replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); }).replace(/\D/g, "").slice(-1); if (inp.value && inputs[i + 1]) inputs[i + 1].focus(); });
      inp.addEventListener("keydown", function (e) { if (e.key === "Backspace" && !inp.value && inputs[i - 1]) inputs[i - 1].focus(); });
      inp.addEventListener("paste", function (e) { var t = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, ""); if (t.length >= 2) { e.preventDefault(); inputs.forEach(function (x, j) { x.value = t[j] || ""; }); inputs[Math.min(t.length, 5)].focus(); } });
    });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault(); if (inflight || c.classList.contains("used") || !st.otp) return;
      var code = codeValue();
      if (!/^\d{6}$/.test(code)) { fail("أدخل الرمز المكوّن من 6 أرقام الوارد في البريد."); return; }
      var vb = form.querySelector("button"); inflight = true; clearMsgs(); vb.disabled = true;
      api("POST", "/api/otp/verify", { challengeId: st.otp.challengeId, email: email, code: code }).then(function (r) {
        inflight = false; vb.disabled = false;
        if (r.kind === "json" && r.ok && r.body.verified) { status.innerHTML = '<span class="status-message success">' + Q.circleCheck + "تم التحقق.</span>"; if (signin) { change.hidden = true; signedIn(r.body.session); } else act({ type: "verify" }, null); return; }
        if (r.kind !== "json") { show(r.kind); return; }
        var e = r.body.error;
        box.querySelector(".otp-boxes").classList.toggle("invalid", true);
        fail(e === "wrong" ? "الرمز غير صحيح." + (r.body.attemptsLeft ? " تبقّت " + r.body.attemptsLeft + " محاولات." : "")
          : (e === "expired" || e === "consumed") ? "انتهت صلاحية هذا الرمز. اطلب رمزًا جديدًا."
          : e === "locked" ? "محاولات كثيرة. اطلب رمزًا جديدًا."
          : "تعذّر التحقق من الرمز. اطلب رمزًا جديدًا.");
        if (e !== "wrong") { resend.hidden = false; resend.disabled = cooldown > 0; }
      });
    });
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

  /* payment hand-off: Studio Confirmation Card. Its button sends the payload as the customer line; the adapter
     opens the official checkout in a new tab and starts the five-second timer. The button stays reachable. */
  C.payment = function (st) {
    var c = studio("payment", "confirmation_card", sConf({ image_url: B.villa.terraceImage, badge_text: "visitredsea.com", main_title: "المبلغ المطلوب دفعه", subtitle: money(B.grandTotal) + " · " + B.rate.taxNoteAr,
      primary_card_title: "المنتجع", primary_card_subtitle: B.resort.name, primary_card_icon: ICON("hotel"),
      secondary_card_title: "الفيلا", secondary_card_subtitle: villaTitle(), secondary_card_icon: ICON("bed"),
      tertiary_card_title: "التواريخ", tertiary_card_subtitle: st.checkInLabel + " – " + st.checkOutLabel + " · " + adultsWord(st.adults), tertiary_card_icon: ICON("calendar"),
      instructions: "دفع آمن على visitredsea.com", primary_button_label: "المتابعة إلى الدفع", primary_button_payload: "المتابعة إلى الدفع على Visit Red Sea", primary_button_icon: "lock" }),
      function (value) {
        window.open(B.checkoutUrl, "_blank", "noopener");
        if (state.paymentClickedAt) return;                                  /* a later press only reopens the checkout */
        addMsg("guest", fill(value.replace("Visit Red Sea", "{{Visit Red Sea}}"), state)); scrollToEnd();
        startPaymentTimer();
      }, true);
    c.querySelector(".bc-btn--primary").setAttribute("data-keep", "");
    return c;
  };

  /* final confirmation: Studio Confirmation Card; تحميل PDF builds the same PDF and does not echo a customer line */
  C.confirmation = function (st) {
    var g = st.guest, pdfBusy = false, status;
    var c = studio("confirmation", "confirmation_card", sConf({ image_url: B.resort.image, badge_text: "تم تأكيد الحجز", main_title: clip(B.resort.name, 30), subtitle: villaTitle() + " · " + B.rate.name + " · " + stayLine(st) + " · " + airportsLine(st),
      primary_card_title: "الضيوف", primary_card_subtitle: clip(guestsLine(st, " و") + " · " + adultsWord(st.adults), 150), primary_card_icon: ICON("users"),
      secondary_card_title: "المواصلات", secondary_card_subtitle: transfersLine(), secondary_card_icon: ICON("plane"),
      tertiary_card_title: "التواصل", tertiary_card_subtitle: iso(g.email) + "\n" + iso(g.mobileCode + " " + g.mobile), tertiary_card_icon: ICON("mail"),
      instructions: withRequest("الإجمالي المدفوع " + money(B.grandTotal) + " · " + B.rate.taxNoteAr + " · لم تُحجز أنشطة", st),
      primary_button_label: "تحميل PDF", primary_button_payload: "تحميل PDF", primary_button_icon: "download" }),
      function () {
        if (pdfBusy) return; pdfBusy = true; status.textContent = "جارٍ تجهيز ملف PDF…";
        window.BookingPdf.make(st, B).then(function (blob) { window.BookingPdf.download(blob, B.resort.name + "_Booking_Summary_" + st.checkIn + ".pdf"); status.textContent = "تم التحميل."; pdfBusy = false; })
          .catch(function () { status.textContent = "تعذّر تجهيز الملف. حاول مرة أخرى."; pdfBusy = false; });
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
     customer message and runs the normal act() → stageSpec() transition. */
  C.quick = function (st, choices) {
    var c = h("div", { "class": "rich quick", "data-stage": st.stage, role: "group", "aria-label": "ردود مقترحة" }), host = h("div", { "class": "rc-container", dir: "rtl" });
    scroll.querySelectorAll(".rich.quick:not(.used)").forEach(consume);          /* only the latest group stays live */
    var rendered = EmpathyStudio.renderRichMessage([{ type: "buttons", payload: { text: "", buttons: choices.map(function (ch) { return { label: ch.label, value: ch.label }; }) } }], studioRegistry, function (value, index) {
      var ch = choices[index];
      if (!ch || c.classList.contains("used") || busy || c.getAttribute("data-stage") !== state.stage) return;
      var q = QUICK[ch.id]; if (!q || q.stages.indexOf(state.stage) < 0) return;
      consume(c);
      act(q.meta(), q.text ? q.text() : ch.label);
    });
    host.appendChild(rendered.firstChild); c.appendChild(host);
    c.querySelectorAll(".rc-btn").forEach(function (b, i) { b.setAttribute("data-id", choices[i].id); });
    return c;
  };

  /* ---------- page: Resorts section hand-off ---------- */
  /* Height of any header that stays on screen while scrolling (none on this page: the header is absolute) */
  function stickyHeaderHeight() {
    var hd = document.querySelector(".site-header"); if (!hd) return 0;
    var pos = getComputedStyle(hd).position;
    return pos === "fixed" || pos === "sticky" ? hd.getBoundingClientRect().height : 0;
  }
  /* Scroll so the resort cards themselves (images, names and Choose) fill the viewport */
  function scrollToCards(behavior) {
    var card = rail.querySelector(".rcard") || rail, r = card.getBoundingClientRect();
    var top = r.top + window.scrollY, hdr = stickyHeaderHeight() + (document.getElementById("choose-status") ? STATUS_H : 0), vh = window.innerHeight, gap = 16;
    var y = top - hdr - gap;
    if (r.height + hdr + 2 * gap > vh) y = top + r.height + gap - vh;      /* tall card: keep the Choose row on screen */
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: behavior });
  }
  var STATUS_H = 44;
  function showChooseStatus() {
    if (document.getElementById("choose-status")) return;
    document.body.appendChild(h("div", { id: "choose-status", lang: "ar", dir: "rtl", role: "status", html: I.spark + "<span>بانتظار اختيارك للمنتجع</span>" }));
  }
  function hideChooseStatus() { var el = document.getElementById("choose-status"); if (el) el.remove(); }
  function revealChoose() {
    document.body.classList.add("choose-stage");
    resortsSection.classList.add("is-highlighted");
    showChooseStatus();
    minimize();
    /* measure after the Choose buttons and the minimised chat have laid out */
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      scrollToCards(reduced ? "auto" : "smooth");
      var lastY = -1, stable = 0, tries = 0;
      (function settle() {
        later(function () {
          tries++; if (window.scrollY === lastY) stable++; else { stable = 0; lastY = window.scrollY; }
          if (stable >= 2 || tries > 25) {
            if (!document.body.classList.contains("choose-stage") || !window.ResortSpotlight) return;
            scrollToCards("auto");                                       /* final alignment once images and layout settled */
            window.ResortSpotlight.run(Array.prototype.slice.call(rail.querySelectorAll(".rcard")), { dwell: 1800 });
          } else settle();
        }, 120);
      })();
    }); });
  }
  function endChoose() { document.body.classList.remove("choose-stage"); resortsSection.classList.remove("is-highlighted"); hideChooseStatus(); if (window.ResortSpotlight) window.ResortSpotlight.stop(); }
  function minimize() { document.body.classList.add("chat-min"); panel.hidden = true; miniBar.hidden = false; }
  function restore() { document.body.classList.remove("chat-min"); miniBar.hidden = true; open(); }
  miniBar.addEventListener("click", function () { restore(); });

  /* ---------- engine ---------- */
  var APPROVE = ["تمام", "موافق", "مناسب", "اوكي", "اوك", "ok", "okay", "نعم", "ايه", "ايوه", "اي", "كمل", "نكمل", "ماشي", "زين", "مضبوط", "اكيد", "ابشر", "يصير", "يصلح", "اعتمد", "وافق", "ممتاز", "جميل", "حلو", "يس", "yes", "تم"];
  /* Quick replies: stable ids, the stages they are valid in, and the engine action they resolve to.
     Labels live in data/script.js. Typed answers keep their own matching below. */
  var QUICK = {
    resort_shebara: { stages: ["resort"], meta: function () { return { type: "resort", name: "Shebara" }; } },
    villa_supported: { stages: ["villa"], meta: function () { return { type: "villa", villa: B.villa.name }; }, text: function () { return S.customer.villa.replace("{{{villa}}}", "{{" + B.villa.name + "}}"); } },
    dates_supported: { stages: ["dates"], meta: function () { return { type: "dates", a: B.stay.checkIn, b: B.stay.checkOut }; } },
    approve1_ok: { stages: ["approve1"], meta: function () { return { type: "approve" }; } },
    mode_plane: { stages: ["mode"], meta: function () { return { type: "mode", mode: B.transport.supportedMode }; } },
    airports_supported: { stages: ["airports"], meta: function () { return { type: "airports", arrival: B.transport.arrivalAirport, departure: B.transport.departureAirport, flight: {} }; } },
    approve2_ok: { stages: ["approve2"], meta: function () { return { type: "approve" }; } },
    activities_defer: { stages: ["activities"], meta: function () { return { type: "defer" }; } },
    review_confirm: { stages: ["review"], meta: function () { return { type: "confirm" }; } }
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
        if (asksCompare(t)) return { ok: true, next: "resort", reply: S.compare.ok };   /* undecided between Shebara and Desert Rock: compare in the chat */
        if (has(t, ["منتجع", "منتجعات", "اجازه", "اجازة", "رحله", "رحلة", "resort", "resorts", "اقامه", "اقامة", "نبي نروح", "فندق", "فنادق", "اشوف", "استكشف"])) return { ok: true, next: "resort", reply: S.intent.ok, after: revealChoose };
        return { ok: false, reply: S.intent.fallback };
      case "resort": {
        if (M.type !== "resort" && asksCompare(t)) return { ok: false, reply: S.compare.ok };
        var r = M.type === "resort" ? ALL_RESORTS.filter(function (x) { return x.name === M.name; })[0] : matchResort(t);
        if (!r) return { ok: false, reply: S.resort.fallback };
        st.resort = r; st.resortName = r.name;
        if (r.id === "shebara" || r.name === "Shebara") return { ok: true, next: "villa", reply: S.resort.ok, after: endChoose };
        return { ok: false, reply: S.resort.other, after: showChooseStatus };     /* still choosing: the page status returns */
      }
      case "villa": {
        var vn = M.type === "villa" ? M.villa : matchVilla(t);
        if (!vn) return { ok: false, reply: S.villa.fallback };
        st.villaName = vn;
        if (vn === B.villa.name) { st.rateName = B.rate.name; return { ok: true, next: "party", reply: S.villa.ok }; }
        return { ok: false, reply: S.villa.other };
      }
      case "party":
        if (has(t, ["زوجتي", "زوجه", "اثنين", "شخصين", "نفرين", "بس انا", "فقط", "احنا الاثنين", "2", "ثنين", "انا وزوجتي", "لا احد", "ما في احد", "محد"])) { st.adults = 2; st.children = 0; return { ok: true, next: "dates", reply: S.party.ok }; }
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
      case "approve1": if (M.type === "approve" || has(t, APPROVE)) return { ok: true, next: "mode", reply: S.approve1.ok }; return { ok: false, reply: S.approve1.fallback };
      case "mode": {
        var mode = M.type === "mode" ? M.mode : matchMode(t);
        if (!mode) return { ok: false, reply: S.mode.fallback };
        st.mode = mode;
        if (mode === B.transport.supportedMode) return { ok: true, next: "airports", reply: S.mode.ok };
        return { ok: false, reply: S.mode.other };
      }
      case "airports": {
        if (M.type === "airportsBad") return { ok: false, reply: S.airports.fallback };
        var ar = M.type === "airports" ? M.arrival : (has(t, ["ينبع", "yanbu"]) ? B.transport.arrivalAirport : ""), dp = M.type === "airports" ? M.departure : (has(t, ["البحر الاحمر", "الدولي", "rsia", "red sea international"]) ? B.transport.departureAirport : "");
        if (!ar || !dp) return { ok: false, reply: S.airports.fallback };
        st.arrivalAirport = ar; st.departureAirport = dp; st.flight = M.flight || {};
        if (ar === B.transport.arrivalAirport && dp === B.transport.departureAirport) return { ok: true, next: "approve2", reply: S.airports.ok };
        return { ok: false, reply: S.airports.other };
      }
      case "approve2": if (M.type === "approve" || has(t, APPROVE)) return { ok: true, next: "activities", reply: S.approve2.ok }; return { ok: false, reply: S.approve2.fallback };
      case "activities":
        if (M.type === "defer" || has(t, ["بعد ما نوصل", "بعدين", "لاحقا", "نقرر", "مو الحين", "مب الحين", "لا", "خلنا", "later", "no", "مو ضروري", "بعد الوصول"])) return { ok: true, next: "account", reply: S.activities.ok };
        if (has(t, ["اضف", "ضيف", "ابغى", "ابي", "نعم", "yes"])) return { ok: false, reply: S.activities.add };
        return { ok: false, reply: S.activities.fallback };
      case "account": {                                                 /* returning customer or new guest */
        var how = M.type === "account" ? M.mode : M.type === "voice" ? "guest" : has(t, ["حساب", "سجلت", "مسجل", "دخول", "ادخل"]) ? "account" : has(t, ["ضيف", "جديد", "اول مره"]) ? "guest" : "";
        if (!how) return { ok: false, reply: S.account.fallback };
        st.authMode = how;
        if (how === "account") return { ok: true, next: "login", reply: S.account.login };
        if (M.type === "voice") return voiceTurn(st, M);
        return { ok: true, next: "voice", reply: S.account.guest };
      }
      case "login":
        if (M.type === "signedIn") return signedInTurn(st, M);              /* only after server.py verified the code and released the profile */
        if (has(t, ["ضيف", "جديد"])) { st.authMode = "guest"; return { ok: true, next: "voice", reply: S.account.guest }; }
        return { ok: false, reply: S.account.loginFallback };
      case "requests": {                                                /* returning customer: an optional request, then the complete form */
        var req = requestAnswer(text);
        if (req === null) return { ok: false, reply: S.account.requestsClarify };
        st.formSeed = profileSeed(st); if (req) st.formSeed.requests = req;
        var stillNeed = missingNames(st.formSeed);
        var ready = (req ? S.account.readyWithRequest : S.account.readyNoRequest) + (stillNeed.length ? " " + S.account.stillMissing.replace("{missing}", arList(stillNeed)) : "");
        return { ok: true, next: "guest", reply: [{ text: ready, component: "guestForm" }] };
      }
      case "voice":
      case "guest":
        if (M.type === "voice") return voiceTurn(st, M);
        if (M.type === "guest") { st.guest = M.data; return { ok: true, next: "review", reply: S.guest.ok }; }
        return { ok: false, reply: S.voice.fallback };
      case "review": if (M.type === "confirm" || has(t, APPROVE)) return needsOtp(st) ? { ok: true, next: "verify", reply: S.review.verifyNew } : { ok: true, next: "payment", reply: S.review.ok }; return { ok: false, reply: S.review.fallback };
      case "verify":
        if (M.type === "verify") { st.verifiedEmail = String(st.guest.email).toLowerCase(); return { ok: true, next: "payment", reply: S.verify.ok }; }   /* only after server.py confirmed the code */
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
    var i = 0, first = true, quick = !!(opts && opts.quickFirst), pendingQuick = null;
    function nextItem() {
      if (i >= items.length) {                          /* quick replies come after the whole turn: every message and component */
        if (pendingQuick) { addComponent(C.quick(state, pendingQuick)); scrollToEnd(); }
        done(); return;
      }
      var it = items[i++]; if (typeof it === "string") it = { text: it };
      if (!it.text) {                                   /* a component attached to the previous message */
        if (it.component && C[it.component]) addComponent(C[it.component](state));
        if (it.quick) pendingQuick = it.quick;
        scrollToEnd(); nextItem(); return;
      }
      var gap = reduced ? 0 : (first ? (quick ? 150 : jitter(350, 700)) : jitter(900, 1800));
      var typing = reduced ? 0 : (first && quick ? 700 : typingTime(it.text));
      first = false;
      later(function () {
        showTyping();
        later(function () {
          hideTyping();
          addMsg("agent", fill(it.text, state));
          if (it.component && C[it.component]) addComponent(C[it.component](state));
          if (it.quick) pendingQuick = it.quick;
          scrollToEnd();
          nextItem();
        }, typing);
      }, gap);
    }
    nextItem();
  }

  function customer(text, meta) {
    if (busy) return; busy = true; sendBtn.disabled = true; scroll.classList.add("busy");
    if (meta && meta.type === "voice") addVoiceMsg(meta.url, meta.seconds); else addMsg("guest", fill(text, state));
    scrollToEnd();
    var res = stageSpec(text, meta);
    var replies = Array.isArray(res.reply) ? res.reply : [res.reply];
    if (res.ok && res.next) state.stage = res.next;
    if (res.ok) scroll.querySelectorAll(".rich.quick:not(.used)").forEach(consume);   /* the turn is answered: its chips retire */
    deliver(replies, function () { busy = false; scroll.classList.remove("busy"); sendBtn.disabled = rec.state !== "idle"; if (res.after) res.after(); if (!document.body.classList.contains("chat-min") && rec.state === "idle") composer.focus(); });
  }
  /* Component action: builds the customer line, marks the component as used, then runs the engine */
  function act(meta, customerText) {
    if (busy) return;
    var comps = scroll.querySelectorAll(".rich:not(.used)");
    var text = customerText;
    if (meta.type === "dates") { var n = daysBetween(meta.a, meta.b); text = S.customer.dates.replace("{in}", fmtDate(meta.a)).replace("{out}", fmtDate(meta.b)).replace("{nightsWord}", nightsWord(n)); }
    if (meta.type === "mode") text = S.customer.mode.replace("{modeWord}", S.words.modes[meta.mode] || meta.mode);
    if (meta.type === "airports") text = meta.text || S.customer.airports.replace("{{{arrival}}}", "{{" + meta.arrival + "}}").replace("{{{departure}}}", "{{" + meta.departure + "}}");
    if (meta.type === "guest") text = meta.data.guest2First || meta.data.guest2Family ? S.customer.guest : S.customer.guestSolo;
    if (meta.type === "verify" || meta.type === "signedIn") text = S.customer.verify;
    if (meta.type === "voice") text = S.words.voiceLabel;
    if (meta.type === "resort") { text = S.customer.resort.replace("{{{resort}}}", "{{" + meta.name + "}}"); hideChooseStatus(); if (window.ResortSpotlight) window.ResortSpotlight.stop(); if (document.body.classList.contains("chat-min")) restore(); }
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
    deliver(S.payment.ok, function () { busy = false; sendBtn.disabled = false; if (!document.body.classList.contains("chat-min") && !panel.hidden) composer.focus(); }, { quickFirst: true });
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
    micBtn.setAttribute("aria-label", st === "rec" ? "Stop recording" : st === "done" ? "Record again" : "Record a voice message");
    sendBtn.disabled = busy || (st !== "idle" && st !== "done");
    sendBtn.setAttribute("aria-label", st === "done" ? "Send the voice message" : "Send");
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
    if (!canRecord) { voiceError("Voice recording is not available in this browser. You can keep typing."); return; }
    micBtn.disabled = true;                                                 /* nothing shows as recording until permission is granted */
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      micBtn.disabled = false;
      if (rec.state !== "idle" || busy) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
      rec.stream = stream; rec.chunks = []; rec.levels = [];
      var mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].filter(function (m) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m); })[0];
      try { rec.recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); }
      catch (e) { voiceError("Recording could not start. Try the microphone again or keep typing."); return; }
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
        if (!rec.blob || rec.blob.size < 1024 || rec.seconds < 1) { voiceError("No audio was captured. Check the microphone and try again, or keep typing."); return; }
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
      voiceError(e && (e.name === "NotAllowedError" || e.name === "SecurityError") ? "Microphone access was not allowed. Allow it and press the microphone again, or keep typing." : "The microphone could not be used. Try again or keep typing.");
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
    else customer(S.words.voiceLabel, { type: "voiceOther", url: url, seconds: seconds });
  }
  micBtn.addEventListener("click", function () { if (rec.state === "rec") voiceStop(); else voiceStart(); });
  composer.addEventListener("input", function () { errEl.textContent = ""; });
  stopB.addEventListener("click", voiceStop);
  cancelB.addEventListener("click", voiceCancel);
  window.addEventListener("resize", function () { if (rec.state === "rec") drawWave(); });

  /* ---------- page resort cards (backdrop + assistant-added اختر) ---------- */
  var ASSIST_TIP = "أظهر المساعد هذا الزر لمساعدتك على اختيار المنتجع.";
  if (rail) {
    R[0].items.forEach(function (r) {
      var tags = r.name === "Shebara" ? ["Overwater", "Beachfront"] : [r.place.split(",")[0]];
      var cardEl = h("article", { "class": "rcard", html:
        '<img src="' + esc(r.image) + '" alt="' + esc(r.name) + '" loading="lazy"><div class="body"><div class="dest">The Red Sea</div><h3>' + esc(r.name) + '</h3><div class="tags">' +
        tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div><div class="acts"><a class="explore" href="#">Explore</a><span class="assist" lang="ar" dir="rtl"><span class="abadge" role="img" aria-label="أضافه المساعد" title="' + ASSIST_TIP + '">' + I.spark + '</span><button type="button" class="choose" data-name="' + esc(r.name) + '" title="' + ASSIST_TIP + '" aria-label="اختر ' + esc(r.name) + '">اختر</button></span></div></div>' });
      cardEl.querySelector(".choose").addEventListener("click", function () { act({ type: "resort", name: r.name }, null); });
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
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!menu.hidden) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); } else if (!panel.hidden) close(); } });
  menuBtn.addEventListener("click", function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; menuBtn.setAttribute("aria-expanded", String(!menu.hidden)); });
  document.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target)) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); } });
  document.getElementById("chat-new").addEventListener("click", function () { menu.hidden = true; start(); });

  function start() {
    cancelTimers(); payTimer = null; state = freshState(); busy = false; scroll.innerHTML = ""; savedScroll = 0; endChoose(); voiceCancel(); composer.value = ""; sendBtn.disabled = false;
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
    var docHead = h("div", { "class": "wt-doc-head", html: '<h1>مساعد البحر الأحمر: المحادثة الكاملة</h1><p>' + esc(B.resort.name) + " · " + esc(B.villa.name) + " · " + esc(B.rate.name) + " · " + esc(B.rate.basisAr) + '</p><div class="legend"><span class="a">المساعد (يسار)</span><span class="c">ما تكتبه أنت (يمين)</span><span class="n">إجراء على بطاقة أو على الصفحة</span></div>' });
    panel.parentNode.insertBefore(docHead, panel);
    open();
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function idle() { return new Promise(function (r) { (function tick() { if (!busy) r(); else setTimeout(tick, 30); })(); }); }
    function note(html) { scroll.appendChild(h("div", { "class": "wt-note", html: html })); }
    function step(label) { scroll.appendChild(h("div", { "class": "wt-step", text: label })); }
    function send(t) { composer.value = t; sendFromComposer(); return idle(); }
    function last(sel) { var all = scroll.querySelectorAll(sel); return all[all.length - 1]; }
    function villaButton() { var i = V.map(function (v) { return v.name; }).indexOf(B.villa.name); return last('.rich[data-component="villas"]').querySelectorAll(".cc-card")[i].querySelector(".cc-btn"); }
    function airportChip(group, airport) { var names = B.transport.airportsAr || {}; return Array.prototype.filter.call(last('.rich[data-component="airports"]').querySelectorAll(".glp-chips")[group].querySelectorAll(".glp-chip"), function (b) { return b.textContent === (names[airport] || airport); })[0]; }
    var W = S.scenario, VD = W.voice;
    (async function () {
      step("1 · الترحيب واسمك الأول");
      note("افتح المحادثة من الزر أسفل يمين الصفحة. يرحّب بك المساعد ويسألك كيف يناديك.");
      await send("أنا " + W.name); await sleep(50);
      step("2 · السؤال عن المنتجعات");
      await send("أبغى إجازة لي ولزوجتي، وودّي أشوف المنتجعات اللي عندكم"); await sleep(50);
      note("<b>إجراء على الصفحة.</b> تنتقل الصفحة إلى بطاقات المنتجعات نفسها، ويظهر على كل بطاقة زر <b>اختر</b> مع أيقونة شرارة تدل على أن المساعد أضافه، وتنكمش المحادثة إلى شريط أسفل الصفحة. يظهر أعلى الصفحة شريط حالة ثابت نصّه <b>بانتظار اختيارك للمنتجع</b>. تُعتَّم بقية الصفحة بينما تبقى البطاقات واضحة، ويتحرك إطار رفيع بلون الأكوا مع مؤشر صغير من بطاقة إلى أخرى ببطء (نحو ثانيتين لكل بطاقة) ثم يستقر. يبقى التعتيم حتى تختار، فخذ راحتك وتصفّح الشريط إن شئت. لا يُختار شيء نيابة عنك ولا يتحرك مؤشر الفأرة. اضغط <b>اختر</b> على بطاقة <b>Shebara</b>: يختفي التأثير فورًا وتعود المحادثة وفيها اختيارك كرسالة.");
      step("3 · تفاصيل Shebara والفلل");
      restore(); act({ type: "resort", name: "Shebara" }, null); await idle(); await sleep(50);
      note("<b>إجراء على البطاقة.</b> اضغط <b>اختيار</b> تحت <b>One Bedroom Overwater Villa</b>. السعر معروض مباشرة تحت الفيلا.");
      villaButton().click(); await idle(); await sleep(50);
      step("4 · عدد الضيوف");
      await send("لا، بس أنا وزوجتي"); await sleep(50);
      note("<b>إجراء على التقويم.</b> اضغط <b>23</b> (الوصول) ثم <b>25</b> أكتوبر (المغادرة). يعرض أسفل التقويم ليلتين. اضغط <b>تأكيد التواريخ</b>.");
      step("5 · التواريخ");
      last('.days button[data-d="2026-10-23"]').click(); last('.days button[data-d="2026-10-25"]').click(); last(".calendar .calconfirm").click(); await idle(); await sleep(50);
      step("6 · الموافقة على ملخص الإقامة");
      await send("تمام، الملخص مناسب"); await sleep(50);
      note("<b>إجراء على البطاقات.</b> اختر <b>بالطائرة</b>.");
      step("7 · طريقة الوصول والمطارات");
      last('.rich[data-component="modes"]').querySelectorAll(".slp-item")[B.transport.modes.indexOf("By Plane")].click(); await idle(); await sleep(50);
      note("<b>إجراء على البطاقة.</b> تحت <b>مطار الوصول</b> اختر <b>Yanbu Airport</b>، وتحت <b>مطار المغادرة</b> اختر <b>Red Sea International Airport - RSIA</b>، ثم اضغط <b>تأكيد المواصلات</b>.");
      airportChip(0, B.transport.arrivalAirport).click(); airportChip(1, B.transport.departureAirport).click(); last('.rich[data-component="airports"] .glp-send-btn').click(); await idle(); await sleep(50);
      step("8 · الموافقة على الإجمالي المحدّث");
      await send("موافق"); await sleep(50);
      step("9 · الأنشطة");
      await send("خلّنا نقرر الأنشطة بعد ما نوصل"); await sleep(50);
      note("<b>حساب سابق أو ضيف جديد.</b> يعرض المساعد خيارين: <b>لدي حساب سابق</b> يطلب بريدك ويرسل إليه رمز تحقق، وبعد التحقق يسترجع بياناتك المحفوظة إن وُجدت؛ و<b>متابعة كضيف جديد</b> لتعبئة البيانات دون رمز تحقق. هنا نختار <b>متابعة كضيف جديد</b>.");
      last('.rich[data-component="account"]').querySelectorAll(".slp-item")[1].click(); await idle(); await sleep(50);
      note("<b>الخيار لك.</b> يظهر نموذج بيانات الضيوف مع الطلب، واسمك الأول فيه مسبقًا. يمكنك تعبئته مباشرة، أو إرسال بياناتك برسالة صوتية: اضغط زر <b>الميكروفون</b> المجاور لزر <b>الإرسال</b> واسمح باستخدام الميكروفون عندما يطلب المتصفح ذلك. يتحول حقل الكتابة نفسه إلى مسجّل: مؤشر أحمر، وموجة صوتية حيّة تتحرك مع صوتك، والوقت المنقضي، وزرا <b>إيقاف</b> و<b>إلغاء</b>. قل بياناتك ثم اضغط <b>إيقاف</b>، استمع إن شئت، ثم اضغط <b>إرسال</b>. تظهر رسالتك على اليمين كفقاعة صوتية بمدتها الحقيقية وزر تشغيل، ثم يرسل المساعد نموذجًا جديدًا معبّأً بما ذكرته، ويذكر ما بقي ناقصًا؛ النموذج السابق يبقى في المحادثة غير نشط.");
      step("10 · رسالة صوتية ببياناتك");
      note("<b>ما يقوله التسجيل</b> (المحتوى المُعدّ لهذه الرحلة؛ البريد الإلكتروني لا يُذكر عمدًا): <bdi dir=\"rtl\" lang=\"ar\">" + esc(VD.transcript) + "</bdi>");
      act({ type: "voice", url: null, seconds: 0, size: 0 }, null); await idle(); await sleep(50);
      note("<b>إجراء على النموذج.</b> الحقول التي تحمل أيقونة الشرارة عُبّئت من الرسالة الصوتية، ويحمل اسمك الأول أيقونة المحادثة لأنه محفوظ من بداية الحديث؛ تعديل أي حقل يزيل أيقونته. حقل <b>البريد الإلكتروني</b> متروك فارغًا عمدًا: اكتب <b>" + esc(W.emailTyped) + "</b> بنفسك، راجع الباقي، ثم اضغط <b>إرسال البيانات</b>. يبقى مربع النشرة البريدية غير محدد ما لم تحدده أنت.");
      step("11 · مراجعة البيانات المستخرجة وإضافة البريد الإلكتروني");
      var gf = last("form.guest-form"); gf.elements.email.value = W.emailTyped; gf.querySelector("button[type=submit]").click(); await idle(); await sleep(50);
      step("12 · المراجعة النهائية والشروط");
      await send("كل شي مضبوط، وموافق على الشروط"); await sleep(50);
      note("<b>إجراء على البطاقة.</b> زر <b>المتابعة إلى الدفع على Visit Red Sea</b> يفتح صفحة الدفع الرسمية في تبويب جديد. بعد نحو خمس ثوانٍ من الضغط يكمل المساعد هنا من تلقاء نفسه؛ لا تحتاج أن تكتب شيئًا.");
      step("13 · الاستكمال التلقائي بعد الضغط على الدفع");
      paymentContinue(); await idle(); await sleep(50);
      note("<b>إجراء على البطاقة.</b> زر <b>تحميل PDF</b> يحفظ الملف <b>" + esc(B.resort.name + "_Booking_Summary_" + state.checkIn + ".pdf") + "</b>، وهو ملخص الحجز بهوية Red Sea Global مبنيٌّ من التفاصيل أعلاه.");
      scroll.querySelectorAll(".msg .meta .time").forEach(function (t) { t.remove(); });
      document.body.classList.add("walkthrough-ready");
    })();
  })();
})();
