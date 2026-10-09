# Auditoría de iconos de skills · 0.3.10

Fecha: 2026-10-09. Fuente de mantenimiento: rama `codex` de `kevinedgm/fruti-squad-kiro`.

## Resultado y límites

No se encontró una ruta rota ni una imagen ausente en los ocho metadatos del repositorio. Los 16 SVG originales son válidos, autocontenidos y visibles en Chromium. No se regeneraron, convirtieron ni alteraron los diseños. No se demuestra que el usuario esté ejecutando esta misma copia ni que su escritorio haya cargado sus metadatos.

La instalación ordinaria conserva archivos distintos del destino. Se reprodujo que un `openai.yaml` o SVG anterior queda como conflicto, aun después de actualizar la dependencia. `--update-tools` ya incluía metadatos y assets, pero también actualiza procedimientos y agentes. Se añadió `install --update-icons` para sincronizar exclusivamente estos 24 archivos visuales, con respaldo de los reemplazados. Esta reparación resuelve copias antiguas cuando ese es el problema; no identifica por sí sola la causa de la incidencia del usuario.

La sincronización visual modifica únicamente los cinco campos de interfaz visual y los SVG. Conserva `default_prompt`, `policy`, `dependencies` y demás configuración de los metadatos existentes. Un YAML complejo, con duplicados de interfaz o sin un bloque plano reconocible se devuelve como conflicto para revisión manual; no se reemplaza a ciegas. Si falta el `SKILL.md` instalado, tampoco crea una carpeta de iconos huérfana. El validador compara los campos visuales, sin tratar un prompt o política personalizada como una instalación visual antigua.

Se corrigieron las descripciones de interfaz, antes genéricas, para distinguir los ocho roles. Se eliminó la instrucción de insertar imágenes en progreso como alternativa a un indicador nativo. No se cambiaron responsabilidades, modelos, contratos, SKILL.md, permisos ni compuertas.

## Versiones y copias

- Paquete auditado: 0.3.9; paquete actualizado y probado: 0.3.10.
- Codex de escritorio del usuario: **no identificado**, sin acceso a su aplicación nativa desde este entorno Linux.
- CLI: `command -v codex` no encontró un ejecutable en este entorno. La versión del CLI asociado al escritorio también queda pendiente; no se deduce de la versión de la aplicación ni de la del paquete.
- Checkout editado: `/workspace/scratch/3565bc124141/repo/.agents/skills/<skill>`.
- Proyecto consumidor de prueba: `/tmp/fruti-icons-consumer-OE7d9C/.agents/skills/<skill>`, aprovisionado mediante instalación real del tarball npm. Sus 24 archivos visuales coinciden con el checkout. No es la instalación del usuario.
- `node_modules/fruti-squad-codex/.agents/skills` es la fuente del paquete en el consumidor, no la copia de proyecto que la documentación manda descubrir. Editar el checkout o actualizar npm no reemplaza automáticamente los archivos existentes del consumidor.
- Ocho nombres únicos bajo `.agents/skills`, sin enlaces simbólicos. `.kiro/skills` conserva la fuente histórica y no es una raíz de descubrimiento Codex documentada. No se instaló ni modificó ninguna skill externa al proyecto.
- No se encontró una copia de estas ocho skills entre los SKILL.md de `/root/.codex/skills` del entorno. No existen `/root/.agents/skills` ni `/etc/codex/skills` aquí. Esto no inventaría un inventario del ordenador del usuario ni del catálogo remoto de Work.

## Metadatos, rutas e imágenes

La referencia de Skill Creator `references/openai_yaml.md`, leída en esta sesión, define ambas rutas como relativas al **directorio de la skill**. Así, `./assets/avatar-small.svg` en `kiwi/agents/openai.yaml` resuelve a `kiwi/assets/avatar-small.svg`, no a `kiwi/agents/assets/...`.

En las ocho skills se comprobó `interface`, textos no vacíos, descripción de 25–64 caracteres, color `#RRGGBB`, rutas locales con coincidencia de mayúsculas, contenido XML SVG, `viewBox="0 0 24 24"` y ausencia de fuentes, imágenes, scripts o recursos externos. Los assets pequeños y grandes son copias del mismo tile vectorial canónico; su tamaño de presentación depende del cliente. No tienen ancho raster intrínseco que obligue a duplicar el dibujo.

