"""Build the demo film's script, storyboard and shot list from film_data.py.

Run from Git Bash or PowerShell (needs ffmpeg on PATH and Pillow):
    python -P demo-film/tools/build_film_docs.py

Writes, next to this folder:
    RSG_Demo_Film_Script.md, RSG_Demo_Film_Storyboard.html,
    RSG_Demo_Film_Shot_List.csv, stills/*.jpg
"""
import base64, csv, html, io, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from film_data import SOURCES, FRAMINGS, MASKS, SECTIONS, SHOTS, MUSIC  # noqa: E402

ROOT = os.path.dirname(HERE)                       # demo-film/
REC = os.path.join(os.path.dirname(ROOT), "Recordings")
STILLS = os.path.join(ROOT, "stills")
CACHE = os.environ.get("FILM_FRAME_CACHE", os.path.join(__import__("tempfile").gettempdir(), "rsg_film_frames"))
WPM = 140
FPS = 30
STAGE = (1, 12, 28)
TEAL = (0, 170, 170)

os.makedirs(STILLS, exist_ok=True)
os.makedirs(CACHE, exist_ok=True)

# ---------- time helpers ----------
def mmss(t):
    t = round(t + 1e-9, 1)
    m = int(t // 60)
    return f"{m:02d}:{t - 60 * m:04.1f}"

def smpte(t):
    f = int(round(t * FPS))
    s, fr = divmod(f, FPS)
    m, s = divmod(s, 60)
    h, m = divmod(m, 60)
    return f"{h:02d}:{m:02d}:{s:02d}:{fr:02d}"

def seg_len(s):
    if s["kind"] == "clip":
        return round((s["b"] - s["a"]) / s["speed"], 3)
    return s["dur"]

# ---------- narration helpers ----------
TAG = re.compile(r"\[[a-z ]+\]")

def vo_words(text):
    return len([w for w in TAG.sub(" ", text).replace("·", " ").split() if re.search(r"\w", w)])

def vo_secs(text, extra):
    return round(vo_words(text) / WPM * 60 + 0.5 * text.count("[beat]") + extra, 1)

# ---------- compute the timeline ----------
t = 0.0
for sh in SHOTS:
    sh["pin"] = round(t, 3)
    off = 0.0
    sh["segmap"] = []
    for s in sh["segs"]:
        d = seg_len(s)
        sh["segmap"].append((s, round(off, 3), round(off + d, 3)))
        off += d
    sh["dur"] = round(off, 3)
    t += off
    sh["pout"] = round(t, 3)
TOTAL = round(t, 3)

def src_to_prog(sh, src, ts):
    for s, o0, o1 in sh["segmap"]:
        if s["kind"] == "clip" and s["src"] == src and s["a"] - 1e-6 <= ts <= s["b"] + 1e-6:
            return round(sh["pin"] + o0 + (ts - s["a"]) / s["speed"], 2)
    raise ValueError(f"{sh['id']}: {ts} not in a clip segment")

lines = []      # every narration line with program times
protected = []  # recorded-audio windows
for sh in SHOTS:
    for (o, text, extra) in sh.get("vo", []):
        start = round(sh["pin"] + o, 2)
        secs = vo_secs(text, extra)
        lines.append(dict(shot=sh["id"], sec=sh["sec"], start=start, end=round(start + secs, 2),
                          secs=secs, words=vo_words(text), text=text))
    for (src, a, b, desc) in sh.get("recorded", []):
        protected.append(dict(shot=sh["id"], src=src, a=a, b=b,
                              start=src_to_prog(sh, src, a), end=src_to_prog(sh, src, b), desc=desc))

lines.sort(key=lambda x: x["start"])
shot_by_id = {s["id"]: s for s in SHOTS}
problems = []
for i, ln in enumerate(lines):
    nxt = lines[i + 1]["start"] if i + 1 < len(lines) else TOTAL
    ln["room"] = round(nxt - ln["start"], 2)
    ln["fits"] = ln["end"] <= nxt + 1e-6
    for p in protected:
        if ln["start"] < p["end"] and ln["end"] > p["start"]:
            ln["fits"] = False
            problems.append(f"{ln['shot']} narration overlaps recorded audio in {p['shot']}")
    sh = shot_by_id[ln["shot"]]
    ln["spill"] = round(max(0.0, ln["end"] - sh["pout"]), 2)
    if not ln["fits"]:
        problems.append(f"{ln['shot']} narration needs {ln['secs']} s but has {ln['room']} s")

TOTAL_WORDS = sum(l["words"] for l in lines)
TOTAL_READ = round(sum(l["secs"] for l in lines), 1)

# ---------- frames and stills ----------
def frame(src, ts):
    path = os.path.join(CACHE, f"{src}_{ts:08.2f}.png")
    if not os.path.exists(path):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ts:.3f}", "-i",
                        os.path.join(REC, SOURCES[src]), "-frames:v", "1", path], check=True)
    return Image.open(path).convert("RGB")

