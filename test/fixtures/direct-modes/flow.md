# Flujo de medición

```mermaid
flowchart TD
  A[Capturar] --> B[Guardar]
  B --> C[Confirmado]
  B --> D[Error]
  D --> A
  A --> E[Cancelar]
  E --> F[Salir]
```
