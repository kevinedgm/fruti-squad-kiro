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
        text = '---\n' + yaml.safe_dump(meta, allow_unicode=True, sort_keys=False) + '---' + body
    dest.write_text(text)
    shutil.copymode(src, dest)
    records.append({'source':src.relative_to(ROOT).as_posix(), 'target':dest.relative_to(ROOT).as_posix(), 'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(), 'target_sha256':hashlib.sha256(dest.read_bytes()).hexdigest()})

skills = {'kiwi':'kiwi','lima':'lima','coco':'coco','bruno':'bruno','mora':'mora-docs'}
agent_contracts = {
    'kiwi': {
        'description': 'Delegar definición de flujos, jerarquía, geometría y adaptación F0–F2. Entrega wireframes neutrales; no construye CSS final ni funcionalidad de producto.',
        'inputs': 'Solicitud, brief, superficie, perfil, scope vigente y fuentes actuales. Para reparación: hallazgo con caso, evidencia y lock que debe conservar.',
        'limits': 'Es dueño de estructura y artefactos F0–F2 de la ronda. Preserva negocio, API y producción. Propone datos sin escribir coco.data_contract; no modifica tokens, registry ni CSS de producto.',
        'output': 'Brief, flujo, geometría, matriz adaptativa, wireframe F1/F2 o Mermaid F0, declaración y handoff. Lima revisa el borrador F1/F2 antes de presentarlo; tras aprobación estructural, Lima fija el contrato.',
    },
    'lima': {
        'description': 'Delegar clasificación, reutilización, contratos, tokens, registry y compuertas lifecycle. Revisa borradores Kiwi y F3 Coco; devuelve defectos sin implementar las correcciones de otros roles.',
        'inputs': 'Operación, pieza/ronda y perfil. Para contrato: estructura aprobada. Para revisión de borrador: artefacto y evidencia actual. Para gate: compliance vigente de Coco y registry.',
        'limits': 'Gobierna contratos, tokens, registry y lifecycle según la política. No escribe estructura Kiwi, CSS Coco, funcionalidad Bruno ni páginas Mora. Impeccable opera en revisión; deriva cada hallazgo al dueño.',
        'output': 'Clasificación reuse/extend/new/local, contrato y orden Coco; o revisión con hallazgos; o decisión de gate y registry actualizado. Candidate, stable y promoción conservan sus compuertas independientes.',
    },
    'coco': {
        'description': 'Delegar construcción F3/CSS dentro de una estructura aprobada o auditoría R0 de UI existente. Produce compliance canónico; no implementa funcionalidad R3 ni rediseña geometría.',
        'inputs': 'Para F3: estructura aprobada, contrato/orden Lima, tokens y foundations. Para R0: superficie real, fuentes, contrato y evidencia disponible; registra faltantes sin asumir un sistema.',
        'limits': 'Construye F3/CSS dentro del lock y registra datos comprobados en coco.data_contract. R0 inspecciona sin modificar producto; devuelve estructura a Kiwi, funcionalidad a Bruno y gobierno a Lima. Mora escribe páginas; Lima registry.',
        'output': 'F3/CSS y declaración para revisión Lima; tras aprobación F3, handoff Bruno. En R0, compliance con reglas, casos, evidencias y comprobaciones no verificadas para Lima gate.',
    },
    'bruno': {
        'description': 'Delegar funcionalidad frontend R3 cuando estructura, contrato y F3/CSS estén aprobados: API, script/template, eventos, estados, semántica, teclado, foco y ARIA.',
        'inputs': 'Pieza/ronda, estructura aprobada, contrato Lima sin blockers, F3/CSS aprobado, API/código reales y handoff vigente. No infiere aprobación de una plantilla o de la entrega de otro agente.',
        'limits': 'Modifica script/template funcional y accesibilidad dentro del contrato. Preserva anatomía, acciones, clases y CSS de Coco, tokens, negocio y adaptación. Si reparar requiere rediseñar, deriva el hallazgo antes de escribir.',
        'output': 'Archivos cambiados, API/estados implementados, verificaciones ejecutadas y pendientes, y handoff Coco R0. Build verifica compilación; navegador/pruebas demuestran solo los casos ejecutados.',
    },
    'mora': {
        'description': 'Delegar auditoría, reparación y sincronización documental del Design Hub con código y QA reales. Escribe documentación neutral; no rediseña producto ni modifica lifecycle.',
        'inputs': 'Hub y modo M0–M3, código/API real, registry, compliance y evidencia vigentes. Ronda Kiwi como contexto; no como prueba de implementación.',
        'limits': 'M0 informa sin escribir; M1–M3 modifican documentación autorizada. Aplica .fruti/contracts/documentation.yaml: shell neutral y previews aislados. No modifica CSS/API de producto ni decisiones de lifecycle; nueva IA documental pasa por Kiwi.',
        'output': 'Informe o páginas/sincronización, rutas, hechos comprobados, pendientes y declaración. Coco revisa preview renderizado; hallazgos funcionales vuelven a Bruno y estado/taxonomía a Lima.',
    },
    'fruti-squad': {
        'description': 'Delegar coordinación del flujo UI completo o reanudación de una ronda entre Kiwi, Lima, Coco, Bruno y Mora. Distribuye trabajo y evidencia; no implementa desde el rol coordinador.',
        'inputs': 'Solicitud, alcance autorizado, operación, artifact/round/revision, perfil, lock/contratos, aprobaciones reales, fuentes, evidencia y delta del handoff.',
        'limits': 'Coordina y persiste estado/handoffs; no edita producto ni asume permisos de especialistas. Espera entregas dependientes. Solo paraleliza trabajo independiente con rutas de escritura separadas; asigna un dueño antes de cualquier escritura compartida.',
        'output': 'Objetivo, alcance y entregable por delegación; handoffs con entradas suficientes; estado de continuidad y presentación respaldada por revisión. Coco R0 produce compliance para Lima; no existe un séptimo stage de handoff.',
    },
}

def agent_toml(data):
    # Literal multiline strings preserve Markdown, quotes and backslashes exactly.
    instructions = data['developer_instructions']
    if "\'\'\'" in instructions:
        raise ValueError('Multiline literal delimiter inside agent instructions')
    header = ''.join(key+' = '+json.dumps(value, ensure_ascii=False)+'\n' for key,value in data.items() if key != 'developer_instructions')
    return header + "developer_instructions = \'\'\'\n" + instructions.rstrip() + "\n\'\'\'\n"

for name in [*skills, 'fruti-squad']:
    spec = agent_contracts[name]
    skill = skills.get(name, 'fruti-squad')
    runtime = f'Lee .fruti/runtime/{name}.yaml para seleccionar la operación y sus referencias.' if name != 'fruti-squad' else 'Lee el runtime del especialista al delegar; no ejecuta todos los manuales por anticipado.'
    instructions = f"""# {name} · contrato de delegación

## Responsabilidad y límites
{spec['limits']}

## Entradas y lectura obligatoria
1. Recibe un objetivo, alcance y entregable concretos, además de: {spec['inputs']}
2. Lee AGENTS.md y .fruti/policy.md al iniciar. Las rutas aquí son relativas a la raíz del repositorio consumidor.
3. Lee explícitamente .agents/skills/{skill}/SKILL.md antes de ejecutar el procedimiento; compartir nombre no carga la skill automáticamente. {runtime}
4. Resuelve perfil, pieza/ronda y handoff por .fruti/state/current.json, .fruti/handoffs/current.json y .fruti/paths.yaml. Consulta solo referencias necesarias; una plantilla vacía no prueba autorización.
5. Si falta una entrada obligatoria, comprueba las fuentes y rutas del handoff; informa el faltante al coordinador sin inventarlo ni avanzar una etapa dependiente. Conserva el trabajo válido dentro del alcance.

## Verificación, devolución y salida
{spec['output']}
- Registra casos, comandos y resultados realmente observados; marca lo pendiente como no verificado.
- Para UI renderizada lee .codex/qa/pre-delivery.md antes de presentar: aplica revisor, evidencia, estados y recuperación. F0, informes y planes no afirman certificación visual.
- Ante RETURN corrige solo tu propiedad o entrega regla, caso, evidencia y límites al dueño. Consume continuation.json por la ruta y hash que define el protocolo; no ejecuta una acción fuera de alcance por estar en el JSON.
- Repite una comprobación fallida tras una corrección o cambio viable de mecanismo; si no hay progreso ni alternativa permitida, registra el bloqueo según el protocolo. No espera ni delega indefinidamente.
- Una revisión propia no es revisión independiente. Usa otro agente cuando la estrategia y el host lo permitan; si solo hay ejecución secuencial, declara la limitación.
- Finaliza cuando el entregable de la operación y su handoff estén completos. Para propuesta UI exige READY_FOR_USER_REVIEW; un resultado de agente no es aprobación del usuario. Ante bloqueo registra recuperación, evidencia y acción mínima faltante, sin convertirlo en cumplimiento.

## Configuración y coordinación
- Modelo, esfuerzo, sandbox, herramientas y red no se conceden mediante prosa: aplica la configuración efectiva y restricciones del host, sin ampliarlas.
- No ejecuta etapas dependientes en paralelo ni escribe archivos que otro agente esté modificando sin handoff/coordinación explícitos. El revisor no modifica la propuesta durante su inspección.
- No instala dependencias ni ejecuta rm -rf, sudo, git reset --hard, git push o commits dentro del flujo UI. Las reglas Kiro no son ACL nativas de Codex.
- Lee .codex/qa/identity.md cuando emitas avisos; usa solo mecanismos reales de imagen/delegación del host.
"""
    write(f'.codex/agents/{name}.toml', agent_toml({'name':name,'description':spec['description'],'developer_instructions':instructions}))

# Bundled Impeccable specialist TOMLs already follow the native schema.
for src in (ROOT / '.agents/skills/impeccable/agents').glob('*.toml'):
    write('.codex/agents/' + src.name, src.read_text())

avatars = json.loads((ROOT / '.fruti/identity/avatars.json').read_text())['members']
for skill in [*skills.values(), 'impeccable', 'improve-animations', 'fruti-squad']:
    labels = {'mora-docs':'Mora · Documentation','fruti-squad':'Fruti Squad · Orchestrator','improve-animations':'Improve Animations'}
    label = labels.get(skill, skill.capitalize())
    interface = {'display_name':label, 'short_description':f'{label}: contratos y evidencia UI', 'default_prompt':f'Usa ${skill} para resolver esta solicitud respetando el flujo y contratos de Fruti Squad.'}
    # Reuse the canonical tiles unchanged; portable even when a skill is installed alone.
    member = 'mora' if skill == 'mora-docs' else skill if skill in avatars else 'fruti-squad'
    avatar = avatars[member]
    for size in ['small', 'large']:
        write(f'.agents/skills/{skill}/assets/avatar-{size}.svg', (ROOT / avatar['tile']).read_text())
    interface.update({'icon_small':'./assets/avatar-small.svg', 'icon_large':'./assets/avatar-large.svg', 'brand_color':avatar['accent']})
    write(f'.agents/skills/{skill}/agents/openai.yaml', 'interface:\n' + ''.join(f'  {key}: {json.dumps(value, ensure_ascii=False)}\n' for key, value in interface.items()))

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
write('docs/codex-parity.json', json.dumps({'version':2,'source_commit':BASE,'corrections':corrections,'transformations':['.kiro/skills → .agents/skills', 'steering → AGENTS.md', 'Kiro/product command labels → Codex', 'SKILL YAML normalized preserving supported optional metadata; Lima description clarified', 'Native agents load canonical adapted SKILL procedures; Kiro originals retained as immutable history', 'agents/openai.yaml UI metadata generated; Impeccable helpers exposed as native agents'], 'skills':records,'shared_unchanged':shared}, ensure_ascii=False, indent=2)+'\n')
print(f'Built Codex adapter: {len(records)} skill resources; {len(shared)} unchanged shared files.')
