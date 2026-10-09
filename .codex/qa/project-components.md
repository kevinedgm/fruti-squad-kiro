# Componentes existentes e integración de estilos

Todas las rutas son relativas a la raíz del proyecto consumidor. Lee este protocolo antes de investigar o diseñar UI y en los handoffs F2 → contrato → F3 → R3 y en R0. Conserva dueños, permisos y compuertas vigentes.

## Configuración y hechos

1. Lee el perfil activo del estado Fruti. Si existe `.fruti/project.json`, lee `framework`, `component_roots` y `css_prefix`: son decisiones declaradas por el usuario. Los campos ausentes conservan el perfil vigente y detección `AUTO`; no autorizan elegir otro stack.
2. Contrasta framework/version con `package.json`, lockfile, configuración y entradas reales. Registra discrepancias; no migres de Vue 2 a Vue 3 por una declaración contradictoria. Lima reconcilia la decisión y consulta al usuario solo si resolverla cambia stack o contrato.
3. Inspecciona primero las raíces declaradas, exports, registros/plugins, imports, usos y documentación aplicable. Amplía a dependencias y consumidores cuando lo exijan los candidatos. Una carpeta vacía no demuestra componentes disponibles. Registra una raíz ausente como entrada faltante; no instales librerías para llenarla.
4. Sin configuración, inspecciona stack y controles ya usados y registra rutas en el brief/handoff. No supongas que Grana, Bootstrap o Vuetify están instalados ni que sus versiones comparten API.
5. Usa `fruti-squad-codex project` para configurar sin reinicializar ni sobrescribir el perfil. Las carpetas explícitas deben existir dentro del proyecto, también al resolver symlinks. Para bibliotecas externas, inspecciona dependencias instaladas y exports reales; no referencias fuera del proyecto ni documentación de otra versión como prueba de compatibilidad.

## Reutilización antes de construir

- Kiwi identifica candidatos reales para cada control previsto: botón, campo, breadcrumbs, diálogo, etc. Registra fuente/documentación, API, accesibilidad y límites. F0–F2 permanece neutral; representar un control en HTML no demuestra haber integrado el componente real.
- Lima decide reutilizar, componer, extender bajo contrato aprobado o crear cuando falta una opción compatible. Justifica por API, estados, interacción, accesibilidad o framework; un parecido visual no basta, y no obliga a usar una pieza incompatible.
- Incluye en brief/contrato/handoff una tabla: necesidad, componente elegido, ruta/export/import comprobados, props/eventos/slots, limitaciones y decisión pendiente. Usa artefactos existentes; no agrega otro registry ni estados.
- Coco aplica F3 con componentes y tokens elegidos. Bruno integra APIs y funcionalidad preservando F3. No reconstruyen un botón disponible ni inventan props para ajustarlo al boceto.
- Si una pieza impide la interacción aprobada, devuelve evidencia a Lima; estructura vuelve a Kiwi. La devolución no amplía alcance ni autoriza editar la biblioteca.

## Nomenclatura y aislamiento

1. Usa `css_prefix` para estilos nuevos propios: con `nsa-ui`, `.nsa-ui-stat-filter`, `.nsa-ui-stat-filter__title`, `.nsa-ui-stat-filter--compact`. Prefija también variables nuevas (`--nsa-ui-stat-filter-gap`) y animaciones. Conserva tokens existentes como `--g-*`; no los redefine ni duplica sin decisión de Lima.
2. Busca usos del prefijo antes de adoptarlo. Rechazar prefijos conocidos de Grana/Bootstrap/Vuetify no demuestra ausencia de colisiones locales. Sin prefijo, deriva uno de la nomenclatura comprobada o propone uno a Lima con evidencia y regístralo. No uses clases genéricas nuevas como `.btn`, `.row`, `.card`, `.title` o `.container`.
3. Encierra estilos propios bajo la raíz y usa aislamiento del stack real, por ejemplo `<style scoped>` en Vue cuando corresponda. No agrega resets, reglas globales `button`/`input`, sobrescrituras `.g-*`, `.v-*`, `.btn` ni tokens de terceros para resolver una necesidad local.
4. Prefiere variantes, tema, props y slots admitidos por la biblioteca. Un selector profundo/global requiere motivo, scope a la raíz y contrato aprobado; documenta la dependencia del DOM. `scoped` no aísla automáticamente portales/teleports, herencia ni variables globales. Comprueba overlays en su destino real y utiliza clases/tema que su API admite.
5. Preserva clases públicas, contratos CSS, tokens y estilos existentes. Un namespace nuevo no autoriza renombrarlos ni editar la biblioteca. Lima resuelve cambios de contrato con las compuertas existentes.

## Evidencia y entrega

- Bruno comprueba imports/exports y APIs de la versión instalada y ejecuta build/comportamiento del contrato. El build no demuestra aislamiento visual.
- Coco R0 compara en navegador pieza, consumidor real y controles vecinos de las bibliotecas presentes: estilo computado y apariencia antes/después, overlays, foco, teclado, estados y adaptación de preentrega. Registra escenarios y archivos; no certifica bibliotecas que no ejecutó.
- Lima recibe tabla de reutilización, stack comprobado, namespace, excepciones y resultados. Lo pendiente sigue no verificado. Un prefijo válido o búsqueda estática no sustituye coexistencia en navegador; aplica `.codex/qa/pre-delivery.md` y reparación por dueño.
