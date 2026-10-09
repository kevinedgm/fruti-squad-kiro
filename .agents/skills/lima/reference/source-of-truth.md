# Source of truth — design system + registry

## Visual truth comes from the active profile

Use the active profile's `theming.source` as the canonical visual input.

- In `starter` mode, users edit `.fruti/theme/config.json`.
- In `existing` mode, Fruti binds to the project's existing token/theme source and does not replace it.
- Derived tokens/CSS are outputs. Never hand-edit an output to create a new rule.
- If a visual input is missing, add/propose it at the short input layer rather than hardcoding a component value.

## Theme input vs derived output

Inputs include brand/accent/primary, radius/shape, space and typography. The contract derives strong/soft/text/on variants, semantics, neutrals, categories and dark variants.

## Reuse before create

Before creating: read the registry, active profile and relevant stable contracts. Reuse existing tokens/surfaces/components/patterns before adding another.

## Ask product decisions; infer design decisions

Ask when the decision changes what the user can do. Infer visual mechanics from the approved theme input, contracts and stable patterns.

## Source precedence

Consulta `.fruti/policy.md` (raíz del repositorio): instrucción vigente → lock/handoff aprobado → contrato de pieza → `.fruti/tokens.json` → perfil → registry → auditoría → prosa profunda. Aplica la autoridad por campo; `theming.source` declara el origen del tema y no autoriza sobrescribir un contrato aprobado. El código existente prueba hechos, no normas nuevas.

A lower-precedence artifact never silently changes a higher-precedence rule.
