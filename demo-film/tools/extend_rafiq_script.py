"""Extend "Rafiq Demo Script - Red Sea Global.docx" with the ERP to Concierge and
Concierge to Customer sections, keeping the Agent section verbatim.

    python -P extend_rafiq_script.py <source.docx> <out.docx> [--ending erp]

--ending erp builds the cut that ends with ERP to Concierge: no Concierge to
Customer section, and an alternate closing (one new sentence) after the ERP table.

The source file is only read. New rows clone the source's own XML patterns
(Google Docs export: TIME | NARRATION | VISUAL | SUGGESTED EDITS). The closure
(last sentences of the [08:00–08:40] row and its outro-card note) moves to the
end; revised closure sentences get yellow highlighting, nothing else new does.
Timecodes below were checked frame by frame in demo-film/PHASE1_FOOTAGE_LOG.md.
"""
import copy, re, sys, zipfile
from lxml import etree

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}
q = lambda tag: f"{{{W}}}{tag}"
SRC, OUT = sys.argv[1], sys.argv[2]
ENDING = "erp" if sys.argv[3:5] == ["--ending", "erp"] else "full"

zin = zipfile.ZipFile(SRC)
doc = etree.fromstring(zin.read("word/document.xml"))
body = doc.find("w:body", NS)
kids = list(body)
TITLE_HEAD, JOURNEY, AGENT_TBL, PB_NOTES, NOTE_TMPL = kids[2], kids[3], kids[4], kids[5], kids[7]
LAST_NOTE = kids[11]
assert "".join(TITLE_HEAD.itertext()).startswith("VIDEO: AI Concierge")
assert etree.QName(AGENT_TBL).localname == "tbl"

# ---------------------------------------------------------------- run helpers
ARABIC = re.compile(r"[؀-ۿ]")
LATIN_IN_AR = re.compile(r"[A-Za-z][A-Za-z ]*[A-Za-z]|[A-Za-z]")


def rpr(rtl, size=None, bold=None, italic=False, color=None, highlight=None, arrow_font=False):
    r = etree.Element(q("rPr"))
    if arrow_font:
        f = etree.SubElement(r, q("rFonts"))
        for a in ("ascii", "cs", "eastAsia", "hAnsi"):
            f.set(q(a), "Arial Unicode MS")
    if bold is not None:
        etree.SubElement(r, q("b")).set(q("val"), "1" if bold else "0")
        etree.SubElement(r, q("bCs")).set(q("val"), "1" if bold else "0")
    if italic:
        etree.SubElement(r, q("i")).set(q("val"), "1")
        etree.SubElement(r, q("iCs")).set(q("val"), "1")
    if color:
        etree.SubElement(r, q("color")).set(q("val"), color)
    if size:
        etree.SubElement(r, q("sz")).set(q("val"), str(size))
        etree.SubElement(r, q("szCs")).set(q("val"), str(size))
    if highlight:
        etree.SubElement(r, q("highlight")).set(q("val"), highlight)
    etree.SubElement(r, q("rtl")).set(q("val"), "1" if rtl else "0")
    return r


def run(text, **k):
    r = etree.Element(q("r"))
    r.append(rpr(**k))
    t = etree.SubElement(r, q("t"))
    t.text = text
    t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    return r


def para(runs, rtl_par=False):
    p = etree.Element(q("p"))
    ppr = etree.SubElement(p, q("pPr"))
    if rtl_par:
        etree.SubElement(ppr, q("bidi")).set(q("val"), "1")
    etree.SubElement(ppr, q("rPr"))
    for r in runs:
        p.append(r)
    return p


def ar_runs(text, size=21, highlight=None):
    """Arabic narration: Latin words as LTR runs, everything else RTL (source convention)."""
    out, last = [], 0
    for m in LATIN_IN_AR.finditer(text):
        if m.start() > last:
            out.append(run(text[last:m.start()], rtl=True, size=size, bold=False, highlight=highlight))
        out.append(run(m.group(0), rtl=False, size=size, bold=False, highlight=highlight))
        last = m.end()
    if last < len(text):
        out.append(run(text[last:], rtl=True, size=size, bold=False, highlight=highlight))
    return out


