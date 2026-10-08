# Fruti Squad for Kiro

Fruti Squad adaptado a Kiro: agentes, skills, steering y runtime compartido para Kiwi, Lima, Coco, Bruno y Mora.

## Instalación desde GitHub

```bash
npm install --save-dev github:kevinedgm/fruti-squad-kiro
```

El `postinstall` copia de forma segura `.kiro/` y `.fruti/` al proyecto que ejecutó npm. Los archivos existentes con contenido distinto no se sobrescriben automáticamente.

## Reinstalar o actualizar archivos

```bash
npx fruti-squad-kiro install
```

Para reemplazar archivos existentes:

```bash
npx fruti-squad-kiro install --force
```

Para inspeccionar sin escribir:

```bash
npx fruti-squad-kiro install --dry-run
```

## Agentes principales

- `/fruti-squad`: orquestador
- `/kiwi`: estructura y UX
- `/lima`: gobernanza y contratos
- `/coco`: construcción visual y auditoría
- `/bruno`: implementación Vue / R3
- `/mora`: documentación

## Estructura

```text
.kiro/
  agents/
  skills/
  steering/
.fruti/
  runtime/
  state/
  handoffs/
  contracts/
```

> El paquete está preparado para instalarse directamente desde GitHub. El comando corto `npm install fruti-squad-kiro` requerirá publicar posteriormente el paquete en el registro de npm.
