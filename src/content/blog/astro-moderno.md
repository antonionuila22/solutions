---
title: "Astro es moderno"
description: "Exploramos por qué Astro es un framework ultra rápido."
author: "Nico Fries"
readtime: 6
img: ./photos/learnastro.webp
imageAlt: "Portada Astro"
date: 2024-03-28
---

## ¿Qué es Astro?

**Astro** es un framework moderno para construir sitios web rápidos, enfocado en rendimiento y experiencia de desarrollo. Fue diseñado con la idea de enviar *menos JavaScript al cliente* y mejorar los tiempos de carga de manera significativa.

> “Con Astro, solo se carga lo que el usuario necesita. Nada más.” — *El equipo de Astro*

## Características clave

### 1. Islands Architecture

Astro permite combinar componentes interactivos solo donde se necesitan. Esto significa que puedes tener componentes de React, Svelte o Vue aislados dentro de una página estática sin cargar el bundle completo.

### 2. Compatibilidad con múltiples frameworks

Podés usar componentes de:

- React
- Vue
- Svelte
- SolidJS
- Preact

¡Todos en el mismo proyecto!

### 3. Markdown y MDX

Astro soporta contenido en `.md` y `.mdx` de forma nativa, ideal para blogs o documentación. Ejemplo:

```jsx
<Content client:load />
