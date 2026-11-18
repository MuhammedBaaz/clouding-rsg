// Build "RSG Demo Storyboard - Saudi Arabic VO.docx" from the JSON written by
// export_storyboard_ar.py. English, left to right, except the Saudi Arabic
// voice-over (right to left) and Arabic quoted from the footage.
// Needs the npm package "docx" (v9) on NODE_PATH.
//   node build_storyboard_docx_ar.js <in.json> <out.docx>
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, HeadingLevel, Footer, PageNumber, AlignmentType,
} = require("docx");

const [, , inPath, outPath] = process.argv;
const D = JSON.parse(fs.readFileSync(inPath, "utf8"));

const FONT = { ascii: "Segoe UI", hAnsi: "Segoe UI", cs: "Segoe UI", eastAsia: "Segoe UI" };
const MONO = { ascii: "Consolas", hAnsi: "Consolas", cs: "Consolas", eastAsia: "Consolas" };
const INK = "010C1C", MUTED = "5D6B7E", TEAL = "007C7C", LINE = "D9DEE5", HEAD = "E8EEF2";
const PAGE_W = 11906, PAGE_H = 16838, MARGIN_X = 1021, MARGIN_Y = 1134;
const CONTENT_W = PAGE_W - 2 * MARGIN_X;          // 9864
const LABEL_W = 1500, BODY_W = CONTENT_W - LABEL_W;
const AR_LANG = { value: "ar-SA", bidirectional: "ar-SA" };

// ---------- English text (LTR) with Arabic quoted from the footage ----------
// «...» quotes that contain Arabic become right-to-left runs inside the English paragraph.
function en(text, o = {}) {
  const size = o.size || 19;
  const base = { font: FONT, size, sizeComplexScript: size, bold: !!o.bold, boldComplexScript: !!o.bold, color: o.color || INK, italics: !!o.italics };
  const runs = [];
  let last = 0;
  for (const m of text.matchAll(/«([^»]*)»/g)) {
    if (m.index > last) runs.push(new TextRun({ ...base, text: text.slice(last, m.index), language: { value: "en-GB" } }));
    const inner = m[1];
    const arabic = /[؀-ۿ]/.test(inner);
    runs.push(new TextRun({ ...base, text: "‎«", language: { value: "en-GB" } }));
    runs.push(new TextRun({ ...base, text: inner, rightToLeft: arabic, sizeComplexScript: size + 1, language: arabic ? AR_LANG : { value: "en-GB" } }));
    runs.push(new TextRun({ ...base, text: "»‎", language: { value: "en-GB" } }));
    last = m.index + m[0].length;
  }
  if (last < text.length) runs.push(new TextRun({ ...base, text: text.slice(last), language: { value: "en-GB" } }));
  return runs;
}
function enP(children, o = {}) {
  return new Paragraph({
    children: [children].flat(2), heading: o.heading, pageBreakBefore: !!o.pageBreakBefore,
    spacing: { before: o.before ?? 0, after: o.after ?? 60, line: o.line ?? 270 },
    keepNext: o.keepNext ?? true, keepLines: true,
  });
}

// ---------- Saudi Arabic voice-over (RTL) ----------
// Word reorders neutral characters next to Latin words inside right-to-left runs, so Latin
// words, numbers and codes in the Arabic line get their own LTR runs, anchored with an LRM.
const LTR_CHUNK = /(?:\.(?=[A-Za-z])|-(?=\d)|[A-Za-z0-9#@$+])[A-Za-z0-9#@$%+\-–.\/:,'’&×→·_ ]*/g;
function splitBidi(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(LTR_CHUNK)) {
    let chunk = m[0];
    while (chunk.length && !/[A-Za-z0-9%]/.test(chunk[chunk.length - 1])) chunk = chunk.slice(0, -1);
    if (!chunk) continue;
    if (m.index > last) out.push([text.slice(last, m.index), true]);
    out.push([/^[A-Za-z0-9]/.test(chunk) ? chunk : "‎" + chunk, false]);
    last = m.index + chunk.length;
  }
  if (last < text.length) out.push([text.slice(last), true]);
  return out;
}
function voP(text) {
  const size = 25;
  return new Paragraph({
    bidirectional: true, keepNext: true, keepLines: true, spacing: { before: 20, after: 80, line: 300 },
    children: splitBidi(text).map(([t, rtl]) => new TextRun({
      text: t, rightToLeft: rtl, font: FONT, size, sizeComplexScript: size, bold: true, boldComplexScript: true,
      color: INK, language: rtl ? AR_LANG : { value: "en-GB" },
    })),
  });
}

// ---------- monospace lines for filenames and timecodes ----------
function ltrP(text, o = {}) {
  return new Paragraph({
    alignment: AlignmentType.LEFT, indent: o.indent ? { left: o.indent } : undefined,
    children: [new TextRun({ text, font: MONO, size: o.size || 17, sizeComplexScript: o.size || 17, color: o.color || "1F2937" })],
    spacing: { before: 0, after: o.after ?? 40, line: 252 }, keepNext: o.keepNext ?? true, keepLines: true,
  });
}

// ---------- tables ----------
const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: thin, bottom: thin, left: thin, right: thin, insideHorizontal: thin, insideVertical: thin };
const cellMargins = { top: 70, bottom: 70, left: 110, right: 110 };

