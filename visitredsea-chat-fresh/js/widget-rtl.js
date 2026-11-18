/* Arabic RTL inside the Empathy Studio widget (12 Nov 2026). The SDK stays untouched; this page fixes its output.

   What core.min.js 1.15.0 renders, read in the widget's open shadow root:
     - a text bubble is <span class="message-bubble-content" dir="auto">: a reply that starts with "Shebara", a number or a
       link turns the whole bubble LTR;
     - its lists keep a physical padding-left (also .cc-description lists), so RTL bullets hang outside the bubble;
     - confirmation cards (.bc-card), carousel cards (.cc-card) and pickers carry no dir at all: Arabic is left-aligned and
       a line such as "SAR 28,980.00 · ليلتان" reads in LTR order; only a carousel card's title/subtitle/description have
       dir="auto", so a Latin-only subtitle sits on the left of an Arabic card.
   Fix: one style element in the shadow root, dir="rtl" on every bubble, card and auto-direction text that contains Arabic,
   amounts and dates kept on one line, Latin-only links isolated LTR. Re-applied after each re-render (the text reveal
   rewrites a bubble's innerHTML on every tick). The carousel track itself stays LTR: the SDK's arrows scroll by positive
   offsets. Western digits, English names, currency codes and URLs keep their natural order inside the Arabic lines. */
(function () {
  "use strict";
  var AR = /[؀-ۿ]/;
  var MONTHS = "يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر";
  /* "23 - 25 أكتوبر 2026", "الجمعة 23 أكتوبر 2026", "SAR 33,793.90", "+966 551234567": one unit each, never split across lines;
     the amounts and phone numbers are also isolated LTR (a digits-only line in RTL otherwise reads «551234567 966+») */
  var KEEP = new RegExp("(?:(?:السبت|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة) )?(?:\\d{1,2} ?[-–] ?)?\\d{1,2} (?:" + MONTHS + ")(?: \\d{4})?|\\b(?:SAR|USD|EUR) ?\\d[\\d,]*(?:\\.\\d+)?|\\+\\d{1,4}(?:[ -]?\\d{2,}){1,4}", "g");
  var ROOTS = ".message-bubble-content, .cc-card, .bc-card, .slp-picker, .glp-picker, .rc-buttons";
  var STYLE_ATTR = "data-rsg-rtl";
  var CSS = [
    /* lists: logical padding, so the marker sits inside the bubble on the right in Arabic and on the left in English */
    ".message-bubble-content ul, .message-bubble-content ol, .cc-description ul, .cc-description ol { padding-left: 0 !important; padding-right: 0 !important; padding-inline-start: 1.4em !important; }",
    /* Latin-only auto-direction text inside an Arabic card follows the card's alignment */
    "[dir=\"rtl\"] [dir=\"auto\"] { text-align: right; }",
    ".rsg-keep { white-space: nowrap; }"
  ].join("\n");

  function shadow() { var host = document.querySelector("chat-widget"); return host && host.shadowRoot; }
  function ensureStyle(sr) {
    if (sr.querySelector("style[" + STYLE_ATTR + "]")) return;
    var st = document.createElement("style"); st.setAttribute(STYLE_ATTR, "1"); st.textContent = CSS; sr.appendChild(st);
  }
  function setRtl(el) { if (el.getAttribute("dir") !== "rtl" && AR.test(el.textContent)) el.setAttribute("dir", "rtl"); }

  function keepUnits(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) {
      if (n.parentNode && n.parentNode.closest && n.parentNode.closest(".rsg-keep, button, a, input, textarea, select")) continue;
      KEEP.lastIndex = 0; if (KEEP.test(n.nodeValue)) nodes.push(n);
    }
    nodes.forEach(function (node) {
      var text = node.nodeValue, frag = document.createDocumentFragment(), last = 0, m;
      KEEP.lastIndex = 0;
      while ((m = KEEP.exec(text))) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var span = document.createElement("span"); span.className = "rsg-keep"; span.textContent = m[0];
        if (!AR.test(m[0])) span.setAttribute("dir", "ltr");               /* an amount: isolated, "SAR" stays left of the number */
        frag.appendChild(span); last = m.index + m[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  function apply() {
    var sr = shadow(); if (!sr) return;
    ensureStyle(sr);
    Array.prototype.forEach.call(sr.querySelectorAll(ROOTS), function (root) {
      if (!AR.test(root.textContent)) return;                               /* English-only bubbles keep the SDK's dir="auto" */
      setRtl(root);
      Array.prototype.forEach.call(root.querySelectorAll("[dir=\"auto\"]"), setRtl);
      Array.prototype.forEach.call(root.querySelectorAll("a"), function (a) { if (!AR.test(a.textContent) && a.getAttribute("dir") !== "ltr") a.setAttribute("dir", "ltr"); });
      keepUnits(root);
    });
  }

  var queued = false;
  function schedule() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; apply(); }); }
  function start() {
    var sr = shadow(); if (!sr || start.done) return !!start.done;
    start.done = true;
    new MutationObserver(schedule).observe(sr, { childList: true, subtree: true });
    apply();
    return true;
  }
  if (!start()) {
    document.addEventListener("rsg:widget-ready", start);
    var tries = 0, timer = setInterval(function () { if (start() || ++tries > 200) clearInterval(timer); }, 250);
  }
  window.RSGWidgetRtl = { apply: apply };
})();
