from pathlib import Path
import json
p=Path('design-proposals/quiet-tide'); data=json.loads((p/'content.json').read_text(encoding='utf-8-sig')); (p/'data.js').write_text('const KIT = '+json.dumps(data,ensure_ascii=False)+';\n',encoding='utf-8')
