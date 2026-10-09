# Auditoría documental de skills Codex · 0.3.7

Fecha: 2026-10-09. Rama: `codex`. Base revisada: `cbbb028da992a86887d37ced73baec1712725b5a`.

Se corrigieron las ocho skills activas de `.agents/skills`, sus referencias operativas y los adaptadores de agentes. No se modificó código de producto, ejecutables QA ni contratos funcionales `.fruti`.

## Alcance e inspección

Se localizaron 15 `SKILL.md`: ocho activos Codex (`kiwi`, `lima`, `coco`, `bruno`, `mora-docs`, `impeccable`, `improve-animations`, `fruti-squad`) y siete fuentes Kiro con los mismos nombres salvo `fruti-squad`. Las fuentes `.kiro` permanecen como baseline histórico inmutable de la adaptación: se auditan sus problemas, pero las reparaciones se aplican a la distribución Codex reproducible. No se editaron skills instaladas fuera del proyecto.

Se consultaron `AGENTS.md`, `.fruti/policy.md`, paths, estado/handoff, los cinco runtimes, los contratos implementation-target/documentation/typography, audit-manifest y el protocolo QA. Se inspeccionaron los SKILL, referencias de brief/flujo/fidelidad/geometría/validación, bootstrap/intake/perfil, contratos/reutilización/registry/lifecycle/promoción, documentación/reparación, AUDIT/PLAN de motion y los playbooks Impeccable de new-work/critique/audit/adapt/polish/harden/craft-floor y launchers. Referencias de operaciones no activadas permanecen disponibles por carga progresiva; no se afirma haber ejecutado todos sus comandos.

