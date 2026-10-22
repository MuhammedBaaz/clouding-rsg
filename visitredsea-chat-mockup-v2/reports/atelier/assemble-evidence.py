from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

root = Path(__file__).resolve().parent
meta = json.loads((root / 'tall-capture-metadata.json').read_text())
guest = dict(next(x for x in meta if x['file'] == 'tall-390-review.png'))
guest.update(file='tall-390-guest.png', section='guest')
meta.append(guest)
for item in meta:
    im = Image.open(root / item['file']).convert('RGB')
    # Screenshots use CSS pixels, and the full-page height exceeds the viewport.
    sx = im.width / item['vw']
    f, p = item['frame'], item['panel']
    box = ((f['x']+p['x'])*sx, (f['y']+p['y'])*sx,
           (f['x']+p['x']+p['width'])*sx, (f['y']+p['y']+p['height'])*sx)
    im.crop(tuple(round(v) for v in box)).save(root / item['file'].replace('.png', '-chat.png'))

font_path = Path('C:/Windows/Fonts/segoeui.ttf')
font = ImageFont.truetype(str(font_path), 17)
small = ImageFont.truetype(str(font_path), 13)
sections = ['resorts', 'villas', 'calendar', 'transport', 'guest', 'review', 'otp', 'confirmation']
sheet = Image.new('RGB', (4*340, 2*780), '#12343b')
draw = ImageDraw.Draw(sheet)
for i, section in enumerate(sections):
    im = Image.open(root / ('tall-390-' + section + '-chat.png'))
    im.thumbnail((320, 725))
    x, y = (i % 4)*340+10, (i//4)*780+38
    sheet.paste(im, (x, y))
    draw.text((x, y-27), section.capitalize() + ' / 390 px', fill='#f7f1e7', font=font)
sheet.save(root / 'full-height-contact-sheet.jpg', quality=93)

selection = [('desktop','villas','Desktop / villas'),('390','calendar','390 px / dates'),
             ('390','guest','390 px / guests'),('360','confirmation','360 px / closure')]
preview = Image.new('RGB', (1460, 870), '#12343b')
draw = ImageDraw.Draw(preview)
draw.text((24, 15), 'TIDAL ATELIER  /  THE ACTUAL V2 CHAT', fill='#f7f1e7', font=font)
draw.text((24, 42), 'Supplied photography, Arabic serif headings and protected ivory controls.', fill='#abd0c7', font=small)
for i,(size,section,label) in enumerate(selection):
    if size == 'desktop' and section == 'villas':
        im = Image.open(root / 'desktop-villas.png').crop((764, 20, 1231, 693))
    else:
        im = Image.open(root / ('tall-'+size+'-'+section+'-chat.png'))
    im.thumbnail((343, 730))
    x = 24 + i*360
    preview.paste(im, (x, 104))
    draw.text((x, 77), label, fill='#f7f1e7', font=font)
preview.save(root / 'preview.jpg', quality=95)
print('Assembled', len(meta), 'full-height chat crops and two contact sheets.')