def en_runs(text, size=18, color=None, bold=False):
    """English text with «Arabic» quotes and → arrows (source convention).
    An LRM before « and after » keeps neighbouring Arabic quotes in reading order."""
    out = []
    for part in re.split(r"(«[^»]*»|→)", text):
        if not part:
            continue
        if part == "→":
            out.append(run("→", rtl=False, size=size, bold=bold, color=color, arrow_font=True))
        elif part.startswith("«"):
            inner = part[1:-1]
            out.append(run("‎«", rtl=False, size=size, bold=bold, color=color))
            out.append(run(inner, rtl=bool(ARABIC.search(inner)), size=size, bold=bold, color=color))
            out.append(run("»‎", rtl=False, size=size, bold=bold, color=color))
        else:
            out.append(run(part, rtl=False, size=size, bold=bold, color=color))
    return out


RED = "c0121c"


def edit_para(text):
    m = re.match(r"(EDIT \d+)(.*)", text)
    if m:  # new EDIT labels: bold red, no highlight (yellow is kept for the revised closure)
        return para([run(m.group(1), rtl=False, size=18, bold=True, color=RED)] + en_runs(m.group(2), color=RED))
    return para(en_runs(text, color=RED))


def cell(paras):
    tc = etree.Element(q("tc"))
    etree.SubElement(tc, q("tcPr"))
    for p in paras:
        tc.append(p)
    return tc


def row(time, narration, visual, edits, narr_paras=None):
    tr = etree.Element(q("tr"))
    trpr = etree.SubElement(tr, q("trPr"))
    etree.SubElement(trpr, q("cantSplit")).set(q("val"), "0")
    etree.SubElement(trpr, q("tblHeader")).set(q("val"), "0")
    tr.append(cell([para([run(time, rtl=False, size=18, bold=True, color=RED)])]))
    tr.append(cell(narr_paras or [para(ar_runs(narration), rtl_par=True)]))
    tr.append(cell([para(en_runs(visual))]))
    tr.append(cell([edit_para(e) for e in edits]))
    return tr


def table(rows):
    t = etree.Element(q("tbl"))
    t.append(copy.deepcopy(AGENT_TBL.find("w:tblPr", NS)))
    t.append(copy.deepcopy(AGENT_TBL.find("w:tblGrid", NS)))
    t.append(copy.deepcopy(AGENT_TBL.findall("w:tr", NS)[0]))   # header row
    for r in rows:
        t.append(r)
    return t


def text_clone(tmpl, text):
    el = copy.deepcopy(tmpl)
    for k in ("{http://schemas.microsoft.com/office/word/2010/wordml}paraId",):
        if k in el.attrib:
            del el.attrib[k]
    ts = el.findall(".//w:t", NS)
    ts[0].text = text
    for t in ts[1:]:
        t.text = ""
    return el


def note(label, text):
    el = copy.deepcopy(NOTE_TMPL)
    k = "{http://schemas.microsoft.com/office/word/2010/wordml}paraId"
    if k in el.attrib:
        del el.attrib[k]
    ts = el.findall(".//w:t", NS)
    ts[0].text = label + ": "
    ts[1].text = text
    return el


def page_break():
    el = copy.deepcopy(PB_NOTES)
    k = "{http://schemas.microsoft.com/office/word/2010/wordml}paraId"
    if k in el.attrib:
        del el.attrib[k]
    return el


# ---------------------------------------------------------------- split the closure out of the last Agent row
agent_rows = AGENT_TBL.findall("w:tr", NS)
last = agent_rows[-1]
lc = last.findall("w:tc", NS)
assert "".join(lc[0].itertext()) == "[08:00–08:40]"
narr_p = lc[1].find("w:p", NS)
runs = narr_p.findall("w:r", NS)
texts = ["".join(r.itertext()) for r in runs]
start = next(i for i in range(1, len(runs)) if texts[i] == "من" and texts[i - 1] == ". " and texts[i - 2] == "الولاء")
end = len(runs)
while end > 0 and texts[end - 1] == "":
    end -= 1                                   # keep the export's trailing empty run in place
closure_runs = runs[start:end]
for r in closure_runs:
    narr_p.remove(r)
closure_text = "".join("".join(r.itertext()) for r in closure_runs)
assert closure_text.startswith("من «السلام عليكم»") and closure_text.endswith("booking.")

