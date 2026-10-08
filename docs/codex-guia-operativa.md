# Codex · Guía operativa para crear agentes y skills

Adaptación de Fruti Squad for Kiro en la rama `codex`, basada en el commit `47141906fd0731ac3a8b3d25bd56678d2488d81b`. Fecha de verificación documental: 8 de octubre de 2026.

## Contenido

1. Objetivo y equivalencia
2. Instalación y primer uso
3. Arquitectura y contratos
4. Flujo completo y compuertas
5. Calidad y evidencia
6. Crear o modificar una skill
7. Crear o modificar un agente
8. Permisos y compatibilidad
9. Tematización y perfiles
10. Validación y mantenimiento
11. Fuentes y límites

## 1. Objetivo y equivalencia

Conservar el procedimiento, la separación de responsabilidades, las compuertas de aprobación, los contratos y los criterios de calidad de la distribución Kiro. Cambiar únicamente el adaptador de ejecución para que Codex descubra y utilice las skills y agentes.

La equivalencia es verificable en archivos: `docs/codex-parity.json` enumera recursos originales/adaptados, hashes SHA-256, commit de origen y transformaciones. `scripts/validate-codex.py` verifica esos hashes, compara la fuente Kiro y los contratos compartidos con el commit original, valida YAML/TOML y comprueba referencias de los runtimes. No basta con tener los mismos nombres de agentes.

| Elemento Kiro | Codex | Qué se conserva |
|---|---|---|
| `.kiro/skills/<nombre>/` | `.agents/skills/<nombre>/` | Cuerpo del procedimiento, referencias, scripts, plantillas y assets |
| `.kiro/agents/<nombre>.md` | `.codex/agents/<nombre>.toml` | Descripción y cuerpo de instrucciones; límites de propiedad |
| `.kiro/steering/fruti-squad.md` | `AGENTS.md` | Memoria compartida, orden, aprobaciones y router |
| `.fruti/runtime/*.yaml` | Misma ruta, mismo contenido | Operaciones, entradas, salidas, dueños y reglas |
| `.fruti/contracts/*.yaml` | Misma ruta, mismo contenido | Documentación, implementación, tematización y tipografía |
| `.fruti/policy.md` | Misma ruta, mismo contenido | Autoridad, fuentes, aislamiento, estados, handoffs y calidad |
| `.fruti/paths.yaml` | Misma ruta, raíces Codex | Resolución de las mismas rutas lógicas |
| `welcomeMessage` | Metadatos `agents/openai.yaml` y nombre del agente | Identidad; sin prometer el mismo mensaje inicial del host |
| `permissions.rules` y `toolsSettings` | Permisos del host + instrucciones del rol | Intención del workflow; no equivalencia de ACL |

Las fuentes Kiro quedan preservadas en la rama como línea base, pero el instalador Codex solo distribuye `.agents`, `.codex`, `.fruti` y `AGENTS.md`. No instala `.kiro`.

La normalización de frontmatter deja `name` y `description` válidos. Lima tenía una descripción larga con un `:` sin comillas que invalidaba su YAML; la versión Codex usa una descripción corta válida y conserva el cuerpo del protocolo. Los helpers TOML de Impeccable también se exponen en `.codex/agents`.

Igualdad de contratos y recursos significa igualdad de requisitos. La calidad de una entrega concreta se verifica ejecutando el pipeline sobre esa interfaz y su evidencia; una prueba de empaquetado no demuestra calidad visual.

## 2. Instalación y primer uso

Requisitos: Node.js 18 o posterior; cliente Codex con skills locales. Para scripts de Kiwi/Lima: Python 3 y, para el bootstrap de Lima, Bash. Los scripts de mantenimiento de esta distribución necesitan Python 3.11+ y PyYAML. Navegador, Playwright e Impeccable son capacidades adicionales que deben verificarse en el entorno.

Desde la raíz del proyecto consumidor:

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex install --dry-run
npx fruti-squad-codex init --name 'Mi proyecto'
```

El paquete se llama `fruti-squad-codex`; su repositorio sigue siendo `fruti-squad-kiro` y la instalación desde GitHub debe seleccionar `#codex`. No se ha publicado esta versión en el registro npm. Si npm desactiva scripts de instalación, ejecutar manualmente:

```bash
npx fruti-squad-codex install
```

