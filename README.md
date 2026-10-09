<p align="center"><img src="assets/marca/fruti-squad.svg" alt="Fruti Squad" height="96"></p>

# Fruti Squad for Codex

Versión Codex del Fruti Squad de Kiro, en la rama `codex`. Conserva el flujo, las compuertas y los contratos de la línea base Kiro; adapta discovery, agentes nativos, instalación y documentación.

**[Codex · Guía operativa para crear agentes y skills](docs/codex-guia-operativa.md)** · [Trazabilidad de paridad](docs/codex-parity.json) · [Fuente Kiro](https://github.com/kevinedgm/fruti-squad-kiro/tree/main)

## Instalar

Desde la raíz del proyecto:

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex init --name 'Mi proyecto'
```

Node.js ≥18. Las skills se instalan en `.agents/skills`, los agentes en `.codex/agents`, las reglas compartidas en `.fruti` y la entrada en `AGENTS.md`. Los archivos existentes distintos se conservan y se reportan como conflictos. Si `AGENTS.md` ya existe, integrar sus instrucciones Fruti antes de ejecutar el flujo. La instalación no escribe `.codex/config.toml`.

```bash
npx fruti-squad-codex install --dry-run
npx fruti-squad-codex install --target ../otro-proyecto
npx fruti-squad-codex init --theme existing --theme-source src/styles/tokens.css
npx fruti-squad-codex theme --brand '#1F1F1F' --accent '#0B63CE'
```

Este paquete se instala desde la rama GitHub; no se ha publicado en npm. Si npm usa `--ignore-scripts`, ejecutar `npx fruti-squad-codex install` manualmente. `--force` reemplaza archivos distribuidos: revisar conflictos y preservar estado/perfiles del consumidor antes de usarlo.

## Pedir trabajo

```text
Usa $fruti-squad para diseñar este formulario con el flujo completo.
```

También puedes hablar de forma natural: «rediseña este formulario», «ahora haz el de registro», «audítalo», «cambia la fuente principal», «documenta lo implementado». El runtime resuelve el dueño y la operación desde el estado y perfil activos.

| Rol | Responsabilidad | Skill | Agente nativo |
|---|---|---|---|
| Kiwi | Brief, flujo, estructura F0–F2 y adaptación | `$kiwi` | `kiwi` |
| Lima | Reutilización, contratos, tokens, registry y lifecycle | `$lima` | `lima` |
| Coco | F3/CSS y auditoría canónica R0 | `$coco` | `coco` |
| Bruno | Script/template, API, estados, teclado/foco y funcionalidad R3 | `$bruno` | `bruno` |
| Mora | Documentación implementada y verificada | `$mora-docs` | `mora` |
| Fruti Squad | Coordinación y compuertas | `$fruti-squad` | `fruti-squad` |

Impeccable conserva sus procedimientos y recursos. Improve Animations audita y escribe planes; su variante `execute` entrega el plan al squad y respeta las compuertas, sin modificar código como asesor. Los cuatro helpers nativos de Impeccable se incluyen también en `.codex/agents`.

## Flujo y calidad

Kiwi → aprobación estructural → Lima contrato → Coco F3/CSS → aprobación F3 → Bruno R3 → Coco R0 → Lima gate → Mora.

Las etapas dependientes se ejecutan en orden. Un resultado de agente es evidencia, no aprobación del usuario. El registry conserva draft → candidate → stable y las aprobaciones de promoción. Los defectos regresan a su dueño; una ronda rechazada no se sobrescribe.

Un PASS exige todas las dimensiones obligatorias: técnica, estructura, visual, accesibilidad, design system y documentación. Un build correcto no certifica diseño. La evidencia faltante se declara y un compliance de otra ronda no se consume como vigente.

La distribución conserva **113 recursos de skills** y **33 archivos compartidos sin cambios**, incluyendo política, runtimes, contratos, defaults, audit manifest y formatos de estado/handoff. `docs/codex-parity.json` registra hashes y transformaciones. La versión Codex agrega el coordinador como skill, metadatos de selector y agentes TOML.

## Desarrollo y validación

```bash
npm test
python3 -m pip install PyYAML
python3 scripts/validate-codex.py
npm pack
```

Para reconstruir copias Codex desde la línea base preservada:

```bash
python3 scripts/build-codex.py
```

Las pruebas validan instalación, preservación de conflictos, perfiles, tematización, CLI, schemas y paridad con el commit de origen. La CI instala además el tarball en un proyecto limpio. La aceptación visual se ejecuta sobre una interfaz concreta usando los mismos contratos de calidad.

## Compatibilidad

Codex usa `.agents/skills` y agentes TOML bajo `.codex/agents`. Los modelos y permisos de los roles Fruti se heredan del host. Las reglas Kiro de herramientas y permisos no tienen traducción automática a ACL de Codex; el adaptador conserva sus límites como instrucciones.

Si no hay subagentes, declarar ejecución secuencial de roles con las mismas compuertas. Si no hay navegador o detector disponible, reportar lo no verificado. La política menciona `fruti test` y `fruti foundations` como procedimientos; esta CLI solo implementa `install`, `init`, `theme` y `help`.

Ver la [guía operativa](docs/codex-guia-operativa.md) para estructura completa, contratos, aprobaciones, creación de skills/agentes, tematización, verificaciones y límites heredados.

MIT · [LICENSE](LICENSE)

## Probar la instalación

Abre Codex en la raíz de tu proyecto y selecciona `$fruti-squad` (o `/skills`). Prueba:

```text
Usa $fruti-squad para diseñar un formulario de registro. Comienza por Kiwi F1/F2, registra los estados y espera mi aprobación antes de pasar a F3.
```

Para comprobar los límites: «Solo audita esta UI; no cambies el código» debe ir a Coco R0. «Optimiza solo esta consulta SQL» no debe activar el flujo UI. Los prompts completos están en `test/activation-cases.json`.

## Paquete de plugin

`.codex-plugin/plugin.json` declara las ocho skills con el formato de compatibilidad soportado. Es un paquete de skills para pruebas locales; no está publicado en el directorio de plugins. Para mantener el flujo completo se requiere instalar en el proyecto con npm: esto provisiona `AGENTS.md`, `.fruti` y los agentes nativos, que el manifiesto de skills por sí solo no instala. No habilites simultáneamente copias de estas skills por plugin y por repo.

## Revisión automática entre agentes (0.3.2)

Un pedido directo a Kiwi también activa la revisión interna antes de mostrar A/B/C: Kiwi → Lima revisión → Kiwi reparación/reprobación. F3 pasa por Lima/Impeccable en modo revisión y Coco corrige; R3 pasa por Coco R0 y vuelve al dueño del defecto. El usuario recibe la propuesta revisada para decidir dirección y preferencias; las aprobaciones de estructura, F3 y promoción siguen siendo suyas.

El gate `.codex/qa/verify-delivery.cjs` exige evidencia vigente por alternativa, viewport, estados y tarea: capturas, traces, inspección del revisor, pruebas de recorte vertical/horizontal y resultados de interacción/teclado. `check_artifact.py` ahora declara explícitamente su alcance estático. Sin navegador/evidencia, se informa bloqueo y no se certifica UI.

Para actualizar una instalación existente:

```bash
npm install --save-dev 'github:kevinedgm/fruti-squad-kiro#codex'
npx fruti-squad-codex install --update-tools
```

`--update-tools` actualiza skills, agentes y QA distribuidos; conserva una copia de cada herramienta reemplazada en `.fruti/backups/codex-tools`. Preserva perfiles, estado, handoffs, tokens, tema y configuración del proyecto. `AGENTS.md` existente se reporta como conflicto y se conserva; las skills/agentes actualizados incluyen la obligación de leer el contrato de revisión. No hace falta reinicializar el proyecto ni usar `--force`.
