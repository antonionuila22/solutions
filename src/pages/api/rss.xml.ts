import rss from '@astrojs/rss';
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ params, request, site }) => {
    return rss({
        // `<title>` field in output xml
        title: 'Buzz’s Blog',
        // `<description>` field in output xml
        description: 'A humble Astronaut’s guide to the stars',
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#site
        site: site ?? '',
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: [],
        // (optional) inject custom xml
        customData: `<language>es-ES</language>`,
    });
};