`postinstall` copia los archivos al proyecto, conserva archivos distintos y reporta conflictos. Si ya existe `AGENTS.md`, integrarlo manualmente: añadir una sección Fruti que mande leer `.fruti/policy.md`, `.fruti/state/current.json`, `.fruti/paths.yaml` y el flujo de roles descrito aquí. No reemplazar las instrucciones propias del proyecto. Un conflicto en un agente o skill exige reconciliar el archivo antes de afirmar que la instalación está completa.

El instalador no escribe `.codex/config.toml`, para preservar la configuración del usuario. Si se deshabilitaron los subagentes, habilitarlos explícitamente en la configuración del cliente:

```toml
[agents]
enabled = true
```

Codex descubre skills de repositorio en `.agents/skills` desde el directorio actual hasta la raíz. Los agentes locales se descubren en `.codex/agents`. Abrir el proyecto completo, no solo una carpeta de skills.

Primer pedido:

```text
Usa $fruti-squad para diseñar este formulario. Conserva el flujo completo y
preséntame las propuestas concretas cuando el contrato requiera aprobación.
```

También se puede pedir «rediseña este formulario», «audítalo» o «documenta lo implementado»: el router identifica dueño y operación. No exigir al usuario que memorice rondas ni referencias. Invocar `$kiwi`, `$lima`, `$coco`, `$bruno` o `$mora-docs` para activar una skill; pedir «delega a kiwi» para solicitar un agente nativo. Skill y agente son mecanismos distintos.

## 3. Arquitectura y contratos

```text
AGENTS.md
.agents/skills/
  fruti-squad/SKILL.md
  kiwi/{SKILL.md,references,assets,scripts,agents/openai.yaml}
  lima/{SKILL.md,reference,profiles,scripts,agents/openai.yaml}
  coco/{SKILL.md,first-run.md,intake.md,profile-additions.md,examples,agents/openai.yaml}
  bruno/{SKILL.md,references,agents/openai.yaml}
  mora-docs/{SKILL.md,templates,agents/openai.yaml,...}
  impeccable/{SKILL.md,reference,scripts,agents,...}
  improve-animations/{SKILL.md,AUDIT.md,PLAN-TEMPLATE.md,agents/openai.yaml}
.codex/agents/
  fruti-squad.toml
  kiwi.toml
  lima.toml
  coco.toml
  bruno.toml
  mora.toml
  impeccable_*.toml
.fruti/
  policy.md
  paths.yaml
  runtime/{kiwi,lima,coco,bruno,mora}.yaml
  contracts/{documentation,implementation-target,theming,typography}.yaml
  audit-manifest.yaml
  defaults/theme.json
  identity/avatars.json
  assets/avatars/
  state/current.json
  handoffs/current.json
```

| Fuente | Decisión que posee |
|---|---|
| Instrucción actual del usuario | Intención, alcance y excepción explícita |
| Lock estructural y handoff aprobado | Anatomía, geometría, acciones, estados y adaptación |
| Contrato de componente/patrón | Semántica, API aprobada, variantes y comportamiento |
| Tokens/configuración canónica | Valores visuales y derivados autorizados |
| Perfil activo de Lima | Stack, rutas, implementación, QA y configuración |
| Registry | Identidad, ownership, reutilización, lifecycle y promoción |
| Compliance de Coco | Verificaciones realizadas, evidencia, findings y límites |
| Contrato documental | Shell neutral, orden de secciones y preview aislada |
| Código y tipos públicos | Evidencia de API e implementación real |

`state/current.json` es cache operativa, no autoridad paralela. El handoff es un índice compacto, no una copia de los manuales. Un conflicto se devuelve al dueño de la decisión; no se resuelve copiando estilos de un componente vecino.

Las rutas lógicas como `agentes/kiwi/references/geometry-contract.md` se resuelven con `.fruti/paths.yaml` a `.agents/skills/kiwi/references/geometry-contract.md`. No cambiar esos contratos para satisfacer una ruta de host.

## 4. Flujo completo y compuertas

| Paso | Dueño | Entrada | Entrega / condición de salida |
|---|---|---|---|
| 1 | Kiwi | Contexto, tarea, datos, permisos y perfil | Brief, flujo, F0–F2 neutral, geometría, matriz adaptativa y declaración |
| 2 | Usuario | Ronda estructural revisable | Aprobación de dirección/estructura cuando requerida |
| 3 | Lima | Ronda aprobada, registry y fuentes | reuse/extend/new/local, contrato sin blockers, tokens y draft |
| 4 | Coco | Lock Kiwi, contrato Lima y tokens reales | F3/CSS, estados y evidencia visual; sin redefinir estructura |
| 5 | Usuario | F3 revisable | Aprobación antes de implementación R3 según contrato |
| 6 | Bruno | Estructura, contrato y F3 aprobados | Funcionalidad, API, eventos, teclado/foco y pruebas |
| 7 | Coco | Implementación real de Bruno | R0 canónico: checks y revisión visual, compliance de la ronda |
| 8 | Lima | Compliance vigente | Gate, lifecycle y registry; sin repetir auditoría |
| 9 | Mora | Registry, contrato, código/API y QA | Hub sobre shell neutral, preview real y resultado multidimensional |

