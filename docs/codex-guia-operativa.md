# Codex · Guía operativa para crear agentes y skills

Adaptación de Fruti Squad for Kiro en la rama `codex`, basada en el commit `47141906fd0731ac3a8b3d25bd56678d2488d81b`. Configuración contrastada con la CLI del paquete 0.3.18: 9 de octubre de 2026. Las fuentes de compatibilidad del host conservan las fechas y límites de sus auditorías.

## Contenido

1. Objetivo y equivalencia
2. Instalación y primer uso
3. Arquitectura y contratos
4. Flujo completo y compuertas
5. Calidad y evidencia
6. Crear o modificar una skill
7. Crear o modificar un agente
8. Permisos y compatibilidad
9. Configuración: perfil, tema, componentes, framework, estilos y QA
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

La normalización de frontmatter deja `name` y `description` válidos. Lima tenía una descripción larga con un `:` sin comillas que invalidaba su YAML; la versión Codex usa una descripción corta válida y conserva el protocolo con las correcciones explícitas de propiedad y rutas registradas en `scripts/codex-corrections.json`. Los helpers TOML de Impeccable también se exponen en `.codex/agents`.

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

El instalador no escribe `.codex/config.toml` ni concede permisos, herramientas o subagentes. Consulta [la auditoría de agentes](codex-agents-audit.md) y la documentación del cliente instalado antes de modificar su configuración; no copies un campo de agente TOML al esquema de configuración general.

### Elegir el tipo de proyecto antes de inicializar

| Situación | Operación | Resultado |
| --- | --- | --- |
| Proyecto nuevo o tema derivado propio | `init --theme starter` | Perfil, entrada corta del tema y tokens/CSS derivados |
| Proyecto con tema ya vigente | `init --theme existing --theme-source <archivo>` | Perfil enlazado a esa fuente; no reemplaza ni genera tema starter |
| Fruti ya inicializado | `project` y/o `theme`, según el ajuste | Cambia configuración puntual sin reinicializar el perfil |
| Actualizar herramientas Fruti | Instalar dependencia y ejecutar `install --update-tools` | Actualiza herramientas distribuidas con backups y conserva datos del proyecto |