outro_p = [p for p in lc[3].findall("w:p", NS) if "".join(p.itertext()).startswith("End on a branded outro card")]
assert len(outro_p) == 1
lc[3].remove(outro_p[0])

# split the moved closure runs into its three sentences: S1 ... الساعة. | S2 هذا رفيق. | S3 concierge ... booking.
ctexts = ["".join(r.itertext()) for r in closure_runs]
i_s2 = next(i for i, t in enumerate(ctexts) if t == "هذا")
i_s3 = next(i for i, t in enumerate(ctexts) if t == "concierge")
S1, S2, S3 = closure_runs[:i_s2], closure_runs[i_s2:i_s3], closure_runs[i_s3:]
assert "".join("".join(r.itertext()) for r in S2).strip() == "هذا رفيق."


def mark(r):
    rp = r.find("w:rPr", NS)
    h = etree.Element(q("highlight"))
    h.set(q("val"), "yellow")
    rtl = rp.find("w:rtl", NS)
    rtl.addprevious(h)
    return r


S4_TEXT = {"full": "ومع فيصل، يبدأ الاهتمام الشخصي بالضيف من قبل ما يوصل. ",
           "erp": "وكل هالتفاصيل توصل لفيصل، عشان يكون عنده كل اللي يحتاجه ويهتم بإقامتهم. "}[ENDING]
s4_runs = ar_runs(S4_TEXT, highlight="yellow")
# a non-breaking space keeps «AI concierge» on one line
s3_runs = [run("AI ", rtl=False, size=21, bold=False, highlight="yellow")] + [mark(r) for r in S3]
closure_para = para(S1 + s4_runs + S2 + s3_runs, rtl_par=True)

# ---------------------------------------------------------------- new content
ERP_HEAD = "VIDEO: ERP to Concierge (00:27 source, about 00:51 after edits" + (", then the closing)" if ENDING == "erp" else ")")
ERP_JOURNEY = ("Journey: the booking lands in the resort's booking system → the resort assigns Faisal as the guest's personal concierge "
               "→ the internal guest file travels to Faisal's WhatsApp → booking essentials as messages → internal guest file arrives "
               "→ Faisal confirms he will contact the guest today" + (" → closing" if ENDING == "erp" else ""))