No ejecutar estos pasos dependientes en paralelo. Dar al especialista `artifact`, `round`, operación, perfil activo, lock/contrato, rutas de evidencia y delta del handoff. Esperar su entrega antes del siguiente dueño.

Mantener la estrategia de lifecycle original: draft → refine (critique/distill/adapt/polish) → Candidate Gate → candidate → revisión/solicitud de estabilización → harden → auditoría Coco → Stable Gate → aprobación → stable → promoción a producción con aprobación explícita. Aprobar una etapa no aprueba automáticamente las siguientes.

Una instrucción explícita vigente del usuario tiene la prioridad original. Registrar la aprobación o desviación concreta con su alcance; no confundir un resultado de subagente, un build exitoso o una frase de un reporte con autorización del usuario.

En rediseño: understand → inventory → scope aprobado → redesign_plan. Solo superficies approved entran al plan; excluded y preserve conservan sus límites. El producto actual demuestra función y restricciones, pero no impone la identidad visual objetivo.

Si Lima rechaza F2: devolver reglas fallidas a Kiwi; abrir nueva ronda si corresponde. Si hay un defecto funcional: devolver a Bruno. Si falta CSS/QA: Coco. Si falta contrato, tokens o clasificación: Lima. Si falta documentación verificada: Mora.

Las auditorías directas van a Coco R0. Las correcciones documentales acotadas van a Mora M0–M3 según la petición. No aplicar todo el pipeline a una pregunta conceptual o una reparación documental simple.

## 5. Calidad y evidencia

No rebajar las compuertas para compensar diferencias de host. Usar exactamente `.fruti/audit-manifest.yaml`, `.fruti/contracts` y las referencias normativas de cada operación.

| Dimensión | Evidencia exigida |
|---|---|
| Técnica | Build/typecheck/tests pertinentes; resultado y límites registrados |
| Estructural | F2 aprobado, procedencia de decisiones y geometría congelada |
| Visual | Jerarquía, agrupación, alineación, densidad, colisiones y acción dominante revisadas |
| Accesibilidad | Semántica, targets, teclado/foco, contraste, estados y movimiento reducido |
| Design system | Tokens reales, reutilización, contrato y registry consistentes |
| Documentación | Preview real/verificada, API pública real, lifecycle y QA correctos |

La aprobación global exige pasar todas las dimensiones obligatorias. Build PASS o ausencia de overflow no implica composición válida. Si falta una capacidad o evidencia, registrar NOT VERIFIED/BLOCKED/PARTIAL según corresponda; no convertirlo en PASS.

Layout modes: compact <600; medium 600–1023; expanded ≥1024. Viewports de verificación por defecto: 1440, 1024, 768 y 390. Son puntos de prueba, no thresholds de layout. Cubrir los tres modos y preservar estado/foco al recomponer.

Cada ronda es inmutable: `.fruti/tests/rNN/`. `current` apunta al último pedido; no almacena entregas de ronda. Usar stage IDs kiwi, lima, coco, bruno, lima-gate, mora. Coco produce además el compliance después de Bruno.

```text
.fruti/tests/rNN/request.md
.fruti/tests/rNN/kiwi-f2.html
.fruti/tests/rNN/kiwi-decisions.yaml
.fruti/tests/rNN/lima-contract.yaml
.fruti/tests/rNN/handoff-kiwi.json
.fruti/tests/rNN/handoff-lima.json
.fruti/tests/rNN/handoff-coco.json
.fruti/tests/rNN/handoff-bruno.json
.fruti/tests/rNN/compliance.json
.fruti/tests/rNN/handoff-lima-gate.json
.fruti/tests/rNN/handoff-mora.json
.fruti/tests/rNN/result.md
```

Los punteros `handoffs/current.json` y `reports/compliance-current.json` deben llevar `round`. No consumir un puntero de r02 como evidencia vigente de r03. Mostrar artifacts downstream faltantes como NOT GENERATED.

