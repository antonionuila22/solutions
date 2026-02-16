/**
 * Centralized Business Information (NAP - Name, Address, Phone)
 * This ensures consistency across all pages, schemas, and components
 */

export const BUSINESS_INFO = {
  // Company Identity
  name: "Codebrand",
  legalName: "Codebrand Digital Agency",
  alternateName: [
    "Codebrand",
    "CodeBrand",
    "Code Brand",
    "Codebrand Digital",
    "Codebrand Agency",
  ],
  foundingDate: "2020",
  description:
    "Professional web development agency offering custom websites, e-commerce solutions, UI/UX design, and digital marketing services. US timezone, English-fluent team, 60% cost savings.",

  // US Market Contact (services exported from Honduras)
  us: {
    email: "info@codebrand.es",
    phone: "+504 3272-2973",
    phoneRaw: "+50432722973",
    whatsapp: "50432722973",
    whatsappUrl: "https://wa.me/50432722973",
  },

  // Honduras Market Contact
  hn: {
    email: "info@codebrand.es",
    phone: "+504 3272-2973",
    phoneRaw: "+50432722973",
    whatsapp: "50432722973",
    whatsappUrl: "https://wa.me/50432722973",
  },

  // Physical Address (Headquarters)
  address: {
    street: "Edificio Nuevos Horizontes",
    city: "San Pedro Sula",
    region: "Cortés",
    regionCode: "CR",
    postalCode: "21102",
    country: "Honduras",
    countryCode: "HN",
  },

  // Geographic Coordinates (San Pedro Sula)
  geo: {
    latitude: 15.5,
    longitude: -88.03,
  },

  // Social Media Links
  social: {
    linkedin: "https://www.linkedin.com/company/codebrand-es",
    twitter: "https://x.com/Codebrand_es",
    facebook: "https://www.facebook.com/p/Codebrand-100087321501519/",
    instagram: "https://www.instagram.com/codebrand.us",
  },

  // URLs
  baseUrl: "https://codebrand.us",
  logoUrl: "https://codebrand.us/iconcodebrand.svg",
  bannerUrl: "https://codebrand.us/photos/bannercodebrand.webp",

  // Business Details
  priceRange: "$$$",
  currenciesAccepted: ["USD", "HNL"],
  paymentAccepted: ["Credit Card", "Bank Transfer", "PayPal"],
  openingHours: "Mo-Fr 08:00-18:00",
  timezone: "America/Tegucigalpa",

  // Areas Served
  areasServed: [
    { country: "United States", code: "US" },
    { country: "Honduras", code: "HN" },
    { country: "Mexico", code: "MX" },
    { country: "Guatemala", code: "GT" },
    { country: "El Salvador", code: "SV" },
    { country: "Costa Rica", code: "CR" },
    { country: "Panama", code: "PA" },
    { country: "Colombia", code: "CO" },
    { country: "Spain", code: "ES" },
    { country: "Chile", code: "CL" },
  ],

  // Services Offered
  services: [
    "Web Development",
    "Custom Software Development",
    "E-commerce Development",
    "UI/UX Design",
    "Mobile App Development",
    "SEO Optimization",
    "Digital Marketing",
    "Branding",
    "Landing Pages",
    "Web Maintenance",
  ],

  // Ratings
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 127,
    bestRating: 5,
    worstRating: 1,
  },

  // Languages
  languages: ["English", "Spanish"],
} as const;

// Type exports for TypeScript
export type BusinessInfo = typeof BUSINESS_INFO;
export type ContactInfo = typeof BUSINESS_INFO.us;
export type AddressInfo = typeof BUSINESS_INFO.address;