ERP_ROWS = [
    ("[00:01–00:03]",
     "والـ booking ما يوقف عند الشات. نفس الإقامة توصل لنظام حجوزات المنتجع، حتى طلب تسجيل الحضور المتأخر. والمنتجع يعيّن لمحمد concierge شخصي: فيصل.",
     "Booking-system overlay «نظام الحجوزات · Shebara» opens beside Faisal's iPhone («فيصل · الكونسيرج الشخصي · Shebara», tagged «المستلم»). "
     "Record for «السيد محمد باز» («فئة الضيافة المميزة»): «Shebara· فيلا فوق الماء بغرفة نوم واحدة», Fri 23 – Sun 25 Oct 2026 (2 nights), "
     "«شخصان بالغان· مع زوجته نورة الحربي», arrival Yanbu / departure RSIA, special request «تسجيل وصول متأخر إن أمكن», total SAR 33,793.90 incl. taxes, "
     "concierge slot «بانتظار الإسناد», attachment «ملف الضيف وتفاصيل الحجز.pdf» → stage bar moves from «جديد» to «مُسند للكونسيرج» → "
     "Faisal's card «أُسند 2:05 م» → log «2:05 م · أُسند الحجز إلى فيصل».",
     ["EDIT 8 (00:00–00:01): start at 00:01.5, after the overlay opens. The first second shows an older chat build behind it.",
      "Crop the browser chrome as in the booking video.",
      "Freeze 00:01.6 for about 9 s with a slow push across the record rows (stay, guests, transfers, special request, total), play to 00:03.5, then hold Faisal's card about 5 s.",
      "Mask the guest's mobile number under the name for the whole clip.",
      "Zoom from «بانتظار الإسناد» to Faisal's card."]),
    ("[00:03–00:07]",
     "وملف الضيف الداخلي ينتقل من نظام المنتجع لواتساب فيصل.",
     "Attachment chip highlights and the button reads «جارٍ الإرسال…» → the PDF lifts off the panel and travels along a curve into Faisal's phone "
     "→ panel: «أُرسل إلى واتساب فيصل ✓», stage «سُلّم عبر واتساب», log «2:06 م · أُرسل ملف الضيف إلى واتساب فيصل» → phone header «typing…».",
     ["Slow the transfer (00:03.6–00:05.4) to 40% with frame blending or optical flow, so the file is seen leaving the ERP screen and landing in the phone (about 4.5 s).",
      "Lower-third «Internal guest file» as the file leaves the panel.",
      "The recording is silent: one soft swish under the transfer."]),
    ("[00:07–00:18]",
     "وعلى الواتساب، توصل لفيصل الأساسيات: مين الضيف، وين إقامته ومتى، ومع مين، وكيف يتواصل معه.",
     "Messages from «نظام الحجوزات · Shebara» (2:05–2:06 PM): «مرحبًا فيصل، تم إسناد حجز جديد لك في Shebara للضيف السيد محمد باز.» → "
     "«الضيف ضمن فئة الضيافة المميزة. الإقامة في فيلا فوق الماء بغرفة نوم واحدة من 23 إلى 25 أكتوبر 2026 (ليلتان) لشخصين بالغين، مع زوجته نورة الحربي.» → "
     "«جوال الضيف: … تقدر تتواصل معه مباشرة لتنسيق الإقامة.»",
     ["Punch in on Faisal's phone. Keep 100% speed: the 3–4 s between messages gives each one time to read.",
      "Mask the number in the third message (from 00:16 to the end).",
      "Soft tick on each arrival, no notification sounds."]),
    ("[00:18–00:27]",
     "وهنا يوصل ملف الضيف الداخلي، فيه اللي يحتاجه فيصل عشان يهتم بإقامتهم، وهو غير الـ itinerary حق محمد. وفيصل يرد: بتواصل مع السيد محمد اليوم.",
     "Document «ملف الضيف وتفاصيل الحجز.pdf» (1 page · 166 kB · PDF) with «التفاصيل الكاملة للضيف والحجز في الملف المرفق.» (2:06 PM) → "
     "Faisal replies (2:08 PM, read): «استلمت الملف، شكرًا. بتواصل مع السيد محمد اليوم وأنسّق معه تفاصيل الإقامة.»",
     ["Freeze 00:21 (document in view, before Faisal's reply) for about 9 s with a slow push-in on the document.",
      "Keep the «Internal guest file» lower-third on the document, styled differently from the guest's itinerary PDF at 08:00 of the booking video.",
      "The file is never opened in the recording. Don't show or describe its pages.",
      "Play Faisal's reply to 00:26.5."]),
]

CON_HEAD = "VIDEO: Concierge to Customer (00:43 source, about 00:48 after edits, then the closing)"
CON_JOURNEY = ("Journey: same day, Faisal writes to the guest on WhatsApp → personal concierge for the whole stay → message any time, even before travelling "
               "→ two days later the guest asks to book an experience → kayaking on the 24th → Faisal arranges it and will confirm the time → closing")
