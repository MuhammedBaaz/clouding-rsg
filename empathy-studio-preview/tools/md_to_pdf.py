"""Render a Markdown file of this folder to a print-ready HTML page, then to PDF with headless Edge.

    python tools/md_to_pdf.py STUDIO_TEMPLATES_LIVE.md

Mixed-direction document: the body is English (LTR); Arabic labels and quoted sentences sit inside
English paragraphs and code blocks, so every block gets dir="auto" and the fonts cover both scripts
(Segoe UI for Latin, Segoe UI / Arial for Arabic; Cascadia Mono / Consolas for code, which fall back to
an Arabic-capable font for Arabic runs). Code blocks wrap so long paste values stay on the page.
"""
import os
import subprocess
import sys
import tempfile

import markdown

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

CSS = """
@page { size: A4; margin: 16mm 14mm 18mm 14mm; }
html { font-size: 10.5pt; }
body { font-family: "Segoe UI", "Segoe UI Historic", Arial, sans-serif; color: #1e282f; line-height: 1.45; margin: 0; }
h1 { font-size: 20pt; margin: 0 0 6pt; letter-spacing: -0.2px; }
h2 { font-size: 14pt; margin: 22pt 0 6pt; padding-bottom: 3pt; border-bottom: 1px solid #c9d3d6; break-after: avoid; }
h3 { font-size: 11.5pt; margin: 18pt 0 4pt; break-after: avoid; }
p, li { unicode-bidi: plaintext; }
p { margin: 4pt 0; }
hr { border: 0; border-top: 1px solid #c9d3d6; margin: 14pt 0; }
code { font-family: "Cascadia Mono", Consolas, "Segoe UI", monospace; font-size: 9pt; background: #f1f4f5; padding: 0 2px; border-radius: 2px; unicode-bidi: plaintext; }
pre { font-family: "Cascadia Mono", Consolas, "Segoe UI", monospace; font-size: 8.6pt; line-height: 1.4; background: #f6f8f8; border: 1px solid #d8e0e3; border-radius: 3px; padding: 7pt 8pt; margin: 5pt 0 8pt; white-space: pre-wrap; overflow-wrap: anywhere; break-inside: avoid; }
pre code { background: none; padding: 0; font-size: inherit; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt; font-size: 8.8pt; }
th, td { border: 1px solid #c9d3d6; padding: 3pt 5pt; vertical-align: top; text-align: start; unicode-bidi: plaintext; }
th { background: #e9eeef; font-weight: 600; }
th:first-child { width: 22%; } th:nth-child(2) { width: 24%; } th:nth-child(4) { width: 26%; }
table { table-layout: fixed; }
td, td code { overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap; }
tr { break-inside: avoid; }
blockquote { margin: 6pt 0; padding: 0 10pt; border-inline-start: 3px solid #c9d3d6; color: #44525a; }
strong { font-weight: 600; }
.meta { color: #5c6b72; font-size: 9pt; margin-bottom: 14pt; }
"""


def main():
    src = sys.argv[1]
    path = src if os.path.isabs(src) else os.path.join(HERE, src)
    text = open(path, encoding="utf-8").read()
    body = markdown.markdown(text, extensions=["tables", "fenced_code", "nl2br"])
    # every block element reads its own direction from its first strong character
    for tag in ("<p>", "<li>", "<td>", "<th>", "<h1>", "<h2>", "<h3>", "<pre>"):
        body = body.replace(tag, tag[:-1] + ' dir="auto">')
    html = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>%s</title><style>%s</style></head><body>%s</body></html>'
            % (os.path.splitext(os.path.basename(path))[0], CSS, body))
    html_path = os.path.splitext(path)[0] + ".print.html"
    with open(html_path, "w", encoding="utf-8") as fh:
        fh.write(html)
    pdf_path = os.path.splitext(path)[0] + ".pdf"
    profile = tempfile.mkdtemp(prefix="edge-print-")
    cmd = [EDGE, "--headless=new", "--disable-gpu", "--no-first-run", "--user-data-dir=" + profile,
           "--print-to-pdf=" + pdf_path, "--no-pdf-header-footer", "file:///" + html_path.replace("\\", "/")]
    subprocess.run(cmd, check=False, timeout=180)
    print(pdf_path, os.path.getsize(pdf_path) if os.path.exists(pdf_path) else "NOT WRITTEN")


if __name__ == "__main__":
    main()
