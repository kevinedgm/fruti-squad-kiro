# Trabajo directo de especialistas · validación 0.3.18

Fecha: 9 de octubre de 2026. Cambio: distinguir encargo completo Fruti, delegación dentro de ese encargo y petición directa, según [execution-modes](../.codex/qa/execution-modes.md). No modifica modelos, permisos, runtime/contratos compartidos ni las compuertas del encargo completo.

## Método y límites

Se instalaron las herramientas del paquete en cinco proyectos temporales independientes y se iniciaron cinco subagentes en contextos nuevos, cada uno leyendo una skill de esa copia. Recibieron una petición y artefactos originales, sin diagnóstico, corrección esperada ni historia del mantenimiento. Las entradas originales se conservan en [test/fixtures/direct-modes](https://github.com/kevinedgm/fruti-squad-kiro/tree/codex/test/fixtures/direct-modes).

Las correcciones se verificaron contra los archivos originales después de cada ejecución. No se usaron productos del usuario. Estas pruebas comprueban aplicación de instrucciones por subagentes reales que leen una skill; no prueban matching del catálogo del escritorio, selección de un agente TOML, aplicación efectiva de su modelo/esfuerzo ni un rediseño completo end-to-end en Codex CLI.

## Resultados observados

| Invocación | Pedido | Resultado | Escritura observada |
| --- | --- | --- | --- |
| Lima directa | Auditar componente, contrato y documentación; informar antes de editar | Comparó arquitectura/API, señaló deriva documental, alcance global de Escape, falta de limpieza y decisiones contractuales abiertas. No rechazó por ser responsabilidad de Coco ni exigió candidate/ronda | Ninguna en auditoría. Tras aprobar reglas de Escape/disabled, actualizó solo `docs/contract.md` y dejó implementación/documentación pendientes |
| Coco directa | Auditar CSS para móvil, sin cambios | Identificó mínimo fijo de 600px, clase/carga no demostradas y hallazgos funcionales/documentales ajenos. Distinguió riesgo estático de overflow observado | Ninguna en auditoría. Tras aprobar tamaño, modificó solo `src/filter.css` con mínimo cero, ancho lógico y border-box; preservó template/API |
| Bruno directo | Corregir reacción a Escape tras desmontaje; reparación funcional autorizada | Añadió limpieza de listener mediante onUnmounted con la misma referencia. No pidió rondas Kiwi/Lima/Coco | Solo `src/Filter.vue`; template, API y CSS conservados |
| Mora directa | Documentar API real en Markdown, sin preview nuevo | Sustituyó API incorrecta por modelValue/disabled/update:modelValue; documentó implementación, listener y límites de accesibilidad/QA | Solo `docs/Filter.md`; código conservado |
| Kiwi directo | Revisar flujo F0 contra requisitos; informar antes de editar | Identificó validación omitida, recuperación sin garantía de conservar valores, cancelación sin confirmación y endpoint ambiguo. Propuso un flujo corregido | Ninguna; conservó la compuerta de autorización solicitada, sin iniciar pipeline ni derivar la revisión a Coco |

En Lima y Coco la aprobación posterior fue una nueva instrucción acotada dentro de la prueba, no una aprobación atribuida al usuario del proyecto real. Ambos actuaron sobre su propia responsabilidad sin completar ni iniciar fases ajenas.

Bruno ejecutó un harness aislado sin dependencias para Escape, otras teclas, desmontaje, remontaje e instancias independientes. Esa prueba ejercita el manejador con hooks simulados; no equivale a montar Vue ni a una prueba de navegador. Mora verificó enlaces/orden documental. Las comprobaciones visuales y build no disponibles se declararon no verificadas; no se afirmó PASS visual, stable o promoción.

## Regresiones y compatibilidad

- `npm test`: instalación, tema, configuración de proyecto, cobertura de casos directos/squad, referencias instaladas al protocolo, gates y plugin.
- `scripts/validate-codex.py`: 113 recursos, 33 archivos compartidos originales, transformación reproducible y referencias.
- YAML/TOML: metadatos parseables; identidad, modelos/esfuerzo y otros campos de configuración conservados frente a la versión anterior. La validación contra el esquema fechado se ejecuta aparte en CI; parsear no prueba carga real.
- `scripts/validate-skill-icons.py`: recursos visuales válidos sin cambiar iconos ni afirmar render del escritorio.
- `test/activation-cases.json`: incluye especialista explícito, auditoría sin escritura, reparación autorizada, documentación directa, encargo completo, delegación y bloqueo de promoción sin evidencia. Son ejemplos de routing y regresiones documentales, no un resolvedor ejecutable.

## Qué falta comprobar

- Carga de la copia actualizada en el catálogo y caché del plugin del consumidor.
- Revisión visual real del componente de un producto y uso de los agentes nativos con su configuración efectiva.
- Encargo Fruti completo desde alternativas hasta implementación y gate final en el cliente del usuario.

La aprobación de una corrección directa no sustituye navegador/revisor cuando se presenta una UI certificada ni permite saltar Candidate/Stable/producción. Los requisitos de esos gates permanecen en pre-delivery y orchestration.
