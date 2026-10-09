# Prueba controlada del selector · Fruti Squad 0.3.12

## Evidencia aportada por el usuario

ChatGPT de escritorio 26.1002.52244 muestra un cubo genérico. El backend codex-cli 0.162.0-alpha.2 devuelve Fruti Squad habilitada, rutas absolutas correctas de iconSmall/iconLarge, interfaz completa y ningún error en skills/list con forceReload. Los SVG existen, son legibles y coinciden con el paquete 0.3.11. La captura confirma el cubo junto al nombre y descripción esperados.

Esto descarta falta de sincronización y omisión de metadatos en esa consulta. No demuestra que el proceso de interfaz pueda leer/renderizar la imagen ni que el selector use el campo recibido.

## Cambio experimental

Solo `fruti-squad/agents/openai.yaml` cambia `icon_small` a `./assets/avatar-small.png`. `icon_large`, los SVG originales y las otras siete skills se conservan. El PNG de 96 × 96 se rasterizó desde el SVG original mediante CairoSVG 2.9.1; no se rediseñó ni regeneró mediante IA. El archivo se distribuye ya convertido, sin añadir dependencias al proyecto consumidor.

El instalador visual admite el nuevo PNG. Conserva backups, prompts, políticas, procedimientos, modelos, perfiles y estado. El builder mantiene esa única selección y los validadores comprueban firma, dimensiones, CRC, datos de píxeles y copia instalada.

## Aplicación local

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex install --update-icons --dry-run
npx fruti-squad-codex install --update-icons
```

Desde una instalación sincronizada 0.3.11 se espera paquete 0.3.12, `created: 1`, `updated: 1`, `unchanged: 23`, `conflicts: 0`. El PNG nuevo y el YAML actualizado deben quedar en la copia de proyecto descubierta.

Guardar trabajo y recargar la aplicación cuando sea seguro. Si existe diagnóstico del backend, repetir skills/list con forceReload y verificar que iconSmall termine en avatar-small.png. Observar el mismo selector; no sustituirlo por una vista del archivo en navegador.

- Si aparece el PNG, hay evidencia de una diferencia de tratamiento entre el SVG original y su versión PNG en ese contexto. No prueba que todos los SVG sean incompatibles.
- Si continúa el cubo y el backend devuelve la nueva ruta, el cambio de formato no resuelve el fallo; no extenderlo a las demás skills. Registrar captura y versión para soporte.

## Reversión limitada

En `.agents/skills/fruti-squad/agents/openai.yaml`, restaurar únicamente `icon_small: "./assets/avatar-small.svg"` y recargar. El SVG sigue instalado; no borrar la skill ni modificar otras claves. Una siguiente sincronización visual del paquete experimental vuelve a seleccionar el PNG.

## Estado

Imagen generada y examinada localmente; pruebas de instalación y validación ejecutadas. Visibilidad en ChatGPT del usuario: **pendiente**. Esta versión es una prueba controlada, no una corrección visual confirmada.