function cell(children, width, o = {}) {
  return new TableCell({
    children, width: { size: width, type: WidthType.DXA }, columnSpan: o.span, margins: cellMargins,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
  });
}
const label = (text, o = {}) => enP(en(text, { bold: true, size: 17, color: MUTED }), { after: o.after ?? 0, keepNext: o.keepNext });

// One shot = one table, kept on one page: rows can't split and every paragraph keeps
// with the next, except the very last paragraph of the table.
function shotTable(s) {
  const head = cell([enP([en(s.id, { bold: true, size: 22 }), en("  ·  " + s.title, { bold: true, size: 22 })], { after: 0 })],
    CONTENT_W, { span: 2, fill: HEAD });

  const timing = s.src_lines.flatMap((l) => Array.isArray(l) ? [ltrP(l[0], { after: 0 }), ltrP(l[1], { indent: 360 })] : [ltrP(l)]);
  const screen = [enP(en(s.screen)), enP([en("Notice: ", { bold: true, color: TEAL }), en(s.notice)], { after: 0 })];

  const vo = [label("Voice-over", { after: 40, keepNext: true })];
  if (s.vo) vo.push(voP(s.vo));
  if (s.rec_only) vo.push(enP(en("Recorded audio only.", { bold: true, color: TEAL, size: 21 })));
  if (s.rec) vo.push(enP(en(`${s.rec[0]}: «${s.rec[1]}»`, { color: MUTED, size: 18 })));
  if (!s.vo && !s.rec_only) {
    vo.push(enP(en(s.id === "O-02" ? "None. The O-01 voice-over runs on over this shot." : "None. Music only.", { color: MUTED })));
  }
  s.vo_meta.forEach((l) => vo.push(ltrP(l)));

  const notes = [enP(en(s.notes), { after: s.cue_lines.length ? 60 : 0, keepNext: s.cue_lines.length > 0 })];
  s.cue_lines.forEach((l, i) => notes.push(ltrP(l, { keepNext: i < s.cue_lines.length - 1, after: i < s.cue_lines.length - 1 ? 40 : 0 })));

  const row = (lab, body) => new TableRow({ cantSplit: true, children: [cell([label(lab)], LABEL_W), cell(body, BODY_W)] });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [LABEL_W, BODY_W], borders,
    rows: [
      new TableRow({ cantSplit: true, children: [head] }),
      row("Source and timing", timing),
      row("On screen", screen),
      new TableRow({ cantSplit: true, children: [cell(vo, CONTENT_W, { span: 2 })] }),
      row("Editor notes", notes),
    ],
  });
}

function refTable(header, rows, widths) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths, borders,
    rows: [new TableRow({ cantSplit: true, children: header.map((h, j) => cell([label(h, { keepNext: false })], widths[j], { fill: HEAD })) })]
      .concat(rows.map((r) => new TableRow({ cantSplit: true, children: r.map((c, j) => cell(c, widths[j])) }))),
  });
}

const spacer = () => new Paragraph({ children: [], spacing: { before: 0, after: 220 } });
const h2 = (text, o = {}) => enP(en(text, { bold: true, size: 24 }), { before: o.before ?? 200, pageBreakBefore: o.pageBreakBefore });

// ---------- document body ----------
const body = [];
body.push(enP(en(D.title, { bold: true, size: 38 }), { after: 60 }));
body.push(enP(en(D.subtitle, { bold: true, size: 26, color: TEAL }), { after: 160 }));
body.push(enP(en("Source: the English storyboard of 12 November 2026. Shot order, source filenames, source and program timecodes, holds, speeds, crops and masks are unchanged. Only the spoken voice-over is in Saudi Arabic; Arabic quoted in «» is on-screen text from the footage, as recorded.", { color: MUTED }), { after: 100 }));
body.push(ltrP("Source storyboard | RSG_Demo_Film_Storyboard.html"));
body.push(ltrP(`Runtime | ${D.total} (${D.total_s} s) | ${D.shots.length} shots | 1920x1080 | 30 fps`, { after: 120 }));

