/* Website views of the booking, connected to the Empathy Studio widget (18 Nov 2026; second design the same day).

   How the page and the conversation stay one booking:
   - The page finds its conversation by the visitor id the widget stores (localStorage "chatwidget_v2_visitorId"). Studio
     sends the same id to the bridge when it opens a session (Phase 0 check, live README), and the bridge keeps the latest
     conversation per id. The page reads the booking through its own server: GET /api/booking/state?v=<id>, a proxy to the
     live backend's local-only /api/studio/state (agent/studio_bridge.py page_state).
   - Every decision made in a view goes back through the widget as the approved card line the bridge already handles
     (event_for): «أختار … على Villa Flat Rate.», «مطار الوصول: …, مطار المغادرة: …», «اعتمد ونكمل», «مهتم بتجربة …»,
     «نختار عند الوصول», «بياناتي: …» (silent, as the in-chat form), «البيانات صحيحة، نكمل». The booking moves in one
     place, the transcript records it, and the assistant continues from it without asking again. Only the guest form's
     draft is written beside the conversation (POST /api/booking/draft).
   - Opening: each view opens by itself once per conversation when the booking reaches its step (villa, airports, the
     trip legs, activities, guest details, review), after the assistant's reply for that step has arrived. The resort
     comparison is optional, so it is offered by a card in the chat («عرض على الصفحة»). «حجزك» reopens the current step.
   - Look: no enclosing panel; each option is its own card on a transparent, blurred backdrop over the page. Forms and
     the review sit on one sheet. From 1200px the chat docks as a full-height column on the left; below that, and on
     phones, it closes to its button (unread badge from the SDK).
   - Rules: the question order and the booking rules are the bridge's; the page never prices or skips a step. Guest
     details stay editable until payment; resort, villa, dates and transport are read-only once their step is done. */
