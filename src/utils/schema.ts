/**
 * Schema.org structured data utilities for SEO
 * Generates standardized Schema.org markup for services
 */

import { BUSINESS_INFO } from "../configs/business";

interface ServiceOffer {
  name: string;
  description: string;
}

interface SchemaOfferCatalog {
  name: string;
  itemListElement: Array<{
    "@type": string;
    itemOffered: {
      "@type": string;
      name: string;
      description: string;
    };
  }>;
}

/**
 * Organization data - single source of truth
 * Note: Uses banner image as logo for existing createServiceSchema callers
 */
const ORGANIZATION_DATA = {
  "@type": "Organization",
  name: "Codebrand",
  url: "https://www.codebrand.us",
  logo: "https://www.codebrand.us/photos/bannercodebrand.webp",
} as const;

/**
 * Default offer structure for all services
 */
// No price on purpose: Codebrand publishes no prices. Every engagement is a
// fixed-price proposal built from the client's budget.
const DEFAULT_OFFER = {
  "@type": "Offer",
  availability: "https://schema.org/InStock",
} as const;

/**
 * Configuration for creating a service page schema
 */
export interface ServicePageSchemaConfig {
  /** The type of service (e.g., "Branding Services") */
  serviceType: string;
  /** Display name of the service (e.g., "Professional Branding & Logo Design Services") */
  name: string;
  /** Service description for SEO */
  description: string;
  /** Full URL of the service page (e.g., "https://www.codebrand.us/branding/") */
  url: string;
  /** Full URL of the service image */
  image: string;
  /** Name for the offer catalog */
  catalogName: string;
  /** Array of service offerings in the catalog */
  catalogItems: ServiceOffer[];
  /** Area served; defaults to the United States. Honduras pages pass Honduras. */
  areaServed?: { "@type": string; name: string } | { "@type": string; name: string }[];
}

/**
 * Creates a standardized Schema.org Service markup for service pages
 * Matches the exact structure used across all service pages with
 * provider, areaServed, hasOfferCatalog, and priceRange
 *
 * @param config - Service page schema configuration
 * @returns Complete Schema.org object ready for JSON-LD
 *
 * @example
 * const schema = createServicePageSchema({
 *   serviceType: "Branding Services",
 *   name: "Professional Branding & Logo Design Services",
 *   description: "Build a powerful brand...",
 *   url: "https://www.codebrand.us/branding/",
 *   image: "https://www.codebrand.us/photos/Branding.webp",
 *   catalogName: "Branding Services",
 *   catalogItems: [
 *     { name: "Logo Design", description: "Custom logo design..." },
 *   ],
 * });
 */
export function createServicePageSchema(config: ServicePageSchemaConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: config.serviceType,
    name: config.name,
    description: config.description,
    url: config.url,
    image: config.image,
    provider: {
      "@type": "Organization",
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.baseUrl,
      logo: BUSINESS_INFO.logoUrl,
    },
    areaServed: config.areaServed ?? {
      "@type": "Country",
      name: "United States",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: config.catalogName,
      itemListElement: config.catalogItems.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.description,
        },
      })),
    },
    priceRange: BUSINESS_INFO.priceRange,
  };
}

/**
 * Creates a standardized Schema.org Service markup
 *
 * @param serviceType - The type of service (e.g., "UX/UI Design Services")
 * @param description - Service description for SEO
 * @param catalogName - Optional name for the offer catalog
 * @param catalogItems - Optional array of service offerings
 * @returns Complete Schema.org object ready for JSON-LD
 *
 * @example
 * const schema = createServiceSchema(
 *   "UX/UI Design Services",
 *   "Professional UX/UI design services...",
 *   "UX/UI Design Services",
 *   [
 *     { name: "User Research", description: "..." },
 *     { name: "Wireframing", description: "..." }
 *   ]
 * );
 */
export function createServiceSchema(
  serviceType: string,
  description: string,
  catalogName?: string,
  catalogItems?: ServiceOffer[]
) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType,
    provider: ORGANIZATION_DATA,
    areaServed: "Worldwide",
    description,
    offers: DEFAULT_OFFER,
  };

  // Add offer catalog if items are provided
  if (catalogName && catalogItems && catalogItems.length > 0) {
    const catalog: SchemaOfferCatalog = {
      name: catalogName,
      itemListElement: catalogItems.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.description,
        },
      })),
    };

    return {
      ...baseSchema,
      hasOfferCatalog: catalog,
    };
  }

  return baseSchema;
}