CON_ROWS = [
    ("[00:04–00:15]",
     "ونفس اليوم، يكتب فيصل لمحمد على الواتساب. يعرّف بنفسه إنه الـ concierge الشخصي، ومعهم في كل تفصيلة طول الإقامة، وحتى قبل السفر يقدرون يراسلونه في أي وقت.",
     "Guest's iPhone, chat «فيصل · Shebara», «Oct 19, 2026». Faisal (4:12 PM): «يا هلا بك يا محمد، معك فيصل من فريق Shebara. أنا الكونسيرج الشخصي اللي بيكون معكم طول إقامتكم، ويسعدنا إنكم اخترتونا.» → "
     "Faisal (4:13 PM): «من لحظة وصولكم للجزيرة أنا معكم في كل تفصيلة. وإذا احتجت شي قبل السفر، أو ودّك نرتّب لكم شي معيّن، راسلني هنا على الواتساب في أي وقت.» → "
     "guest (4:25 PM): «حياك الله يا فيصل، وشكرًا على الترحيب. حاليًا كل شي تمام، وإذا احتجنا شي بتواصل معك.»",
     ["EDIT 9 (00:00–00:04): start at 00:04. The first second shows the older chat build behind the overlay, and the empty chat until the first message (00:05) needs only a beat.",
      "Freeze 00:12 (both of Faisal's messages in view, before the guest's reply) for about 8 s.",
      "Punch in on the phone and crop the dimmed website behind it.",
      "Soft tick on each arrival."]),
    ("[00:15–00:19]",
     "وبعد يومين، محمد يرجع للتجارب اللي أجّلها، ويكتب لفيصل إنه يبي يحجز وحدة.",
     "Date chip «Oct 21, 2026» → guest (11:08 AM): «هلا فيصل، شفت التجارب المتاحة في المنتجع وودّي أحجز وحدة منها.»",
     ["Lower-third «Two days later» as the «Oct 21, 2026» chip appears (00:15), held about 2.5 s.",
      "Freeze 00:18.9 (request in view, before Faisal's reply) for about 4.5 s."]),
    ("[00:19–00:31]",
     "فيصل يسأله أي تجربة وأي يوم يناسبهم، ومحمد يختار الكاياك، يوم ٢٤.",
     "Faisal (11:10 AM): «يا هلا بك من جديد يا محمد، أبشر. أي تجربة في بالك؟» → guest (11:11 AM): «التجديف بالكاياك.» → "
     "Faisal (11:12 AM): «اختيار جميل. أي يوم من أيام إقامتكم يناسبكم؟» → guest (11:13 AM): «يوم 24.» → «typing…»",
     ["Play at 100%; the messages land about 2 s apart.",
      "Let Faisal's first question land before the VO starts."]),
    ("[00:31–00:39]",
     "وفيصل يرتّب له الكاياك يوم السبت، ويتابع معه عشان يأكد الوقت.",
     "Faisal (11:16 AM): «تم يا محمد، حجزت لكم الكاياك يوم السبت 24 أكتوبر، وبأكد لك الوقت بالضبط قبل الموعد. وإذا احتجت أي شي ثاني أنا موجود.» → "
     "guest (11:17 AM): «شكرًا لك يا فيصل، الله يعطيك العافية.»",
     ["Zoom on «وبأكد لك الوقت بالضبط قبل الموعد».",
      "The VO says Faisal arranges the kayak and will confirm the time. It does not call it a confirmed reservation."]),
]
CLOSE_ROW = (
    "[00:39–00:43]",
    "CLOSING (whole journey): hold on the final exchange → a short recap of the three screens: Rafiq's trip-details card (booking video 08:02), "
    "the booking-system record with Faisal assigned (ERP to Concierge 00:26) and the guest's chat with Faisal → branded outro card.",
    ["EDIT 10 (00:39–00:42): cut the scroll to the top of the chat and back. Freeze 00:39.5 instead (last two messages in view).",
     "Freeze about 11 s under the first sentence, run the recap (about 7 s) under «ومع فيصل…», and bring the outro card in on «هذا رفيق» (about 9 s)."],
)

NEW_NOTES = [
    ("Sources (new sections)", "«ERP to Concierge .mp4» (00:27, note the space before .mp4) and «Concierge to Customer.mp4» (00:43). Times in their tables refer to each file. "
     "Both recordings are silent, so there is no agent voice to duck under: add music, a soft tick on message arrivals and one swish under the file transfer."),
    ("Older chat build (new sections)", "Before each overlay opens, the chat behind it shows an older «تحميل PDF» exchange that the booking video no longer has. "
     "These are the two bottom-left launchers; the click that opens each overlay is cut (EDIT 8, EDIT 9)."),
    ("Phone numbers (new sections)", "The ERP panel and Faisal's third WhatsApp message show a third number for the same guest, different from both numbers in the booking video. "
     "Mask it in both places for the whole ERP clip."),
    ("Two documents", "The internal guest file («ملف الضيف وتفاصيل الحجز.pdf») is the resort's file for Faisal and is never opened on screen. "
     "The guest's itinerary is the PDF at 08:00 of the booking video. Keep their lower-thirds different."),
    ("Phone clock", "In Concierge to Customer the status bar stays at 11:17 AM while the first messages are stamped 4:12–4:25 PM on 19 October. Crop the status bar or accept the mismatch."),
    ("Kayak wording", "Faisal's on-screen message says «حجزت لكم الكاياك». The VO says he arranges it and will confirm the time; kayak availability for these dates is not verified."),
    ("Timings (new sections)", "About 00:51 for ERP to Concierge and about 00:48 for Concierge to Customer after the freezes, slow motion and cuts, plus about 27 s for the closing and outro card. "
     "Each VO line is sized for its post-edit length."),
]

