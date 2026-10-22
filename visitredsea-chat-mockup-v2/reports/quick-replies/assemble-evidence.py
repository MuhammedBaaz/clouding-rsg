from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

root = Path(__file__).resolve().parent
meta = json.loads((root / 'capture-metadata.json').read_text())
for item in meta:
    im = Image.open(root / item['file']).convert('RGB')
    scale = im.width / item['vw']
    frame, panel = item['frame'], item['panel']
    box = ((frame['x'] + panel['x']) * scale,
           (frame['y'] + panel['y']) * scale,
           (frame['x'] + panel['x'] + panel['width']) * scale,
           (frame['y'] + panel['y'] + panel['height']) * scale)
    im.crop(tuple(round(v) for v in box)).save(root / item['file'].replace('.png', '-chat.png'))

font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 18)
canvas = Image.new('RGB', (1260, 955), '#14353c')
draw = ImageDraw.Draw(canvas)
draw.text((22, 18), 'QUICK REPLIES / ASSISTANT ACTIONS, DISTINCT FROM CUSTOMER MESSAGES', font=font, fill='#fbf3e6')
shots = [('before-desktop-chat.png', 'Desktop / before selection'),
         ('before-390-chat.png', '390 px / before selection'),
         ('after-360-chat.png', '360 px / after selection')]
for i, (file, title) in enumerate(shots):
    im = Image.open(root / file)
    im.thumbnail((395, 840))
    x = 22 + 415 * i
    canvas.paste(im, (x, 88))
    draw.text((x, 58), title, font=font, fill='#b3ccc7')
canvas.save(root / 'preview.jpg', quality=95)
print('Assembled', len(meta), 'actual-chat captures.')
