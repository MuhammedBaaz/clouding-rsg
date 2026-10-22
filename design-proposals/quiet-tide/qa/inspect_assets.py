from pathlib import Path
from PIL import Image,ImageOps,ImageDraw

import zipfile
root=Path(r'D:\Clouding\RSG\design-proposals\quiet-tide')
kit=Path(r'D:\Clouding\RSG\design-briefs\2026-10-20-rich-components\RSG_Rich_Components_Design_Kit.zip')
with zipfile.ZipFile(kit) as z:
    for n in z.namelist():
        parts=n.split('/')
        if 'assets' in parts:
            rel='/'.join(parts[parts.index('assets'):])
            if not n.endswith('/'):
                out=root/rel; out.parent.mkdir(parents=True,exist_ok=True); out.write_bytes(z.read(n))
files=list((root/'assets').rglob('*.webp'))
canvas=Image.new('RGB',(1200,((len(files)+3)//4)*215),'#f3f1eb'); d=ImageDraw.Draw(canvas)
for i,p in enumerate(files):
    im=Image.open(p).convert('RGB'); tile=ImageOps.fit(im,(284,165))
    x=(i%4)*300+8;y=(i//4)*215+8;canvas.paste(tile,(x,y));d.text((x,y+169),p.stem[:37],fill='#163c3b');d.text((x,y+186),str(im.size),fill='#555555')
canvas.save(root/'qa'/'asset-contact-sheet.jpg')

