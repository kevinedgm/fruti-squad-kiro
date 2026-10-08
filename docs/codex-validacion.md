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
