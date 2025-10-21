/**
 * SEO Service Page Configuration
 * Configuration for SEO services using ServicePageTemplate
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
      "SEO services, search engine optimization, technical SEO, keyword research, on-page SEO, link building, local SEO, SEO audit, content strategy, SEO consulting, Google rankings, organic traffic, SEO company, SEO optimization, SEO marketing, search engine marketing",
    image: "/photos/bannercodebrand.webp",
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "SEO Services",
    "Professional SEO services including technical audits, keyword research, on-page optimization, link building, content strategy, and local SEO. Boost Google rankings and drive organic traffic."
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
        icon: "/icons/seo.png",
        title: "Technical SEO Audit",
        description:
          "Comprehensive analysis of site structure, crawlability, indexing, and technical issues affecting search performance.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.png",
        title: "Keyword Research",
        description:
          "In-depth keyword analysis to identify high-value search terms and opportunities for ranking growth.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.png",
        title: "On-Page Optimization",
        description:
          "Optimize title tags, meta descriptions, headers, content, and internal linking for better rankings.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.png",
        title: "Content Strategy",
        description:
          "Develop SEO-driven content plans that attract, engage, and convert your target audience.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.png",
        title: "Link Building",
        description:
          "Strategic acquisition of high-quality backlinks to boost domain authority and search visibility.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.png",
        title: "Local SEO",
        description:
          "Optimize for local searches with Google Business Profile, citations, and location-based strategies.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.png",
        title: "SEO Analytics & Reporting",
        description:
          "Track rankings, traffic, conversions, and ROI with detailed monthly performance reports.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.png",
        title: "Competitor Analysis",
        description:
          "Analyze competitor strategies to identify gaps and opportunities in your market.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/seo.png",
        title: "E-commerce SEO",
        description:
          "Specialized optimization for online stores, including product pages, categories, and schema markup.",
        learnMoreUrl: "#",
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
      { name: "Google Search Console", icon: "📊" },
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

  // Optional sections
  showWhyUs: true,
  showFaq: true,
};
