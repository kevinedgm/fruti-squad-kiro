---
inclusion: always
---

# Fruti Squad · memoria compartida

```text
kiwi  → STRUCTURE
lima  → GOVERNANCE
coco  → F3 / CSS / R0 AUDIT
bruno → FRONTEND FUNCTIONALITY R3
mora  → DOCUMENTATION
```

## Propiedad

- Kiwi decide estructura, flujo y adaptación.
- Lima gobierna clasificación, contratos, tokens, registry y lifecycle.
- Coco materializa apariencia/F3, es dueño del CSS y ejecuta R0.
- Bruno implementa script/template, API, eventos, estados y accesibilidad funcional.
- Mora documenta únicamente lo implementado y verificado.

R3 se divide por responsabilidad, no por conveniencia. El perfil activo se obtiene desde `.fruti/state/current.json`; este paquete nunca debe fijar el nombre de un proyecto consumidor.

Los runtime contracts usan rutas lógicas resueltas por `.fruti/paths.yaml`.

## Aprobaciones

Un resultado de subagente no equivale a aprobación del usuario. Si una etapa exige aprobación explícita, la orquestación se detiene.
