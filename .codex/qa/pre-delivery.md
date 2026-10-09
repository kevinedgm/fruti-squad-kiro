# Revisión interna antes de entregar una propuesta

Este contrato operativo Codex aplica también a pedidos directos como «usa Kiwi para rediseñar este componente». Completa la evaluación y reparación dentro del alcance autorizado antes de pedir observaciones al usuario. Conserva todas las aprobaciones estructurales, F3 y lifecycle de `.fruti/policy.md`; revisión interna y aprobación del usuario son actos distintos.

## Ciclo obligatorio

1. El dueño produce una revisión y ejecuta sus comprobaciones. El verificador estático no certifica render, composición, responsive ni funcionalidad.
2. Entregar artefactos, archivos fuente exactos, ronda/revisión, plan de casos, evidencia de navegador y delta al revisor de la tabla. Con herramientas reales, invocar otro agente y esperar su resultado. Sin ellas, realizar una pasada separada bajo el rol revisor y declarar ejecución secuencial; nunca fingir independencia ni delegación.
3. El revisor inspecciona la propuesta renderizada, las capturas y los traces, contrasta el contrato y emite `PASS`, `RETURN` o `BLOCKED`. Que el productor diga PASS no basta. Una imagen adjunta pero no inspeccionada no es evidencia visual revisada.
4. `RETURN` incluye regla fallida, caso reproducible, región afectada, dueño de reparación y restricciones que siguen congeladas. El revisor no sustituye al dueño ni rediseña por él.
5. El dueño corrige dentro del alcance, genera nueva revisión y evidencia, y vuelve al revisor. Reprobar cada fallo y los casos afectados; no reutilizar un PASS de otra revisión. Conservar el historial. Si la ronda fue presentada/aprobada y cambia materialmente, crear rNN+1 y renovar la aprobación correspondiente.
6. Solo tras el gate `READY_FOR_USER_REVIEW` presentar A/B/C, F3 o el resultado dentro del encargo actual. El usuario decide dirección, preferencias y observaciones; no recibe fallos conocidos y reparables como trabajo de QA pendiente.

| Entrega | Productor | Revisor / devolución |
|---|---|---|
| Propuesta F1/F2 | Kiwi | Lima revisa estructura, geometría, adaptación, reutilización y evidencia de la tarea; devuelve a Kiwi. Es revisión de borrador, no contrato definitivo ni aprobación del usuario. |
| Propuesta F3/CSS | Coco | Lima ejecuta critique/adapt/polish de Impeccable en modo revisión y contrasta contrato; Coco conserva autoría y auditoría canónica. Devuelve CSS a Coco y estructura a Kiwi. |
| Implementación R3 | Bruno | Coco R0 audita UI real y conducta; devuelve funcionalidad a Bruno, CSS a Coco o estructura a Kiwi. Lima consume el compliance vigente para el gate. |
| Preview documental | Mora | Coco verifica render/preview aislada y la evidencia de UI; Mora comprueba contrato documental y corrige su contenido. |

Una revisión F2 permite evaluar estados e interacciones del wireframe; no afirma que API/backend ni producción estén implementados. El paso a Lima contrato sigue requiriendo la estructura aprobada por el usuario. El paso a Bruno sigue requiriendo F3 aprobado. No implementar producto para satisfacer un pedido limitado a wireframes.

## Qué debe demostrar la evidencia

- Abrir el artefacto exacto de cada alternativa en navegador, no solo una miniatura o marco fijo. En F3/R3 revisar también la página anfitriona real y sus padres. Registrar URL, revisión y hashes de todos los archivos relevantes (incluidos CSS/imports que influyen en el render).
- Por alternativa: viewports del perfil más 320 y 375 px; modos compact, medium y expanded. Conservar la altura real usada. Título/contenido largo en 320 y 375; aumento al 200%; estados aplicables (carga, vacío, error, permisos, offline…) definidos por el brief. `required_states` enumera los estados realmente aplicables; el revisor justifica los excluidos.
- Contrastar contenido y acciones obligatorios por caso mediante selectores de la implementación real. Una acción secundaria desplazada a un menú sigue teniendo que ser encontrable y alcanzable; probar su apertura y efecto. No excluir selectores solo para obtener PASS.
- Detectar recorte horizontal Y vertical, `overflow: hidden/clip`, alturas fijas, límites de grid/flex, oclusión y contenedores internos. Scroll intencional puede ser válido si preserva acceso, foco y tarea. Ausencia de desborde en `body` no prueba esto.
- Inspeccionar capturas del viewport y de página completa, no inferir diseño desde DOM ni tamaños. Revisar claridad, densidad, jerarquía, colisiones, composición y las interacciones de la tarea con teclado/foco. Logs limpios, un h1 o build verde no sustituyen esa revisión.
- Registrar hallazgos cerrados con los casos repetidos. Nunca inventar ejecución, imágenes, logs ni una revisión de otro agente.

