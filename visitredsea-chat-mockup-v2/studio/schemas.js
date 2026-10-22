/* Empathy Studio component schemas, copied verbatim from the registered-component reference supplied by Clouding AI
   (C:\Users\Compumarts\.claude\skills\empathy-studio\references\components.md). Draft 2020-12, additionalProperties:false.
   The validator below checks: type, required, additionalProperties, maxLength, enum, array items. It is a preview aid;
   phase 2 runs a full Draft 2020-12 validator. */
(function () {
  "use strict";
  var S = window.EmpathyStudio = window.EmpathyStudio || {};
  S.schemas = {
    carousel: {"type":"object","$schema":"https://json-schema.org/draft/2020-12/schema","required":["cards"],"properties":{"cards":{"type":"array","items":{"type":"object","required":["image_url","badge_title","badge_position","main_title","subtitle","description","primary_button_label","primary_button_payload","secondary_button_label","secondary_button_payload","tertiary_button_label","tertiary_button_payload","lock_after_selection"],"properties":{"subtitle":{"type":"string","maxLength":30},"image_url":{"type":"string"},"main_title":{"type":"string","maxLength":60},"badge_title":{"type":"string","maxLength":15},"description":{"type":"string"},"badge_position":{"enum":["top-left","top-right","bottom-left","bottom-right"],"type":"string"},"lock_after_selection":{"type":"boolean"},"primary_button_label":{"type":"string","maxLength":30},"tertiary_button_label":{"type":"string"},"primary_button_payload":{"type":"string"},"secondary_button_label":{"type":"string"},"tertiary_button_payload":{"type":"string"},"secondary_button_payload":{"type":"string"}},"additionalProperties":false}}},"additionalProperties":false},
    confirmation_card: {"type":"object","$schema":"https://json-schema.org/draft/2020-12/schema","required":["image_url","badge_text","main_title","subtitle","primary_card_title","primary_card_subtitle","primary_card_icon","secondary_card_title","secondary_card_subtitle","secondary_card_icon","tertiary_card_title","tertiary_card_subtitle","tertiary_card_icon","instructions","primary_button_label","primary_button_payload","primary_button_icon","secondary_button_label","secondary_button_payload","secondary_button_icon"],"properties":{"subtitle":{"type":"string"},"image_url":{"type":"string"},"badge_text":{"type":"string","maxLength":15},"main_title":{"type":"string","maxLength":30},"instructions":{"type":"string","maxLength":150},"primary_card_icon":{"type":"string"},"primary_card_title":{"type":"string","maxLength":15},"tertiary_card_icon":{"type":"string"},"primary_button_icon":{"type":"string"},"secondary_card_icon":{"type":"string"},"tertiary_card_title":{"type":"string","maxLength":15},"primary_button_label":{"type":"string","maxLength":30},"secondary_card_title":{"type":"string","maxLength":15},"primary_card_subtitle":{"type":"string","maxLength":150},"secondary_button_icon":{"type":"string"},"primary_button_payload":{"type":"string"},"secondary_button_label":{"type":"string","maxLength":30},"tertiary_card_subtitle":{"type":"string","maxLength":150},"secondary_card_subtitle":{"type":"string","maxLength":150},"secondary_button_payload":{"type":"string"}},"additionalProperties":false},
    selection_list_picker: {"type":"object","$schema":"https://json-schema.org/draft/2020-12/schema","required":["main_title","items","lock_after_selection"],"properties":{"items":{"type":"array","items":{"type":"object","required":["title","subtitle","icon","badge","payload"],"properties":{"icon":{"type":"string"},"badge":{"type":"string","maxLength":10},"title":{"type":"string","maxLength":30},"payload":{"type":"string"},"subtitle":{"type":"string","maxLength":60}},"additionalProperties":false}},"main_title":{"type":"string","maxLength":30},"lock_after_selection":{"type":"boolean"}},"additionalProperties":false},
    image: {"type":"object","$schema":"https://json-schema.org/draft/2020-12/schema","required":["url","caption"],"properties":{"url":{"type":"string"},"caption":{"type":"string"}},"additionalProperties":false},
    text: {"type":"object","$schema":"https://json-schema.org/draft/2020-12/schema","required":["text"],"properties":{"text":{"type":"string"}},"additionalProperties":false},
    grouped_list_picker: {"type":"object","$schema":"https://json-schema.org/draft/2020-12/schema","required":["groups","main_title","send_button_label","lock_after_selection","is_multiple_selection"],"properties":{"groups":{"type":"array","items":{"type":"object","required":["title","options"],"properties":{"title":{"type":"string","maxLength":30},"options":{"type":"array","items":{"type":"string"}}},"additionalProperties":false}},"main_title":{"type":"string","maxLength":30},"send_button_label":{"type":"string","maxLength":30},"lock_after_selection":{"type":"boolean"},"is_multiple_selection":{"type":"boolean"}},"additionalProperties":false},
    reply_buttons: {"type":"object","$schema":"https://json-schema.org/draft/2020-12/schema","required":["header_type","header_text","header_media_url","body_text","footer_text","buttons"],"properties":{"buttons":{"type":"array","items":{"type":"string"}},"body_text":{"type":"string"},"footer_text":{"type":"string"},"header_text":{"type":"string"},"header_type":{"enum":["text","image","video","document"],"type":"string"},"header_media_url":{"type":"string"}},"additionalProperties":false}
  };
  function typeOf(v) { return Array.isArray(v) ? "array" : v === null ? "null" : typeof v; }
  function validate(schema, value, path, errors) {
    path = path || "$"; errors = errors || [];
    if (schema.type && typeOf(value) !== schema.type) { errors.push(path + ": expected " + schema.type + ", got " + typeOf(value)); return errors; }
    if (schema.enum && schema.enum.indexOf(value) < 0) errors.push(path + ": not one of " + schema.enum.join("|"));
    if (schema.type === "string" && schema.maxLength != null && Array.from(value).length > schema.maxLength) errors.push(path + ": " + Array.from(value).length + " chars > maxLength " + schema.maxLength);
    if (schema.type === "object") {
      (schema.required || []).forEach(function (k) { if (!(k in value)) errors.push(path + ": missing required '" + k + "'"); });
      Object.keys(value).forEach(function (k) {
        if (schema.properties && schema.properties[k]) validate(schema.properties[k], value[k], path + "." + k, errors);
        else if (schema.additionalProperties === false) errors.push(path + ": additional property '" + k + "'");
      });
    }
    if (schema.type === "array" && schema.items) value.forEach(function (v, i) { validate(schema.items, v, path + "[" + i + "]", errors); });
    return errors;
  }
  S.validate = function (type, payload) { var sc = S.schemas[type]; if (!sc) return ["no schema registered for type '" + type + "'"]; return validate(sc, payload); };
})();