body.push(h2("Source files"));
body.push(enP(en("Copy the names exactly, including the space before .mp4 in the second file.", { color: MUTED })));
D.sources.forEach((f) => body.push(ltrP(`FILE | ${f}`)));

body.push(h2("Key"));
[
  "SRC: time in the named source file. PRG: time in the finished film, from 00:00.0.",
  "FREEZE and HOLD: a frozen frame and how long it is held. SPEED: playback speed. DUR: shot length.",
  "Cue: a timed editing instruction. Avoid: a range not to use. MASK: a patch over contact details.",
].forEach((t) => body.push(enP(en(t))));

body.push(h2("Decisions in this version"));
D.decisions.forEach((t) => body.push(enP(en(t))));

body.push(h2("Voice-over timing"));
body.push(enP(en(`Each Arabic line is checked against its program window, after recorded audio and holds. Rate: 1.6 words a second plus 0.25 s per pause, the pace of Rafiq's recorded Saudi voice replies, with extra time for amounts. ${D.vo_words} words in total, about ${D.vo_secs} s. Every line fits; a read-through in the voice artist's own voice is the final check.`), { keepNext: false }));

body.push(h2("Audio"));
body.push(enP(en(D.audio), { keepNext: false }));

body.push(h2("Framing key", { before: 0, pageBreakBefore: true }));
body.push(refTable(["Framing", "Description and source crop"],
  D.framings.map((f) => [[ltrP(f.key, { size: 19, after: 0, keepNext: false })], [enP(en(f.desc), { after: 40, keepNext: false }), ltrP(f.spec, { after: 0, keepNext: false })]]),
  [1100, CONTENT_W - 1100]));
body.push(spacer());
body.push(h2("Masks", { before: 0 }));
body.push(enP(en("Apply masks to the source clip before cropping and scaling. Coordinates are in 1920x1020 source pixels."), { after: 100 }));
body.push(refTable(["Mask", "What it covers and how"],
  D.masks.map((m) => [[ltrP(m.key, { size: 19, after: 0, keepNext: false })], [enP(en(m.text), { after: 40, keepNext: false }), ltrP(m.line, { after: 0, keepNext: false })]]),
  [1100, CONTENT_W - 1100]));

D.sections.forEach((sec) => {
  body.push(enP(en(sec.title, { bold: true, size: 30 }), { heading: HeadingLevel.HEADING_1, pageBreakBefore: true, after: 80 }));
  body.push(enP(en(sec.goal, { color: MUTED }), { after: 160 }));
  D.shots.filter((s) => s.sec === sec.key).forEach((s) => { body.push(shotTable(s)); body.push(spacer()); });
});

body.push(enP(en("Voice-over timing check", { bold: true, size: 30 }), { heading: HeadingLevel.HEADING_1, pageBreakBefore: true, after: 80 }));
body.push(enP(en("Estimated seconds against the room before the next line or the next recorded audio. No shot needs review.", { color: MUTED }), { after: 120 }));
const vh = ["Shot", "Words", "Est. s", "Room s", "Status"];
const vw = [1700, 1700, 2100, 2100, CONTENT_W - 7600];
body.push(new Table({
  width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: vw, borders,
  rows: [new TableRow({ children: vh.map((h, j) => cell([ltrP(h, { after: 0 })], vw[j], { fill: HEAD })) })]
    .concat(D.vo_check.map((v) => new TableRow({
      cantSplit: true,
      children: [v.shot, String(v.words), v.est, v.room, v.fits ? (v.spill > 0 ? "OK, runs on past the cut" : "OK") : "REVIEW"]
        .map((t, j) => cell([ltrP(t, { after: 0, keepNext: false })], vw[j])),
    }))),
}));
body.push(spacer());
body.push(h2("Pending approvals", { before: 0 }));
D.approvals.forEach((t, i) => body.push(enP(en(t), { keepNext: i < D.approvals.length - 1, after: 100 })));

const doc = new Document({
  creator: "Clouding AI", title: "RSG Demo Storyboard - Saudi Arabic VO",
  styles: {
    default: {
      document: { run: { font: "Segoe UI", size: 19 } },
      heading1: { run: { font: "Segoe UI", size: 30, bold: true, color: INK }, paragraph: { spacing: { before: 0, after: 80 }, keepNext: true } },
    },
  },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN_Y, bottom: MARGIN_Y, left: MARGIN_X, right: MARGIN_X } } },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "RSG Demo Storyboard - Saudi Arabic VO  |  ", font: MONO, size: 16, color: MUTED }),
            new TextRun({ children: [PageNumber.CURRENT], font: MONO, size: 16, color: MUTED }),
          ],
        })],
      }),
    },
    children: body,
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(outPath, buf); console.log("written", outPath, buf.length); });