/**
 * Common service catalog items for reuse
 */
export const commonCatalogItems = {
  uxui: [
    {
      name: "User Research & Analysis",
      description: "In-depth user research through interviews, surveys, and analytics",
    },
    {
      name: "Wireframing & Prototyping",
      description: "Interactive prototypes and wireframes for testing and validation",
    },
    {
      name: "UI Design & Visual Design",
      description: "Beautiful, on-brand interface design with attention to detail",
    },
  ],
  branding: [
    {
      name: "Brand Strategy",
      description: "Strategic brand positioning and market analysis",
    },
    {
      name: "Logo Design",
      description: "Professional logo design and brand identity creation",
    },
    {
      name: "Brand Guidelines",
      description: "Comprehensive brand style guides and documentation",
    },
  ],
  seo: [
    {
      name: "Technical SEO",
      description: "Website optimization for search engine performance",
    },
    {
      name: "Content Optimization",
      description: "Keyword research and content strategy",
    },
    {
      name: "Link Building",
      description: "Authority building through quality backlinks",
    },
  ],
  socialMedia: [
    {
      name: "Content Strategy",
      description: "Strategic social media content planning and creation",
    },
    {
      name: "Community Management",
      description: "Engagement and community building on social platforms",
    },
    {
      name: "Social Media Advertising",
      description: "Paid advertising campaigns on Facebook, Instagram, LinkedIn",
    },
  ],
};

interface SchemaBase {
  "@context"?: string;
  "@type"?: string;
  serviceType?: string;
  [key: string]: unknown;
}

/**
 * Validates a Schema.org object structure
 *
 * @param schema - Schema object to validate
 * @returns true if valid, throws error if invalid
 */
export function validateSchema(schema: SchemaBase): boolean {
  if (!schema["@context"]) {
    throw new Error("Schema must have @context");
  }
  if (!schema["@type"]) {
    throw new Error("Schema must have @type");
  }
  if (schema["@type"] === "Service" && !schema.serviceType) {
    throw new Error("Service schema must have serviceType");
  }
  return true;
}

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Creates BreadcrumbList schema from path segments
 *
 * @param items - Array of breadcrumb items with name and url
 * @returns Complete BreadcrumbList Schema.org object
 *
 * @example
 * const breadcrumbs = createBreadcrumbSchema([
 *   { name: "Home", url: "https://www.codebrand.us" },
 *   { name: "Services", url: "https://www.codebrand.us/services/" },
 *   { name: "Web Development", url: "https://www.codebrand.us/services/web-development/" }
 * ]);
 */
/** Every breadcrumb URL must be the canonical form: absolute, https, trailing slash. */
const canonicalCrumbUrl = (url: string): string => {
  const abs = url.startsWith("http") ? url : `https://www.codebrand.us${url.startsWith("/") ? url : `/${url}`}`;
  return /\.[a-z0-9]{2,5}$/i.test(abs) || abs.endsWith("/") ? abs : `${abs}/`;
};

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalCrumbUrl(item.url),
    })),
  };
}

/** Human names for the hub segments of the site, used when a page does not pass its own trail. */
const HUB_SEGMENT_NAMES: Record<string, string> = {
  hn: "Honduras", countryareas: "Service Areas", locations: "Locations", regions: "Regions",
  services: "Services", industries: "Industries", blog: "Blog", products: "Services Catalog",
  projects: "Projects", team: "Team", books: "Books", quoter: "Request a Proposal",
  careers: "Careers", contact: "Contact", history: "History",
};
/** URL segments that are not pages of their own and must not appear as crumbs. */
const SKIPPED_SEGMENTS = new Set(["category"]);

/**
 * Automatically generates breadcrumbs from a URL path
 *
 * @param currentUrl - The current page URL
 * @param baseUrl - The site base URL (default: https://www.codebrand.us)
 * @param customNames - Optional object mapping path segments to display names
 * @returns Complete BreadcrumbList Schema.org object
 *
 * @example
 * const breadcrumbs = createBreadcrumbSchemaFromUrl(
 *   "https://www.codebrand.us/services/web-development/",
 *   "https://www.codebrand.us",
 *   { "web-development": "Web Development", "services": "Services" }
 * );
 */