## Herramientas incluidas

Se distribuyen en `.codex/qa` y funcionan desde la raíz del proyecto. Los agentes generan un plan JSON por ronda/revisión; estos son pasos internos, no comandos que deba escribir el usuario:

```bash
node .codex/qa/collect-browser.cjs .fruti/tests/rNN/rev-01/plan.json .fruti/tests/rNN/rev-01/evidence.json
node .codex/qa/verify-delivery.cjs .fruti/tests/rNN/rev-01/plan.json .fruti/tests/rNN/rev-01/evidence.json
```

El recolector usa Playwright existente; no instala paquetes ni cambia el proyecto. Si no hay navegador disponible, usar el navegador real del host y producir el mismo formato con sus capturas/logs y trazabilidad, y ejecutar la recuperación indicada abajo. Solo un bloqueo terminal documentado permite `BLOCKED`. Nunca certificar visual/responsive sin poder verlo.

El recolector deja `review.status: NOT_REVIEWED`. El revisor debe inspeccionar las imágenes y completar la revisión; el recolector nunca firma una aprobación. `verify-delivery` rechaza matriz incompleta, fuente/plan/capturas/traces obsoletos, fallo detectado, revisión faltante, mismo rol productor/revisor, dimensiones no PASS y hallazgos abiertos o sin reprobación. Exit 0 significa listo para revisión del usuario, nunca aprobado por él ni stable.

El gate verifica integridad y cobertura del registro. No puede comprobar por sí solo la honestidad de una declaración del modelo, ni juzgar la imagen. La inspección real del revisor y su trace siguen siendo obligatorios.

### Plan JSON mínimo

```json
{
  "version": 1,
  "artifact": "encabezado",
  "round": "r03",
  "revision": "rev-01",
  "stage": "F2",
  "producer": "kiwi",
  "inputs": [{"path": "design-hub/lab/encabezado/r03/index.html", "sha256": "SHA256_REAL"}],
  "profile_viewports": [390, 768, 1024, 1440],
  "variants": ["A", "B", "C"],
  "objectives": [{"id": "density", "criterion": "Reducir densidad manteniendo breadcrumbs y subtítulo claros, sin controles redundantes"}],
  "required_states": ["normal", "long-content", "loading", "error"],
  "cases": [
    {"id": "A-normal-320", "variant": "A", "url": "http://localhost:4321/URL_REAL", "width": 320, "height": 844, "state": "normal", "zoom": 1, "required": ["SELECTOR_TITULO_REAL", "SELECTOR_ACCION_REAL"], "actions": []}
  ]
}
```

Expandir `cases` para TODA la matriz: el ejemplo incompleto no pasa el gate. `actions` admite `click`, `fill` y `press` para alcanzar estados reales; no basta con etiquetar un caso como error o contenido largo. Por alternativa, incluir al menos una tarea ejecutada en móvil (`task: true`, `actions` y `expected`) y otra con teclado en ancho expanded (`task: true`, `keyboard: true`, acciones `press` y resultado esperado). El revisor confirma que el estado fue provocado y que el comportamiento satisface la tarea. Añadir `expected` con selector y texto o visibilidad cuando aplique. El aumento automático usa CSS `zoom: 2`, se registra como `css-zoom` y no se presenta como prueba de zoom nativo o de ampliación de texto del dispositivo; revisar esas modalidades con el navegador efectivo cuando el contrato las exige.

### Revisión en el JSON de evidencia

Después de inspeccionar todos los casos, el revisor agrega:

