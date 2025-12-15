/**
 * Web Development Service Page Configuration
 * Configuration for web development services using ServicePageTemplate
 *
 * NOTE: Original page had custom sections that may need to be re-added:
 * - Custom two-column hero layout with image placeholder
 * - Portfolio/Case study teaser section with project cards
 * - Technologies section using Tabler Icons (ti ti-brand-*)
 * - Custom features/benefits layout with icons on left
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const webDevelopmentConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "Web Development Services | Custom Website Design | Codebrand",
    description:
      "Transform your business with our professional web development services. We create fast, responsive, and SEO-optimized websites tailored to your needs. Custom web applications, e-commerce solutions, and mobile-friendly designs that drive results.",
    keywords:
      "web development, website design, custom web applications, responsive web design, e-commerce development, mobile-friendly websites, SEO web development, progressive web apps, front-end development, back-end development, website development services, professional web design, custom website development, web application development, React development, Next.js development, full stack development, website redesign, web development company, modern web development, scalable web solutions",
    image: "/photos/bannercodebrand.webp",
    canonicalUrl: "https://codebrand.us/web-development", // Points to main page to avoid duplicate content
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "Web Development Services",
    "Professional web development services including custom website development, responsive web design, e-commerce solutions, web applications, and progressive web apps."
  ),

  // Hero Section
  hero: {
    badge: "WEB DEVELOPMENT",
    title: "Professional",
    titleHighlight: "Web Development",
    titleEnd: "Solutions",
    description:
      "Transform your ideas into powerful digital experiences. We build fast, scalable, and SEO-optimized websites that drive business growth and deliver exceptional user experiences.",
    ctaPrimary: "Start Your Project",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View Services",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "100+", label: "Projects Delivered", sublabel: "Successful Launches" },
      { value: "5+", label: "Years Experience", sublabel: "In Web Development" },
      { value: "99%", label: "Client Satisfaction", sublabel: "Proven Results" },
    ],
  },

  // Services Section
  services: {
    title: "Comprehensive Web Development Services",
    subtitle: "Our Services",
    description:
      "From concept to launch, we provide end-to-end web development solutions that combine cutting-edge technology with exceptional design to create websites that perform and convert.",
    columns: "3",
    items: [
      {
        icon: "/icons/login-page-svgrepo-com.svg",
        title: "Custom Website Development",
        description:
          "Tailored web solutions built from scratch to match your unique business requirements. We use modern frameworks and technologies to create scalable, maintainable websites.",
        learnMoreUrl: "/contact",
      },
      {
        icon: " /icons/responsive-svgrepo-com.svg",
        title: "Responsive Web Design",
        description:
          "Mobile-first designs that provide seamless experiences across all devices. Your website will look stunning on desktops, tablets, and smartphones.",
        learnMoreUrl: "/contact",
      },
      {
        icon: "/icons/website-program-svgrepo-com.svg",
        title: "SEO-Optimized Development",
        description:
          "Built with search engines in mind. We implement technical SEO best practices, fast loading speeds, and clean code structure to improve your rankings.",
        learnMoreUrl: "/contact",
      },
      {
        icon: " /icons/ecommerce-website-commerce-and-shopping-2-svgrepo-com.svg",
        title: "E-commerce Solutions",
        description:
          "Complete online store development with secure payment gateways, inventory management, and user-friendly shopping experiences that increase conversions.",
        learnMoreUrl: "/contact",
      },
      {
        icon: "/icons/website-seo-promotion-svgrepo-com.svg",
        title: "Web Applications",
        description:
          "Complex web applications with advanced functionality. From customer portals to SaaS platforms, we build robust solutions that scale with your business.",
        learnMoreUrl: "/contact",
      },
      {
        icon: "/icons/platform-program-svgrepo-com.svg",
        title: "Progressive Web Apps (PWA)",
        description:
          "App-like experiences delivered through the web. PWAs work offline, load instantly, and provide engaging user experiences without app store downloads.",
        learnMoreUrl: "/contact",
      },
      {
        icon: "/icons/mobile-phone-app-svgrepo-com.svg",
        title: "Website Maintenance & Support",
        description:
          "Ongoing maintenance, updates, and technical support to keep your website secure, fast, and up-to-date with the latest technologies.",
        learnMoreUrl: "/contact",
      },
      {
        icon: "/icons/host-website-se-svgrepo-com.svg",
        title: "API Development & Integration",
        description:
          "Custom API development and third-party integrations to connect your website with other tools, services, and platforms seamlessly.",
        learnMoreUrl: "/contact",
      },
      {
        icon: "/icons/data-graphics-analysis-svgrepo-com.svg",
        title: "Website Migration & Redesign",
        description:
          "Modernize your existing website with a complete redesign or migrate to a new platform while preserving your SEO rankings and data.",
        learnMoreUrl: "/contact",
      },
    ],
  },

  // Tools Section - Simplified from Tabler Icons to emoji
  tools: {
    title: "Built with Modern Technologies",
    subtitle: "Technology Stack",
    description:
      "We leverage the latest and most reliable technologies to ensure your web development project is fast, secure, and future-proof.",
    columns: "4",
    items: [
      { name: "React.js", icon: "/icons/react-svgrepo-com.svg" },
      { name: "Node.js", icon: "/icons/nodejs-svgrepo-com.svg" },
      { name: "Next.js", icon: "/icons/nextjs-svgrepo-com.svg" },
      { name: "TypeScript", icon: "/icons/typescript-official-svgrepo-com.svg" },
      { name: "Tailwind CSS", icon: "/icons/tailwindcss-svgrepo-com.svg" },
      { name: "PostgreSQL", icon: "/icons/postgresql-logo-svgrepo-com.svg" },
      { name: "AWS / Vercel", icon: "/icons/aws-svgrepo-com.svg" },
      { name: "GraphQL", icon: "/icons/graphql-svgrepo-com.svg" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Web Development That Delivers Results",
    subtitle: "Why Choose Us",
    description:
      "Our web development services combine technical excellence with creative design to deliver exceptional digital experiences.",
    columns: "2",
    items: [
      {
        icon: "🚀",
        title: "Lightning-Fast Performance",
        description:
          "Optimized code and modern technologies ensure your website loads in under 3 seconds, improving user experience and SEO rankings.",
      },
      {
        icon: "📱",
        title: "100% Responsive Design",
        description:
          "Perfect display on all devices. Mobile-first approach ensures your website looks amazing on phones, tablets, and desktops.",
      },
      {
        icon: "🛡️",
        title: "Security & Reliability",
        description:
          "Enterprise-level security measures, SSL encryption, regular backups, and 99.9% uptime guarantee for peace of mind.",
      },
      {
        icon: "🎯",
        title: "SEO-Ready from Day One",
        description:
          "Built-in SEO best practices, clean code structure, optimized meta tags, and schema markup for better search engine visibility.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to Build Your ",
    titleHighlight: "Dream Website?",
    description:
      "Let's transform your vision into a powerful web presence. Our expert team is ready to bring your ideas to life with cutting-edge web development solutions.",
    ctaPrimary: "Get Free Consultation",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "Email Us",
    ctaSecondaryUrl: "mailto:info@codebrand.es",
    features: "🚀 Fast turnaround times · 💯 Quality guaranteed · 🤝 Dedicated support",
  },

  // Optional sections
  showWhyUs: false, // Page had custom benefits section instead
  showFaq: true,
};
