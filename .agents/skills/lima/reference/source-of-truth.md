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

1. Explicit current user instruction.
2. Active project profile.
3. Theme input source + registry + stable contracts.
4. Stable foundations/tokens/policies.
5. Stable components/patterns/navigation.
6. Candidate artifacts.
7. Product applications/templates.
8. Wireframes/explorations/deprecated.
9. Skill inference.

A lower-precedence artifact never silently changes a higher-precedence rule.
