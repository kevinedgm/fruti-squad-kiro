# Validación de paridad Codex

Fecha: 8 de octubre de 2026. Línea base: `47141906fd0731ac3a8b3d25bd56678d2488d81b`.

| Comprobación | Resultado | Alcance |
|---|---|---|
| Comparación con commit Kiro | PASS | Fuente `.kiro` y 33 archivos compartidos sin cambios |
| Paridad de recursos | PASS | 113 archivos; comparación independiente del cuerpo y transformaciones, más hashes |
| Contratos normativos | PASS | Política, 5 runtimes, 4 contratos, audit manifest, defaults y handoffs preservados |
| Formato de skills | PASS | 8 SKILL.md con YAML válido; validación skill-creator y propia |
| Formato de agentes | PASS | 10 TOML parseados; nombres/descripciones/instrucciones obligatorias |
| Resolución de referencias | PASS | Referencias de operaciones y assets del runtime existentes bajo raíces Codex |
| Instalación e init | PASS | Dry-run, instalación repetida, preservación de conflictos, starter y existing |
| CLI y tematización | PASS | install/init/theme/help; validación de colores y preservación de valores |
| Tarball real | PASS | npm pack, npm install/postinstall e init en consumidor vacío |
| Selección escrita de skills | PASS | 12/12 prompts, ocho skills y backend fuera de alcance; contexto independiente, no cliente Codex |
| Scripts instalados desde raíz | PASS | Verificador Kiwi y bootstrap Lima ejecutados desde consumidor vacío |
| Paquete de plugin | PASS de estructura | Manifiesto de compatibilidad, versión y ruta skills; sin instalación en directorio de plugins |
| Prueba operativa escrita | PASS | Bloqueos de F3, auditoría de otra ronda, build correcto con fallo visual y auditoría sin cambios |
| Cliente Codex CLI real | NO EJECUTADO | No disponible en el entorno de validación |
| Calidad de una UI concreta | NO EJECUTADO | Requiere producto, datos, perfil aprobado, navegador y capturas de entrega |

## Prueba operativa escrita

Un agente en contexto independiente recibió la skill coordinadora y este encargo: estructura r03 aprobada, contrato Lima sin blockers, F3 presentado pero no aprobado, compliance-current de r02; se pidió implementar con Bruno y documentar como stable. Después se planteó aprobar F3, obtener build correcto y revisión visual fallida, con pedido limitado a auditar.

Respondió:

- conservar estructura y contrato vigentes; no reiniciar descubrimiento;
- solicitar aprobación concreta de F3 antes del downstream R3;
- no reutilizar compliance r02 como evidencia de r03;
- no afirmar stable sin auditoría y gates vigentes;
- recorrer Bruno → Coco R0 → Lima gate → Mora al cumplir las entradas;
- en auditoría directa, activar solo Coco R0, informar technical PASS y visual FAIL por separado y evitar PASS global;
- no aplicar correcciones por una solicitud limitada a auditar;
- declarar que era un escenario escrito sin ejecución ni evidencia real de producto.

Esta prueba verifica interpretación del procedimiento; no mide identidad visual de resultados ni sustituye la aceptación UI del proyecto.

## Criterio de aceptación de cada entrega

Aplicar la misma política y audit manifest de Kiro a un artefacto real. Verificar técnica, estructura, visual, accesibilidad, design system y documentación. Registrar resultados por dimensión y evidencia vigente de la ronda. Una capacidad faltante no se da por comprobada.

La adaptación conserva los mismos requisitos de calidad. La calidad final depende de ejecutarlos y satisfacerlos sobre el producto, con los permisos y herramientas efectivos del host.

## Correcciones de la auditoría

Versión 0.3.1, rama `codex`:

- Kiwi y los diagramas de Coco/Mora asignan la funcionalidad R3 a Bruno. Coco conserva F3/CSS y la auditoría R0; Lima recibe el gate antes de Mora.
- Los comandos Kiwi/Lima usan rutas explícitas desde la raíz del proyecto. Se ejecutaron el verificador Kiwi y el bootstrap Lima desde una instalación temporal.
- Improve Animations mantiene su contrato de asesor sin editar producto. `execute` entrega el plan al squad con las mismas aprobaciones; se elimina la dependencia de una skill de revisión no distribuida y la contradicción del inicio sin tarea.
- Se elimina el permiso textual heredado de avanzar con Coco sin las entradas obligatorias. Declarar una desviación no permite F3/R3 ni PASS.
- Los cambios de texto anterior/nuevo están en `scripts/codex-corrections.json` y en el manifiesto de paridad; regenerar no pierde las correcciones. El validador contrasta el cuerpo completo con el origen más estas transformaciones declaradas.
- Se añaden doce prompts reproducibles en `test/activation-cases.json`, regresiones de propiedad/alcance y el registro bruto `docs/codex-forward-test.json`. Un agente independiente eligió el dueño esperado en 12/12 y mantuvo los bloqueos de aprobación y de ronda. Es una evaluación escrita, no una prueba de activación del host.
- `.codex-plugin/plugin.json` empaqueta las skills con el formato de compatibilidad soportado. La instalación completa por npm sigue siendo necesaria para provisionar los contratos, el estado y los agentes del proyecto. El plugin no está publicado ni probado en el directorio.

Referencia de autoría: https://learn.chatgpt.com/docs/build-skills
Formato de plugin: https://developers.openai.com/plugins/build/plugins

No se afirma cumplimiento ejecutado del 100% ni identidad de calidad visual: quedan pendientes el cliente Codex real y la aceptación de una UI concreta con evidencia.

## Reparación del ciclo de evaluación (0.3.2)

El reporte estático limpio no prueba una interfaz completa. Se reprodujo un encabezado con altura fija y overflow hidden que obtiene cero errores y avisos estáticos. La nueva captura en Chromium detectó el recorte y el gate rechazó la entrega; al reparar la altura, la prueba de render pasó. La evidencia recién capturada sin firma de revisión permaneció bloqueada. El resultado READY de la prueba usa una firma sintética exclusivamente para comprobar la mecánica del gate, no como juicio visual de un producto.

Se prueban además rechazo de ronda/revisión antigua, fuente o plan cambiado, caso omitido, imágenes/traces reutilizados, fallo de interacción, teclado ausente, hallazgo abierto/sin reprobación y revisión de capturas/traces ausente. El test de instalación verifica actualización de herramientas con backup y conservación de perfil, estado y configuración.

Un revisor independiente del código detectó rutas de bypass del gate (hallazgos ignorados, captura/trace repetido, plan omitido, aumento declarado sin método), que se corrigieron y añadieron a regresiones. También detectó un falso positivo con scroll interno permitido; el recolector respeta el scrollport intermedio y el test en navegador comprueba el caso válido y el recorte por padre que sigue siendo inválido.

El ciclo productor → revisor → dueño → reprobación es obligatorio antes de presentar propuestas. Las aprobaciones reales del usuario siguen siendo independientes. Las pruebas no verifican todavía el componente nsaEencabezado.vue del consumidor ni una ejecución autónoma completa en su cliente Codex.
