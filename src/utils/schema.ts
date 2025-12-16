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
 *   { name: "Home", url: "https://codebrand.us" },
 *   { name: "Services", url: "https://codebrand.us/services" },
 *   { name: "Web Development", url: "https://codebrand.us/services/web-development" }
 * ]);
 */
export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Automatically generates breadcrumbs from a URL path
 *
 * @param currentUrl - The current page URL
 * @param baseUrl - The site base URL (default: https://codebrand.us)
 * @param customNames - Optional object mapping path segments to display names
 * @returns Complete BreadcrumbList Schema.org object
 *
 * @example
 * const breadcrumbs = createBreadcrumbSchemaFromUrl(
 *   "https://codebrand.us/services/web-development",
 *   "https://codebrand.us",
 *   { "web-development": "Web Development", "services": "Services" }
 * );
 */
export function createBreadcrumbSchemaFromUrl(
  currentUrl: string,
  baseUrl: string = "https://codebrand.us",
  customNames?: Record<string, string>
) {
  const url = new URL(currentUrl);
  const pathSegments = url.pathname.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [
    { name: "Home", url: baseUrl },
  ];

  let accumulatedPath = "";

  for (const segment of pathSegments) {
    accumulatedPath += `/${segment}`;
    const displayName = customNames?.[segment] ||
      segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    items.push({
      name: displayName,
      url: `${baseUrl}${accumulatedPath}`,
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
 *   image: "https://codebrand.us/photos/blog/article.webp",
 *   datePublished: "2025-01-15T10:00:00Z",
 *   dateModified: "2025-01-20T14:30:00Z",
 *   author: "John Doe",
 *   url: "https://codebrand.us/blog/web-development-best-practices",
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
      url: authorUrl || "https://codebrand.us/team",
    },
    publisher: {
      "@type": "Organization",
      name: "Codebrand Digital Agency",
      logo: {
        "@type": "ImageObject",
        url: "https://codebrand.us/iconcodebrand.svg",
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
    inLanguage: "en-US",
    isAccessibleForFree: true,
    copyrightHolder: {
      "@type": "Organization",
      name: "Codebrand",
    },
  };
}

/**
 * Creates HowTo schema for tutorial/guide content
 *
 * @param name - Title of the how-to guide
 * @param description - Description of what will be accomplished
 * @param steps - Array of step descriptions
 * @param image - Optional image URL
 * @param totalTime - Optional total time in ISO 8601 duration format (e.g., "PT30M")
 * @returns Complete HowTo Schema.org object
 *
 * @example
 * const howToSchema = createHowToSchema(
 *   "How to Build a React Website",
 *   "Learn to build a modern React website from scratch",
 *   [
 *     "Install Node.js and npm",
 *     "Create a new React project with create-react-app",
 *     "Build your components",
 *     "Deploy to production"
 *   ],
 *   "https://codebrand.us/photos/react-tutorial.webp",
 *   "PT2H"
 * );
 */
export function createHowToSchema(
  name: string,
  description: string,
  steps: string[],
  image?: string,
  totalTime?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(image && { image }),
    ...(totalTime && { totalTime }),
    step: steps.map((stepText, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text: stepText,
    })),
  };
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
export function createLocalBusinessSchema(
  city: string,
  state: string,
  stateCode: string,
  description: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `Codebrand - Web Development ${city}`,
    description,
    url: `https://codebrand.us/locations/${city.toLowerCase().replace(/\s+/g, "-")}-${stateCode.toLowerCase()}`,
    telephone: "+504-3272-2973",
    email: "info@codebrand.es",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "State",
        name: state,
      },
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        name: city,
      },
      geoRadius: "50 miles",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Web Development Services in ${city}`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Web Development",
            description: `Professional web development services for businesses in ${city}, ${state}`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "E-commerce Development",
            description: `E-commerce solutions for ${city} businesses`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "UI/UX Design",
            description: `User experience design services in ${city}`,
          },
        },
      ],
    },
    sameAs: [
      "https://hn.https://hn.linkedin.com/company/codebrand-es-es",
      "https://x.com/Codebrand_es",
      "https://www.facebook.com/codebrand",
    ],
  };
}
