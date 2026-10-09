# Request router — classify, resolve intent, inspect

Natural language in; a structured decision out. Runs first, every time.

Primero lee `.codex/qa/execution-modes.md` (raíz). Una invocación directa del rol tiene prioridad sobre el router genérico: Lima revisa arquitectura/contratos y corrige gobierno autorizado sin activar la cadena completa ni sustituir compliance Coco.

## Step 1 — Understand the need

Resolve: what is this for, how is it used, what UX problem it solves. If the request answers this, proceed. If a **product decision that changes the experience** is missing, ask that one thing (source-of-truth.md), then proceed.

## Step 2 — Inspect the existing system

Reuse before create (rule owned by source-of-truth.md):

1. Read the registry (`registry_path` from the profile) — does the piece exist, in what state?
2. Read the profile's `truth_sources` for tokens/visual law.
3. Scan the Hub (`hub_layout`) for adjacent solutions to reuse.

## Step 3 — Emit a structured request

Separate **what** from **what to do with it**:

```yaml
artifact_type:   # token | surface | component | pattern | navigation | template | product-application
artifact:        # e.g. button, date-picker, primary-nav, directory-screen
intent:          # create | redesign | critique | distill | adapt | polish | harden | audit | promote | deprecate
scope:           # design-system | product-application
```

Same artifact, different workflow:

```text
"créame Buttons"    → component / button   / create
"pule Buttons"      → component / button   / polish
"adapta Buttons"    → component / button   / adapt
"promueve Buttons"  → component / button   / promote
```

`intent` selects the workflow:

- `create` / `redesign` → en un encargo Fruti completo, aplicar `.codex/qa/orchestration.md` y continuar hasta implementación revisada; candidate no es cierre. En invocación directa, ejecutar la operación propia solicitada y resolver solo sus dependencias, según execution-modes.
- `critique` / `distill` / `adapt` / `polish` → re-enter that pre-candidate stage on the current piece.
- `harden` para estabilización → post-candidate con dirección aceptada. `audit` de estabilización requiere candidate; una revisión directa del especialista puede inspeccionar cualquier estado y entregar hallazgos sin promoverlo. Lima revisa arquitectura/contratos, Coco UI/R0, Bruno funcionalidad, Kiwi estructura y Mora documentación; una corrección posterior requiere autorización y responsabilidad propias.
- `promote` → promotion.md (piece must be `stable`).
- `deprecate` → deprecation path in lifecycle.md.

## Step 4 — Classify the artifact type

| Type | Signals | Lives in (Hub) |
|---|---|---|
| token | color, spacing, radius, type scale, elevation | design-system tokens |
| surface | background, card, sheet, panel container | Componentes |
| component | button, input, date picker, avatar, badge | matching folder |
| pattern | reusable interaction across screens | Patrones UX |
| navigation | nav bar, tabs, menu, breadcrumb | Componentes + Patrones UX |
| template | full screen composition | Wireframes / Flujos |
| product-application | a specific product screen/piece | its module; NOT reusable |

A `product-application` is legitimate — do not force it to be reusable. Classify it honestly and skip reuse-promotion pressure for it.

## Step 5 — Detect reusable pieces (with restraint)

Propose promoting a solution to a shared Pattern only when it **appears in two or more contexts**, is **clearly domain-agnostic**, or **removes a relevant duplication**. Do not promote something merely because it "might help somewhere." Record the finding; plan an `impeccable extract` pass (impeccable-bridge.md) when it qualifies.

## Handoff

Para contratación, continúa a ui-artifact-contract.md y design-hub.md con las entradas/aprobaciones requeridas. Para auditoría directa, entrega hallazgos y propuesta al usuario; con autorización, corrige tu alcance y reprueba. No activa Candidate/Stable Gate si no se solicitó esa transición. Las compuertas de promoción mantienen sus aprobaciones.
