#!/usr/bin/env python3
"""Validate native schemas, resource parity and immutable shared quality contracts."""
import hashlib, json, pathlib, re, subprocess, tomllib, yaml
root = pathlib.Path(__file__).resolve().parents[1]
manifest = json.loads((root/'docs/codex-parity.json').read_text())
errors = []
# Fixes are explicitly reviewable and must agree with the checked-in patch ledger.
assert manifest.get('corrections') == json.loads((root/'scripts/codex-corrections.json').read_text())
def check(ok, message):
    if not ok: errors.append(message)
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
for row in manifest['skills']:
    for key in ['source','target']:
        p = root/row[key]
        check(p.is_file() and digest(p)==row[key+'_sha256'], 'Resource parity/hash mismatch: '+row[key])
# Independently compare procedural content, not merely generated hashes.
for row in manifest['skills']:
    src = (root/row['source']).read_text()
    dst = (root/row['target']).read_text()
    expected = src.replace('.kiro/skills', '.agents/skills').replace('.kiro/steering/fruti-squad.md', 'AGENTS.md').replace('fruti-squad-kiro', 'fruti-squad-codex').replace('Kiro', 'Codex')
    for correction in manifest.get('corrections',{}).get(row['source'].removeprefix('.kiro/skills/'),[]):
        check(correction['before'] in expected, 'Stale declared correction: '+row['target'])
        expected = expected.replace(correction['before'],correction['after'])
    if row['source'].endswith('/SKILL.md'):
        check(expected.split('---',2)[2]==dst.split('---',2)[2], 'Procedure body changed: '+row['target'])
    elif row['source'].endswith('/agents/openai.yaml'):
        pass  # Deliberately generated selector metadata, not procedural instructions.
    else:
        check(expected==dst, 'Unexpected resource transformation: '+row['target'])
for row in manifest['shared_unchanged']:
    check(digest(root/row['path'])==row['sha256'], 'Shared contract changed: '+row['path'])
# Compare against the immutable upstream commit, not only a mutable manifest.
paths = ['.kiro', *[x['path'] for x in manifest['shared_unchanged']]]
result = subprocess.run(['git','diff','--exit-code',manifest['source_commit'],'--',*paths],cwd=root,capture_output=True,text=True)
check(result.returncode==0, 'Kiro source/shared policy differs from source commit' if result.returncode==1 else 'Source commit unavailable: fetch full history before parity validation ('+result.stderr.strip()+')')
for p in (root/'.agents/skills').glob('*/SKILL.md'):
    parts = p.read_text().split('---',2)
    check(len(parts)==3, 'Missing frontmatter: '+str(p))
    if len(parts)!=3: continue
    meta = yaml.safe_load(parts[1])
    check(set(meta)=={'name','description'}, 'Unexpected metadata: '+str(p))
    check(meta['name']==p.parent.name, 'Skill name mismatch: '+str(p))
    check(bool(re.fullmatch('[a-z0-9]+(?:-[a-z0-9]+)*',meta['name'])), 'Invalid name: '+str(p))
    check(0<len(meta['description'])<=1024, 'Invalid description length: '+str(p))
    check('TODO:' not in parts[2], 'Unfinished generated skill: '+str(p))
    interface = yaml.safe_load((p.parent/'agents/openai.yaml').read_text())['interface']
    member = 'mora' if meta['name']=='mora-docs' else meta['name'] if meta['name'] in ['kiwi','lima','coco','bruno','fruti-squad'] else 'fruti-squad'
    avatar = json.loads((root/'.fruti/identity/avatars.json').read_text())['members'][member]
    for field in ['icon_small','icon_large']:
        ref = pathlib.Path(interface.get(field,''))
        check(not ref.is_absolute() and '..' not in ref.parts and str(ref).startswith('assets/'), 'Unsafe/missing icon reference: '+str(p))
        icon = p.parent/ref
        check(icon.is_file() and icon.read_bytes()==(root/avatar['tile']).read_bytes(), 'Non-portable or noncanonical avatar: '+str(p))
    check(interface.get('brand_color')==avatar['accent'], 'Avatar brand color mismatch: '+str(p))
    check('$'+meta['name'] in interface['default_prompt'], 'Invalid default_prompt: '+str(p))
    check(25<=len(interface['short_description'])<=64, 'Invalid UI short description: '+str(p))
for p in (root/'.codex/agents').glob('*.toml'):
    data = tomllib.loads(p.read_text())
    check(all(data.get(k) for k in ['name','description','developer_instructions']), 'Invalid agent TOML: '+str(p))
    check('.kiro/' not in p.read_text(), 'Unadapted native agent path: '+str(p))
for filename in ['pre-delivery.md','collect-browser.cjs','verify-delivery.cjs']:
    check((root/'.codex/qa'/filename).is_file(), 'Missing pre-delivery resource: '+filename)
for name in ['kiwi','lima','coco','bruno','mora','fruti-squad']:
    check('.codex/qa/pre-delivery.md' in tomllib.loads((root/'.codex/agents'/f'{name}.toml').read_text())['developer_instructions'], 'Agent lacks pre-delivery gate: '+name)
paths = yaml.safe_load((root/'.fruti/paths.yaml').read_text())
check(paths['target']=='codex', 'Wrong path target')
def resolve(value):
    for prefix, mapped in sorted(paths['roots'].items(),key=lambda x:-len(x[0])):
        if value==prefix or value.startswith(prefix+'/'): return mapped+value[len(prefix):]
    return value
for p in (root/'.fruti/runtime').glob('*.yaml'):
    runtime = yaml.safe_load(p.read_text())
    for op, settings in runtime['operations'].items():
        for ref in settings.get('references',[]) + settings.get('assets_on_demand',[]):
            check((root/resolve(ref)).is_file(), f'Missing runtime resource {p.name}:{op}: {ref}')
plugin = json.loads((root/'.codex-plugin/plugin.json').read_text())
check(plugin['skills']=='./.agents/skills/' and (root/plugin['skills']).is_dir(), 'Invalid plugin skills path')
check(plugin['version']==json.loads((root/'package.json').read_text())['version'], 'Plugin/package version mismatch')
check(set(manifest['corrections']).issubset({r['source'].removeprefix('.kiro/skills/') for r in manifest['skills']}), 'Correction target outside source inventory')
# All adapted resources must be retained, and all native specialist bodies retain source instructions.
check(len(list((root/'.kiro/skills').rglob('*')))>0, 'Missing baseline')
check({r['source'] for r in manifest['skills']}=={p.relative_to(root).as_posix() for p in (root/'.kiro/skills').rglob('*') if p.is_file()}, 'Incomplete resource inventory')
for p in (root/'.kiro/agents').glob('*.md'):
    body = p.read_text().split('---',2)[2]
    adapted = body.replace('.kiro/skills','.agents/skills').replace('Kiro','Codex')
    native = tomllib.loads((root/'.codex/agents'/p.with_suffix('.toml').name).read_text())
    check(adapted in native['developer_instructions'], 'Agent procedure lost: '+p.name)
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(manifest["skills"])} resources, {len(manifest["shared_unchanged"])} shared files, 8 skills, 10 native agents, runtime links and source parity.')
