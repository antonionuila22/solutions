// content.config.ts - Astro 6 content collections with loaders
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Reusable base schema
const searchable = z.object({
    title: z.string(),
    author: z.string().optional(),
    readtime: z.number().optional(),
    description: z.string(),
});

// Blog
const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: searchable.extend({
        date: z.date().optional(),
        img: z.string().optional(),
        imageAlt: z.string().default("image"),
        categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        complexity: z.number().default(1),
        hideToc: z.boolean().default(false),
        draft: z.boolean().default(false),
    }),
});

// Books
const books = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/books" }),
    schema: searchable.extend({
        img: z.string(),
        date: z.string(),
        draft: z.boolean().default(false),
    }),
});

// Country Areas
const countryareas = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/countryareas" }),
    schema: z.object({
        title: z.string(),
        img: z.string().optional(),
        description: z.string(),
        name: z.string(),
        code: z.string(),
        region: z.string().optional(),
        draft: z.boolean().default(false),
    }),
});

// Products
const products = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
    schema: searchable.extend({
        img: z.string(),
        price: z.string(),
        inStock: z.boolean().default(true),
        draft: z.boolean().default(false),
    }),
});

// Projects
const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
    schema: searchable.extend({
        img: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        client: z.string().optional(),
        date: z.date(),
        featured: z.boolean().default(false),
        link: z.string().optional(),
        results: z.object({
            metric1: z.string().optional(),
            metric2: z.string().optional(),
            metric3: z.string().optional(),
        }).optional(),
        draft: z.boolean().default(false),
    }),
});

// FAQ Item schema for locations
const faqItemSchema = z.object({
    question: z.string(),
    answer: z.string(),
});

// Local industry schema
const industrySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
});

// Regions (States, Departments, Provinces)
const regions = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/regions" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        name: z.string(),
        code: z.string(),
        country: z.string(),
        img: z.string().optional(),
        imageAlt: z.string().optional(),
        population: z.string().optional(),
        capital: z.string().optional(),
        timezone: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        longDescription: z.string().optional(),
        industries: z.array(z.object({
            name: z.string(),
            description: z.string().optional(),
        })).optional(),
        marketHighlights: z.array(z.string()).optional(),
        faqs: z.array(faqItemSchema).optional(),
        majorCities: z.array(z.string()).optional(),
        regionalStats: z.object({
            gdp: z.string().optional(),
            techCompanies: z.string().optional(),
            businessGrowth: z.string().optional(),
        }).optional(),
    }),
});

// Locations (City Landing Pages for SEO)
const locations = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/locations" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        city: z.string(),
        state: z.string(),
        stateCode: z.string(),
        country: z.string(),
        region: z.string().optional(),
        img: z.string(),
        imageAlt: z.string(),
        population: z.string().optional(),
        timezone: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        metaTitle: z.string().optional(),
        longDescription: z.string().optional(),
        industries: z.array(industrySchema).optional(),
        marketHighlights: z.array(z.string()).optional(),
        faqs: z.array(faqItemSchema).optional(),
        whyChooseUs: z.array(z.object({
            title: z.string(),
            description: z.string(),
        })).optional(),
        nearbyAreas: z.array(z.string()).optional(),
        localStats: z.object({
            techCompanies: z.string().optional(),
            averageProjectCost: z.string().optional(),
            businessGrowth: z.string().optional(),
        }).optional(),
    }),
});

export const collections = {
    blog,
    books,
    products,
    countryareas,
    regions,
    projects,
    locations,
};