Las rutas eran correctas y se conservaron. La guía de autoría presenta SVG y PNG en sus ejemplos; la referencia instalada presenta `icon_large` SVG. Un ejemplo con PNG no prueba que SVG esté prohibido. No se hizo una conversión sin evidencia del cliente afectado.

Los SVG cargaron como imágenes, con 32 comprobaciones de píxeles a 24 y 96 px y revisión visual de los 16 assets. Todos tienen primer plano visible; el mínimo fue de 128 píxeles a 24 px. El contraste calculado de los acentos principales contra el tile `#161616` es Kiwi 9.46:1, Lima 14.23:1, Coco 7.13:1, Bruno 8.39:1, Mora 4.42:1 y marca Squad 17.01:1. Esto es evidencia del asset, no de cómo lo dibuja Codex ni una certificación de toda su interfaz.

## Tabla por skill

`R/<skill>` = `.agents/skills/<skill>` del checkout y del consumidor de prueba, en ubicación documentada. **Descubrimiento efectivo en escritorio pendiente para todas**. `S` = `./assets/avatar-small.svg`; `L` = `./assets/avatar-large.svg`.

| Skill | Copia descubierta | Icono pequeño | Icono grande | Causa | Corrección | Estado de verificación |
| --- | --- | --- | --- | --- | --- | --- |
| kiwi | R/kiwi; catálogo no consultado | S, tile Kiwi | L, tile Kiwi | Sin defecto de ruta; copia/caché real pendiente | Descripción específica + sincronización visual | YAML/SVG/render/copia PASS; escritorio no verificado |
| lima | R/lima; catálogo no consultado | S, tile Lima | L, tile Lima | Sin defecto de ruta; copia/caché real pendiente | Descripción específica + sincronización visual | YAML/SVG/render/copia PASS; escritorio no verificado |
| coco | R/coco; catálogo no consultado | S, tile Coco | L, tile Coco | Sin defecto de ruta; copia/caché real pendiente | Descripción específica + sincronización visual | YAML/SVG/render/copia PASS; escritorio no verificado |
| bruno | R/bruno; catálogo no consultado | S, tile Bruno | L, tile Bruno | Sin defecto de ruta; copia/caché real pendiente | Descripción específica + sincronización visual | YAML/SVG/render/copia PASS; escritorio no verificado |
| mora-docs | R/mora-docs; catálogo no consultado | S, tile Mora | L, tile Mora | Sin defecto de ruta; copia/caché real pendiente | Descripción específica + sincronización visual | YAML/SVG/render/copia PASS; escritorio no verificado |
| impeccable | R/impeccable; catálogo no consultado | S, marca Squad | L, marca Squad | Marca compartida intencional; no recurso perdido | Descripción específica + sincronización visual | YAML/SVG/render/copia PASS; escritorio no verificado |
| improve-animations | R/improve-animations; catálogo no consultado | S, marca Squad | L, marca Squad | Marca compartida intencional; no recurso perdido | Descripción específica + sincronización visual | YAML/SVG/render/copia PASS; escritorio no verificado |
| fruti-squad | R/fruti-squad; catálogo no consultado | S, marca Squad | L, marca Squad | Sin defecto de ruta; copia/caché real pendiente | Descripción específica + sincronización visual | YAML/SVG/render/copia PASS; escritorio no verificado |

## Superficies y soporte

| Superficie | Evidencia de soporte | Observación real en esta auditoría |
| --- | --- | --- |
| Lista/catálogo de skills | La guía oficial documenta Skills en la barra lateral y metadatos UI; Skill Creator describe listas/chips | No se inspeccionó el escritorio |
| Ficha de la skill | `icon_large` es un asset grande de interfaz; no se afirma un diseño de ficha idéntico en todas las versiones | No se inspeccionó ni confirmó la asignación de este campo a una ficha concreta |
| Skill invocada | Skill Creator documenta metadatos para chips; no garantiza un icono persistente durante cada operación | No se observó un indicador de ejecución |
| Subagente o agente TOML ejecutándose | No se encontró una configuración documentada que vincule estos campos con su avatar | Sin personalización prometida; no se añadieron campos TOML ni imágenes de sustitución |

Fuentes consultadas:

