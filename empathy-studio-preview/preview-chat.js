/* Renders a representative RSG conversation inside a replica of the V1 or V2 chat shell (the real css/ files of each
   version, copied read-only into ./css) with the proposed Empathy Studio components in place of the current cards.
   Static preview: no engine, no network calls except local assets. */
(function () {
  "use strict";
  var q = new URLSearchParams(location.search), ver = q.get("v") === "v2" ? "v2" : "v1";
  var D = window["RSG_" + ver.toUpperCase()], S = D.SCRIPT, C = window.RSG_PAYLOADS.build(ver, D);
  var theme = ver === "v2" ? { p: "#2c6663", t: "#142f35", b: "#c8c4b7" } : { p: "#37706c", t: "#1e282f", b: "#c5cdd2" };
  var resolver = new EmpathyStudio.IconResolver({ baseUrl: "studio/icons" }), registry = EmpathyStudio.createRegistry(resolver);
  var scroll = document.getElementById("chat-scroll");
  function h(tag, attrs, html) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var VARS = { resort: "Shebara", villa: "One Bedroom Overwater Villa", email: "muhammed.baz@clouding.ai", arrival: "Yanbu Airport", departure: "Red Sea International Airport - RSIA", name: "محمد", wife: "نورة", "in": "الجمعة 23 أكتوبر 2026", out: "الأحد 25 أكتوبر 2026", nights: "2", nightsWord: "ليلتين", modeWord: "بالطائرة" };
  function fill(t) { return esc(t).replace(/\{\{\{(\w+)\}\}\}/g, function (_, k) { return '<bdi dir="ltr">' + esc(VARS[k] || k) + "</bdi>"; }).replace(/\{\{(.+?)\}\}/g, '<bdi dir="ltr">$1</bdi>').replace(/\{(\w+)\}/g, function (m, k) { return k in VARS ? "<bdi>" + esc(VARS[k]) + "</bdi>" : m; }); }
  function msg(from, html) {
    var m = h("div", { "class": "msg " + from });
    if (from === "agent") m.appendChild(h("img", { "class": "av", src: "assets/logos/vrs-turtle-mark.svg", alt: "", width: "28", height: "28" }));
    var col = h("div", { "class": "col" }); col.appendChild(h("div", { "class": "bubble", lang: "ar", dir: "rtl" }, html));
    col.appendChild(h("div", { "class": "meta" }, '<span class="time">13:12</span>' + (from === "guest" ? ' <span class="tick">✓✓</span>' : ""))); m.appendChild(col); scroll.appendChild(m); return m;
  }
  function comp(c, selection) {
    var wrap = h("div", { "class": "rich" }), container = h("div", { "class": "rc-container studio-host", dir: "rtl" });
    container.style.setProperty("--primary-color", theme.p); container.style.setProperty("--text-color", theme.t); container.style.setProperty("--border-color", theme.b); container.style.setProperty("--font-family", '"Fedra Sans AL", Tahoma, Arial, sans-serif');
    var component = { type: c.type, payload: c.payload, selection: selection };
    var el = EmpathyStudio.renderRichMessage([component], registry, function (value) { msg("guest", esc(value)); });
    container.appendChild(el.firstChild); wrap.appendChild(container); scroll.appendChild(wrap); return wrap;
  }
  var entries = function (key) { var r = S[key].ok; return Array.isArray(r) ? r : [r]; };
  var t = function (key, i) { var it = entries(key)[i || 0]; return typeof it === "string" ? it : it.text; };
  /* text that introduces a component: the entry's own text (V2) or the string entry just before it (V1) */
  var tc = function (key, comp) { var arr = entries(key); for (var i = 0; i < arr.length; i++) { var it = arr[i]; if (it && it.component === comp) { if (it.text) return it.text; var p = arr[i - 1]; return typeof p === "string" ? p : (p && p.text) || ""; } } return t(key, 0); };
  var tl = function (key) { var arr = entries(key); for (var i = arr.length - 1; i >= 0; i--) if (typeof arr[i] === "string") return arr[i]; return ""; };
  /* representative route, in the versions' own wording */
  if (ver === "v2") {
    msg("agent", fill(t("intent"))); comp(C.resorts, { index: 0, value: "", cardIndex: 0 });
    msg("guest", "نختار <bdi dir=\"ltr\">Shebara</bdi>.");
  } else {
    msg("guest", "أختار <bdi dir=\"ltr\">Shebara</bdi>.");
  }
  msg("agent", fill(tc("resort", "resortDetails"))); comp(C.resortDetails);
  msg("agent", fill(tc("resort", "villas"))); comp(C.villas);
  msg("guest", "أختار <bdi dir=\"ltr\">One Bedroom Overwater Villa</bdi> على <bdi dir=\"ltr\">Villa Flat Rate</bdi>.");
  msg("agent", fill(t("villa")));
  msg("guest", "لا، بس أنا وزوجتي");
  msg("agent", fill(t("party")) + ' <span class="pv-note">(التقويم الحالي يبقى كما هو)</span>');
  msg("guest", "الوصول الجمعة 23 أكتوبر 2026 والمغادرة الأحد 25 أكتوبر 2026، ليلتين.");
  msg("agent", fill(tc("dates", "summary1"))); comp(C.summary1);
  msg("guest", "مناسب، نكمل");
  msg("agent", fill(t("approve1"))); comp(C.modes, { index: 0, value: "بالطائرة." });
  msg("guest", "بالطائرة.");
  msg("agent", fill(t("mode"))); comp(C.airports, { index: 0, value: "مطار الوصول: " + (ver === "v2" ? "مطار ينبع" : "Yanbu Airport") + ", مطار المغادرة: " + (ver === "v2" ? "مطار البحر الأحمر الدولي – RSIA" : "Red Sea International Airport - RSIA") });
  msg("guest", "الوصول على <bdi dir=\"ltr\">Yanbu Airport</bdi> والمغادرة من <bdi dir=\"ltr\">Red Sea International Airport - RSIA</bdi>.");
  msg("agent", fill(tc("airports", "transportTrip"))); comp(C.transport);
  msg("agent", fill(tc("airports", "summary2"))); comp(C.summary2);
  msg("guest", "اعتمد ونكمل");
  msg("agent", fill(t("approve2"))); comp(C.experiences); comp(C.quickDefer);
  msg("guest", "نختار عند الوصول");
  msg("agent", fill(tc("guest", "review"))); comp(C.review);
  msg("guest", ver === "v2" ? "البيانات صحيحة، نكمل" : "موافق على الشروط، نكمل");
  msg("agent", fill(t("verify")) + ' <span class="pv-note">(بطاقة التحقق الحالية تبقى كما هي)</span>'); comp(C.payment);
  msg("agent", fill(tc("payment", "confirmation"))); comp(C.confirmation);
  msg("agent", fill(tl("payment")));
  var anchor = q.get("at");
  function goAnchor() { if (!anchor) { scroll.scrollTop = 0; return; } var target = scroll.querySelectorAll(".rich")[+anchor]; if (target) scroll.scrollTop = target.offsetTop - 12; }
  goAnchor(); window.addEventListener("load", goAnchor); setTimeout(goAnchor, 1200); setTimeout(goAnchor, 2500);
})();
