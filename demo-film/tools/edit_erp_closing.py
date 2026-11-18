"""Revise only the closing row of the ERP-ending script: new voice-over (yellow),
ERP handoff as the final visual, and the matching timing cue.

    python -P edit_erp_closing.py <in.docx> <out.docx>
"""
import re, sys, zipfile
from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}
q = lambda t: f"{{{W}}}{t}"
SRC, OUT = sys.argv[1], sys.argv[2]

CLOSING = "من أول سؤال، رفيق يوصّل الضيف للمنتجع المناسب ولحجزه بخطوات أقل، بدون ما يعيد كلامه. وفريق المنتجع يستلم حجز واضح يشتغلون عليه."
VISUAL = ("CLOSING (ERP ending): the ERP handoff is the final shot. Pull back to the full handoff from the last frame of ERP to Concierge "
          "(00:26.5): the booking-system panel with Faisal assigned, «سُلّم عبر واتساب» and «أُرسل إلى واتساب فيصل ✓», beside Faisal's phone "
          "with the internal guest file received → branded outro card.")
CUE_OLD_START = "Freeze 00:26.5"
CUE = ("Freeze 00:26.5 in the full handoff framing (panel and phone, as at 00:01–00:03) for about 17 s with a slow push-in on «سُلّم عبر واتساب»; "
       "the VO runs about 14.5 s. Then cut to the branded outro card (about 6 s, no VO). Keep both phone-number masks on the freeze.")


def rpr(rtl, size, color=None, highlight=None):
    r = etree.Element(q("rPr"))
    for tag in ("b", "bCs"):
        etree.SubElement(r, q(tag)).set(q("val"), "0")
    if color:
        etree.SubElement(r, q("color")).set(q("val"), color)
    for tag in ("sz", "szCs"):
        etree.SubElement(r, q(tag)).set(q("val"), str(size))
    if highlight:
        etree.SubElement(r, q("highlight")).set(q("val"), highlight)
    etree.SubElement(r, q("rtl")).set(q("val"), "1" if rtl else "0")
    return r


def run(text, rtl, size, arrow=False, **k):
    r = etree.Element(q("r"))
    p = rpr(rtl, size, **k)
    if arrow:
        f = etree.Element(q("rFonts"))
        for a in ("ascii", "cs", "eastAsia", "hAnsi"):
            f.set(q(a), "Arial Unicode MS")
        p.insert(0, f)
    r.append(p)
    t = etree.SubElement(r, q("t"))
    t.text = text
    t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    return r


def ar_runs(text, highlight=None):
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
    for part in re.split(r"(«[^»]*»|→)", text):
        if not part:
            continue
        if part == "→":
            out.append(run("→", False, size, arrow=True, color=color))
        elif part.startswith("«"):
            out.append(run("‎«", False, size, color=color))
            out.append(run(part[1:-1], bool(re.search(r"[؀-ۿ]", part)), size, color=color))
            out.append(run("»‎", False, size, color=color))
        else:
            out.append(run(part, False, size, color=color))
    return out


def replace_runs(p, new_runs, rtl_par):
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


zin = zipfile.ZipFile(SRC)
doc = etree.fromstring(zin.read("word/document.xml"))
body = doc.find("w:body", NS)
txt = lambda e: "".join(e.itertext())
close = [tr for tbl in body.findall("w:tbl", NS) for tr in tbl.findall("w:tr", NS)
         if txt(tr.findall("w:tc", NS)[0]) == "[00:26–00:27]"]
assert len(close) == 1
cells = close[0].findall("w:tc", NS)
assert txt(cells[2]).startswith("CLOSING (ERP ending)")

replace_runs(cells[1].findall("w:p", NS)[0], ar_runs(CLOSING, highlight="yellow"), rtl_par=True)
vp = cells[2].findall("w:p", NS)
assert len(vp) == 1
replace_runs(vp[0], en_runs(VISUAL, 18), rtl_par=False)
cue = [p for p in cells[3].findall("w:p", NS) if txt(p).startswith(CUE_OLD_START)]
assert len(cue) == 1
replace_runs(cue[0], en_runs(CUE, 18, color="c0121c"), rtl_par=False)

xml = etree.tostring(doc, xml_declaration=True, encoding="UTF-8", standalone=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        zi = zipfile.ZipInfo(item.filename, date_time=item.date_time)
        zi.compress_type = zipfile.ZIP_DEFLATED
        zout.writestr(zi, xml if item.filename == "word/document.xml" else zin.read(item.filename))
print("written", OUT)
