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
    schema: searchable.extend({
        date: z.date().optional(),
        img: z.string().optional(),
        imageAlt: z.string().default("image"),
        categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        complexity: z.number().default(1),
        hideToc: z.boolean().default(false),
        draft: z.boolean().default(false), // true = not published, false = published
    }),
});

// Books
const books = defineCollection({
    schema: searchable.extend({
        img: z.string(),
        date: z.string(),
        draft: z.boolean().default(false),
    }),
});

// Country Areas
const countryareas = defineCollection({
    schema: z.object({
        title: z.string(),
        img: z.string().optional(),
        description: z.string(),
        name: z.string(),
        code: z.string(), // Ej: "USA", "ARG"
        region: z.string().optional(),
        draft: z.boolean().default(false),
    }),
});

// Products
const products = defineCollection({
    schema: searchable.extend({
        img: z.string(),
        price: z.string(),
        inStock: z.boolean().default(true),
        draft: z.boolean().default(false),
    }),
});

// Projects
const projects = defineCollection({
    schema: searchable.extend({
        img: z.string(),
        category: z.string(), // Web Development, Branding, Social Media, etc.
        tags: z.array(z.string()),
        client: z.string().optional(),
        date: z.date(),
        featured: z.boolean().default(false),
        link: z.string().optional(), // External link to live project
        results: z.object({
            metric1: z.string().optional(),
            metric2: z.string().optional(),
            metric3: z.string().optional(),
        }).optional(),
        draft: z.boolean().default(false),
    }),
});

// Regions (States, Departments, Provinces - intermediate level between country and city)
const regions = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        name: z.string(), // "Florida", "Cortés", "Jalisco"
        code: z.string(), // "FL", "COR", "JAL"
        country: z.string(), // slug of countryarea: "usa", "honduras", "mexico"
        img: z.string().optional(),
        imageAlt: z.string().optional(),
        population: z.string().optional(),
        capital: z.string().optional(), // Capital city of the region
        timezone: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
    }),
});

// Locations (City Landing Pages for SEO)
const locations = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        city: z.string(),
        state: z.string(), // Full name: "Florida", "Cortés"
        stateCode: z.string(), // "FL", "COR", etc.
        country: z.string(), // slug of countryarea: "usa", "honduras"
        region: z.string().optional(), // slug of region (for linking)
        img: z.string(),
        imageAlt: z.string(),
        population: z.string().optional(),
        timezone: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
    }),
});

// Exportá todas las colecciones
export const collections = {
    blog,
    books,
    products,
    countryareas,
    regions,
    projects,
    locations,
};