Criterio externo: [Build skills de OpenAI](https://learn.chatgpt.com/docs/build-skills), consultado en esta fecha: metadata de activación, instrucciones imperativas, entradas/salidas, referencias progresivas y pruebas de prompts. La referencia técnica conserva nombres, comandos y rutas; no se tradujeron automáticamente todos los recursos externos.

## Skills actualizadas

| Skill | Cambio principal | Entrada → salida y límite preservado |
|---|---|---|
| Kiwi | QA de navegador obligatorio F1/F2, aprobación después de revisión, anchos exactos, rama F0 sin checker HTML | Brief/alcance → estructura neutral, geometría, matriz, declaración; no modifica producto ni registra datos como Coco |
| Lima | Procedimiento de gobierno en español; elimina fallback que absorbía autores; revisión separada de reparación | Estructura aprobada/compliance → contrato, tokens, registry, handoff; no construye estructura/CSS/funcionalidad/docs |
| Coco | Consume clasificación y lock, deriva código funcional/docs/registry, R0 acotado sin bootstrap obligatorio | Contrato/foundations → F3/CSS; R0 → compliance canónico, sin correcciones automáticas de producto |
| Bruno | Revisión real obligatoria; deuda no equivale a aprobaciones; devolución no autoriza simplificar controles | Contrato y F3 aprobados → funcionalidad R3 y handoff Coco R0; conserva CSS/tokens/anatomía |
| Mora | Una sola autoridad documental y orden; bootstrap vigente; informes separados de preview certificado | Código/registry/QA → docs o informe; shell neutral y estilos de producto solo en preview aislado |
| Impeccable | Revisión/edición del dueño explícitas; preflight del launcher; límites de polish no cierran defectos | Pedido/contrato → hallazgos o cambios autorizados; conserva craft, revisión y evidencia; no inventa seed/CLI |
| Improve Animations | Procedimiento claro en español, tokens aprobados, planes con identidad/dueño y directorio consistente | Código/contexto → hallazgos y planes; advisor no modifica ni certifica producto |
| Fruti Squad | Entradas, handoffs y revisión Lima antes de presentación explícitos | Solicitud → coordinación de roles; no implementa desde orquestación ni elimina aprobaciones |

## Contradicciones resueltas

- Navegador opcional frente a gate obligatorio: las propuestas renderizadas mantienen navegador, capturas/traces, tareas e inspección por el revisor. Build y análisis estático no certifican apariencia.
- Detenerse antes de completar QA frente a reparación interna: IN_PROGRESS/RETURN conservan acciones por dueño; progreso y consultas necesarias se permiten sin presentar una propuesta aprobable prematura.
- QA de todo informe frente a UI: R0/M0, planes y cambios textuales pueden entregar hechos y faltantes; no certifican UI ni permiten promoción.
- Lima/Coco invadiendo roles: estructura Kiwi, tokens/contrato/registry Lima, CSS y R0 Coco, funcionalidad Bruno, docs Mora. Se conservan los seis stage IDs y el compliance R0 sin crear un séptimo stage.
- Orden de página legacy y shell del producto frente a documentación canónica: se retiran órdenes paralelos y se remite a documentation.yaml.
- Perfil por encima de locks/contratos: la precedencia por propietario de policy.md es canónica. Código/PRODUCT/DESIGN/comps no canonizan accidentes de implementación.
- Dos pasadas como cierre forzoso frente a calidad: limita polish discrecional, no reparaciones obligatorias ni permite shipping con defectos abiertos.
- Motion <300ms frente a modales/springs: se explicitan las excepciones ya presentes; cifras del catálogo son propuestas subordinadas a tokens aprobados, no reglas nuevas.
- Descarga implícita del engine frente a permisos del proyecto: se exige inspección previa y engine permitido/autorizado. Fallback de lectura no inventa ejecución. Si new-work requiere concept-seed y falta engine, esa operación conserva su bloqueo; no se elimina la exigencia.
- Se restauró `metadata.version: 4.3.1` de Impeccable. El generador conserva campos opcionales válidos y el validador compara contra la fuente original.

## Referencias y reproducibilidad

Se repararon comandos `mis-agentes/.../init-project.sh` inexistentes en Coco/Mora, referencias `AGENT.md` en lugar de `SKILL.md`, enlaces de intake Lima y bootstrap divergente del modelo de tema vigente. El procedimiento del paquete es `npx fruti-squad-codex init`; scripts legacy permanecen como recursos históricos compatibles, no como reemplazo normativo del bootstrap actual.

`continuation.json` se resuelve como `dirname(evidencePath)/continuation.json`; para la estructura convencional: `.fruti/tests/<round>/<revision>/continuation.json`. Recolector produce; coordinador/dueños consumen. Se verifica identidad plan/evidencia, inputs y hash del plan; checkpoint inicial sin hash, ausente u obsoleto no concede READY. Acciones fuera del rol se derivan con evidencia.

Los cambios adaptados se declaran en `scripts/codex-corrections.json`; `scripts/build-codex.py` los reproduce y `docs/codex-parity.json` registra trazabilidad. Los agentes nativos cargan el SKILL canónico, evitando una segunda copia procedural. Se conservan 113 recursos adaptados y 33 archivos compartidos inmutables, además de iconos/UI metadata.

## Validaciones realizadas

| Comprobación | Resultado y qué demuestra |
|---|---|
| `python3 scripts/build-codex.py` | PASS: generación reproducible de la adaptación |
| `python3 scripts/validate-codex.py` | PASS: YAML, nombres/descripciones, opcionales preservados, TOML/OpenAI metadata, links Markdown estáticos, rutas runtime, hashes e inventario; baseline `.kiro` y 33 compartidos intactos |
| `npm test` | PASS: instalación/init, CLI y registros de compuertas/evidencia/hashes/revisor; ejemplos positivos y exclusiones para las ocho skills |
| `npm run test:browser` con Playwright/Chromium existentes | PASS: regresión real de recorte, reparación, tareas y gate; no verifica la UI de un consumidor |
| Segunda generación y paquete limpio | PASS: generación byte a byte idéntica; npm pack 0.3.7 e instalación real en consumidor vacío con las ocho skills y protocolo |
| Revisión independiente de instrucciones | Dos revisores identificaron residuos F0/bootstrap/órdenes/engine y se corrigieron; rutas positivas/negativas y siete casos adversariales revisados documentalmente |
| `git diff --check` y revisión del diff | PASS: sin errores de whitespace ni cambios de producto/contratos; se mantienen aprobaciones, neutralidad, geometría, calidad y propiedad de roles |

Los fixtures de activación comprueban cobertura y fronteras documentales, **no selección nativa de skills por Codex**. La revisión de los agentes fue una lectura independiente, no una ejecución de todas las fases. La regresión Chromium ejecuta el recolector/gate sobre fixtures; no demuestra que un diseñador vea o apruebe correctamente cualquier propuesta.

## Límites y pendientes

No se dispone aquí del proyecto consumidor `grana-ui` ni de una sesión ejecutable de Codex CLI para probar activación/flujo completo. El defecto de NsaEncabezado reportado por el usuario no se declara reparado por esta auditoría documental.

El protocolo no define duración máxima universal ni número fijo de reintentos/revisión. Se documenta la laguna: repetir solo tras corrección o cambio de mecanismo, registrar no progreso y agotar alternativas viables/permitidas; no inventar PASS por plazo ni aprobación sustitutiva. No queda una decisión documental que requiera cambiar responsabilidades, permisos o requisitos de calidad.

## Actualización del consumidor

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex install --update-tools
```

Revisar el resultado del instalador y confirmar versión 0.3.8 antes de reanudar la ronda vigente. Reutilizar artefactos/aprobaciones actuales únicamente para el mismo alcance; evidencia obsoleta requiere nueva captura/revisión.

## Ampliación: agentes y configuración TOML

La auditoría de sección 13 y sus cambios están documentados en [codex-agents-audit.md](codex-agents-audit.md). La versión 0.3.8 incorpora diez agentes revisados, cuatro mirrors consistentes y validación separada del esquema. Las comprobaciones históricas de 0.3.7 indicadas arriba conservan su alcance; no equivalen a ejecución nativa de los agentes actualizados.
