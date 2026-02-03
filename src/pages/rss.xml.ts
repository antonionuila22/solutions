import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog', ({ data }) => !data.draft);

  // Sort by date, newest first
  const sortedPosts = blog.sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  return rss({
    title: 'Codebrand Blog | Web Development, SEO & Digital Marketing Insights',
    description: 'Expert insights on web development, SEO, digital marketing, branding, and software development. Learn from industry professionals at Codebrand.',
    site: context.site ?? 'https://codebrand.us',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date ? new Date(post.data.date) : new Date(),
      description: post.data.description,
      link: `/blog/${post.id}/`,
      author: post.data.author ?? 'Codebrand Team',
      categories: post.data.categories ?? [],
      customData: post.data.img ? `<media:content url="https://codebrand.us${post.data.img}" medium="image" />` : '',
    })),
    customData: `
      <language>en-us</language>
      <copyright>Copyright ${new Date().getFullYear()} Codebrand. All rights reserved.</copyright>
      <managingEditor>info@codebrand.es (Codebrand Team)</managingEditor>
      <webMaster>info@codebrand.es (Codebrand Team)</webMaster>
      <ttl>60</ttl>
      <image>
        <url>https://codebrand.us/favicon.svg</url>
        <title>Codebrand Blog</title>
        <link>https://codebrand.us/blog</link>
      </image>
    `,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
}
