# Codebrand Solutions

Sitio web corporativo y plataforma de servicios digitales de **Codebrand**, desarrollado con Astro 7 y desplegado en Netlify.

**URL de produccion:** [www.codebrand.us](https://www.codebrand.us/)

---

## Stack Tecnologico

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Astro 7 (SSR) |
| UI Components | React 19 |
| Styling | TailwindCSS 4 (plugin de Vite + lightningcss) |
| Animations | GSAP + Lenis (scroll suave) |
| Database | Turso (LibSQL) y Supabase (solo la herramienta `/brief/`) |
| Email | Resend |
| Deployment | Netlify (funciones serverless, Edge Functions desactivadas) |
| Image Optimization | Sharp |

---

## Estructura del Proyecto

```
src/
├── actions/         # Astro Actions (unica via de escritura del /brief/)
├── assets/          # Logos y assets estaticos
├── components/      # Componentes Astro y React
│   ├── magicui/     # Componentes de animacion
│   ├── service-sections/  # Secciones reutilizables para paginas de servicios
│   └── ui/          # Componentes base (Button, Card, Badge)
├── configs/         # Configuraciones de servicios
│   └── services/    # Configs individuales por servicio
├── content/         # Contenido Markdown (.md, sin .mdx)
│   ├── blog/        # Articulos del blog
│   ├── books/       # Guias largas
│   ├── countryareas/  # Paginas por pais
│   ├── locations/   # Paginas de ciudad (SEO local)
│   ├── products/    # Descripciones de servicios
│   ├── projects/    # Casos de estudio
│   └── regions/     # Paginas de estado, departamento o provincia
├── data/            # Datos estaticos en TypeScript (testimonials.ts)
├── features/        # Features aisladas (brief/)
├── layouts/         # Layouts de pagina
├── lib/             # Utilidades y helpers (incluye lib/seo/)
├── pages/           # Rutas del sitio
├── styles/          # Estilos globales
└── utils/           # Funciones utilitarias
```

---

## Requisitos

- Node.js 22.12 o superior (Netlify compila con Node 22)
- pnpm 11.9, obligatorio: es el gestor declarado en `packageManager` y el unico
  lockfile del repo es `pnpm-lock.yaml`

> No instales con npm. Sin `package-lock.json`, `npm install` resuelve un arbol
> distinto al que se despliega y `npm audit` falla. Para auditar dependencias:
> `pnpm audit`. El archivo `.npmrc` esta vacio a proposito y no fija
> `legacy-peer-deps`.

---

## Instalacion Local

```bash
# Clonar el repositorio
git clone [repo-url]

# Instalar dependencias
pnpm install

# Crear el archivo de variables de entorno (el repo no incluye .env.example)
touch .env
```

### Variables de Entorno Requeridas

```env
TURSO_DATABASE_URL=       # URL de la base de datos Turso
TURSO_AUTH_TOKEN=         # Token de autenticacion Turso
RESEND_API_KEY=           # API key de Resend para emails
RESEND_FROM_EMAIL=        # Remitente de los correos enviados con Resend
CONTACT_RECIPIENT_EMAIL=  # Destinatario de los formularios de contacto
BRIEF_SUPABASE_URL=              # Supabase de la herramienta /brief/
BRIEF_SUPABASE_SERVICE_ROLE_KEY= # Service role de Supabase (solo servidor)
```

---

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Genera build de produccion. Es el paso de verificacion: no hay tests, linter ni type check |
| `pnpm preview` | Previsualiza build de produccion localmente |
| `pnpm optimize-images` | Optimiza imagenes del proyecto |
| `pnpm audit` | Audita dependencias (`npm audit` falla porque no hay `package-lock.json`) |

---

## Deployment

El sitio se despliega automaticamente en **Netlify** con cada push a la rama `master`.

### Configuracion de Netlify

- **Build command:** `npm run build` (valor actual en `netlify.toml`)
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`
- **Edge Functions:** desactivadas (`netlify({ edgeMiddleware: false })` en `astro.config.mjs`)

La configuracion completa esta en `netlify.toml`.

---

## Caracteristicas del Sitio

- **SSR + prerender**: el proyecto corre con `output: 'server'`, pero la mayoria de las paginas declaran `export const prerender = true` y se generan durante el build
- **Sitemap automatico** con prioridades por tipo de pagina
- **Blog en Markdown** con colecciones de contenido validadas con Zod
- **Formularios de contacto** integrados con Resend
- **Base de datos Turso** para almacenamiento de leads
- **Paginas de servicios modulares** con configuracion centralizada
- **Soporte multi-region** (USA, Latinoamerica, Espana)
- **Optimizacion de imagenes** con Sharp

---

## Servicios Ofrecidos

El sitio presenta los siguientes servicios de Codebrand:

- Web Development
- E-commerce
- Branding & Identidad Visual
- UX/UI Design
- SEO
- Animacion 2D/3D
- Renders 3D
- Video Production
- Social Media Design
- Productos Promocionales

---

## Documentacion Adicional

- **[CHANGELOG.md](./CHANGELOG.md)** - Historial de cambios

---

## Contacto

| | |
|--|--|
| **Web** | [www.codebrand.us](https://www.codebrand.us/) |
| **Email** | info@codebrand.es |
| **Telefono** | +504 8738-0714 |

---

## Licencia

Este proyecto es propiedad de **Codebrand** y no esta disponible para uso publico o distribucion.

Copyright 2025 Codebrand. Todos los derechos reservados.
