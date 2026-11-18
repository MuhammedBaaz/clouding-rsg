# -*- coding: utf-8 -*-
"""Build assets/handoff/guest-file.pdf from tools/handoff-pdf.html (headless Microsoft Edge, A4, vector text).

    python tools/build_handoff_pdf.py                         # page served by a running site server on 127.0.0.1:8100
    python tools/build_handoff_pdf.py http://127.0.0.1:8143   # or any port this folder's server.py runs on

The page must be served over HTTP (file:// blocks the web fonts). After printing, the script checks the PDF with
PyMuPDF (one page, the key booking values extract as text), writes a preview PNG next to the PDF only when --preview is
given, and rewrites the document card's size line (pdf.meta) in data/handoff-script.js so the WhatsApp card shows the
real size. Re-run it after any change to data/booking.js or data/handoff-script.js.
"""
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "handoff", "guest-file.pdf")
DATA = os.path.join(ROOT, "data", "handoff-script.js")
EDGE = [r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"]
MUST = ["محمد باز", "Shebara", "+966 55 123 4567", "33,793.90", "نورة الحربي", "تسجيل وصول متأخر", "فيصل"]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    base = (args[0] if args else "http://127.0.0.1:8100").rstrip("/")
    page = base + "/tools/handoff-pdf.html"
    try:
        urllib.request.urlopen(page, timeout=5).read(200)
    except Exception as e:
        print("The page is not reachable at %s (%s). Start server.py in this folder, then pass its address." % (page, e))
        return 2
    edge = next((p for p in EDGE if os.path.exists(p)), None)
    if not edge:
        print("Microsoft Edge was not found.")
        return 2
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    profile = tempfile.mkdtemp(prefix="rsg-edge-")
    tmp_out = os.path.join(profile, "out.pdf")
    cmd = [edge, "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--user-data-dir=" + profile,
           "--no-pdf-header-footer", "--print-to-pdf-no-header", "--virtual-time-budget=8000", "--print-to-pdf=" + tmp_out, page]
    subprocess.run(cmd, timeout=120, capture_output=True)
    if not os.path.exists(tmp_out) or os.path.getsize(tmp_out) < 1000:
        print("Edge did not write the PDF. Try running this script from PowerShell.")
        return 1
    shutil.copyfile(tmp_out, OUT)
    shutil.rmtree(profile, ignore_errors=True)

    import pymupdf
    doc = pymupdf.open(OUT)
    text = "".join(p.get_text() for p in doc)
    missing = [m for m in MUST if m not in text]
    size = os.path.getsize(OUT)
    print("wrote %s: %d page(s), %d bytes, title %r" % (os.path.relpath(OUT, ROOT), doc.page_count, size, doc.metadata.get("title")))
    print("text check:", "all key values found" if not missing else "MISSING %s" % missing)
    if "--preview" in sys.argv:
        png = os.path.join(tempfile.gettempdir(), "rsg-guest-file-preview.png")      # outside the site folder
        doc[0].get_pixmap(dpi=110).save(png)
        print("preview:", png)
    pages = "1 page" if doc.page_count == 1 else "%d pages" % doc.page_count
    human = "%d kB" % max(1, round(size / 1024)) if size < 1024 * 1024 else "%.1f MB" % (size / 1024 / 1024)
    meta = "%s · %s · PDF" % (pages, human)
    s = open(DATA, encoding="utf-8").read()
    s2 = re.sub(r'meta: "[^"]*"', 'meta: "%s"' % meta, s, count=1)
    if s2 != s:
        open(DATA, "w", encoding="utf-8", newline="\n").write(s2)
    print("document card meta:", meta)
    if doc.page_count != 1:
        print("FAIL: the guest file must fit one A4 page; tighten tools/handoff-pdf.html")
    return 0 if doc.page_count == 1 and not missing else 1


if __name__ == "__main__":
    sys.exit(main())
