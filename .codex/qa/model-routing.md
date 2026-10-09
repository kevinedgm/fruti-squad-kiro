# Asignación y escalamiento de recursos

Lee este protocolo antes de delegar, iniciar una operación distinta o solicitar más capacidad. Las rutas son relativas a la raíz del consumidor. No cambia responsabilidades, contratos, permisos, concurrencia, revisores ni compuertas de `.fruti/policy.md` y `.codex/qa/pre-delivery.md`.

## Configuración y disponibilidad

Los campos ejecutables son `model` y `model_reasoning_effort` en `.codex/agents/*.toml`. El mapa fuente está en `scripts/build-codex.py`; los cuatro helpers se reproducen mediante `scripts/codex-corrections.json`. Este documento y los SKILL.md orientan la decisión: no seleccionan un modelo por sí solos.

El paquete no crea `.codex/config.toml`. El coordinador fija Sol `medium` para mezclar operaciones y recuperaciones sin perder sus límites. Los especialistas tienen defaults específicos; una skill invocada directamente conserva el modelo de su sesión hasta una selección real.

Antes de aplicar un override, comprueba el catálogo del cliente y su esfuerzo permitido. En Codex CLI, registra `codex --version`; si el cliente incluye el comando, consulta `codex debug models --help` y `codex debug models`. `/model` permite ver opciones de sesión. Un catálogo `--bundled`, una lista de API o un TOML parseable no demuestran acceso autenticado ni carga efectiva. No instala ni actualiza Codex para fingir esta comprobación.

Los identificadores están documentados oficialmente, pero la instalación del consumidor debe confirmar acceso a `gpt-6-luna`, `gpt-6.1-sol` y, solo si se necesita, `gpt-6-astra`. Comprueba también `low`, `medium` y `high` para el modelo y cliente. La documentación recomienda empezar Luna en `high`; `low` aquí es una hipótesis restringida a extracción y cambios inequívocos, pendiente de evaluación representativa del consumidor.

Si falta acceso al modelo/esfuerzo, registra el error y conserva un modelo disponible adecuado, mediante selección real. No afirma que el TOML se aplicó, no cambia provider ni permisos y no usa API como fallback implícito. Si no hay alternativa capaz o mecanismo de selección, reporta el bloqueo de esa operación; conserva el trabajo válido.

## Elegir por operación

| Operación | Recursos iniciales | Evidencia para aceptar |
|---|---|---|
| Inventario, imports/usos, extracción sin inferencias, enlaces/copy inequívocos | Luna `low` en un encargo acotado | Rutas reales, fuente propietaria, diff y checks reproducibles; incertidumbres explícitas |
| Síntesis documental o reconciliación dentro de un contrato ya resuelto | Sol `medium` | Comparación por campo con fuentes; deriva y dueño; revisión documental/preview pertinente |
| F3/CSS con lock y tokens aprobados | Sol `medium` | Diff dentro del lock, checks, matriz y revisión Lima exigidos |
| R3 funcional delimitado | Sol `medium` | API preservada, estados, pruebas funcionales, teclado/foco y Coco R0 |
| R0, review visual/funcional, motion contextual | Sol `high` | Casos, capturas/traces realmente inspeccionados, reglas y contradicciones explicadas |
| Nuevas estructuras/interacciones, contratos o dependencias entre piezas | Sol `high` | Alternativas/decisiones justificadas, locks, impactos, aprobación/revisión del dueño |
| Problema sistémico que sigue sin explicación tras un intento fundamentado | Astra `medium`, solo tras diagnóstico | Reproducción, hipótesis descartadas e impacto multicomponente; mismos criterios finales |

Una actualización de prop/copy con código, registry, contrato, ruta y texto ya coincidentes es un delta inequívoco: conserva Luna `low`. Comparar esas fuentes para confirmar coincidencia no la convierte en síntesis compleja. Usa Sol `medium` cuando realmente haya que construir una síntesis o resolver inconsistencias dentro de autoridad ya definida; no propone subir recursos solo por pertenecer a documentación.

Usa herramientas existentes para formateo, YAML/TOML/JSON, hashes, build y checks deterministas. No crea una delegación solo para ejecutar un script ni considera necesario Astra para inspeccionar un fallo conocido.

## Diagnosticar antes de escalar

