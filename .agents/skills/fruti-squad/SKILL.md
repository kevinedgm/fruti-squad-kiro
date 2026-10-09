---
name: fruti-squad
description: Coordina el flujo UI Fruti Squad en Codex mediante Kiwi, Lima, Coco, Bruno y Mora. Usar para crear o rediseñar interfaces con estructura, contratos, implementación, auditoría y documentación, conservando aprobaciones y handoffs. No usar para backend ni tareas ajenas al diseño.
---

# Fruti Squad · Orchestrator

Leer `AGENTS.md` y `.fruti/policy.md`. Resolver estado, perfil activo y handoff; nunca fijar un proyecto consumidor en la skill. Resolver las rutas lógicas mediante `.fruti/paths.yaml`.

## Continuidad del objetivo

Lee `.codex/qa/orchestration.md` al iniciar un encargo y al recibir cada handoff. Es la fuente canónica de continuidad, tres alternativas Kiwi, nuevas rondas ante rechazo, estabilización interna y decisión de documentación. Un encargo completo no termina al completar un stage o llegar a candidate; el coordinador activa la siguiente operación autorizada. Conserva las aprobaciones estructural, F3, stable y promoción.

## Entradas y límites

Recibe solicitud, pieza/ronda, perfil y handoff vigentes. Produce coordinación, estado, handoffs y una presentación respaldada por evidencia. No edita producto ni asume responsabilidades de especialistas. Todas las rutas `.fruti/`, `.codex/`, `AGENTS.md` y `docs/` son relativas a la raíz del repositorio consumidor.

Lee `.codex/qa/pre-delivery.md` antes de una propuesta UI y para consumir el checkpoint exacto `dirname(evidencePath)/continuation.json`. Conserva su matriz, revisión, estados, recuperación e identidad; deriva cada acción al dueño. Progreso, consultas indispensables e informes no son aprobación de UI.

## Procedimiento

Coordinar sin sustituir a los especialistas:

1. Kiwi resuelve brief, flujo, estructura y adaptación F0–F2. En rediseño, completar understand → inventory → scope aprobado → redesign_plan antes de construir.
2. Para F1/F2, obtener revisión Lima del borrador y el gate vigente antes de presentar; después registrar aprobación estructural requerida. F0 valida flujo sin afirmar navegador/render. Una entrega de agente es evidencia, nunca aprobación del usuario.
3. Lima clasifica reuse/extend/new/local, registra draft, fija contratos y tokens. Devolver defectos estructurales a Kiwi con reglas fallidas.
4. Coco materializa F3/CSS con estructura congelada y sistema real. Bloquear aprobación visual final si design_system NEW carece de foundations aprobadas.
5. Presentar F3 y registrar aprobación vigente antes de R3.
6. Bruno implementa script/template, API, eventos, estados y accesibilidad funcional sin alterar CSS ni tokens.
7. Coco ejecuta R0 sobre lo implementado, primero checks deterministas y luego juicio visual. Persistir compliance de la ronda; marcar lo no comprobado.
8. Lima consume esa evidencia para el gate y registry. Candidate, stable y producción conservan las autorizaciones exigidas por el lifecycle; una revisión favorable no promueve por sí sola.
9. Presenta la implementación revisada y las limitaciones/gates pendientes reales. Ofrece ajustes o documentación formal con Mora; si ya fue solicitada, continúa sin preguntar de nuevo. Los registros internos siguen siendo obligatorios. Mora documenta únicamente código y QA verificados con el contrato documental y preview real aislada. Emitir resultado multidimensional de la ronda.

Delegar usando los agentes nativos instalados `kiwi`, `lima`, `coco`, `bruno`, `mora`. Pasar operación, artifact, round, perfil, contrato/lock, evidencia concreta y delta. Esperar cada entrega antes de activar el siguiente dueño. Cada especialista lee su propio runtime y solo sus referencias activas; no transmitir manuales completos ni redescubrir decisiones congeladas.

Persistir `.fruti/handoffs/current.json` y `.fruti/state/current.json` y las copias `.fruti/tests/<round>/handoff-<stage>.json` exigidas por la política. Usar los seis stage IDs kiwi/lima/coco/bruno/lima-gate/mora; el R0 de Coco aporta compliance, no un séptimo stage. No consumir punteros de otra ronda.

Detener solo el downstream bloqueado; devolver al dueño las decisiones pendientes. Candidate no es bloqueo terminal: tras aceptación de dirección, coordina harden, auditoría y demo en contexto realista antes de pedir la decisión de stable. No certifiques zoom nativo ni toque físico desde emulación o CSS zoom. En una auditoría directa, activar Coco R0; en una corrección documental acotada, Mora. No forzar el pipeline completo para todo pedido.

Si no hay herramientas reales de delegación, declarar ejecución secuencial de roles con los mismos contratos y aprobaciones. No afirmar que se ejecutaron subagentes. No hacer commit/push ni editar producto desde el rol coordinador.

Leer `docs/codex-guia-operativa.md` solo para dudas de instalación, autoría o compatibilidad de host. No inventar comandos `fruti test`/`fruti foundations`: son procedimientos documentados, no verbos de la CLI distribuida.

## Verificación y entrega

Comprueba que el siguiente rol recibe operación, identidad de ronda, lock/contrato, fuentes y evidencia vigentes. Ejecuta las devoluciones autorizadas antes de presentar. Solo `READY_FOR_USER_REVIEW` permite pedir comentarios sobre una propuesta UI certificada; un bloqueo terminal conserva borradores y explica la dependencia concreta. Para avisos de ejecución consulta `.codex/qa/identity.md`.

## Recursos y escalamiento

- Coordina con Sol medium para combinar operaciones y recuperaciones; asigna tareas por operación, no por jerarquía. Scripts sustituyen trabajo determinista.
- Reanudación con contratos suficientes incompatibles: Sol high para diagnóstico; Astra medium solo para un problema sistémico persistente, conservando dueños y gates.
- Antes de delegar o cambiar recursos, lee `.codex/qa/model-routing.md` desde la raíz: distingue información/herramientas/entorno de dificultad de razonamiento y transfiere identidad, lock, fuentes, caso, intento y evidencia vigentes.
- Esta selección es una pauta de operación: activar la skill no cambia el modelo de la sesión. Confirma la selección/configuración real; los TOML fijados pueden prevalecer sobre spawn. Mantén outputs, revisores, permisos y compuertas; una devolución aislada no obliga a escalar.