```json
{
  "role": "lima",
  "status": "PASS",
  "summary": "RESULTADO_REAL_DE_LA_INSPECCION",
  "plan_sha256": "HASH_DEL_PLAN_REVISADO",
  "screenshots_reviewed": ["RUTAS_DE_TODAS_LAS_CAPTURAS_INSPECCIONADAS"],
  "traces_reviewed": ["RUTAS_DE_TODOS_LOS_TRACES_INSPECCIONADOS"],
  "objective_checks": [{"variant": "A", "objective_id": "density", "status": "PASS", "rationale": "OBSERVACION_REAL_COMPARADA_CON_EL_COMPONENTE_ORIGINAL", "evidence_case_ids": ["CASO_MOVIL_REAL", "CASO_EXPANDED_REAL"]}],
  "dimensions": {"structural": "PASS", "visual": "PASS", "accessibility": "PASS"},
  "findings": [{"rule_id": "RESP-CLIPPING", "status": "closed", "retest_case_ids": ["CASO_REAL_REPETIDO"]}]
}
```

`findings: []` solo cuando no se encontraron fallos. F3 usa productor Coco/revisor Lima; R3 usa productor Bruno/revisor Coco. Los estados y veredictos canónicos siguen en los formatos `.fruti` originales; este gate adicional no reemplaza esos contratos.

## Bloqueos y continuidad

Continuar automáticamente los defectos reparables dentro de la autorización vigente. No pedir al usuario que redacte instrucciones de QA o diagnostique el recorte. Si falta una herramienta, acceso o decisión auténtica de producto, comunicar el bloqueo concreto y conservar lo realizado como borrador no aprobado. Si el ciclo no progresa, investigar la causa y registrar qué falta; no convertir cansancio, número de intentos o un plazo en PASS.

Las aprobaciones del usuario siguen siendo sobre propuestas concretas ya revisadas, y no autorizan silenciosamente ampliar el alcance. Si el usuario reporta un fallo en una propuesta entregada, reabrir la revisión y el caso; no pedirle que demuestre o repare el defecto para que el squad actúe.

## Continuidad de ejecución y recuperación del navegador

`NOT_REVIEWED`, revisión en curso, segunda revisión solicitada y corrección aplicada no son estados finales. Esperar la respuesta del revisor, procesar su resultado y completar la siguiente acción dependiente. No terminar la tarea con «falta completar la evidencia» cuando todavía hay una acción autorizada y ejecutable.

Un error de una herramienta de navegador no prueba que todos los navegadores estén indisponibles. Registrar el error exacto y seguir esta recuperación dentro de las capacidades y permisos reales:

1. Comprobar que la URL/servidor y el artefacto existen y son los de la revisión actual; revisar respuesta de recursos CSS/JS y las rutas. Resolver el servidor local o las rutas rotas que pertenezcan al alcance. Un HTML que depende de CSS de otra ronda no se comparte como artefacto autónomo: copiar el recurso permitido dentro de la ronda o incluirlo inline y revalidar.
2. Reintentar después de corregir la causa conocida. No repetir ciegamente el mismo fallo.
3. Si falla la integración de navegador del host, buscar la herramienta de navegador disponible del proyecto (harness QA, Playwright instalado, ejecutable ya disponible) y usarla por terminal si está permitido. Preferir la dependencia del consumidor; el paquete no instala Playwright en su propio árbol. Si cambia la herramienta, conservar URL/estados/viewports e inspección visual real.
4. Un revisor puede recibir la evidencia capturada por el productor y abrir las imágenes/traces con las herramientas efectivas: no necesita iniciar otro servidor o navegador solo para duplicar la captura. Debe inspeccionarla, contrastarla y solicitar reprobación de los fallos; el productor no puede firmar su propio review. Si no puede ver imágenes/traces, tampoco puede declarar PASS visual.
5. Si hace falta instalación, credenciales o acceso no autorizados, detener solo esa operación y pedir lo mínimo que realmente falte. No simular fallback ni afirmar que se ejecutó otro navegador. Respetar restricciones del host y autorizaciones vigentes.
6. Solo declarar bloqueo terminal cuando no quede ruta de recuperación permitida y viable. Persistir un registro `blocker.json` con ronda/revisión, operación fallida, herramienta, error literal, intentos/resultados, alternativas disponibles o indisponibles, artefactos afectados, dueño y acción mínima necesaria. Un «navegador bloqueado» sin detalle no es diagnóstico completo.

