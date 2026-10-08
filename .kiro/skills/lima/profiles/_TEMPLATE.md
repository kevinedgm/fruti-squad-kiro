# Profile — <PROJECT NAME>

This file is a template, not an active profile. Project-specific facts are created by `fruti-squad-kiro init`.

```yaml
name: "<project-name>"
design_system: "<design-system-name>"

theming:
  mode: starter              # starter | existing
  strategy: short-input-derived-tokens
  contract: .fruti/contracts/theming.yaml
  defaults: .fruti/defaults/theme.json
  source: .fruti/theme/config.json
  config: .fruti/theme/config.json
  generated:
    tokens: .fruti/theme/tokens.json
    css: .fruti/theme/tokens.css

truth_sources:
  - .fruti/theme/config.json

# Compatibility pointers. Visual law is derived from theming.source.
color_law: "DERIVED_FROM_THEME_SOURCE"
type_law: "DERIVED_FROM_THEME_SOURCE"

hub_root: design-hub
hub_layout:
  - Foundations/{Color,Type,Icons,Tokens}
  - Components
  - Patterns
  - Responsive/{Mobile,Tablet,Desktop}
registry_path: design-hub/system/registry.json

production:
  detect: true
  known_stack: AUTO
  token_binding: "Bind production to theming.source; never hand-edit derived tokens."
  component_layout: AUTO

implementation:
  framework: AUTO
  language: AUTO
  styling: AUTO

impeccable_path: .kiro/skills/impeccable

accessibility:
  target: WCAG 2.2 AA
  touch_min_px: 44

runtime_qa:
  enabled: false
  runner: none
  viewports: [1440, 1024, 768, 390]
```

## Theming rule

The project edits a short theme input: brand/accent/primary, shape/radius, spacing and typography. Strong/soft/text/on variants, semantics, neutrals, categories and dark variants are derived by the theming contract rather than entered manually.
