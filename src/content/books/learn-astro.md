---
title: "Learn Astro.js - Complete Beginner's Guide"
description: "Master Astro.js from the ground up. Learn why Astro is the fastest framework for content-driven websites and how to build lightning-fast web applications."
author: "Ramon Nuila"
readtime: 25
img: ./photos/learnastro.webp
imageAlt: "Astro.js Framework Guide"
date: '2025-01-15'
---

# 🚀 Learn Astro.js - The Complete Guide

Welcome to the complete guide to Astro.js! Whether you're a seasoned developer or just starting your web development journey, this guide will teach you everything you need to know to build blazing-fast websites with Astro.

---

## 📖 Table of Contents

1. [What is Astro?](#what-is-astro)
2. [Why Choose Astro?](#why-choose-astro)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Core Concepts](#core-concepts)
7. [Working with Components](#working-with-components)
8. [Pages and Routing](#pages-and-routing)
9. [Layouts](#layouts)
10. [Data Fetching](#data-fetching)
11. [Content Collections](#content-collections)
12. [Islands Architecture](#islands-architecture)
13. [Integrations](#integrations)
14. [Styling](#styling)
15. [Deployment](#deployment)
16. [Best Practices](#best-practices)

---

## 🌟 What is Astro?

**Astro is a modern web framework for building fast, content-focused websites.** It's designed from the ground up to deliver better performance by shipping less JavaScript to the browser.

### Key Philosophy

Astro follows a simple but powerful philosophy:

- **Content-first**: Built specifically for content-heavy sites (blogs, marketing sites, documentation, e-commerce)
- **Server-first**: HTML is rendered on the server, not in the browser
- **Zero JS by default**: Only ship JavaScript when you actually need it
- **Framework agnostic**: Use React, Vue, Svelte, or any other framework—all in the same project

### What Makes Astro Different?

Unlike traditional JavaScript frameworks (React, Vue, Next.js), Astro:

1. **Ships zero JavaScript by default** - Your site loads instantly
2. **Allows framework mixing** - Use React for one component, Vue for another
3. **Generates static HTML** - Pre-renders pages at build time
4. **Enables partial hydration** - Only interactive components load JavaScript (Islands Architecture)

**Think of Astro as the "best of all worlds"**: the performance of static sites + the flexibility of dynamic frameworks.

---

## ⚡ Why Choose Astro?

### Performance Benefits

**Astro sites are incredibly fast because:**

- **Zero JavaScript overhead**: Most sites ship 40-90% less JavaScript
- **Automatic optimization**: Images, fonts, and CSS are optimized out of the box
- **Partial hydration**: Interactive components load independently
- **Edge-ready**: Deploy to edge networks for sub-100ms response times

**Real numbers:**
- Astro sites typically score **100/100 on Lighthouse**
- **2-3x faster** load times compared to traditional frameworks
- **10x less JavaScript** shipped to browsers

### Developer Experience

**Why developers love Astro:**

✅ **Familiar syntax**: If you know HTML, CSS, and JavaScript, you know Astro
✅ **Use any framework**: React, Vue, Svelte, Solid—or none at all
✅ **TypeScript support**: Built-in TypeScript without configuration
✅ **Markdown & MDX**: Write content in Markdown with component support
✅ **Built-in features**: Image optimization, RSS feeds, sitemaps included
✅ **Great DX**: Hot module replacement, helpful error messages, excellent docs

### Perfect Use Cases

**Astro excels at:**

- 📝 **Blogs and content sites** - Fast page loads, SEO-friendly
- 🛍️ **E-commerce storefronts** - Quick product pages, better conversions
- 📚 **Documentation sites** - Clean, searchable, accessible
- 📱 **Marketing websites** - High performance = better SEO = more leads
- 🎨 **Portfolio sites** - Showcase work without bloated JavaScript

**Not ideal for:**
- Highly interactive SPAs (Single Page Applications)
- Real-time dashboards with constant data updates
- Apps requiring persistent client-side state across many pages

---

## 🧰 Prerequisites

Before starting with Astro, you should have:

### Required Knowledge

- **HTML & CSS basics**: Understanding of web fundamentals
- **JavaScript fundamentals**: Variables, functions, arrays, objects
- **Terminal/Command line**: Basic navigation and commands
- **Package managers**: Familiarity with npm or pnpm

### Required Software

- **Node.js**: Version 18.14.1 or higher ([Download here](https://nodejs.org/))
- **Package manager**: npm (included with Node.js), pnpm, or yarn
- **Code editor**: [Visual Studio Code](https://code.visualstudio.com/) recommended
- **Git** (optional but recommended): For version control

### Recommended Tools

- **Astro VS Code Extension**: Syntax highlighting and IntelliSense
- **Browser DevTools**: Chrome or Firefox developer tools
- **Terminal**: iTerm2 (Mac), Windows Terminal, or integrated terminal in VS Code

### Optional Knowledge (Helpful but not required)

- TypeScript basics
- React, Vue, or Svelte (if you want to use them)
- Static site generation concepts
- Git and GitHub

**Don't worry if you don't know everything!** Astro is beginner-friendly and you'll learn as you go.

---

## 🛠️ Getting Started

### Installation

Create a new Astro project in seconds:

```bash
# Using npm
npm create astro@latest

# Using pnpm (faster)
pnpm create astro@latest

# Using yarn
yarn create astro
```

### Setup Wizard

The CLI will guide you through setup:

```
 astro   Launch sequence initiated.

   dir   Where should we create your new project?
         ./my-astro-site

  tmpl   How would you like to start your new project?
         ● Use blog template
         ○ Empty
         ○ Include sample files

    ts   Do you plan to write TypeScript?
         ● Yes  ○ No

   use   How strict should TypeScript be?
         ● Strict
         ○ Strictest
         ○ Relaxed

  deps   Install dependencies?
         ● Yes  ○ No

   git   Initialize a new git repository?
         ● Yes  ○ No
```

**Pro tip**: Choose "Include sample files" for your first project to see examples.

### Start Development Server

```bash
cd my-astro-site
npm install
npm run dev
```

Your site is now running at **`http://localhost:4321`** 🎉

### Available Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview built site locally
npm run astro --     # Run Astro CLI commands
```

---

## 📁 Project Structure

Understanding the file structure is key to working efficiently with Astro:

```
my-astro-site/
├── public/               # Static assets (images, fonts, etc.)
│   └── favicon.svg
├── src/
│   ├── components/       # Reusable UI components
│   │   └── Header.astro
│   ├── layouts/          # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/            # File-based routing (becomes URLs)
│   │   ├── index.astro   # Homepage (/)
│   │   ├── about.astro   # About page (/about)
│   │   └── blog/
│   │       └── post-1.md # Blog post (/blog/post-1)
│   ├── content/          # Content collections (Markdown/MDX)
│   │   └── blog/
│   └── styles/           # CSS/SCSS files
│       └── global.css
├── astro.config.mjs      # Astro configuration
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

### Key Directories Explained

**`public/`**
- Static files served as-is
- Not processed by Astro
- Use for images, fonts, `robots.txt`, etc.
- Access via `/filename.ext` (e.g., `/logo.webp`)

**`src/pages/`**
- **File-based routing**: Each file becomes a URL
- Supports `.astro`, `.md`, `.mdx`, `.html`, and framework files
- `index.astro` = homepage (`/`)
- Folders create URL paths

**`src/components/`**
- Reusable UI components
- Not automatically routed
- Can be `.astro` or framework components (`.jsx`, `.vue`, `.svelte`)

**`src/layouts/`**
- Template wrappers for pages
- Define common structure (header, footer, meta tags)
- Imported and used in pages

**`src/content/`**
- Content collections (blog posts, products, docs)
- Type-safe with schema validation
- Optimized for Markdown/MDX content

---

## 🎯 Core Concepts

### Astro Components

Astro components (`.astro` files) have a unique structure:

```astro
---
// Component Script (Runs at build time)
const pageTitle = "My Astro Page";
const items = ["Item 1", "Item 2", "Item 3"];

// Fetch data (runs on server)
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---

<!-- Component Template (HTML) -->
<html>
  <head>
    <title>{pageTitle}</title>
  </head>
  <body>
    <h1>{pageTitle}</h1>
    <ul>
      {items.map(item => <li>{item}</li>)}
    </ul>
  </body>
</html>
```

**Key features:**

1. **Frontmatter fence** (`---`): JavaScript/TypeScript that runs at build time
2. **Template**: HTML with JSX-like syntax
3. **No client-side JavaScript by default**: Everything runs on the server

### Component Props

Pass data to components like React:

```astro
---
// src/components/Greeting.astro
const { name, age } = Astro.props;
---

<div>
  <h1>Hello, {name}!</h1>
  <p>You are {age} years old.</p>
</div>
```

Use it:

```astro
---
import Greeting from '../components/Greeting.astro';
---

<Greeting name="John" age={30} />
```

### Astro.props and TypeScript

Type-safe props with TypeScript:

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  description?: string;
  image: string;
}

const { title, description, image } = Astro.props;
---

<div class="card">
  <img src={image} alt={title} />
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>
```

---

## 🧩 Working with Components

### Creating Your First Component

**1. Create a Header component:**

```astro
---
// src/components/Header.astro
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];
---

<header>
  <nav>
    <ul>
      {navItems.map(item => (
        <li><a href={item.href}>{item.label}</a></li>
      ))}
    </ul>
  </nav>
</header>

<style>
  header {
    background: #1e293b;
    padding: 1rem;
  }

  nav ul {
    display: flex;
    gap: 2rem;
    list-style: none;
  }

  nav a {
    color: white;
    text-decoration: none;
  }
</style>
```

**2. Use it in a page:**

```astro
---
// src/pages/index.astro
import Header from '../components/Header.astro';
---

<html>
  <head>
    <title>My Site</title>
  </head>
  <body>
    <Header />
    <main>
      <h1>Welcome!</h1>
    </main>
  </body>
</html>
```

### Scoped Styles

Styles in Astro components are **automatically scoped** to that component:

```astro
<div class="card">
  <h2>Card Title</h2>
</div>

<style>
  /* Only applies to THIS component */
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
  }
</style>
```

**No CSS conflicts, no naming conventions needed!**

### Slots

Use slots to pass content to components:

```astro
---
// src/components/Card.astro
---

<div class="card">
  <slot /> <!-- Content goes here -->
</div>
```

```astro
<Card>
  <h2>My Card Title</h2>
  <p>Card content here!</p>
</Card>
```

**Named slots:**

```astro
---
// src/components/Layout.astro
---

<div>
  <header>
    <slot name="header" />
  </header>
  <main>
    <slot /> <!-- Default slot -->
  </main>
  <footer>
    <slot name="footer" />
  </footer>
</div>
```

```astro
<Layout>
  <h1 slot="header">Page Title</h1>
  <p>Main content</p>
  <p slot="footer">© 2025</p>
</Layout>
```

---

## 📄 Pages and Routing

### File-Based Routing

Astro uses **file-based routing** - the file structure in `src/pages/` determines your URLs:

```
src/pages/
├── index.astro          → /
├── about.astro          → /about
├── contact.astro        → /contact
├── blog/
│   ├── index.astro      → /blog
│   ├── post-1.astro     → /blog/post-1
│   └── post-2.md        → /blog/post-2
└── products/
    └── [id].astro       → /products/123 (dynamic)
```

### Dynamic Routes

Create dynamic pages with `[param]` syntax:

```astro
---
// src/pages/products/[id].astro

export async function getStaticPaths() {
  return [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ];
}

const { id } = Astro.params;
---

<h1>Product {id}</h1>
```

**With data:**

```astro
---
export async function getStaticPaths() {
  const products = await fetch('https://api.example.com/products')
    .then(r => r.json());

  return products.map(product => ({
    params: { id: product.id },
    props: { product }
  }));
}

const { product } = Astro.props;
---

<h1>{product.name}</h1>
<p>{product.description}</p>
<p>${product.price}</p>
```

### Markdown Pages

Markdown files in `src/pages/` automatically become pages:

```markdown
---
layout: ../../layouts/BlogLayout.astro
title: "My First Post"
author: "Ramon"
date: "2025-01-15"
---

# My First Blog Post

This is **Markdown** content that becomes an HTML page!
```

---

## 🎨 Layouts

Layouts wrap pages with common structure:

```astro
---
// src/layouts/BaseLayout.astro
const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - My Site</title>
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/blog">Blog</a>
      </nav>
    </header>

    <main>
      <slot /> <!-- Page content -->
    </main>

    <footer>
      <p>© 2025 My Site</p>
    </footer>
  </body>
</html>

<style is:global>
  body {
    margin: 0;
    font-family: system-ui;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
```

**Use in pages:**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About">
  <h1>About Us</h1>
  <p>Welcome to our site!</p>
</BaseLayout>
```

---

## 🔄 Data Fetching

### Fetch at Build Time

Fetch data during the build (server-side):

```astro
---
// Runs at build time, not in the browser
const response = await fetch('https://api.github.com/users/withastro');
const user = await response.json();
---

<div>
  <h1>{user.name}</h1>
  <p>{user.bio}</p>
  <img src={user.avatar_url} alt={user.name} />
</div>
```

**No API keys exposed, no client-side requests!**

### Environment Variables

Store secrets safely:

```bash
# .env
API_KEY=your_secret_key
PUBLIC_API_URL=https://api.example.com
```

```astro
---
// Private (server-only)
const apiKey = import.meta.env.API_KEY;

// Public (accessible in browser)
const apiUrl = import.meta.env.PUBLIC_API_URL;

const data = await fetch(`${apiUrl}/data`, {
  headers: { 'Authorization': `Bearer ${apiKey}` }
}).then(r => r.json());
---

<div>{data.message}</div>
```

**Rule**: Prefix with `PUBLIC_` to expose to the browser, otherwise server-only.

---

## 📚 Content Collections

Content Collections are Astro's built-in way to manage Markdown/MDX content with type safety.

### Setup

**1. Define your collection schema:**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
```

**2. Add content:**

```markdown
---
# src/content/blog/my-first-post.md
title: "Getting Started with Astro"
description: "Learn how to build fast websites with Astro"
author: "Ramon Nuila"
date: 2025-01-15
tags: ["astro", "web development", "javascript"]
---

# Getting Started with Astro

Content goes here...
```

**3. Query and display:**

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';

const blogPosts = await getCollection('blog');
const sortedPosts = blogPosts.sort((a, b) =>
  b.data.date.getTime() - a.data.date.getTime()
);
---

<h1>Blog Posts</h1>
{sortedPosts.map(post => (
  <article>
    <h2><a href={`/blog/${post.slug}`}>{post.data.title}</a></h2>
    <p>{post.data.description}</p>
    <small>{post.data.date.toLocaleDateString()}</small>
  </article>
))}
```

**4. Create dynamic pages:**

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <p>By {post.data.author} on {post.data.date.toLocaleDateString()}</p>
  <Content />
</article>
```

---

## 🏝️ Islands Architecture

Astro's **Islands Architecture** is revolutionary: only interactive components load JavaScript.

### The Problem with Traditional Frameworks

Traditional SPAs (React, Vue) ship **all JavaScript to the browser**, even for static content.

**Astro's solution**: Ship zero JavaScript by default, hydrate only what needs interactivity.

### Client Directives

Control when components load JavaScript:

```astro
---
import ReactCounter from '../components/ReactCounter.jsx';
---

<!-- Never loads JavaScript (static HTML only) -->
<ReactCounter />

<!-- Load immediately -->
<ReactCounter client:load />

<!-- Load when visible (lazy loading) -->
<ReactCounter client:visible />

<!-- Load when browser is idle -->
<ReactCounter client:idle />

<!-- Load on media query match -->
<ReactCounter client:media="(max-width: 768px)" />

<!-- Only render on client, not server -->
<ReactCounter client:only="react" />
```

### Example: Interactive Component

**React Counter (needs JavaScript):**

```jsx
// src/components/ReactCounter.jsx
import { useState } from 'react';

export default function ReactCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**Use with selective hydration:**

```astro
---
import ReactCounter from '../components/ReactCounter.jsx';
---

<h1>My Page</h1>
<p>This is static content - no JavaScript needed.</p>

<!-- Only this component loads React -->
<ReactCounter client:visible />

<p>More static content below...</p>
```

**Result**: Only the counter loads JavaScript, the rest is pure HTML!

---

## 🔌 Integrations

Astro has official integrations for popular tools:

### Add an Integration

```bash
# React
npx astro add react

# Vue
npx astro add vue

# Svelte
npx astro add svelte

# Tailwind CSS
npx astro add tailwind

# Partytown (third-party scripts)
npx astro add partytown

# Sitemap
npx astro add sitemap
```

### Manual Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
});
```

### Popular Integrations

- **UI Frameworks**: React, Vue, Svelte, Solid, Preact, Lit
- **CSS**: Tailwind, UnoCSS
- **CMS**: Strapi, Contentful, Sanity, WordPress
- **Deployment**: Vercel, Netlify, Cloudflare Pages
- **SEO**: Sitemap, RSS feeds
- **Analytics**: Google Analytics, Plausible, Fathom

---

## 🎨 Styling

### Scoped Styles (Default)

```astro
<button class="primary">Click me</button>

<style>
  /* Only applies to this component */
  .primary {
    background: blue;
    color: white;
  }
</style>
```

### Global Styles

```astro
<style is:global>
  /* Applies everywhere */
  body {
    font-family: system-ui;
  }
</style>
```

### Import External CSS

```astro
---
import '../styles/global.css';
---
```

### Tailwind CSS

```bash
npx astro add tailwind
```

```astro
<button class="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>
```

### CSS Modules

```astro
---
import styles from './styles.module.css';
---

<div class={styles.container}>
  <h1 class={styles.title}>Hello</h1>
</div>
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized site in `./dist/` folder.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Deploy to Netlify

**Option 1: Netlify CLI**

```bash
# Install
npm install netlify-cli -g

# Deploy
netlify deploy --prod
```

**Option 2: Git integration**

1. Push code to GitHub
2. Connect repo in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

### Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages publish dist
```

### Other Platforms

Astro works with any static hosting:
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Railway
- Render

---

## ✅ Best Practices

### 1. Use Content Collections for Markdown

Instead of manually importing files, use Content Collections for type safety and better DX.

### 2. Optimize Images

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero"
  width={1200}
  height={600}
  format="webp"
/>
```

### 3. Minimize Client-Side JavaScript

Only use `client:*` directives when absolutely necessary.

### 4. Use TypeScript

Enable TypeScript for better autocomplete and fewer bugs:

```bash
npm create astro@latest -- --typescript strict
```

### 5. Prefetch Links

```astro
<a href="/about" data-astro-prefetch>About</a>
```

### 6. Environment Variables

Use `.env` files and prefix public variables with `PUBLIC_`.

### 7. Component Organization

```
src/
├── components/
│   ├── ui/           # Buttons, cards, etc.
│   ├── layout/       # Header, footer, etc.
│   └── features/     # Feature-specific components
├── layouts/
└── pages/
```

### 8. Performance Checklist

- ✅ Use Astro's `<Image>` component
- ✅ Lazy load images with `loading="lazy"`
- ✅ Minimize client-side JavaScript
- ✅ Use `client:visible` for below-the-fold components
- ✅ Enable Cloudflare/Vercel edge caching
- ✅ Compress images before adding to project
- ✅ Use WebP/AVIF formats

---

## 🎓 Next Steps

Congratulations! You now have a solid foundation in Astro.js. Here's what to explore next:

### Continue Learning

1. **Build a project**: Start with a blog or portfolio
2. **Explore integrations**: Try React, Vue, or Svelte components
3. **Add a CMS**: Connect to Contentful, Sanity, or Strapi
4. **Optimize SEO**: Add meta tags, structured data, sitemap
5. **Deploy**: Get your site live on Vercel or Netlify

### Resources

- **[Official Astro Docs](https://docs.astro.build/)** - Comprehensive documentation
- **[Astro Discord](https://astro.build/chat)** - Join the community
- **[Astro Themes](https://astro.build/themes/)** - Pre-built templates
- **[Astro Blog](https://astro.build/blog/)** - Latest updates and tutorials
- **[GitHub Examples](https://github.com/withastro/astro/tree/main/examples)** - Official examples

### Build Something Amazing

You now have everything you need to build lightning-fast websites with Astro. The best way to learn is by building!

**Need help building your next project?** [Our web development team](/web-development) specializes in Astro.js and can help you create high-performance websites that convert.

---

**Happy coding! 🚀**