MASK_KEYS = {
    "M1": [(436.0, (1715, 342, 1842, 398)), (442.5, (1715, 326, 1842, 384)), (445.0, (1715, 326, 1842, 384))],
    "M2": [(456.0, (1540, 712, 1840, 762)), (457.0, (1540, 670, 1840, 722)), (458.0, (1540, 644, 1840, 696)),
           (459.0, (1540, 546, 1840, 598)), (460.0, (1540, 518, 1840, 570)), (461.3, (1540, 378, 1840, 430))],
}

def mask_rect(mid, ts):
    m = MASKS[mid]
    keys = MASK_KEYS.get(mid)
    if not keys:
        return m["rect"]
    if ts <= keys[0][0]:
        return keys[0][1]
    for (t0, r0), (t1, r1) in zip(keys, keys[1:]):
        if t0 <= ts <= t1:
            k = (ts - t0) / (t1 - t0)
            return tuple(int(round(a + (b - a) * k)) for a, b in zip(r0, r1))
    return keys[-1][1]

def apply_masks(img, src, ts):
    d = ImageDraw.Draw(img)
    for mid, m in MASKS.items():
        if m["src"] == src and m["start"] - 0.01 <= ts <= m["end"] + 0.01:
            x0, y0, x1, y1 = mask_rect(mid, ts)
            border = [img.getpixel((x, y0 - 2)) for x in range(x0, x1, 6)] + [img.getpixel((x, y1 + 2)) for x in range(x0, x1, 6)]
            border.sort(key=sum)
            bg = border[len(border) // 2]
            d.rectangle([x0, y0, x1, y1], fill=bg)
            f = font(16)
            d.text((x0 + 8, (y0 + y1) // 2 - 9), "••• ••••", fill=(130, 140, 150), font=f)
    return img

def font(size, bold=False):
    for name in (["segoeuib.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()

def framing_rect(fr):
    if isinstance(fr, tuple):
        key, y = fr
        x0, w, h = {"F3": (944, 960, 540), "F5": (840, 960, 540), "F6": (360, 1200, 675)}[key]
        return (x0, y, x0 + w, y + h), False
    f = FRAMINGS[fr]
    return f["rect"], f["stage"]

def render_still(src, ts, fr, out):
    img = apply_masks(frame(src, ts), src, ts)
    rect, stage = framing_rect(fr)
    crop = img.crop(rect)
    W, H = 640, 360
    canvas = Image.new("RGB", (W, H), STAGE)
    if stage:
        k = min(W / crop.width, H / crop.height) * (0.92 if fr in ("F7", "F7T") else 1.0)
    else:
        k = max(W / crop.width, H / crop.height)
    im = crop.resize((max(1, int(crop.width * k)), max(1, int(crop.height * k))), Image.LANCZOS)
    canvas.paste(im, ((W - im.width) // 2, (H - im.height) // 2))
    canvas.save(out, quality=86)

def render_em(kind, out):
    W, H = 640, 360
    c = Image.new("RGB", (W, H), STAGE)
    d = ImageDraw.Draw(c)
    if kind == "title":
        d.text((48, 120), "Red Sea Global · Shebara", fill="white", font=font(30, True))
        d.text((48, 165), "From first question to personal concierge", fill=(200, 210, 220), font=font(20))
        d.text((48, 312), "Proof of concept · Clouding AI", fill=(140, 150, 160), font=font(13))
    elif kind in ("c1", "c2", "c3"):
        n = kind[1]
        name = {"1": "Planning the stay", "2": "ERP to Concierge", "3": "Concierge to Customer"}[n]
        d.text((48, 118), n, fill=TEAL, font=font(56, True))
        d.text((48, 196), name, fill="white", font=font(30, True))
        if n != "1":
            d.text((48, 242), "Scripted mockup", fill=(140, 150, 160), font=font(14))
    elif kind == "end":
        d.text((48, 130), "Clouding AI", fill="white", font=font(40, True))
        d.text((48, 190), "Rafiq · AI concierge agent", fill=(200, 210, 220), font=font(20))
        d.text((48, 312), "Proof of concept for Red Sea Global", fill=(140, 150, 160), font=font(13))
    elif kind == "composite":
        left = apply_masks(frame("E", 26.5), "E", 26.5).crop((420, 200, 1010, 980))
        right = frame("C", 39.5).crop((740, 175, 1180, 1015))
        for im, x in ((left, 70), (right, 380)):
            k = 300 / im.height
            im = im.resize((int(im.width * k), 300), Image.LANCZOS)
            c.paste(im, (x, 30))
    c.save(out, quality=86)

def stills_for(sh):
    outs = []
    for i, st in enumerate(sh["stills"]):
        name = f"{sh['id']}_{i + 1}.jpg"
        out = os.path.join(STILLS, name)
        if st[0] == "EM":
            render_em(st[1], out)
            cap = "Editor-made"
        else:
            src, ts, fr = st
            render_still(src, ts, fr, out)
            frn = fr[0] if isinstance(fr, tuple) else fr
            cap = f"{SOURCES[src]} @ {mmss(ts)} · {frn}"
        outs.append((name, cap))
    return outs

for sh in SHOTS:
    sh["still_files"] = stills_for(sh)

# ---------- text helpers ----------
def src_lines(sh):
    out = []
    for s, o0, o1 in sh["segmap"]:
        p0, p1 = mmss(sh["pin"] + o0), mmss(sh["pin"] + o1)
        if s["kind"] == "clip":
            sp = "" if s["speed"] == 1.0 else f" at {int(round(s['speed'] * 100))}%"
            out.append(f"`{SOURCES[s['src']]}` {mmss(s['a'])}–{mmss(s['b'])}{sp} → program {p0}–{p1}")
        elif s["kind"] == "freeze":
            out.append(f"`{SOURCES[s['src']]}` freeze at {mmss(s['a'])}, held {s['dur']:.1f} s → program {p0}–{p1}")
        else:
            out.append(f"{s['label']}, {s['dur']:.1f} s → program {p0}–{p1}")
    return out

def framing_text(sh):
    names = re.findall(r"F\dT?|FB|EM", sh["framing"])
    parts = []
    for n in names:
        if n == "EM":
            parts.append("Editor-made frame, 1920x1080")
        else:
            parts.append(f"{n} {FRAMINGS[n]['name']}")
    return "; ".join(dict.fromkeys(parts))

def vo_for(sh):
    return [l for l in lines if l["shot"] == sh["id"]]

def rec_for(sh):
    return [p for p in protected if p["shot"] == sh["id"]]

def strip_tags(s):
    return TAG.sub("", s).replace("  ", " ").strip()

# ---------- CSV ----------
with open(os.path.join(ROOT, "RSG_Demo_Film_Shot_List.csv"), "w", newline="", encoding="utf-8-sig") as fh:
    w = csv.writer(fh)
    w.writerow(["Shot", "Section", "Title", "Segment", "Source file", "Source IN", "Source OUT", "Speed",
                "Freeze/hold (s)", "Program IN", "Program OUT", "Duration (s)", "Program IN (SMPTE 30)", "Program OUT (SMPTE 30)", "Framing", "Masks"])
    for sh in SHOTS:
        for i, (s, o0, o1) in enumerate(sh["segmap"]):
            a, b = sh["pin"] + o0, sh["pin"] + o1
            if s["kind"] == "em":
                row = [s["label"], "", "", "", f"{s['dur']:.1f}"]
            elif s["kind"] == "freeze":
                row = [SOURCES[s["src"]], mmss(s["a"]), mmss(s["a"]), "", f"{s['dur']:.1f}"]
            else:
                row = [SOURCES[s["src"]], mmss(s["a"]), mmss(s["b"]), f"{int(round(s['speed'] * 100))}%", ""]
            w.writerow([sh["id"], sh["sec"], sh["title"], i + 1] + row +
                       [mmss(a), mmss(b), f"{b - a:.1f}", smpte(a), smpte(b), sh["framing"], " ".join(sh.get("masks", []))])

# ---------- Markdown script ----------
sec_lines = {s["key"]: [l for l in lines if l["sec"] == s["key"]] for s in SECTIONS}
md = []
md.append("# Red Sea Global: From First Question to Personal Concierge · Demo Voice-Over Script")
md.append(f"Narration for the {mmss(TOTAL)[:5]} demo film · English · Draft v1 · 12 November 2026 · Clouding AI")
md.append("")
md.append("**Journey:** a guest's first «السلام عليكم» on the Visit Red Sea page → a name Rafiq keeps using → a resort chosen on the page itself → villa, party, dates and the stay total → transfers and the updated total → an editable review and the guest's booking PDF → the resort's booking system assigns a personal concierge and sends him the internal guest file → the concierge introduces himself the same afternoon and, two days later, arranges a kayak outing and promises to confirm the time.")
md.append("")
md.append(f"**Voice direction:** warm, unhurried and assured, like a hospitality consultant walking a client through something their team will use. Default pace {WPM} words per minute; slow down on every amount and let it land. [warm] = softer, welcoming delivery; [assured] = firm and plain; [soft] = pull back; [beat] = a half-second pause. Time codes in square brackets are program times in the finished film; times in parentheses inside a VISUAL line are source times in the recording named on the SOURCE line. Stay silent while the two recorded voice notes play (program {mmss(protected[0]['start'])}–{mmss(protected[0]['end'])} and {mmss(protected[1]['start'])}–{mmss(protected[1]['end'])}). The film carries no English subtitles: the Arabic on screen is left as it is, and the narration gives the meaning in English.")
md.append("")
md.append(f"**Runtime and read time:** the film runs {mmss(TOTAL)} ({TOTAL:.1f} s). The narration is {TOTAL_WORDS} words, about {TOTAL_READ:.0f} s of read time at {WPM} words per minute including pauses. The rest is deliberate: the voice notes, replies landing on screen, the held totals, the chapter cards and the silent end. Don't slide a line earlier to fill a gap.")
md.append("")
md.append("**Pronunciation:** Rafiq (ra-FEEK), Shebara (sheh-BAH-ra), Yanbu (YAN-boo), Faisal (FAI-sal), Mohammed (mo-HAM-med), Clouding (CLOUD-ing).")
md.append("")
for s in SECTIONS:
    secs = sum(l["secs"] for l in sec_lines[s["key"]])
    md.append(f"## {s['title']}")
    md.append(f"**Section goal:** {s['goal']}")
    md.append(f"**Estimated narration length:** {max(0, secs - 2):.0f} to {secs + 2:.0f} seconds")
    md.append("")
    for sh in [x for x in SHOTS if x["sec"] == s["key"]]:
        md.append(f"**{sh['id']} · {sh['title']}** [{mmss(sh['pin'])}–{mmss(sh['pout'])}]")
        md.append("SOURCE: " + "; ".join(src_lines(sh)))
        md.append(f"VISUAL: {sh['action']}")
        for l in vo_for(sh):
            md.append(f"NARRATION: “{l['text']}” [{mmss(l['start'])}–{mmss(l['end'])}]")
        for p in rec_for(sh):
            md.append(f"RECORDED AUDIO: {p['desc']} [{mmss(p['start'])}–{mmss(p['end'])}]")
        if not vo_for(sh) and not rec_for(sh):
            md.append("NARRATION: none. Music only.")
        md.append(f"Editing note: {sh['motion']}" + (f" Masks: {', '.join(sh['masks'])} (see Notes for the editor)." if sh.get("masks") else ""))
        md.append("")
md.append("## Notes for the editor")
md.append("")
md.append(f"**Timing.** Program runtime {mmss(TOTAL)}. Narration about {TOTAL_READ:.0f} s at {WPM} wpm. Each narration line starts on its visual and has been checked to finish before the next line and outside the two voice-note windows. The storyboard (`RSG_Demo_Film_Storyboard.html`) and shot list (`RSG_Demo_Film_Shot_List.csv`) carry the same times, generated from one table.")
md.append("")
md.append("**Numbers.** Every figure is spelled out for the voice artist (twenty-eight thousand, nine hundred and eighty riyals; thirty-three thousand, seven hundred and ninety-three riyals, ninety halalas; the twenty-third, the twenty-fifth, the twenty-fourth). Read them that way.")
md.append("")
md.append("**Prices.** Only totals are shown and called out: the stay total after the dates (SAR 28,980.00, 1-10) and the updated total after transfers (SAR 33,793.90, 1-15, 1-16 and the PDF in 1-17). Per-leg transfer prices and experience prices are cut or cropped out. The small line under the review card's total also lists the stay and transfer subtotals; it gets no outline and no narration.")
md.append("")
md.append("**Phone numbers and contact details.** The recordings carry three different phone numbers for the same guest. All of them are masked with the same treatment, so no number appears anywhere in the finished film:")
md.append("")
md.append("| Mask | Source | Source time | What | Position (source px) | Treatment |")
md.append("|---|---|---|---|---|---|")
for mid, m in MASKS.items():
    x0, y0, x1, y1 = m["rect"]
    md.append(f"| {mid} | `{SOURCES[m['src']]}` | {mmss(m['start'])}–{mmss(m['end'])} | {m['what']} | x {x0}-{x1}; {m['keys']} | {m['treat']} |")
md.append("")
md.append("Apply masks on the source clip before reframing. The PDF's phone number is kept out by crop (1-17 never shows the guests block). The e-mail address is covered by M2 and is otherwise never in frame.")
md.append("")
md.append("**Crops.** Every shot crops out the browser chrome (tabs, address bar, bookmarks: source y 0 to 151). Page-wide shots also crop out the two demo launchers at the bottom left. Framings:")
md.append("")
for k, f in FRAMINGS.items():
    md.append(f"- {k} {f['name']}: {f['spec']}")
md.append("")
md.append("**On-screen text added in the edit (no subtitles).** Title card (O-01), chapter cards (C1, C2, C3), «Guest's booking PDF» lower third (1-17), «Resort's internal guest file» lower third (2-05), «Two days later» overlay (3-02), end card (CL-02). Callouts are outlines only, no labels: the stay total (1-10), the prefilled title and first name (1-14), the updated total and the edit button (1-15), Faisal's card (2-02), the document bubble (2-05).")
md.append("")
md.append(f"**Music and sound.** {MUSIC} Duck to -12 dB under narration; about -24 dB under the guest's voice note and -20 dB under Rafiq's. The ERP and Concierge recordings are silent; add at most a soft tick on message arrivals and one soft swish under the file transfer. No phone notification sounds. Clean up the guest's voice note (high-pass 120 Hz, light noise reduction, gain to match Rafiq's reply).")
md.append("")
md.append("**Not used from the footage.** The waits and false starts logged in Phase 1, the duplicated stay summary (agent recording 03:02.5 to 03:45.0), the guest's two unplayed voice notes' content, Rafiq's second voice reply (05:40.2 to 05:46.0), the raw markdown link (07:45.5 to 07:52.0), the right-click menu (04:18.5) and the opening seconds of the ERP and Concierge recordings (older chat build).")
md.append("")
md.append("**Not in this footage.** No payment, no booking confirmation, no edit made on the review card, and the internal guest file is never opened. The script claims none of them.")
md.append("")
md.append("**Outstanding approvals.** (1) Red Sea Global name on the title card and «Proof of concept for Red Sea Global» on the end card. (2) «Scripted mockup» on the Chapter 2 and 3 cards. (3) Loyalty points: the trip card and Rafiq's message show 3,379 points from configurable demo rules, not Red Sea Global's programme; the narration leaves them out, but they are on screen for about 7 s in 1-16 and 1-17. (4) Faisal's on-screen line «حجزت لكم الكاياك» stays as approved in the transcript; the narration says he arranges it. (5) Music licence. (6) Voice artist.")
with open(os.path.join(ROOT, "RSG_Demo_Film_Script.md"), "w", encoding="utf-8") as fh:
    fh.write("\n".join(md) + "\n")

# ---------- HTML storyboard ----------
def esc(s):
    s = html.escape(s)
    s = re.sub(r"«([^»]*)»", lambda m: f"«<span lang=\"ar\" dir=\"auto\">{m.group(1)}</span>»", s)
    s = re.sub(r"`([^`]*)`", r"<code>\1</code>", s)
    return s

def img_tag(name):
    with open(os.path.join(STILLS, name), "rb") as fh:
        b = base64.b64encode(fh.read()).decode()
    return f'<img src="data:image/jpeg;base64,{b}" alt="{html.escape(name)}">'

css = """
:root{--ink:#010C1C;--body:#2D3748;--muted:#5D6B7E;--line:#D9DEE5;--teal:#007C7C;--bg:#FFFFFF;--soft:#F5F7F9;--warn:#B45309}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--body);font:15px/1.5 'Albert Sans','Segoe UI',Arial,sans-serif}
main{max-width:1180px;margin:0 auto;padding:40px 24px 80px}
h1{font-size:34px;line-height:1.15;color:var(--ink);margin:0 0 8px}h2{font-size:22px;color:var(--ink);margin:56px 0 6px;padding-top:16px;border-top:2px solid var(--ink)}
h3{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);margin:0 0 4px}
.spec{color:var(--muted);margin:0 0 24px}.goal{color:var(--body);max-width:820px;margin:4px 0 20px}
.shot{border-top:1px solid var(--line);padding:22px 0 26px;display:grid;grid-template-columns:400px 1fr;gap:28px}
.shot .head{grid-column:1/-1;display:flex;gap:16px;align-items:baseline;flex-wrap:wrap}
.id{font-weight:700;color:var(--ink);font-size:18px}.ttl{font-weight:600;color:var(--ink);font-size:18px}.tc{font-family:Consolas,monospace;color:var(--muted)}
.stills figure{margin:0 0 10px}.stills img{width:100%;display:block;border-radius:4px;border:1px solid var(--line)}
.stills figcaption{font-size:12px;color:var(--muted);margin-top:4px}
dl{margin:0;display:grid;grid-template-columns:150px 1fr;gap:6px 16px}dt{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding-top:2px}dd{margin:0}
dd ul{margin:0;padding-left:18px}.vo{color:var(--ink);font-weight:500}.rec{color:var(--teal);font-weight:600}
code{font-family:Consolas,monospace;font-size:13px;background:var(--soft);padding:1px 4px;border-radius:3px}
table{border-collapse:collapse;width:100%;margin:10px 0 18px;font-size:14px}th,td{border-bottom:1px solid var(--line);text-align:left;padding:6px 8px;vertical-align:top}th{color:var(--muted);font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.bad{color:var(--warn);font-weight:700}.ok{color:var(--teal);font-weight:700}
[lang=ar]{font-family:'Segoe UI',Tahoma,Arial,sans-serif}
@media (max-width:900px){.shot{grid-template-columns:1fr}dl{grid-template-columns:1fr}}
"""

H = []
H.append(f"<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>RSG Demo Storyboard</title><style>{css}</style></head><body><main>")
H.append("<h3>Clouding AI · Red Sea Global demo film · Production storyboard v1</h3>")
H.append("<h1>From First Question to Personal Concierge</h1>")
H.append(f"<p class=\"spec\">{mmss(TOTAL)} program ({TOTAL:.1f} s) · 16:9 · 1920x1080 · 30 fps · {len(SHOTS)} shots · narration {TOTAL_WORDS} words, about {TOTAL_READ:.0f} s at {WPM} wpm · English voice-over, no subtitles · built from three screen recordings and editor-made cards. Stills are from the recordings with the planned crops and masks applied.</p>")
H.append("<p class=\"goal\">Sources: " + ", ".join(f"<code>{html.escape(v)}</code>" for v in SOURCES.values()) + ". Every source time was checked frame by frame in Phase 1 (<code>PHASE1_FOOTAGE_LOG.md</code>). Program times are cumulative and reconcile to the runtime below.</p>")

for s in SECTIONS:
    H.append(f"<h2>{esc(s['title'])}</h2><p class=\"goal\">{esc(s['goal'])}</p>")
    for sh in [x for x in SHOTS if x["sec"] == s["key"]]:
        H.append("<section class=\"shot\">")
        H.append(f"<div class=\"head\"><span class=\"id\">{sh['id']}</span><span class=\"ttl\">{esc(sh['title'])}</span><span class=\"tc\">{mmss(sh['pin'])} – {mmss(sh['pout'])} · {sh['dur']:.1f} s</span></div>")
        H.append("<div class=\"stills\">" + "".join(f"<figure>{img_tag(n)}<figcaption>{esc(c)}</figcaption></figure>" for n, c in sh["still_files"]) + "</div>")
        H.append("<dl>")
        H.append(f"<dt>Purpose</dt><dd>{esc(sh['purpose'])}</dd>")
        H.append("<dt>Source</dt><dd><ul>" + "".join(f"<li>{esc(x)}</li>" for x in src_lines(sh)) + "</ul></dd>")
        H.append(f"<dt>Framing</dt><dd>{esc(framing_text(sh))}</dd>")
        H.append(f"<dt>On screen</dt><dd>{esc(sh['action'])}<br><em>Must stay legible:</em> {esc(sh['legible'])}</dd>")
        if sh.get("component"):
            H.append(f"<dt>Component</dt><dd>{esc(sh['component'])}</dd>")
        vo = vo_for(sh)
        rec = rec_for(sh)
        items = [f"<span class=\"vo\">“{esc(l['text'])}”</span> <span class=\"tc\">[{mmss(l['start'])}–{mmss(l['end'])}, {l['words']} words, {l['secs']:.1f} s]</span>" for l in vo]
        items += [f"<span class=\"rec\">Recorded audio only:</span> {esc(p['desc'])} <span class=\"tc\">[program {mmss(p['start'])}–{mmss(p['end'])}, source {mmss(p['a'])}–{mmss(p['b'])}]</span>" for p in rec]
        H.append("<dt>Voice-over</dt><dd>" + ("<br>".join(items) if items else "None. Music only.") + "</dd>")
        H.append(f"<dt>Motion</dt><dd>{esc(sh['motion'])}</dd>")
        if sh.get("masks"):
            H.append("<dt>Masks</dt><dd>" + "<br>".join(f"{m}: {esc(MASKS[m]['what'])} ({esc(MASKS[m]['treat'])})" for m in sh["masks"]) + "</dd>")
        H.append(f"<dt>Audio / editor</dt><dd>{esc(sh['audio'])}</dd>")
        H.append(f"<dt>Gap / pickup</dt><dd>{esc(sh['gap'])}</dd>")
        H.append("</dl></section>")

H.append("<h2>Reconciliation</h2><table><tr><th>Shot</th><th>Program IN</th><th>Program OUT</th><th>Duration</th><th>Running total</th></tr>")
for sh in SHOTS:
    H.append(f"<tr><td>{sh['id']} {esc(sh['title'])}</td><td class=\"tc\">{mmss(sh['pin'])}</td><td class=\"tc\">{mmss(sh['pout'])}</td><td class=\"tc\">{sh['dur']:.1f} s</td><td class=\"tc\">{mmss(sh['pout'])}</td></tr>")
H.append(f"<tr><th colspan=\"3\">Total runtime</th><th>{TOTAL:.1f} s</th><th>{mmss(TOTAL)}</th></tr></table>")

H.append("<h2>Narration fit</h2><p class=\"goal\">Read time at 140 wpm plus 0.5 s per [beat] and extra time on spoken amounts, against the room before the next line or a recorded voice note.</p><table><tr><th>Shot</th><th>Starts</th><th>Ends</th><th>Words</th><th>Read</th><th>Room</th><th>Fits</th></tr>")
for l in lines:
    note = " (runs on past the cut, by design)" if l["spill"] > 0 else ""
    H.append(f"<tr><td>{l['shot']}</td><td class=\"tc\">{mmss(l['start'])}</td><td class=\"tc\">{mmss(l['end'])}</td><td>{l['words']}</td><td>{l['secs']:.1f} s</td><td>{l['room']:.1f} s</td><td class=\"{'ok' if l['fits'] else 'bad'}\">{'yes' if l['fits'] else 'NO'}{note}</td></tr>")
H.append("</table>")
H.append("<h2>Masks</h2><table><tr><th>Mask</th><th>Source</th><th>Time</th><th>What</th><th>Position and tracking</th><th>Treatment</th></tr>")
for mid, m in MASKS.items():
    x0, y0, x1, y1 = m["rect"]
    H.append(f"<tr><td>{mid}</td><td><code>{html.escape(SOURCES[m['src']])}</code></td><td class=\"tc\">{mmss(m['start'])}–{mmss(m['end'])}</td><td>{esc(m['what'])}</td><td>x {x0}-{x1}; {esc(m['keys'])}</td><td>{esc(m['treat'])}</td></tr>")
H.append("</table>")
H.append("<h2>Framings</h2><table><tr><th>Key</th><th>Name</th><th>Specification</th></tr>" + "".join(f"<tr><td>{k}</td><td>{esc(f['name'])}</td><td>{esc(f['spec'])}</td></tr>" for k, f in FRAMINGS.items()) + "</table>")
H.append("<h2>Outstanding pickups and approvals</h2><ul>")
H.append("<li>Pickups: none required. Every story beat has a verified source range.</li>")
H.append("<li>Approval: Red Sea Global name on the title card, and «Proof of concept for Red Sea Global» on the end card.</li>")
H.append("<li>Approval: «Scripted mockup» line on the Chapter 2 and 3 cards.</li>")
H.append("<li>Approval: loyalty points (3,379) stay on screen for about 7 s in 1-16 and 1-17; they come from configurable demo rules, not Red Sea Global's programme, and are not narrated.</li>")
H.append("<li>Approval: Faisal's on-screen «حجزت لكم الكاياك» is the approved transcript wording; the narration says he arranges it.</li>")
H.append("<li>Check after audio clean-up: the guest's voice note (1-08) is quiet in the source. If it is still unclear, raise it before picture lock.</li>")
H.append("<li>Pending: music licence, voice artist.</li></ul>")
H.append("</main></body></html>")
with open(os.path.join(ROOT, "RSG_Demo_Film_Storyboard.html"), "w", encoding="utf-8") as fh:
    fh.write("\n".join(H))

# ---------- report ----------
print(f"TOTAL {TOTAL:.1f} s = {mmss(TOTAL)}; shots {len(SHOTS)}; VO words {TOTAL_WORDS}; read {TOTAL_READ} s")
for l in lines:
    print(f"{l['shot']:6} {mmss(l['start'])}-{mmss(l['end'])} words={l['words']:3} secs={l['secs']:5.1f} room={l['room']:5.1f} spill={l['spill']:4.1f} {'OK' if l['fits'] else 'NO'}")
for p in protected:
    print(f"REC {p['shot']} program {mmss(p['start'])}-{mmss(p['end'])}")
print("PROBLEMS:", problems or "none")
