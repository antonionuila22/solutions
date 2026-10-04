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
    phone: "+504 8738-0714",
    phoneRaw: "+50487380714",
    whatsapp: "50487380714",
    whatsappUrl: "https://api.whatsapp.com/send/?phone=50487380714&type=phone_number&app_absent=0",
  },

  // Honduras Market Contact
  hn: {
    email: "info@codebrand.es",
    phone: "+504 8738-0714",
    phoneRaw: "+50487380714",
    whatsapp: "50487380714",
    whatsappUrl: "https://api.whatsapp.com/send/?phone=50487380714&type=phone_number&app_absent=0",
  },

  // Physical Address (Headquarters)
  // Confirmed by the owner on 2026-10-03. The postal code read 21102 here and in
  // two layouts holding their own copy; it is 50200.
  //
  // Those two layouts still hold literal copies, and have to: their JSON-LD is
  // emitted with is:inline, which Astro passes through verbatim without
  // evaluating expressions, so the values cannot be read from here. scripts/
  // seo-check.mjs asserts that what every page publishes matches this object,
  // which is what actually stops the three copies drifting apart again.
  address: {
    street: "Edificio Nuevos Horizontes",
    city: "San Pedro Sula",
    region: "Cortés",
    regionCode: "CR",
    postalCode: "50200",
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
  baseUrl: "https://www.codebrand.us",
  logoUrl: "https://www.codebrand.us/iconcodebrand.svg",
  bannerUrl: "https://www.codebrand.us/photos/bannercodebrand.webp",

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

  // Languages
  languages: ["English", "Spanish"],
} as const;

// Type exports for TypeScript
export type BusinessInfo = typeof BUSINESS_INFO;
export type ContactInfo = typeof BUSINESS_INFO.us;

/**
 * Years the company has been operating, counted from foundingDate.
 *
 * Derived rather than written down because the site used to state this three
 * different ways at once: "8+" on six pages, "5+" on two more, and
 * foundingDate 2020 in the organization schema, which is the one the owner
 * confirmed. A hardcoded figure is wrong the moment a year passes; this one is
 * recomputed on every build.
 */
export function yearsInBusiness(now: Date = new Date()): number {
    return now.getFullYear() - Number(BUSINESS_INFO.foundingDate);
}

/**
 * Years of development experience the people carry, which is NOT the company's
 * age and is deliberately a separate constant. Confirmed by the owner on
 * 2026-10-03: the collaborators each bring more than twenty years, against a
 * company founded in 2020. The team stat used to publish "8+", understating it
 * by more than half.
 */
export const TEAM_YEARS_LABEL = "20+";

/** The same figure as a stat-block value, e.g. "6+". */
export const YEARS_IN_BUSINESS_LABEL = `${yearsInBusiness()}+`;

export type AddressInfo = typeof BUSINESS_INFO.address;
