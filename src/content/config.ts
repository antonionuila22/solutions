// content/config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Esquema base reutilizable
const searchable = z.object({
    title: z.string(),
    author: z.string().optional(),
    readtime: z.number().optional(),
    description: z.string(),
});

// Blog
const blog = defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
    schema: ({ image }) =>
        searchable.extend({
            date: z.date().optional(),
            image: image().optional(),
            img: z.string().optional(),
            imageAlt: z.string().default("image"),
            categories: z.array(z.string()).optional(),
            tags: z.array(z.string()).optional(),
            complexity: z.number().default(1),
            hideToc: z.boolean().default(false),
        }),
});

// Books
const books = defineCollection({
    schema: searchable.extend({
        img: z.string(),
    }),
});

// Country Areas
/*const countryAreas = defineCollection({
    schema: z.object({
        name: z.string(),
        code: z.string().max(3), // Ej: "USA", "ARG"
        region: z.string().optional(),
        description: z.string().optional(),
    }),
});

// Products
const products = defineCollection({
    schema: searchable.extend({
        price: z.number(),
        inStock: z.boolean().default(true),
        tags: z.array(z.string()).optional(),
    }),
});
*/
// Exportá todas las colecciones
export const collections = {
    blog,
    books,

};