export function createBreadcrumbSchemaFromUrl(
  currentUrl: string,
  baseUrl: string = "https://www.codebrand.us",
  customNames?: Record<string, string>,
  homeName: string = "Home"
) {
  const url = new URL(currentUrl);
  const pathSegments = url.pathname.split("/").filter(Boolean);

  // Las URLs llevan barra final para que coincidan con la canónica de cada
  // página. Sin ella, cada breadcrumb apunta a una URL que responde 301.
  const items: BreadcrumbItem[] = [
    { name: homeName, url: `${baseUrl}/` },
  ];

  let accumulatedPath = "";

  for (const segment of pathSegments) {
    accumulatedPath += `/${segment}`;
    if (SKIPPED_SEGMENTS.has(segment)) continue;
    const displayName = customNames?.[segment] || HUB_SEGMENT_NAMES[segment] ||
      segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    items.push({
      name: displayName,
      url: `${baseUrl}${accumulatedPath}/`,
    });
  }

  return createBreadcrumbSchema(items);
}

/**
 * FAQ item interface
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Creates FAQPage schema for FAQ sections
 * Helps achieve rich snippets in Google search results
 *
 * @param faqs - Array of FAQ items with question and answer
 * @returns Complete FAQPage Schema.org object
 *
 * @example
 * const faqSchema = createFAQSchema([
 *   {
 *     question: "How much does web development cost?",
 *     answer: "Our web development services start at $2,500..."
 *   },
 *   {
 *     question: "How long does it take to build a website?",
 *     answer: "Typically 4-8 weeks depending on complexity..."
 *   }
 * ]);
 */
export function createFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Article schema interface
 */
export interface ArticleSchemaOptions {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  authorUrl?: string;
  url: string;
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
  readingTime?: number;
  /** BCP-47 language of the article body; defaults to en-US. */
  inLanguage?: string;
}

/**
 * Creates enhanced Article/BlogPosting schema
 *
 * @param options - Article configuration options
 * @returns Complete Article Schema.org object with all SEO properties
 *
 * @example
 * const articleSchema = createArticleSchema({
 *   headline: "10 Best Practices for Web Development in 2025",
 *   description: "Learn the top web development practices...",
 *   image: "https://www.codebrand.us/photos/blog/article.webp",
 *   datePublished: "2025-01-15T10:00:00Z",
 *   dateModified: "2025-01-20T14:30:00Z",
 *   author: "John Doe",
 *   url: "https://www.codebrand.us/blog/web-development-best-practices/",
 *   keywords: ["web development", "best practices", "2025"],
 *   wordCount: 2500,
 *   readingTime: 10
 * });
 */
export function createArticleSchema(options: ArticleSchemaOptions) {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author,
    authorUrl,
    url,
    keywords,
    articleSection,
    wordCount,
    readingTime,
  } = options;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author || "Codebrand Team",
      url: authorUrl || "https://www.codebrand.us/team/",
    },
    publisher: {
      "@type": "Organization",
      name: "Codebrand Digital Agency",
      logo: {
        "@type": "ImageObject",
        url: "https://www.codebrand.us/iconcodebrand.svg",
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(", ") }),
    ...(articleSection && { articleSection }),
    ...(wordCount && { wordCount }),
    ...(readingTime && { timeRequired: `PT${readingTime}M` }),
    inLanguage: options.inLanguage ?? "en-US",
    isAccessibleForFree: true,
    copyrightHolder: {
      "@type": "Organization",
      name: "Codebrand",
    },
  };
}

/**
 * HowTo step with name and description
 */
export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

/**
 * Creates HowTo schema for tutorial/guide content
 * Supports both simple string arrays and detailed step objects
 *
 * @param name - Title of the how-to guide
 * @param description - Description of what will be accomplished
 * @param steps - Array of step descriptions (strings) or detailed step objects
 * @param image - Optional image URL
 * @param totalTime - Optional total time in ISO 8601 duration format (e.g., "PT30M")
 * @returns Complete HowTo Schema.org object
 *
 * @example
 * // Simple usage with strings
 * const howToSchema = createHowToSchema(
 *   "How to Build a React Website",
 *   "Learn to build a modern React website from scratch",
 *   [
 *     "Install Node.js and npm",
 *     "Create a new React project",
 *     "Deploy to production"
 *   ]
 * );
 *
 * @example
 * // Advanced usage with step objects
 * const howToSchema = createHowToSchema(
 *   "How to Build a React Website",
 *   "Learn to build a modern React website from scratch",
 *   [
 *     { name: "Setup Environment", text: "Install Node.js and npm" },
 *     { name: "Create Project", text: "Run create-react-app" },
 *     { name: "Deploy", text: "Deploy to production" }
 *   ],
 *   "https://www.codebrand.us/photos/react-tutorial.webp",
 *   "PT2H"
 * );
 */
