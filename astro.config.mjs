// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'terser',
      cssMinify: true,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // Optimize chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate React into its own chunk for better caching
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  },

  // Image optimization (native Astro 5 support)
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },

  // Astro 5 prefetch for faster navigation
  prefetch: {
    prefetchAll: false, // Only prefetch on hover/focus for landing pages
    defaultStrategy: 'hover',
  },

  output: 'server',

  site: 'https://codebrand.us',

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/thank-you') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize: (item) => {
        // High priority for main pages
        if (item.url === 'https://codebrand.us/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
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
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }
        // Location pages (cities)
        if (item.url.includes('/locations/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        // Region pages (states/departments)
        if (item.url.includes('/regions/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        // Blog posts
        if (item.url.includes('/blog/')) {
          return { ...item, priority: 0.7, changefreq: 'weekly' };
        }
        // Projects
        if (item.url.includes('/projects/')) {
          return { ...item, priority: 0.6, changefreq: 'monthly' };
        }
        return item;
      },
    }),
    mdx()
  ],

  adapter: netlify({
    edgeMiddleware: false,
  })
});
