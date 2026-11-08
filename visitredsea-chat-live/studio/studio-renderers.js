/* ============================================================
   Empathy Studio web-SDK rich-component renderers, ported line
   by line from the TypeScript sources in ../reference/sdk
   (chat-widget repository upload on Google Drive, 2026-09-21):
     rich-components/carousel.ts
     rich-components/carousel-card/index.ts
     rich-components/selection-list-picker/index.ts
     rich-components/grouped-list-picker/index.ts
     rich-components/booking-confirmation/index.ts
     rich-components/buttons.ts + button-group.ts
     rich-components/rich-renderer.ts
     icons/icon-resolver.ts (+ icons/types.ts)
   DOM structure, class names, selection/lock rules and button
   layout rules are kept identical. Differences, all preview-only:
     - styles come from studio-components.css (the same CSS text
       extracted from the styles.ts modules) instead of Shadow DOM
       injection (injectStyles is therefore a no-op here);
     - parseMarkdown is a documented subset (bold, bullet lists,
       paragraphs). The SDK's full parser lives in src/markdown.
   ============================================================ */
(function () {
  "use strict";
  var Studio = window.EmpathyStudio = window.EmpathyStudio || {};

  /* ---------- icons/types.ts ---------- */
  var DEFAULT_ICON_BASE_URL = "https://unpkg.com/lucide-static@1.7.0/icons";   /* SDK default; the preview points iconBaseUrl at ./studio/icons */
  var DEFAULT_ICON_TIMEOUT = 5000;
  var ICON_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var DEFAULT_ICON_SIZE = 16;

  /* ---------- icons/icon-resolver.ts ---------- */
  function IconResolver(config) {
    this.baseUrl = (config && config.baseUrl) || DEFAULT_ICON_BASE_URL;
    this.timeout = (config && config.timeout) || DEFAULT_ICON_TIMEOUT;
    this.cache = new Map();
  }
  IconResolver.prototype.resolveIcon = function (name, size) {
    var self = this;
    if (!ICON_NAME_PATTERN.test(name)) return Promise.resolve(null);
    return this.fetchAndCache(name).then(function (svgText) {
      if (!svgText) return null;
      return self.createSvgElement(svgText, size || DEFAULT_ICON_SIZE);
    });
  };
  IconResolver.prototype.updateBaseUrl = function (baseUrl) { this.baseUrl = baseUrl; };
  IconResolver.prototype.fetchAndCache = function (name) {
    var cached = this.cache.get(name); if (cached) return cached;
    var p = this.fetchSvg(name); this.cache.set(name, p); return p;
  };
  IconResolver.prototype.fetchSvg = function (name) {
    var url = this.baseUrl + "/" + name + ".svg", controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, this.timeout);
    return fetch(url, { signal: controller.signal }).then(function (response) {
      clearTimeout(timeoutId);
      if (!response.ok) return null;
      var contentType = response.headers.get("content-type") || "";
      if (contentType.indexOf("svg") < 0) return null;
      return response.text();
    }).catch(function () { clearTimeout(timeoutId); return null; });
  };
  IconResolver.prototype.createSvgElement = function (svgText, size) {
    var doc = new DOMParser().parseFromString(svgText, "image/svg+xml"), svg = doc.querySelector("svg");
    if (!svg) return null;
    svg.querySelectorAll("script").forEach(function (s) { s.remove(); });
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("width", String(size)); svg.setAttribute("height", String(size)); svg.setAttribute("class", "cw-icon");
    return document.importNode(svg, true);
  };
  Studio.IconResolver = IconResolver;

  /* ---------- markdown (preview subset of src/markdown/parser.ts) ---------- */
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function inline(t) { return escapeHtml(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/_(.+?)_/g, "<em>$1</em>"); }
  function parseMarkdown(md) {
    var blocks = String(md || "").split(/\n{2,}/), out = [];
    blocks.forEach(function (b) {
      var lines = b.split("\n");
      if (lines.every(function (l) { return /^\s*[-*] /.test(l); })) out.push("<ul>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^\s*[-*] /, "")) + "</li>"; }).join("") + "</ul>");
      else out.push("<p>" + lines.map(inline).join("<br>") + "</p>");
    });
    return out.join("");
  }
  Studio.parseMarkdown = parseMarkdown;
  function injectStyles() { /* no-op in the preview: studio-components.css is linked once */ }

  /* ---------- rich-components/carousel-card/index.ts ---------- */
  var VALID_BADGE_POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"];
  function isVideoUrl(url) { var lower = url.toLowerCase().split("?")[0] || ""; return lower.endsWith(".mp4") || lower.endsWith(".webm"); }
  function normalizeBadgePosition(position) { return position && VALID_BADGE_POSITIONS.indexOf(position) >= 0 ? position : "top-left"; }

  function renderCarouselCard(payload, onSelect, selection) {
    var card = document.createElement("div"); card.className = "cc-card";
    if (!payload.main_title || payload.main_title.length === 0) return card;
    injectStyles(card, "data-cc-styles");
    var mediaUrl = typeof payload.image_url === "string" && payload.image_url.length > 0 ? payload.image_url : null;
    if (mediaUrl) {
      var media = document.createElement("div"); media.className = "cc-media";
      if (isVideoUrl(mediaUrl)) {
        var video = document.createElement("video"); video.src = mediaUrl; video.autoplay = true; video.muted = true; video.loop = true; video.playsInline = true;
        video.addEventListener("error", function () { media.style.display = "none"; }); media.appendChild(video);
      } else {
        var img = document.createElement("img"); img.src = mediaUrl; img.alt = "";
        img.addEventListener("error", function () { media.style.display = "none"; }); media.appendChild(img);
      }
      if (payload.badge_title) { var pos = normalizeBadgePosition(payload.badge_position); var badge = document.createElement("span"); badge.className = "cc-badge cc-badge--" + pos; badge.textContent = payload.badge_title; media.appendChild(badge); }
      card.appendChild(media);
    }
    var body = document.createElement("div"); body.className = "cc-body";
    var titleRow = document.createElement("div"); titleRow.className = "cc-title-row";
    var title = document.createElement("h3"); title.className = "cc-title"; title.dir = "auto"; title.textContent = payload.main_title; titleRow.appendChild(title);
    if (!mediaUrl && payload.badge_title) { var ib = document.createElement("span"); ib.className = "cc-badge cc-badge--inline"; ib.textContent = payload.badge_title; titleRow.appendChild(ib); }
    body.appendChild(titleRow);
    if (payload.subtitle) { var subtitle = document.createElement("p"); subtitle.className = "cc-subtitle"; subtitle.dir = "auto"; subtitle.textContent = payload.subtitle; body.appendChild(subtitle); }
    if (payload.description) { var desc = document.createElement("div"); desc.className = "cc-description"; desc.dir = "auto"; desc.innerHTML = parseMarkdown(payload.description); body.appendChild(desc); }
    card.appendChild(body);

    var buttons = [];
    if (payload.primary_button_label) buttons.push({ title: payload.primary_button_label, value: payload.primary_button_payload != null ? payload.primary_button_payload : payload.primary_button_label, type: "primary" });
    if (payload.secondary_button_label) buttons.push({ title: payload.secondary_button_label, value: payload.secondary_button_payload != null ? payload.secondary_button_payload : payload.secondary_button_label, type: "secondary" });
    if (payload.tertiary_button_label) buttons.push({ title: payload.tertiary_button_label, value: payload.tertiary_button_payload != null ? payload.tertiary_button_payload : payload.tertiary_button_label, type: "tertiary" });
    if (buttons.length > 0) {
      var shouldLock = payload.lock_after_selection !== false, locked = shouldLock && selection !== undefined, allBtns = [];
      var buttonsContainer = document.createElement("div"); buttonsContainer.className = "cc-buttons";
      var btnIndexMap = { primary: 0, secondary: 1, tertiary: 2 };
      var createBtn = function (btn) {
        var el = document.createElement("button"); el.type = "button"; el.className = "cc-btn cc-btn--" + btn.type; el.textContent = btn.title;
        var idx = btnIndexMap[btn.type] || 0;
        if (locked) { el.disabled = true; if (selection && selection.index === idx) el.classList.add("cc-btn--selected"); }
        el.addEventListener("click", function () {
          if (locked) return;
          onSelect(btn.value, idx);
          if (shouldLock) { locked = true; el.classList.add("cc-btn--selected"); allBtns.forEach(function (b) { b.disabled = true; }); }
        });
        allBtns.push(el); return el;
      };
      var primary = buttons.filter(function (b) { return b.type === "primary"; })[0], secondary = buttons.filter(function (b) { return b.type === "secondary"; })[0], tertiary = buttons.filter(function (b) { return b.type === "tertiary"; })[0];
      if (tertiary && secondary) { var row = document.createElement("div"); row.className = "cc-btn-row"; row.appendChild(createBtn(tertiary)); row.appendChild(createBtn(secondary)); buttonsContainer.appendChild(row); }
      else if (secondary) buttonsContainer.appendChild(createBtn(secondary));
      if (primary) buttonsContainer.appendChild(createBtn(primary));
      card.appendChild(buttonsContainer);
    }
    return card;
  }
  Studio.renderCarouselCard = renderCarouselCard;

  /* ---------- rich-components/carousel.ts ---------- */
  function getScrollStep(track) { var firstCard = track.querySelector(".rc-carousel-card"); return firstCard ? firstCard.offsetWidth + 12 : 260; }
  function renderCarousel(payload, onSelect, selection, wheelScroll, defaultVisibleCount) {
    if (payload.cards.length === 1 && payload.cards[0]) return renderCarouselCard(payload.cards[0], onSelect, selection);
    if (payload.cards.length === 0) { var empty = document.createElement("div"); empty.className = "rc-carousel"; return empty; }
    var wrapper = document.createElement("div"); wrapper.className = "rc-carousel";
    if (payload.title) { var titleEl = document.createElement("p"); titleEl.className = "rc-carousel-title"; titleEl.textContent = payload.title; wrapper.appendChild(titleEl); }
    var gap = 12, MIN_CARD_PX = 320, explicitCount = payload.visible_count != null ? payload.visible_count : defaultVisibleCount, hasExplicit = explicitCount != null;
    var track = document.createElement("div"); track.className = "rc-carousel-track";
    payload.cards.forEach(function (card, cardIndex) {
      var cardSelection = selection && selection.cardIndex === cardIndex ? selection : undefined;
      var cardEl = renderCarouselCard(card, function (value, buttonIndex) { onSelect(value, buttonIndex, cardIndex); }, cardSelection);
      cardEl.classList.add("rc-carousel-card"); track.appendChild(cardEl);
    });
    function applyCardWidths() {
      var trackWidth = track.clientWidth;
      var visibleCount = hasExplicit ? Math.max(1, Math.floor(explicitCount)) : trackWidth > 0 ? Math.max(1, Math.min(payload.cards.length, Math.floor(trackWidth / MIN_CARD_PX))) : 1;
      var peekPercent = visibleCount === 1 ? 30 : 15;
      var cardWidth = "calc((100% - " + String(gap * visibleCount) + "px) / " + String(visibleCount) + " - " + String(peekPercent / visibleCount) + "%)";
      track.querySelectorAll(".rc-carousel-card").forEach(function (cardEl) { cardEl.style.flex = "0 0 " + cardWidth; });
    }
    applyCardWidths();
    if (typeof ResizeObserver !== "undefined") { new ResizeObserver(function () { applyCardWidths(); }).observe(track); }
    if (wheelScroll) {
      var snapTimer = 0;
      track.addEventListener("wheel", function (ev) { if (ev.deltaY === 0) return; ev.preventDefault(); track.style.scrollSnapType = "none"; track.scrollLeft += ev.deltaY; window.clearTimeout(snapTimer); snapTimer = window.setTimeout(function () { track.style.scrollSnapType = ""; }, 150); }, { passive: false });
    }
    wrapper.appendChild(track);
    var prevBtn = document.createElement("button"); prevBtn.className = "rc-carousel-arrow rc-carousel-arrow--prev"; prevBtn.setAttribute("type", "button"); prevBtn.setAttribute("aria-label", "Previous"); prevBtn.innerHTML = "&#8249;";
    prevBtn.addEventListener("click", function () { track.scrollBy({ left: -getScrollStep(track), behavior: "smooth" }); });
    var nextBtn = document.createElement("button"); nextBtn.className = "rc-carousel-arrow rc-carousel-arrow--next"; nextBtn.setAttribute("type", "button"); nextBtn.setAttribute("aria-label", "Next"); nextBtn.innerHTML = "&#8250;";
    nextBtn.addEventListener("click", function () { track.scrollBy({ left: getScrollStep(track), behavior: "smooth" }); });
    wrapper.appendChild(prevBtn); wrapper.appendChild(nextBtn);
    return wrapper;
  }
  Studio.renderCarousel = renderCarousel;

  /* ---------- rich-components/selection-list-picker/index.ts ---------- */
  var MAX_ITEMS = 20;
  function renderSelectionListPicker(payload, onSelect, selection, iconResolver) {
    var root = document.createElement("div"); root.className = "slp-picker"; injectStyles(root, "data-slp-styles");
    if (payload.main_title) { var title = document.createElement("p"); title.className = "slp-title"; title.dir = "auto"; title.textContent = payload.main_title; root.appendChild(title); }
    var shouldLock = payload.lock_after_selection !== false, locked = shouldLock && selection !== undefined, allButtons = [];
    var container = document.createElement("div"); container.className = "slp-items";
    var items = payload.items.slice(0, MAX_ITEMS), renderIndex = 0;
    items.forEach(function (item) {
      if (!item.title || item.title.length === 0) return;
      var idx = renderIndex; renderIndex++;
      var btn = document.createElement("button"); btn.type = "button"; btn.className = "slp-item";
      if (item.icon && iconResolver) { var iconWrap = document.createElement("span"); iconWrap.className = "slp-icon"; iconResolver.resolveIcon(item.icon, 20).then(function (svg) { if (svg) iconWrap.appendChild(svg); }); btn.appendChild(iconWrap); }
      var content = document.createElement("div"); content.className = "slp-content";
      var titleEl = document.createElement("p"); titleEl.className = "slp-item-title"; titleEl.dir = "auto"; titleEl.textContent = item.title; content.appendChild(titleEl);
      if (item.subtitle) { var subtitleEl = document.createElement("p"); subtitleEl.className = "slp-subtitle"; subtitleEl.dir = "auto"; subtitleEl.textContent = item.subtitle; content.appendChild(subtitleEl); }
      btn.appendChild(content);
      if (item.badge) { var badge = document.createElement("span"); badge.className = "slp-badge"; badge.textContent = item.badge; btn.appendChild(badge); }
      if (locked) { btn.disabled = true; if (selection && selection.index === idx) btn.classList.add("slp-item--selected"); }
      var selectValue = item.payload != null && item.payload !== "" ? item.payload : item.title;
      btn.addEventListener("click", function () {
        if (locked) return;
        onSelect(selectValue, idx);
        if (shouldLock) { locked = true; btn.classList.add("slp-item--selected"); allButtons.forEach(function (b) { b.disabled = true; }); }
      });
      allButtons.push(btn); container.appendChild(btn);
    });
    root.appendChild(container); return root;
  }
  Studio.renderSelectionListPicker = renderSelectionListPicker;

  /* ---------- rich-components/grouped-list-picker/index.ts ---------- */
  function renderGroupedListPicker(payload, onSelect, selection) {
    var root = document.createElement("div"); root.className = "glp-picker"; injectStyles(root, "data-glp-styles");
    if (payload.main_title) { var title = document.createElement("p"); title.className = "glp-title"; title.dir = "auto"; title.textContent = payload.main_title; root.appendChild(title); }
    var isMulti = payload.is_multiple_selection === true, shouldLock = payload.lock_after_selection !== false, locked = shouldLock && selection !== undefined, allChips = [];
    var selectedSet = new Set();
    if (selection && isMulti) selection.value.split(", ").forEach(function (part) { selectedSet.add(part.trim()); });
    var sendBtn = null;
    function updateSendButton() { if (sendBtn) sendBtn.disabled = selectedSet.size === 0; }
    payload.groups.forEach(function (group) {
      if (!group.title || group.title.length === 0) return;
      if (group.options.length === 0) return;
      var heading = document.createElement("p"); heading.className = "glp-group-heading"; heading.dir = "auto"; heading.textContent = group.title; root.appendChild(heading);
      var chipsContainer = document.createElement("div"); chipsContainer.className = "glp-chips";
      group.options.forEach(function (option) {
        var chip = document.createElement("button"); chip.type = "button"; chip.className = "glp-chip"; chip.textContent = option;
        var chipKey = group.title + ": " + option;
        if (isMulti && selectedSet.has(chipKey)) chip.classList.add("glp-chip--selected");
        if (!isMulti && selection && selection.value === chipKey) chip.classList.add("glp-chip--selected");
        if (locked) chip.disabled = true;
        chip.addEventListener("click", function () {
          if (locked) return;
          if (isMulti) {
            if (selectedSet.has(chipKey)) { selectedSet.delete(chipKey); chip.classList.remove("glp-chip--selected"); }
            else { selectedSet.add(chipKey); chip.classList.add("glp-chip--selected"); }
            updateSendButton();
          } else {
            onSelect(chipKey, 0);
            if (shouldLock) { locked = true; chip.classList.add("glp-chip--selected"); allChips.forEach(function (b) { b.disabled = true; }); }
          }
        });
        allChips.push(chip); chipsContainer.appendChild(chip);
      });
      root.appendChild(chipsContainer);
    });
    if (isMulti) {
      sendBtn = document.createElement("button"); sendBtn.type = "button"; sendBtn.className = "glp-send-btn"; sendBtn.textContent = payload.send_button_label || "Done"; sendBtn.disabled = selectedSet.size === 0;
      if (locked) sendBtn.disabled = true;
      sendBtn.addEventListener("click", function () {
        if (locked || selectedSet.size === 0) return;
        onSelect(Array.from(selectedSet).join(", "), 0);
        if (shouldLock) { locked = true; allChips.forEach(function (b) { b.disabled = true; }); sendBtn.disabled = true; }
      });
      root.appendChild(sendBtn);
    }
    return root;
  }
  Studio.renderGroupedListPicker = renderGroupedListPicker;

  /* ---------- rich-components/booking-confirmation/index.ts (confirmation_card) ---------- */
  function el(tag, className, text) { var e = document.createElement(tag); if (className) e.className = className; if (text) e.textContent = text; return e; }
  function createDetailRow(title, subtitle, iconUrl) {
    var row = el("div", "bc-detail-row"); row.appendChild(el("p", "bc-detail-label", title));
    if (subtitle) {
      var valueRow = el("div", "bc-detail-value");
      if (iconUrl) { var icon = document.createElement("img"); icon.className = "bc-detail-icon"; icon.src = iconUrl; icon.alt = ""; icon.addEventListener("error", function () { icon.style.display = "none"; }); valueRow.appendChild(icon); }
      valueRow.appendChild(el("p", "bc-detail-subtitle", subtitle)); row.appendChild(valueRow);
    }
    return row;
  }
  function renderBookingConfirmation(payload, onSelect, _selection, iconResolver) {
    var card = el("div", "bc-card"); injectStyles(card, "data-bc-styles");
    var hasImage = typeof payload.image_url === "string" && payload.image_url.length > 0;
    if (hasImage) {
      var header = el("div", "bc-header"), img = document.createElement("img"); img.src = payload.image_url; img.alt = "";
      img.addEventListener("error", function () { header.style.display = "none"; }); header.appendChild(img);
      if (payload.badge_text) header.appendChild(el("span", "bc-badge", payload.badge_text));
      card.appendChild(header);
    }
    var body = el("div", "bc-body"), titleRow = el("div", "bc-title-row"); titleRow.appendChild(el("h3", "bc-title", payload.main_title));
    if (!hasImage && payload.badge_text) titleRow.appendChild(el("span", "bc-badge", payload.badge_text));
    body.appendChild(titleRow);
    if (payload.subtitle) body.appendChild(el("p", "bc-subtitle", payload.subtitle));
    var hasPrimary = typeof payload.primary_card_title === "string" && payload.primary_card_title.length > 0;
    var hasSecondaryCard = typeof payload.secondary_card_title === "string" && payload.secondary_card_title.length > 0;
    var hasTertiary = typeof payload.tertiary_card_title === "string" && payload.tertiary_card_title.length > 0;
    if (hasPrimary || hasSecondaryCard || hasTertiary) {
      var details = el("div", "bc-details");
      if (hasPrimary && hasSecondaryCard) { var pair = el("div", "bc-detail-pair"); pair.appendChild(createDetailRow(payload.primary_card_title, payload.primary_card_subtitle, payload.primary_card_icon)); pair.appendChild(createDetailRow(payload.secondary_card_title || "", payload.secondary_card_subtitle, payload.secondary_card_icon)); details.appendChild(pair); }
      else if (hasPrimary) details.appendChild(createDetailRow(payload.primary_card_title, payload.primary_card_subtitle, payload.primary_card_icon));
      if (hasTertiary) details.appendChild(createDetailRow(payload.tertiary_card_title || "", payload.tertiary_card_subtitle, payload.tertiary_card_icon));
      body.appendChild(details);
    }
    if (payload.instructions) body.appendChild(el("p", "bc-instructions", payload.instructions));
    var actions = el("div", "bc-actions"), hasSecondary = typeof payload.secondary_button_label === "string" && payload.secondary_button_label.length > 0;
    if (hasSecondary) {
      var secBtn = document.createElement("button"); secBtn.type = "button"; secBtn.className = "bc-btn bc-btn--secondary"; secBtn.textContent = payload.secondary_button_label || "";
      if (payload.secondary_button_icon && iconResolver) iconResolver.resolveIcon(payload.secondary_button_icon, 14).then(function (svg) { if (svg) { svg.classList.add("bc-btn-icon"); secBtn.appendChild(svg); } });
      secBtn.addEventListener("click", function () { onSelect(payload.secondary_button_payload || payload.secondary_button_label, 1); });
      actions.appendChild(secBtn);
    }
    var priBtn = document.createElement("button"); priBtn.type = "button"; priBtn.className = "bc-btn bc-btn--primary" + (!hasSecondary ? " bc-btn--full" : ""); priBtn.textContent = payload.primary_button_label;
    if (payload.primary_button_icon && iconResolver) iconResolver.resolveIcon(payload.primary_button_icon, 14).then(function (svg) { if (svg) { svg.classList.add("bc-btn-icon"); priBtn.prepend(svg); } });
    priBtn.addEventListener("click", function () { onSelect(payload.primary_button_payload || payload.primary_button_label, 0); });
    actions.appendChild(priBtn); body.appendChild(actions); card.appendChild(body);
    return card;
  }
  Studio.renderBookingConfirmation = renderBookingConfirmation;

  /* ---------- rich-components/button-group.ts + buttons.ts ---------- */
  function renderButtonGroup(buttons, onSelect, selection, options) {
    var group = document.createElement("div"); group.className = "rc-buttons-group"; var disabled = selection !== undefined;
    buttons.forEach(function (btn, index) {
      var button = document.createElement("button");
      button.className = options && options.useVariant ? "rc-btn rc-btn-" + (btn.variant || "secondary") + " rc-text-truncate" : "rc-btn rc-text-truncate";
      button.setAttribute("type", "button"); button.setAttribute("tabindex", "0"); button.textContent = btn.label;
      if (disabled) { button.disabled = true; if (selection && selection.index === index) button.classList.add("rc-selected"); }
      var handleSelect = function () {
        if (disabled) return; disabled = true;
        onSelect(btn.value != null ? btn.value : btn.label, index);
        group.querySelectorAll(".rc-btn").forEach(function (e) { e.disabled = true; }); button.classList.add("rc-selected");
      };
      button.addEventListener("click", handleSelect);
      button.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); handleSelect(); } });
      group.appendChild(button);
    });
    return group;
  }
  function renderButtons(payload, onSelect, selection) {
    var wrapper = document.createElement("div"); wrapper.className = "rc-buttons";
    if (payload.text) { var textEl = document.createElement("div"); textEl.className = "rc-buttons-text"; textEl.dir = "auto"; textEl.textContent = payload.text; wrapper.appendChild(textEl); }
    wrapper.appendChild(renderButtonGroup(payload.buttons, onSelect, selection)); return wrapper;
  }
  Studio.renderButtons = renderButtons;

  /* ---------- rich-components/registry.ts + rich-renderer.ts ---------- */
  function ComponentRegistry() { this.renderers = new Map(); }
  ComponentRegistry.prototype.register = function (type, renderer) { this.renderers.set(type, renderer); };
  ComponentRegistry.prototype.get = function (type) { return this.renderers.get(type); };
  ComponentRegistry.prototype.has = function (type) { return this.renderers.has(type); };
  Studio.ComponentRegistry = ComponentRegistry;
  function renderRichMessage(components, registry, onSelect) {
    var container = document.createElement("div"); container.className = "rc-container"; var renderedCount = 0;
    components.forEach(function (component) {
      var renderer = registry.get(component.type);
      if (renderer) {
        var wrapped = function (value, index, cardIndex) { component.selection = { index: index, value: value }; if (cardIndex !== undefined) component.selection.cardIndex = cardIndex; onSelect(value, index, cardIndex, component); };
        container.appendChild(renderer(component.payload, wrapped, component.selection)); renderedCount++;
      }
    });
    if (components.length > 0 && renderedCount === 0) { var fb = document.createElement("span"); fb.className = "rc-fallback"; fb.textContent = "Message content not supported"; container.appendChild(fb); }
    return container;
  }
  Studio.renderRichMessage = renderRichMessage;

  /* Built-in registrations as in the widget: v1 snake_case names and the v2 kebab-case aliases (docs/rich-components/*.md) */
  Studio.createRegistry = function (iconResolver) {
    var r = new ComponentRegistry();
    var carousel = function (p, s, sel) { return renderCarousel(p, s, sel); };
    var card = function (p, s, sel) { return renderCarouselCard(p, s, sel); };
    var slp = function (p, s, sel) { return renderSelectionListPicker(p, s, sel, iconResolver); };
    var glp = function (p, s, sel) { return renderGroupedListPicker(p, s, sel); };
    var conf = function (p, s, sel) { return renderBookingConfirmation(p, s, sel, iconResolver); };
    var btns = function (p, s, sel) { return renderButtons(p, s, sel); };
    [["carousel", carousel], ["carousel_card", card], ["carousel-card", card], ["selection_list_picker", slp], ["selection-list-picker", slp], ["grouped_list_picker", glp], ["grouped-list-picker", glp], ["confirmation_card", conf], ["confirmation-card", conf], ["buttons", btns], ["reply-buttons", btns]].forEach(function (x) { r.register(x[0], x[1]); });
    return r;
  };
})();
