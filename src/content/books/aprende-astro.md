---
title: "Astro "
description: "Exploramos por qué Astro es un framework ultra rápido."
author: "Ramon Nuila"
readtime: 6
img: ./photos/learnastro.webp
imageAlt: "Portada Astro"
date: 2024-03-28

---
## 🚀 Primeros pasos con Astro.js

Astro es un moderno framework para construir sitios web rápidos, enfocado en contenido estático, componentes ligeros y sin JavaScript innecesario en el cliente.

---

## 🧰 Requisitos previos

- Node.js (v18 o superior recomendado)
- npm o pnpm instalado
- Editor de código como VSCode

---

## 🛠️ Crear un nuevo proyecto

```bash
npm create astro@latest
```

Sigue las instrucciones del CLI para configurar tu proyecto. Puedes elegir una plantilla (ej. "Minimal") y opciones como TypeScript, Tailwind, etc.

---

## ▶️ Iniciar el servidor local

```bash
cd nombre-del-proyecto
npm install
npm run dev
```

Esto abrirá tu proyecto en `http://localhost:4321`

---

## 📁 Estructura básica

```bash
/src
  ├── components
  ├── layouts
  └── pages
/public
astro.config.mjs
```

- `pages/`: Cada archivo `.astro` o `.md` se convierte en una ruta.
- `components/`: Reutiliza componentes UI (Astro, React, Vue, etc).
- `layouts/`: Plantillas para páginas completas.

---

## 🧩 Crear una página básica

```astro
---
// src/pages/index.astro
---

<html>
  <head><title>Mi primer sitio Astro</title></head>
  <body>
    <h1>¡Hola Astro!</h1>
  </body>
</html>
```

---

## 🎉 ¿Qué sigue?

- Agrega tus componentes con `<MyComponent />`
- Usa Markdown con `.md` o `.mdx`
- Instala integraciones: `npx astro add tailwind`
- Publica en Vercel, Netlify, etc.

---

## 📚 Recursos útiles

- [Documentación oficial](https://docs.astro.build/)
- [Astro en GitHub](https://github.com/withastro/astro)
- [Plantillas Astro](https://astro.build/themes/)
