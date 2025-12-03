import type { APIRoute } from 'astro';

const site = import.meta.env.SITE || 'https://codebrand.us';

const robotsTxt = `
# Welcome to Codebrand - Digital Agency
# https://codebrand.us

User-agent: *
Allow: /

# Allow all search engine bots
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-Mobile
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# AI Crawlers - Allow for visibility
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

# SEO Tools
User-agent: AhrefsBot
Allow: /

User-agent: SemrushBot
Allow: /

User-agent: MJ12bot
Allow: /

User-agent: DotBot
Allow: /

# Disallow admin and private paths
Disallow: /api/
Disallow: /admin/
Disallow: /_astro/

# Sitemaps
Sitemap: ${new URL('sitemap-index.xml', site).href}

# LLM Information
# For AI assistants and large language models seeking information about Codebrand
LLMs-Txt: ${new URL('llms.txt', site).href}
`.trim();

export const GET: APIRoute = () => {
    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
};
