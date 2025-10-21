/**
 * Schema.org structured data utilities for SEO
 * Generates standardized Schema.org markup for services
 */

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
 */
const ORGANIZATION_DATA = {
  "@type": "Organization",
  name: "Codebrand",
  url: "https://codebrand.com",
  logo: "https://codebrand.com/photos/bannercodebrand.webp",
} as const;

/**
 * Default offer structure for all services
 */
const DEFAULT_OFFER = {
  "@type": "Offer",
  availability: "https://schema.org/InStock",
  price: "0",
  priceCurrency: "USD",
} as const;

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

/**
 * Validates a Schema.org object structure
 *
 * @param schema - Schema object to validate
 * @returns true if valid, throws error if invalid
 */
export function validateSchema(schema: any): boolean {
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
