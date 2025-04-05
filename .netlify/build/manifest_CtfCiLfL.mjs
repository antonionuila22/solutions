import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_HEADER, k as decodeKey } from './chunks/astro/server_cz3SeSth.mjs';
import 'clsx';
import 'cookie';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/ramonnuila/Documents/GitHub/solutions/","cacheDir":"file:///Users/ramonnuila/Documents/GitHub/solutions/node_modules/.astro/","outDir":"file:///Users/ramonnuila/Documents/GitHub/solutions/dist/","srcDir":"file:///Users/ramonnuila/Documents/GitHub/solutions/src/","publicDir":"file:///Users/ramonnuila/Documents/GitHub/solutions/public/","buildClientDir":"file:///Users/ramonnuila/Documents/GitHub/solutions/dist/","buildServerDir":"file:///Users/ramonnuila/Documents/GitHub/solutions/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contacto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contacto","isIndex":false,"type":"page","pattern":"^\\/contacto\\/?$","segments":[[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contacto.astro","pathname":"/contacto","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"countryareas/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/countryareas","isIndex":true,"type":"page","pattern":"^\\/countryareas\\/?$","segments":[[{"content":"countryareas","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/countryareas/index.astro","pathname":"/countryareas","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"historia-de-codebrand/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/historia-de-codebrand","isIndex":false,"type":"page","pattern":"^\\/historia-de-codebrand\\/?$","segments":[[{"content":"historia-de-codebrand","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/historia-de-codebrand.astro","pathname":"/historia-de-codebrand","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"libros/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/libros","isIndex":true,"type":"page","pattern":"^\\/libros\\/?$","segments":[[{"content":"libros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/libros/index.astro","pathname":"/libros","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"products/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/products","isIndex":true,"type":"page","pattern":"^\\/products\\/?$","segments":[[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/products/index.astro","pathname":"/products","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/animacion/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/animacion","isIndex":false,"type":"page","pattern":"^\\/servicios\\/animacion\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"animacion","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/animacion.astro","pathname":"/servicios/animacion","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/branding/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/branding","isIndex":false,"type":"page","pattern":"^\\/servicios\\/branding\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"branding","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/branding.astro","pathname":"/servicios/branding","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/desarrollo-web/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/desarrollo-web","isIndex":false,"type":"page","pattern":"^\\/servicios\\/desarrollo-web\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"desarrollo-web","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/desarrollo-web.astro","pathname":"/servicios/desarrollo-web","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/edicion-video/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/edicion-video","isIndex":false,"type":"page","pattern":"^\\/servicios\\/edicion-video\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"edicion-video","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/edicion-video.astro","pathname":"/servicios/edicion-video","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/promocionales/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/promocionales","isIndex":false,"type":"page","pattern":"^\\/servicios\\/promocionales\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"promocionales","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/promocionales.astro","pathname":"/servicios/promocionales","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/renderizado/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/renderizado","isIndex":false,"type":"page","pattern":"^\\/servicios\\/renderizado\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"renderizado","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/renderizado.astro","pathname":"/servicios/renderizado","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/seo/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/seo","isIndex":false,"type":"page","pattern":"^\\/servicios\\/seo\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"seo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/seo.astro","pathname":"/servicios/seo","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/social-media/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/social-media","isIndex":false,"type":"page","pattern":"^\\/servicios\\/social-media\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"social-media","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/social-media.astro","pathname":"/servicios/social-media","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/ux-ui/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios/ux-ui","isIndex":false,"type":"page","pattern":"^\\/servicios\\/ux-ui\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}],[{"content":"ux-ui","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/ux-ui.astro","pathname":"/servicios/ux-ui","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"servicios/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/servicios","isIndex":true,"type":"page","pattern":"^\\/servicios\\/?$","segments":[[{"content":"servicios","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/servicios/index.astro","pathname":"/servicios","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"team/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/team","isIndex":false,"type":"page","pattern":"^\\/team\\/?$","segments":[[{"content":"team","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/team.astro","pathname":"/team","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/blog/[id].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/[id]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/countryareas/[id].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/countryareas/[id]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/countryareas/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/countryareas/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/libros/[id].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/libros/[id]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/libros/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/libros/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/products/[id].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/products/[id]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/products/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/products/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/animacion.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/branding.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/edicion-video.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/index.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/promocionales.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/renderizado.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/seo.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/social-media.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/ux-ui.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/contacto.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/historia-de-codebrand.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/servicios/desarrollo-web.astro",{"propagation":"none","containsHead":true}],["/Users/ramonnuila/Documents/GitHub/solutions/src/pages/team.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/blog/[id]@_@astro":"pages/blog/_id_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/contacto@_@astro":"pages/contacto.astro.mjs","\u0000@astro-page:src/pages/countryareas/[id]@_@astro":"pages/countryareas/_id_.astro.mjs","\u0000@astro-page:src/pages/countryareas/index@_@astro":"pages/countryareas.astro.mjs","\u0000@astro-page:src/pages/historia-de-codebrand@_@astro":"pages/historia-de-codebrand.astro.mjs","\u0000@astro-page:src/pages/libros/[id]@_@astro":"pages/libros/_id_.astro.mjs","\u0000@astro-page:src/pages/libros/index@_@astro":"pages/libros.astro.mjs","\u0000@astro-page:src/pages/products/[id]@_@astro":"pages/products/_id_.astro.mjs","\u0000@astro-page:src/pages/products/index@_@astro":"pages/products.astro.mjs","\u0000@astro-page:src/pages/servicios/animacion@_@astro":"pages/servicios/animacion.astro.mjs","\u0000@astro-page:src/pages/servicios/branding@_@astro":"pages/servicios/branding.astro.mjs","\u0000@astro-page:src/pages/servicios/desarrollo-web@_@astro":"pages/servicios/desarrollo-web.astro.mjs","\u0000@astro-page:src/pages/servicios/edicion-video@_@astro":"pages/servicios/edicion-video.astro.mjs","\u0000@astro-page:src/pages/servicios/promocionales@_@astro":"pages/servicios/promocionales.astro.mjs","\u0000@astro-page:src/pages/servicios/renderizado@_@astro":"pages/servicios/renderizado.astro.mjs","\u0000@astro-page:src/pages/servicios/seo@_@astro":"pages/servicios/seo.astro.mjs","\u0000@astro-page:src/pages/servicios/social-media@_@astro":"pages/servicios/social-media.astro.mjs","\u0000@astro-page:src/pages/servicios/ux-ui@_@astro":"pages/servicios/ux-ui.astro.mjs","\u0000@astro-page:src/pages/servicios/index@_@astro":"pages/servicios.astro.mjs","\u0000@astro-page:src/pages/team@_@astro":"pages/team.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CtfCiLfL.mjs","/Users/ramonnuila/Documents/GitHub/solutions/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/Users/ramonnuila/Documents/GitHub/solutions/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_Qdv0KyW7.mjs","/Users/ramonnuila/Documents/GitHub/solutions/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CCGmsgrq.mjs","/Users/ramonnuila/Documents/GitHub/solutions/src/components/TabComp.tsx":"_astro/TabComp.B3uHnsGV.js","/Users/ramonnuila/Documents/GitHub/solutions/src/components/reactBanner.tsx":"_astro/reactBanner.IpvQ4a1K.js","/Users/ramonnuila/Documents/GitHub/solutions/src/components/SplitText.tsx":"_astro/SplitText.8BfMdbiF.js","/Users/ramonnuila/Documents/GitHub/solutions/src/components/slider":"_astro/slider.RtwEIpnc.js","/Users/ramonnuila/Documents/GitHub/solutions/src/components/Faqcomp.tsx":"_astro/Faqcomp.BbLG3SKO.js","@astrojs/react/client.js":"_astro/client.DcP5Hluu.js","/Users/ramonnuila/Documents/GitHub/solutions/src/layouts/LayoutServices.astro?astro&type=script&index=0&lang.ts":"_astro/LayoutServices.astro_astro_type_script_index_0_lang.BpM49Wbh.js","/Users/ramonnuila/Documents/GitHub/solutions/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.BpM49Wbh.js","/Users/ramonnuila/Documents/GitHub/solutions/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CMTcOisY.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/codebrand.DJrXKWHG.svg","/_astro/_id_.1XQnJZGi.css","/iconcodebrand.svg","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CMTcOisY.js","/_astro/Faqcomp.BbLG3SKO.js","/_astro/Layout.astro_astro_type_script_index_0_lang.BpM49Wbh.js","/_astro/LayoutServices.astro_astro_type_script_index_0_lang.BpM49Wbh.js","/_astro/SplitText.8BfMdbiF.js","/_astro/TabComp.B3uHnsGV.js","/_astro/client.DcP5Hluu.js","/_astro/index.BoiOKwrL.js","/_astro/index.Brfk6Bdo.js","/_astro/index.DK-fsZOb.js","/_astro/jsx-runtime.ClP7wGfN.js","/_astro/reactBanner.IpvQ4a1K.js","/_astro/slider.RtwEIpnc.js","/icons/animacion.png","/icons/camiseta.png","/icons/collaboration-svgrepo-com.svg","/icons/cpu-processor-hardware-chip-microchip-svgrepo-com.svg","/icons/creativity-svgrepo-com.svg","/icons/diseno-grafico.png","/icons/edicion-de-video.png","/icons/interfaz-de-usuario.png","/icons/modelo-3d.png","/icons/redes-sociales.png","/icons/seo.png","/icons/sitio-web.png","/icons/support-svgrepo-com.svg","/photos/Branding.png","/photos/Ramon-actual.webp","/photos/animation.png","/photos/bannercodebrand.webp","/photos/diseñoweb.png","/photos/guiaseo.webp","/photos/guiatailwindcss.webp","/photos/hero.webp","/photos/learnastro.webp","/photos/section.webp","/photos/teamcode.png","/blog/index.html","/contacto/index.html","/countryareas/index.html","/historia-de-codebrand/index.html","/libros/index.html","/products/index.html","/servicios/animacion/index.html","/servicios/branding/index.html","/servicios/desarrollo-web/index.html","/servicios/edicion-video/index.html","/servicios/promocionales/index.html","/servicios/renderizado/index.html","/servicios/seo/index.html","/servicios/social-media/index.html","/servicios/ux-ui/index.html","/servicios/index.html","/team/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"2+hP6PFBSQO0aGDoEQVjIX67fTA1Dn0g1jZ84FcG0pg="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