(function () {
  "use strict";
  var B = window.BOOKING || {}, CMP = window.RESORT_COMPARE || [];
  var POLL_MS = 1500, WIDE = 1200, DOCK_LEFT = 16 + 416 + 16;
  var HOME_POS = { placement: "bottom-right", offsetX: 16, offsetY: 15 }, HOME_HEIGHT = 544;   /* the Studio snippet's own values */
  var STAGES = { compare: ["resort"], villas: ["villa"], airports: ["airports"], legs: ["approve2"], activities: ["activities"],
                 guest: ["guest", "requests", "review", "payment"], review: ["review"] };
  var AUTO = { villa: "villas", airports: "airports", approve2: "legs", activities: "activities", guest: "guest", requests: "guest", review: "review" };
  var PRICED_VILLA = (B.villa && B.villa.name) || "One Bedroom Overwater Villa";
  var GALLERY = {                                                   /* photos on file; one per villa except the priced one */
    "One Bedroom Overwater Villa": ["assets/villas/shebara-one-bedroom-overwater-villa-1.webp", "assets/villas/shebara-one-bedroom-overwater-villa-exterior.webp", "assets/villas/shebara-one-bedroom-overwater-villa-interior.webp"]
  };
  var LOOK = {
    "Shebara": { photo: "assets/site/resorts-hero-shebara.webp", logo: "assets/logos/shebara-logo-main-color.svg" },
    "Desert Rock": { photo: "assets/resorts/desert-rock.webp", logo: "" }
  };
  var CODES = ["+966", "+971", "+974", "+965", "+973", "+968", "+962", "+20", "+1", "+44"];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var ERR_FIELD = { title: "title", first_name: "firstName", family_name: "familyName", email: "email", mobile_code: "mobileCode", mobile: "mobile", companion_first_name: "guest2First", companion_family_name: "guest2Family" };
  var PLANE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>';
  var T = {
    entry: { compare: ["مقارنة Shebara وDesert Rock", "المعايير الخمسة جنب بعض على الصفحة."] },
    entryOther: { villas: ["فلل Shebara", ""], airports: ["المطارات", ""], legs: ["التنقلات", ""], activities: ["التجارب", ""], guest: ["بيانات الحجز", ""], review: ["مراجعة الحجز", ""] },
    open: "عرض على الصفحة", done: "تمّت هذه الخطوة في المحادثة", back: "العودة للمحادثة", close: "إغلاق",
    sent: "تم الإرسال، ورفيق يكمل معك في المحادثة…", slow: "ما وصلنا رد بعد. تقدر تكمل من المحادثة.", notSent: "ما وصلت الرسالة، حاول مرة أخرى.",
    villasTitle: "فلل {r}", villasSub: "الصور والمواصفات المؤكدة لكل فيلا. السعر يظهر بعد تحديد الضيوف والتواريخ.", villaKick: "Villa",
    choose: "اختيار هذه الفيلا", compare: "قارن", compareTitle: "مقارنة الفلل", hideCompare: "إخفاء المقارنة",
    needsPrice: "السعر يحتاج تأكيد", useVilla: "نكمل على فيلا فوق الماء بغرفة نوم واحدة",
    rows: ["السعة", "غرف النوم", "الأسرّة", "الإطلالة", "المساحة", "المسبح"],
    cmpTitle: "Shebara أم Desert Rock؟", cmpSub: "خمسة معايير جنب بعض، والاختيار لك.", pick: "اختر {r}",
    apTitle: "المطارات", apSub: "اختر مطار الوصول ومطار المغادرة.", arrive: "مطار الوصول", depart: "مطار المغادرة", picked: "✓ تم الاختيار",
    apSubmit: "اعتماد المطارين", apRoute: "هذا المسار يحتاج تأكيد السعر", apUse: "نكمل على مطار ينبع ومطار البحر الأحمر الدولي",
    legsTitle: "التنقلات", legsSub: "من المطار إلى Shebara وبالعكس.", legIn: "الوصول", legOut: "المغادرة", legsApprove: "اعتماد التنقلات",
    actTitle: "التجارب", actSub: "تجارب ممكن تستكشفونها خلال الإقامة، ويرتّبها فريق المنتجع معكم بعد تثبيت الحجز.",
    interest: "مهتم بهذه التجربة", interested: "يرتّبها لكم فريق المنتجع بعد تثبيت الحجز.", defer: "نختار عند الوصول",
    stay: "الإقامة", transfers: "التنقلات", total: "الإجمالي", payable: "المبلغ للدفع",
    gTitle: "بيانات الحجز", gSub: "عبّينا ما عندنا من محادثتنا. أكمل الباقي وراجعه قبل الاعتماد.",
    gGroups: ["الضيف", "التواصل", "المرافق", "طلب خاص"], fromChat: "من محادثتنا", saved: "حُفظت المسودة",
    missing: "باقي {n} حقول مطلوبة", missing1: "باقي حقل واحد مطلوب", missing2: "باقي حقلان مطلوبان", gSubmit: "اعتماد البيانات", choose1: "اختر", optional: "اختياري",
    labels: { title: "اللقب", firstName: "الاسم الأول", familyName: "اسم العائلة", email: "البريد الإلكتروني", mobileCode: "رمز الدولة", mobile: "رقم الجوال", guest2First: "الاسم الأول", guest2Family: "اسم العائلة", requests: "طلبات خاصة" },
    needField: "هذا الحقل مطلوب", needEmail: "اكتب بريدًا إلكترونيًا صحيحًا", needMobile: "اكتب رقم جوال من 7 إلى 14 رقمًا",
    rTitle: "مراجعة الحجز", rSub: "راجع كل التفاصيل قبل الانتقال إلى الدفع على موقع Visit Red Sea.",
    rSecs: ["الإقامة", "التنقلات", "الضيوف والتواصل", "الأسعار"], rEdit: "تعديل البيانات", rConfirm: "البيانات صحيحة، نكمل", rLocked: "اعتُمدت في خطوتها",
    resort: "المنتجع", villa: "الفيلا", rate: "السعر", dates: "التواريخ", guests: "الضيوف", contact: "التواصل", mobile: "الجوال", request: "طلب خاص",
    redeemed: "نقاط مستخدمة", none: "-", sumTitle: "حجزك", todo: "باقي", current: "عرض الخطوة الحالية", pdf: "ملف الرحلة PDF"
  };

  /* ?viewsFixture=<stage> (resort, villa, airports, approve2, activities, guest, review): offline visual review with a booking
     state recorded on 18 Nov 2026 (tools/views-fixture.json, fictional guest); nothing is sent to the chat in this mode */
  var FIXTURE = (/[?&]viewsFixture=([a-z0-9]+)/.exec(location.search) || [])[1] || "";
  var state = null, stateAt = 0, view = null, pending = null, root = null, els = {}, missing = false;
  var compareSet = [], chosen = null, needsPrice = null, routeFlag = false, airPicks = {}, interested = {};
  var drawnFor = "", guestInputs = null, lastGuest = "", draftTimer = null, keys = {}, summary = null;

  /* ---------- helpers ---------- */
  function widget() { return window.__rsgStudioInstance || null; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function fmt(s, k, v) { return String(s).replace("{" + k + "}", v); }
  function visitorId() {
    try { var raw = localStorage.getItem("chatwidget_v2_visitorId"); if (!raw) return ""; try { return String(JSON.parse(raw) || ""); } catch (e) { return raw; } } catch (e) { return ""; }
  }
  function msgCount() { try { return (widget().messages.get() || []).length; } catch (e) { return 0; } }
  function store(key, value) { try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch (e) { return null; } }
  function once(key) { if (keys[key] || store(key)) return false; keys[key] = true; store(key, "1"); return true; }
  function sendLine(text, silent) {
    if (FIXTURE) return true;                                     /* the recorded state is not a conversation */
    var w = widget(); if (!w || !w.transport) return false;
    try { if (!silent) w.messages.add({ content: text, sender: "visitor" }); w.transport.send(text); } catch (e) { return false; }
    return true;
  }
  function airportAr(name) { return (B.transport && B.transport.airportsAr && B.transport.airportsAr[name]) || name || ""; }
  function allowed(name, st) { st = st || state; return !!(st && STAGES[name] && STAGES[name].indexOf(st.stage) >= 0); }
  function resortName() { return (state && state.resort) || "Shebara"; }

  /* ---------- the booking state, from the backend through this site's server ---------- */
  function poll() {
    if (FIXTURE) {
      return fetch("tools/views-fixture.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (all) {
        var s = all[FIXTURE]; if (!s) return;
        stateAt = Date.now(); state = s; renderSummary();
        var waited = 0;
        (function whenWidget() {                                   /* open once the widget is up (it docks beside the view) */
          if (widget() || waited > 8000) return open(FIXTURE === "resort" ? "compare" : AUTO[s.stage], true);
          waited += 200; setTimeout(whenWidget, 200);
        })();
      }).catch(function () {});
    }
    var v = visitorId();
    if (!v) { state = null; renderSummary(); return later(); }
    fetch("/api/booking/state?v=" + encodeURIComponent(v), { cache: "no-store" })
      .then(function (r) { missing = r.status === 404; return r.ok ? r.json() : null; })
      .then(function (s) { var prev = stateAt; stateAt = Date.now(); onState(s, prev); })
      .catch(function () {})
      .then(later);
  }
  /* no conversation yet on the backend (before the first message, or after a restart): ask less often */
  function later() { setTimeout(poll, document.hidden ? 4000 : missing ? 6000 : POLL_MS); }
  function fetchNow(done) {
    var v = visitorId(); if (!v) return done();
    fetch("/api/booking/state?v=" + encodeURIComponent(v), { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (s) { if (s) { state = s; stateAt = Date.now(); } done(); }).catch(function () { done(); });
  }

  function onState(s, prevPollAt) {
    state = s;
    if (s) {
      if (s.view === "compare" && s.viewSeq) offerCompare(s.viewSeq, prevPollAt || 0);
      autoOpen(s, prevPollAt || 0);
    }
    checkPending();
    if (view) {
      if (!allowed(view) && !pending) close(true);
      else if (!pending && signature(s) !== drawnFor) render();     /* only when the booking changed: never under the guest's hands */
      else if (view === "guest") syncGuest();
    }
    renderSummary();
  }
  function signature(s) { return s ? JSON.stringify([s.stage, s.prices, s.formError, s.transportSet, s.villa, s.guestSaved, s.redeemed]) : ""; }

  /* after the reply that brought the step has arrived (the bridge updates the state before Studio delivers the reply) */
  function afterReply(since, fn) {
    if (!since) return setTimeout(fn, 600);                       /* first look at this page: the reply is already there */
    var base = msgCount(), last = -1, stable = 0, tries = 0;
    function replyIn() {
      if (msgCount() > base) return true;
      try { var m = widget().messages.get().slice(-1)[0]; return !!m && m.sender === "agent" && Number(m.timestamp || 0) > since; } catch (e) { return false; }
    }
    (function settle() {
      var n = msgCount(); stable = n === last ? stable + 1 : 0; last = n;
      if ((replyIn() && stable >= 4) || tries > 60) return fn();
      tries++; setTimeout(settle, 500);
    })();
  }

  /* ---------- opening: by booking step (once per conversation), the comparison by its card ---------- */
  function autoOpen(s, since) {
    var name = AUTO[s.stage]; if (!name) return;
    var key = "rsg-view-auto:" + visitorId() + ":" + name;
    if (view === name) { once(key); return; }                     /* already open (e.g. the legs after the airports) */
    if (!once(key)) return;
    afterReply(since, function () { if (state && AUTO[state.stage] === name && view !== name) open(name, true); });
  }
  function offerCompare(seq, since) {
    if (!once("rsg-view-offer:" + visitorId() + ":" + seq)) return;
    afterReply(since, function () {
      var e = T.entry.compare;
      try { widget().messages.add({ sender: "agent", type: "rich_components", content: "", components: [{ type: "rsg-view", payload: { view: "compare", title: e[0], body: e[1], button_label: T.open } }] }); } catch (err) {}
    });
  }
  function renderEntry(payload) {                                 /* the chat card (also older cards kept in the history) */
    payload = payload || {};
    var card = el("div", "bv-entry"); card.dir = "rtl"; card.lang = "ar";
    var band = el("div"); band.style.cssText = "height:72px;background:#353e44 center/cover no-repeat;background-image:url('" + LOOK.Shebara.photo + "')";
    var body = el("div"); body.style.cssText = "padding:12px 14px 14px";
    var h = el("div", null, payload.title || ""); h.style.cssText = "font-weight:600;font-size:15px;margin-bottom:3px";
    var p = el("div", null, payload.body || ""); p.style.cssText = "font-size:13px;color:#535e66;margin-bottom:10px";
    var btn = el("button", null, payload.button_label || T.open); btn.type = "button";
    btn.style.cssText = "width:100%;height:40px;border:0;border-radius:9999px;background:#71bfb7;color:#1e282f;font:inherit;font-weight:600;cursor:pointer";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      fetchNow(function () {
        if (allowed(payload.view)) open(payload.view);
        else { btn.disabled = true; btn.textContent = T.done; btn.style.cssText += ";background:#f0f3f5;color:#88949e;cursor:default"; }
      });
    });
    body.appendChild(h); if (payload.body) body.appendChild(p); body.appendChild(btn);
    card.appendChild(band); card.appendChild(body);
    return card;
  }

  /* ---------- decisions sent through the conversation, and their outcome ---------- */
  function decide(line, opts) {
    opts = opts || {};
    if (!sendLine(line, opts.silent)) { status(T.notSent, true); return false; }
    pending = { stage: state ? state.stage : "", count: msgCount(), at: Date.now(), onMove: opts.onMove, onStay: opts.onStay };
    status(T.sent); lockActions(true);
    return true;
  }
  function checkPending() {
    if (!pending || !state) return;
    var p = pending;
    if (state.stage !== p.stage) { pending = null; lockActions(false); status(""); if (p.onMove) p.onMove(); return; }
    if (!p.repliedAt && msgCount() > p.count) p.repliedAt = Date.now();
    if (p.repliedAt && stateAt > p.repliedAt + 300) { pending = null; lockActions(false); status(""); if (p.onStay) p.onStay(); return; }
    if (Date.now() - p.at > 60000) { pending = null; lockActions(false); status(T.slow, true); }
  }
  function lockActions(on) { if (root) Array.prototype.forEach.call(root.querySelectorAll("[data-act]"), function (b) { b.disabled = !!on; }); }
  function status(text, warn) { if (els.status) { els.status.textContent = text || ""; els.status.classList.toggle("is-warn", !!warn); } }

  /* ---------- the overlay: backdrop, header, cards, floating actions ---------- */
  function build() {
    root = el("div", "bv"); root.hidden = true; root.dir = "rtl"; root.lang = "ar";
    root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-labelledby", "bv-title");
    var scroll = el("div", "bv-scroll"), inner = el("div", "bv-inner"), top = el("header", "bv-top"), brand = el("div", "bv-brand");
    scroll.tabIndex = -1;
    var kick = el("div", "bv-kicker"), logo = el("img", "bv-logo"); logo.alt = ""; logo.hidden = true;
    var kt = el("span", null, "The Red Sea"); kick.appendChild(logo); kick.appendChild(kt);
    var title = el("h2", "bv-title"); title.id = "bv-title";
    var sub = el("p", "bv-sub"), tools = el("div", "bv-tools");
    var back = el("button", "bv-back", T.back); back.type = "button"; back.addEventListener("click", function () { close(true); });
    var x = el("button", "bv-x", "×"); x.type = "button"; x.setAttribute("aria-label", T.close); x.addEventListener("click", function () { close(true); });
    brand.appendChild(kick); brand.appendChild(title); brand.appendChild(sub);
    tools.appendChild(back); tools.appendChild(x); top.appendChild(brand); top.appendChild(tools);
    var content = el("div", "bv-content"), actions = el("div", "bv-actions"), st = el("div", "bv-status"); st.setAttribute("role", "status");
    inner.appendChild(top); inner.appendChild(content); inner.appendChild(actions); scroll.appendChild(inner);
    root.appendChild(el("div", "bv-backdrop")); root.appendChild(scroll);
    document.body.appendChild(root);
    els = { scroll: scroll, logo: logo, kicker: kt, title: title, sub: sub, content: content, actions: actions, status: st, x: x };
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && view) close(true); });
    window.addEventListener("resize", function () { if (view) dock(); });
  }
  function open(name, auto) {
    if (!root) build();
    if (view !== name) { compareSet = []; chosen = null; needsPrice = null; routeFlag = false; interested = {}; if (name !== "legs") airPicks = {}; els.scroll.scrollTop = 0; }
    view = name; pending = null; drawnFor = ""; status("");
    root.hidden = false; document.body.classList.add("bv-open");
    dock(); render();
    if (!auto) setTimeout(function () { try { els.x.focus(); } catch (e) {} }, 30);   /* an automatic opening does not take the focus */
  }
  function close(resume) {
    if (!root || !view) return;
    view = null; root.hidden = true; document.body.classList.remove("bv-open"); guestInputs = null;
    var w = widget();
    if (w) { try { w.update({ position: HOME_POS, dimensions: { height: HOME_HEIGHT } }); } catch (e) {} if (resume && !w.isOpen) w.open(); }
    renderSummary();
  }
  function dock() {
    var w = widget(); if (!w) return;
    if (window.innerWidth >= WIDE) {
      try { w.update({ position: { placement: "bottom-left", offsetX: 16, offsetY: 15 }, dimensions: { height: Math.max(420, window.innerHeight - 30) } }); } catch (e) {}
      if (!w.isOpen) w.open();
      root.style.setProperty("--bv-left", DOCK_LEFT + "px");
    } else {
      root.style.removeProperty("--bv-left");
      if (w.isOpen) w.close();
    }
  }
  function head(title, sub) {
    var look = LOOK[resortName()] || LOOK.Shebara;
    els.logo.hidden = !look.logo; if (look.logo) els.logo.src = look.logo;
    els.kicker.textContent = "The Red Sea · " + resortName();
    els.title.textContent = title; els.sub.textContent = sub || "";
  }
  function render() {
    if (!view || !state) return;
    var y = els.scroll.scrollTop;                                   /* the guest's place survives a redraw */
    drawnFor = signature(state);
    els.content.innerHTML = ""; els.actions.innerHTML = ""; els.actions.appendChild(els.status);
    ({ compare: renderCompare, villas: renderVillas, airports: renderAirports, legs: renderLegs, activities: renderActivities, guest: renderGuest, review: renderReview }[view] || function () {})();
    if (pending) lockActions(true);
    els.scroll.scrollTop = y;
  }
  function actionButton(text, cls, onClick) {
    var b = el("button", "bv-btn" + (cls ? " " + cls : ""), text); b.type = "button"; b.setAttribute("data-act", "1");
    b.addEventListener("click", onClick); els.actions.appendChild(b); return b;
  }
  function imageCard(src, alt, kicker, title) {
    var card = el("article", "bv-card"), img = el("img"); img.src = src; img.alt = alt || title; img.loading = "lazy";
    var body = el("div", "bv-cbody"); body.appendChild(el("div", "bv-ckick", kicker)); body.appendChild(el("h3", null, title));
    card.appendChild(img); card.appendChild(body);
    return { card: card, img: img, body: body };
  }
  function tags(list) { var ul = el("ul", "bv-tags"); (list || []).forEach(function (t) { if (t) ul.appendChild(el("li", null, t)); }); return ul; }

  /* ---------- villas: one image-led card each, photos and verified details only (no price before party and dates) ---------- */
  function renderVillas() {
    head(fmt(T.villasTitle, "r", resortName()), T.villasSub);
    var list = (state.catalog && state.catalog.villas) || [];
    if (compareSet.length >= 2) els.content.appendChild(villaTable(list.filter(function (v) { return compareSet.indexOf(v.name) >= 0; })));
    var grid = el("div", "bv-grid");
    list.forEach(function (v) {
      var photos = GALLERY[v.name] || [v.image], c = imageCard(photos[0], v.nameAr, resortName() + " · " + T.villaKick, v.nameAr);
      if (chosen === v.name) c.card.classList.add("is-chosen");
      if (photos.length > 1) {
        var dots = el("div", "bv-dots");
        photos.forEach(function (src, i) {
          var d = el("button"); d.type = "button"; d.setAttribute("aria-label", (i + 1) + " / " + photos.length); d.setAttribute("aria-current", i ? "false" : "true");
          d.addEventListener("click", function () { c.img.src = src; Array.prototype.forEach.call(dots.children, function (x, j) { x.setAttribute("aria-current", j === i ? "true" : "false"); }); });
          dots.appendChild(d);
        });
        c.card.appendChild(dots);
      }
      c.body.appendChild(el("div", "bv-occ", v.occupancyAr));
      c.body.appendChild(tags(String(v.factsAr || "").split(" · ")));
      if (needsPrice === v.name) {                                     /* only after the bridge answered «سعر … أحتاج أتأكد منه» */
        var note = el("div", "bv-note"); note.appendChild(el("b", null, T.needsPrice));
        var use = el("button", "bv-btn-o", T.useVilla); use.type = "button"; use.setAttribute("data-act", "1");
        use.addEventListener("click", function () { chooseVilla(PRICED_VILLA, T.useVilla); });
        note.appendChild(use); c.body.appendChild(note);
      }
      var acts = el("div", "bv-cacts");
      var pick = el("button", "bv-btn", T.choose); pick.type = "button"; pick.setAttribute("data-act", "1");
      pick.addEventListener("click", function () { chooseVilla(v.name); });
      var cmp = el("button", "bv-btn-o", T.compare); cmp.type = "button"; cmp.setAttribute("aria-pressed", compareSet.indexOf(v.name) >= 0 ? "true" : "false");
      cmp.addEventListener("click", function () {
        var i = compareSet.indexOf(v.name);
        if (i >= 0) compareSet.splice(i, 1); else { if (compareSet.length >= 3) compareSet.shift(); compareSet.push(v.name); }
        render(); if (compareSet.length >= 2) els.scroll.scrollTop = 0;
      });
      acts.appendChild(pick); acts.appendChild(cmp); c.body.appendChild(acts);
      grid.appendChild(c.card);
    });
    els.content.appendChild(grid);
  }
  function villaTable(list) {
    var wrap = el("div", "bv-tile bv-tablewrap"), bar = el("div", "bv-tablebar"), hide = el("button", "bv-btn-o", T.hideCompare);
    hide.type = "button"; hide.addEventListener("click", function () { compareSet = []; render(); });
    bar.appendChild(el("b", null, T.compareTitle)); bar.appendChild(hide); wrap.appendChild(bar);
    var t = el("table", "bv-table bv-stack"), thead = el("thead"), tr = el("tr");
    tr.appendChild(el("th")); list.forEach(function (v) { tr.appendChild(el("th", null, v.nameAr)); });
    thead.appendChild(tr); t.appendChild(thead);
    var tb = el("tbody");
    T.rows.forEach(function (label, r) {
      var row = el("tr"); row.appendChild(el("th", null, label));
      list.forEach(function (v) { var parts = String(v.factsAr || "").split(" · "), td = el("td", null, r === 0 ? v.occupancyAr : (parts[r - 1] || T.none)); td.setAttribute("data-label", v.nameAr); row.appendChild(td); });
      tb.appendChild(row);
    });
    t.appendChild(tb); wrap.appendChild(t);
    return wrap;
  }
  function chooseVilla(name, quickLine) {
    chosen = name; needsPrice = null;
    decide(quickLine || ("أختار " + name + " على Villa Flat Rate."), {
      onMove: function () { close(true); },                                /* the priced villa: on to the party question */
      onStay: function () { needsPrice = name; render(); }                 /* the bridge kept the villa step: price needs confirming */
    });
    render();
  }

  /* ---------- the resort comparison (opened from its chat card) ---------- */
  function renderCompare() {
    head(T.cmpTitle, T.cmpSub);
    var grid = el("div", "bv-grid"); grid.style.marginBottom = "26px";
    [["Shebara", "assets/resorts/shebara.webp", "جزيرة في البحر الأحمر"], ["Desert Rock", "assets/resorts/desert-rock.webp", "منتجع جبلي في وادٍ"]].forEach(function (r) {
      var c = imageCard(r[1], r[0], "The Red Sea", r[0]); c.card.style.aspectRatio = "4 / 3";
      c.body.querySelector("h3").className = "bv-ltr"; c.body.appendChild(el("div", "bv-occ", r[2]));
      var acts = el("div", "bv-cacts"), b = el("button", "bv-btn", fmt(T.pick, "r", r[0])); b.type = "button"; b.setAttribute("data-act", "1");
      b.addEventListener("click", function () { decide("نختار " + r[0] + ".", { onMove: function () { close(true); } }); });
      acts.appendChild(b); c.body.appendChild(acts); grid.appendChild(c.card);
    });
    els.content.appendChild(grid);
    var wrap = el("div", "bv-tile bv-tablewrap"), t = el("table", "bv-table bv-stack"), thead = el("thead"), tr = el("tr");
    tr.appendChild(el("th"));
    [["Shebara", "assets/resorts/shebara.webp"], ["Desert Rock", "assets/resorts/desert-rock.webp"]].forEach(function (r) {
      var th = el("th"), h = el("div", "bv-rhead"), img = el("img"); img.src = r[1]; img.alt = r[0];
      h.appendChild(img); h.appendChild(el("span", "bv-ltr", r[0])); th.appendChild(h); tr.appendChild(th);
    });
    thead.appendChild(tr); t.appendChild(thead);
    var tb = el("tbody");
    CMP.forEach(function (c) {
      var row = el("tr"), th = el("th", null, c.title); th.appendChild(el("small", null, c.question)); row.appendChild(th);
      var a = el("td", null, c.shebara), b = el("td", null, c.desertRock); a.setAttribute("data-label", "Shebara"); b.setAttribute("data-label", "Desert Rock");
      row.appendChild(a); row.appendChild(b); tb.appendChild(row);
      if (c.diff) { var d = el("tr", "bv-diff"), dl = el("td", null, (c.diffLabel || "الفرق") + ": " + c.diff); dl.colSpan = 3; d.appendChild(dl); tb.appendChild(d); }
    });
    t.appendChild(tb); wrap.appendChild(t); els.content.appendChild(wrap);
  }

  /* ---------- airports: one card per airport, for arrival and for departure ---------- */
  function renderAirports() {
    head(T.apTitle, T.apSub);
    var tr = B.transport || {};
    [["in", T.arrive], ["out", T.depart]].forEach(function (g) {
      els.content.appendChild(el("h3", "bv-group-h", g[1]));
      var row = el("div", "bv-tiles");
      (tr.airports || []).forEach(function (a) {
        var b = el("button", "bv-tile bv-ap"); b.type = "button"; b.setAttribute("aria-pressed", airPicks[g[0]] === a ? "true" : "false");
        var icon = el("span", "bv-ap-icon"); icon.innerHTML = PLANE; if (g[0] === "in") icon.style.transform = "scaleX(-1)";
        b.appendChild(icon); b.appendChild(el("b", null, airportAr(a))); b.appendChild(el("small", "bv-ltr", a)); b.appendChild(el("span", "bv-ap-check", T.picked));
        b.addEventListener("click", function () { airPicks[g[0]] = a; routeFlag = false; render(); });
        row.appendChild(b);
      });
      els.content.appendChild(row);
    });
    if (routeFlag) {
      var note = el("div", "bv-note"); note.style.maxWidth = "560px"; note.appendChild(el("b", null, T.apRoute));
      var use = el("button", "bv-btn-o", T.apUse); use.type = "button"; use.setAttribute("data-act", "1");
      use.addEventListener("click", function () { decide(T.apUse, { onMove: afterAirports }); });
      note.appendChild(use); els.content.appendChild(note);
    }
    var sub = actionButton(T.apSubmit, "", function () {
      decide("مطار الوصول: " + airportAr(airPicks["in"]) + ", مطار المغادرة: " + airportAr(airPicks.out), {
        onMove: afterAirports,
        onStay: function () { routeFlag = true; render(); }                   /* an unpriced pair: the bridge kept the airports step */
      });
    });
    sub.disabled = !(airPicks["in"] && airPicks.out);
  }
  function afterAirports() { routeFlag = false; if (state && state.stage === "approve2") open("legs", true); else close(true); }

  /* ---------- trip legs and totals: one image-led card per leg ---------- */
  function renderLegs() {
    head(T.legsTitle, T.legsSub);
    var legs = (B.transport && B.transport.legs) || [], row = el("div", "bv-legs");
    legs.forEach(function (l, i) {
      var card = el("article", "bv-tile bv-leg"), ph = el("div", "bv-leg-photo"), img = el("img");
      img.src = l.image || ""; img.alt = l.imageAlt || ""; img.loading = "lazy"; ph.appendChild(img); ph.appendChild(el("span", "bv-badge", i ? T.legOut : T.legIn));
      var body = el("div", "bv-leg-body"), route = el("p", "bv-route");
      route.appendChild(el("b", null, airportAr(l.from))); route.appendChild(el("span", null, "←")); route.appendChild(el("b", null, airportAr(l.to)));
      body.appendChild(route); body.appendChild(el("h3", null, l.productAr || l.product));
      [l.durationAr].concat(l.capacityAr || [], [l.neededAr]).forEach(function (d) { if (d) body.appendChild(el("p", null, d)); });
      var amt = el("p", "bv-amount"); amt.appendChild(el("span", "bv-ltr", "SAR " + Number(l.price).toLocaleString("en-US", { minimumFractionDigits: 2 }))); body.appendChild(amt);
      if (l.priceBasisAr) body.appendChild(el("p", null, l.priceBasisAr));
      card.appendChild(ph); card.appendChild(body); row.appendChild(card);
    });
    els.content.appendChild(row);
    var sum = el("div", "bv-tile bv-sum"); sum.appendChild(priceRows(["stay", "transfers"])); sum.appendChild(totalLine("total")); els.content.appendChild(sum);
    actionButton(T.legsApprove, "", function () { decide("اعتمد ونكمل", { onMove: function () { close(true); } }); });
  }
  function priceRows(keys) {
    var dl = el("dl", "bv-rows"), pr = state.prices || {}, label = { stay: T.stay, transfers: T.transfers };
    keys.forEach(function (k) { if (!pr[k]) return; dl.appendChild(el("dt", null, label[k])); var dd = el("dd"); dd.appendChild(el("span", "bv-ltr", pr[k])); dl.appendChild(dd); });
    return dl;
  }
  function totalLine(k) {
    var pr = state.prices || {}; if (!pr[k]) return document.createDocumentFragment();
    var dl = el("dl", "bv-rows"); dl.appendChild(el("dt", null, k === "payable" ? T.payable : T.total));
    var dd = el("dd", "bv-total"); dd.appendChild(el("span", "bv-ltr", pr[k])); dd.appendChild(el("small", null, pr.taxNote || "")); dl.appendChild(dd);
    return dl;
  }

  /* ---------- activities: one image-led card each; interest only, nothing is added to the booking ---------- */
  function renderActivities() {
    head(T.actTitle, T.actSub);
    var grid = el("div", "bv-grid");
    (B.activities || []).forEach(function (a) {
      var c = imageCard(a.image, a.imageAlt, a.categoryAr || a.category, a.nameAr || a.name);
      c.body.appendChild(tags(a.tagsAr || a.tags));
      if (a.priceAr) { var p = el("div", "bv-price"); p.appendChild(document.createTextNode(a.priceAr)); c.body.appendChild(p); }
      if (interested[a.nameAr]) { var n = el("div", "bv-note is-info", T.interested); c.body.appendChild(n); }
      var acts = el("div", "bv-cacts"), b = el("button", "bv-btn-o", T.interest); b.type = "button"; b.setAttribute("data-act", "1");
      b.setAttribute("aria-pressed", interested[a.nameAr] ? "true" : "false");
      b.addEventListener("click", function () { decide("مهتم بتجربة " + a.nameAr, { onStay: function () { interested[a.nameAr] = true; render(); } }); });
      acts.appendChild(b); c.body.appendChild(acts); grid.appendChild(c.card);
    });
    els.content.appendChild(grid);
    actionButton(T.defer, "", function () { decide(T.defer, { onMove: function () { close(true); } }); });
  }

  /* ---------- the folio: guest details (editable until payment) and the review ---------- */
  function folio() {
    var f = el("div", "bv-folio"), band = el("div", "bv-folio-band"), inner = el("div"), look = LOOK[resortName()] || LOOK.Shebara;
    band.style.backgroundImage = "url('" + look.photo + "')";
    if (look.logo) { var lg = el("img", "bv-logo"); lg.src = look.logo; lg.alt = resortName(); inner.appendChild(lg); } else inner.appendChild(el("b", "bv-ltr", resortName()));
    inner.appendChild(el("span", null, "The Red Sea"));
    band.appendChild(inner); f.appendChild(band);
    var body = el("div", "bv-folio-body"); f.appendChild(body);
    els.content.appendChild(f);
    return body;
  }
  function section(parent, title, aside) {
    var s = el("section", "bv-sec"), h = el("div", "bv-sec-head"); h.appendChild(el("h3", null, title));
    if (aside) h.appendChild(aside);
    s.appendChild(h); parent.appendChild(s); return s;
  }
  function renderGuest() {
    head(T.gTitle, T.gSub);
    var body = folio(), g = state.guest || {}, err = state.formError || null, errKey = err ? ERR_FIELD[err.field] || err.field : "";
    var fromChat = { title: !state.guestSaved && !!g.title, firstName: !state.guestSaved && !!g.firstName };
    var inputs = {}, form = el("form"); form.noValidate = true; form.style.display = "contents";
    function field(grid, key, type, required, wide) {
      var f = el("div", "bv-f" + (wide ? " is-wide" : "")), lab = el("label"), id = "bv-g-" + key, inp;
      lab.htmlFor = id; lab.appendChild(document.createTextNode(T.labels[key]));
      lab.appendChild(required ? el("span", "req", "*") : el("span", "bv-opt", T.optional));
      if (fromChat[key]) lab.appendChild(el("span", "bv-tag", T.fromChat));
      f.appendChild(lab);
      if (type === "title") {
        inp = el("select"); inp.appendChild(new Option(T.choose1, "")); ["السيد", "السيدة"].forEach(function (t) { inp.appendChild(new Option(t, t)); });
        if (g.title && ["السيد", "السيدة"].indexOf(g.title) < 0) inp.appendChild(new Option(g.title, g.title));
        f.appendChild(inp);
      } else if (type === "mobile") {
        var row = el("div", "bv-mobile"), code = el("select", "bv-code"); code.id = "bv-g-mobileCode";
        CODES.forEach(function (c) { code.appendChild(new Option(c, c)); }); code.value = g.mobileCode || "+966"; inputs.mobileCode = code; code.addEventListener("change", changed);
        inp = el("input"); inp.type = "tel"; inp.inputMode = "tel"; inp.autocomplete = "tel-national";
        row.appendChild(code); row.appendChild(inp); f.appendChild(row);
      } else if (type === "textarea") { inp = el("textarea"); inp.maxLength = 150; f.appendChild(inp); }
      else { inp = el("input"); inp.type = type; if (type === "email") { inp.inputMode = "email"; inp.autocomplete = "email"; } f.appendChild(inp); }
      inp.id = id; inp.value = g[key] || ""; inputs[key] = inp;
      inp.addEventListener("input", changed); inp.addEventListener("change", changed);
      if (errKey === key && err.text) { f.classList.add("has-err"); f.appendChild(el("div", "bv-err", err.text)); }
      f.setAttribute("data-key", key); if (required) f.setAttribute("data-req", "1");
      grid.appendChild(f);
    }
    function group(i) { var s = section(form, T.gGroups[i]), grid = el("div", "bv-fields"); s.appendChild(grid); return grid; }
    var g1 = group(0); field(g1, "title", "title", true); field(g1, "firstName", "text", true); field(g1, "familyName", "text", true, true);
    var g2 = group(1); field(g2, "email", "email", true, true); field(g2, "mobile", "mobile", true, true);
    if (!(state.adults < 2)) { var g3 = group(2); field(g3, "guest2First", "text", false); field(g3, "guest2Family", "text", false); }
    var g4 = group(3); field(g4, "requests", "textarea", false, true);
    if (inputs.title) inputs.title.value = g.title || "";
    body.appendChild(form);
    guestInputs = inputs; lastGuest = JSON.stringify(g);
    actionButton(T.gSubmit, "", function () {
      var v = values(), bad = validate(v);
      if (bad) { status(bad.msg, true); try { inputs[bad.key].focus(); } catch (e) {} return; }
      clearTimeout(draftTimer); saveDraft(v);
      var line = window.RSGComponents && window.RSGComponents.detailsLine ? window.RSGComponents.detailsLine(v) : "";
      if (!line) { status(T.notSent, true); return; }
      decide(line, {
        silent: true,                                                           /* as the in-chat form: no long visitor bubble */
        onMove: function () { close(true); },                                   /* guest / requests → review */
        onStay: function () { if (state.formError) render(); else close(true); }   /* an edit at the review */
      });
    });
    function values() {
      var v = {}; Object.keys(T.labels).forEach(function (k) { v[k] = inputs[k] ? String(inputs[k].value || "").trim() : ""; });
      v.mobileCode = inputs.mobileCode ? inputs.mobileCode.value : "+966"; return v;
    }
    function validate(v) {
      var req = ["title", "firstName", "familyName", "email", "mobile"];
      for (var i = 0; i < req.length; i++) if (!v[req[i]]) return { key: req[i], msg: T.labels[req[i]] + ": " + T.needField };
      if (!EMAIL_RE.test(v.email)) return { key: "email", msg: T.needEmail };
      var d = v.mobile.replace(/\D/g, ""); if (d.length >= 10 && d.charAt(0) === "0") d = d.slice(1);
      if (d.length < 7 || d.length > 14) return { key: "mobile", msg: T.needMobile };
      return null;
    }
    function changed() {
      var v = values(), n = 0;
      Array.prototype.forEach.call(body.querySelectorAll(".bv-f[data-req]"), function (f) { var k = f.getAttribute("data-key"), empty = !v[k]; f.classList.toggle("is-missing", empty); if (empty) n++; });
      if (!pending) status(n === 1 ? T.missing1 : n === 2 ? T.missing2 : n ? fmt(T.missing, "n", n) : "");
      clearTimeout(draftTimer); draftTimer = setTimeout(function () { saveDraft(values()); }, 700);
    }
    changed(); clearTimeout(draftTimer);
  }
  function syncGuest() {
    /* a detail corrected in the chat while the form is open: the server's new value goes into that field, briefly
       highlighted, unless the guest is typing in it; the guest's own unsaved typing elsewhere is left alone */
    if (!guestInputs || !state || !state.guest) return;
    var now = JSON.stringify(state.guest); if (now === lastGuest) return;
    var before = {}; try { before = JSON.parse(lastGuest || "{}"); } catch (e) {}
    Object.keys(guestInputs).forEach(function (k) {
      var inp = guestInputs[k], v = state.guest[k];
      if (v == null || before[k] === v || inp === document.activeElement || String(inp.value) === String(v)) return;
      inp.value = v; inp.style.background = "var(--aqua-50)"; setTimeout(function () { inp.style.background = ""; }, 1600);
    });
    lastGuest = now;
  }
  function saveDraft(v) {
    var id = visitorId(); if (!id) return;
    fetch("/api/booking/draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ v: id, fields: v }) })
      .then(function (r) { if (r.ok && view === "guest" && !pending && els.status && !els.status.textContent) status(T.saved); }).catch(function () {});
  }
  function renderReview() {
    head(T.rTitle, T.rSub);
    var body = folio(), g = state.guest || {}, legs = (B.transport && B.transport.legs) || [];
    function rows(s, list) {
      var dl = el("dl", "bv-rows");
      list.forEach(function (r) { if (!r[1]) return; dl.appendChild(el("dt", null, r[0])); var dd = el("dd"); dd.appendChild(r[2] ? el("span", "bv-ltr", r[1]) : document.createTextNode(r[1])); dl.appendChild(dd); });
      s.appendChild(dl);
    }
    rows(section(body, T.rSecs[0], el("span", null, T.rLocked)), [[T.resort, state.resort, true], [T.villa, state.villaAr], [T.rate, state.rate, true], [T.dates, state.dates + (state.nights ? " · " + state.nights : "")], [T.guests, state.party]]);
    rows(section(body, T.rSecs[1], el("span", null, T.rLocked)), [[T.legIn, airportAr(state.arrivalAirport) + (legs[0] ? " · " + legs[0].productAr : "")], [T.legOut, airportAr(state.departureAirport) + (legs[1] ? " · " + legs[1].productAr : "")]]);
    var edit = el("button", "bv-link", T.rEdit); edit.type = "button"; edit.setAttribute("data-act", "1"); edit.addEventListener("click", function () { open("guest"); });
    var comp = ((g.guest2First || "") + " " + (g.guest2Family || "")).trim();
    rows(section(body, T.rSecs[2], edit), [[T.guests, [g.title, g.firstName, g.familyName].join(" ").trim() + (comp ? " · " + comp : "")], [T.contact, g.email, true], [T.mobile, ((g.mobileCode || "") + " " + (g.mobile || "")).trim(), true], [T.request, g.requests]]);
    var ps = section(body, T.rSecs[3]); ps.appendChild(priceRows(["stay", "transfers"]));
    if (state.redeemed) { var rd = el("dl", "bv-rows"); rd.appendChild(el("dt", null, T.redeemed)); rd.appendChild(el("dd", null, state.redeemed.points + " · " + state.redeemed.value)); ps.appendChild(rd); }
    ps.appendChild(totalLine(state.redeemed ? "payable" : "total"));
    actionButton(T.rConfirm, "is-dark", function () { decide(T.rConfirm, { onMove: function () { close(true); } }); });
  }

  /* ---------- «حجزك» ---------- */
  function currentView(s) { var a = AUTO[s.stage]; return a && allowed(a, s) ? a : (s.view === "compare" && allowed("compare", s) ? "compare" : null); }
  function renderSummary() {
    if (!summary) {
      summary = el("div", "bv-summary"); summary.dir = "rtl"; summary.lang = "ar"; summary.hidden = true;
      summary.pill = el("button", "bv-summary-pill"); summary.pill.type = "button"; summary.pill.setAttribute("aria-expanded", "false");
      summary.card = el("div", "bv-summary-card"); summary.card.hidden = true;
      summary.pill.addEventListener("click", function () { var o = summary.card.hidden; summary.card.hidden = !o; summary.pill.setAttribute("aria-expanded", o ? "true" : "false"); });
      summary.appendChild(summary.card); summary.appendChild(summary.pill); document.body.appendChild(summary);
    }
    var s = state;
    summary.hidden = !(s && s.resort);
    if (summary.hidden) return;
    var pr = s.prices || {}, price = pr.payable || pr.total || pr.stay || "";
    summary.pill.innerHTML = "";
    summary.pill.appendChild(el("b", null, T.sumTitle));
    summary.pill.appendChild(document.createTextNode(" · " + s.resort));
    if (s.villaAr) summary.pill.appendChild(el("span", "bv-pill-villa", " · " + s.villaAr));   /* hidden on phones */
    if (price) { summary.pill.appendChild(document.createTextNode(" · ")); summary.pill.appendChild(el("span", "bv-ltr", price)); }
    var c = summary.card; c.innerHTML = ""; c.appendChild(el("h3", null, T.sumTitle));
    var dl = el("dl", "bv-rows");
    [[T.resort, s.resort], [T.villa, s.villaAr], [T.guests, s.party], [T.dates, s.dates ? s.dates + " · " + s.nights : ""],
     [T.transfers, s.transportSet ? airportAr(s.arrivalAirport) + " ← " + airportAr(s.departureAirport) : ""],
     [T.stay, pr.stay], [T.total, pr.payable || pr.total]].forEach(function (r) {
      dl.appendChild(el("dt", null, r[0])); dl.appendChild(el("dd", r[1] ? null : "is-todo", r[1] || T.todo));
    });
    c.appendChild(dl);
    var cur = currentView(s);
    if (cur) { var b = el("button", "bv-btn", T.current); b.type = "button"; b.addEventListener("click", function () { c.hidden = true; open(cur); }); c.appendChild(b); }
    if (s.pdf) { var a = el("a", null, T.pdf); a.href = s.pdf; a.target = "_blank"; a.rel = "noopener"; a.style.display = "block"; a.style.marginTop = "10px"; c.appendChild(a); }
  }

  /* ---------- start ---------- */
  function register() {
    var w = widget(); if (!w || typeof w.registerComponent !== "function" || register.done) return !!register.done;
    ["rsg-view", "rsg_view"].forEach(function (t) { w.registerComponent(t, renderEntry); });
    register.done = true; return true;
  }
  if (!register()) {
    document.addEventListener("rsg:widget-ready", register);
    var tries = 0, timer = setInterval(function () { if (register() || ++tries > 200) clearInterval(timer); }, 250);
  }
  poll();
  window.RSGBookingViews = { open: function (name) { fetchNow(function () { if (allowed(name)) open(name); }); }, close: close, state: function () { return state; }, view: function () { return view; } };
})();