1. Clasifica la causa: información faltante, contradicción normativa, herramienta ausente, fallo de entorno o dificultad de razonamiento.
2. Para datos faltantes, inspecciona la fuente o pregunta la decisión imprescindible. Para herramientas/entorno, aplica recuperación de `.codex/qa/pre-delivery.md`. Un modelo mayor no sustituye estos recursos.
3. Deriva conflictos de propiedad al dueño vigente. Aumentar capacidad no autoriza al receptor a resolver decisiones ajenas.
4. Escala razonamiento cuando las fuentes suficientes dejan requisitos incompatibles, dependencias amplias, una decisión arquitectónica entre piezas o evidencia visual/funcional contradictoria. Un fallo persistente requiere un intento fundamentado con hipótesis, prueba y resultado; `RETURN` aislado no dispara escalamiento.
5. Si ya usa Sol `medium`, prueba Sol `high` antes de Astra cuando la dificultad sea local. Si ya usa Sol `high` y persiste un problema sistémico explicado en el registro, considera Astra `medium`. No utiliza Astra, `xhigh` ni `max` como defaults generales.
6. Cambia una variable por comparación cuando sea viable: esfuerzo primero dentro del modelo, o modelo conservando esfuerzo compatible. Pasar de Luna `low` a Sol `medium` es un cambio compuesto: registra esa limitación y no atribuye el resultado a una sola variable.
7. Reevalúa con las mismas entradas y criterios. No repite una delegación idéntica indefinidamente ni agota capacidad por un defecto reparable conocido. Si no queda recuperación viable, registra el bloqueo del protocolo, sin fabricar PASS.

## Mecanismos reales y precedencia

En la documentación consultada, los valores de un agente personalizado prevalecen sobre los de spawn. Antes de cargar ese archivo se resuelve cada valor desde spawn explícito, default `[agents]` y padre. Por eso pedir «Coco high» mientras su archivo fija `medium` no demuestra un cambio efectivo. No promete que un agente cambie su propio modelo durante su turno.

- Si el host ofrece una nueva delegación genérica con modelo/esfuerzo explícitos, el coordinador puede iniciar la misma operación del mismo dueño sin aplicar la capa TOML fija. Debe entregar y exigir lectura de las instrucciones originales de `.codex/agents/<dueño>.toml` como texto, AGENTS, SKILL, runtime y contratos. Leer el TOML como texto no aplica su configuración. Conserva alcance, outputs y rol revisor; no crea otro rol ni otro agente instalado.
- Comprueba la configuración realmente resuelta de esa nueva sesión antes de atribuirle un resultado. En Work, utiliza solo los argumentos que su herramienta de delegación ofrece; no asume que carga estos TOML.
- Si solo existe invocación del agente personalizado fijo, no simula un override. Usa una selección explícita admitida en una sesión del mismo rol (por ejemplo el picker del cliente), o informa qué selección/configuración necesita el coordinador/usuario. No reescribe defaults persistentes para un caso aislado sin registrar el cambio.
- Sin mecanismo real de cambio, continúa lo resoluble en el modelo actual y marca el escalamiento pendiente. No omite revisión ni pide al usuario que diagnostique un fallo básico.

La herencia de herramientas, permisos y restricciones vivas del padre sigue siendo independiente de la selección de modelo. No abre escritores simultáneos sobre los mismos archivos al trasladar trabajo.

## Evidencia que se transfiere

Adjunta al handoff vigente, sin cambiar su esquema canónico, un enlace a las notas de la operación: objetivo; artifact/round/revision; fuente/commit/hashes; archivos exclusivos; contrato y aprobaciones; comando/caso fallido; evidencia; hipótesis/intento/resultados; causa del escalamiento; recursos anteriores y solicitados; mecanismo real; configuración confirmada o no verificada; pendientes y mismo criterio de aceptación. Reutiliza las notas/declaración de la ronda, sin copiar manuales completos.

Un revisor recibe evidencia vigente independientemente del modelo productor. El cambio de recursos no conserva un PASS para artefactos modificados. Gate, navegador obligatorio, independencia declarada, aprobaciones y reparación por dueño permanecen iguales.

## Comparación y criterio de salida

Para evaluar una asignación, fija entrada/revisión, alcance, tarea y aceptación antes de ejecutar. Registra recursos efectivos, checks, devoluciones/reparaciones, tiempo total observado y consumo solo si el host lo expone. Mide también captura, revisión y reparación, no solo tiempo de una respuesta.

Conserva la alternativa más ligera que cumpla todos los criterios observables del caso. Un caso documental no valida todo el rol ni una UI. Si no puede comparar modelos, etiqueta la asignación como configurada/propuesta sin ahorro medido; sintaxis y esquema no prueban calidad, disponibilidad o carga nativa.

## Fuentes oficiales consultadas el 2026-10-09

- [Models](https://learn.chatgpt.com/docs/models).
- [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
- [Developer commands](https://learn.chatgpt.com/docs/developer-commands).
- [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference).
