/* iPhone WhatsApp scenes for the Visit Red Sea site (scripted, local playback only).

   Scene 1 (11 Nov 2026): the guest's conversation with the concierge Faisal (data/whatsapp-script.js). Since 11 Nov
   evening it opens only from its launcher button («محادثة الضيف», js/mockup-launchers.js): the trip-PDF link click
   handler and the trip.html BroadcastChannel fallback were removed, so the PDF flow never opens a mockup.

   The engine is a factory, RSGWhatsAppScene.create(script, options), so the ERP handoff scene (js/handoff.js) reuses
   the same iPhone, bubbles, typing, pacing and scroll-follow. Scene 1 is created with no options and behaves as before:

   Playback. idle -> playing <-> paused -> done -> closed. Messages are revealed one by one with reading pauses; an
   incoming message shows "typing…" in the header and the three-dot bubble first; a date pill has its own pause. While
   the page is hidden playback holds and resumes on return. Re-activation while open never restarts or duplicates;
   closing during playback reveals the rest, and reopening shows the whole conversation pinned to the bottom.

   Options used by the handoff scene: className, label, compose (place the phone inside a larger stage), fit (own
   scaling), intro (an async step before the messages, e.g. the transfer animation), replay (every opening starts
   again), onReset, focusables. Message type "document" draws a WhatsApp document card linking to a real file.

   Read-only for this file: the widget configuration, the bridge, the agent, js/pdf.js, js/site.js. */
