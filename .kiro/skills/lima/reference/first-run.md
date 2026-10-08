# Primer uso — inicializar el proyecto

Fruti Squad instala capacidades reutilizables, pero **no instala un perfil activo universal**. Cada repositorio crea su propio perfil.

## Comando recomendado

```bash
npx fruti-squad-kiro init
```

Sin opciones crea un starter seguro:

- nombre: nombre de la carpeta del proyecto;
- design system: mismo nombre;
- theme mode: `starter`;
- Hub: `design-hub`;
- QA: `none`;
- accesibilidad: WCAG 2.2 AA;
- touch target: 44px;
- viewports: `[1440, 1024, 768, 390]`;
- tematización: hereda `.fruti/defaults/theme.json`.

## Estrategia de tematización

No se pide una paleta completa. Se configura una entrada corta y se deriva el resto.

El starter define por defecto:

```json
{
  "brand": "#1F1F1F",
  "accent": "#0B63CE",
  "radius": 6,
  "shape": "rounded",
  "space": 4,
  "font": "Instrument Sans",
  "fontSize": 16,
  "typeScale": 1.25,
  "neutrals": "tinted",
  "neutralsHue": "brand",
  "semanticCollision": "warn",
  "categories": 0,
  "dark": true
}
```

`primary` omitido = alias de `brand`. `fontDisplay` omitido = `font`.

Ejemplo:

```bash
npx fruti-squad-kiro init \
  --name "Mi producto" \
  --brand "#7A1F5C" \
  --accent "#0F766E" \
  --shape pill \
  --radius 12 \
  --font "Inter"
```

Eso escribe `.fruti/theme/config.json`; no obliga a especificar `strong`, `soft`, `on-*`, semánticos ni oscuro manualmente.

## Proyecto con design system existente

```bash
npx fruti-squad-kiro init --theme existing --theme-source path/to/tokens.css
```

Si `--theme-source` se omite, el init intenta detectar fuentes comunes. En modo `existing` Fruti enlaza la verdad existente; no la sustituye.

## Resultado

- perfil local en `.kiro/skills/lima/profiles/<project>.md`;
- `.fruti/theme/config.json` solo en modo starter;
- `design-hub/`;
- `design-hub/system/registry.json`;
- `.fruti/state/current.json.profile_path` apuntando al perfil activo.

La inicialización es aditiva y no reemplaza un perfil existente salvo `--force`.
