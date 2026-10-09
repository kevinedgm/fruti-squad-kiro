---
name: impeccable
description: Aplica playbooks de crítica, auditoría y refinamiento visual. Usar desde
  Lima en revisión o desde el dueño autorizado para mejoras de UI. No concede permisos
  sobre estructura, tokens o funcionalidad ajenos; para roadmap de motion usa improve-animations.
metadata:
  version: 4.3.1
---

# Impeccable · playbooks de calidad visual

## Objetivo, activación y límites

Activa esta skill para crítica, auditoría o refinamiento visual explícito, o cuando Lima/Coco necesiten uno de los playbooks de la tabla. Para auditar motion sin implementar, usa `improve-animations`. No sustituye el gobierno de Lima, estructura Kiwi, CSS Coco, funcionalidad Bruno ni documentación Mora.

Recibe pieza/ronda, objetivo, modo de superficie, fuentes y contratos vigentes. Produce hallazgos verificables en modo revisión, o cambios del dueño autorizado con evidencia y handoff. El uso de un playbook no otorga permiso de escritura sobre otro rol.

## Entradas y preparación

1. Lee `AGENTS.md`, `.fruti/policy.md` y `.codex/qa/pre-delivery.md` desde la raíz del consumidor. Comprueba lock, estado y contrato de la pieza antes de interpretar PRODUCT.md, DESIGN.md, comps o código como contexto. Si falta una decisión obligatoria, registra el faltante; no crea una norma sustituta.
2. Selecciona revisión o edición del dueño. Bajo Lima, critique/distill/adapt/polish/harden producen hallazgos; Coco aplica CSS, Kiwi decide estructura y Bruno funcionalidad. Las auditorías no aplican correcciones de producto por sí solas.
3. Resuelve el directorio de esta skill. Inspecciona `scripts/impeccable` o `scripts/impeccable.cmd` antes de ejecutar: el launcher puede descargar el engine si falta. Solo úsalo con un engine existente permitido o instalación ya autorizada; no descarga ni instala como efecto implícito de una tarea UI.
4. Si el launcher puede ejecutarse sin ampliar autorización, corre `<skill-base-dir>/scripts/impeccable context` una vez por sesión, con cwd en el proyecto y `--target` real cuando aplique. Si falta o falla, comunica que context no se ejecutó y lee directamente los documentos existentes; no inventes contenido ni bloquees por la mera ausencia del launcher.
5. Carga solo el playbook de la operación de la tabla. Para superficie nueva o mundo visual de reemplazo autorizado, lee [reference/new-work.md](reference/new-work.md). Antes de edición UI, lee [reference/craft-floor.md](reference/craft-floor.md); no es necesario para un informe sin cambios.

## Procedimiento y decisiones

1. Inspecciona la pieza y el problema concreto. Refinamiento conserva identidad, función, copy y alcance; rediseño conserva verdad de producto y contratos, y devuelve cambios estructurales a Kiwi antes de implementarlos. No sustituye DESIGN.md ni el tema aprobado solo porque se invocó esta skill.
2. Registra la hipótesis o el hallazgo con fuente y propietario. Conserva instrucciones explícitas y decisiones aprobadas; identifica recomendaciones del playbook separadas de requisitos canónicos.
3. Ejecuta los checks pertinentes y registra su procedencia: `executed`, `degraded`, `manual-playbook` o `not-run` según [../lima/reference/registry.md](../lima/reference/registry.md). Leer/aplicar manualmente criterios no equivale a ejecutar CLI, subagentes o navegador.
4. Agrupa observaciones y reparaciones para evitar pulido sin objetivo. El consejo de dos pasadas limita polish discrecional, nunca reparaciones materiales ni el gate. Usa recuperación/agotamiento del protocolo compartido; no termina con fallos conocidos reparables.
5. Antes de presentar UI, obtiene la revisión del rol y `READY_FOR_USER_REVIEW`. Para informe de auditoría entrega hallazgos y lo no verificado, sin afirmar apariencia ni lifecycle aprobados.

## Verificación y entrega

- Build comprueba compilación; detector comprueba sus reglas; ninguno prueba apariencia.
- Navegador, capturas, traces y tareas corresponden a la pieza y revisión actuales, incluidos imports relevantes. Inspecciona de verdad las imágenes antes de afirmar revisión visual.
- Entrega cambios o hallazgos, reglas aplicadas, rutas/evidencia, dueño de devolución y pendientes. No atribuye aprobación a un agente no ejecutado.
- Pin/unpin, hooks y doctor alteran configuración: ejecútalos solo para la operación explícita solicitada o ya autorizada. No reparan deriva de contexto incidentalmente.

## Referencias y modos

Los enlaces y recursos internos son relativos al directorio de esta skill. Lee la referencia de la tabla solo cuando su operación se active. Las rutas `.fruti/`, `.codex/` y documentos de contexto de proyecto son relativas a la raíz del consumidor.

### Modos de superficie

El modo expresa la tarea del visitante en esta superficie.

- **Persuade:** el visitante decide y actúa. Para landing, marketing, campañas y precios, sigue el brief aprobado y usa imágenes reales cuando las requiera.
- **Operate:** el visitante completa una tarea. Prioriza lectura rápida, consistencia, convenciones nativas y contexto de uso en apps, dashboards, editores y herramientas.
- **Read:** el visitante comprende información. Organiza docs, artículos, guías y ayuda para lectura y comprensión.
- **Experience:** el visitante explora la obra. En portfolios y galerías, prioriza el artefacto desde el primer viewport.

