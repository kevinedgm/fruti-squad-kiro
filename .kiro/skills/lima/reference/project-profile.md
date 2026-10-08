# Project profile — binding the reusable skill to one project

The skill core is universal. A project profile binds it to one repository without carrying information from any other project.

## There is no active global/default profile

`profiles/_TEMPLATE.md` is only a template. A local active profile is created by:

```bash
npx fruti-squad-kiro init
```

## Theme model

The profile uses a **short-input → derived-tokens** strategy.

For a new project:

```text
.fruti/defaults/theme.json
        +
.fruti/theme/config.json   ← project inputs
        ↓
.fruti/contracts/theming.yaml
        ↓
derived theme contract
```

For an existing project:

```text
existing tokens/theme source
        ↓
profile theming.source
        ↓
Fruti reads it; it does not replace it
```

## Selecting the active profile

Ignore `_TEMPLATE.md` and anything under `profiles/examples/`.

1. If `.fruti/state/current.json.profile_path` resolves, use it.
2. Otherwise, if exactly one local profile exists, use it.
3. If several exist, resolve against the repository and confirm if ambiguous.
4. If none exists, initialize.

## Required profile concepts

- `theming`: mode, short config/source and derived-output contract.
- `truth_sources`: canonical visual input files.
- `hub_root` and `registry_path`.
- `production`: detected stack and token binding.
- `implementation`: framework/language/styling, resolved from the repo.
- `accessibility`.
- optional `runtime_qa`.

Legacy references to `color_law` and `type_law` are compatibility pointers. Their truth is derived from `theming.source`, not separately hand-maintained prose.