La sección [9](#9-configuración-perfil-tema-componentes-framework-estilos-y-qa) contiene ejemplos completos. No uses `init --force` para actualizar una dependencia.

### Plugin local opcional y copias duplicadas

La dependencia npm instala las herramientas y skills del proyecto. El plugin añade su distribución a la interfaz del cliente; no sustituye `.fruti`, el perfil ni los agentes del consumidor.

Si quieres registrar el plugin por primera vez:

```bash
npx fruti-squad-codex plugin --dry-run
npx fruti-squad-codex plugin
```

Ejecuta desde el consumidor donde está `node_modules/fruti-squad-codex`. Después instala/habilita Fruti Squad en el marketplace mostrado en Plugins. El comando registra una fuente, no instala ni recarga automáticamente la copia de caché del cliente. Si el plugin ya está registrado y su ruta no cambia, no necesitas registrar otra vez para usar una CLI nueva. Para cargar skills nuevas desde el plugin, actualiza o recarga esa instalación mediante la interfaz disponible y comprueba el origen/version.

Las skills de proyecto y plugin pueden aparecer simultáneamente. No invoques una entrada ambigua por su nombre: selecciona el origen o comprueba su ruta desde el catálogo del cliente. Registrar otra vez no elimina duplicados. Este paquete aún no ofrece un modo de instalación que desactive automáticamente las skills de repositorio al habilitar el plugin. No borres copias personales ni cachés globales para actualizarlo.

Los iconos de skills y plugins dependen de la superficie compatible. `agents/openai.yaml` no configura avatares de subagentes. Véase [registro local](codex-local-plugin.md) y [auditoría de iconos](codex-icons-audit.md). Actualizar una CLI de tema no requiere reinstalar el plugin.

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

### 4.1 Elegir por la invocación

Lee [.codex/qa/execution-modes.md](../.codex/qa/execution-modes.md) antes de seleccionar fases:

- **Fruti Squad para diseño/rediseño:** encargo completo de la pieza solicitada, con coordinación y devoluciones entre especialistas. No amplía una sección a toda la página ni cierra en candidate.
- **Especialista directo:** ejecuta su función independiente. No exige la historia completa del squad para auditar, documentar o reparar un defecto delimitado de una pieza existente.
- **Delegación del orquestador:** conserva la cadena del encargo vigente; no la confunde con una nueva petición directa.

Ejemplos:

```text
Lima, audita la arquitectura y el contrato de NsaEncabezado.vue. Primero dime
hallazgos, evidencia y propuesta de corrección; no cambies archivos todavía.

Coco, audita su CSS y responsive. Primero presenta los problemas y las
correcciones que puedes aplicar. Después de mi aprobación, corrige ese CSS.

Bruno, corrige el evento duplicado de este componente existente, conservando
API, geometría y estilos. Te autorizo esa reparación funcional.

Kiwi, revisa la estructura de este wireframe y propone cómo simplificarla.

Mora, documenta la API real de NsaEncabezado.vue en el Hub. No crees un preview
nuevo y declara cualquier metadata de lifecycle o QA que no esté verificada.
```

En una revisión directa, el especialista inspecciona e informa antes de escribir. Si ya pediste «audita y corrige», «documenta» o aprobaste cambios concretos, comunica el delta y actúa sin pedir de nuevo. Conserva sus límites: Lima modifica gobierno/contratos/tokens autorizados, Coco CSS, Bruno funcionalidad, Kiwi artefactos de estructura y Mora documentación. Los hallazgos ajenos se explican y se derivan cuando realmente haga falta, sin activar el pipeline entero ni ampliar permisos.

Una auditoría arquitectónica Lima no equivale a compliance Coco, pero es un trabajo válido por sí mismo. Una página Mora puede documentar código real sin ronda Kiwi ni registry/compliance inventados: deja lifecycle/QA ausentes como no verificados. Una UI nueva o certificada conserva sus comprobaciones y revisión del gate; stable/promoción mantienen sus aprobaciones.

Validación de esta distinción: [pruebas directas por rol y límites](codex-direct-mode-validation.md).

### 4.2 Cadena del encargo completo

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
| 9 | Usuario / Mora autorizada | Implementación revisada; registry, contrato, código/API y QA | Observaciones o decisión documental; si procede, Hub neutral y preview real |

Lee [orchestration](../.codex/qa/orchestration.md) al iniciar el encargo y tras cada handoff. El especialista completa su etapa; el orquestador continúa el objetivo. Candidate no detiene harden, auditoría y demo ya autorizados. Kiwi genera tres alternativas realmente distintas y nuevas rondas ante rechazo. Un pedido de una pieza no autoriza rediseñar toda la página. La documentación formal Mora es opcional si no se solicitó, conservando registros internos y las exigencias documentales del contrato. El procedimiento completo `fruti test` mantiene sus requisitos propios, incluida página Mora; no certificarlo a partir de un encargo de implementación sin esa documentación.

No ejecutar estos pasos dependientes en paralelo. Dar al especialista `artifact`, `round`, operación, perfil activo, lock/contrato, rutas de evidencia y delta del handoff. Esperar su entrega antes del siguiente dueño.

Mantener la estrategia de lifecycle original: draft → refine (critique/distill/adapt/polish) → Candidate Gate → candidate → dirección aceptada y estabilización solicitada o incluida en el encargo completo → harden → auditoría Coco → Stable Gate → aprobación → stable → promoción a producción con aprobación explícita. Aprobar una etapa no aprueba automáticamente las siguientes.

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

`design_system: NEW` exige foundations propuestas y aprobadas antes de PASS visual final. Desde 0.3.15, `init --theme starter` genera tokens y CSS validados. Esa generación no certifica foundations, composición, imports del producto ni una entrega visual.

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

En esta rama las siete skills heredadas se generan de `.kiro/skills`; `fruti-squad` es la entrada de coordinación propia. Para conservar paridad al modificar la fuente, ejecutar `scripts/build-codex.py` y revisar el resultado. No editar solo una copia generada y después regenerarla accidentalmente. Las correcciones de contradicciones heredadas se declaran con texto anterior/nuevo en `scripts/codex-corrections.json`; el generador exige que el texto de origen exista y el validador compara la transformación completa. La política, runtimes y contratos compartidos permanecen iguales al commit de origen.

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

Son obligatorios `name`, `description`, `developer_instructions`. El `name` identifica al agente; mantener el mismo nombre de archivo facilita localizarlo. Omitir modelo y esfuerzo para heredar las elecciones de la sesión, salvo una configuración expresamente decidida. La versión 0.3.9 declara recursos por actividad: Kiwi/Lima y finish reviewer Sol high; Coco/Bruno, coordinador, asset producer y documenter Sol medium; Mora y manual edit applier Luna low. No declara sandbox, red ni MCP. Un agente personalizado puede prevalecer sobre spawn; omitir campos conviene cuando el default compartido ya es adecuado. Aquí no hay config compartida del paquete y los roles mezclan actividades distintas: se usan defaults específicos sin escribir la configuración general del consumidor. Una skill directa hereda la sesión. Consulta [model-routing](../.codex/qa/model-routing.md) antes de cambiar recursos y [auditoría de modelos](codex-models-audit.md) para evaluación y disponibilidad pendiente.

Consulta la [auditoría de agentes](codex-agents-audit.md) para la versión comprobada, el esquema fechado y sus límites. El esquema de configuración general no incluye por sí solo la identidad de un agente independiente. No colocar `nickname_candidates` en la raíz del agente: el esquema consultado lo define en `[agents.<rol>]`. Una configuración antigua mediante `config_file` no exige migración si sigue siendo compatible.

Para un nuevo dueño real del pipeline: actualizar responsabilidades, runtime y contratos/handoffs que correspondan, y validar toda la cadena. No crear un agente que absorba R0 de Coco, geometría de Kiwi o lifecycle de Lima por conveniencia.

## 8. Permisos y compatibilidad

No copiar claves Kiro `tools`, `resources`, `toolsSettings.subagent`, `trustedAgents`, `permissions.rules` o `welcomeMessage` dentro del TOML como si Codex las entendiera.

Los permisos efectivos dependen de Codex y del entorno. El texto del agente impone disciplina de propiedad, pero no es una barrera técnica de escritura. El flujo mantiene la intención de no hacer commit/push, no ejecutar comandos destructivos y no añadir dependencias sin autorización; no promete una ACL de comandos equivalente a Kiro.

No instalar un sandbox más amplio ni sobrescribir la configuración del usuario para hacer funcionar el squad. Si el host carece de subagentes, declarar ejecución secuencial de los mismos roles y mantener compuertas. Si carece de navegador, declarar la evidencia visual pendiente.

Los avatares SVG y su registro se conservan. `agents/openai.yaml` conecta `icon_small`, `icon_large` y `brand_color` con copias portables de los tiles canónicos dentro de cada skill. `.codex/qa/identity.md` define avisos por rol y el fallback textual. Los metadatos de las skills y los eventos nativos de subagentes son superficies distintas; esta adaptación no personaliza estos últimos ni inserta imágenes para simularlos. Consulta la [auditoría de iconos](codex-icons-audit.md) para sincronización, rutas y verificación manual.

## 9. Configuración: perfil, tema, componentes, framework, estilos y QA

Ejecuta los comandos desde la raíz del proyecto consumidor. Todas las rutas de configuración siguientes son relativas a esa raíz. `--target <carpeta>` permite dirigir un comando a otro proyecto; comprueba el destino antes de escribir.

### 9.1 Qué se configura y dónde vive

| Archivo | Qué contiene | Cómo cambiarlo | Comprobación |
| --- | --- | --- | --- |
| `.agents/skills/lima/profiles/<slug>.md` | Tema activo, Hub, registry, implementación y QA | `init` en primer uso; después, reconciliar campos concretos con Lima | Leer la ruta `profile_path` del estado y ese perfil |
| `.fruti/state/current.json` | Puntero al perfil y ronda vigente | Lo mantiene el flujo; no sustituye las decisiones del perfil | Verificar que las rutas existen y la ronda coincide |
| `.fruti/project.json` | Framework declarado, raíces de componentes y prefijo propio | `project`; admite las mismas opciones en primer `init` | `project --show` |
| `.fruti/theme/config.json` | Inputs cortos del tema starter | `theme` o edición del JSON seguida de `theme` | `theme --show` |
| `.fruti/theme/tokens.css` | Variables CSS derivadas | Regenerar con `theme`; no editar a mano | Salida `generated`, contenido y uso real en la aplicación |
| `.fruti/theme/tokens.json` | Tokens documentados con valores, procedencia y contrastes | Regenerar con `theme`; no editar a mano | JSON legible y coherente con CSS/configuración |
| Fuente indicada por `theming.source` en modo existing | Tema propio ya vigente | Herramientas de ese proyecto | Compilación/generación propia y auditoría del delta |
| `.agents/plugins/marketplace.json` | Registro de la fuente del plugin | `plugin` | Registro resoluble; instalación efectiva se comprueba aparte en el cliente |

No confundas `.fruti/theme/tokens.json` generado con un `.fruti/tokens.json` canónico que pueda tener el consumidor. La CLI de tema no modifica este último, CSS ajeno ni imports de producción.

### 9.2 Primer uso con tema derivado

Ejemplo para un proyecto Vue 3 que ya tiene componentes bajo `grana-ui/src/components`:

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex init \
  --name 'Mi proyecto' \
  --theme starter \
  --brand '#052a76' \
  --accent '#c2d225' \
  --font "'Poppins', 'Inter', system-ui, sans-serif" \
  --framework vue3 \
  --components grana-ui/src/components \
  --css-prefix nsa-ui
```

Sustituye framework y carpeta por los reales. `--components` requiere una carpeta existente dentro del proyecto; no la crea. Si todavía no tienes componentes, omite esa opción. `--framework` declara el stack, no instala Vue ni migra código. Se contrasta con dependencias y entradas reales antes de diseñar.

El primer `init` crea entrada de tema, tokens/CSS, perfil, carpetas Hub y registry, y activa ese perfil en el estado. Los valores no indicados heredan `.fruti/defaults/theme.json`. Repetir `init` sin `--force` conserva tema y perfil existentes, aunque regenera el tema starter retenido y actualiza punteros del estado; no uses ese comportamiento para cambiar de proyecto o reemplazar un perfil. Usa los comandos puntuales siguientes.

### 9.3 Primer uso con tema existente

```bash
npx fruti-squad-codex init \
  --name 'Mi proyecto' \
  --theme existing \
  --theme-source src/styles/tokens.css \
  --framework vue3 \
  --components src/components \
  --css-prefix nsa-ui
```

Comprueba antes que `--theme-source` sea la fuente real y exista: la CLI enlaza esa ruta explícita, no valida el contenido de una fuente ajena. Sin `--theme-source`, busca candidatos conocidos; revisa lo elegido. Este modo no genera ni sustituye tokens starter. `theme` rechaza regenerar cuando el perfil activo declara existing, incluso si quedó un `config.json` starter antiguo.

No combines `--theme existing` con flags de colores esperando que cambien la fuente externa: usa su configuración y generador reales. Bootstrap/Vuetify/Grana instalados se inspeccionan en su versión real; Fruti no los instala ni cambia su tema por declararlos.

### 9.4 Cambiar colores o fuentes de un tema starter

```bash
npx fruti-squad-codex theme \
  --brand '#052a76' \
  --accent '#c2d225' \
  --font "'Poppins', 'Inter', system-ui, sans-serif"
```

Solo cambian los inputs indicados. Se conservan los restantes, se ejecuta el motor OKLCH de Grana incluido en el paquete y se regeneran ambos outputs si la validación pasa. Los avisos se muestran; no equivalen a aprobación visual. Un fallo de validación no sobrescribe los archivos previos. No hace falta instalar otra CLI ni acceder a red para generar.

Si editas `.fruti/theme/config.json` manualmente, ejecuta:

```bash
npx fruti-squad-codex theme
```

No hay watcher automático. `theme --show` solo lee y no regenera. `theme --reset` restaura todos los defaults del tema conservando el nombre; no lo uses si quieres conservar tu marca. No combines `--reset` con flags esperando conservarlos: el reset toma los defaults.

La cadena de fuentes admite una familia o un stack CSS entre comillas. La CLI no descarga fuentes. La aplicación debe cargarlas y utilizar las variables generadas.

### 9.5 Opciones completas de tema

Estas opciones se aceptan en `theme` y en el primer `init --theme starter`. Los límites numéricos validan inputs; el motor además puede rechazar un tema que no cumpla las comprobaciones de contraste/tipografía.

| Flag | Campo JSON | Valores / default |
| --- | --- | --- |
| `--brand` | `brand` | HEX `#RGB`/`#RRGGBB`; `#1F1F1F` |
| `--accent` | `accent` | HEX; `#0B63CE` |
| `--primary` | `primary` | HEX opcional; sin valor explícito, alias de brand |
| `--radius` | `radius` | 0–64 px; 6 |
| `--shape` | `shape` | `rounded` / `pill`; rounded |
| `--space` | `space` | 1–16 px de base; 4 |
| `--font` | `font` | Familia o stack; Instrument Sans |
| `--font-display` | `fontDisplay` | Opcional; sin valor explícito, alias de font |
| `--font-size` | `fontSize` | 8–32 px de base; 16 |
| `--type-scale` | `typeScale` | 1–2; 1.25 |
| `--neutrals` | `neutrals` | `tinted` / `pure`; tinted |
| `--neutrals-hue` | `neutralsHue` | `brand` / `accent`; brand |
| `--semantic-collision` | `semanticCollision` | `warn` / `adjust`; warn |
| `--categories` | `categories` | Entero 0–12; 0 |
| `--dark` / `--no-dark` | `dark` | Activa/desactiva derivados oscuros; true |

El contrato también admite `overrides` y un objeto `dark` explícito en el JSON. No son flags de CLI: consulta `.fruti/contracts/theming.yaml` y la validación del motor antes de editarlos. Si primary/fontDisplay ya están definidos explícitamente, cambiar brand/font no los elimina ni vuelve a convertirlos en aliases.

Ejemplos de ajustes independientes:

```bash
npx fruti-squad-codex theme --radius 8 --shape rounded --space 4
npx fruti-squad-codex theme --font-size 16 --type-scale 1.25
npx fruti-squad-codex theme --neutrals tinted --neutrals-hue brand
npx fruti-squad-codex theme --semantic-collision adjust --categories 4
npx fruti-squad-codex theme --dark
```

### 9.6 Aplicar el CSS a la aplicación

El output usa variables `--g-*`, por ejemplo `--g-color-brand` y `--g-font-ui`. Es un tema que se aplica después de los tokens base de Grana. Usa el import/punto de entrada de Grana que ya funciona en tu proyecto y después importa `.fruti/theme/tokens.css` desde tu entrada de estilos. La ruta relativa depende de la ubicación del archivo que importa; no hay un import universal para todas las apps.

En Vue/Vite, revisa la entrada real (`main.ts`, `main.js` o su hoja de estilos) antes de agregar el import. Fruti no lo agrega automáticamente. Comprueba en navegador una pieza que consuma `--g-*`, el valor computado y que las fuentes carguen. Si la aplicación usa otros tokens, su integración requiere un mapeo aprobado por Lima; no sustituyas variables globales de Bootstrap/Vuetify para forzar el tema.

### 9.7 Configurar o cambiar la base de componentes

En un proyecto ya inicializado:

```bash
npx fruti-squad-codex project \
  --framework vue3 \
  --components grana-ui/src/components \
  --css-prefix nsa-ui
```

El resultado se guarda en `.fruti/project.json`:

```json
{
  "framework": "vue3",
  "component_roots": ["grana-ui/src/components"],
  "css_prefix": "nsa-ui"
}
```

| Opción | Qué cambia | Regla |
| --- | --- | --- |
| `--framework` | Stack/version declarado | Texto como `vue3` o `vue2`; se contrasta con código/dependencias |
| `--components` | Lista de raíces para investigar reutilización | Repetible; cada carpeta debe existir dentro del proyecto |
| `--css-prefix` | Namespace de estilos nuevos propios | Minúsculas, números y guiones; comienza con letra |
| `--show` | Nada | Muestra configuración actual; `{}` indica que aún no hay decisiones declaradas |

Los campos omitidos se conservan. Proporcionar `--components` reemplaza la lista completa; no agrega silenciosamente una raíz a las anteriores:

```bash
npx fruti-squad-codex project \
  --components grana-ui/src/components \
  --components src/components
```

Se normalizan rutas y rechazan rutas/symlinks que salgan del proyecto. Para una biblioteca npm, el squad inspecciona la dependencia instalada y sus exports; no es obligatorio apuntar a `node_modules` ni modificarla.

Este comando no sobrescribe perfil, tema, estado ni componentes. Los campos declarados complementan el perfil; donde no hay configuración, el flujo usa el perfil vigente y detección AUTO. Si el framework declarado contradice el instalado, Lima debe reconciliarlo antes de implementar, sin migrar por su cuenta.

### 9.8 Reutilización y estilos sin colisiones

Antes de diseñar un botón, campo, diálogo o breadcrumbs, Kiwi investiga las piezas disponibles. Lima decide reutilizar/componer/extender o crear y registra API, fuente y justificación. Coco aplica F3; Bruno integra funcionalidad. El handoff incluye la tabla de reutilización, no solo el nombre de la biblioteca.

Con prefijo `nsa-ui`, los estilos nuevos pueden usar:

```css
.nsa-ui-stat-filter { /* raíz propia */ }
.nsa-ui-stat-filter__title { /* elemento */ }
.nsa-ui-stat-filter--compact { /* variante */ }
```

No se renombra la API/clases existentes del componente rediseñado por configurar ese prefijo. Se rechazan prefijos reservados como `g`, `grana`, `v`, `vuetify`, `bs`, `bootstrap`, `btn`, `row`, `col` y `container`, y variantes con guion. Coco además comprueba usos existentes, scope, overlays y coexistencia real; la validación del prefijo no garantiza aislamiento.

Evita clases genéricas y sobrescrituras globales. `<style scoped>` ayuda en Vue, pero no resuelve automáticamente portales/teleports, herencia o tokens. El procedimiento y responsabilidades están en `.codex/qa/project-components.md`.

### 9.9 Hub, QA y perfil activo

En el primer `init`, usa `--hub <carpeta>` (default `design-hub`), `--design-system <nombre>` (default nombre de proyecto), `--qa none|playwright` (default none). El perfil incluye viewports 1440, 1024, 768 y 390 y objetivo WCAG 2.2 AA.

`--qa playwright` crea carpetas QA y declara el runner; no instala Playwright ni ejecuta pruebas. `--qa none` no anula la obligación de navegador del gate UI: el flujo debe resolver capacidades reales y declarar bloqueos cuando corresponda.

Para cambiar Hub, implementación o QA de un perfil activo, pide a Lima actualizar campos concretos y reconciliar rutas/registry/estado existentes. La CLI `project` solo modifica framework, raíces y namespace; no ofrece flags para todos los campos del perfil. No reinicialices con `--force` para conseguir una edición puntual.

Hay un bootstrap heredado alternativo, `bash .agents/skills/lima/scripts/init-project.sh` con intake, que puede crear un harness. No ejecutes ambos bootstraps como si sus efectos fueran equivalentes: elige una ruta y conserva un único perfil activo.

### 9.10 Comprobar configuración y primer encargo

```bash
node -p "require('./node_modules/fruti-squad-codex/package.json').version"
npx fruti-squad-codex project --show
npx fruti-squad-codex theme --show
```

Usa `theme --show` solo cuando existe configuración starter; en existing inspecciona el perfil y su fuente. La versión de node_modules comprueba el paquete, no la copia de skills ni el plugin que carga la sesión.

Para verificar herramientas instaladas:

```bash
npx fruti-squad-codex install --update-tools --dry-run
```

Cero cambios de herramientas pendientes indica coincidencia con el paquete en esas rutas. Los conflictos restantes de AGENTS/perfiles/documentación pueden ser adaptaciones locales: revísalos, no uses force para ocultarlos. Comprueba además la ruta de la skill seleccionada y recarga su sesión cuando el cliente lo requiera; una comparación de archivos no prueba carga efectiva.

Pedido de prueba después de configurar:

```text
Usa $fruti-squad para rediseñar grana-ui/src/components/NsaEncabezado/NsaEncabezado.vue.
Lee el perfil activo y .fruti/project.json. Comprueba el framework y los componentes
existentes antes de proponer controles, conserva API y funcionalidad y aplica la
nomenclatura propia de estilos. Ejecuta el flujo completo y presenta las alternativas
revisadas para elegir, con evidencia real y lo pendiente identificado.
```

Al revisar la entrega, busca la tabla de reutilización con APIs/rutas reales, el namespace usado y pruebas de coexistencia. No confundas configuración válida, build, auditoría visual ni una ronda completa ejecutada.

### 9.11 Resolver problemas frecuentes

| Síntoma | Comprobación | Acción |
| --- | --- | --- |
| Cambió config.json pero CSS quedó igual | ¿Ejecutaste theme? ¿La versión es ≥0.3.15? | Actualiza el paquete y ejecuta `theme`; no hay watcher |
| Se generó CSS pero la pantalla no cambió | Import, orden de hojas, variables computadas y fuentes | Integra el output después de defaults y prueba el consumidor real |
| `Component directory not found` | Ruta desde raíz/destino del comando | Corrige la carpeta; no declares una raíz inexistente |
| `symlink leaves the project` | Destino real del enlace | Usa fuente dentro del proyecto o inspecciona la dependencia instalada |
| Prefijo rechazado | Formato y nombres reservados | Elige uno propio y comprueba colisiones locales |
| Theme rechaza modo starter | Perfil activo: theming.mode | Conserva existing y su generador, o reconcilia un cambio de modo con Lima |
| Dos entradas Fruti | Origen/rutas: proyecto, personal o plugin | Selecciona la fuente concreta; repetir registro no elimina duplicados |
| Plugin muestra versión anterior | Versión instalada en la interfaz, no solo npm | Actualiza/recarga la copia del plugin; no borres cachés globales |
| Icono del subagente no coincide | Superficie del host | No se controla desde openai.yaml; no altera la ejecución del rol |
| QA no puede ejecutarse | Herramienta, error e intentos reales | Aplica recuperación de pre-delivery; declara lo no verificado |

## 10. Validación y mantenimiento

En el checkout del paquete:

```bash
npm test
python3 -m pip install PyYAML 'jsonschema>=4,<5'
python3 scripts/validate-codex.py
python3 scripts/validate-codex-toml.py
python3 -m unittest discover -s test -p 'codex_toml_test.py'
npm pack
```

Para reconstruir la adaptación:

```bash
python3 scripts/build-codex.py
python3 scripts/validate-codex.py
```

Revisar el diff: el generador normaliza únicamente el adaptador declarado; la comparación contra el commit original detecta cualquier cambio de los contratos o fuentes Kiro. Si se cambia deliberadamente la línea base, actualizar commit, manifiesto y documentación con una justificación verificable.

Prueba de aceptación práctica: instalar el tarball en un proyecto vacío; verificar discovery, configurar perfil, ejecutar una interfaz representativa con estados reales y capturas por modo, registrar aprobaciones y recorrer todos los dueños. Comparar el resultado con los mismos contratos y dimensiones que Kiro. No cerrar una prueba solo por tener un tarball instalable.

### Actualizar un consumidor sin reinicializar

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex install --update-tools --dry-run
npx fruti-squad-codex install --update-tools
node -p "require('./node_modules/fruti-squad-codex/package.json').version"
```

`--update-tools` actualiza skills, agentes y protocolos QA distribuidos con backups en `.fruti/backups/codex-tools`. Conserva perfiles, tema, estado, handoffs y fuentes del consumidor. AGENTS y documentación existentes distintos siguen como conflictos; reconcilia instrucciones locales y consulta la guía vigente del paquete en `node_modules/fruti-squad-codex/docs/codex-guia-operativa.md` o en GitHub. No sobrescribas evidencia documental antigua como si correspondiera a la versión nueva.

Si ya tienes tema starter y solo necesitas regenerar sus outputs, ejecuta después `npx fruti-squad-codex theme`. Para cambiar raíces/framework/prefijo, usa `project`. No ejecutes init de nuevo para aplicar una revisión del paquete. `--force` reemplaza archivos distribuidos, incluidos estado/handoff iniciales; no lo uses como actualización automática de un proyecto activo.

Para sincronizar solo los metadatos e imágenes de skills:

```bash
npx fruti-squad-codex install --update-icons --dry-run
npx fruti-squad-codex install --update-icons
```

Esto preserva procedimientos y modelos, pero no demuestra que el cliente haya recargado o mostrado los iconos. El plugin se actualiza aparte en su interfaz cuando necesitas skills nuevas de ese origen; no es necesario para ejecutar los comandos de configuración del paquete.

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

## Compuerta operativa antes de presentar propuestas

La revisión interna se aplica incluso a invocaciones de una skill sin coordinador. Leer `.codex/qa/pre-delivery.md` al preparar una entrega. Kiwi produce F2, Lima revisa el borrador y devuelve defectos a Kiwi antes de solicitar la aprobación estructural; esta revisión no reemplaza el contrato final ni la aprobación. Para F3, Lima/Impeccable revisan y Coco corrige. Para R3, Coco R0 devuelve defectos al dueño y Lima decide el gate con evidencia vigente.

El recolector de navegador produce evidencia sin firmarla. Un revisor debe inspeccionar las capturas y traces y repetir la tarea por espacio y teclado. El gate verifica identidad, hashes, matriz y cierre de hallazgos; no puede garantizar por código la honestidad del modelo. Las capturas con contenido recortado, casos faltantes o evidencia obsoleta bloquean la presentación certificada. El ciclo no requiere que el usuario redacte un prompt de QA.

Las herramientas son recursos Codex adicionales; los 33 archivos compartidos de Kiro conservan su contenido original. Las inserciones en SKILL/referencias se registran como transformaciones explícitas y se conservan al regenerar.

Actualizar herramientas existentes con `install --update-tools`; las copias reemplazadas se respaldan y los datos/perfiles del proyecto se preservan. No ejecutar `init` de nuevo para aplicar una revisión del paquete.

## Recuperación y estados de cierre (0.3.3)

No finalizar por «revisión solicitada», «corrección aplicada» o «evidencia pendiente» si aún queda una acción interna viable. Esperar el resultado del especialista y continuar. El contrato `.codex/qa/pre-delivery.md` detalla diagnóstico y recuperación de navegador, uso permitido de herramientas existentes y los campos de `blocker.json` cuando el entorno impide continuar. Si la evidencia ya está capturada, el revisor puede inspeccionarla sin duplicar la infraestructura.

Antes de solicitar aprobación, actualizar declaración y hallazgos con la revisión/evidencia vigentes. Una entrega BLOCKED informa el requisito concreto que falta; no pide elegir alternativas no aprobadas internamente. No se promete ejecución en segundo plano ni se fabrican herramientas o verificaciones.
