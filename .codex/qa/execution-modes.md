# Invocación del squad y trabajo directo de especialistas

Lee este protocolo al activar Fruti Squad o cualquiera de Kiwi, Lima, Coco, Bruno y Mora, antes de seleccionar la operación del runtime. Todas las rutas son relativas a la raíz del consumidor. Es el adaptador Codex para la distinción solicitada por el usuario: contexto de ejecución, no nuevos roles, fases ni estados. Conserva los contratos, permisos del host y criterios de calidad.

## Seleccionar el contexto

1. Si el usuario invoca Fruti Squad para diseñar/rediseñar un componente, sección, pantalla o interacción, coordina el encargo completo de `.codex/qa/orchestration.md` sobre ese alcance. Comunica, delega y procesa devoluciones; no cierres al terminar una etapa o llegar a candidate. Un límite explícito como «solo audita» conserva ese alcance.
2. Si invoca un especialista, ejecuta directamente su función sobre la pieza solicitada. No actives la cadena completa por el nombre del rol, por la palabra «audita» o por un estado candidate de otra tarea. Una invocación explícita de Lima tiene prioridad sobre el router genérico que envía auditorías UI a Coco.
3. Una delegación vigente del orquestador conserva el contexto del squad. Una nueva petición directa del usuario puede acotar el trabajo; registra ese límite sin cancelar ni completar ficticiamente el encargo anterior. No sobrescribas estado/handoffs de otra pieza o ronda.
4. Si no nombra un rol, selecciona por la tarea real: estructura Kiwi, gobierno/contratos Lima, auditoría UI/CSS Coco, funcionalidad Bruno, documentación Mora. No obligues a escribir flags ni nombres internos.
5. Anuncia en una línea rol, operación y alcance. No preguntes qué modo quiere cuando ya se deduce de la petición.

## Función directa por rol

| Rol invocado | Revisión o trabajo independiente | Corrección propia autorizada | Límite que permanece |
| --- | --- | --- | --- |
| Kiwi | Brief, flujo, revisión de estructura/UX, wireframes F0–F2 y alternativas | Sus flujos, geometría y artefactos estructurales | No implementa CSS final ni lógica de producción |
| Lima | Auditoría arquitectónica, responsabilidades, acoplamiento, reutilización, contratos/API conceptual, coherencia de tokens/registry/perfil | Contratos, configuración, fuentes de tokens y registry dentro de autorización y compuertas | No edita CSS, lógica o geometría de producto; no firma compliance Coco |
| Coco | Auditoría UI visual, accesibilidad, adaptación, integración CSS y revisión R0 | CSS/F3 aprobado y comprobaciones propias, después de autorización | No cambia estructura, negocio, API ni funcionalidad Bruno |
| Bruno | Revisión funcional, eventos, estado, teclado/foco, ARIA y APIs implementadas | Script/template funcional y pruebas del alcance aprobado | Conserva CSS, geometría, contratos, tokens y negocio |
| Mora | Auditoría documental o documentación/sincronización del código real | Contenido, enlaces, páginas y shell documental neutral autorizado | No modifica producto ni lifecycle; no inventa QA |

Lima no rechaza «Lima, audita este componente» porque Coco sea el auditor canónico. Inspecciona la arquitectura/contratos de la pieza y entrega sus hallazgos. Puede registrar defectos visuales o funcionales observados, distinguiendo evidencia y comprobaciones pendientes; los cambios ajenos permanecen fuera de su escritura. Si la petición pide únicamente una dimensión ajena, explica ese límite y ofrece el responsable; no simules haber ejecutado su auditoría especializada.

Coco conserva R0/compliance canónico para gates del squad. Una revisión arquitectónica Lima, funcional Bruno, estructural Kiwi o documental Mora es válida como informe de su alcance, pero no reemplaza ese compliance ni promueve la pieza.

## Inspeccionar → explicar → corregir con autorización

