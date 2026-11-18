/* RSG custom rich components for the Empathy Studio web widget (core.min.js 1.15.0), registered from the page:
   - rsg_date_range  : check-in / check-out calendar, Saturday first, both dates submitted together
   - rsg_guest_form  : the guest details form, prefilled, title rule applied by the application
   Renderer contract (SDK, verified): (payload, onSelect, selection) => HTMLElement. onSelect(value) adds a visitor
   bubble, posts the value and locks the component; widget.transport.send(value) posts without a bubble.
   The calendar uses onSelect (its line reads naturally in the chat). The form submits silently through
   transport.send and redraws itself as the completed form; its submitted state is kept by this page in
   localStorage keyed by the widget session, because only onSelect writes the SDK's own selection record.
   Wording: the approved lines of the live build (data/script.js: customer.dates, words.nights, words.fieldNames).
   Studio stays read-only; the component slugs (rsg_date_range, rsg_guest_form) are registered in both spellings. */
(function () {
  "use strict";
  var MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  var WEEKDAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];   /* Saturday first (owner, 11 Nov) */
  var NIGHTS = { 1: "ليلة واحدة", 2: "ليلتان", many: "{n} ليالٍ", lots: "{n} ليلة" };
  var WORD = {
    title: "اللقب", firstName: "الاسم الأول", familyName: "اسم العائلة", email: "البريد الإلكتروني", mobileCode: "رمز الدولة",
    mobile: "رقم الجوال", guest2First: "الاسم الأول للمرافق", guest2Family: "اسم عائلة المرافق", requests: "طلبات خاصة",
    optional: "اختياري", choose: "اختر", submitted: "تم الإرسال", sending: "جارٍ الإرسال…", checkIn: "الوصول", checkOut: "المغادرة",
    pickIn: "اختر يوم الوصول", pickOut: "اختر يوم المغادرة", tooShort: "أقل مدة {n}", tooLong: "أقصى مدة {n}",
    needEmail: "اكتب بريدًا إلكترونيًا صحيحًا", needMobile: "اكتب رقم جوال من 7 إلى 14 رقمًا", needField: "هذا الحقل مطلوب",
    notSent: "ما وصلت البيانات، حاول مرة أخرى.", editHint: "تقدر تعدّل أي حقل قبل الاعتماد."
  };
  var TITLES = ["السيد", "السيدة"];
  var CODES = ["+966", "+971", "+974", "+965", "+973", "+968", "+962", "+20", "+1", "+44"];
  var MAX_LINE = 900, MAX_REQUEST = 150, REPLY_TIMEOUT = 60000;
  var STYLE_ATTR = "data-rsg-components";

  /* ---------- helpers ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function s(v) { return v == null ? "" : String(v); }
  function clean(v) { v = s(v).trim(); return v === "-" ? "" : v; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(y, m, d) { return y + "-" + pad(m) + "-" + pad(d); }
  function parts(isoStr) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s(isoStr).trim()); return m ? { y: +m[1], m: +m[2], d: +m[3] } : null; }
  function daysIn(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }                  /* m is 1-based: day 0 of next month */
  function dow(y, m, d) { return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); }               /* 0 = Sunday, UTC so no local shift */
  function satIndex(y, m, d) { return (dow(y, m, d) + 1) % 7; }                               /* 0 = Saturday */
  function epochDays(p) { return Math.round(Date.UTC(p.y, p.m - 1, p.d) / 86400000); }
  function nightsBetween(a, b) { var pa = parts(a), pb = parts(b); return pa && pb ? epochDays(pb) - epochDays(pa) : 0; }
  function nightsWord(n) { if (NIGHTS[n]) return NIGHTS[n]; return (n >= 3 && n <= 10 ? NIGHTS.many : NIGHTS.lots).replace("{n}", n); }
  function arDate(isoStr) { var p = parts(isoStr); return p ? p.d + " " + MONTHS[p.m - 1] + " " + p.y : ""; }
  function datesLine(a, b) { return "الوصول " + arDate(a) + " والمغادرة " + arDate(b) + "، " + nightsWord(nightsBetween(a, b)) + "."; }
  var LINE_RE = new RegExp("^الوصول (\\d{1,2}) (\\S+) (\\d{4}) والمغادرة (\\d{1,2}) (\\S+) (\\d{4})");
  function parseDatesLine(line) {
    var m = LINE_RE.exec(s(line).trim()); if (!m) return null;
    var mi = MONTHS.indexOf(m[2]) + 1, mo = MONTHS.indexOf(m[5]) + 1; if (!mi || !mo) return null;
    return { a: iso(+m[3], mi, +m[1]), b: iso(+m[6], mo, +m[4]) };
  }
  function hash(str) { var h = 5381, i; for (i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(16); }
  function widget() { return window.__rsgStudioInstance || null; }
  function sessionId() { try { var w = widget(); return (w && w.session && w.session.sessionId) || ""; } catch (e) { return ""; } }
  function store(key, value) { try { if (value === undefined) return JSON.parse(localStorage.getItem(key) || "null"); localStorage.setItem(key, JSON.stringify(value)); } catch (e) { return null; } }
  function injectStyles(root) {
    /* the widget keeps every bubble inside its shadow root: inject once there (SDK guide pattern) */
    requestAnimationFrame(function () {
      var sr = root.getRootNode && root.getRootNode();
      if (sr && sr.querySelector && !sr.querySelector("style[" + STYLE_ATTR + "]")) {
        var st = el("style"); st.setAttribute(STYLE_ATTR, "1"); st.textContent = CSS; sr.appendChild(st);
      }
    });
  }

  /* ---------- styles (theme variables of the widget) ---------- */
  var CSS = [
    ".rsg-card{border:1.5px solid var(--border-color,#e5e7eb);border-radius:14px;padding:14px 14px 12px;margin:4px 0;background:var(--background-color,#fff);color:var(--text-color,#1f2937);font-family:var(--font-family,system-ui,sans-serif);direction:rtl;text-align:right;font-size:14px}",
    ".rsg-card *{box-sizing:border-box}",
    ".rsg-title{font-weight:600;font-size:15px;margin:0 0 10px}",
    ".rsg-btn{display:block;width:100%;margin-top:12px;padding:10px 14px;border:0;border-radius:10px;background:var(--primary-color,#0f766e);color:#fff;font:inherit;font-weight:600;cursor:pointer}",
    ".rsg-btn:disabled{opacity:.45;cursor:default}",
    ".rsg-hint{font-size:12px;color:#6b7280;margin-top:8px;min-height:16px}",
    ".rsg-err{font-size:12px;color:#b91c1c;margin-top:4px}",
    ".rsg-state{font-size:12px;color:var(--primary-color,#0f766e);font-weight:600;margin-top:10px}",
    /* calendar */
    ".rdr-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}",
    ".rdr-nav button{border:1px solid var(--border-color,#e5e7eb);background:transparent;color:inherit;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:16px}",
    ".rdr-nav button:disabled{opacity:.3;cursor:default}",
    ".rdr-month{font-weight:600}",
    ".rdr-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}",
    ".rdr-wd{font-size:10.5px;color:#6b7280;text-align:center;padding:4px 0}",
    ".rdr-day{height:36px;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;font-variant-numeric:tabular-nums;cursor:pointer}",
    ".rdr-day:disabled{color:#c4c9cf;cursor:default}",
    ".rdr-day.in-range{background:color-mix(in srgb,var(--primary-color,#0f766e) 18%,transparent)}",
    ".rdr-day.edge{background:var(--primary-color,#0f766e);color:#fff;font-weight:600}",
    ".rdr-day.today{text-decoration:underline}",
    ".rdr-sum{display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:13px}",
    ".rdr-sum b{font-weight:600}",
    ".rsg-card.is-locked .rdr-day,.rsg-card.is-locked .rdr-nav button{pointer-events:none}",
    /* form */
    ".gf-row{display:grid;grid-template-columns:1fr;gap:4px;margin-bottom:10px}",
    ".gf-row label{font-size:12.5px;color:#374151}",
    ".gf-row label .req{color:#b91c1c;margin-inline-start:2px}",
    ".gf-row label .opt{color:#9ca3af;font-size:11px;margin-inline-start:4px}",
    ".gf-row input,.gf-row select,.gf-row textarea{width:100%;padding:9px 10px;border:1px solid var(--border-color,#e5e7eb);border-radius:9px;font:inherit;font-size:14px;background:#fff;color:inherit;direction:rtl}",
    ".gf-row input[type=email],.gf-row input[type=tel],.gf-code{direction:ltr;text-align:left}",
    ".gf-row input:focus,.gf-row select:focus,.gf-row textarea:focus{outline:2px solid color-mix(in srgb,var(--primary-color,#0f766e) 45%,transparent);outline-offset:1px}",
    ".gf-row.has-err input,.gf-row.has-err select{border-color:#b91c1c}",
    ".gf-mobile{display:grid;grid-template-columns:92px 1fr;gap:6px}",
    ".gf-done{display:grid;grid-template-columns:1fr;gap:6px}",
    ".gf-done .gf-kv{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px solid var(--border-color,#eef0f2);font-size:13.5px}",
    ".gf-done .gf-kv span:first-child{color:#6b7280}",
    ".gf-done .gf-kv bdi{direction:ltr;unicode-bidi:isolate}"
  ].join("\n");

  /* =====================================================================================================
     rsg_date_range
     ===================================================================================================== */
  function renderDateRange(payload, onSelect, selection) {
    payload = payload || {};
    var root = el("div", "rsg-card rdr"); root.dir = "rtl"; root.lang = "ar";
    injectStyles(root);
    var minD = clean(payload.min_date), maxD = clean(payload.max_date);
    var minN = Math.max(1, parseInt(payload.min_nights, 10) || 1), maxN = parseInt(payload.max_nights, 10) || 30;
    var lock = payload.lock_after_selection !== false;
    var a = clean(payload.initial_check_in), b = clean(payload.initial_check_out);
    if (!parts(a)) a = ""; if (!parts(b)) b = "";
    var restored = selection && parseDatesLine(selection.value);
    if (restored) { a = restored.a; b = restored.b; }
    var locked = lock && !!selection;
    var p0 = parts(a || minD || iso(new Date().getFullYear(), new Date().getMonth() + 1, 1)) || { y: 2026, m: 10, d: 1 };
    var view = { y: p0.y, m: p0.m };
    if (payload.main_title) root.appendChild(el("p", "rsg-title", clean(payload.main_title)));

    var nav = el("div", "rdr-nav"), prev = el("button", null, "‹"), next = el("button", null, "›"), monthEl = el("div", "rdr-month");
    prev.type = next.type = "button"; prev.setAttribute("aria-label", "الشهر السابق"); next.setAttribute("aria-label", "الشهر التالي");
    nav.appendChild(next); nav.appendChild(monthEl); nav.appendChild(prev);    /* RTL: next on the right edge reads as "forward" */
    var grid = el("div", "rdr-grid"), sum = el("div", "rdr-sum"), hint = el("div", "rsg-hint");
    var btn = el("button", "rsg-btn", clean(payload.submit_label) || "اعتماد التواريخ"); btn.type = "button";
    root.appendChild(nav); root.appendChild(grid); root.appendChild(sum); root.appendChild(hint); root.appendChild(btn);

    function inBounds(d) { return (!minD || d >= minD) && (!maxD || d <= maxD); }
    function valid() { if (!a || !b) return false; var n = nightsBetween(a, b); return n >= minN && n <= maxN; }
    function monthIso(y, m) { return iso(y, m, 1); }
    function canPrev() { var y = view.m === 1 ? view.y - 1 : view.y, m = view.m === 1 ? 12 : view.m - 1; return !minD || iso(y, m, daysIn(y, m)) >= minD; }
    function canNext() { var y = view.m === 12 ? view.y + 1 : view.y, m = view.m === 12 ? 1 : view.m + 1; return !maxD || monthIso(y, m) <= maxD; }
    function draw() {
      monthEl.textContent = MONTHS[view.m - 1] + " " + view.y;
      prev.disabled = !canPrev() || locked; next.disabled = !canNext() || locked;
      grid.innerHTML = "";
      WEEKDAYS.forEach(function (w) { grid.appendChild(el("div", "rdr-wd", w.length > 6 ? w.slice(0, 6) : w)); });
      var lead = satIndex(view.y, view.m, 1), n = daysIn(view.y, view.m), i, d;
      for (i = 0; i < lead; i++) grid.appendChild(el("div"));
      var today = iso(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      for (d = 1; d <= n; d++) {
        var dIso = iso(view.y, view.m, d), cell = el("button", "rdr-day", String(d)); cell.type = "button"; cell.setAttribute("data-date", dIso);
        if (!inBounds(dIso) || locked) cell.disabled = true;
        if (dIso === today) cell.classList.add("today");
        if (a && dIso === a) cell.classList.add("edge");
        if (b && dIso === b) cell.classList.add("edge");
        if (a && b && dIso > a && dIso < b) cell.classList.add("in-range");
        cell.addEventListener("click", onDay);
        grid.appendChild(cell);
      }
      sum.innerHTML = "";
      var left = el("span"); left.appendChild(document.createTextNode(WORD.checkIn + ": ")); left.appendChild(el("b", null, a ? arDate(a) : "—"));
      var right = el("span"); right.appendChild(document.createTextNode(WORD.checkOut + ": ")); right.appendChild(el("b", null, b ? arDate(b) : "—"));
      sum.appendChild(left); sum.appendChild(right);
      var nts = a && b ? nightsBetween(a, b) : 0;
      if (locked) hint.textContent = nts ? nightsWord(nts) : "";
      else if (!a) hint.textContent = WORD.pickIn;
      else if (!b) hint.textContent = WORD.pickOut;
      else if (nts < minN) hint.textContent = WORD.tooShort.replace("{n}", nightsWord(minN));
      else if (nts > maxN) hint.textContent = WORD.tooLong.replace("{n}", nightsWord(maxN));
      else hint.textContent = nightsWord(nts);
      btn.disabled = locked || !valid();
      if (locked) { btn.textContent = WORD.submitted; root.classList.add("is-locked"); }
    }
    function onDay(e) {
      if (locked) return;
      var dIso = e.currentTarget.getAttribute("data-date");
      if (!a || (a && b) || dIso <= a) { a = dIso; b = ""; } else { b = dIso; }
      draw();
    }
    prev.addEventListener("click", function () { if (view.m === 1) { view.y--; view.m = 12; } else view.m--; draw(); });
    next.addEventListener("click", function () { if (view.m === 12) { view.y++; view.m = 1; } else view.m++; draw(); });
    btn.addEventListener("click", function () {
      if (locked || !valid()) return;
      var line = datesLine(a, b);
      if (lock) { locked = true; draw(); }
      onSelect(line, 0);                                   /* visible visitor line + post + SDK selection record */
    });
    draw();
    return root;
  }

  /* =====================================================================================================
     rsg_guest_form
     ===================================================================================================== */
  var FIELDS = [
    { key: "title", type: "select", required: true, options: TITLES },
    { key: "firstName", type: "text", required: true, autocomplete: "given-name" },
    { key: "familyName", type: "text", required: true, autocomplete: "family-name" },
    { key: "email", type: "email", required: true, autocomplete: "email" },
    { key: "mobile", type: "mobile", required: true },
    { key: "guest2First", type: "text", required: false },
    { key: "guest2Family", type: "text", required: false },
    { key: "requests", type: "textarea", required: false }
  ];
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function mobileDigits(v) { var d = s(v).replace(/\D/g, ""); if (d.length >= 10 && d.charAt(0) === "0") d = d.slice(1); return d.length >= 7 && d.length <= 14 ? d : ""; }
  function detailsLine(v) {
    var comp = (v.guest2First + " " + v.guest2Family).trim() || "-";
    var req = (v.requests || "").replace(/[\r\n]+/g, " ").trim().slice(0, MAX_REQUEST) || "لا";
    return "بياناتي: اللقب " + v.title + "؛ الاسم الأول " + v.firstName + "؛ اسم العائلة " + v.familyName + "؛ البريد " + v.email +
      "؛ الجوال " + v.mobileCode + " " + v.mobile + "؛ المرافق " + comp + "؛ طلبات: " + req;
  }

  function renderGuestForm(payload, onSelect, selection) {
    payload = payload || {};
    var root = el("div", "rsg-card gf"); root.dir = "rtl"; root.lang = "ar";
    injectStyles(root);
    var ask = payload.title_ask === true || s(payload.title_ask) === "true";
    var values = {
      title: clean(payload.title_value), firstName: clean(payload.first_name), familyName: clean(payload.family_name),
      email: clean(payload.email), mobileCode: clean(payload.mobile_code) || "+966", mobile: clean(payload.mobile),
      guest2First: clean(payload.companion_first_name), guest2Family: clean(payload.companion_family_name), requests: clean(payload.requests)
    };
    var errField = clean(payload.error_field), errText = clean(payload.error_text);
    var key = "rsg:form:" + sessionId() + ":" + hash(JSON.stringify(payload));
    var saved = store(key);
    var submitted = !!(saved && saved.values) || !!selection;
    if (saved && saved.values) values = saved.values;
    var title = clean(payload.main_title) || "بيانات الحجز";
    root.appendChild(el("p", "rsg-title", title));

    if (submitted) { drawDone(root, values, saved ? saved.state : "sent"); return root; }

    var inputs = {}, rows = {};
    FIELDS.forEach(function (f) {
      var row = el("div", "gf-row"), lab = el("label"), id = "rsg-gf-" + f.key + "-" + Math.random().toString(36).slice(2, 7);
      var labelText = f.key === "title" && ask && payload.title_question ? clean(payload.title_question) : WORD[f.key];
      lab.textContent = labelText; lab.htmlFor = id;
      lab.appendChild(f.required ? el("span", "req", "*") : el("span", "opt", "(" + WORD.optional + ")"));
      row.appendChild(lab);
      var inp;
      if (f.type === "select") {
        inp = el("select"); inp.id = id;
        var ph = el("option", null, WORD.choose); ph.value = ""; inp.appendChild(ph);
        var opts = f.options.slice(); if (values[f.key] && opts.indexOf(values[f.key]) < 0) opts.push(values[f.key]);
        opts.forEach(function (o) { var op = el("option", null, o); op.value = o; inp.appendChild(op); });
        inp.value = ask ? "" : values[f.key];
        row.appendChild(inp);
      } else if (f.type === "mobile") {
        var wrap = el("div", "gf-mobile");
        var code = el("select", "gf-code"); var codes = CODES.slice(); if (codes.indexOf(values.mobileCode) < 0) codes.unshift(values.mobileCode);
        codes.forEach(function (c) { var op = el("option", null, c); op.value = c; code.appendChild(op); }); code.value = values.mobileCode;
        inp = el("input"); inp.type = "tel"; inp.id = id; inp.value = values.mobile; inp.autocomplete = "tel-national"; inp.inputMode = "numeric"; inp.placeholder = "5XXXXXXXX";
        wrap.appendChild(inp); wrap.appendChild(code); row.appendChild(wrap); inputs.mobileCode = code;
      } else if (f.type === "textarea") {
        inp = el("textarea"); inp.id = id; inp.rows = 2; inp.maxLength = MAX_REQUEST; inp.value = values[f.key]; row.appendChild(inp);
      } else {
        inp = el("input"); inp.type = f.type; inp.id = id; inp.value = values[f.key]; if (f.autocomplete) inp.autocomplete = f.autocomplete; row.appendChild(inp);
      }
      inp.setAttribute("data-key", f.key);
      var err = el("div", "rsg-err"); row.appendChild(err);
      inputs[f.key] = inp; rows[f.key] = { row: row, err: err };
      inp.addEventListener("input", function () { refresh(f.key); }); inp.addEventListener("change", function () { refresh(f.key); });
      root.appendChild(row);
    });
    var serverKey = { title: "title", first_name: "firstName", family_name: "familyName", email: "email", mobile: "mobile", mobile_code: "mobile",
      companion_first_name: "guest2First", companion_family_name: "guest2Family", requests: "requests" }[errField] || errField;
    if (serverKey && rows[serverKey]) { rows[serverKey].row.classList.add("has-err"); rows[serverKey].err.textContent = errText; }
    var hint = el("div", "rsg-hint", WORD.editHint), btn = el("button", "rsg-btn", clean(payload.submit_label) || "اعتماد البيانات"); btn.type = "button";
    root.appendChild(hint); root.appendChild(btn);

    function read() {
      var v = {};
      FIELDS.forEach(function (f) { v[f.key] = s(inputs[f.key].value).trim(); });
      v.mobileCode = s(inputs.mobileCode.value).trim();
      return v;
    }
    function problems(v, show) {
      var bad = {};
      FIELDS.forEach(function (f) {
        var msg = "";
        if (f.required && !v[f.key]) msg = WORD.needField;
        else if (f.key === "email" && v.email && !EMAIL_RE.test(v.email)) msg = WORD.needEmail;
        else if (f.key === "mobile" && v.mobile && !mobileDigits(v.mobile)) msg = WORD.needMobile;
        if (msg) bad[f.key] = msg;
        if (show) { rows[f.key].err.textContent = msg; rows[f.key].row.classList.toggle("has-err", !!msg); }
      });
      return bad;
    }
    function refresh(changedKey) {
      /* a server-side error stays under its field until the guest edits that field; then the client message takes over */
      var v = read(), bad = problems(v, false);
      if (changedKey && rows[changedKey]) { rows[changedKey].err.textContent = bad[changedKey] || ""; rows[changedKey].row.classList.toggle("has-err", !!bad[changedKey]); }
      btn.disabled = Object.keys(bad).length > 0;
    }
    btn.addEventListener("click", function () {
      var v = read(), bad = problems(v, true);
      if (Object.keys(bad).length) { btn.disabled = true; return; }
      v.mobile = mobileDigits(v.mobile);
      var line = detailsLine(v);
      if (line.length > MAX_LINE) { v.requests = v.requests.slice(0, Math.max(0, MAX_REQUEST - (line.length - MAX_LINE))); line = detailsLine(v); }
      var w = widget();
      if (!(w && w.transport && w.transport.send)) { hint.textContent = WORD.notSent; return; }
      var before = countMessages(w);
      try { w.transport.send(line); } catch (e) { hint.textContent = WORD.notSent; return; }
      store(key, { values: v, state: "sending", at: Date.now() });
      drawDone(root, v, "sending");
      watchReply(w, before, function (ok) {
        var rec = store(key) || { values: v };
        if (ok) { rec.state = "sent"; store(key, rec); var st = root.querySelector(".rsg-state"); if (st) st.textContent = WORD.submitted; }
        else { store(key, null); try { localStorage.removeItem(key); } catch (e) {} reopen(v); }
      });
    });
    function reopen(v) {
      /* nothing came back in time: the guest can submit again (the bridge handles a repeat harmlessly) */
      var again = renderGuestForm(Object.assign({}, payload, { title_value: v.title, title_ask: false, first_name: v.firstName, family_name: v.familyName, email: v.email, mobile_code: v.mobileCode, mobile: v.mobile, companion_first_name: v.guest2First, companion_family_name: v.guest2Family, requests: v.requests, error_field: "", error_text: "" }), onSelect);
      var h = again.querySelector(".rsg-hint"); if (h) h.textContent = WORD.notSent;
      root.replaceWith(again);
    }
    refresh();
    return root;
  }

  function drawDone(root, v, state) {
    /* the completed form, read-only: the visible record of the submission (no visitor line is added to the chat) */
    var done = el("div", "gf-done");
    function kv(label, value, ltr) { if (!value) return; var r = el("div", "gf-kv"); r.appendChild(el("span", null, label)); var b = ltr ? el("bdi", null, value) : el("span", null, value); r.appendChild(b); done.appendChild(r); }
    kv(WORD.title, v.title); kv(WORD.firstName, v.firstName); kv(WORD.familyName, v.familyName); kv(WORD.email, v.email, true);
    kv(WORD.mobile, v.mobileCode + " " + v.mobile, true);
    var comp = (v.guest2First + " " + v.guest2Family).trim(); kv(WORD.guest2First.replace("الاسم الأول للمرافق", "المرافق"), comp);
    kv(WORD.requests, v.requests);
    while (root.children.length > 1) root.removeChild(root.lastChild);
    root.appendChild(done);
    root.appendChild(el("div", "rsg-state", state === "sending" ? WORD.sending : WORD.submitted));
    root.classList.add("is-locked");
  }
  function countMessages(w) { try { return w.messages.get().length; } catch (e) { return 0; } }
  function watchReply(w, before, done) {
    var started = Date.now();
    (function tick() {
      var n = countMessages(w);
      if (n > before) { var last = w.messages.get()[n - 1]; if (last && last.sender === "agent") return done(true); }
      if (Date.now() - started > REPLY_TIMEOUT) return done(false);
      setTimeout(tick, 400);
    })();
  }

  /* ---------- registration (both slug spellings), as soon as the widget instance exists ---------- */
  function register() {
    var w = widget(); if (!w || typeof w.registerComponent !== "function" || register.done) return !!register.done;
    ["rsg_date_range", "rsg-date-range"].forEach(function (t) { w.registerComponent(t, renderDateRange); });
    ["rsg_guest_form", "rsg-guest-form"].forEach(function (t) { w.registerComponent(t, renderGuestForm); });
    register.done = true;
    return true;
  }
  if (!register()) {
    document.addEventListener("rsg:widget-ready", register);
    var tries = 0, timer = setInterval(function () { if (register() || ++tries > 200) clearInterval(timer); }, 250);
  }
  window.RSGComponents = { renderDateRange: renderDateRange, renderGuestForm: renderGuestForm, datesLine: datesLine, parseDatesLine: parseDatesLine, detailsLine: detailsLine, register: register };
})();
