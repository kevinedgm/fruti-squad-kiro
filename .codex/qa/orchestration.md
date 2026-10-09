# Continuidad del encargo completo · Fruti Squad

Todas las rutas de este protocolo son relativas a la raíz del repositorio consumidor. Lee `AGENTS.md`, `.fruti/policy.md`, estado, perfil y handoff actuales antes de aplicarlo. Conserva ownership, locks, etapas y estados canónicos. Este adaptador Codex concreta la continuidad del encargo y la decisión documental; no concede herramientas ni permisos.

## Encargo y alcance

- Una invocación de Fruti Squad para crear o rediseñar una pieza comprende investigación, alternativas, contrato, F3, implementación R3, auditoría, reparación y entrega de la pieza solicitada. No exige al usuario pedir las etapas por separado.
- Registra el objetivo completo, la superficie exacta y el criterio de entrega en el brief y handoffs existentes. Un pedido limitado expresamente a wireframes, auditoría o documentación conserva ese límite.
- Inspecciona los padres y usos necesarios para comprender y probar la pieza; esa inspección no autoriza rediseñar toda la página. Conserva API, funciones y superficies ajenas al alcance.
- Reutiliza perfil y decisiones vigentes. Pregunta solo por información imprescindible que no puedas resolver en las fuentes autorizadas.

## Alternativas Kiwi y elección

1. Kiwi entiende la pieza, inventaría su funcionalidad y propone el alcance del rediseño. No inventa aprobación de scope; conserva el proceso de `.fruti/runtime/kiwi.yaml`.
   Si la solicitud ya fija la pieza y los límites inequívocamente, registra esa instrucción como autorización de ese alcance sin pedirla de nuevo. Una ampliación o decisión realmente ausente requiere consulta.
2. En una exploración de rediseño, presenta tres alternativas A/B/C, salvo que el usuario haya limitado explícitamente cantidad u operación. Las alternativas deben resolver la misma tarea y preservar las funciones acordadas.
3. Diferencia las alternativas por organización, jerarquía o interacción adaptativa. Cambiar únicamente color, espaciado o etiquetas no constituye otra solución estructural. Registra en el brief qué cambia, el beneficio y el coste de cada alternativa.
4. Lima revisa las tres propuestas y sus casos según `.codex/qa/pre-delivery.md`. Repara y reprueba antes de mostrarlas. Una etiqueta A/B/C sin tres soluciones comprobadas no satisface la entrega.
5. Presenta las alternativas navegables, sus diferencias y una recomendación. El usuario elige, combina o rechaza; no atribuyas una elección a su silencio.
6. Si rechaza todas, Kiwi produce una ronda nueva. Registra observaciones reales y opciones rechazadas, conserva funciones y alcance, y evita repetir la misma solución con cambios cosméticos. Sin observaciones, explora otras organizaciones; no obligues al usuario a diagnosticar una propuesta para poder continuar.
7. La elección estructural aprueba solamente lo mostrado y el alcance explícito. No aprueba color, CSS o interacciones finales todavía no presentadas. Mantén la aprobación F3 antes de R3.

## Cadena y devoluciones

| Operación | Dueño | Revisión y siguiente acción |
| --- | --- | --- |
| F0–F2 y alternativas | Kiwi | Lima revisa; tras aprobación estructural, Lima fija contrato |
| Contrato, API conceptual y tokens | Lima | Emite orden a Coco; devuelve estructura a Kiwi |
| F3/CSS y playground visual | Coco | Lima revisa contrato y apariencia con Impeccable; CSS vuelve a Coco, estructura a Kiwi |
| R3, script/template y comportamiento real | Bruno | Coco R0 revisa el resultado ejecutado; no basta el playground anterior |
| Auditoría R0 | Coco | Funcionalidad a Bruno, CSS a Coco en una tarea de construcción separada, estructura a Kiwi, gobierno a Lima |
| Gate, harden y lifecycle | Lima | Coordina harden sin editar propiedad ajena, consume auditoría Coco y conserva aprobaciones de stable/promoción |
| Documentación formal autorizada | Mora | Consume implementación y evidencia vigentes; Coco revisa el preview |

Al encargar la primera revisión de una entrega, aplica la sección «Primera revisión completa de cada entrega» de `.codex/qa/pre-delivery.md`: el revisor completa las comprobaciones ejecutables y devuelve sus hallazgos en un lote; no cierra la inspección al encontrar el primer error. Esto no altera dueños, orden ni compuertas.

El orquestador asigna objetivo, alcance, entregable, fuentes y revisión a cada delegación. Espera entregas dependientes y procesa su resultado. No hace correcciones de producto desde el rol coordinador. No convierte la auditoría de Coco en permiso para rediseñar o corregir cualquier archivo.

## Continuación automática

