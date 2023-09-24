from pathlib import Path
from shutil import make_archive

make_archive('sample', 'zip', 'sample/')
file = Path('sample.zip')
file.rename(file.with_suffix('.ori'))
