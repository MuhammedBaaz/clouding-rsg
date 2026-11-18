/* ERP-to-WhatsApp handoff scene (11 Nov 2026), opened by the «تسليم الحجز للكونسيرج» launcher.

   A compact booking panel (the company's booking system) beside Faisal's iPhone. Every opening plays, once:
     1. Assignment  the panel assigns the Shebara booking to Faisal (his photo, the stage bar, the activity log);
     2. Transfer    the guest-file PDF travels from the panel to the phone along a short path (once per opening);
     3. Delivery    only after the transfer lands, the WhatsApp exchange plays inside the phone (system messages, the
                    document card «ملف الضيف وتفاصيل الحجز.pdf», Faisal's acknowledgement), paced by the shared engine;
     4. Review      the whole exchange stays visible and scrollable until the viewer closes the scene.
   Desktop: panel left, phone right, transfer left to right (as the owner's references). Narrow or portrait screens:
   stacked, panel above, transfer downwards, the overlay scrolls and settles on the phone after the transfer.

   Data: data/handoff-script.js (built from data/booking.js). Engine: js/whatsapp.js (RSGWhatsAppScene).
   Nothing is sent anywhere; the document card opens the real PDF built from the same data. */
(function () {
  "use strict";
  var H = window.HANDOFF_SCENE, W = window.RSGWhatsAppScene;
  if (!H || !W) { if (window.console) console.warn("RSG handoff: data or engine missing"); return; }
  var el = W.el, base = W.base, reduced = W.reduced;
  var g = H.guest, b = H.booking, a = H.assignment, E = H.erp;
  var stage, erp, steps, sendBtn, fileChip, fileIcon, phoneCol, sizerRef, logList, rootRef;
  var timers = [], anims = [], flowSvg = null, token = null, run = 0;

  function t(target, text) { W.renderText(target, text); return target; }
  function svgIcon(path, size) { return '<svg viewBox="0 0 24 24" width="' + (size || 16) + '" height="' + (size || 16) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>"; }
  var IC = {
    send: svgIcon('<path d="M21 4L10 15"/><path d="M21 4l-7 17-4-6-6-4z"/>', 15),
    check: svgIcon('<path d="M5 12.5l4.2 4.2L19 7"/>', 15),
    user: svgIcon('<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c1.3-3.6 4-5.4 7-5.4s5.7 1.8 7 5.4"/>', 18)
  };

  /* ---------- ERP panel ---------- */
  function row(dl, label, value, plain) {
    var dt = el("dt"); dt.textContent = label; var dd = el("dd");
    /* plain: «الدولي – RSIA» kept on one line: the en dash allows a break after it (UAX 14 class BA), so a word joiner follows it */
    if (plain) dd.textContent = value.replace(/ – /g, " –⁠ "); else t(dd, value);
    dl.appendChild(dt); dl.appendChild(dd);
  }
  function buildErp() {
    erp = el("section", "hs-erp"); erp.dir = "rtl"; erp.lang = "ar"; erp.setAttribute("aria-label", E.app + " · " + b.resort);
    var bar = el("header", "hs-erp-bar");
    var app = el("span", "hs-erp-app"); t(app, E.app + " · " + E.unit);
    var crumb = el("span", "hs-erp-crumb"); t(crumb, E.section + " / " + g.fullName);
    bar.appendChild(app); bar.appendChild(crumb); erp.appendChild(bar);

    steps = el("ol", "hs-steps"); steps.setAttribute("aria-label", "حالة الحجز");
    E.stages.forEach(function (s, i) { var li = el("li"); li.setAttribute("data-i", i); li.textContent = s; steps.appendChild(li); });
    erp.appendChild(steps);

    var body = el("div", "hs-erp-body");
    var head = el("div", "hs-guest");
    var nm = el("div", "hs-guest-name"); t(nm, g.fullName);
    var badge = el("span", "hs-badge"); badge.textContent = g.category;
    var ph = el("bdi", "hs-guest-phone"); ph.dir = "ltr"; ph.textContent = g.mobile;
    head.appendChild(nm); head.appendChild(badge); head.appendChild(ph); body.appendChild(head);

    var dl = el("dl", "hs-fields");
    row(dl, "المنتجع", b.resort + " · " + b.villaAr);
    row(dl, "الإقامة", b.checkIn + " – " + b.checkOut + " · " + b.nights);
    row(dl, "الضيوف", b.adults + " · مع " + g.companion.relation + " " + g.companion.name);
    row(dl, "التنقلات", "الوصول من " + b.arrival.from + "\nالمغادرة إلى " + b.departure.to, true);
    row(dl, "طلب خاص", g.request);
    row(dl, "الإجمالي", b.total + " · " + b.taxNote);
    body.appendChild(dl);

    var as = el("div", "hs-assign");
    var al = el("div", "hs-assign-label"); al.textContent = E.conciergeLabel;
    var who = el("div", "hs-assignee");
    var av = el("span", "hs-avatar"); av.innerHTML = '<span class="hs-avatar-empty">' + IC.user + "</span>";
    var img = document.createElement("img"); img.alt = a.concierge; img.src = base + a.photo; av.appendChild(img);
    var txt = el("span", "hs-assignee-text"); var bn = el("b"); bn.textContent = a.concierge; var sm = el("small"); sm.textContent = a.role; txt.appendChild(bn); txt.appendChild(sm);
    var pend = el("span", "hs-assign-pending"); pend.textContent = E.unassigned;
    var when = el("bdi", "hs-assign-time"); when.dir = "rtl"; when.textContent = "أُسند " + a.assignedAt;
    who.appendChild(av); who.appendChild(txt); who.appendChild(pend); who.appendChild(when);
    as.appendChild(al); as.appendChild(who); body.appendChild(as);

    var at = el("div", "hs-attach");
    fileChip = el("a", "hs-file"); fileChip.href = base + H.pdf.file; fileChip.target = "_blank"; fileChip.rel = "noopener";
    fileChip.setAttribute("aria-label", "فتح " + H.pdf.name);
    fileIcon = el("span", "hs-file-icon", W.icon.pdf);
    var fi = el("span", "hs-file-info"); var fn = el("span", "hs-file-name"); fn.textContent = H.pdf.name; var fm = el("bdi", "hs-file-meta"); fm.dir = "ltr"; fm.textContent = H.pdf.meta;
    fi.appendChild(fn); fi.appendChild(fm); fileChip.appendChild(fileIcon); fileChip.appendChild(fi);
    sendBtn = el("span", "hs-send"); sendBtn.setAttribute("aria-hidden", "true");
    at.appendChild(fileChip); at.appendChild(sendBtn); body.appendChild(at);

    logList = el("ol", "hs-log"); logList.setAttribute("aria-label", "سجل النشاط");
    E.log.forEach(function (l, i) { var li = el("li"); li.setAttribute("data-i", i); var tm = el("bdi", "hs-log-time"); tm.dir = "rtl"; tm.textContent = l.time; var tx = el("span"); t(tx, l.text); li.appendChild(tm); li.appendChild(tx); logList.appendChild(li); });
    body.appendChild(logList);
    erp.appendChild(body);
    setStage("new");
    return erp;
  }
  function setStage(s) {
    if (!erp) return;
    erp.setAttribute("data-stage", s);
    var idx = { "new": 0, assigned: 1, sending: 1, sent: 2 }[s];
    [].forEach.call(steps.children, function (li, i) { li.className = i < idx ? "is-done" : (i === idx ? "is-current" : ""); });
    [].forEach.call(logList.children, function (li, i) { li.classList.toggle("is-on", (s === "assigned" || s === "sending") ? i === 0 : (s === "sent" ? i <= 1 : false)); });
    sendBtn.innerHTML = (s === "sent" ? IC.check : IC.send) + "<span>" + (s === "sending" ? E.sending : s === "sent" ? E.sent : E.send) + "</span>";
  }

  /* ---------- stage composition ---------- */
  function compose(p) {
    rootRef = p.root; sizerRef = p.sizer;
    stage = el("div", "hs-stage"); stage.dir = "ltr";
    phoneCol = el("div", "hs-phonecol");
    var rc = el("div", "hs-recipient"); rc.dir = "rtl"; rc.lang = "ar";
    var ri = document.createElement("img"); ri.alt = ""; ri.src = base + a.photo;
    var rt = el("span", "hs-recipient-text"); var rn = el("b"); rn.textContent = a.concierge; var rr = el("small"); t(rr, a.role + " · " + b.resort); rt.appendChild(rn); rt.appendChild(rr);
    var rl = el("span", "hs-recipient-tag"); rl.textContent = "المستلم";
    rc.appendChild(ri); rc.appendChild(rt); rc.appendChild(rl);
    phoneCol.appendChild(rc); phoneCol.appendChild(p.sizer);
    stage.appendChild(buildErp()); stage.appendChild(phoneCol);
    return stage;
  }

  /* ---------- layout ---------- */
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function fit(ctx) {
    var vw = ctx.vw, vh = ctx.vh, root = ctx.root, recip = 54;
    var stacked = vw < 900 || vw < vh * 1.05;
    var pad = vw < 600 ? 12 : 28, erpW, gap, s;
    if (!stacked) {
      erpW = clamp(vw * 0.34, 340, 460); gap = clamp(vw * 0.075, 56, 128);
      s = Math.min(1, (vh - 2 * pad - recip) / 844, (vw - 2 * pad - erpW - gap) / 390);
      if (s < 0.5) stacked = true;
    }
    if (stacked) {
      erpW = Math.min(520, vw - 2 * pad); gap = 56;
      s = Math.min(1, (vw - 2 * pad) / 390, (vh - 2 * pad - recip) / 844);
    }
    root.classList.toggle("is-stacked", stacked);
    root.style.setProperty("--wa-scale", s.toFixed(4)); root.style.setProperty("--wa-pad", pad + "px");
    root.style.setProperty("--hs-erp-w", Math.round(erpW) + "px"); root.style.setProperty("--hs-gap", Math.round(gap) + "px");
  }

  /* ---------- intro: assignment, then the transfer ---------- */
  function later(ms, fn, my) { timers.push(setTimeout(function () { if (my === run) fn(); }, ms)); }
  function intro(done) {
    var my = ++run;
    setStage("new");
    if (rootRef && rootRef.classList.contains("is-stacked")) rootRef.scrollTop = 0;
    later(reduced ? 150 : 650, function () { setStage("assigned"); }, my);
    later(reduced ? 500 : 1850, function () { setStage("sending"); fileChip.classList.add("is-sending"); frameTransfer(); }, my);
    later(reduced ? 650 : 2300, function () {
      transfer(my, function () {
        if (my !== run) return;
        fileChip.classList.remove("is-sending"); setStage("sent");
        settleOnPhone();
        later(reduced ? 100 : 450, done, my);
      });
    }, my);
    return { cancel: cancel };
  }
  function cancel() {
    run++; timers.forEach(clearTimeout); timers = [];
    anims.forEach(function (x) { try { x.cancel(); } catch (e) {} }); anims = [];
    if (flowSvg && flowSvg.parentNode) flowSvg.parentNode.removeChild(flowSvg);
    if (token && token.parentNode) token.parentNode.removeChild(token);
    flowSvg = token = null;
    if (fileChip) fileChip.classList.remove("is-sending");
  }
  function reset() { cancel(); setStage("new"); if (rootRef) rootRef.scrollTop = 0; }

  function pt(r, st, fx, fy) { return { x: r.left - st.left + r.width * fx, y: r.top - st.top + r.height * fy }; }
  function transfer(my, landed) {
    var stacked = rootRef.classList.contains("is-stacked");
    var st = stage.getBoundingClientRect(), ir = fileIcon.getBoundingClientRect(), pr = sizerRef.getBoundingClientRect();
    var A = pt(ir, st, 0.5, 0.5);
    var B = stacked ? pt(pr, st, 0.5, 0.2) : pt(pr, st, 0.24, 0.42);
    var NS = "http://www.w3.org/2000/svg";
    flowSvg = document.createElementNS(NS, "svg"); flowSvg.setAttribute("class", "hs-flow"); flowSvg.setAttribute("aria-hidden", "true");
    flowSvg.setAttribute("width", st.width); flowSvg.setAttribute("height", st.height);
    stage.appendChild(flowSvg);
    function curve(off) {
      if (stacked) { var dy = B.y - A.y; return "M" + A.x + " " + A.y + " C" + (A.x + off) + " " + (A.y + dy * 0.55) + " " + (B.x + off) + " " + (B.y - dy * 0.55) + " " + B.x + " " + B.y; }
      var dx = B.x - A.x; return "M" + A.x + " " + A.y + " C" + (A.x + dx * 0.5) + " " + (A.y + off) + " " + (B.x - dx * 0.5) + " " + (B.y + off) + " " + B.x + " " + B.y;
    }
    var main = null;
    [-18, 0, 18].forEach(function (off, i) {
      var p = document.createElementNS(NS, "path"); p.setAttribute("d", curve(off)); p.setAttribute("class", "hs-strand" + (off === 0 ? " is-main" : ""));
      flowSvg.appendChild(p); if (off === 0) main = p;
      var L = p.getTotalLength(); p.style.strokeDasharray = L + " " + L; p.style.strokeDashoffset = reduced ? 0 : L;
      if (!reduced) anims.push(p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 420, delay: i * 70, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }));
    });
    token = el("div", "hs-token", W.icon.pdf); stage.appendChild(token);
    var L = main.getTotalLength(), frames = [], N = 32;
    function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    for (var i = 0; i <= N; i++) {
      var q = main.getPointAtLength(L * ease(i / N)), f = i / N;
      var sc = f < 0.12 ? 1 + f * 1.5 : (f > 0.8 ? 1.18 - (f - 0.8) * 2.6 : 1.18);
      frames.push({ transform: "translate(" + (q.x - 17).toFixed(1) + "px," + (q.y - 20).toFixed(1) + "px) scale(" + sc.toFixed(3) + ")", opacity: f > 0.9 ? (1 - (f - 0.9) * 10).toFixed(2) : 1 });
    }
    var dur = reduced ? 1 : 1000, lead = reduced ? 0 : 200;
    token.style.transform = frames[0].transform;
    var mv = token.animate(frames, { duration: dur, delay: lead, easing: "linear", fill: "forwards" });
    anims.push(mv);
    mv.finished.then(function () {
      if (my !== run) return;
      ping(B);
      var fade = flowSvg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 1 : 260, fill: "forwards" }); anims.push(fade);
      fade.finished.then(function () { if (my !== run) return; cancelArtifacts(); landed(); }).catch(function () {});
    }).catch(function () {});
  }
  function cancelArtifacts() {
    if (flowSvg && flowSvg.parentNode) flowSvg.parentNode.removeChild(flowSvg);
    if (token && token.parentNode) token.parentNode.removeChild(token);
    flowSvg = token = null; anims = [];
  }
  function ping(B) {
    if (reduced) return;
    var r = el("span", "hs-ping"); r.style.left = B.x + "px"; r.style.top = B.y + "px"; stage.appendChild(r);
    var an = r.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: .7 }, { transform: "translate(-50%,-50%) scale(2.6)", opacity: 0 }], { duration: 520, easing: "ease-out" });
    an.finished.then(function () { if (r.parentNode) r.parentNode.removeChild(r); }).catch(function () { if (r.parentNode) r.parentNode.removeChild(r); });
  }
  /* stacked layout: after the transfer, bring the whole phone into view for the delivery */
  /* stacked layout, before the transfer: put the PDF chip in the upper part of the screen so the path and the top of
     the phone are both in view while the file travels down */
  function frameTransfer() {
    if (!rootRef || !rootRef.classList.contains("is-stacked")) return;
    var rr = rootRef.getBoundingClientRect(), fr = fileChip.getBoundingClientRect();
    var top = Math.max(0, fr.top - rr.top + rootRef.scrollTop - rootRef.clientHeight * 0.22);
    try { rootRef.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" }); } catch (e) { rootRef.scrollTop = top; }
  }
  function settleOnPhone() {
    if (!rootRef || !rootRef.classList.contains("is-stacked")) return;
    var top = phoneCol.getBoundingClientRect().top - rootRef.getBoundingClientRect().top + rootRef.scrollTop - 12;
    try { rootRef.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" }); } catch (e) { rootRef.scrollTop = top; }
  }

  var scene = W.create(H.phone, {
    className: "hs-overlay",
    label: "تسليم الحجز من نظام الحجوزات إلى واتساب الكونسيرج",
    compose: compose, fit: fit, intro: intro, replay: true, onReset: reset,
    focusables: function () { return fileChip ? [fileChip] : []; }
  });
  window.RSGHandoff = { open: scene.open, close: scene.close, reset: scene.reset, isOpen: scene.isOpen, state: scene.state };
})();