El gate devuelve acciones con dueño. Ejecutarlas en el mismo encargo:

- `IN_PROGRESS`: faltan casos, evidencia vigente o revisión; completar captura, esperar al revisor y volver a ejecutar el gate. No es una entrega ni un bloqueo.
- `RETURN`: hay defectos técnicos o un objetivo incumplido; devolver al productor, corregir y reprobar. No terminar con un resumen de QA pendiente.

Al finalizar, distinguir únicamente:

- `READY_FOR_USER_REVIEW`: propuesta reparada, evidencia vigente y review aceptado; pedir la aprobación o comentarios propios de esa etapa.
- `BLOCKED`: dependencia concreta no resoluble en el entorno; explicar qué falta para continuar. Los artefactos permanecen borradores. No pedir elección A/B/C ni aprobación de F3.

Las declaraciones y los hallazgos deben actualizarse después de cada devolución y reparación. Registrar hallazgo, dueño, cambio y reprobación pendiente/ejecutada. No dejar una primera declaración «pendiente» como si describiera la segunda revisión; no cerrar un hallazgo sin nueva evidencia.

El «siguiente paso del usuario» debe ser «ninguno: revisión interna en curso» mientras el squad puede continuar, o la acción concreta del bloqueo terminal. Solo proponer elegir A/B/C cuando el gate esté listo. No prometer ejecución en segundo plano si el turno termina.

## Calidad de la propuesta y QA proporcional al componente

Antes de diseñar, extraer objetivos observables del pedido en `plan.objectives` (`id`, `criterion`) y registrar el problema del componente original. Por cada alternativa, explicar en el brief qué cambia, cómo mejora la tarea y qué coste introduce. El revisor completa `objective_checks` para cada pareja alternativa/objetivo, con justificación y casos realmente inspeccionados. Un PASS geométrico no sustituye estos juicios. Si no puede explicar la propuesta de forma sencilla o esta conserva/empeora el problema original, devolverla a Kiwi.

En un encabezado menos denso con breadcrumbs y subtítulo, evaluar jerarquía, espacio ocupado, lectura de la ubicación y descubribilidad de navegación. Una variante compacta con disclosure debe mostrarlo solo cuando hay ruta oculta; si la ruta ya es visible, el control redundante es un fallo aunque no exista overflow. El título y subtítulo no compiten con ese control. Validar abrir/cerrar con foco, teclado y contenido largo; documentar ventajas y coste de interacción. No recomendar A/B/C indistintas solo para completar tres alternativas.

Delimitar el componente y los estados del consumidor antes de armar la matriz. Carga/vacío/error/offline/permisos que no cambian el encabezado pertenecen al consumidor: declararlos fuera de `required_states`, con razón y revisión explícitas en brief/declaración. No repetir una matriz completa de un estado externo idéntico por cada alternativa. Si cambian contenido, navegación o permisos del componente, sí deben probarse. Mantener por alternativa los anchos, contenido largo, ampliación y tareas aplicables exigidos arriba; no excluir móvil ni navegación para acortar QA. No agregar controles al componente solo para fabricar una tarea de prueba.

Preparar el plan completo al inicio y ejecutar el recolector sobre toda la matriz, en lugar de terminar después de dos casos corregidos. Mantener un registro de casos ejecutados/pendientes y siguiente acción con dueño; el agente coordinador consume ese registro y continúa. Al compartir el artefacto, incluir sus recursos y una explicación breve de cada alternativa, su beneficio y el coste que el usuario debe decidir. El usuario no tiene que interpretar una propuesta sin explicación.

`BLOCKED` necesita `evidence.blocker` de la revisión actual: `plan_sha256`, `owner`, `operation`, `tool`, `error` literal, `required_action`, `attempts` con `operation`/`result` y `alternatives` con `status` (`unavailable` o `not-permitted`) y `reason`. El gate comprueba que el registro esté completo; el coordinador verifica que realmente se agotaron las rutas permitidas. No inventar ese registro para cerrar una matriz incompleta. El archivo `blocker.json` conserva el diagnóstico íntegro.
