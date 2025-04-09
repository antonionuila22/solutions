import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_C7moF4V_.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/blog/_id_.astro.mjs');
const _page1 = () => import('./pages/blog.astro.mjs');
const _page2 = () => import('./pages/contacto.astro.mjs');
const _page3 = () => import('./pages/countryareas/_id_.astro.mjs');
const _page4 = () => import('./pages/countryareas.astro.mjs');
const _page5 = () => import('./pages/historia-de-codebrand.astro.mjs');
const _page6 = () => import('./pages/libros/_id_.astro.mjs');
const _page7 = () => import('./pages/libros.astro.mjs');
const _page8 = () => import('./pages/products/_id_.astro.mjs');
const _page9 = () => import('./pages/products.astro.mjs');
const _page10 = () => import('./pages/servicios/animacion.astro.mjs');
const _page11 = () => import('./pages/servicios/branding.astro.mjs');
const _page12 = () => import('./pages/servicios/desarrollo-web.astro.mjs');
const _page13 = () => import('./pages/servicios/edicion-video.astro.mjs');
const _page14 = () => import('./pages/servicios/promocionales.astro.mjs');
const _page15 = () => import('./pages/servicios/renderizado.astro.mjs');
const _page16 = () => import('./pages/servicios/seo.astro.mjs');
const _page17 = () => import('./pages/servicios/social-media.astro.mjs');
const _page18 = () => import('./pages/servicios/ux-ui.astro.mjs');
const _page19 = () => import('./pages/servicios.astro.mjs');
const _page20 = () => import('./pages/team.astro.mjs');
const _page21 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["src/pages/blog/[id].astro", _page0],
    ["src/pages/blog/index.astro", _page1],
    ["src/pages/contacto.astro", _page2],
    ["src/pages/countryareas/[id].astro", _page3],
    ["src/pages/countryareas/index.astro", _page4],
    ["src/pages/historia-de-codebrand.astro", _page5],
    ["src/pages/libros/[id].astro", _page6],
    ["src/pages/libros/index.astro", _page7],
    ["src/pages/products/[id].astro", _page8],
    ["src/pages/products/index.astro", _page9],
    ["src/pages/servicios/animacion.astro", _page10],
    ["src/pages/servicios/branding.astro", _page11],
    ["src/pages/servicios/desarrollo-web.astro", _page12],
    ["src/pages/servicios/edicion-video.astro", _page13],
    ["src/pages/servicios/promocionales.astro", _page14],
    ["src/pages/servicios/renderizado.astro", _page15],
    ["src/pages/servicios/seo.astro", _page16],
    ["src/pages/servicios/social-media.astro", _page17],
    ["src/pages/servicios/ux-ui.astro", _page18],
    ["src/pages/servicios/index.astro", _page19],
    ["src/pages/team.astro", _page20],
    ["src/pages/index.astro", _page21]
]);
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: undefined
});
const _args = {
    "middlewareSecret": "6ddc3cce-0030-43d3-9e8c-df85d0c8f4c2"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
