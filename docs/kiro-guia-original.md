> Referencia histórica Kiro del commit 47141906fd0731ac3a8b3d25bd56678d2488d81b. Para ejecutar Codex usar codex-guia-operativa.md.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/marca/fruti-squad-logotipo-kiro-oscuro.svg">
    <img src="assets/marca/fruti-squad-logotipo-kiro-tinta.svg" alt="Fruti Squad for Kiro" height="96">
  </picture>
</p>

# Fruti Squad for Kiro

**Fruti Squad for Kiro** es un sistema multiagente para diseñar, gobernar, implementar, auditar y documentar interfaces de usuario dentro de proyectos asistidos por [Kiro](https://kiro.dev/).

No es una colección de prompts sueltos. El paquete instala una arquitectura completa formada por:

- **Custom Agents** con responsabilidades separadas.
- **Agent Skills** con procedimientos reutilizables.
- **Steering** con memoria y reglas compartidas.
- Un runtime local en **`.fruti/`** para contratos, estado, handoffs y reglas de coordinación.
- Un **orquestador** que puede delegar trabajo entre Kiwi, Lima, Coco, Bruno y Mora.

La idea central es sencilla:

> Cada agente hace una sola clase de trabajo y entrega evidencia al siguiente. Ningún agente debería rediseñar, implementar, auditar y documentar todo por su cuenta.

---

## ¿Qué problema resuelve?

Cuando un único agente recibe una instrucción como:

> “Rediseña este formulario y déjalo listo para producción.”

normalmente termina mezclando varias decisiones al mismo tiempo:

- interpreta el problema;
- decide la estructura;
- inventa estilos;
- modifica componentes;
- cambia contratos;
- implementa comportamiento;
- prueba parcialmente;
- y después documenta lo que cree que hizo.

Eso produce resultados rápidos, pero difíciles de gobernar y repetir.

Fruti Squad divide ese trabajo:

<table>
  <tr>
    <td align="center"><img src=".fruti/assets/avatars/kiwi/kiwi-tile.svg" width="42" alt="Kiwi"><br><strong>Kiwi</strong><br><sub>estructura y UX</sub></td>
    <td align="center">→</td>
    <td align="center"><img src=".fruti/assets/avatars/lima/lima-tile.svg" width="42" alt="Lima"><br><strong>Lima</strong><br><sub>gobernanza y contrato</sub></td>
    <td align="center">→</td>
    <td align="center"><img src=".fruti/assets/avatars/coco/coco-tile.svg" width="42" alt="Coco"><br><strong>Coco</strong><br><sub>F3 visual + CSS</sub></td>
    <td align="center">→</td>
    <td align="center"><img src=".fruti/assets/avatars/bruno/bruno-tile.svg" width="42" alt="Bruno"><br><strong>Bruno</strong><br><sub>R3 funcional</sub></td>
  </tr>
  <tr>
    <td align="center" colspan="7">↓</td>
  </tr>
  <tr>
    <td align="center"><img src=".fruti/assets/avatars/coco/coco-tile.svg" width="42" alt="Coco R0"><br><strong>Coco</strong><br><sub>auditoría R0</sub></td>
    <td align="center">→</td>
    <td align="center"><img src=".fruti/assets/avatars/lima/lima-tile.svg" width="42" alt="Lima gates"><br><strong>Lima</strong><br><sub>gates / lifecycle</sub></td>
    <td align="center">→</td>
    <td align="center"><img src=".fruti/assets/avatars/mora/mora-tile.svg" width="42" alt="Mora"><br><strong>Mora</strong><br><sub>documentación</sub></td>
    <td></td><td></td>
  </tr>
</table>

Cada etapa trabaja sobre decisiones aprobadas anteriormente en vez de reinterpretar el producto desde cero.

---

# 1. Modelo mental

Fruti Squad utiliza varias capacidades de Kiro y cada una tiene una responsabilidad distinta.

| Pieza | Qué es | Para qué sirve |
| --- | --- | --- |
| **Agent** | Un trabajador especializado | Define quién hace el trabajo, qué herramientas tiene y qué puede modificar |
| **Skill** | Un procedimiento reutilizable | Define cómo ejecutar una tarea concreta |
| **Steering** | Memoria/contexto persistente | Guarda reglas compartidas y responsabilidades del squad |
| **`.fruti/runtime/`** | Router operativo | Indica qué leer, qué producir y quién es el siguiente dueño |
| **`.fruti/contracts/`** | Contratos normativos | Define reglas que no deberían reinterpretarse durante la ejecución |
| **`.fruti/state/`** | Estado operativo | Guarda dónde se quedó el flujo |
| **`.fruti/handoffs/`** | Traspaso entre agentes | Pasa decisiones y evidencia sin reconstruir toda la historia |
| **Orchestrator** | Agente coordinador | Delega cada etapa al especialista correspondiente |

En una frase:

```text
Steering recuerda.
Agent trabaja.
Skill sabe cómo.
Runtime enruta.
Contract fija reglas.
State recuerda dónde vamos.
Handoff conecta etapas.
```

---

# 2. Identidad visual del squad

Los agentes comparten un sistema de iconos SVG pensado para funcionar desde **16×16 px** y conservar identidad por silueta, no solo por color.

<table>
  <tr>
    <td align="center"><img src=".fruti/assets/avatars/kiwi/kiwi-tile.svg" width="56" alt="Kiwi"><br><strong>Kiwi</strong><br><sub>organizar</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/lima/lima-tile.svg" width="56" alt="Lima"><br><strong>Lima</strong><br><sub>validar</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/coco/coco-tile.svg" width="56" alt="Coco"><br><strong>Coco</strong><br><sub>inspeccionar</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/bruno/bruno-tile.svg" width="56" alt="Bruno"><br><strong>Bruno</strong><br><sub>conectar</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/mora/mora-tile.svg" width="56" alt="Mora"><br><strong>Mora</strong><br><sub>catalogar</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/fruti-squad/fruti-squad-tile.svg" width="56" alt="Fruti Squad"><br><strong>Squad</strong><br><sub>orquestar</sub></td>
  </tr>
</table>

Los assets canónicos viven en:

```text
.fruti/assets/avatars/
├── kiwi/
├── lima/
├── coco/
├── bruno/
├── mora/
└── fruti-squad/
```

Cada identidad incluida en el paquete tiene:

- `<name>.svg` — icono estándar con `currentColor`;
- `<name>.small.svg` — variante mínima para tamaños pequeños;
- `<name>-tile.svg` — avatar de marca con fondo y color propio.

El índice machine-readable está en:

```text
.fruti/identity/avatars.json
```

> Kiro no expone actualmente un campo oficial para asignar un SVG personalizado como avatar nativo del agente. Por eso Fruti Squad conserva estos SVG como identidad canónica para README, documentación, extensiones e interfaces propias. Dentro de Kiro, `welcomeMessage` usa el nombre y rol del agente sin sustituir el avatar por emojis de fruta.

---

# 3. Los miembros del squad

## <img src=".fruti/assets/avatars/kiwi/kiwi-tile.svg" width="28" alt=""> Kiwi · Structure

**Responsabilidad:** entender el problema y definir la estructura funcional antes de diseñar apariencia.

Kiwi trabaja principalmente en:

- brief funcional;
- user flow;
- arquitectura de una pantalla;
- organización de información;
- jerarquía;
- estados necesarios;
- comportamiento adaptativo;
- wireframes F0, F1 y F2;
- contratos geométricos;
- alcance de un rediseño.

### Kiwi sí decide

- qué regiones necesita la interfaz;
- qué aparece primero;
- qué acciones existen;
- qué cambia entre compact, medium y expanded;
- cómo se reorganiza la experiencia en distintos tamaños;
- qué estados deben contemplarse.

### Kiwi no decide

- color final;
- tipografía visual final;
- sombras;
- estilos decorativos;
- implementación Vue/React;
- tokens;
- API pública del componente.

### Ejemplos

```text
"Define la estructura de la pantalla de clientes."

"Quiero rediseñar este formulario."

"Haz un wireframe del flujo de reserva."

"¿Cómo debería comportarse esta pantalla en móvil?"
```

---

## <img src=".fruti/assets/avatars/lima/lima-tile.svg" width="28" alt=""> Lima · Governance

**Responsabilidad:** convertir una estructura aprobada en una pieza gobernada por el sistema de diseño.

Lima funciona como la capa arquitectónica del squad.

Trabaja con:

- clasificación de piezas;
- reuse / extend / new / local;
- contratos;
- tokens;
- registry;
- lifecycle;
- estados;
- API conceptual;
- quality gates;
- promoción y deprecación;
- reglas del Design Hub.

### Preguntas que Lima responde

```text
¿Ya existe esta pieza?

¿Debemos reutilizarla?

¿Es una variante de algo existente?

¿Debe convertirse en componente del sistema?

¿Cuál es su contrato?

¿Qué estados son obligatorios?

¿Qué tokens puede consumir?

¿Está lista para pasar a implementación?
```

Lima no debería cambiar arbitrariamente la geometría congelada por Kiwi ni implementar comportamiento que pertenece a Bruno.

---

## <img src=".fruti/assets/avatars/coco/coco-tile.svg" width="28" alt=""> Coco · Visual Construction + Audit

Coco tiene dos intervenciones distintas dentro del flujo.

### Primera intervención: F3

Después de Kiwi y Lima, Coco materializa la versión visual de alta fidelidad.

Es dueño de:

- F3;
- composición visual;
- aplicación del sistema real;
- CSS;
- jerarquía visual;
- densidad;
- tokens visuales aprobados;
- estados visuales;
- comportamiento responsive visual.

Coco no debería inventar una estructura diferente a la aprobada por Kiwi ni cambiar unilateralmente el contrato definido por Lima.

### Segunda intervención: R0

Después de Bruno, Coco vuelve como auditor.

R0 revisa, entre otras cosas:

- cumplimiento visual;
- consistencia;
- accesibilidad observable;
- overflow;
- jerarquía;
- densidad;
- composición adaptativa;
- uso de tokens;
- desviaciones del contrato;
- evidencia técnica disponible.

Por eso Coco aparece dos veces:

```text
Coco F3/CSS
    ↓
Bruno R3
    ↓
Coco R0
```

Construir y auditar son dos momentos distintos.

---

## <img src=".fruti/assets/avatars/bruno/bruno-tile.svg" width="28" alt=""> Bruno · Frontend R3

**Responsabilidad:** convertir la pieza aprobada en comportamiento frontend real.

Bruno es dueño principalmente de:

- script;
- template;
- props;
- events;
- slots;
- v-model cuando aplique;
- estados controlados;
- interacción;
- teclado;
- foco;
- ARIA funcional;
- comportamiento del componente;
- pruebas funcionales disponibles.

### Bruno recibe

De Kiwi:

- estructura;
- estados;
- comportamiento adaptativo.

De Lima:

- contrato;
- API;
- clasificación;
- restricciones.

De Coco:

- F3;
- clases;
- CSS aprobado.

### Bruno no debería modificar

- arquitectura UX de Kiwi;
- contrato/tokens/registry de Lima;
- CSS visual de Coco;
- documentación del Hub de Mora.

Si falta una decisión, Bruno la devuelve al dueño correspondiente en vez de inventarla.

---

## <img src=".fruti/assets/avatars/mora/mora-tile.svg" width="28" alt=""> Mora · Documentation

**Responsabilidad:** documentar únicamente aquello que ya existe y fue verificado.

Mora trabaja con:

- Design Hub;
- páginas de componentes;
- registry;
- navegación documental;
- metadatos;
- coverage;
- deprecaciones;
- ejemplos;
- evidencia de implementación;
- sincronización entre documentación y código.

### Regla fundamental

> Mora documenta verdad comprobable.

Si una API, estado o preview no existe, no lo inventa para completar una página bonita. Bastantes wikis corporativas ya practican ese deporte.

---

# 4. El orquestador: `fruti-squad`

Además de los agentes especializados existe:

```text
fruti-squad
```

Es el **agente coordinador**.

No reemplaza a Kiwi, Lima, Coco, Bruno o Mora. Su trabajo es decidir qué especialista debe actuar y delegarle la etapa correspondiente.

Flujo general:

```text
Usuario
  │
  ▼
fruti-squad
  │
  ├── kiwi
  │     ↓
  ├── lima
  │     ↓
  ├── coco
  │     ↓
  ├── bruno
  │     ↓
  ├── coco
  │     ↓
  ├── lima
  │     ↓
  └── mora
```

Una salida de un subagente **no equivale a aprobación del usuario**.

Si una etapa requiere aprobación, el flujo debe detenerse antes de continuar.

Esto es especialmente importante en:

- aprobación de estructura;
- aprobación de F3;
- decisiones de producto;
- cambios de alcance;
- nuevas dependencias;
- cambios del sistema de diseño.

---

# 5. Fidelidades y etapas

Fruti Squad utiliza varios nombres cortos durante el flujo.

| Nivel | Significado |
| --- | --- |
| **F0** | estructura mínima / esquemática |
| **F1** | estructura con mayor detalle |
| **F2** | wireframe estructural suficientemente definido para congelar geometría |
| **F3** | alta fidelidad visual con el sistema real |
| **R3** | implementación funcional |
| **R0** | auditoría/cumplimiento posterior a implementación |

Una forma simple de entenderlo:

```text
F0 → F1 → F2
entender estructura

F3
definir apariencia real

R3
hacer que funcione

R0
comprobar que lo construido cumple
```

---

# 6. Arquitectura instalada

Después de instalar el paquete aparecen dos carpetas principales:

```text
.kiro/
.fruti/
```

## `.kiro/`

Contiene la configuración que Kiro entiende directamente.

```text
.kiro/
├── agents/
│   ├── fruti-squad.md
│   ├── kiwi.md
│   ├── lima.md
│   ├── coco.md
│   ├── bruno.md
│   └── mora.md
│
├── skills/
│   ├── kiwi/
│   ├── lima/
│   ├── coco/
│   ├── bruno/
│   ├── mora-docs/
│   ├── impeccable/
│   └── improve-animations/
│
└── steering/
    └── fruti-squad.md
```

### `.kiro/agents/`

Define los trabajadores.

Aquí viven:

- rol;
- herramientas;
- permisos;
- recursos;
- delegación;
- responsabilidad.

### `.kiro/skills/`

Contiene procedimientos y conocimiento especializado.

Ejemplo:

```text
.kiro/skills/bruno/
├── SKILL.md
└── references/
```

El Agent define **quién es Bruno**.

La Skill define **cómo Bruno ejecuta R3**.

### `.kiro/steering/`

Contiene memoria compartida.

`fruti-squad.md` establece, entre otras cosas:

- propiedad de cada etapa;
- límites entre agentes;
- división de R3;
- reglas de aprobación;
- relación entre los miembros.

---

# 7. ¿Qué es `.fruti/`?

`.fruti/` es el estado y protocolo compartido del squad.

No es configuración interna de Kiro. Es la capa que permite que varios agentes trabajen como un sistema coherente.

Estructura principal:

```text
.fruti/
├── audit-manifest.yaml
├── contracts/
├── handoffs/
├── runtime/
├── state/
├── paths.yaml
└── policy.md
```

## `.fruti/policy.md`

Es la política general de ejecución.

Define principios como:

- **route first, read second**;
- no cargar documentación innecesaria;
- distinguir reglas normativas de evidencia de implementación;
- no copiar decisiones visuales desde código legacy;
- respetar ownership;
- no inventar decisiones faltantes;
- pasar handoffs compactos.

## `.fruti/runtime/`

Cada agente tiene un contrato compacto:

```text
runtime/
├── kiwi.yaml
├── lima.yaml
├── coco.yaml
├── bruno.yaml
└── mora.yaml
```

Estos archivos sirven como routers.

Ejemplo conceptual:

```text
Solicitud
   ↓
runtime/bruno.yaml
   ↓
qué información leer
   ↓
qué operación ejecutar
   ↓
qué producir
   ↓
a quién entregar
```

El runtime evita que un agente cargue veinte documentos “por si acaso”.

## `.fruti/contracts/`

Contiene reglas compartidas que deben mantenerse estables.

Por ejemplo:

- target de implementación;
- documentación;
- tipografía;
- convenciones estructurales.

Un contrato es más fuerte que una inferencia casual del código.

## `.fruti/state/current.json`

Es el estado operativo actual.

Puede contener información como:

```text
proyecto activo
artefacto activo
round
fase
owner
next_owner
perfil activo
preguntas abiertas
último handoff
```

No pretende reemplazar las fuentes canónicas.

Es una caché operativa para evitar que cada agente reconstruya la historia desde cero.

## `.fruti/handoffs/current.json`

Es el paquete de transferencia entre dos etapas.

Un handoff puede incluir:

- artefacto;
- round;
- agente origen;
- próximo agente;
- decisiones congeladas;
- piezas;
- estados;
- comportamiento adaptativo;
- preguntas abiertas;
- blockers;
- rutas de evidencia;
- delta desde la etapa anterior.

El objetivo es pasar **lo necesario**, no pegar la conversación completa.

## `.fruti/paths.yaml`

Resuelve rutas lógicas del Fruti Squad a su ubicación real dentro de Kiro.

Por ejemplo:

```text
agentes/bruno
→ .kiro/skills/bruno

skills/lima
→ .kiro/skills/lima
```

Esto permite que los contratos internos sean portables.

---

# 8. Skills adicionales

Además del squad principal se incluyen Skills auxiliares.

## Impeccable

```text
.kiro/skills/impeccable/
```

Es un conjunto de playbooks para mejorar calidad visual.

Puede ayudar con:

- critique;
- polish;
- color;
- typography;
- layout;
- hierarchy;
- responsive adaptation;
- accessibility;
- motion;
- hardening visual.

Normalmente Lima o Coco pueden utilizarlo como conocimiento especializado.

No sustituye el ownership del squad.

## Improve Animations

```text
.kiro/skills/improve-animations/
```

Se enfoca en:

- microinteracciones;
- motion;
- feedback;
- continuidad;
- transiciones;
- comportamiento animado.

La animación no debe utilizarse como decoración gratuita. Debe explicar cambio, feedback, continuidad o estado.

---

# 9. Instalación

## Requisitos

- Node.js **18 o superior**.
- npm.
- Un proyecto que quieras abrir/utilizar con Kiro.

Comprueba Node:

```bash
node --version
```

---

## Instalar desde GitHub

Desde la raíz del proyecto:

```bash
npm install --save-dev github:kevinedgm/fruti-squad-kiro
```

El paquete todavía no necesita estar publicado en el registro npm para funcionar.

El `postinstall` copia automáticamente:

```text
node_modules/fruti-squad-kiro/.kiro
                    ↓
tu-proyecto/.kiro

node_modules/fruti-squad-kiro/.fruti
                    ↓
tu-proyecto/.fruti
```

Después abre **la raíz del proyecto** en Kiro.

No abras únicamente `.kiro/`.

---

# 10. Instalación segura y conflictos

El instalador está diseñado para no destruir personalizaciones locales.

## Archivo inexistente

```text
no existe
↓
crear
```

## Archivo idéntico

```text
ya existe
+
es idéntico
↓
no hacer nada
```

## Archivo distinto

```text
ya existe
+
tiene cambios locales
↓
NO sobrescribir
↓
reportar conflicto
```

Por tanto, volver a ejecutar:

```bash
npx fruti-squad-kiro install
```

es seguro por defecto.

---

## Ver qué cambiaría

```bash
npx fruti-squad-kiro install --dry-run
```

No escribe nada.

---

## Forzar reemplazo

```bash
npx fruti-squad-kiro install --force
```

Esto sí puede sustituir archivos locales modificados.

Úsalo conscientemente. Un `--force` es básicamente el botón de “yo sé lo que estoy haciendo”, una frase famosa por preceder eventos educativos.

---

## Instalar en otra ruta

```bash
npx fruti-squad-kiro install --target ../otro-proyecto
```

---

## Si npm se ejecuta con `--ignore-scripts`

El `postinstall` no se ejecutará.

Después corre manualmente:

```bash
npx fruti-squad-kiro install
```

---

# 11. Primer uso

Después de instalar:

1. abre la raíz del proyecto en Kiro;
2. comprueba que existen `.kiro/` y `.fruti/`;
3. usa el agente especializado o el orquestador;
4. describe lo que necesitas en lenguaje natural.

Ejemplo:

```text
Quiero rediseñar el formulario de registro.
Debe funcionar bien en escritorio, tablet y móvil.
```

Con el orquestador, el sistema debería distribuir el trabajo según la etapa.

No necesitas escribir:

```text
ejecuta F2
ahora gate
ahora R3
ahora R0
```

Esos nombres existen para gobernar internamente el proceso, no para obligar al usuario a hablar como un archivo YAML.

---

# 12. Cuándo usar cada agente directamente

No toda tarea necesita el squad completo.

## Usa Kiwi cuando…

```text
"Necesito estructurar esta pantalla."

"Antes de diseñar quiero resolver el flujo."

"¿Cómo debería reorganizarse en móvil?"
```

## Usa Lima cuando…

```text
"¿Esto debería ser un componente nuevo?"

"Promueve esta pieza al sistema."

"Define el contrato de este componente."

"Quiero cambiar el token de acción principal."
```

## Usa Coco cuando…

```text
"Construye la F3 con el sistema real."

"Aplica el diseño aprobado."

"Audita visualmente este componente."
```

## Usa Bruno cuando…

```text
"Implementa el comportamiento del componente aprobado."

"Agrega props, eventos y teclado."

"Implementa esta pieza Vue respetando el F3."
```

## Usa Mora cuando…

```text
"Documenta este componente ya implementado."

"Actualiza el Design Hub."

"Revisa la cobertura documental."
```

## Usa Fruti Squad cuando…

la petición atraviesa varias responsabilidades:

```text
"Diseña e implementa un nuevo DatePicker."

"Rediseña esta sección y déjala documentada."

"Crea el nuevo flujo de reservas usando nuestro sistema de diseño."
```

---

# 13. Fuentes de verdad

Fruti Squad intenta distinguir entre:

## Autoridad normativa

Lo que **debe ser**.

Ejemplos:

- instrucción actual del usuario;
- estructura aprobada;
- contrato;
- tokens;
- perfil activo;
- registry;
- audit manifest.

## Evidencia de implementación

Lo que **actualmente existe en código**.

El código puede inspeccionarse para implementar o verificar.

Pero una implementación vieja no se convierte automáticamente en una regla de diseño.

Ejemplo:

```text
legacy.css tiene border-radius: 17px
```

Eso no significa:

```text
"el sistema de diseño usa 17px"
```

a menos que una fuente normativa lo confirme.

---

# 14. Rediseño de productos existentes

Fruti Squad puede trabajar tanto en:

- proyectos nuevos;
- sistemas existentes;
- rediseños progresivos.

En un rediseño, el código actual sirve para entender:

- funcionalidad;
- rutas;
- datos;
- restricciones;
- interacciones existentes.

Pero no debería utilizarse automáticamente como autoridad de la nueva identidad visual.

Conceptualmente:

```text
legacy
  ↓
entender qué hace

NO

legacy
  ↓
copiar cómo se ve
```

El objetivo es conservar comportamiento necesario sin heredar accidentalmente todos los defectos visuales acumulados desde aquella tarde de 2019.

---

# 15. Perfiles de proyecto y tematización

Fruti Squad **no instala un perfil activo universal**. Instala una plantilla y un preset neutro; cada repositorio crea su propio perfil con:

```bash
npx fruti-squad-kiro init
```

La tematización usa una estrategia de **configuración corta → tokens derivados**. No se pide una paleta completa ni una lista manual de cada estado.

Defaults del starter:

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

Si omites `primary`, usa `brand`; si omites `fontDisplay`, usa `font`. A partir de estas entradas, el contrato define la derivación de variantes `strong`, `soft`, `text`, `on-*`, semánticos, neutros, categorías y tema oscuro.

### Inicialización rápida

```bash
npx fruti-squad-kiro init
```

### Personalizar el starter

```bash
npx fruti-squad-kiro init \
  --brand "#7A1F5C" \
  --accent "#0F766E" \
  --shape pill \
  --radius 12 \
  --font "Inter"
```

### ¿Y si después quiero cambiar el tema?

No vuelvas a ejecutar todo el `init`. El starter vive en:

```text
.fruti/theme/config.json
```

Puedes cambiar solo una o varias entradas con:

```bash
npx fruti-squad-kiro theme [opciones]
```

Por ejemplo, cambiar únicamente la marca:

```bash
npx fruti-squad-kiro theme --brand "#7A1F5C"
```

Cambiar marca y acento:

```bash
npx fruti-squad-kiro theme \
  --brand "#7A1F5C" \
  --accent "#0F766E"
```

Cambiar forma y radios:

```bash
npx fruti-squad-kiro theme --shape pill --radius 12
```

Cambiar espaciado:

```bash
npx fruti-squad-kiro theme --space 5
```

Cambiar tipografía:

```bash
npx fruti-squad-kiro theme \
  --font "Inter" \
  --font-display "Instrument Serif" \
  --font-size 16 \
  --type-scale 1.3
```

Configurar colores de categoría:

```bash
npx fruti-squad-kiro theme --categories 6
```

Cambiar la estrategia de neutros:

```bash
npx fruti-squad-kiro theme \
  --neutrals tinted \
  --neutrals-hue accent
```

Activar o desactivar modo oscuro:

```bash
npx fruti-squad-kiro theme --dark
npx fruti-squad-kiro theme --no-dark
```

Ver la configuración actual:

```bash
npx fruti-squad-kiro theme --show
```

Restablecer el starter:

```bash
npx fruti-squad-kiro theme --reset
```

`--reset` conserva el nombre del tema, pero devuelve las entradas visuales al preset de Fruti Squad.

También puedes editar manualmente:

```text
.fruti/theme/config.json
```

Por ejemplo:

```json
{
  "name": "Mi Design System",
  "brand": "#7A1F5C",
  "accent": "#0F766E",
  "radius": 12,
  "shape": "pill",
  "space": 5,
  "font": "Inter",
  "fontDisplay": "Instrument Serif",
  "fontSize": 16,
  "typeScale": 1.3,
  "neutrals": "tinted",
  "neutralsHue": "accent",
  "semanticCollision": "warn",
  "categories": 6,
  "dark": true
}
```

La regla importante es:

```text
SÍ editar
.fruti/theme/config.json

NO editar como configuración del proyecto
.fruti/defaults/theme.json
```

`.fruti/defaults/theme.json` es el preset reusable del paquete. `.fruti/theme/config.json` es la configuración propia del proyecto.

Cambiar una entrada **no exige volver a declarar el resto**. El comando `theme` conserva todos los valores que no modificaste.

No edites a mano variantes derivadas como `brand-strong`, `brand-soft`, `on-brand`, semánticos o colores oscuros derivados. Si necesitas una excepción avanzada, debe entrar por el contrato de tematización/`overrides`, no como un valor suelto dentro de un componente.

### Proyecto con design system existente

```bash
npx fruti-squad-kiro init --theme existing --theme-source path/to/tokens.css
```

En modo `existing`, Fruti enlaza la fuente visual que ya posee el proyecto y **no crea otra verdad paralela**.

Archivos relevantes:

```text
.fruti/defaults/theme.json       # preset reusable, nunca perfil activo
.fruti/contracts/theming.yaml    # contrato de entradas, derivación y mínimos
.fruti/theme/config.json         # input corto LOCAL del proyecto (starter)
.kiro/skills/lima/profiles/...  # perfil local activo
```

La propiedad queda separada así:

```text
proyecto/usuario → inputs del tema
contrato         → derivación
componentes      → consumo de tokens
```

Los componentes no inventan colores, radios o espaciados para completar huecos del tema.

---

# 16. Ownership: quién puede cambiar qué

Una de las reglas más importantes del squad es el ownership.

| Decisión | Dueño principal |
| --- | --- |
| Estructura y flujo | Kiwi |
| Geometría F0–F2 | Kiwi |
| Contratos | Lima |
| Tokens | Lima |
| Registry | Lima |
| F3 / apariencia | Coco |
| CSS | Coco |
| Script/template funcional | Bruno |
| Props/events/slots | Bruno |
| Teclado/foco/ARIA funcional | Bruno |
| Auditoría R0 | Coco |
| Lifecycle/gates | Lima |
| Documentación | Mora |

Esto evita el clásico:

```text
"ya que estaba aquí también cambié..."
```

que es una excelente manera de conseguir seis fuentes de verdad y ninguna verdad.

---

# 17. Aislamiento y privacidad entre proyectos

Fruti Squad está diseñado para ser **reutilizable y agnóstico del producto**.

El paquete distribuido no debe contener:

- nombres de proyectos reales;
- nombres de clientes;
- rutas internas de otros repositorios;
- perfiles completos de productos reales;
- tokens o paletas pertenecientes a otro producto;
- decisiones de negocio;
- URLs internas;
- credenciales;
- ejemplos copiados de sistemas privados;
- estados o handoffs procedentes de otro proyecto.

Los ejemplos incluidos en el paquete utilizan únicamente placeholders como:

```text
<project-name>
<design-system-name>
<component-name>
```

La información específica se genera **después de instalar**, dentro del proyecto consumidor.

Por ejemplo:

```text
.kiro/skills/lima/profiles/<project-name>.md
.fruti/state/current.json
.fruti/handoffs/current.json
.fruti/tokens.json
```

Esos archivos pertenecen al proyecto donde se está trabajando, no al paquete reusable.

> Regla: una Skill puede enseñar un procedimiento, pero nunca debe llevarse consigo la memoria privada de otro proyecto.

Si el repositorio consumidor es público, revisa también qué perfiles, contratos y estados locales quieres versionar, porque pueden describir detalles propios de ese producto.

---

# 18. Handoffs en lugar de contexto infinito

Los agentes no deberían pasarse conversaciones gigantes.

El patrón preferido es:

```text
agente A
  ↓
decisiones + evidencia + blockers
  ↓
handoff
  ↓
agente B
```

Un buen handoff responde:

- ¿qué pieza estamos trabajando?;
- ¿qué está aprobado?;
- ¿qué está congelado?;
- ¿qué falta?;
- ¿dónde está la evidencia?;
- ¿quién es el siguiente dueño?

Así cada etapa consume el contexto necesario sin volver a investigar todo el repositorio.

---

# 19. Actualizar Fruti Squad

Si instalaste desde GitHub:

```bash
npm update fruti-squad-kiro
```

Después reaplica archivos nuevos:

```bash
npx fruti-squad-kiro install
```

Si hay archivos que personalizaste, aparecerán como conflictos y se conservarán.

Para reemplazarlos deliberadamente:

```bash
npx fruti-squad-kiro install --force
```

---

# 20. Desinstalar

npm puede quitar la dependencia:

```bash
npm uninstall fruti-squad-kiro
```

Pero recuerda:

`.kiro/` y `.fruti/` se copian al proyecto para poder versionarse y personalizarse.

Por seguridad, el uninstall de npm **no borra automáticamente esas carpetas**.

Si quieres retirarlas, revísalas y elimínalas manualmente.

---

# 21. Desarrollo del paquete

Clona el repositorio:

```bash
git clone https://github.com/kevinedgm/fruti-squad-kiro.git
cd fruti-squad-kiro
```

Ejecuta pruebas:

```bash
npm test
```

Inspecciona el contenido que entraría al paquete:

```bash
npm pack --dry-run
```

Genera el paquete local:

```bash
npm pack
```

La CI también realiza una instalación real del tarball en un proyecto temporal para comprobar que el `postinstall` genere correctamente `.kiro/` y `.fruti/`.

---

# 22. Estado del paquete npm

Actualmente el paquete puede instalarse directamente desde GitHub:

```bash
npm install --save-dev github:kevinedgm/fruti-squad-kiro
```

El nombre declarado en `package.json` es:

```text
fruti-squad-kiro
```

Para poder instalarlo simplemente con:

```bash
npm install --save-dev fruti-squad-kiro
```

debe publicarse también en el registro público de npm.

---

# 23. Preguntas frecuentes

## ¿Fruti Squad reemplaza Kiro?

No.

Fruti Squad utiliza las capacidades de Kiro para crear una organización multiagente especializada.

---

## ¿Todos los trabajos tienen que pasar por todos los agentes?

No.

Una corrección documental puede ir directamente a Mora.

Un cambio funcional ya diseñado puede ir a Bruno.

El flujo completo se usa cuando la tarea atraviesa varias responsabilidades.

---

## ¿Puedo modificar las Skills?

Sí.

Al instalarse dentro del proyecto, `.kiro/` y `.fruti/` pueden versionarse y adaptarse.

El instalador evita sobrescribir cambios locales por defecto.

---

## ¿Las Skills son específicas del proyecto?

El procedimiento intenta ser reutilizable.

Las decisiones del producto deben vivir principalmente en perfiles, contratos, tokens, registry y estado del proyecto.

---

## ¿Por qué Coco y Bruno están separados?

Porque apariencia y comportamiento son responsabilidades distintas.

```text
Coco
→ cómo se ve

Bruno
→ cómo funciona
```

Después Coco vuelve para comprobar que la implementación conserva el resultado esperado.

---

## ¿Qué ocurre si falta información?

El agente no debería inventarla silenciosamente.

Debe:

1. identificar qué decisión falta;
2. marcarla como unresolved/blocker;
3. determinar quién es su dueño;
4. devolverla al agente correspondiente;
5. preguntar al usuario solo cuando sea realmente una decisión de producto.

---

# 24. Resumen

<table>
  <tr>
    <td align="center"><img src=".fruti/assets/avatars/kiwi/kiwi-tile.svg" width="48" alt="Kiwi"><br><strong>Kiwi</strong><br><sub>estructura</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/lima/lima-tile.svg" width="48" alt="Lima"><br><strong>Lima</strong><br><sub>gobernanza</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/coco/coco-tile.svg" width="48" alt="Coco"><br><strong>Coco</strong><br><sub>F3 / CSS / R0</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/bruno/bruno-tile.svg" width="48" alt="Bruno"><br><strong>Bruno</strong><br><sub>R3 funcional</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/mora/mora-tile.svg" width="48" alt="Mora"><br><strong>Mora</strong><br><sub>documentación</sub></td>
    <td align="center"><img src=".fruti/assets/avatars/fruti-squad/fruti-squad-tile.svg" width="48" alt="Fruti Squad"><br><strong>Squad</strong><br><sub>orquestación</sub></td>
  </tr>
</table>

```text
Kiro
├── Agents
├── Skills
├── Steering
└── Subagents

.fruti
├── runtime
├── contracts
├── state
├── handoffs
└── policy
```

El propósito no es tener más agentes.

El propósito es que **cada decisión tenga un dueño, cada etapa tenga evidencia y el sistema pueda continuar sin reinterpretar el proyecto en cada turno**.

---

## Licencia

MIT.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/marca/hecho-en-oaxaca/sello-horizontal-oscuro.svg">
    <img src="assets/marca/hecho-en-oaxaca/sello-horizontal.svg" alt="Hecho en Oaxaca / Made in Oaxaca" width="180">
  </picture>
</p>
