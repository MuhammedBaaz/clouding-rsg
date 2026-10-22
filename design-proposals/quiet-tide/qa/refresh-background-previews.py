from pathlib import Path
from PIL import Image
import json
root=Path(r'D:\Clouding\RSG\design-proposals\quiet-tide')
meta=json.loads((root/'qa/background-panel-captures.json').read_text())
composed=[]
for label in ['resorts','calendar','confirmation']:
    tiles=[t for t in meta if t['label']==label]
    out=Image.new('RGB',(round(tiles[0]['width']),round(tiles[0]['height'])),'#e5eee3')
    coverage=Image.new('1',out.size,0)
    for tile in tiles:
        im=Image.open(root/'qa'/tile['file']).convert('RGB')
        sx=im.width/tile['vw']; sy=im.height/tile['vh']
        top=max(tile['y'],70); bottom=min(tile['y']+tile['height'],tile['vh'])
        left=tile['x']; right=left+tile['width']
        patch=im.crop((round(left*sx),round(top*sy),round(right*sx),round(bottom*sy)))
        dest_y=round(top-tile['y']); h=round(bottom-top)
        patch=patch.resize((out.width,h),Image.Resampling.LANCZOS)
        out.paste(patch,(0,dest_y));coverage.paste(1,(0,dest_y,out.width,dest_y+h))
    assert coverage.getextrema()==(1,1),(label,'missing image area')
    out.save(root/'qa'/('background-'+label+'.png'));composed.append(out)
canvas=Image.new('RGB',(sum(im.width for im in composed)+96,max(im.height for im in composed)+48),'#e8ece4')
x=24
for im in composed:canvas.paste(im,(x,24));x+=im.width+24
canvas.save(root/'preview.png')
print('Updated preview',canvas.size)
