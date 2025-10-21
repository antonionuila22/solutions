/**
 * Promotional Products Service Page Configuration
 * Configuration for custom printing and promotional products using ServicePageTemplate
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const promotionalProductsConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "Promotional Products & Custom Printing Services - Codebrand",
    description:
      "Professional custom promotional products including sublimation, digital printing, laser engraving, branded merchandise, and corporate gifts. Create unique branded items that leave a lasting impression.",
    keywords:
      "promotional products, custom printing, sublimation, laser engraving, branded merchandise, corporate gifts, custom apparel, promotional items, vinyl printing, custom gifts, branded products, custom promotional products, promotional printing, custom t-shirts, corporate branding, promotional giveaways, custom merchandise, screen printing, embroidery, promotional marketing, branded swag, event merchandise, custom packaging",
    image: "/photos/bannercodebrand.webp",
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "Promotional Products and Custom Printing Services",
    "Professional custom promotional products including sublimation, digital printing, laser engraving, branded merchandise, and corporate gifts."
  ),

  // Hero Section
  hero: {
    badge: "Custom Printing Excellence",
    title: "Turn Products Into",
    titleHighlight: "Brand Ambassadors",
    description:
      "Custom promotional products and branded merchandise that extend your brand reach. From apparel to tech accessories, we print and engrave your vision on anything.",
    ctaPrimary: "Get Custom Quote",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View Products",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "10K+", label: "Items Produced", sublabel: "Successfully Delivered" },
      { value: "50+", label: "Product Types", sublabel: "Available Options" },
      { value: "100%", label: "Quality Guarantee", sublabel: "Premium Materials" },
    ],
  },

  // Services Section
  services: {
    title: "Complete Custom Product Solutions",
    subtitle: "Promotional Products & Custom Printing",
    description:
      "From apparel to corporate gifts, we create custom branded products using professional printing and engraving techniques.",
    columns: "3",
    items: [
      {
        icon: "/icons/camiseta.webp",
        title: "Custom Apparel",
        description:
          "T-shirts, hoodies, polo shirts, and uniforms with custom printing and embroidery for your brand.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/camiseta.webp",
        title: "Sublimation Printing",
        description:
          "Full-color sublimation on textiles, mugs, and other items for vibrant, long-lasting designs.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/camiseta.webp",
        title: "Digital Printing",
        description:
          "High-quality digital printing on various materials including vinyl, canvas, and promotional items.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/camiseta.webp",
        title: "Laser Engraving",
        description:
          "Precision laser engraving on wood, metal, glass, and acrylic for professional branded products.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/camiseta.webp",
        title: "Branded Merchandise",
        description:
          "Pens, notebooks, bags, tech accessories, and other promotional items customized with your logo.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-grafico.webp",
        title: "Corporate Gifts",
        description:
          "Premium gift sets and custom corporate presents for clients, employees, and special events.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/balloon-business-svgrepo-com.svg",
        title: "Event Merchandise",
        description:
          "Custom products for events, trade shows, conferences, and promotional campaigns.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/camiseta.webp",
        title: "Vinyl Cutting & Decals",
        description:
          "Custom vinyl stickers, decals, and vehicle wraps for branding and promotional purposes.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/camiseta.webp",
        title: "Packaging & Labels",
        description:
          "Custom product packaging, labels, and boxes to enhance your brand presentation.",
        learnMoreUrl: "#",
      },
    ],
  },

  // Tools Section - Using "techniques" instead of traditional tools
  tools: {
    title: "Professional Printing Techniques",
    subtitle: "Custom Production Methods",
    description:
      "We use advanced printing and engraving techniques to create high-quality branded products.",
    columns: "4",
    items: [
      { name: "Sublimation", icon: "🎨" },
      { name: "Digital Printing", icon: "🖨️" },
      { name: "Laser Engraving", icon: "⚡" },
      { name: "Screen Printing", icon: "🖼️" },
      { name: "Embroidery", icon: "🧵" },
      { name: "Vinyl Cutting", icon: "✂️" },
      { name: "Heat Transfer", icon: "🔥" },
      { name: "UV Printing", icon: "☀️" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Why Choose Codebrand",
    subtitle: "Our Promotional Products Advantages",
    description:
      "Our custom printing services combine premium quality with fast production for exceptional branded products.",
    columns: "3",
    items: [
      {
        icon: "⭐",
        title: "Premium Quality",
        description:
          "We use professional-grade materials and equipment to ensure your branded products look exceptional and last long.",
      },
      {
        icon: "⚡",
        title: "Fast Production",
        description:
          "Efficient production processes and in-house manufacturing for quick turnaround times without compromising quality.",
      },
      {
        icon: "📦",
        title: "No Minimum Orders",
        description:
          "From single items to bulk orders, we accommodate projects of any size to meet your specific needs.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to ",
    titleHighlight: "Brand Your Products?",
    description:
      "Let's create custom promotional products that extend your brand reach and leave lasting impressions. Get your free quote today.",
    ctaPrimary: "Get Custom Quote",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View All Services",
    ctaSecondaryUrl: "/services",
  },

  // Optional sections
  showWhyUs: true,
  showFaq: true,
};
