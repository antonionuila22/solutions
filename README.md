# Codebrand Solutions

Sitio web corporativo y plataforma de servicios digitales de **Codebrand**, desarrollado con Astro 7 y desplegado en Netlify.

**URL de produccion:** [codebrand.us](https://codebrand.us)

---

## Stack Tecnologico

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Astro 7 (SSR) |
| UI Components | React 19 |
| Styling | TailwindCSS 4 (plugin de Vite + lightningcss) |
| Animations | GSAP + Lenis (scroll suave) |
| Database | Turso (LibSQL) |
| Email | Resend |
| Deployment | Netlify (Edge Functions) |
| Image Optimization | Sharp |

---

## Estructura del Proyecto

```
src/
├── assets/          # Logos y assets estaticos
├── components/      # Componentes Astro y React
│   ├── magicui/     # Componentes de animacion
│   ├── service-sections/  # Secciones reutilizables para paginas de servicios
│   └── ui/          # Componentes base (Button, Card, Badge)
├── configs/         # Configuraciones de servicios
│   └── services/    # Configs individuales por servicio
├── content/         # Contenido Markdown/MDX
│   ├── blog/        # Articulos del blog
│   ├── countryareas/  # Paginas por pais
│   ├── products/    # Descripciones de servicios
│   └── projects/    # Casos de estudio
├── data/            # Datos estaticos JSON
├── layouts/         # Layouts de pagina
├── lib/             # Utilidades y helpers
├── pages/           # Rutas del sitio
├── styles/          # Estilos globales
└── utils/           # Funciones utilitarias
```

---

## Requisitos

- Node.js 22.12 o superior (Netlify compila con Node 22)
- pnpm 11 (gestor declarado en `packageManager`) o npm

> El archivo `.npmrc` fija `legacy-peer-deps=true`, por lo que la instalacion
> funciona tanto con `pnpm install` como con `npm install --legacy-peer-deps`.

---

## Instalacion Local

```bash
# Clonar el repositorio
git clone [repo-url]

# Instalar dependencias (elige uno)
pnpm install
# o bien
npm install --legacy-peer-deps

# Copiar variables de entorno (parte de .env.example incluido en el repo)
cp .env.example .env
```

### Variables de Entorno Requeridas

```env
TURSO_DATABASE_URL=       # URL de la base de datos Turso
TURSO_AUTH_TOKEN=         # Token de autenticacion Turso
RESEND_API_KEY=           # API key de Resend para emails
RESEND_FROM_EMAIL=        # Remitente de los correos enviados con Resend
CONTACT_RECIPIENT_EMAIL=  # Destinatario de los formularios de contacto
```

---

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera build de produccion |
| `npm run preview` | Previsualiza build de produccion localmente |
| `npm run optimize-images` | Optimiza imagenes del proyecto |

---

## Deployment

El sitio se despliega automaticamente en **Netlify** con cada push a la rama `master`.

### Configuracion de Netlify

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `.netlify/functions-internal`
- **Edge Functions:** Habilitadas

La configuracion completa esta en `netlify.toml`.

---

## Caracteristicas del Sitio

- **SSR (Server-Side Rendering)** para mejor SEO y rendimiento
- **Sitemap automatico** con prioridades por tipo de pagina
- **Blog con MDX** para contenido rico
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
| **Web** | [codebrand.us](https://codebrand.us) |
| **Email** | info@codebrand.es |
| **Telefono** | +504 3272-2973 |

---

## Licencia

Este proyecto es propiedad de **Codebrand** y no esta disponible para uso publico o distribucion.

Copyright 2025 Codebrand. Todos los derechos reservados.
