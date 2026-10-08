#!/usr/bin/env python3
"""Rebuild the Codex adapter from the preserved Kiro source (Python 3 + PyYAML)."""
import hashlib, json, pathlib, shutil, yaml
ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = '47141906fd0731ac3a8b3d25bd56678d2488d81b'

def adapt(text):
    return text.replace('.kiro/skills', '.agents/skills').replace('.kiro/steering/fruti-squad.md', 'AGENTS.md').replace('fruti-squad-kiro', 'fruti-squad-codex').replace('Kiro', 'Codex')

def write(path, text):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text)

corrections = json.loads((ROOT / 'scripts/codex-corrections.json').read_text())
records = []
for src in sorted((ROOT / '.kiro/skills').rglob('*')):
    if not src.is_file():
        continue
    rel = src.relative_to(ROOT / '.kiro/skills')
    dest = ROOT / '.agents/skills' / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    text = adapt(src.read_text())
    for correction in corrections.get(rel.as_posix(), []):
        if correction['before'] not in text:
            raise ValueError('Stale correction: '+rel.as_posix())
        text = text.replace(correction['before'], correction['after'])
    if rel.name == 'SKILL.md':
        _, front, body = text.split('---', 2)
        if rel.parts[0] == 'lima':
            front = '\n'.join('description: ' + json.dumps(line[len('description: '):]) if line.startswith('description: ') else line for line in front.splitlines())
        meta = yaml.safe_load(front)
        if meta['name'] == 'lima':
            meta['description'] = 'Gobierna piezas UI del Fruti Squad: clasificación, reutilización, contratos, tokens, registry y lifecycle draft→candidate→stable. Usar al crear, rediseñar, refinar o promover componentes, patrones o pantallas. Coordina Impeccable y consume la auditoría de Coco; no sustituye a Kiwi ni a Bruno. No usar para backend.'
        text = '---\n' + yaml.safe_dump({k:meta[k] for k in ('name','description')}, allow_unicode=True, sort_keys=False) + '---' + body
    dest.write_text(text)
    shutil.copymode(src, dest)
    records.append({'source':src.relative_to(ROOT).as_posix(), 'target':dest.relative_to(ROOT).as_posix(), 'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(), 'target_sha256':hashlib.sha256(dest.read_bytes()).hexdigest()})

skills = {'kiwi':'kiwi','lima':'lima','coco':'coco','bruno':'bruno','mora':'mora-docs'}
for name in [*skills, 'fruti-squad']:
    src = ROOT / f'.kiro/agents/{name}.md'
    _, front, body = src.read_text().split('---', 2)
    meta = yaml.safe_load(front)
    desc = meta['description']
    skill = skills.get(name, 'fruti-squad')
    instructions = f'''Leer AGENTS.md y .fruti/policy.md. Resolver el estado, perfil activo y handoff desde .fruti/state/current.json; resolver rutas lógicas por .fruti/paths.yaml.
Leer .agents/skills/{skill}/SKILL.md al activar esta skill. El runtime del dueño selecciona la operación y solo sus referencias necesarias; no precargar directorios.
La política compartida y los contratos canónicos resuelven atribuciones heredadas: Kiwi F0–F2; Lima gobierno; Coco F3/CSS y R0; Bruno funcionalidad R3; Mora documentación verificada. Respetar locks y aprobaciones vigentes.
Las reglas permissions de Kiro son intención de control, no configuración nativa de Codex. Usar permisos/sandbox del host. No ejecutar rm -rf, sudo, git reset --hard ni git push. No hacer commit. El orquestador coordina sin editar producto; cada especialista limita sus escrituras a su propiedad y evidencia/handoffs.
No interpretar un resultado de agente como aprobación del usuario. Si falta una aprobación requerida, devolver la propuesta concreta y detener el downstream dependiente. No inventar herramientas ni simular delegaciones. Si no hay subagentes, ejecutar los mismos roles secuencialmente con la misma separación y declararlo.
''' + adapt(body)
    write(f'.codex/agents/{name}.toml', 'name = '+json.dumps(name)+'\ndescription = '+json.dumps(desc, ensure_ascii=False)+'\ndeveloper_instructions = '+json.dumps(instructions, ensure_ascii=False)+'\n')

# Bundled Impeccable specialist TOMLs already follow the native schema.
for src in (ROOT / '.agents/skills/impeccable/agents').glob('*.toml'):
    write('.codex/agents/' + src.name, src.read_text())

for skill in [*skills.values(), 'impeccable', 'improve-animations', 'fruti-squad']:
    labels = {'mora-docs':'Mora · Documentation','fruti-squad':'Fruti Squad · Orchestrator','improve-animations':'Improve Animations'}
    label = labels.get(skill, skill.capitalize())
    interface = {'display_name':label, 'short_description':f'{label}: contratos y evidencia UI', 'default_prompt':f'Usa ${skill} para resolver esta solicitud respetando el flujo y contratos de Fruti Squad.'}
    write(f'.agents/skills/{skill}/agents/openai.yaml', yaml.safe_dump({'interface':interface}, allow_unicode=True, sort_keys=False))

# Preserve all shared contracts/runtime/evidence formats; only path mapping changes.
paths = yaml.safe_load((ROOT / '.fruti/paths.yaml').read_text())
paths['target'] = 'codex'
paths['roots'] = {k:adapt(v) for k,v in paths['roots'].items()}
write('.fruti/paths.yaml', '# Generated for the Codex distribution of Fruti Squad.\n'+yaml.safe_dump(paths, sort_keys=False))
shared = []
for src in sorted((ROOT / '.fruti').rglob('*')):
    if src.is_file() and src.name != 'paths.yaml':
        shared.append({'path':src.relative_to(ROOT).as_posix(), 'sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
for record in records:
    record['target_sha256'] = hashlib.sha256((ROOT / record['target']).read_bytes()).hexdigest()
write('docs/codex-parity.json', json.dumps({'version':2,'source_commit':BASE,'corrections':corrections,'transformations':['.kiro/skills → .agents/skills', 'steering → AGENTS.md', 'Kiro/product command labels → Codex', 'SKILL metadata normalized to name+description; Lima description shortened only', 'Kiro agent body → native TOML developer_instructions; permissions intent documented', 'agents/openai.yaml UI metadata generated; Impeccable helpers exposed as native agents'], 'skills':records,'shared_unchanged':shared}, ensure_ascii=False, indent=2)+'\n')
print(f'Built Codex adapter: {len(records)} skill resources; {len(shared)} unchanged shared files.')
