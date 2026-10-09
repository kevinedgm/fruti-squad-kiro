# Auditoría de agentes y configuración de Codex

Fecha: 2026-10-09. Distribución: 0.3.8, rama `codex`. Amplía la auditoría de skills; no cambia código de producto, contratos funcionales, modelos, esfuerzos, permisos, red ni concurrencia.

## Inspección y versión

Se leyeron `AGENTS.md`, los diez agentes de `.codex/agents/`, sus skills, runtimes, política, handoffs y protocolo `.codex/qa/pre-delivery.md`, además de los cuatro helpers y sus referencias de operación. Se contrastaron el generador, instalador, pruebas y guía operativa. La inspección se limita al repositorio; no se modifica configuración instalada fuera del proyecto.

El proyecto no fija una versión de Codex ni depende de `@openai/codex`; no hay ejecutable `codex` disponible aquí. **0.3.8 es la versión del paquete, no de Codex.** No se afirma compatibilidad con una versión mínima inventada. La compatibilidad documental se comprueba contra estas fuentes oficiales consultadas en la fecha del informe:

- [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents): archivos independientes, identidad, propiedades y herencia.
- [Config reference](https://learn.chatgpt.com/docs/config-file/config-reference): ámbito, roles, aliases y propiedades.
- [Config basics](https://learn.chatgpt.com/docs/config-file/config-basic): capas de configuración.
- [Esquema público](https://developers.openai.com/codex/config-schema.json), redirigido a `https://learn.chatgpt.com/docs/config-schema.json`.

La copia reproducible se encuentra en `scripts/schemas/codex-config-2026-10-09.json`; SHA-256: `7933a70506e753a6e98c16800d2a76770b2af2b7295491f8f0b8e713e952027e`. Es un esquema general: el validador compone explícitamente la identidad independiente documentada (`name`, `description`, `developer_instructions`), no presenta esta composición como un parser nativo oficial.

## Configuración declarada y efectiva

**No existe `.codex/config.toml` en este proyecto.** No se creó uno. El instalador preserva la configuración del consumidor, incluso con `--force`. No hay configuración general del repositorio que pueda certificarse como cargada.

| Archivos | Modelo | Esfuerzo declarado | Sandbox, red, MCP, skills y límites |
|---|---|---|---|
| kiwi, lima, coco, bruno, mora, fruti-squad | No declarado | No declarado | No declarados |
| impeccable_asset_producer, impeccable_documenter, impeccable_manual_edit_applier | No declarado | `medium`, preservado | No declarados |
| impeccable_finish_reviewer | No declarado | `high`, preservado | No declarados |

Los valores ausentes se heredan de la configuración efectiva del host; no significan acceso ilimitado. La sesión y los overrides de spawn pueden modificar defaults. Las restricciones vivas de sandbox/aprobación prevalecen al crear hijos. La prosa no habilita herramientas, skills, red ni servidores MCP. No se inspeccionaron configuraciones personales para inferir estos valores.

## Cambios por agente

Los diez archivos nativos se actualizaron. Cada uno declara activación concreta, entradas y lectura explícita del SKILL canónico; compartir nombre no establece una carga automática. Los seis agentes del squad incorporan límites, evidencia, devolución y finalización sin duplicar íntegramente el procedimiento.

| Agente | Responsabilidad y handoff conservados |
|---|---|
| Kiwi | F0–F2, estructura y geometría; Lima revisa antes de presentación; preserva producción, API, tokens y registry |
| Lima | Contratos, tokens, registry y gobierno; devuelve reparaciones al autor correspondiente |
| Coco | F3/CSS y auditoría R0; deriva funcionalidad a Bruno y documentación a Mora |
| Bruno | R3 funcional; conserva anatomía/CSS/tokens; entrega a Coco R0 |
| Mora | Documentación desde código, registry y evidencia; preserva propiedad visual y funcional |
| Fruti Squad | Objetivo, alcance, entregable y coordinación por dueño; no implementa desde orquestación |
| Asset Producer | Produce assets en rutas asignadas; aceptación del asset no aprueba la propuesta UI |
| Documenter | Auxiliar documental de Mora; extrae hechos sin canonizar drift de código como tokens o contratos |
| Finish Reviewer | Revisión de solo lectura con evidencia vigente; `ship` no sustituye gate, R0 ni aprobación del usuario |
| Manual Edit Applier | Aplica batch autorizado y acotado; verifica handoff, devuelve entradas fuera de alcance y conserva su formato de resultados |

Los cuatro helpers de `.agents/skills/impeccable/agents/` se sincronizan con `.codex/agents/`; son mirrors distribuidos, no un segundo discovery root. Se preservan los originales históricos `.kiro`, sus nombres y los contratos de salida detallados.

## Contradicciones y propiedades corregidas

- Se retiró `nickname_candidates` de la raíz de los cuatro helpers activos: TOML válido, pero propiedad no admitida ahí por el esquema consultado. Sí está admitida en una declaración `[agents.<rol>]`. No se crea una configuración general para conservar aliases decorativos ni se altera la fuente histórica.
- El prefijo genérico imponía modo revisión a helpers que escriben. Ahora se distingue productor, documentalista, revisor y aplicador, conservando el alcance propio de cada uno.
- La documentación distinguía insuficientemente código observado de norma aprobada. Se exige registrar y derivar drift a Lima/Coco, sin promoverlo automáticamente a autoridad de diseño.
- El aplicador daba por existente un clic de aprobación; ahora verifica autorización vigente para el batch, sin inventarla ni solicitarla repetidamente cuando ya existe.
- El revisor limitaba todas las referencias a capturas/imports; ahora también lee las instrucciones y protocolos obligatorios, conservando su inspección de evidencia y carácter de solo lectura.
- Las cadenas multilínea utilizan literales TOML; se comprueba conservación de barras, comillas, Unicode y saltos. Las transformaciones de helpers se registran en `scripts/codex-corrections.json`; la generación y manifiesto mantienen trazabilidad.

No se inventan campos `role` o `workflow`. `permissions` no es universalmente inválido: el esquema admite perfiles de permisos en su ubicación definida. El esfuerzo es una cadena no vacía; el esquema no certifica que el modelo real admita un valor concreto. `agents.max_threads` se acepta como alias documentado en una copia de validación, sin reescribir formatos compatibles; declarar simultáneamente ambos aliases se reporta como ambigüedad.

## Orquestación y compuertas

Las delegaciones reciben objetivo, alcance, entregable e identidad vigente. Los revisores reciben contrato, casos y evidencia actual, no una afirmación de PASS. No se ejecutan etapas dependientes en paralelo ni se escriben los mismos archivos concurrentemente sin coordinación; el revisor no modifica la propuesta mientras la inspecciona.

La fuente canónica del gate es `.codex/qa/pre-delivery.md`. Cada agente debe leerla para UI renderizada. Se mantienen `IN_PROGRESS`, `RETURN` y `READY_FOR_USER_REVIEW`, la recuperación por dueño y el navegador obligatorio. La revisión propia no se presenta como independiente. Progreso, preguntas imprescindibles y reportes de bloqueo se permiten sin afirmar entrega aprobada.

`continuation.json` conserva la ruta, productor/consumidor, identidad y hashes definidos por el protocolo. Las acciones fuera de alcance se derivan; un archivo ausente u obsoleto no concede autorización. No se inventan reintentos ilimitados, aprobaciones sustitutivas ni un número universal de pasadas: persiste la laguna temporal documentada en la auditoría de skills.

## Validación por capas

| Capa | Resultado y alcance |
|---|---|
| Sintaxis TOML | PASS: diez nativos, cuatro mirrors y cuatro fuentes históricas; sin claves duplicadas |
| Esquema documentado | PASS: catorce activos; histórico recibe únicamente sintaxis; config general ausente, no un PASS de carga |
| Regresiones del validador | PASS: identidad versus config, ubicación de aliases, tipos/unknown keys, compatibilidad legacy, duplicados, literal multilínea e inventario; no ejecutan agentes |
| Coherencia documental | Revisadas entradas, límites, handoffs, responsabilidades, evidencia, revisión independiente y estados contra skills/protocolos leídos |
| Paridad y paquete | Generación, YAML/referencias/hashes, instalación y tests de contratos; los 33 compartidos y fuente Kiro permanecen intactos |
| Carga nativa | **No verificada**: falta versión/CLI ejecutable del consumidor |
| Ejecución de los diez agentes | **No verificada**: no se realizaron spawns nativos ni el flujo de diseño de un consumidor |

Reproducción en el checkout con Python 3.11+:

```bash
python3 -m pip install PyYAML 'jsonschema>=4,<5'
python3 scripts/build-codex.py
python3 scripts/validate-codex.py
python3 scripts/validate-codex-toml.py
python3 -m unittest discover -s test -p 'codex_toml_test.py'
npm test
npm pack
```

El CI ejecuta ambas validaciones separadas y la regresión. Una captura, build o parseo no demuestran apariencia, teclado ni operación de Codex. El defecto reportado de NsaEncabezado no se declara reparado por estos cambios.

## Actualización y pendientes

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex install --update-tools
```

Reconciliar conflictos reales sin sobrescribir indiscriminadamente la ronda del consumidor. Para completar validación nativa, registrar allí versión de Codex, configuración efectiva y origen de overrides; comprobar discovery y delegación con un entregable acotado antes de recorrer el gate UI. Se mantiene pendiente esta prueba, sin rebajar calidad ni modificar configuración para facilitar el cierre.
