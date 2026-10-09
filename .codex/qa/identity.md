# Identidad visual durante la ejecución

Los iconos de las skills están declarados en `agents/openai.yaml`: `icon_small`, `icon_large` y `brand_color`, con assets locales al directorio de cada skill. Kiwi/Lima/Coco/Bruno/Mora/Fruti Squad usan sus tiles canónicos; Impeccable e Improve Animations usan la marca del squad, sin inventar personajes.

Al iniciar el trabajo de un rol, emitir un aviso breve: **Nombre · etapa — acción — estado**. Al devolver/corregir/cerrar una revisión, anunciar el cambio de dueño y su acción siguiente. Mantener los estados reales; un avatar o una animación no es evidencia de ejecución ni PASS.

Si el host admite imágenes locales en mensajes de progreso, mostrar una vez el avatar de la skill activa junto al primer aviso de ese rol, usando su mecanismo documentado. Resolver el archivo desde la raíz del proyecto a una ruta absoluta; no asumir que una imagen Markdown relativa o un enlace `file://` se renderiza. Si el host no ofrece ese mecanismo o muestra el archivo como enlace, usar nombre/etapa/estado sin insistir ni bloquear la tarea. No insertar un avatar grande en cada actualización.

Los eventos nativos «agente comenzó/terminó» pertenecen a la interfaz del host: estos metadatos no garantizan reemplazar sus iconos. No añadir campos `avatar`/`icon` inventados a TOML ni afirmar que el host mostró un avatar sin comprobarlo. No generar imágenes nuevas para reemplazar los avatares del usuario.

Prueba en el consumidor: abrir el selector de skills y buscar Kiwi/Lima; comprobar icono y nombre. Invocar Kiwi, observar el primer aviso y después una revisión Lima. Registrar por separado (1) icono del selector, (2) imagen en el aviso del agente, (3) icono del evento nativo. Si uno no aparece, conservar el flujo operativo y reportar esa superficie concreta; no concluir que todos los mecanismos funcionan por haber visto solo uno.