1. Tras cada handoff, vuelve al objetivo completo y activa la siguiente operación autorizada. El especialista termina su subtarea; el orquestador conserva el encargo. Un handoff, build, PASS estático o transición a candidate no es una entrega final.
2. `IN_PROGRESS` exige completar evidencia/revisión. `RETURN` exige reparación por su dueño, nueva evidencia y reprobación. Consume `dirname(evidencePath)/continuation.json` solo con identidad y hash actuales, según pre-delivery.
3. `READY_FOR_USER_REVIEW` permite presentar esa revisión; no obliga a pedir una nueva decisión si es una revisión interna intermedia y existe autorización suficiente para la siguiente operación. No renombres ni cambies la semántica del estado.
4. Una petición completa y la aceptación de la dirección habilitan preparar la estabilización interna: Lima coordina harden, Coco audita y el squad prepara una demo en contexto realista. No esperes la frase «ahora estabiliza» como activación adicional. No hagas harden de una dirección aún rechazada o pendiente de elección.
5. Completa las operaciones ejecutables antes de comunicar limitaciones que requieren intervención. Si falta una prueba física o zoom nativo, esa carencia no impide ejecutar harden, demo y auditorías independientes disponibles.
6. Reutiliza una aprobación explícita de la misma revisión/alcance. Si una reparación cambia materialmente estructura, interacción, apariencia o alcance aprobados, presenta el cambio concreto antes del trabajo dependiente.
7. Cada intento debe corregir una causa o usar una recuperación permitida. Si no queda una alternativa viable, conserva el checkpoint y entrega el bloqueo, intentos, evidencia y acción mínima necesaria. No esperes indefinidamente, finjas ejecución en segundo plano ni pases un gate por agotamiento.

## Pausas y entrega de implementación

Pausa por una decisión necesaria: alcance sin resolver, elección F2, aprobación F3, cambio material, autorización exigida por stable/promoción o dependencia imprescindible tras recuperar. Agrupa decisiones relacionadas sobre un resultado concreto cuando sea posible; no omitas una aprobación porque el usuario aprobó otra fidelidad. Comunica progreso sin devolver la coordinación al usuario.

Antes de la entrega, comprueba lo implementado en el stack/ruta autorizados y en un contexto realista. Ejecuta la matriz obligatoria de pre-delivery y el gate lifecycle aplicable. Una UI de laboratorio no demuestra que el archivo de producto haya cambiado. No escribas producción antes de las aprobaciones que exige `.agents/skills/lima/reference/promotion.md`.

Entrega ruta del componente, demo/URL accesible cuando exista, cambios, evidencia y limitaciones. Separa implementado, revisado, candidate, stable y promoción: son hechos diferentes. `quality-gates.md` y `runtime-qa.md` conservan la revisión de zoom/touch y la aceptación explícita de evidencia aproximada; no simules zoom nativo, toque físico ni una aprobación del usuario. Un bloqueo real impide declarar el cumplimiento pendiente, pero no borra el trabajo verificado.

Cuando termines el trabajo interno ejecutable y la implementación esté revisada, presenta el resultado para observaciones y la decisión documental: «¿Quieres ajustar algo o documentarlo con Mora?». Si todavía hay un gate obligatorio pendiente, inclúyelo con su evidencia y decisión concreta; no llames a esa entrega completamente verificada/stable. Si el usuario pide cambios, reabre solo el alcance afectado, deriva al dueño, repara y reprueba antes de volver a presentar.

## Mora y documentación

El procedimiento de aceptación completo `fruti test` de `.fruti/policy.md` conserva su página canónica Mora y todas sus dimensiones obligatorias. La opción documental descrita aquí aplica a encargos ordinarios que no solicitaron esa documentación ni ese procedimiento completo. No declares un full-squad test PASS desde una entrega sin página Mora.


- La documentación formal del Design Hub por Mora se activa si el encargo ya la solicita o el usuario la elige tras revisar la implementación. No preguntes de nuevo si ya está autorizada.
- Si aún no se decidió, presenta esa opción al final; no activa Mora por completar un handoff. Si el usuario la rechaza, registra esa decisión en los artefactos existentes y no crea páginas del Hub.
- Brief, contrato, API aplicable, aprobaciones, registry, handoffs, compliance y evidencia siguen siendo registros internos obligatorios. Mora opcional no significa que esas fuentes o una exigencia documental específica del contrato se omitan.
- En el veredicto documental, distingue registros internos comprobados, documentación formal solicitada/completada y documentación formal no solicitada o pendiente. No declares un PASS sobre páginas no creadas ni cierres un encargo que sí exigía documentación.
- Si Mora documenta, aplica `.fruti/contracts/documentation.yaml` completo. Si devuelve un defecto de producto, el orquestador reabre reparación y QA antes de actualizar la documentación de esa revisión.

## Referencias por operación

- Antes de una revisión UI o reparación: `.codex/qa/pre-delivery.md` para matriz, revisores, recuperación y continuation.
- Al evaluar candidate/stable: `.agents/skills/lima/reference/quality-gates.md`, `lifecycle.md`, `registry.md` y `runtime-qa.md` para evidencia, decisiones y transiciones.
- Antes de promover a producción: `.agents/skills/lima/reference/promotion.md`; no sustituirla por un PASS de preentrega.
- Al documentar con Mora: `.fruti/contracts/documentation.yaml` y el runtime Mora para fuente, preview y propiedad.