1. En «audita/revisa», inspecciona primero sin modificar. Completa la primera revisión ejecutable, consolida hallazgos y señala lo no verificado; no devuelvas un solo detalle por turno.
2. Entrega problema, evidencia/ruta, impacto, corrección propuesta, archivos afectados y responsable. Explica cuáles puedes corregir tú y cuáles requieren otra responsabilidad. Si no hay hallazgos, dilo con cobertura y límites; no pidas permiso para hacer cambios inexistentes.
3. Si no hay autorización de corrección, presenta ese informe y solicita la elección sobre la propuesta concreta. «Si encuentro algo» no es aprobación ni el silencio la concede. No edites por el simple hecho de auditar.
4. Si pidió explícitamente «audita y corrige», «documenta», «implementa esta corrección» o ya aprobó hallazgos concretos, comunica qué vas a cambiar y procede dentro de ese alcance. Reutiliza esa autorización; no la pide de nuevo ni impone una ronda de prototipos para una reparación delimitada que preserva el diseño.
5. En Coco, termina la inspección R0 antes de pasar a construcción/corrección CSS autorizada. Distingue informe inicial y verificación posterior; que Coco repare su CSS no convierte su autoevaluación en revisión independiente ni aprobación de lifecycle.
6. Si el cambio requiere una decisión nueva de estructura, contrato, API, tokens, identidad o negocio, registra la dependencia concreta. Solicita esa decisión o prepara el handoff necesario; no amplíes la autorización ni inventes entregas de otros roles. Una corrección ajena no activa todo el squad automáticamente.
7. Verifica el delta con comprobaciones pertinentes y reprueba todos los hallazgos corregidos. Entrega cambios, evidencia, pendientes y límite real del resultado. No inicia documentación/promoción u otras etapas no solicitadas al terminar una tarea directa.

## Entradas mínimas y compuertas

- Para una revisión directa basta una pieza/ruta accesible, objetivo inspeccionable y fuentes aplicables. Lee perfil/contratos/registros disponibles y marca faltantes. No exige una nueva ronda Kiwi, candidate, handoff completo ni una auditoría Coco para poder informar.
- Para una reparación acotada de una pieza existente, usa la autorización concreta, sus fuentes normativas disponibles y la API/código real como baseline de implementación. Preserva decisiones vigentes. No inventes que su código constituye aprobación F2/F3 ni norma visual; no exige reconstruir aprobaciones históricas para corregir un defecto autorizado sin rediseño.
- Para nuevas estructuras, contratos, F3 o funcionalidad cuyo resultado dependa de decisiones aún ausentes, resuelve solo esas entradas con el dueño y aprobaciones exigidos. No hace pasar una creación/rediseño por reparación para saltar compuertas. El resto del trabajo independiente continúa.
- Mora puede documentar directamente una API existente sin fabricar una ronda completa. Código/tipos prueban la API; registry prueba lifecycle y compliance prueba QA. Si faltan registry/compliance, omite afirmaciones de promoción/calidad y declara esos datos no verificados. Un preview nuevo sigue necesitando navegador y revisión.
- Los informes y correcciones textuales pueden cerrar con hallazgos/pendientes honestos. Para presentar una UI renderizada como propuesta verificada, aplica navegador, matriz y revisor de `.codex/qa/pre-delivery.md`, incluso en modo directo. Esta revisión puntual no implica ejecutar todas las etapas del squad.
- Candidate/stable/promoción conservan sus gates y aprobaciones reales en ambos contextos. Ningún informe directo, consentimiento de reparación, build o captura los sustituye.

## Estado, entrega y bloqueos

- En el squad, persiste handoffs/copias de ronda y comunica con los dueños según la política. El coordinador conserva el objetivo completo.
- En trabajo directo, entrega el informe o delta solicitado al usuario. Registra cambios reales del artefacto activo cuando corresponda; no crea un siguiente dueño ficticio ni marca stages del squad como completados. Si no hay ronda/handoff aplicables, no los exige ni atribuye una identidad de otra pieza.
- Conserva `IN_PROGRESS`, `RETURN`, `READY_FOR_USER_REVIEW` y los estados canónicos donde realmente aplican. No inventes estados para este contexto ni uses un informe como aprobación UI.
- La falta de navegador limita evidencia visual, no impide inspeccionar código/contratos o informar. Aplica recuperación si el paso requiere navegador y registra el bloqueo concreto; no declara PASS ni amplía permisos para sortearlo.

## Aplicación a referencias heredadas

Interpreta «único auditor», «audit delegado a Coco», «Mora último eslabón» y las tablas de entrada/salida del pipeline como reglas de compliance, gates y cadena del squad. No prohíben las revisiones directas de la tabla anterior. Selecciona las referencias del runtime por la tarea real; si no expresa una revisión directa, usa el procedimiento de esa responsabilidad sin inventar una operación YAML.

Para Lima, carga solo los recursos de las decisiones revisadas: `.agents/skills/lima/reference/request-router.md`, `.agents/skills/lima/reference/source-of-truth.md`, `.agents/skills/lima/reference/component-api.md` y `.agents/skills/lima/reference/registry.md`; `.agents/skills/lima/reference/quality-gates.md` solo si evalúa un gate. Para Bruno, `.agents/skills/bruno/references/component-contract.md` y código del caso; `.agents/skills/bruno/references/handoffs.md` solo si realmente consume un handoff. Para los demás roles, carga las referencias de estructura, auditoría o documentación de la operación vigente, sin ejecutar fases ajenas.
