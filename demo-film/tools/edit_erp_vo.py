"""Two targeted edits to "Rafiq Demo Script - Red Sea Global - ERP Ending.docx":
1. shorter ERP to Concierge voice-over (no VO over the file transfer);
2. a new closing for the ERP-ending version (no name, business value), in yellow.
The closing row's timing cue and the "Timings (new section)" note are updated to
match the new closing; nothing else changes.

    python -P edit_erp_vo.py <in.docx> <out.docx>
"""
import re, sys, zipfile
from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}
q = lambda t: f"{{{W}}}{t}"
XML_SPACE = "{http://www.w3.org/XML/1998/namespace}space"
SRC, OUT = sys.argv[1], sys.argv[2]

ERP_VO = {
    1: ("ar", "وبعد الحجز، تنزل الإقامة في نظام حجوزات المنتجع، ويتعيّن لمحمد concierge شخصي، فيصل."),
    2: ("en", "[No VO: let the file transfer play on its own.]"),
    3: ("ar", "وتوصل لفيصل على الواتساب بيانات الضيف وتفاصيل إقامته."),
    4: ("ar", "ومعها ملف الضيف الداخلي، عشان يجهّز لإقامتهم."),
}
CLOSING = "كل اللي شاركه الضيف وقت الحجز، يوصل لفريق المنتجع جاهز، وما يحتاج أحد يدخله من جديد. والـ concierge يعرف ضيفه، ويستعد له قبل ما يوصل. هذا رفيق."
CLOSING_CUE_OLD_START = "Freeze 00:26.5"
CLOSING_CUE = ("Freeze 00:26.5 (the internal guest file and Faisal's reply in view) for about 11 s under the first sentence, "
               "run the recap (about 6.5 s) under «والـ concierge يعرف ضيفه…», and bring the outro card in on «هذا رفيق» (about 5 s).")
TIMING_OLD, TIMING_NEW = "plus about 29 s for the closing and outro card", "plus about 23 s for the closing and outro card"

zin = zipfile.ZipFile(SRC)
doc = etree.fromstring(zin.read("word/document.xml"))
body = doc.find("w:body", NS)


def rpr(rtl, size, italic=False, color=None, highlight=None):
    r = etree.Element(q("rPr"))
    for tag in ("b", "bCs"):
        etree.SubElement(r, q(tag)).set(q("val"), "0")
    if italic:
        for tag in ("i", "iCs"):
            etree.SubElement(r, q(tag)).set(q("val"), "1")
    if color:
        etree.SubElement(r, q("color")).set(q("val"), color)
    for tag in ("sz", "szCs"):
        etree.SubElement(r, q(tag)).set(q("val"), str(size))
    if highlight:
        etree.SubElement(r, q("highlight")).set(q("val"), highlight)
    etree.SubElement(r, q("rtl")).set(q("val"), "1" if rtl else "0")
    return r


def run(text, rtl, size, **k):
    r = etree.Element(q("r"))
    r.append(rpr(rtl, size, **k))
    t = etree.SubElement(r, q("t"))
    t.text, _ = text, t.set(XML_SPACE, "preserve")
    return r


def ar_runs(text, highlight=None):
    """Arabic narration: Latin words as LTR runs, the rest RTL (document convention)."""
    out, last = [], 0
    for m in re.finditer(r"[A-Za-z][A-Za-z ]*[A-Za-z]|[A-Za-z]", text):
        if m.start() > last:
            out.append(run(text[last:m.start()], True, 21, highlight=highlight))
        out.append(run(m.group(0), False, 21, highlight=highlight))
        last = m.end()
    if last < len(text):
        out.append(run(text[last:], True, 21, highlight=highlight))
    return out


def en_runs(text, size, color=None):
    out = []
    for part in re.split(r"(«[^»]*»)", text):
        if not part:
            continue
        if part.startswith("«"):
            out.append(run("‎«", False, size, color=color))
            out.append(run(part[1:-1], bool(re.search(r"[؀-ۿ]", part)), size, color=color))
            out.append(run("»‎", False, size, color=color))
        else:
            out.append(run(part, False, size, color=color))
    return out


def replace_runs(p, new_runs, rtl_par=True):
    for r in p.findall("w:r", NS):
        p.remove(r)
    ppr = p.find("w:pPr", NS)
    bidi = ppr.find("w:bidi", NS)
    if rtl_par and bidi is None:
        b = etree.Element(q("bidi")); b.set(q("val"), "1"); ppr.insert(0, b)
    if not rtl_par and bidi is not None:
        ppr.remove(bidi)
    for r in new_runs:
        p.append(r)


txt = lambda e: "".join(e.itertext())
tbls = body.findall("w:tbl", NS)
erp = next(t for t in tbls if txt(t.findall("w:tr", NS)[1].findall("w:tc", NS)[0]) == "[00:01–00:03]")
rows = erp.findall("w:tr", NS)
assert [txt(r.findall("w:tc", NS)[0]) for r in rows[1:]] == ["[00:01–00:03]", "[00:03–00:07]", "[00:07–00:18]", "[00:18–00:27]", "[00:26–00:27]"]

# 1. ERP voice-over
for i, (kind, text) in ERP_VO.items():
    paras = rows[i].findall("w:tc", NS)[1].findall("w:p", NS)
    assert len(paras) == 1
    if kind == "ar":
        replace_runs(paras[0], ar_runs(text))
    else:
        replace_runs(paras[0], [run(text, False, 21, italic=True)], rtl_par=False)

# 2. closing: narration (yellow), its timing cue, and the timings note
close = rows[5].findall("w:tc", NS)
replace_runs(close[1].findall("w:p", NS)[0], ar_runs(CLOSING, highlight="yellow"))
cue = [p for p in close[3].findall("w:p", NS) if txt(p).startswith(CLOSING_CUE_OLD_START)]
assert len(cue) == 1
replace_runs(cue[0], en_runs(CLOSING_CUE, 18, color="c0121c"), rtl_par=False)
note = [t for t in body.iter(q("t")) if t.text and TIMING_OLD in t.text]
assert len(note) == 1
note[0].text = note[0].text.replace(TIMING_OLD, TIMING_NEW)

xml = etree.tostring(doc, xml_declaration=True, encoding="UTF-8", standalone=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        zi = zipfile.ZipInfo(item.filename, date_time=item.date_time)
        zi.compress_type = zipfile.ZIP_DEFLATED
        zout.writestr(zi, xml if item.filename == "word/document.xml" else zin.read(item.filename))
print("written", OUT)
