# Fruti Squad for Kiro

Distribución nativa de Fruti Squad para Kiro: custom agents, Agent Skills, Steering y runtime compartido para Kiwi, Lima, Coco, Bruno y Mora.

## Instalación

En la raíz del proyecto donde quieres usar el squad:

```bash
npm install --save-dev github:kevinedgm/fruti-squad-kiro
```

El `postinstall` copia automáticamente `.kiro/` y `.fruti/` al proyecto consumidor.

### Conflictos seguros

El instalador:

- crea archivos que no existen;
- deja intactos los archivos idénticos;
- no sobrescribe por defecto un archivo local distinto;
- reporta conflictos para que no desaparezcan personalizaciones por arte de magia.

Reaplicar manualmente:

```bash
npx fruti-squad-kiro install
```

Forzar reemplazo de conflictos:

```bash
npx fruti-squad-kiro install --force
```

Previsualizar sin escribir:

```bash
npx fruti-squad-kiro install --dry-run
```

Instalar en otra carpeta:

```bash
npx fruti-squad-kiro install --target ../otro-proyecto
```

Si npm se ejecuta con `--ignore-scripts`, el `postinstall` no corre. Ejecuta después `npx fruti-squad-kiro install`.

## Flujo

```text
kiwi
  ↓
lima
  ↓
coco · F3/CSS
  ↓
bruno · R3 funcional
  ↓
coco · R0
  ↓
lima · gates
  ↓
mora
```

## Agentes

| Comando | Responsabilidad |
| --- | --- |
| `/fruti-squad` | Orquestación completa |
| `/kiwi` | Estructura y UX F0–F2 |
| `/lima` | Gobernanza, contratos, tokens y lifecycle |
| `/coco` | F3/CSS y auditoría R0 |
| `/bruno` | Funcionalidad frontend R3 |
| `/mora` | Documentación verificada |

## Estructura instalada

```text
.kiro/
├── agents/
├── skills/
└── steering/

.fruti/
├── contracts/
├── handoffs/
├── runtime/
└── state/
```

El paquete instala solo runtime/configuración reusable. El perfil y estado de cada proyecto se resuelven en el proyecto consumidor; no se incluye configuración fija de ManikImpulsa ni de otro producto.

## Actualizar

```bash
npm update fruti-squad-kiro
npx fruti-squad-kiro install
```

Para reemplazar personalizaciones locales con la versión nueva:

```bash
npx fruti-squad-kiro install --force
```

## Desarrollo

```bash
npm test
npm pack --dry-run
```

## Nombre corto en npm

El repositorio ya es un paquete npm válido. Para que también funcione:

```bash
npm install fruti-squad-kiro
```

debe publicarse después en el registro de npm. Mientras tanto, la instalación directa desde GitHub funciona con el comando de arriba.