`design_system: NEW` exige foundations propuestas y aprobadas antes de PASS visual final. El bootstrap de configuración no genera por sí solo tokens derivados ni certifica foundations.

## 6. Crear o modificar una skill

Una skill define un procedimiento reutilizable. `SKILL.md` contiene el contrato operativo; referencias amplían reglas, scripts automatizan verificaciones y assets ofrecen plantillas. No es un proceso aislado ni una configuración de subagente.

1. Definir la tarea y los triggers con ejemplos concretos.
2. Definir dueño, entradas, salidas, compuertas, retornos y límites respecto del squad.
3. Crear `.agents/skills/<nombre>/SKILL.md` con frontmatter YAML válido.
4. Incluir solo recursos necesarios y enlazarlos por operación; no precargar todo.
5. Añadir `agents/openai.yaml` para identidad en el selector. No usar ese archivo como definición de subagente.
6. Si cambia el flujo compartido, actualizar su contrato canónico antes de adaptar consumidores. No introducir una regla en una skill que contradiga `.fruti`.
7. Ejecutar scripts realmente, probar casos de falta de evidencia/aprobación y verificar referencias.
8. Revisar el diff y guardar únicamente el alcance autorizado en la rama correspondiente.

```yaml
---
name: nombre-en-minusculas
description: "Qué resuelve y cuándo usarla; incluir límites que eviten activarla fuera de alcance."
---
```

Usar nombres de hasta 64 caracteres, letras minúsculas, números y guiones; descripción de hasta 1024 caracteres. Poner comillas si el texto tiene caracteres que cambian la sintaxis YAML, como `:` seguido de espacio.

```yaml
interface:
  display_name: "Nombre visible"
  short_description: "Procedimiento con contratos y evidencia"
  default_prompt: "Usa $nombre-en-minusculas para resolver esta solicitud."
```

La descripción decide el matching inicial. El cuerpo se lee al activar la skill. Mantener las reglas y datos del proyecto en el perfil, no incrustar su nombre, paleta, stack ni entidades en la skill.

En esta rama las siete skills heredadas se generan de `.kiro/skills`; `fruti-squad` es la entrada de coordinación propia. Para conservar paridad al modificar la fuente, ejecutar `scripts/build-codex.py` y revisar el resultado. No editar solo una copia generada y después regenerarla accidentalmente. Si se desea evolucionar Codex independientemente, declarar esa ruptura de paridad y cambiar el modelo de mantenimiento antes.

## 7. Crear o modificar un agente

Un agente es una sesión de especialista con instrucciones propias y herramientas heredadas del host. Definirlo en `.codex/agents/<nombre>.toml`:

```toml
name = "especialista"
description = "Cuándo delegar y qué responsabilidad posee."
developer_instructions = """
Leer AGENTS.md y la política compartida.
Resolver el estado, perfil, contrato y handoff de la operación.
Aplicar la skill correspondiente con lectura progresiva.
Respetar la propiedad de archivos y las aprobaciones.
Entregar evidencia, bloqueos y handoff; no inventar un PASS.
"""
```

Son obligatorios `name`, `description`, `developer_instructions`. El `name` identifica al agente; mantener el mismo nombre de archivo facilita localizarlo. Omitir modelo y esfuerzo para heredar las elecciones de la sesión, salvo una configuración expresamente decidida. Los especialistas Impeccable conservan su configuración upstream.

Para un nuevo dueño real del pipeline: actualizar responsabilidades, runtime y contratos/handoffs que correspondan, y validar toda la cadena. No crear un agente que absorba R0 de Coco, geometría de Kiwi o lifecycle de Lima por conveniencia.

## 8. Permisos y compatibilidad

No copiar claves Kiro `tools`, `resources`, `toolsSettings.subagent`, `trustedAgents`, `permissions.rules` o `welcomeMessage` dentro del TOML como si Codex las entendiera.

Los permisos efectivos dependen de Codex y del entorno. El texto del agente impone disciplina de propiedad, pero no es una barrera técnica de escritura. El flujo mantiene la intención de no hacer commit/push, no ejecutar comandos destructivos y no añadir dependencias sin autorización; no promete una ACL de comandos equivalente a Kiro.

No instalar un sandbox más amplio ni sobrescribir la configuración del usuario para hacer funcionar el squad. Si el host carece de subagentes, declarar ejecución secuencial de los mismos roles y mantener compuertas. Si carece de navegador, declarar la evidencia visual pendiente.

Los avatares SVG y su registro se conservan. `agents/openai.yaml` aporta identidad textual; esta adaptación no promete que el host renderice avatares SVG al arrancar cada subagente.

