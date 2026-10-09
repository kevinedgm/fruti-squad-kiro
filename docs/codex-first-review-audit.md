# Primera revisión completa · Codex 0.3.14

## Problema y alcance

El usuario observó numerosos intercambios de revisión/reparación al rediseñar NnStatFilter.js durante más de una hora. La captura mostró subtareas y tiempos, pero no sus hallazgos ni la evidencia de cada devolución. No se atribuye un bucle concreto a esos nombres ni se afirma una causa medida.

La corrección solicitada es únicamente hacer exhaustiva la primera revisión de cada entrega. No se cambia el flujo actual, responsabilidades, fidelidades, aprobaciones, modelos, permisos, schemas de evidencia ni criterios de las compuertas.

## Regla canónica

`.codex/qa/pre-delivery.md`, sección «Primera revisión completa de cada entrega», exige:

- Identidad, brief, contrato/lock, perfil, plan y evidencia actuales antes de evaluar.
- Recorrer todas las comprobaciones aplicables a la etapa y alcance antes de devolver.
- Continuar después de un hallazgo cuando existan comprobaciones independientes ejecutables.
- Consolidar los defectos observados con casos, evidencia, responsables y restricciones.
- Registrar cobertura y justificar exclusiones; señalar comprobaciones bloqueadas como no verificadas.
- Emitir una devolución al terminar esa pasada, manteniendo comunicación de progreso mientras se inspecciona.

Los especialistas y agentes ya leen obligatoriamente ese protocolo. `.codex/qa/orchestration.md` ancla explícitamente la instrucción en el encargo del revisor. No se duplica el procedimiento dentro de cada skill/TOML ni se amplía el alcance de una auditoría.

## Casos de revisión documental

| Situación | Resultado exigido |
| --- | --- |
| Primer caso móvil tiene recorte; otras alternativas siguen accesibles | Registrar recorte y continuar el resto de la matriz antes del lote de devolución |
| Una alternativa no renderiza y bloquea su tarea de teclado | Registrar dependencia y tarea no verificada; inspeccionar otras alternativas/casos independientes |
| F2 tiene defecto estructural y de foco en el wireframe | Revisar ambos según fidelidad; devolver con evidencia sin exigir implementación backend |
| Hallazgos de estructura, CSS y conducta en R3 | Una inspección consolidada; handoffs existentes a Kiwi, Coco y Bruno sin ampliar permisos |
| Se repara un bloqueo y aparece una zona antes inaccesible | Ejecutar las comprobaciones pendientes en la reprobación; no tratarlas como realizadas en la primera pasada |

Estos casos son análisis del protocolo, no una ejecución real en Codex ni una auditoría de NnStatFilter.js.

## Validación y límites

Ejecutados: suite `npm test`, validación de recursos/paridad y `git diff --check`. Se comprobó que el instalador distribuye el protocolo modificado y que las referencias obligatorias existentes lo cargan. La CI ejecuta además esquemas, regresión de navegador y paquete instalado en proyecto limpio.

No se ejecutó aquí el rediseño del usuario ni se midieron tiempos, tokens o número de devoluciones con el cambio. La exhaustividad declarada debe respaldarse con cobertura y evidencia; los validadores no pueden juzgar por sí solos la calidad visual ni la honestidad de una revisión.
