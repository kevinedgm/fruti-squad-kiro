# Auditoría de modelos y esfuerzo · 0.3.9

Fecha de documentación: 2026-10-09 UTC / 2026-10-08 en México. Base anterior: `d0b2ad83f4af0d2acaa16ddbd8e1df17e02ee347`, versión del paquete 0.3.8. El objetivo es disminuir recursos innecesarios manteniendo propietarios, contratos, permisos, gates y evidencia. Las asignaciones de producto son iniciales; no se declara ahorro medido.

## Inspección y compatibilidad

Se inspeccionaron AGENTS.md, ocho skills activas, diez TOML nativos y cuatro mirrors, los cinco runtimes, política y protocolo QA, generador, configuración distribuida, guía e instalador. Las fuentes `.kiro` permanecen históricas e inmutables. No se modifican skills instaladas fuera del proyecto.

No existe `.codex/config.toml` ni versión de Codex fijada en dependencias/configuración. `codex` no está disponible en PATH: no se pudo identificar una versión instalada ni consultar el catálogo autenticado local. No se instala un cliente diferente para presentarlo como la instalación del usuario. 0.3.9 es la versión de esta distribución, no de Codex.

Fuentes oficiales abiertas y consultadas:

- [Models](https://learn.chatgpt.com/docs/models): confirma `gpt-6-luna`, `gpt-6.1-sol` y `gpt-6-astra` para Work/Codex, con acceso condicionado por cliente/cuenta/workspace.
- [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents): campos `model` y `model_reasoning_effort`, defaults, herencia y precedencia del agente personalizado.
- [Developer commands](https://learn.chatgpt.com/docs/developer-commands): `codex debug models`, catálogo bundled y picker `/model`.
- [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference): tipos y límites de ámbito. Se utiliza el esquema fechado y verificado en la auditoría TOML anterior.

El host de esta sesión anuncia los tres modelos y esfuerzos `low`, `medium` y `high` en la herramienta de delegación. Se aceptaron y completaron delegaciones con Luna low y Sol medium; Astra no se ejecutó. La herramienta no expone una atestación del modelo interno resuelto ni consumo por tarea: son evidencia de solicitudes aceptadas y resultados, no discovery/carga nativa de estos TOML. No se deriva disponibilidad de Codex desde una lista o precio de API.

La guía oficial recomienda comenzar Luna en high. Se restringe low a operaciones inequívocas según la matriz solicitada; el caso textual de delta tuvo resultado conforme, pero la ejecución real de documentación/copy en el consumidor sigue pendiente. Los niveles efectivos de cada modelo deben confirmarse allí en `/model` o el catálogo del cliente. El esquema admite cadenas, no demuestra acceso ni disponibilidad de un nivel.

## Asignación final

«Heredado» significa no declarado en la base 0.3.8; el modelo anterior efectivo es desconocido. Los nombres Luna, Sol y Astra en esta tabla corresponden a los identificadores exactos arriba. Las pautas de skills no cambian por sí mismas el modelo de una sesión.

| Agente o skill | Actividad habitual | Modelo anterior | Modelo asignado | Esfuerzo | Justificación | Condición de escalamiento |
|---|---|---|---|---|---|---|
| Kiwi / `$kiwi` | F0–F2, jerarquía, adaptación, alternativas | Heredado | Sol | heredado → high | Juicio estructural y efectos en todas las etapas | Conflicto multicomponente persistente con fuentes suficientes; Astra medium solo tras diagnóstico. Inventario/patrón literal puede usar Luna low en sesión acotada |
| Lima / `$lima` | Contratos, reutilización, review, gates | Heredado | Sol | heredado → high | Propiedad normativa, excepciones y dependencias | Requisitos sistémicos incompatibles tras intento fundamentado; no usar Astra para suplir foundations/aprobaciones ausentes |
| Coco / `$coco` | F3/CSS aprobado; después R0 | Heredado | Sol | heredado → medium | Implementación visual bajo lock/tokens ya resueltos | R0 o juicio visual/contextual requieren selección real Sol high antes de interpretar evidencia |
| Bruno / `$bruno` | API/script/template R3 aprobado | Heredado | Sol | heredado → medium | Implementación funcional delimitada | Estado asíncrono/foco entre rutas o dependencias amplias: Sol high; conflicto sistémico no explicado, diagnóstico antes de Astra |
| Mora / `$mora-docs` | Delta documental, inventario y enlaces inequívocos | Heredado | Luna | heredado → low | Fuentes propietarias resueltas, salida verificable | Síntesis/reconciliación real: Sol medium. Conflicto de autoridad vuelve al dueño; no decide contratos |
| Fruti Squad / `$fruti-squad` | Coordinar distintas operaciones y recuperaciones | Heredado | Sol | heredado → medium | Comparación de enrutamiento: Sol cumplió seis casos; Luna low falló dos decisiones complejas | Diagnóstico contextual complejo Sol high; Astra medium solo para problema sistémico persistente, conservando propietarios |
| impeccable_asset_producer | Assets/crops y comps bajo packet/spec | Heredado | Sol | medium → medium | Restricciones visuales y salida a herramienta de imagen | Desviación persistente con referencia suficiente: revisión Sol high del caso; no permite nueva dirección ni cambia modelo de imagegen |
| impeccable_documenter | DESIGN/sidecar, síntesis desde fuentes aprobadas | Heredado | Sol | medium → medium | Resuelve representación y drift sin canonizarlo | Interpretación contradictoria Sol high; autoridad disputada se deriva a Mora/Lima/Coco |
| impeccable_finish_reviewer | Inspección independiente de capturas/imports | Heredado | Sol | high → high | Juicio visual no determinista, impacto de falso PASS | Evidencia suficiente contradictoria o problema sistémico diagnosticado; capturas ausentes requieren recapture, no modelo mayor |
| impeccable_manual_edit_applier | Batch de texto autorizado y target inequívoco | Heredado | Luna | medium → low | Atomicidad, alcance estrecho y checks de fuente | Resolución local difícil dentro del mismo alcance: Sol medium. Dependencia amplia/ambigua falla la entrada y se deriva, sin ampliarla |
| `$impeccable` (sin TOML propio) | Crítica/auditoría o playbook del dueño | Sesión/rol | Sesión/rol; pauta Sol | high para review; medium edición; low extracción/copy | Actividades distintas bajo responsables existentes | Evidencia contextual contradictoria; aplica diagnóstico y mantiene review/canonical R0 separados |
| `$improve-animations` (sin TOML propio) | Inventario y planes de motion | Sesión/rol | Sesión/rol; pauta Luna/Sol | low extracción; high juicio/planes | Distingue extracción de usos de física/interrupción/gestos | Dependencias motion/estado multicomponente no explicadas; sigue siendo advisor, no ejecutor |

No hay default Astra, xhigh ni max. No se crean agentes ni se obliga a delegar todos los trabajos. Scripts siguen siendo la vía de formateo, validación de esquemas, hashes, build y checks reproducibles.

Se decidió no introducir un default global en `.codex/config.toml`: no existe y el instalador lo preserva. Cada agente necesita recursos por tarea habitual y puede ser llamado independientemente del coordinador. Por eso los diez defaults se declaran individualmente de forma deliberada; no se cambia el modelo general del usuario. La herencia se conserva para herramientas/permisos y para skills activadas directamente. Si el consumidor ya tiene un default compartido adecuado, puede reconciliar su TOML con omisión de campos, verificando su configuración efectiva; el paquete no lo hace silenciosamente.

## Análisis de tareas, impacto y frecuencia

No hay telemetría de frecuencia ni consumo. Las frecuencias siguientes son inferencias del flujo/runtimes, no mediciones de uso.

| Rol | Ambigüedad / dependencias / juicio | Impacto de error | Frecuencia prevista y evidencia exigida |
|---|---|---|---|
| Kiwi | Alta al diseñar; baja en inventory; estructura afecta locks, foco y adaptación | Propaga una estructura incorrecta a todo el pipeline | Por ronda y devolución estructural; brief, alternativas, matriz, geometría, navegador y review Lima |
| Lima | Alta en contratos/excepciones; baja en censos deterministas | Tokens, propiedad y lifecycle incorrectos afectan varias piezas | En contrato, reviews y gate; fuentes aprobadas, compliance Coco, decisiones y registry coherentes |
| Coco | Media en F3; alta en R0 contextual; padres/imports/tokens | Recortes, densidad o falso cumplimiento | F3 y después R3, además de auditorías; build/checks y revisión real por caso |
| Bruno | Media delimitada; alta en async/foco/estado compartido | Conducta, teclado y recuperación incorrectos | R3 y reparación funcional; API, tests, traces, tareas de teclado y Coco R0 |
| Mora | Baja en delta resuelto; media en síntesis; depende de código/registry/QA | Documentar una API o norma incorrecta | Al final/deltas o auditoría Hub; fuente por campo, diff, links y preview pertinente |
| Coordinador | Media: heterogeneidad, recuperación y orden de dependencias | Saltar fases, enviar al dueño equivocado o certificar sin review | Durante toda ronda; entradas completas, identidad, locks, estado y checkpoints vigentes |
| Asset Producer | Media: referencia, spec y juicio de desviación | Asset inutilizable o deriva visual | Solo regiones/cards asignadas; output medido y revisión del padre, no gate UI |
| Documenter | Media: síntesis, sidecar y distinción norma/observación | Canonizar drift como regla | Cuando se solicita documento del sistema; comparación aprobada, salidas y deriva registrada |
| Finish Reviewer | Alta: interpretar evidencia de varios casos | Falso ship/PASS oculta fallos | Revisión final; capturas/traces/comps actuales inspeccionados; no sustituye Coco R0 |
| Manual Edit Applier | Baja si target/copy resueltos; mayor en acoplamientos | Edición errónea o parcial de fuente | Por batch autorizado; atomicidad, source checks y JSON exacto, gate en el padre |
| Impeccable / motion | Baja en extracción; alta en crítica/feel | Recomendación o reparación sin sustento | Por playbook/pedido; reglas, evidencia, owner y limits; planes no certifican implementación |

## Escalamiento y configuración efectiva

La fuente canónica es `.codex/qa/model-routing.md`, leída explícitamente por diez agentes y ocho skills. Clasifica información, contradicciones, herramientas/entorno y dificultad de razonamiento. `RETURN` solo no dispara escalamiento. Faltantes normativos y ausencia de navegador no se compensan con Astra.

En la documentación vigente, el TOML personalizado prevalece sobre spawn; no se promete que un agente fijado cambie su propio modelo. Para una excepción, el coordinador debe comprobar un mecanismo real: nueva delegación genérica con selección explícita y lectura de las instrucciones del mismo rol como texto, o selección compatible en una sesión del dueño. Se transfiere identidad, scope/archivos, lock/aprobaciones, fuentes/hashes, reproducción/intento/resultados, causa, recursos solicitados y misma aceptación. No se aplica el TOML fijo en la sesión genérica ni se finge que leerlo aplica su configuración.

Si no hay ese mecanismo, registra selección pendiente y continúa lo resoluble; no elimina gate ni navegador. Capturas, review, aprobaciones y hashes siguen ligados a la revisión real. No cambian sandbox, approval policy, provider, MCP, habilitación de skills, red ni concurrencia.

## Comparación representativa de enrutamiento

Se ejecutaron dos delegaciones nuevas en Work, una solicitada con `gpt-6-luna`/`low` y otra con `gpt-6.1-sol`/`medium`, mismo prompt y seis solicitudes. No implementaron ni escribieron. Los casos se conservan en `test/model-routing-cases.json`; SHA-256 `81ee992f359374544ceda2dbe349ebf1f4fdf28f4ef0f390932533b98f04d6b0`. Se verificaron 21 entradas/hashes congeladas durante la comparación; el registro está en `test/model-routing-evaluation.json`. El protocolo de esa instantánea aún permitía herencia de modelo del coordinador; la comparación sustenta su default final Sol medium.

Aceptación antes de evaluar: dueño vigente, recursos correspondientes a la actividad, fuente/alcance/review preservados, recuperación de herramienta antes de ampliar modelo, evidencia de handoff y ninguna afirmación de selección/QA no ejecutados.

| Caso | Luna low | Sol medium |
|---|---|---|
| Delta de prop con todas las fuentes coincidentes | Conforme: Mora, Luna low; no toca API/preview | Conforme |
| R0 con recorte real pese a checker verde | Conforme: Coco/Sol high y devolución | Conforme; explicita medium fijo del TOML y selección pendiente |
| Foco asíncrono entre rutas, intento fundamentado fallido | Insuficiente: mantiene medium y no aplica la excepción high de Bruno | Conforme: Sol high, diagnóstico local, sin Astra |
| NEW sin foundations aprobados; se pide Astra para inferirlos | Conserva bloqueo/aprobación, pero asigna Lima medium contrario a su actividad normativa/high | Conforme: deriva a Lima, no sustituye aprobación por modelo |
| Integración de navegador falla; Playwright permitido sin probar | Conforme: recuperación, no Astra | Conforme |
| Tres contratos incompatibles, Sol high e intento sistémico fallido | Conforme: considera Astra medium sin cambiar decisiones ajenas | Conforme |

Resultado documental: Luna cumple 4/6 decisiones completas; Sol 6/6. Es revisión de las respuestas contra los contratos leídos, no validación de UI ni benchmark completo del rol. Luna queda para tareas resueltas; Sol es la alternativa más ligera **entre las dos evaluadas** que cumplió todos estos casos. Luna medium, Sol low y Astra no se compararon: no se afirma óptimo global.

El intervalo observado de la pareja fue aproximadamente 91 segundos, desde preparar la comparación hasta observar ambas entregas. Incluye orquestación/observación; no hay tiempos totales comparables por modelo, telemetría de tokens/créditos ni costo de reparaciones UI. Una prueba previa detectó recomendación innecesaria de subir un delta documental; se aclaró ese criterio antes de congelar la comparación. No se usa la prueba previa para comparar latencia.

## Archivos y validación

- Diez `.codex/agents/*.toml`: modelo/esfuerzo y lectura del protocolo; cuatro helpers mirror en `.agents/skills/impeccable/agents/`.
- Ocho `.agents/skills/*/SKILL.md`: actividades rutinarias/complejas y escalamiento, sin campos de modelo en YAML.
- `.codex/qa/model-routing.md`, AGENTS.md, README y guías/informes: fuente de escalamiento y herencia correcta.
- Generador, ledger, manifiesto, prueba de retención de identidad/instrucciones/configuración no relacionada, casos/registro de comparación y versiones package/plugin.

Las validaciones separan TOML/YAML, esquema/tipos, referencias/paridad, coherencia y ejecución. La prueba contra la base 0.3.8 conserva nombres/descripciones, instrucciones previas y toda propiedad ajena a recursos. El generador mantiene 113 adaptaciones y 33 compartidos; no toca producto ni fuentes Kiro.

### Resultados realizados

| Comprobación | Resultado |
|---|---|
| `scripts/validate-codex.py` | PASS: YAML, referencias, 113 recursos y 33 compartidos íntegros |
| `scripts/validate-codex-toml.py` | PASS: sintaxis y esquema documentado en 14 activos; carga nativa no verificada |
| Diez unit tests TOML | PASS: incluye retención de identidad, instrucciones y propiedades fuera de recursos frente a 0.3.8 |
| `npm test` | PASS: instalación/init, CLI, cobertura documental de activación y gate |
| Regeneración | PASS: 153 archivos byte a byte idénticos |
| `npm pack` e instalación nueva | PASS: 0.3.9, diez agentes, ocho skills y protocolo; modelo/concurrencia preexistentes del consumidor intactos |
| Comparación de enrutamiento Work | Ejecutada: 6 casos, Luna low 4/6, Sol medium 6/6; consumo/modelo resuelto interno no expuestos |
| `git diff --check` | PASS: sin errores de whitespace; revisión sin cambios en producto/contratos/permisos |

## Pendientes y actualización

Pendientes: versión/catálogo autenticado del consumidor; esfuerzos aceptados por su cliente; carga nativa de los diez agentes; pruebas de implementación/CSS/visual y escalamiento real con evidencia completa; consumo y tiempo total por ciclo. Las asignaciones son configuración escrita respaldada por análisis y una evaluación de enrutamiento acotada, no ahorro medido ni garantía universal de calidad.

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex install --update-tools
```

Confirmar 0.3.9 y reconciliar conflictos del consumidor; no sobrescribir estado/aprobaciones indiscriminadamente. Al probar recursos, conservar las mismas entradas y requisitos de aceptación, registrar modelo/esfuerzo realmente resueltos, devoluciones, tiempo total y consumo disponible; quedarse con el menor recurso que supere el gate real.