Choose the mode from the requested surface, not the product, and persist it only in that surface brief. A tool's landing page is still Persuade; a fashion house's documentation is still Read; a docs index is Read, not Persuade. See [new-work.md](reference/new-work.md) for new surfaces and [operate.md](reference/operate.md) for deeper Operate/Read guidance.

### Comandos y referencias

| Command | Category | Description | Reference |
|---|---|---|---|
| `craft [feature]` | Build | Deprecated alias for an ordinary new-work request | [reference/craft.md](reference/craft.md) |
| `shape [feature]` | Build | Plan UX/UI before writing code | [reference/shape.md](reference/shape.md) |
| `init` | Build | Capture durable product context in PRODUCT.md | [reference/init.md](reference/init.md) |
| `document` | Build | Generate DESIGN.md from existing project code | [reference/document.md](reference/document.md) |
| `extract [target]` | Build | Pull reusable tokens and components into design system | [reference/extract.md](reference/extract.md) |
| `critique [target]` | Evaluate | UX design review with heuristic scoring | [reference/critique.md](reference/critique.md) |
| `audit [target]` | Evaluate | Technical quality checks (a11y, perf, responsive) | [reference/audit.md](reference/audit.md) · native: [reference/audit.native.md](reference/audit.native.md) |
| `polish [target]` | Refine | Final quality pass before shipping | [reference/polish.md](reference/polish.md) |
| `bolder [target]` | Refine | Amplify safe or bland designs | [reference/bolder.md](reference/bolder.md) |
| `quieter [target]` | Refine | Tone down aggressive or overstimulating designs | [reference/quieter.md](reference/quieter.md) |
| `distill [target]` | Refine | Strip to essence, remove complexity | [reference/distill.md](reference/distill.md) |
| `harden [target]` | Refine | Production-ready: errors, i18n, edge cases | [reference/harden.md](reference/harden.md) |
| `onboard [target]` | Refine | Design first-run flows, empty states, activation | [reference/onboard.md](reference/onboard.md) |
| `animate [target]` | Enhance | Add purposeful animations and motion | [reference/animate.md](reference/animate.md) |
| `colorize [target]` | Enhance | Add strategic color to monochromatic UIs | [reference/colorize.md](reference/colorize.md) |
| `typeset [target]` | Enhance | Improve typography hierarchy and fonts | [reference/typeset.md](reference/typeset.md) |
| `layout [target]` | Enhance | Fix spacing, rhythm, and visual hierarchy | [reference/layout.md](reference/layout.md) |
| `delight [target]` | Enhance | Add personality and memorable touches | [reference/delight.md](reference/delight.md) |
| `overdrive [target]` | Enhance | Push past conventional limits | [reference/overdrive.md](reference/overdrive.md) |
| `clarify [target]` | Fix | Improve UX copy, labels, and error messages | [reference/clarify.md](reference/clarify.md) |
| `adapt [target]` | Fix | Adapt for different devices and screen sizes | [reference/adapt.md](reference/adapt.md) · native: [reference/adapt.native.md](reference/adapt.native.md) |
| `optimize [target]` | Fix | Diagnose and fix UI performance | [reference/optimize.md](reference/optimize.md) |
| `live` | Iterate | Visual variant mode: pick elements in the browser, generate alternatives | [reference/live.md](reference/live.md) |

## Selección y operaciones auxiliares

- Sin argumento, lee [reference/routing.md](reference/routing.md) y presenta el menú contextual; no ejecuta un comando automáticamente.
- Con operación explícita o inequívoca, lee su referencia y la variante nativa si aplica. Si dos operaciones cambian el alcance de forma distinta, resuelve esa decisión antes de escribir.
- Para preguntas de workflow, consulta [reference/routing.md](reference/routing.md). Para trabajo nuevo autorizado, usa init/new-work cuando falte contexto; un refinamiento acotado puede inspeccionar código existente sin fabricar PRODUCT.md.
- `teach` es alias de `init`; `craft` es alias deprecado de new-work. `shape` descubre la tarea y deriva decisiones estructurales a Kiwi.
- Tras init, continúa sin repetir context. No cambies un archivo de contexto como efecto secundario de un hallazgo de deriva.
- Pin/unpin crea/elimina shortcuts mediante `scripts/impeccable pin <pin|unpin> <command>` solo cuando se solicita. Informa resultado/error real.
- Para `hooks <on|off|status|ignore-rule|ignore-file|ignore-value|reset>`, carga [reference/hooks.md](reference/hooks.md). Para doctor solicitado, carga [reference/doctor.md](reference/doctor.md); distingue informe de reparación autorizada.

## Recursos y escalamiento

- Crítica/auditoría visual contextual: Sol high. Edición CSS delimitada del dueño: Sol medium. Inventario/extracción o copy inequívoca: Luna low.
- Evidencia visual contradictoria o un fallo persistente de causa razonada: diagnostica y traslada al mismo dueño con evidencia; ningún helper reemplaza Coco R0 o Lima gate.
- Antes de delegar o cambiar recursos, lee `.codex/qa/model-routing.md` desde la raíz: distingue información/herramientas/entorno de dificultad de razonamiento y transfiere identidad, lock, fuentes, caso, intento y evidencia vigentes.
- Esta selección es una pauta de operación: activar la skill no cambia el modelo de la sesión. Confirma la selección/configuración real; los TOML fijados pueden prevalecer sobre spawn. Mantén outputs, revisores, permisos y compuertas; una devolución aislada no obliga a escalar.
