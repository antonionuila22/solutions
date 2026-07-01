// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

import { isLongtailGeoUrl } from './src/lib/seo/geo-tiers';

// Legacy/duplicate pages whose <link rel="canonical"> points to a DIFFERENT URL
// (via canonicalOverride). They must NOT be advertised in the sitemap — we only
// list canonical, indexable URLs. Compared by exact pathname (slash-insensitive).
const NON_CANONICAL_DUPLICATES = new Set([
  '/web-development',                  // → /services/web-development
  '/web-development-agency',           // → /services/web-development
  '/custom-web-development-services',  // → /services/web-development
  '/seo',                              // → /services/seo
  '/branding',                         // → /services/branding
  '/web-design',                       // → /ux-ui-design-agency
  '/ecommerce-development-agency',     // → /e-commerce
]);
const isNonCanonicalDuplicate = (page) => {
  try {
    const path = new URL(page).pathname.replace(/\/+$/, '') || '/';
    return NON_CANONICAL_DUPLICATES.has(path);
  } catch {
    return false;
  }
};

// https://astro.build/config
export default defineConfig({
  // Dev Toolbar configuration (Astro 5.17+)
  // Persists across team members and environments
  devToolbar: {
    placement: 'bottom-left',
  },

  // Inline small stylesheets to reduce render-blocking CSS
  // 'auto' inlines CSS under 4kb, larger files are still external but preloaded
  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()],
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        // Generate rgb() fallbacks for oklch() — required for iOS < 15.4
        targets: {
          safari: (14 << 16) | (0 << 8),
          ios_saf: (14 << 16) | (0 << 8),
        },
      },
    },
    build: {
      minify: 'terser',
      cssMinify: 'lightningcss',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // Astro 6 handles chunk splitting automatically
    },
  },

  // Image optimization (native Astro 5 support)
  // kernel: 'lanczos3' provides best quality for image resizing (Astro 5.17+)
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
        kernel: 'lanczos3',
      },
    },
  },

  // Astro 5 prefetch for faster navigation
  prefetch: {
    prefetchAll: false, // Only prefetch on hover/focus for landing pages
    defaultStrategy: 'hover',
  },

  output: 'server',

  site: 'https://www.codebrand.us',

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/thank-you') && !page.includes('/404') && !page.includes('/landing/') && !page.includes('/blog/category/') && !isNonCanonicalDuplicate(page) && !isLongtailGeoUrl(page),
      changefreq: 'weekly',
      priority: 0.7,
      serialize: (item) => {
        const lastmod = new Date().toISOString();
        // High priority for main pages
        if (item.url === 'https://www.codebrand.us/') {
          return { ...item, lastmod, priority: 1.0, changefreq: 'daily' };
        }
        // Service pages
        if (
          item.url.includes('/web-development') ||
          item.url.includes('/branding') ||
          item.url.includes('/e-commerce') ||
          item.url.includes('/seo') ||
          item.url.includes('/digital-marketing') ||
          item.url.includes('/web-design') ||
          item.url.includes('/landing-pages') ||
          item.url.includes('/copywriting')
        ) {
          return { ...item, lastmod, priority: 0.9, changefreq: 'weekly' };
        }
        // Location pages (cities)
        if (item.url.includes('/locations/')) {
          return { ...item, lastmod, priority: 0.8, changefreq: 'monthly' };
        }
        // Region pages (states/departments)
        if (item.url.includes('/regions/')) {
          return { ...item, lastmod, priority: 0.8, changefreq: 'monthly' };
        }
        // Blog posts
        if (item.url.includes('/blog/')) {
          return { ...item, lastmod, priority: 0.7, changefreq: 'weekly' };
        }
        // Projects
        if (item.url.includes('/projects/')) {
          return { ...item, lastmod, priority: 0.6, changefreq: 'monthly' };
        }
        return { ...item, lastmod };
      },
    }),
    mdx()
  ],

  adapter: netlify({
    edgeMiddleware: false,
  })
});
