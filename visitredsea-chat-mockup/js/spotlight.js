/* ============================================================
   Resort spotlight for the resort-selection stage.

   Three separate lifetimes:
     1. Stage        : run() is called when the page hands over to the
                       Resorts section; stop() only on selection, reset
                       or an explicit cancel (Escape). Nothing here ends
                       the stage on its own.
     2. Dimming      : the page outside the visible resort cards is
                       dimmed for the whole stage; the cards themselves
                       are never dimmed. The cutout follows the cards on
                       resize, vertical scroll and carousel scroll.
     3. Pointer pass : a fine aqua frame and a small indicator move once
                       across the visible cards, dwelling ~1.5 to 2 s on
                       each, then stay as a subtle stationary cue.

   Decorative only: pointer-events are off, the mouse cursor is never
   moved and nothing is selected. ResortSpotlight.run(cards, opts) /
   .stop() / .active().
   ============================================================ */
window.ResortSpotlight = (function () {
  "use strict";
  var root = null, cut = null, frame = null, dot = null;
  var timers = [], watch = 0, raf = 0, active = false, cards = [], current = null;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DWELL = 1800, PAD = 8;

  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearAll() { timers.forEach(clearTimeout); timers = []; }

  function visibleCards() {
    var vw = window.innerWidth, vh = window.innerHeight;
    return cards.filter(function (c) {
      var r = c.getBoundingClientRect();
      var w = Math.min(r.right, vw) - Math.max(r.left, 0), hgt = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      return w > r.width * 0.6 && hgt > r.height * 0.5;
    });
  }

  function setRect(el, r, instant) {
    if (instant) el.style.transition = "none";
    el.style.left = r.left + "px"; el.style.top = r.top + "px"; el.style.width = r.width + "px"; el.style.height = r.height + "px";
    if (instant) { void el.offsetWidth; el.style.transition = ""; }
  }

  /* Re-measure everything from the rendered card bounds */
  function layout(instant) {
    if (!active || !root) return;
    var vis = visibleCards();
    if (!vis.length) { root.classList.add("away"); return; }        /* cards scrolled out of view: hide, keep the stage */
    root.classList.remove("away");
    var l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    vis.forEach(function (c) { var q = c.getBoundingClientRect(); l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); });
    setRect(cut, { left: l - PAD, top: t - PAD, width: r - l + 2 * PAD, height: b - t + 2 * PAD }, instant);
    if (!current || vis.indexOf(current) < 0) current = vis[0];
    var cr = current.getBoundingClientRect();
    setRect(frame, cr, instant);
    frame.style.borderRadius = getComputedStyle(current).borderRadius;
    var btn = current.querySelector(".choose"), p = btn ? btn.getBoundingClientRect() : cr;
    if (instant) dot.style.transition = "none";
    dot.style.left = (p.left + p.width / 2) + "px"; dot.style.top = (p.top + p.height / 2) + "px";
    if (instant) { void dot.offsetWidth; dot.style.transition = ""; }
  }

  function onMove() { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { layout(true); }); }
  function onKey(e) { if (e.key === "Escape") stop(); }

  function stop() {
    if (!root) return;
    clearAll(); clearInterval(watch); cancelAnimationFrame(raf);
    active = false; current = null; cards = [];
    window.removeEventListener("resize", onMove); window.removeEventListener("scroll", onMove, true); document.removeEventListener("keydown", onKey);
    var el = root; root = cut = frame = dot = null;
    el.classList.remove("in"); el.classList.add("out");
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, reduced ? 0 : 300);
  }

  /* One slow pass across the visible cards, then the cue rests on the last one */
  function pointerPass() {
    var vis = visibleCards(), i = 0;
    if (vis.length < 2) { root.classList.add("rest"); return; }
    (function step() {
      later(function () {
        if (!active) return;
        i++;
        var now = visibleCards();
        if (i >= vis.length || now.indexOf(vis[i]) < 0) { root.classList.add("rest"); return; }
        current = vis[i]; layout(false); step();
      }, DWELL);
    })();
  }

  function run(list, opts) {
    stop();
    cards = list || []; DWELL = (opts && opts.dwell) || 1800;
    if (!cards.length) return;
    root = document.createElement("div"); root.className = "ai-spot"; root.setAttribute("aria-hidden", "true");
    cut = document.createElement("div"); cut.className = "ai-spot-cut";
    frame = document.createElement("div"); frame.className = "ai-spot-frame";
    frame.innerHTML = '<i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>';
    dot = document.createElement("div"); dot.className = "ai-spot-dot";
    root.appendChild(cut); root.appendChild(frame); root.appendChild(dot); document.body.appendChild(root);
    active = true; current = null;
    layout(true);
    void root.offsetWidth; root.classList.add("in");
    window.addEventListener("resize", onMove); window.addEventListener("scroll", onMove, true); document.addEventListener("keydown", onKey);
    watch = setInterval(function () { layout(true); }, 400);           /* lazy images and layout shifts */
    if (reduced) { root.classList.add("rest", "still"); return; }        /* no pointer animation; the focus stays */
    pointerPass();
  }

  return { run: run, stop: stop, active: function () { return active; } };
})();