- [Build skills](https://learn.chatgpt.com/docs/build-skills): `agents/openai.yaml`, campos visuales, raíces `.agents/skills`, symlinks, duplicados y detección/reinicio.
- [App Server](https://learn.chatgpt.com/docs/app-server): `skills/list`, `forceReload`, notificación `skills/changed` y caché por `cwd`.
- Referencia de Skill Creator instalada: `references/openai_yaml.md`; campos de interfaz y base de resolución.

La documentación de App Server menciona también lectura de `interface` desde `SKILL.json`; la guía Build skills documenta `agents/openai.yaml`. Sin la versión/implementación del cliente no se puede confirmar precedencia o equivalencia. Se registra esa diferencia y **no** se inventa una migración, un `SKILL.json` duplicado ni soporte de una propiedad nueva. La consulta al código público del loader no permitió recuperar el archivo; no se atribuyen sus reglas a esta auditoría.

## Comprobaciones ejecutadas

- `npm test`: instalación, CLI, preservación, activación documental y gates existentes; PASS. Incluye regresión de actualización visual con metadatos antiguos, SVG antiguo, SVG ausente, dry-run y respaldo, preservando procedimiento, agente y perfil.
- `python scripts/validate-skill-icons.py`: ocho YAML sin claves duplicadas, rutas, SVG, recursos autocontenidos y comparación contra fuente; PASS.
- `python scripts/validate-codex.py`: paridad de 113 recursos y 33 compartidos inmutables; PASS.
- `npm pack` + `npm install` real en proyecto temporal: los ocho `openai.yaml` y 16 SVG fueron copiados; comparación de hashes PASS.
- Chromium/Playwright: 16 imágenes cargadas, 32 tamaños con contenido visible y revisión de la lámina. No es Codex de escritorio.
- [Registro de evidencia](codex-icons-evidence.json): hashes de archivos y mediciones de render. El estado `not_verified` del escritorio permanece explícito.

Archivos modificados: los ocho `.agents/skills/<skill>/agents/openai.yaml`; `scripts/build-codex.py`; `scripts/validate-skill-icons.py`; `lib/install.cjs`; `bin/fruti-squad-codex.js`; `test/codex.test.cjs`; `.github/workflows/package-test.yml`; `.codex/qa/identity.md`; `README.md`; `docs/codex-guia-operativa.md`; `docs/codex-icons-audit.md`; `docs/codex-icons-evidence.json`; `docs/codex-parity.json`; `package.json`; `.codex-plugin/plugin.json`. Assets originales y agentes TOML sin cambios.

## Aplicar y comprobar en el escritorio

1. En la raíz del proyecto abierto en Codex, actualizar la dependencia y sincronizar los archivos visuales:

   ```bash
   npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
   npx fruti-squad-codex install --update-icons --dry-run
   npx fruti-squad-codex install --update-icons
   ```

   El comando imprime versión, destino y conteos. Esperar 0.3.10 o posterior y el proyecto correcto. Los respaldos están en `.fruti/backups/codex-tools/<sha256>/<ruta>`. No usar `--force` para esta comprobación.

2. Verificar que el proyecto contiene `.agents/skills/kiwi/agents/openai.yaml` y ambos archivos en `.agents/skills/kiwi/assets/`. Desde un checkout de mantenimiento, con PyYAML disponible, se puede comparar todo el consumidor sin escribir en él:

   ```bash
   python scripts/validate-skill-icons.py --root /ruta/al/proyecto
   ```

3. En Skills, buscar Kiwi y comprobar que se selecciona la copia de ese proyecto, no otra del mismo nombre. Si la interfaz permite inspeccionar ruta/origen, registrarlos. Si existe un cliente App Server de diagnóstico autorizado, consultar `skills/list` con el `cwd` del proyecto y `forceReload: true`; registrar `path`, `enabled`, errores y metadatos. No es un comando que se pegue en el chat ni se ejecutó aquí.
4. Resultado esperado en una superficie compatible: tile Kiwi verde sobre fondo oscuro; los otros cinco tiles conservan su identidad. Impeccable e Improve Animations muestran la marca Squad. Registrar una captura de la lista/ficha que se haya observado; no usar una vista de navegador como sustituto.
5. Si no se refleja el cambio, guardar el trabajo activo y reiniciar Codex cuando sea seguro, como indica la guía. Esta auditoría no cierra sesiones ni reinicia aplicaciones. Registrar por separado la versión de escritorio y `codex --version` del CLI que realmente lo acompaña.

Pendientes: versión exacta del usuario, copia realmente descubierta, duplicados en su ordenador, metadatos efectivamente cargados y visibilidad en lista/ficha/chip. Una copia antigua, caché, skill deshabilitada o superficie sin soporte son hipótesis hasta observar esas entradas. No afirmar que la incidencia está resuelta visualmente sin esa prueba.