export function createHowToSchema(
  name: string,
  description: string,
  steps: (string | HowToStep)[],
  image?: string,
  totalTime?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => {
      const isObject = typeof step === "object";
      const stepName = isObject ? step.name : extractStepName(step);
      const stepText = isObject ? step.text : step;

      return {
        "@type": "HowToStep",
        position: index + 1,
        name: stepName,
        text: stepText,
        ...(isObject && step.url && { url: step.url }),
        ...(isObject && step.image && {
          image: { "@type": "ImageObject", url: step.image },
        }),
      };
    }),
  };
}

/**
 * Extracts a step name from the step text (takes text before colon or first sentence)
 */
function extractStepName(stepText: string): string {
  // If text has a colon, use the part before it as the name
  const colonIndex = stepText.indexOf(":");
  if (colonIndex > 0 && colonIndex < 50) {
    return stepText.substring(0, colonIndex).trim();
  }
  // Otherwise, use first 50 chars or full text if shorter
  return stepText.length > 50 ? stepText.substring(0, 50).trim() + "..." : stepText;
}

/**
 * Creates LocalBusiness schema for location pages
 *
 * @param city - City name
 * @param state - State name
 * @param stateCode - State abbreviation
 * @param description - Location-specific description
 * @returns Complete LocalBusiness Schema.org object
 */
/** ISO 3166-1 alpha-2 codes for the country slugs used by the geo collections. */
const COUNTRY_CODES: Record<string, string> = {
  usa: "US", honduras: "HN", mexico: "MX", guatemala: "GT", "el-salvador": "SV",
  "costa-rica": "CR", panama: "PA", colombia: "CO", chile: "CL", spain: "ES",
};

/**
 * Service-area schema for a city page. Codebrand has ONE physical address (San
 * Pedro Sula, Honduras); the city is the area served, never the business address.
 * Claiming a local address in every city would be misleading structured data.
 */
export function createLocalBusinessSchema(
  city: string,
  state: string,
  stateCode: string,
  description: string,
  options: { slug?: string; countrySlug?: string; countryName?: string; spanish?: boolean } = {}
) {
  const { slug, countrySlug, countryName, spanish } = options;
  const countryCode = countrySlug ? COUNTRY_CODES[countrySlug] : undefined;
  const pageUrl = slug
    ? `https://www.codebrand.us/locations/${slug}/`
    : `https://www.codebrand.us/locations/${city.toLowerCase().replace(/\s+/g, "-")}-${stateCode.toLowerCase()}/`;
  const label = (en: string, es: string) => (spanish ? es : en);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: label(`Codebrand, Web Development in ${city}`, `Codebrand, Desarrollo Web en ${city}`),
    description,
    url: pageUrl,
    telephone: BUSINESS_INFO.us.phoneRaw,
    email: BUSINESS_INFO.us.email,
    priceRange: BUSINESS_INFO.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.city,
      addressRegion: BUSINESS_INFO.address.region,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.countryCode,
    },
    areaServed: {
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "State",
        name: state,
        ...(countryName || countryCode
          ? { containedInPlace: { "@type": "Country", name: countryName ?? countryCode, ...(countryCode ? { identifier: countryCode } : {}) } }
          : {}),
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: label(`Web Development Services in ${city}`, `Servicios de Desarrollo Web en ${city}`),
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: label("Custom Web Development", "Desarrollo Web a la Medida"),
            description: label(`Professional web development services for businesses in ${city}, ${state}`, `Servicios profesionales de desarrollo web para empresas de ${city}, ${state}`),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: label("E-commerce Development", "Desarrollo de Tiendas en Línea"),
            description: label(`E-commerce solutions for ${city} businesses`, `Soluciones de comercio electrónico para negocios de ${city}`),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: label("UI/UX Design", "Diseño UX/UI"),
            description: label(`User experience design services in ${city}`, `Servicios de diseño de experiencia de usuario en ${city}`),
          },
        },
      ],
    },
    sameAs: [
      "https://www.linkedin.com/company/codebrand-es",
      "https://x.com/Codebrand_es",
      "https://www.facebook.com/p/Codebrand-100087321501519/",
    ],
  };
}
