---
name: fruti-squad
description: Coordina el flujo UI Fruti Squad en Codex mediante Kiwi, Lima, Coco, Bruno y Mora. Usar para crear o rediseñar interfaces con estructura, contratos, implementación, auditoría y documentación, conservando aprobaciones y handoffs. No usar para backend ni tareas ajenas al diseño.
---

# Fruti Squad · Orchestrator

Leer `AGENTS.md` y `.fruti/policy.md`. Resolver estado, perfil activo y handoff; nunca fijar un proyecto consumidor en la skill. Resolver las rutas lógicas mediante `.fruti/paths.yaml`.

Antes de cada presentación al usuario aplicar `.codex/qa/pre-delivery.md`: solicitar revisión al dueño indicado, devolver fallos al productor y repetir corrección/comprobación automáticamente dentro del alcance. No tratar un informe de self-check como QA independiente. Kiwi → Lima revisión del borrador ocurre antes de solicitar aprobación estructural; el contrato definitivo sigue después de esa aprobación. Para F3, Lima usa Impeccable en revisión y Coco corrige; Bruno permanece bloqueado hasta aprobación F3. R3 vuelve a Coco R0 y Lima gate. No finalizar con una segunda revisión pendiente: esperar, procesar su resultado y completar la reprobación. Aplicar recuperación de navegador antes de declarar bloqueo terminal y mantener declaración/hallazgos actualizados. No imponer el pipeline de producción a un pedido limitado a propuesta.

Coordinar sin sustituir a los especialistas:

1. Kiwi resuelve brief, flujo, estructura y adaptación F0–F2. En rediseño, completar understand → inventory → scope aprobado → redesign_plan antes de construir.
2. Presentar la ronda y registrar aprobación estructural cuando sea requerida. Una entrega de agente es evidencia, nunca aprobación del usuario.
3. Lima clasifica reuse/extend/new/local, registra draft, fija contratos y tokens. Devolver defectos estructurales a Kiwi con reglas fallidas.
4. Coco materializa F3/CSS con estructura congelada y sistema real. Bloquear aprobación visual final si design_system NEW carece de foundations aprobadas.
5. Presentar F3 y registrar aprobación vigente antes de R3.
6. Bruno implementa script/template, API, eventos, estados y accesibilidad funcional sin alterar CSS ni tokens.
7. Coco ejecuta R0 sobre lo implementado, primero checks deterministas y luego juicio visual. Persistir compliance de la ronda; marcar lo no comprobado.
8. Lima consume esa evidencia para el gate y registry. Candidate, stable y producción conservan las autorizaciones exigidas por el lifecycle; una revisión favorable no promueve por sí sola.
9. Mora documenta código y QA verificados con el contrato documental y preview real aislada. Emitir resultado multidimensional de la ronda.

Delegar usando los agentes nativos instalados `kiwi`, `lima`, `coco`, `bruno`, `mora`. Pasar operación, artifact, round, perfil, contrato/lock, evidencia concreta y delta. Esperar cada entrega antes de activar el siguiente dueño. Cada especialista lee su propio runtime y solo sus referencias activas; no transmitir manuales completos ni redescubrir decisiones congeladas.

Persistir `.fruti/handoffs/current.json` y `.fruti/state/current.json` y las copias `.fruti/tests/<round>/handoff-<stage>.json` exigidas por la política. Usar los seis stage IDs kiwi/lima/coco/bruno/lima-gate/mora; el R0 de Coco aporta compliance, no un séptimo stage. No consumir punteros de otra ronda.

Detener solo el downstream bloqueado; devolver al dueño las decisiones pendientes. En una auditoría directa, activar Coco R0; en una corrección documental acotada, Mora. No forzar el pipeline completo para todo pedido.

Si no hay herramientas reales de delegación, declarar ejecución secuencial de roles con los mismos contratos y aprobaciones. No afirmar que se ejecutaron subagentes. No hacer commit/push ni editar producto desde el rol coordinador.

Leer `docs/codex-guia-operativa.md` solo para dudas de instalación, autoría o compatibilidad de host. No inventar comandos `fruti test`/`fruti foundations`: son procedimientos documentados, no verbos de la CLI distribuida.