CLOSE_ROW_ERP = (
    "[00:26–00:27]",
    "CLOSING (ERP ending): hold on Faisal's phone with the internal guest file received → a short recap of the two screens: "
    "Rafiq's trip-details card (booking video 08:02) and the booking-system record with Faisal assigned (ERP to Concierge 00:26) → branded outro card.",
    ["Freeze 00:26.5 (the internal guest file and Faisal's reply in view) for about 11.5 s under the first sentence, run the recap (about 8.5 s) "
     "under «وكل هالتفاصيل…», and bring the outro card in on «هذا رفيق» (about 9 s).",
     "The VO stops at the handoff. It doesn't mention Faisal contacting the guest or the later request, which belong to Concierge to Customer."],
)
NEW_NOTES_ERP = [
    ("Sources (new section)", "«ERP to Concierge .mp4» (00:27, note the space before .mp4). Times in its table refer to that file. "
     "The recording is silent, so there is no agent voice to duck under: add music, a soft tick on message arrivals and one swish under the file transfer."),
    ("Older chat build (new section)", "Before the overlay opens, the chat behind it shows an older «تحميل PDF» exchange that the booking video no longer has. "
     "The overlay opens from one of the two bottom-left launchers; the click is cut (EDIT 8)."),
    ("Phone numbers (new section)", "The ERP panel and Faisal's third WhatsApp message show a third number for the same guest, different from both numbers in the booking video. "
     "Mask it in both places for the whole ERP clip."),
    ("Two documents", "The internal guest file («ملف الضيف وتفاصيل الحجز.pdf») is the resort's file for Faisal and is never opened on screen. "
     "The guest's itinerary is the PDF at 08:00 of the booking video. Keep their lower-thirds different."),
    ("Ending", "This version ends with ERP to Concierge. The full-journey script adds Concierge to Customer and its own closing; "
     "the Agent and ERP sections are the same in both."),
    ("Timings (new section)", "About 00:51 for ERP to Concierge after the freezes and slow motion, plus about 29 s for the closing and outro card. "
     "Each VO line is sized for its post-edit length."),
]

# ---------------------------------------------------------------- assemble
if ENDING == "erp":
    CLOSE_ROW, NEW_NOTES = CLOSE_ROW_ERP, NEW_NOTES_ERP
close_tr = row(CLOSE_ROW[0], None, CLOSE_ROW[1], CLOSE_ROW[2], narr_paras=[closure_para])
tc3 = close_tr.findall("w:tc", NS)[3]
tc3.insert(1, outro_p[0])                                    # moved verbatim: first note of the closing row
if ENDING == "erp":
    erp_tbl = table([row(*r) for r in ERP_ROWS] + [close_tr])
    insert = [page_break(), text_clone(TITLE_HEAD, ERP_HEAD), text_clone(JOURNEY, ERP_JOURNEY), erp_tbl]
else:
    erp_tbl = table([row(*r) for r in ERP_ROWS])
    con_tbl = table([row(*r) for r in CON_ROWS] + [close_tr])
    insert = [page_break(), text_clone(TITLE_HEAD, ERP_HEAD), text_clone(JOURNEY, ERP_JOURNEY), erp_tbl,
              page_break(), text_clone(TITLE_HEAD, CON_HEAD), text_clone(JOURNEY, CON_JOURNEY), con_tbl]
pos = list(body).index(AGENT_TBL) + 1
for el in insert:
    body.insert(pos, el)
    pos += 1
pos = list(body).index(LAST_NOTE) + 1
for label, text in NEW_NOTES:
    body.insert(pos, note(label, text))
    pos += 1

xml = etree.tostring(doc, xml_declaration=True, encoding="UTF-8", standalone=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = xml if item.filename == "word/document.xml" else zin.read(item.filename)
        zi = zipfile.ZipInfo(item.filename, date_time=item.date_time)
        zi.compress_type = zipfile.ZIP_DEFLATED
        zout.writestr(zi, data)
print("written", OUT)
print("closure moved:", closure_text)
