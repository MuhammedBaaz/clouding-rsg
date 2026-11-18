/* Fresh RSG site: page behaviour only. The chat is Empathy Studio's web widget (studio-widget.js, one init).

   This file owns what the widget cannot: the resort cards on the page, the assistant-added «اختر» buttons, the
   page scroll + spotlight (js/spotlight.js, from V1) and the hand-back of a page choice into the widget's
   conversation. Facts about the widget used here come from reading the SDK source (core.min.js, "v2"):
     - a rich-component button posts its payload as a visitor message in the same conversation
       (setRichSelectCallback → messages.add({sender:"visitor"}) + transport.send);
     - ChatWidget.init returns a public API with messages.get()/add(), transport.send(msg), session.sessionId;
     - there is no public callback for incoming agent messages (callbacks: onReady, onOpen, onClose, onDestroy,
       onMessageRetry, onScrollStateChange, onNewMessageIndicatorClick, onSend, onNewChat), so the page watches
       messages.get() to notice the approved "show the resorts on the page" sentence.
   Nothing here replaces the agent: without a reply from the channel, nothing on this page pretends to be one. */
(function () {
  "use strict";
  var R = window.RESORTS, rail = document.getElementById("resort-rail"), resortsSection = document.getElementById("resorts");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function h(tag, attrs, html) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (html != null) e.innerHTML = html; return e; }
  function resortId(name) { return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  var SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9zM4 14l.7 1.9 1.9.7-1.9.7L4 19l-.7-1.7-1.9-.7 1.9-.7z"/></svg>';
  var ASSIST_TIP = "أظهر المساعد هذا الزر لمساعدتك على اختيار المنتجع.";

  /* ---------- the widget, once it is ready ---------- */
  function widget() { return window.__rsgStudioInstance || null; }
  /* Send a line into the widget's conversation the same way the SDK sends a card button's payload.
     core.min.js 1.14.0: the rich-select callback does messagesAPI.add({content, sender:"visitor"}) then
     transportManager.send(content), and transportManager.send(t) takes the STRING (it calls t.trim() and builds
     {clientId, content, timestamp} itself). Passing an object threw before anything was sent (9 Nov). */
  function sendToWidget(text) {
    var w = widget(); if (!w || !w.transport || !w.messages) return false;
    try {
      w.messages.add({ content: text, sender: "visitor" });
      w.transport.send(text);
    } catch (e) { console.warn("RSG page: the widget refused the message", e); return false; }
    if (w.open) w.open();
    return true;
  }

  /* ---------- resort cards on the page (approved backdrop + assistant-added اختر) ---------- */
  if (rail && R) {
    R[0].items.forEach(function (r) {
      var tags = r.name === "Shebara" ? ["Overwater", "Beachfront"] : [r.place.split(",")[0]];
      var card = h("article", { "class": "rcard", "data-name": r.name, "data-resort": resortId(r.name) },
        '<img src="' + esc(r.image) + '" alt="' + esc(r.name) + '" loading="lazy"><div class="body"><div class="dest">The Red Sea</div><h3>' + esc(r.name) + '</h3><div class="tags">' +
        tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div><div class="acts"><a class="explore" href="' + esc(r.url || "#") + '"' + (r.url ? ' target="_blank" rel="noopener noreferrer"' : "") + '>Explore</a><span class="assist" lang="ar" dir="rtl"><span class="abadge" role="img" aria-label="أضافه المساعد" title="' + ASSIST_TIP + '">' + SPARK + '</span><button type="button" class="choose" data-name="' + esc(r.name) + '" title="' + ASSIST_TIP + '" aria-label="اختر ' + esc(r.name) + '">اختر</button></span></div></div>');
      card.querySelector(".choose").addEventListener("click", function () {
        endChoose();
        /* the approved customer line for a resort choice; the channel's agent receives it as the visitor's message */
        if (!sendToWidget("نختار " + r.name + ".")) console.warn("RSG page: the chat widget is not ready, the choice was not sent");
      });
      rail.appendChild(card);
    });
  }

  /* ---------- page hand-off: scroll to the cards and run the spotlight (V1 behaviour) ---------- */
  var STATUS_H = 44, timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function stickyHeaderHeight() { var hd = document.querySelector(".site-header"); if (!hd) return 0; var pos = getComputedStyle(hd).position; return pos === "fixed" || pos === "sticky" ? hd.getBoundingClientRect().height : 0; }
  function cardFor(target) { return rail ? rail.querySelector('.rcard[data-resort="' + target + '"]') : null; }
  function scrollToCards(behavior, target) {
    var card = (target && target !== "all" && cardFor(target)) || rail.querySelector(".rcard") || rail, r = card.getBoundingClientRect();
    var top = r.top + window.scrollY, hdr = stickyHeaderHeight() + (document.getElementById("choose-status") ? STATUS_H : 0), vh = window.innerHeight, gap = 16;
    var y = top - hdr - gap; if (r.height + hdr + 2 * gap > vh) y = top + r.height + gap - vh;
    window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: behavior });
  }
  function showChooseStatus() { if (!document.getElementById("choose-status")) document.body.appendChild(h("div", { id: "choose-status", lang: "ar", dir: "rtl", role: "status" }, SPARK + "<span>بانتظار اختيارك للمنتجع</span>")); }
  function hideChooseStatus() { var el = document.getElementById("choose-status"); if (el) el.remove(); }
  function revealResorts(target, done) {
    done = done || function () {};
    var cards = rail ? Array.prototype.slice.call(rail.querySelectorAll(".rcard")) : [];
    if (!cards.length) { done(false, "cards_missing"); return; }
    if (!window.ResortSpotlight) { done(false, "spotlight_unavailable"); return; }
    var focus = target && target !== "all" ? cardFor(target) : null;
    if (target && target !== "all" && !focus) { done(false, "cards_missing"); return; }
    document.body.classList.add("choose-stage"); if (resortsSection) resortsSection.classList.add("is-highlighted"); showChooseStatus();
    var w = widget(); if (w && w.close) w.close();                              /* the widget would cover the cards */
    later(function () { later(function () {
      scrollToCards(reduced ? "auto" : "smooth", target);
      var lastY = -1, stable = 0, tries = 0;
      (function settle() { later(function () {
        tries++; if (window.scrollY === lastY) stable++; else { stable = 0; lastY = window.scrollY; }
        if (stable >= 2 || tries > 25) {
          if (!document.body.classList.contains("choose-stage")) { done(false, "interrupted"); return; }
          scrollToCards("auto", target);
          window.ResortSpotlight.run(focus ? [focus] : cards, { dwell: 1800 });
          done(true, (focus ? [focus] : cards).map(function (c) { return c.getAttribute("data-name"); }));
        } else settle();
      }, 120); })();
    }, 30); }, 30);
  }
  function endChoose() { document.body.classList.remove("choose-stage"); if (resortsSection) resortsSection.classList.remove("is-highlighted"); hideChooseStatus(); if (window.ResortSpotlight) window.ResortSpotlight.stop(); }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("choose-stage")) hideChooseStatus(); });
  window.RSGPage = { revealResorts: revealResorts, endChoose: endChoose, sendToWidget: sendToWidget };

  /* ---------- noticing the agent's page hand-off ----------
     The SDK exposes no incoming-message callback, so the page polls the widget's message list for a new agent
     message that carries the approved hand-off sentence (data/script.js navigate.lead in the live build). */
  var LEAD = "خلني أوريك المنتجعات على الصفحة";
  /* Demo completion (10 Nov 2026): when the approved payment-link message has actually appeared in the chat, the page waits
     about five seconds and sends the silent control line "rsg:continue" through the SDK transport (no bubble is added: only
     the SDK's own input and card buttons add visitor bubbles). Studio delivers it to the bridge like any visitor text; the
     bridge completes the DEMO booking once (no card is charged, no reservation is created) and answers with the trip summary
     and the saved loyalty result. The guest never has to click the link or type anything. The Studio session log will show
     the control line as visitor text. Sent once per payment message, also across a reload of this tab. */
  var PAY_LEAD = "رابط الدفع الآمن", CONTINUE_DELAY_MS = 5000;
  function continueLater(messageId) {
    var key = "rsg-continue-" + messageId;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, String(Date.now())); } catch (e) {}
    later(function () {
      var w = widget(); if (!w || !w.transport) return;
      try { w.transport.send("rsg:continue"); } catch (e) { console.warn("RSG page: the demo continue signal was not sent", e); }
    }, CONTINUE_DELAY_MS);
  }
  /* ---------- «تحميل PDF» on the trip-summary card: one click opens the booking's PDF (12 Nov 2026) ----------
     A Confirmation Card button only posts its payload as the visitor's message (core.min.js 1.15.0:
     t(primary_button_payload ?? primary_button_label, 0)); the SDK has no URL action. Studio's rsg-trip-summary template puts
     the signed link (the bridge's "pdf" line) in primary_button_payload. This capture listener sees the click before the
     button does, reads that payload from widget.messages.get() and opens trip.html, which fetches the saved booking and
     downloads the PDF; the SDK's handler never runs, so no visitor bubble, no agent turn and no second link. Only a
     same-origin /trip.html?b=…&t=… payload is opened; every other button is left to the SDK. */
  function tripUrl(v) {
    var u; try { u = new URL(String(v || "").trim(), location.href); } catch (e) { return ""; }
    return u.origin === location.origin && /\/trip\.html$/.test(u.pathname) && /^[\w-]+$/.test(u.searchParams.get("b") || "") && /^[0-9a-f]+$/.test(u.searchParams.get("t") || "") ? u.href : "";
  }
  function cardButtonPayload(path) {
    var btn = null, card = null, bubble = null, i, n;
    for (i = 0; i < path.length && !bubble; i++) {
      n = path[i]; if (!n || !n.classList) continue;
      if (!btn) { if (n.classList.contains("bc-btn")) btn = n; }
      else if (!card) { if (n.classList.contains("bc-card")) card = n; }
      else if (n.hasAttribute("data-message-id")) bubble = n;
    }
    var w = widget(); if (!bubble || !w || !w.messages) return "";
    var id = bubble.getAttribute("data-message-id"), msg = null;
    try { (w.messages.get() || []).forEach(function (m) { if (m && String(m.id) === id) msg = m; }); } catch (e) { return ""; }
    var cards = ((msg && msg.components) || []).filter(function (c) { return c && /^confirmation[-_]card/.test(String(c.type || "")); });
    var c = cards[Array.prototype.indexOf.call(bubble.querySelectorAll(".bc-card"), card)];
    if (!c || !c.payload) return "";
    return btn.classList.contains("bc-btn--primary") ? c.payload.primary_button_payload : c.payload.secondary_button_payload;
  }
  document.addEventListener("click", function (e) {
    var url = tripUrl(cardButtonPayload(e.composedPath ? e.composedPath() : []));
    if (!url) return;
    e.preventDefault(); e.stopImmediatePropagation();
    window.open(url, "_blank", "noopener");
  }, true);

  var seen = {};
  function watch() {
    var w = widget(); if (!w || !w.messages) return;
    var list = []; try { list = w.messages.get() || []; } catch (e) { return; }
    list.forEach(function (m) {
      if (!m || seen[m.id] || m.sender !== "agent") return;
      seen[m.id] = true;
      var text = typeof m.content === "string" ? m.content : "";
      if (text.indexOf(LEAD) >= 0 && !document.body.classList.contains("choose-stage")) revealResorts("all");
      if (text.indexOf(PAY_LEAD) >= 0 && text.indexOf("visitredsea.com") >= 0) continueLater(m.id);
    });
  }
  document.addEventListener("rsg:widget-ready", function () {
    var w = widget(); if (w && w.messages) { try { (w.messages.get() || []).forEach(function (m) { seen[m.id] = true; }); } catch (e) {} }   /* history is not replayed */
    setInterval(watch, 1500);
  });
})();
