"""Merge film_data.py (edit, unchanged), film_data_docx_en.py (English text)
and film_data_ar.py (Saudi Arabic voice-over), check every voice-over line
against its program window, and write the JSON that
build_storyboard_docx_ar.js turns into the Word document.

    python -P demo-film/tools/export_storyboard_ar.py <out.json>

Speaking-rate model: 1.6 words per second plus 0.25 s per internal pause
(comma or full stop) plus any extra time for spoken amounts. Calibrated on
Rafiq's recorded Saudi voice replies in "Final version of the Agent.mp4":
6 words in 3.9 s (02:43.9), 11 words in 7.1 s (03:36.97), 9 words in 5.8 s
(05:40.2). It is an estimate; the voice artist's read-through is the check.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from film_data import SOURCES, FRAMINGS, MASKS, SECTIONS, SHOTS  # noqa: E402
from film_data_ar import VO, REC, REC_ONLY  # noqa: E402
import film_data_docx_en as T  # noqa: E402

RATE = 1.6
PAUSE = 0.25
FRAMING_SPEC = {
    "F1": "CROP x 0-1904, y 152-940 | FIT WIDTH 100.8% | STAGE #010C1C, letterboxed",
    "F2": "CROP x 624-1904, y 220-940 | SCALE 150%",
    "F3": "CROP 960x540 at x 944-1904, y per shot | SCALE 200%",
    "F4": "CROP x 231-1689, y 180-1000 | SCALE 131.7%",
    "F5": "CROP 960x540 at x 840-1800, y per shot | SCALE 200%",
    "F6": "CROP 1200x675 at x 360-1560, y per shot | SCALE 160%",
    "F7": "CROP x 644-1634, y 250-807 | SCALE 150% | STAGE #010C1C",
    "F7T": "CROP x 700-1580, y 765-855 | SCALE 160% | STAGE #010C1C",
    "FB": "CROP x 294-1610, y 200-940 | SCALE 145.9%",
}


def mmss(t):
    t = round(t + 1e-9, 1)
    m = int(t // 60)
    return f"{m:02d}:{t - 60 * m:04.1f}"


def seg_len(s):
    return round((s["b"] - s["a"]) / s["speed"], 3) if s["kind"] == "clip" else s["dur"]


# timeline, identical arithmetic to build_film_docs.py
t = 0.0
for sh in SHOTS:
    sh["pin"], off, sh["segmap"] = round(t, 3), 0.0, []
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
    raise ValueError(f"{sh['id']}: {ts}")


def ar_words(text):
    return len([w for w in text.split() if re.search(r"\w", w)])


def ar_secs(text, extra):
    pauses = len(re.findall(r"[،,.](?!\s*$)", text.strip()))
    return round(ar_words(text) / RATE + PAUSE * pauses + extra, 1)


protected = []
for sh in SHOTS:
    for (src, a, b, desc) in sh.get("recorded", []):
        protected.append(dict(shot=sh["id"], src=src, a=a, b=b,
                              start=src_to_prog(sh, src, a), end=src_to_prog(sh, src, b)))

vo_lines = []
for sh in SHOTS:
    if sh["id"] in VO:
        o, text, extra = VO[sh["id"]]
        start = round(sh["pin"] + o, 2)
        secs = ar_secs(text, extra)
        vo_lines.append(dict(shot=sh["id"], start=start, end=round(start + secs, 2), secs=secs,
                             words=ar_words(text), text=text))
vo_lines.sort(key=lambda x: x["start"])
for i, ln in enumerate(vo_lines):
    limit = vo_lines[i + 1]["start"] if i + 1 < len(vo_lines) else TOTAL
    for p in protected:
        if p["start"] >= ln["start"]:
            limit = min(limit, p["start"])
    ln["room"] = round(limit - ln["start"], 2)
    ln["fits"] = ln["end"] <= limit + 1e-6
    sh = next(s for s in SHOTS if s["id"] == ln["shot"])
    ln["spill"] = round(max(0.0, ln["end"] - sh["pout"]), 2)

out_shots = []
for sh in SHOTS:
    en = T.EN[sh["id"]]
    src_lines, n = [], 0
    for s, o0, o1 in sh["segmap"]:
        prg = f"PRG {mmss(sh['pin'] + o0)}–{mmss(sh['pin'] + o1)}"
        if s["kind"] == "em":
            src_lines.append(f"EDITOR-MADE | {s['label']} | {s['dur']:.1f} s | {prg}")
            continue
        n += 1
        head = f"SRC {n} | {SOURCES[s['src']]}"
        if s["kind"] == "freeze":
            src_lines.append([head, f"FREEZE {mmss(s['a'])} | HOLD {s['dur']:.1f} s | {prg}"])
        else:
            sp = "" if s["speed"] == 1.0 else f" | SPEED {int(round(s['speed'] * 100))}%"
            src_lines.append([head, f"IN {mmss(s['a'])} | OUT {mmss(s['b'])}{sp} | {prg}"])
    src_lines.append(f"PROGRAM | IN {mmss(sh['pin'])} | OUT {mmss(sh['pout'])} | DUR {sh['dur']:.1f} s")
    cue_lines = []
    for mid in sh.get("masks", []):
        m = MASKS[mid]
        kind = "tracked" if mid in ("M1", "M2") else "static"
        cue_lines.append(f"MASK {mid} | {SOURCES[m['src']]} | SRC {mmss(m['start'])}–{mmss(m['end'])} | x {m['rect'][0]}-{m['rect'][2]} | {kind}")
    cue_lines += T.CUES.get(sh["id"], [])
    vo = next((l for l in vo_lines if l["shot"] == sh["id"]), None)
    vo_meta = []
    if vo:
        vo_meta.append(f"VO | PRG {mmss(vo['start'])}–{mmss(vo['end'])} | est. {vo['secs']:.1f} s | room {vo['room']:.1f} s | {'OK' if vo['fits'] else 'REVIEW'}")
    for p in [p for p in protected if p["shot"] == sh["id"]]:
        vo_meta.append(f"RECORDED AUDIO | SRC {mmss(p['a'])}–{mmss(p['b'])} | PRG {mmss(p['start'])}–{mmss(p['end'])} | no voice-over")
    out_shots.append(dict(
        id=sh["id"], sec=sh["sec"], title=en["title"], screen=en["screen"], notice=en["notice"], notes=en["notes"],
        vo=vo["text"] if vo else None, rec_only=sh["id"] in REC_ONLY, rec=REC.get(sh["id"]),
        src_lines=src_lines, cue_lines=cue_lines, vo_meta=vo_meta))

data = dict(
    title=T.TITLE, subtitle=T.SUBTITLE, total=mmss(TOTAL), total_s=f"{TOTAL:.1f}", shots=out_shots,
    sections=[dict(key=s["key"], title=T.CHAPTER_TITLES[s["key"]], goal=T.CHAPTER_GOALS[s["key"]]) for s in SECTIONS],
    sources=[SOURCES[k] for k in ("A", "E", "C")],
    framings=[dict(key=k, desc=T.FRAMING_DESC[k], spec=f"{k} | {FRAMING_SPEC[k]}") for k in FRAMINGS],
    masks=[dict(key=k, text=T.MASK_TEXT[k],
                line=f"{k} | {SOURCES[m['src']]} | SRC {mmss(m['start'])}–{mmss(m['end'])} | x {m['rect'][0]}-{m['rect'][2]} | {m['keys']}")
           for k, m in MASKS.items()],
    decisions=T.DECISIONS, audio=T.AUDIO, approvals=T.APPROVALS,
    vo_check=[dict(shot=l["shot"], est=f"{l['secs']:.1f}", room=f"{l['room']:.1f}", words=l["words"],
                   fits=l["fits"], spill=l["spill"]) for l in vo_lines],
    vo_words=sum(l["words"] for l in vo_lines), vo_secs=f"{sum(l['secs'] for l in vo_lines):.0f}",
)
with open(sys.argv[1], "w", encoding="utf-8") as fh:
    json.dump(data, fh, ensure_ascii=False, indent=1)

print(f"TOTAL {mmss(TOTAL)}  shots {len(out_shots)}  VO lines {len(vo_lines)}  words {data['vo_words']}  read {data['vo_secs']} s")
for l in vo_lines:
    print(f"{l['shot']:6} {mmss(l['start'])}-{mmss(l['end'])} w={l['words']:2} est={l['secs']:4.1f} room={l['room']:5.1f} spill={l['spill']:3.1f} {'OK' if l['fits'] else 'REVIEW'}")
