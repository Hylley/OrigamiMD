import os
from pathlib import Path
from shutil import make_archive

try:
    os.remove('sample.ori')
except: pass

make_archive('sample', 'zip', 'sample/')
file = Path('sample.zip')
file.rename(file.with_suffix('.ori'))