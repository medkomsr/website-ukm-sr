import sys, re, json, subprocess
from pathlib import Path
rt, app, repo = map(lambda x:Path(x).resolve(), sys.argv[1:4])
assert rt == app/'.next'/'standalone'
(rt/'.gitignore').write_bytes(Path(__file__).with_name('runtime.gitignore').read_bytes())
for f in rt.glob('.env*'):
    assert f.is_file()
    f.unlink()
buildroot = str(app).encode()
boot = rt/'server.js'
raw = boot.read_bytes()
assert raw.count(b'"'+buildroot+b'"') == 3 and b'const dir = path.join(__dirname)' in raw
boot.write_bytes(raw.replace(b'"'+buildroot+b'"', b'dir'))
manifest = rt/'.next/required-server-files.json'
data=json.loads(manifest.read_text())
assert data['appDir'] == str(app)
assert data['config']['outputFileTracingRoot'] == data['config']['repoRoot'] == data['config']['turbopack']['root'] == str(app)
data['appDir'] = data['config']['outputFileTracingRoot'] = data['config']['repoRoot'] = data['config']['turbopack']['root'] = '.'
manifest.write_text(json.dumps(data,ensure_ascii=False, indent=2)+'\n')
assert not data['config'].get('env',{})
patterns = [re.compile(x) for x in [rb'-----BEGIN (?:RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----', rb'(?<![A-Za-z0-9_])gh[pousr]_[A-Za-z0-9]{35,}(?![A-Za-z0-9])',rb'(?:AKIA|ASIA)[A-Z0-9]{16}',rb'github_pat_[A-Za-z0-9_]{70,}',rb'xox[baprs]-[0-9]{8,}-[A-Za-z0-9-]{15,}']]
sensitive=[]
envfile=repo/'.env.local'
if envfile.is_file():
  for line in envfile.read_text(encoding='utf-8-sig').splitlines():
    k,_,v = line.partition('=')
    if not k.strip().startswith('NEXT_PUBLIC_') and re.search(r'KEY|TOKEN|SECRET|PASS', k, re.I):
      v=v.strip().strip(chr(34)+chr(39))
      if len(v)>=12 and len(set(v))>=6: sensitive.append(v.encode())
count=0
for f in rt.rglob('*'):
    relative=f.relative_to(rt)
    path=relative.as_posix()
    assert not (f.is_symlink() or f.name.startswith('.env') or f.name in ('.npmrc','.git') or path.startswith(('.next/cache/','.next/diagnostics/')) or path in ('.next/cache','.next/diagnostics','.next/trace') or f.suffix in ('.tgz','.xz','.zip') or path.endswith('.tar.gz')), path
    if f.is_file():
      body=f.read_bytes()
      if buildroot in body or b'/tmp/seni-religi-build.' in body or any(x in body for x in sensitive) or any(rx.search(body) for rx in patterns):
        raise RuntimeError('Packaging exclusion failed in '+path)
      count+=1
print('Verified',count,'runtime files; no local source root, private configuration values, key patterns or caches; deployed .gitignore preserved.')
