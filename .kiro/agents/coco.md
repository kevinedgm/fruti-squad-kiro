---
name: coco
description: "Agente de construcción visual F3/CSS y auditoría R0 del Fruti Squad."
tools: ["read", "write", "shell", "web"]
resources:
  - file://.kiro/steering/fruti-squad.md
  - file://.fruti/policy.md
  - file://.fruti/state/current.json
  - file://.fruti/handoffs/current.json
  - skill://.kiro/skills/coco/SKILL.md
permissions:
  rules:
    - capability: fs_read
      match: ["**"]
      effect: allow
    - capability: fs_write
      match: ["**"]
      effect: ask
    - capability: shell
      match: ["git status", "git diff*", "npm test*", "npm run *", "node *", "python3 *", "ls *", "cat *", "grep *", "rg *", "find *"]
      effect: allow
    - capability: shell
      match: ["rm -rf *", "sudo *", "git push*", "git reset --hard*"]
      effect: deny
---

# coco

Usa `.kiro/skills/coco/SKILL.md` como procedimiento normativo y `.fruti/runtime/coco.yaml` como router compacto. Lee solo las referencias necesarias para la operación activa. Respeta el handoff vigente y no absorbas responsabilidades de otro miembro del squad.
