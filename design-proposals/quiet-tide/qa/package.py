from pathlib import Path
from PIL import Image
import json,zipfile
root=Path(r'D:\Clouding\RSG\design-proposals\quiet-tide')
shots=['background-resorts.png','background-calendar.png','background-confirmation.png']
ims=[Image.open(root/'qa'/s).convert('RGB') for s in shots]
canvas=Image.new('RGB',(sum(im.width for im in ims)+96,max(im.height for im in ims)+48),'#e8ece4')
x=24
for im in ims:
    canvas.paste(im,(x,24));x+=im.width+24
canvas.save(root/'preview.png')
checks=json.loads((root/'qa/checks.json').read_text());checks['pdfAmountsAndOriginalEmail']='passed (whitespace-normalized PDF text)';checks['dynamicEditedEmailInPDF']='passed';(root/'qa/checks.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
for name in ['edited-guest.pdf','pdf-text.txt']:
    target=(root/'qa'/name).resolve()
    if target.is_relative_to(root.resolve()) and target.is_file():target.unlink()
zip_path=root.parent/'quiet-tide-design-package.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for p in root.rglob('*'):
        if p.is_file():z.write(p,Path('quiet-tide')/p.relative_to(root))
print('package',zip_path.stat().st_size,'bytes')
print('preview',canvas.size)