(function () {
  "use strict";
  var TIMING = { start: 700, resume: 600, sameSpeaker: 900, dayPause: 2200, afterDay: 900 };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var base = /\/tools\//.test(location.pathname) ? "../" : "";     /* the fixtures live one folder down */

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function len(t) { return String(t || "").length; }
  function typingMs(item) { return clamp(700 + 22 * len(item.text || item.caption || item.name), 1000, 2800); }
  function turnGap(prev) { return clamp(1400 + 18 * len(prev.text || prev.caption), 1400, 3200); }
  function now() { return Date.now(); }
  function log() { if (window.console && console.debug) console.debug.apply(console, ["[wa]"].concat([].slice.call(arguments))); }
  function safe(fn) { try { return fn(); } catch (err) { if (window.console) console.error("RSG WhatsApp:", err); } }

  /* ---------- DOM helpers ---------- */
  var ICON = {
    back: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    video: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    camera: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    mic: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    ticks: '<svg viewBox="0 0 18 12" width="18" height="12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 6.5l3.2 3.2L11 3.5"/><path d="M7.5 9.7l1 1L16.5 3.5"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    emoji: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c.9 1.3 2.1 2 3.5 2s2.6-.7 3.5-2"/><circle cx="9" cy="9.8" r=".9" fill="currentColor" stroke="none"/><circle cx="15" cy="9.8" r=".9" fill="currentColor" stroke="none"/></svg>',
    clip: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.6 1.6 0 0 1-2.3-2.3L15 7.2"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    cellular: '<svg viewBox="0 0 20 12" width="20" height="12" fill="currentColor"><rect x="0" y="8" width="3.5" height="4" rx=".8"/><rect x="5.5" y="5.5" width="3.5" height="6.5" rx=".8"/><rect x="11" y="3" width="3.5" height="9" rx=".8"/><rect x="16.5" y="0" width="3.5" height="12" rx=".8"/></svg>',
    wifi: '<svg viewBox="0 0 18 12" width="18" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M1.5 4a11 11 0 0 1 15 0M4.2 6.8a7 7 0 0 1 9.6 0M6.9 9.5a3.2 3.2 0 0 1 4.2 0"/><circle cx="9" cy="11" r=".6" fill="currentColor"/></svg>',
    battery: '<svg viewBox="0 0 30 13" width="30" height="13" fill="none"><rect x="1" y="1" width="24" height="11" rx="3.2" stroke="currentColor" stroke-opacity=".4" stroke-width="1.2"/><rect x="2.6" y="2.6" width="21" height="7.8" rx="2" fill="currentColor"/><path d="M27 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" fill-opacity=".45"/></svg>',
    pdf: '<svg viewBox="0 0 34 40" width="34" height="40" aria-hidden="true"><path d="M3 1h20l10 10v26a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" fill="#fff" stroke="#d5d9dc"/><path d="M23 1v8a2 2 0 0 0 2 2h8" fill="#eef0f2" stroke="#d5d9dc"/><rect x="0" y="22" width="25" height="12" rx="2" fill="#e5383b"/><text x="12.5" y="31" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" font-weight="700" fill="#fff">PDF</text></svg>'
  };
  var LATIN_RUN = /[A-Za-z0-9+][A-Za-z0-9 .,:\/%+\-–@&'"_]*[A-Za-z0-9%.]|[A-Za-z0-9]/g;

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  /* Arabic base direction with Latin and digit runs isolated, so "Shebara", "24 أكتوبر", "+966 55…" and "4:12" keep their order */
  function renderText(target, text) {
    var s = String(text || ""), last = 0, m;
    LATIN_RUN.lastIndex = 0;
    while ((m = LATIN_RUN.exec(s))) {
      if (m.index > last) target.appendChild(document.createTextNode(s.slice(last, m.index)));
      var b = document.createElement("bdi"); b.className = "wa-ltr"; b.dir = "ltr"; b.textContent = m[0]; target.appendChild(b);
      last = m.index + m[0].length;
    }
    if (last < s.length) target.appendChild(document.createTextNode(s.slice(last)));
  }
  function lockPage(on) {
    var html = document.documentElement;
    if (on) { html.style.setProperty("--wa-sbw", (window.innerWidth - html.clientWidth) + "px"); html.classList.add("wa-lock"); }
    else html.classList.remove("wa-lock");
  }

  /* =================================================================================================== scene factory */
  function createScene(S, opts) {
    opts = opts || {};
    var AR = (S && S.ui === "ar");
    var OUT = (S && S.outFrom) || "guest";                        /* the phone owner's messages: outgoing, green, ticks */
    var state = "idle", queue = [], cursor = 0, timer = null, pending = null, remaining = 0, introCtl = null;
    var follow = true, unseen = 0, programmaticUntil = 0, lastFocus = null;
    var root, phone, screen, list, chip, chipCount, subtitle, closeBtn, sizer, scrim, typingEl = null;

    function pick(en, ar) { return (AR && ar) ? ar : en; }
    function flatten() {
      queue = [];
      (S.days || []).forEach(function (d) {
        queue.push({ kind: "day", label: pick(d.label, d.labelAr) });
        (d.messages || []).forEach(function (m) {
          queue.push({ kind: "msg", from: m.from, time: pick(m.time, m.timeAr), text: m.text, type: m.type || "text",
                       file: m.file, name: m.name, meta: m.meta, caption: m.caption });
        });
      });
    }

    /* ---------- DOM ---------- */
    function build() {
      if (root) return;
      root = el("div", "wa-overlay" + (opts.className ? " " + opts.className : "")); root.hidden = true;
      root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", opts.label || "محادثة واتساب مع كونسيرج المنتجع");
      scrim = el("div", "wa-scrim");
      closeBtn = el("button", "wa-close", ICON.close); closeBtn.type = "button"; closeBtn.setAttribute("aria-label", "إغلاق");
      sizer = el("div", "wa-sizer");
      phone = el("div", "wa-phone");
      screen = el("div", "wa-screen"); screen.dir = S.dir || "rtl"; screen.lang = "ar"; screen.setAttribute("data-out-side", S.outSide || "end");
      var island = el("div", "wa-island");
      var top = el("div", "wa-top");
      var status = el("div", "wa-status");
      var time = el("bdi", "wa-status-time"); time.dir = "ltr"; time.textContent = S.statusTime || "9:41";
      var icons = el("div", "wa-status-icons", ICON.cellular + ICON.wifi + ICON.battery);
      status.appendChild(time); status.appendChild(icons);
      var nav = el("div", "wa-nav");
      var back = el("div", "wa-back", ICON.back + '<bdi dir="ltr" class="wa-back-count">' + (S.unreadBadge || "") + "</bdi>");
      var who = el("div", "wa-who");
      var avatar = el("div", "wa-avatar" + (S.contact && S.contact.avatarFit === "contain" ? " is-logo" : ""));
      if (S.contact && S.contact.avatar) {
        var img = document.createElement("img"); img.alt = ""; img.src = base + S.contact.avatar;
        img.onerror = function () { avatar.textContent = (S.contact && S.contact.initials) || ""; avatar.classList.add("is-initials"); };
        avatar.appendChild(img);
      } else { avatar.textContent = (S.contact && S.contact.initials) || ""; avatar.classList.add("is-initials"); }
      var names = el("div", "wa-names");
      var title = el("div", "wa-title"); title.dir = S.dir || "rtl"; renderText(title, (S.contact && S.contact.name) || "");
      subtitle = el("div", "wa-sub"); subtitle.textContent = pick(S.contact && S.contact.subtitle, S.contact && S.contact.subtitleAr) || "";
      names.appendChild(title); names.appendChild(subtitle);
      who.appendChild(avatar); who.appendChild(names);
      var calls = el("div", "wa-calls", '<span class="wa-icon">' + ICON.video + '</span><span class="wa-icon">' + ICON.phone + "</span>");
      nav.appendChild(back); nav.appendChild(who); nav.appendChild(calls);
      top.appendChild(status); top.appendChild(nav);
      list = el("div", "wa-messages"); list.setAttribute("role", "log"); list.setAttribute("aria-live", "polite"); list.tabIndex = 0;
      chip = el("button", "wa-jump", ICON.chevronDown + '<span class="wa-jump-count"></span>'); chip.type = "button"; chip.hidden = true; chip.setAttribute("aria-label", "الانتقال إلى آخر رسالة");
      chipCount = chip.querySelector(".wa-jump-count");
      var composer = el("div", "wa-composer",
        '<div class="wa-input"><span class="wa-icon wa-emoji">' + ICON.emoji + '</span><span class="wa-placeholder">' + (S.composerPlaceholder || "") + '</span>' +
        '<span class="wa-icon wa-clip">' + ICON.clip + '</span><span class="wa-icon wa-cam">' + ICON.camera + '</span></div><span class="wa-icon wa-mic">' + ICON.mic + "</span>");
      var home = el("div", "wa-home");
      screen.appendChild(island); screen.appendChild(top); screen.appendChild(list); screen.appendChild(chip); screen.appendChild(composer); screen.appendChild(home);
      phone.appendChild(screen); sizer.appendChild(phone);
      root.appendChild(scrim); root.appendChild(closeBtn);
      root.appendChild(opts.compose ? opts.compose({ root: root, sizer: sizer, phone: phone, screen: screen, list: list }) : sizer);
      document.body.appendChild(root);

      closeBtn.addEventListener("click", function () { safe(close); });
      scrim.addEventListener("click", function () { safe(close); });
      scrim.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
      chip.addEventListener("click", function () { follow = true; unseen = 0; scrollToBottom(true); updateChip(); });
      list.addEventListener("scroll", onScroll, { passive: true });
      list.addEventListener("wheel", function (e) { if (e.deltaY < 0) userIntent(); }, { passive: true });
      var touchY = null;
      list.addEventListener("touchstart", function (e) { touchY = e.touches[0].clientY; }, { passive: true });
      list.addEventListener("touchmove", function (e) { var y = e.touches[0].clientY; if (touchY != null && y > touchY + 4) userIntent(); touchY = y; }, { passive: true });
      list.addEventListener("keydown", function (e) { if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home") userIntent(); });
      if (window.ResizeObserver) new ResizeObserver(function () { if (follow) scrollToBottom(false); }).observe(list);
      window.addEventListener("resize", fitScale);
      if (window.visualViewport) window.visualViewport.addEventListener("resize", fitScale);
    }

    function appendDay(item) { var d = el("div", "wa-day"); var p = el("span", "wa-day-pill"); renderText(p, item.label); d.appendChild(p); list.appendChild(d); return d; }
    function appendMsg(item) {
      var out = item.from === OUT;
      var m = el("div", "wa-msg " + (out ? "out" : "in") + (item.type === "document" ? " wa-msg-doc" : ""));
      if (item.type === "document") {
        /* WhatsApp document card: icon, file name, "1 page · 96 kB · PDF"; opens the real file in a new tab */
        var a = el("a", "wa-doc"); a.href = base + item.file; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("aria-label", "فتح " + (item.name || "الملف"));
        a.innerHTML = '<span class="wa-doc-icon">' + ICON.pdf + "</span>";
        var info = el("span", "wa-doc-info"); var nm = el("span", "wa-doc-name"); nm.dir = "auto"; nm.textContent = item.name || "";
        var mt = el("bdi", "wa-doc-meta"); mt.dir = "ltr"; mt.textContent = item.meta || "PDF";
        info.appendChild(nm); info.appendChild(mt); a.appendChild(info); m.appendChild(a);
        if (item.caption) { var c = el("div", "wa-text wa-doc-caption"); c.dir = "rtl"; c.lang = "ar"; renderText(c, item.caption); m.appendChild(c); }
      } else {
        var t = el("div", "wa-text"); t.dir = "rtl"; t.lang = "ar"; renderText(t, item.text); m.appendChild(t);
      }
      var meta = el("div", "wa-meta"); var time = el("bdi", "wa-time"); time.dir = "ltr"; time.textContent = item.time; meta.appendChild(time);
      if (out) meta.appendChild(el("span", "wa-ticks", ICON.ticks));
      m.appendChild(meta); list.appendChild(m); return m;
    }
    /* header line plus WhatsApp's three-dot bubble; the bubble is removed before the message lands */
    function showTyping() {
      subtitle.textContent = pick(S.contact && S.contact.typing, S.contact && S.contact.typingAr) || "typing…"; subtitle.classList.add("is-typing");
      if (!typingEl) { typingEl = el("div", "wa-msg in wa-typing", '<span class="wa-dot"></span><span class="wa-dot"></span><span class="wa-dot"></span>'); typingEl.setAttribute("aria-hidden", "true"); }
      list.appendChild(typingEl); afterReveal(false);
    }
    function hideTyping() {
      if (!subtitle) return;
      subtitle.textContent = pick(S.contact && S.contact.subtitle, S.contact && S.contact.subtitleAr) || ""; subtitle.classList.remove("is-typing");
      if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
    }

    /* ---------- scroll-follow ---------- */
    function nearBottom() { return list.scrollHeight - list.scrollTop - list.clientHeight <= 40; }
    function scrollToBottom(smooth) {
      var sm = smooth && !reduced;
      programmaticUntil = performance.now() + (sm ? 700 : 120);
      try { list.scrollTo({ top: list.scrollHeight, behavior: sm ? "smooth" : "auto" }); } catch (e) { list.scrollTop = list.scrollHeight; }
    }
    function onScroll() {
      if (performance.now() < programmaticUntil) { if (nearBottom()) programmaticUntil = 0; return; }
      follow = nearBottom(); if (follow) unseen = 0; updateChip();
    }
    function userIntent() { programmaticUntil = 0; follow = false; updateChip(); }
    function updateChip() { var show = !follow && unseen > 0; chip.hidden = !show; chipCount.textContent = show ? String(unseen) : ""; }
    function afterReveal(counts) { if (follow) scrollToBottom(true); else if (counts) { unseen++; updateChip(); } }

    /* ---------- playback ---------- */
    function revealNext() {
      var item = queue[cursor++]; if (!item) return null;
      if (item.kind === "day") appendDay(item); else appendMsg(item);
      afterReveal(item.kind === "msg");
      return item;
    }
    function gapFor(next, prev) {
      if (!prev) return TIMING.start;
      if (next.kind === "day") return TIMING.dayPause;
      if (prev.kind === "day") return TIMING.afterDay;
      return next.from === prev.from ? TIMING.sameSpeaker : turnGap(prev);
    }
    function schedule(ms) { clearTimeout(timer); pending = pending || {}; pending.dueAt = now() + ms; timer = setTimeout(function () { safe(tick); }, ms); }
    function tick() {
      if (state !== "playing") return;
      if (document.hidden) { pause(); return; }
      var item = queue[cursor];
      if (!item) { state = "done"; pending = null; return; }
      if (pending && pending.phase === "gap" && item.kind === "msg" && item.from !== OUT) { showTyping(); pending.phase = "typing"; schedule(typingMs(item)); return; }
      hideTyping();
      var revealed = revealNext();
      if (cursor >= queue.length) { state = "done"; pending = null; log("done"); if (opts.onDone) safe(opts.onDone); return; }
      pending = { index: cursor, phase: "gap" };
      schedule(gapFor(queue[cursor], revealed));
    }
    function pause() { clearTimeout(timer); remaining = pending ? Math.max(300, pending.dueAt - now()) : TIMING.start; state = "paused"; log("paused"); }
    function resume() { state = "playing"; schedule(Math.max(TIMING.resume, remaining)); log("resumed"); }
    function revealAll() { hideTyping(); while (cursor < queue.length) { var it = queue[cursor++]; if (it.kind === "day") appendDay(it); else appendMsg(it); } }
    function startPlayback() {
      if (document.hidden) { remaining = TIMING.start; state = "paused"; } else { state = "playing"; schedule(TIMING.start); }
    }

    function open(o) {
      if (!S || !S.days) { if (window.console) console.warn("RSG WhatsApp: the scene script is missing; nothing to play."); return; }
      o = o || {};
      if (isOpen()) { nudge(); return; }
      build();
      if (opts.replay && state === "closed") hardReset();          /* the handoff scene plays again on every opening */
      if (state === "idle") {
        flatten(); cursor = 0; list.innerHTML = ""; follow = true; unseen = 0; updateChip();
        mount();
        revealNext();                                             /* the first date pill, at once */
        pending = { index: cursor, phase: "gap" };
        if (opts.intro) {
          state = "intro";
          introCtl = opts.intro(function () { if (state === "intro") { introCtl = null; startPlayback(); } }) || null;
        } else startPlayback();
        log("opened from idle", o.source || "");
        return;
      }
      if (state === "closed") { mount(); follow = true; unseen = 0; updateChip(); scrollToBottom(false); state = "done"; log("reopened", o.source || ""); }
    }
    function mount() {
      lastFocus = document.activeElement;
      var h = lastFocus; if (h && h.shadowRoot && h.shadowRoot.activeElement) { try { h.shadowRoot.activeElement.blur(); } catch (e) {} }
      root.hidden = false; lockPage(true); fitScale();
      try { closeBtn.focus({ preventScroll: true }); } catch (e) {}
    }
    function close() {
      if (state === "intro") { if (introCtl && introCtl.cancel) safe(introCtl.cancel); introCtl = null; }
      if (state === "playing" || state === "paused") { clearTimeout(timer); timer = null; revealAll(); scrollToBottom(false); }
      if (state === "idle" || state === "closed") return;
      state = "closed"; root.hidden = true; lockPage(false);
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
      log("closed");
    }
    function hardReset() {
      clearTimeout(timer); timer = null; pending = null; cursor = 0;
      if (introCtl && introCtl.cancel) safe(introCtl.cancel); introCtl = null;
      if (list) list.innerHTML = ""; hideTyping(); state = "idle";
      if (opts.onReset) safe(opts.onReset);
    }
    function reset() { hardReset(); if (root) root.hidden = true; lockPage(false); }
    function nudge() { if (!root) return; root.classList.remove("wa-nudge"); void root.offsetWidth; root.classList.add("wa-nudge"); setTimeout(function () { root.classList.remove("wa-nudge"); }, 320); }
    function isOpen() { return state === "intro" || state === "playing" || state === "paused" || state === "done"; }

    /* ---------- fit, keys ---------- */
    function fitScale() {
      if (!root || root.hidden) return;
      var vv = window.visualViewport, vw = vv ? vv.width : window.innerWidth, vh = vv ? vv.height : window.innerHeight;
      if (opts.fit) opts.fit({ root: root, vw: vw, vh: vh });
      else {
        var full = vw < 480;
        root.classList.toggle("is-fullbleed", full);
        var pad = vw < 600 ? 10 : 28;
        var s = full ? 1 : Math.min(1, (vw - 2 * pad) / 390, (vh - 2 * pad) / 844);
        root.style.setProperty("--wa-scale", s.toFixed(4)); root.style.setProperty("--wa-pad", pad + "px");
      }
      if (follow) scrollToBottom(false);
    }
    function onKey(e) {
      if (!isOpen()) return;
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); safe(close); return; }
      if (e.key === "Tab") {
        var ring = [closeBtn].concat(opts.focusables ? opts.focusables() : [], [list], [].slice.call(list.querySelectorAll("a[href]")), chip.hidden ? [] : [chip]);
        var i = ring.indexOf(document.activeElement);
        if (i < 0) { e.preventDefault(); ring[0].focus(); return; }
        var n = (i + (e.shiftKey ? -1 : 1) + ring.length) % ring.length; e.preventDefault(); ring[n].focus();
      }
    }
    document.addEventListener("keydown", function (e) { safe(function () { onKey(e); }); }, true);
    document.addEventListener("visibilitychange", function () { safe(function () { if (document.hidden && state === "playing") pause(); else if (!document.hidden && state === "paused") resume(); }); });

    return {
      open: function (o) { safe(function () { open(o); }); }, close: function () { safe(close); }, reset: function () { safe(reset); },
      isOpen: isOpen, state: function () { return state; }, refit: function () { safe(fitScale); },
      root: function () { return root; }, scrollToBottom: function () { if (list) scrollToBottom(false); }
    };
  }

  window.RSGWhatsAppScene = { create: createScene, el: el, renderText: renderText, icon: ICON, base: base, reduced: reduced };
  /* Scene 1: the guest conversation; opened only by its launcher (no PDF-link or cross-tab trigger) */
  var guest = createScene(window.WHATSAPP_SCRIPT, { label: "محادثة واتساب مع كونسيرج المنتجع" });
  window.RSGWhatsApp = { open: guest.open, close: guest.close, reset: guest.reset, isOpen: guest.isOpen, state: guest.state };
})();
