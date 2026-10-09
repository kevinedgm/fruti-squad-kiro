# Impeccable bridge — orchestrating the refinement specialist

Aplicación en Codex: `.fruti/policy.md` gobierna propiedad y locks. Lima orquesta y revisa; Kiwi decide estructura, Coco CSS, Bruno implementación funcional y Mora documentación. Los verbos de edición de este documento se ejecutan por ese dueño, con las entradas y aprobaciones vigentes. Una revisión/API checkpoint no autoriza cambiar contratos. Las rutas `.fruti/` y `.codex/` son relativas a la raíz del repositorio consumidor.

This skill is the architectural brain; `impeccable` is the specialist for critique, simplification, adaptation, and hardening. It does NOT decide the design system's architecture — this skill does.

## Invoking impeccable in this workspace

`impeccable` is **bundled with this skill** at `.agents/skills/impeccable/` — the skill is self-contained and does not depend on an external install. The profile's `impeccable_path` points at it by default (init resolves the bundled copy's path relative to the repo). A project may override `impeccable_path` to a different install if it wants a shared/newer impeccable, but nothing external is required. Prefer driving it through its reference playbooks, since the launcher binary may be unavailable:

- Load `<impeccable_path>/reference/{critique,distill,adapt,polish,harden,audit,extract}.md` and follow them for the matching phase. When `impeccable_path` is unset or its path does not resolve, fall back to the bundled `.agents/skills/impeccable/reference/*`.
- If impeccable's own setup (`impeccable context`) runs, let it load product/design context; otherwise proceed with what this skill gathered.

## Pipeline order (matters) — split across the two lifecycle phases

```text
PRE-CANDIDATE (before user accepts the direction)
initial adaptive design
↓ critique   find redundancy, hierarchy issues, excess, inconsistency, complexity
↓ distill    simplify / strip to essence
↓ adapt      resolve desktop/tablet/mobile composition + interaction
↓ polish     visual + interaction detail
↓ architectural review (this skill) → Candidate Gate

POST-CANDIDATE (after the direction is accepted and stabilization is requested or included in the complete Fruti request)
↓ harden     hard states + edge cases (on the already-resolved responsive compositions)  [lima runs this]
↓ audit      design compliance + component-architecture governance  [DELEGATED TO coco]
↓ Stable Gate → explicit approval → stable
```

`harden`/`audit` run only after candidate, on purpose: hardening a direction the user can still reject wastes the pass, and hardening desktop before adapting mobile would fabricate new unhardened states. Since `adapt` already ran pre-candidate, `harden` operates on resolved compositions.

**`audit` is delegated to coco.** lima runs `harden` (the impeccable hardening pass), but the audit step — design compliance and component-architecture governance — is coco's canonical responsibility. lima requests coco's audit and consumes its compliance report as the Stable Gate evidence, instead of running a parallel audit here. The `audit.md` playbook still lives in impeccable and coco may drive it; lima does not run it itself.

Continuidad Codex: en un encargo completo, lee `.codex/qa/orchestration.md` desde la raíz del repositorio. La aceptación de dirección permite continuar las operaciones internas de estabilización ya incluidas en el encargo; no exige otra orden de etapa. Conserva aprobación explícita para stable y promoción, dueños de reparación y procedencia de evidencia.

## Capability → phase

| Phase | impeccable capability |
|---|---|
| redundancy/hierarchy/excess/inconsistency/complexity | critique |
| simplify | distill |
| device-specific adaptation | adapt |
| visual + interaction detail | polish |
| hard states + edge cases | harden (lima) |
| a11y/perf/responsive + architecture audit | audit (delegated to coco) |
| pull reusable solution out of product context | extract |

## Control stays here

After each pass, this skill reviews architecturally: fits the profile's system, reusable, registry updated on transitions, variants justified. impeccable refines; this skill decides. Use `extract` only when the router's reuse criteria are met (two contexts / domain-agnostic / removes relevant duplication).
