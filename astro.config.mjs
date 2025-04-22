// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  output: 'server',
  site: 'https://codebrand.netlify.app/',
  //integracion Vercel

  integrations: [react()],
  adapter: netlify({
    edgeMiddleware: true,
  })
});