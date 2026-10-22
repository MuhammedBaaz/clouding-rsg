from pathlib import Path
from PIL import Image,ImageDraw
import json
root=Path(r'D:\Clouding\RSG\visitredsea-chat-mockup-v2\reports\atelier')
meta=json.loads((root/'capture-metadata.json').read_text())
for item in meta:
    im=Image.open(root/item['file']).convert('RGB');sx=im.width/item['vw'];sy=im.height/item['vh'];f=item['frame'];p=item['panel']
    box=((f['x']+p['x'])*sx,(f['y']+p['y'])*sy,(f['x']+p['x']+p['width'])*sx,(f['y']+p['y']+p['height'])*sy)
    crop=im.crop(tuple(round(v) for v in box));crop.save(root/item['file'].replace('.png','-chat.png'))
kinds=['resorts','villas','calendar','airports','transport','experiences','guest','review','otp','payment','confirmation','modes']
canvas=Image.new('RGB',(4*320,3*465),'#122f36');d=ImageDraw.Draw(canvas)
for i,kind in enumerate(kinds):
    im=Image.open(root/('review-360-'+kind+'-chat.png'));im.thumbnail((300,420));x=(i%4)*320+10;y=(i//4)*465+27;canvas.paste(im,(x,y));d.text((x,y-19),kind,fill='#f7efdc')
canvas.save(root/'mobile-contact-sheet.jpg')
print('Cropped',len(meta),'actual-chat screenshots')
