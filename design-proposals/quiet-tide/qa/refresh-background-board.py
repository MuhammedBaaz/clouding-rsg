from pathlib import Path
from PIL import Image
import json
root=Path(r'D:\Clouding\RSG\design-proposals\quiet-tide')
meta=json.loads((root/'qa/background-board-captures.json').read_text())
canvas=Image.new('RGB',(meta[0]['vw'],meta[0]['height']),'#f5f5f0')
coverage=Image.new('1',canvas.size,0)
for tile in meta:
    im=Image.open(root/'qa'/tile['file']).convert('RGB')
    sx=im.width/tile['vw'];sy=im.height/tile['vh']
    top=0 if tile['y']==0 else 70
    patch=im.crop((0,round(top*sy),im.width,im.height)).resize((tile['vw'],tile['vh']-top),Image.Resampling.LANCZOS)
    y=round(tile['y']+top);canvas.paste(patch,(0,y));coverage.paste(1,(0,y,canvas.width,min(canvas.height,y+patch.height)))
assert coverage.getextrema()==(1,1)
canvas.save(root/'qa/background-board.png')
canvas.crop((0,1800,canvas.width,3150)).save(root/'qa/background-board-detail.png')
print('Updated complete board',canvas.size)
