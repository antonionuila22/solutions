// content/config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const searchable = z.object({
    title: z.string(),
    author: z.string(),
    img: z.string(),
    readtime: z.number(),
    description: z.string(),
});

const books = defineCollection({
    schema: z.object({
        title: z.string(),
        author: z.string(),
        img: z.string(),
        readtime: z.number(),
        description: z.string(),
    }),
});



const blog = defineCollection({
    loader: glob({ pattern: "**\/[^_]*.{md,mdx}", base: "./src/content/blog" }),
    schema: ({ image }) =>
        searchable.extend({
            date: z.date().optional(),
            image: image().optional(),
            imageAlt: z.string().default("image"),
            categories: z.array(z.string()).optional(),
            tags: z.array(z.string()).optional(),
            complexity: z.number().default(1),
            hideToc: z.boolean().default(false),
        }),
});

export const collections = { books, blog };
