/**
 * SEO Service Page Configuration
 * Configuration for SEO services using ServicePageTemplate
 * ENHANCED: Added process, case studies, testimonials, and related services
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const seoConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "SEO Services | Professional Search Engine Optimization - Codebrand",
    description:
      "Professional SEO services including technical audits, keyword research, on-page optimization, link building, content strategy, and local SEO. Boost Google rankings and drive organic traffic.",
    keywords:
      "SEO services, search engine optimization, technical SEO, keyword research, on-page SEO, link building, local SEO, SEO audit, content strategy, SEO consulting, Google rankings, organic traffic, SEO company, SEO optimization, SEO marketing, search engine marketing, SEO agency, professional SEO services, SEO expert, website SEO, SEO specialist, SEO packages, monthly SEO services",
    image: "/photos/bannercodebrand.webp",
    canonicalUrl: "https://codebrand.us/seo", // Points to main page to avoid duplicate content
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "SEO Services",
    "Professional SEO services including technical audits, keyword research, on-page optimization, link building, content strategy, and local SEO. Boost Google rankings and drive organic traffic.",
    "SEO Services",
    [
      {
        name: "Technical SEO",
        description: "Site structure, crawlability, indexing, and technical optimization",
      },
      {
        name: "On-Page SEO",
        description: "Content optimization, meta tags, headers, and internal linking",
      },
      {
        name: "Off-Page SEO",
        description: "Link building, brand mentions, and authority building",
      },
      {
        name: "Local SEO",
        description: "Google Business Profile, citations, and local rankings",
      },
    ]
  ),

  // Hero Section
  hero: {
    badge: "SEO Excellence",
    title: "Dominate Search Rankings",
    titleHighlight: "With Expert SEO",
    description:
      "Professional SEO services that increase visibility, drive organic traffic, and boost conversions. Data-driven strategies backed by proven results.",
    ctaPrimary: "Get Free SEO Audit",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View Services",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "200+", label: "Clients Ranked", sublabel: "Top 10 Results" },
      { value: "150%", label: "Traffic Growth", sublabel: "Average Increase" },
      { value: "98%", label: "Client Retention", sublabel: "Long-term Success" },
    ],
  },

  // Services Section
  services: {
    title: "Complete SEO Solutions",
    subtitle: "SEO Services",
    description:
      "From technical optimization to content strategy, we provide comprehensive SEO services that improve rankings, increase organic traffic, and drive business growth.",
    columns: "3",
    items: [
      {
        icon: "/icons/seo.webp",
        title: "Technical SEO Audit",
        description:
          "Comprehensive analysis of site structure, crawlability, indexing, and technical issues affecting search performance.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/system-search-svgrepo-com.svg",
        title: "Keyword Research",
        description:
          "In-depth keyword analysis to identify high-value search terms and opportunities for ranking growth.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/tags-discount-seo-svgrepo-com.svg",
        title: "On-Page Optimization",
        description:
          "Optimize title tags, meta descriptions, headers, content, and internal linking for better rankings.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/website-seo-promotion-svgrepo-com.svg",
        title: "Content Strategy",
        description:
          "Develop SEO-driven content plans that attract, engage, and convert your target audience.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/case-ppt-svgrepo-com.svg",
        title: "Link Building",
        description:
          "Strategic acquisition of high-quality backlinks to boost domain authority and search visibility.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/planet-space-svgrepo-com.svg",
        title: "Local SEO",
        description:
          "Optimize for local searches with Google Business Profile, citations, and location-based strategies.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/map-service-ocean-svgrepo-com.svg",
        title: "SEO Analytics & Reporting",
        description:
          "Track rankings, traffic, conversions, and ROI with detailed monthly performance reports.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.webp",
        title: "Competitor Analysis",
        description:
          "Analyze competitor strategies to identify gaps and opportunities in your market.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/data-graphics-analysis-svgrepo-com.svg",
        title: "E-commerce SEO",
        description:
          "Specialized optimization for online stores, including product pages, categories, and schema markup.",
        learnMoreUrl: "#",
      },
    ],
  },

  // Process Section
  process: {
    title: "Our SEO",
    titleHighlight: "Process",
    subtitle: "A proven methodology that delivers sustainable ranking improvements.",
    steps: [
      {
        number: 1,
        title: "Audit & Analysis",
        description: "Comprehensive technical audit, competitor analysis, and keyword research to identify opportunities and create a baseline.",
      },
      {
        number: 2,
        title: "Strategy Development",
        description: "Custom SEO strategy based on your goals, industry, and competitive landscape. Prioritized action plan for maximum impact.",
      },
      {
        number: 3,
        title: "Implementation",
        description: "Execute technical fixes, on-page optimization, content creation, and link building campaigns according to strategy.",
      },
      {
        number: 4,
        title: "Monitor & Optimize",
        description: "Continuous monitoring, A/B testing, and refinement. Monthly reports track progress and inform ongoing optimization.",
      },
    ],
  },

  // Case Studies Section
  caseStudies: {
    title: "SEO",
    titleHighlight: "Success Stories",
    subtitle: "Real results from real clients. See how our SEO strategies have transformed businesses.",
    items: [
      {
        category: "E-commerce",
        categoryColor: "text-blue-600",
        title: "Online Store Rankings",
        description: "Took an e-commerce store from page 5 to page 1 for their primary keywords, resulting in massive organic revenue growth.",
        metrics: [
          { value: "+420%", label: "Organic Traffic" },
          { value: "+280%", label: "Revenue" },
          { value: "#1", label: "Primary Keywords" },
        ],
        gradientFrom: "from-blue-600",
        gradientTo: "to-blue-800",
      },
      {
        category: "Local Business",
        categoryColor: "text-green-600",
        title: "Local Service Provider",
        description: "Dominated local search results for a service business, filling their calendar with qualified leads.",
        metrics: [
          { value: "+350%", label: "Local Leads" },
          { value: "3-Pack", label: "Google Maps" },
          { value: "+200%", label: "Calls" },
        ],
        gradientFrom: "from-green-600",
        gradientTo: "to-green-800",
      },
      {
        category: "B2B SaaS",
        categoryColor: "text-purple-600",
        title: "SaaS Company SEO",
        description: "Built organic authority for a B2B software company, reducing their CAC and increasing inbound demo requests.",
        metrics: [
          { value: "-65%", label: "CAC" },
          { value: "+180%", label: "Demo Requests" },
          { value: "50+", label: "Page 1 Keywords" },
        ],
        gradientFrom: "from-purple-600",
        gradientTo: "to-purple-800",
      },
    ],
  },

  // Tools Section
  tools: {
    title: "Professional SEO Tools",
    subtitle: "Industry-Standard Software",
    description:
      "We use cutting-edge SEO tools and analytics platforms to deliver data-driven results.",
    columns: "4",
    items: [
      { name: "Google Search Console", icon: "🔍" },
      { name: "Google Analytics", icon: "📈" },
      { name: "Ahrefs", icon: "🔗" },
      { name: "SEMrush", icon: "🎯" },
      { name: "Screaming Frog", icon: "🕷️" },
      { name: "Moz Pro", icon: "📍" },
      { name: "Yoast SEO", icon: "✅" },
      { name: "Schema.org", icon: "🏷️" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Why Choose Codebrand",
    subtitle: "Our SEO Advantages",
    description:
      "Our SEO strategies combine technical expertise with creative content to deliver measurable results.",
    columns: "3",
    items: [
      {
        icon: "📊",
        title: "Data-Driven Strategy",
        description:
          "Every decision is backed by comprehensive analytics, keyword data, and competitor insights for maximum impact.",
      },
      {
        icon: "🎯",
        title: "White-Hat Techniques",
        description:
          "Sustainable, ethical SEO practices that build long-term rankings without risking penalties from search engines.",
      },
      {
        icon: "📈",
        title: "Transparent Reporting",
        description:
          "Clear monthly reports showing rankings, traffic, conversions, and ROI so you always know where you stand.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to ",
    titleHighlight: "Dominate Search Results?",
    description:
      "Let's boost your organic traffic and improve your search rankings with proven SEO strategies. Get your free SEO audit and start climbing the search results today.",
    ctaPrimary: "Get Free SEO Audit",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View All Services",
    ctaSecondaryUrl: "/services",
  },

  // Related Services for internal linking
  relatedServicesKey: "seo",

  // Optional sections
  showWhyUs: true,
  showFaq: true,
  showTrustBadges: true,
  showTestimonials: true,
};
