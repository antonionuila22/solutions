// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';


import netlify from '@astrojs/netlify';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  output: 'server',

  site: 'https://solutions.codebrand.es/',
  //integracion Vercel

  integrations: [react(), sitemap()],
  adapter: netlify({
    edgeMiddleware: true,
  })
});