# Fruti Squad · Codex

Aplicar este flujo cuando la solicitud sea de UI o Design Hub. Para tareas ajenas al diseño, trabajar sobre el alcance solicitado sin ejecutar el squad entero.

Leer `.fruti/policy.md` al iniciar el flujo. Resolver `.fruti/state/current.json`, el perfil activo y el handoff vigente. Las rutas lógicas de los runtimes se resuelven por `.fruti/paths.yaml`, también en este repositorio. Las skills viven en `.agents/skills`; los agentes nativos en `.codex/agents/*.toml`.

## Propiedad y orden

Kiwi (F0–F2 estructura) → Lima (clasificación/contrato) → Coco (F3/CSS) → Bruno (funcionalidad R3) → Coco (auditoría R0) → Lima (gate/lifecycle) → Mora (documentación verificada).

- Leer el SKILL.md del rol activado y su runtime; cargar únicamente las referencias de la operación activa. Un vínculo es un índice, no una orden de precarga.
- Coordinar con el agente `fruti-squad` o la skill `$fruti-squad`. Delegar etapas a especialistas cuando las herramientas reales lo permitan; esperar la entrega antes del siguiente paso dependiente. No ejecutar etapas dependientes en paralelo.
- Conservar arquitectura, geometría, estados y adaptación aprobados. Lima devuelve defectos estructurales a Kiwi; no los rediseña. Bruno conserva F3/CSS; Coco sigue siendo el auditor canónico.
- Registrar aprobaciones reales del usuario. Una salida de subagente no es aprobación. Reutilizar autorización explícita vigente para el mismo alcance; cuando cambie materialmente, presentar la nueva ronda antes de continuar el trabajo dependiente.
- No inventar datos, tokens, normas, APIs, previews ni resultados de verificaciones. Documentar faltantes y derivarlos al dueño.
- Persistir handoffs y estado compactos con la ronda correcta, incluyendo las copias de ronda exigidas por la política. No reutilizar evidencia de otra ronda como evidencia recién generada.

## Revisión interna antes de la entrega

Antes de presentar una propuesta, aunque el usuario haya invocado solo Kiwi, aplicar `.codex/qa/pre-delivery.md`: productor → revisor → devolución al dueño → corrección y reprobación hasta estar listo. Usar agentes reales cuando estén disponibles; conservar aprobaciones del usuario como compuertas independientes. Una revisión pendiente no es un cierre: esperar al revisor y completar reparación/reprobación. Si falla el navegador, diagnosticar y agotar las alternativas reales y permitidas de `.codex/qa/pre-delivery.md`; un fallo de herramienta no basta para declarar bloqueo terminal. No pedir al usuario que detecte o diagnostique defectos básicos ni afirmar PASS visual desde un verificador estático. Sin evidencia real de navegador y revisión vigente, entregar solo estado de bloqueo/borrador; no solicitar aprobación de una UI certificada.

## Adaptador de host

La política, runtime y contratos `.fruti` resuelven las atribuciones heredadas del texto profundo (incluidas menciones antiguas de Coco como dueño de todo R3 y del shell del Hub). `.fruti/contracts/documentation.yaml` gobierna el shell neutral y los previews aislados. No usar `.kiro` para la ejecución de Codex.

Kiro `resources`, `toolsSettings`, `welcomeMessage` y `permissions.rules` no son campos nativos de Codex. Los agentes declaran `name`, `description` y `developer_instructions`; heredan modelo, herramientas y permisos del host. Las restricciones de propiedad son instrucciones del workflow, no ACL. No ejecutar `rm -rf`, `sudo`, `git reset --hard`, `git push` ni commits dentro del flujo UI. No añadir dependencias sin autorización.

Si el host no ofrece subagentes, declarar ejecución secuencial de roles conservando las mismas compuertas. No simular un agente ejecutado. `fruti test` y `fruti foundations` nombran procedimientos en las fuentes; este paquete no proporciona esos comandos de CLI. Seguirlos con artefactos y evidencia, sin fingir que un comando inexistente se ejecutó.

Guía de instalación y autoría: `docs/codex-guia-operativa.md`. Trazabilidad de adaptación: `docs/codex-parity.json`.
