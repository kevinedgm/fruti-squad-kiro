# Auditoría de continuidad Fruti · Codex 0.3.11

## Problema y corrección

Los handoffs podían finalizar la respuesta del coordinador aunque el encargo completo tuviera trabajo autorizado pendiente. El lifecycle además esperaba una petición adicional de estabilización. El adaptador ahora conserva el objetivo completo y continúa las operaciones ejecutables después de cada subtarea; candidate no es un bloqueo terminal.

La fuente canónica es `.codex/qa/orchestration.md`, relativa a la raíz del consumidor. La cargan expresamente el orquestador, los cinco especialistas y los seis agentes principales. La instalación distribuye ese protocolo y conserva archivos de estado del consumidor.

- Kiwi presenta tres alternativas estructurales distintas, revisadas por Lima. Ante rechazo total inicia otra ronda, incluso sin observaciones.
- Lima conserva gobierno, contratos y tokens; Coco construye F3/CSS; Bruno implementa R3; Coco audita y devuelve cada defecto a su dueño.
- Una dirección aceptada en un encargo completo permite preparar harden, auditoría y demo sin otra orden de etapa.
- Las aprobaciones F2, F3, stable y promoción siguen vigentes. La emulación no prueba toque físico ni zoom nativo.
- La implementación revisada se presenta para ajustes o documentación formal con Mora cuando no estaba ya solicitada. Registros internos y obligaciones específicas permanecen obligatorios. El procedimiento completo `fruti test` mantiene su página Mora.
- Una solicitud expresamente limitada conserva su alcance. Un bloqueo detiene solo las operaciones dependientes y no certifica cumplimiento.

No se modificaron producto, modelos, permisos, responsabilidades, contratos compartidos ni fuentes Kiro.

## Validación realizada

| Comprobación | Resultado | Alcance |
| --- | --- | --- |
| `npm test` | PASS | Instalación, CLI, referencias de activación y regresiones del gate |
| `python scripts/validate-codex.py` | PASS | 113 recursos, 33 archivos compartidos, 8 skills y 10 agentes; referencias y paridad |
| `python -m unittest discover -s test -p codex_toml_test.py` | 10 tests PASS | Sintaxis, esquema y conservación de configuración e instrucciones previas |
| `python scripts/validate-skill-icons.py` | Archivos válidos | YAML, rutas e imágenes; visualización en escritorio no comprobada |
| `git diff --check` | PASS | Formato del diff |
| Revisión independiente de tres escenarios | Coherente | Simulación documental; no ejecución del producto |

## Escenarios de revisión independiente

1. Rediseño completo con rechazo de las tres alternativas sin observaciones: nueva ronda Kiwi, revisión Lima y nueva elección antes de F3/R3.
2. Rediseño completo con F2/F3 aceptados y candidate implementado: continuar harden, reparación por dueño, auditoría y demo; presentar las decisiones obligatorias con limitaciones reales de evidencia. No iniciar Mora ni producción sin la autorización correspondiente.
3. Solicitud de un único wireframe: entregar ese alcance sin forzar implementación, estabilización ni documentación.

La revisión detectó una ambigüedad entre documentación opcional de un encargo ordinario y la página obligatoria de `fruti test`; quedó resuelta expresamente en el protocolo y la skill Lima.

## Límites

No se ejecutó un rediseño real de NsaEncabezado ni se inspeccionó Codex de escritorio del usuario. Las pruebas documentales y de instalación no demuestran por sí solas selección, carga o ejecución autónoma del flujo en esa sesión. Los resultados de GitHub Actions se consultan por separado para el commit publicado.
