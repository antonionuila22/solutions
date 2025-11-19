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
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split GSAP into separate chunk
            if (id.includes('gsap')) {
              return 'gsap';
            }
            // Split React components into separate chunk
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // Split other large dependencies
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    ssr: {
      noExternal: ['gsap'],
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

  // Performance optimizations
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },

  output: 'server',

  site: 'https://codebrand.us',

  integrations: [
    react({
      experimentalReactChildren: true,
    }),
    sitemap(),
    mdx()
  ],

  adapter: netlify({
    edgeMiddleware: true,
  })
});