# Intake — configuración de proyecto

El intake sigue la estrategia **pocas entradas → tema derivado**. No pide una paleta completa.

## Defaults

Todos los campos visuales son opcionales. Si se omiten, heredan `.fruti/defaults/theme.json`.

| Campo | Default | Función |
| --- | --- | --- |
| `theme_mode` | `starter` | `starter` crea input corto; `existing` enlaza tokens existentes |
| `brand` | `#1F1F1F` | marca/base |
| `accent` | `#0B63CE` | foco, enlaces, selección |
| `primary` | alias de `brand` | acción principal si difiere de marca |
| `radius` | `6` | paso md de radios |
| `shape` | `rounded` | `rounded` o `pill` |
| `space` | `4` | unidad de spacing |
| `font` | `Instrument Sans` | UI |
| `fontDisplay` | alias de `font` | display opcional |
| `fontSize` | `16` | body |
| `typeScale` | `1.25` | escala tipográfica |
| `neutrals` | `tinted` | neutros teñidos o puros |
| `neutralsHue` | `brand` | tono de neutros |
| `semanticCollision` | `warn` | avisar o ajustar choques semánticos |
| `categories` | `0` | 0–12 colores de categoría |
| `dark` | `true` | deriva variante oscura |

## Intake mínimo

```yaml
project_name: "<project-name>"
design_system_name: "<design-system-name>"   # opcional; default = project_name
theme_mode: starter                           # starter | existing
theme_source:                                # solo existing; AUTO si vacío

brand:
accent:
primary:
radius:
shape:
space:
font:
fontDisplay:
fontSize:
typeScale:
neutrals:
neutralsHue:
semanticCollision:
categories:
dark:

hub_root: design-hub
qa_runner: none
```

El stack de producción se detecta y se persiste en el perfil. No se pregunta al usuario algo que el repositorio puede responder mecánicamente.

## Propiedad

El usuario/proyecto posee el input corto. El sistema posee la derivación. Un componente nunca crea un color/radio/spacing ad hoc para “completar” el tema.
