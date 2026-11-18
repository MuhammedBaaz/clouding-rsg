/* Two compact launchers grouped in the bottom-left corner (11 Nov 2026; moved from beside the chat launcher the same evening):
   «محادثة الضيف»          opens the guest's WhatsApp conversation with Faisal (js/whatsapp.js, RSGWhatsApp)
   «تسليم الحجز للكونسيرج» opens the ERP-to-WhatsApp handoff scene (js/handoff.js, RSGHandoff)
   Both scenes start closed; these buttons are their only way in (the trip-PDF flow no longer opens anything). */
(function () {
  "use strict";
  if (document.querySelector(".mk-launchers")) return;
  function icon(path) { return '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>"; }
  var bar = document.createElement("div");
  bar.className = "mk-launchers"; bar.dir = "rtl"; bar.lang = "ar"; bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "عروض واتساب");
  function add(label, svg, open) {
    var b = document.createElement("button"); b.type = "button"; b.className = "mk-btn";
    b.innerHTML = svg + "<span>" + label + "</span>";
    b.addEventListener("click", function () { try { open(); } catch (e) { if (window.console) console.error("RSG launcher:", e); } });
    bar.appendChild(b); return b;
  }
  add("محادثة الضيف", icon('<path d="M4 18.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H8z"/><path d="M8.5 9h7M8.5 12.5h4.5"/>'),
      function () { if (window.RSGWhatsApp) window.RSGWhatsApp.open({ source: "launcher" }); });
  add("تسليم الحجز للكونسيرج", icon('<rect x="3" y="4" width="10" height="13" rx="1.5"/><path d="M6 8h4M6 11h4"/><rect x="16" y="7" width="5" height="13" rx="1.2"/><path d="M13 13.5h3.2M14.6 12l1.6 1.5-1.6 1.5"/>'),
      function () { if (window.RSGHandoff) window.RSGHandoff.open({ source: "launcher" }); });
  document.body.appendChild(bar);
})();
