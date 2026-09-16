import base64
import io
import json
import tarfile
from pathlib import Path

parts = Path('.github/bootstrap')
archive = base64.b64decode(''.join(p.read_text().strip() for p in sorted(parts.glob('part-*'))))
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as tar:
    tar.extractall(Path.cwd(), filter='data')

package_path = Path('package.json')
package = json.loads(package_path.read_text())
package['pnpm'] = {'onlyBuiltDependencies': ['esbuild']}
package_path.write_text(json.dumps(package, indent=2) + '\n')

for path in parts.glob('part-*'):
    path.unlink()
parts.rmdir()
Path('.github/bootstrap.py').unlink(missing_ok=True)
Path('.github/workflows/dev-verify.yml').unlink(missing_ok=True)
