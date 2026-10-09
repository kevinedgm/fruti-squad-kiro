# Registro local del plugin Fruti Squad · 0.3.13

El registro se introdujo en 0.3.13. Para configurar o actualizar el paquete actual, consulta la [guía operativa](codex-guia-operativa.md#2-instalación-y-primer-uso). Actualizar `theme`/`project` no exige registrar o reinstalar el plugin; cargar skills nuevas desde el origen plugin requiere actualizar/recargar su copia en la interfaz del cliente.

## Qué cambia

Fruti Squad ya tenía `.codex-plugin/plugin.json` apuntando a `./.agents/skills/`. Se conserva ese formato de compatibilidad y la fuente única de las ocho skills. No se migra ni duplica su contenido a otra carpeta.

Se añaden metadatos de presentación del plugin (`interface`) y los recursos `assets/composer-icon.svg` y `assets/logo.svg`. Son el dibujo Squad existente, con tamaño intrínseco 96 × 96 y el mismo viewBox; no sustituyen los iconos particulares de Mora ni los avatares nativos de subagentes. Los campos de imagen de plugin y skill son diferentes.

El comando `fruti-squad-codex plugin` registra el paquete instalado en `.agents/plugins/marketplace.json` del consumidor. La ruta `./node_modules/fruti-squad-codex` se resuelve desde la raíz de ese proyecto. Se preservan otros plugins y el nombre de un marketplace existente; una entrada Fruti diferente o JSON inválido se reporta sin reemplazarlo. El original modificado se respalda. No modifica config.toml, permisos, modelos, estado ni instalaciones personales.

El registro hace al plugin descubrible. No demuestra que se haya instalado, habilitado o renderizado. La aplicación instala una copia de caché; actualizar node_modules y registrar el marketplace no demuestra por sí solo que esa copia ya esté actualizada.

## Aplicación

En la raíz del proyecto consumidor:

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex plugin --dry-run
npx fruti-squad-codex plugin
```

La salida debe indicar paquete fuente dentro del proyecto, plugin `fruti-squad-codex` y marketplace `fruti-local`, salvo que el proyecto ya tenga uno con otro nombre. El comando no crea otra copia de mantenimiento ni cambia las skills locales ya provisionadas.

Guardar trabajo y reiniciar ChatGPT de escritorio cuando sea seguro. Abrir el navegador de plugins, localizar Fruti Squad en el marketplace mostrado e instalar/habilitar el plugin. Si ya estaba instalado, actualizar o recargar esa instalación mediante la interfaz disponible. No borrar manualmente cachés globales.

Las skills de repositorio y las empaquetadas pueden aparecer con los mismos nombres. Para esta prueba, seleccionar la entrada con origen plugin y registrar la ruta real desde el catálogo/App Server; no inferir el origen solo por el nombre. No borrar ni deshabilitar globalmente las copias del usuario. Si el selector no distingue los orígenes, inspeccionar las rutas antes de invocar una entrada ambigua.

## Verificación y límite

Comprobar por separado:

1. Registro JSON válido y fuente resoluble.
2. Plugin visible e instalado/habilitado en la aplicación.
3. Skill Mora cargada desde la copia del plugin, con `interface.iconSmall`/`iconLarge` y assets existentes en esa copia.
4. Icono visible en el selector correspondiente, mediante captura.

La evidencia anterior del usuario mostró metadatos visuales correctos incluso en la skill de repositorio. Por tanto, la instalación como plugin es una prueba de distribución/superficie, no una causa establecida del cubo genérico. Tampoco se verificó aquí un requisito universal de 48 × 48 para iconos de skills; no confundirlo con reglas de branding de plugins.

Pruebas locales: registro idempotente, dry-run, preservación de entradas, rechazo de colisiones, backup, configuración intacta y equivalencia del dibujo. Instalación real en escritorio y render: pendientes. Instalar el plugin no registra automáticamente los agentes TOML ni configura el perfil consumidor; su provisión existente sigue siendo necesaria para el flujo Fruti.

## Fuentes oficiales

- https://developers.openai.com/plugins/build/plugins — marketplace local, rutas, instalación de caché, manifiesto de compatibilidad e interfaz.
- https://learn.chatgpt.com/docs/build-skills — openai.yaml, metadatos visuales y descubrimiento de skills locales.