## 9. Tematización y perfiles

`init` conserva los defaults, formatos y estrategia original:

```bash
npx fruti-squad-codex init --name 'Mi proyecto' --theme starter
npx fruti-squad-codex init --name 'Mi proyecto' --theme existing --theme-source src/styles/tokens.css
npx fruti-squad-codex theme --brand '#1F1F1F' --accent '#0B63CE' --radius 6
npx fruti-squad-codex theme --font 'Instrument Sans' --font-size 16 --type-scale 1.25
npx fruti-squad-codex theme --space 4 --shape rounded --dark
npx fruti-squad-codex theme --show
```

Starter escribe `.fruti/theme/config.json` y un perfil local en `.agents/skills/lima/profiles/<slug>.md`. Existing enlaza el sistema existente. Los campos AUTO se resuelven mediante el contrato de implementation-target, se persisten y no se preguntan repetidamente.

Cambiar la entrada propietaria, regenerar derivados mediante las capacidades reales del proyecto y auditar el delta. La CLI del paquete modifica configuración; no incluye un generador OKLCH de tokens ni CSS. No editar outputs derivados como una segunda fuente visual.

Hay dos rutas de bootstrap heredadas: CLI npm `init` y `bash .agents/skills/lima/scripts/init-project.sh` con intake. La segunda puede crear un harness Playwright; ambas necesitan confirmar/resolver el perfil y conservar una sola referencia activa desde el estado. No confundir configuración propuesta con aprobación de diseño.

## 10. Validación y mantenimiento

En el checkout del paquete:

```bash
npm test
python3 -m pip install PyYAML
python3 scripts/validate-codex.py
npm pack
```

Para reconstruir la adaptación:

```bash
python3 scripts/build-codex.py
python3 scripts/validate-codex.py
```

Revisar el diff: el generador normaliza únicamente el adaptador declarado; la comparación contra el commit original detecta cualquier cambio de los contratos o fuentes Kiro. Si se cambia deliberadamente la línea base, actualizar commit, manifiesto y documentación con una justificación verificable.

Prueba de aceptación práctica: instalar el tarball en un proyecto vacío; verificar discovery, configurar perfil, ejecutar una interfaz representativa con estados reales y capturas por modo, registrar aprobaciones y recorrer todos los dueños. Comparar el resultado con los mismos contratos y dimensiones que Kiro. No cerrar una prueba solo por tener un tarball instalable.

Para actualizar un consumidor, repetir la instalación de la rama y reconciliar conflictos. `--force` sobrescribe los archivos distribuidos, incluyendo estado/handoff iniciales; revisar el dry-run y respaldar personalizaciones antes de elegirlo. No usarlo como reparación automática de un proyecto activo.

## 11. Fuentes y límites

La guía original completa se conserva en `docs/kiro-guia-original.md` como referencia histórica; no usar sus rutas Kiro para ejecutar Codex.

Fuentes consultadas:

- [Repositorio Kiro original, commit de referencia](https://github.com/kevinedgm/fruti-squad-kiro/tree/47141906fd0731ac3a8b3d25bd56678d2488d81b).
- [OpenAI: Build skills](https://learn.chatgpt.com/docs/build-skills): formato, carga progresiva, `.agents/skills`, invocación y metadatos.
- [OpenAI: Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents): `.codex/agents/*.toml`, campos requeridos, herencia, permisos y orchestration.
- [Agent Skills specification](https://agentskills.io/specification): estándar de estructura y frontmatter.

Límites heredados preservados y declarados:

- `fruti test` y `fruti foundations` aparecen en la política como procedimientos, pero no son verbos implementados de `bin/fruti-squad-codex.js` ni del bin Kiro original. Seguir los procedimientos con evidencia; no afirmar que existe una CLI adicional.
- El launcher Impeccable puede resolver un binario externo; no hay binario de plataforma incluido en esta línea base. Su propio SKILL.md define el fallback si el launcher falla. No certificar checks que no corrieron.
- La prosa heredada contiene atribuciones antiguas de R3 a Coco y pautas previas del shell documental. El runtime, la política y los contratos compartidos ya establecen Bruno como dueño funcional y shell neutral; el adaptador mantiene esa interpretación original explícita.
- Las pruebas estáticas y de instalación no ejecutan Codex CLI real ni prueban calidad visual de una aplicación. Mantener separadas compatibilidad de formato, integridad del flujo y aceptación de una entrega UI.
