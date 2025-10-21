/**
 * UX/UI Design Service Page Configuration
 * Configuration for UX/UI design services using ServicePageTemplate
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const uxUiConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "UX/UI Design Services | User Experience & Interface Design - Codebrand",
    description:
      "Transform your digital products with exceptional UX/UI design services. We create intuitive interfaces and engaging user experiences that boost conversions and customer loyalty through research-driven design.",
    keywords:
      "UX design, UI design, user experience design, user interface design, UX/UI services, wireframing, prototyping, user research, usability testing, interaction design, responsive web design, mobile app design, UI UX designer, user experience consulting, interface design agency, UX research, user testing, design thinking, user-centered design, conversion rate optimization",
    image: "/photos/bannercodebrand.webp",
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "UX/UI Design Services",
    "Professional UX/UI design services including user research, wireframing, prototyping, interface design, and usability testing. We create data-driven, conversion-optimized user experiences.",
    "UX/UI Design Services",
    [
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
    ]
  ),

  // Hero Section
  hero: {
    badge: "UX/UI DESIGN",
    title: "Design Experiences",
    titleHighlight: "Users Love",
    description:
      "Research-driven UX/UI design that creates intuitive, beautiful interfaces. We transform complex problems into simple, elegant solutions that delight users and drive business results.",
    ctaPrimary: "Start Your Design Project",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View Our Process",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "200+", label: "Designs Created", sublabel: "Products Launched" },
      { value: "85%", label: "Conversion Increase", sublabel: "Average Improvement" },
      { value: "100%", label: "User-Centered", sublabel: "Design Approach" },
    ],
  },

  // Services Section
  services: {
    title: "Complete UX/UI Design Services",
    subtitle: "Design Solutions",
    description:
      "From user research to final design, we create exceptional digital experiences that combine beautiful aesthetics with intuitive functionality.",
    columns: "3",
    items: [
      {
        icon: "/icons/diseno-uxui.png",
        title: "User Research & Analysis",
        description:
          "Conduct in-depth user research through interviews, surveys, analytics, and competitive analysis to inform design decisions.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-uxui.png",
        title: "Information Architecture",
        description:
          "Structure content and navigation logically to help users find what they need quickly and intuitively.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-uxui.png",
        title: "Wireframing",
        description:
          "Create low-fidelity wireframes to establish layout, structure, and user flows before visual design.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-uxui.png",
        title: "Interactive Prototyping",
        description:
          "Build clickable prototypes that simulate the final product for testing and stakeholder approval.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-uxui.png",
        title: "UI Design",
        description:
          "Craft beautiful, on-brand interface designs with attention to typography, color, spacing, and visual hierarchy.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-uxui.png",
        title: "Design Systems",
        description:
          "Create comprehensive design systems and component libraries for consistency and scalability.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-uxui.png",
        title: "Usability Testing",
        description:
          "Test designs with real users to identify pain points, validate solutions, and optimize the experience.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-uxui.png",
        title: "Mobile App Design",
        description:
          "Design native iOS and Android apps with platform-specific guidelines and best practices.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-uxui.png",
        title: "Web Application Design",
        description:
          "Create responsive web app interfaces that work seamlessly across all devices and screen sizes.",
        learnMoreUrl: "#",
      },
    ],
  },

  // Tools Section
  tools: {
    title: "Professional Design Tools",
    subtitle: "Industry-Standard Software",
    description:
      "We use cutting-edge design tools to create, prototype, and collaborate on exceptional user experiences.",
    columns: "4",
    items: [
      { name: "Figma", icon: "🎨" },
      { name: "Adobe XD", icon: "🎯" },
      { name: "Sketch", icon: "✏️" },
      { name: "InVision", icon: "💡" },
      { name: "Framer", icon: "🔷" },
      { name: "Maze", icon: "🧭" },
      { name: "Hotjar", icon: "🔥" },
      { name: "Optimal Workshop", icon: "🧪" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Why Choose Codebrand",
    subtitle: "Our UX/UI Advantages",
    description:
      "Our user-centered design process creates interfaces that are both beautiful and highly functional.",
    columns: "3",
    items: [
      {
        icon: "🔬",
        title: "Research-Driven Design",
        description:
          "Every design decision is backed by user research, analytics, and testing to ensure we solve real user problems effectively.",
      },
      {
        icon: "🎨",
        title: "Pixel-Perfect Execution",
        description:
          "Meticulous attention to detail in every aspect of design, from typography and spacing to micro-interactions and animations.",
      },
      {
        icon: "📈",
        title: "Conversion-Focused",
        description:
          "Designs optimized for conversions through strategic placement of CTAs, friction reduction, and persuasive design patterns.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to ",
    titleHighlight: "Transform Your User Experience?",
    description:
      "Let's create intuitive, beautiful designs that users love and that drive real business results. Get your free UX audit and start improving your digital products today.",
    ctaPrimary: "Get Free UX Audit",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View All Services",
    ctaSecondaryUrl: "/services",
  },

  // Optional sections
  showWhyUs: true,
  showFaq: true,
};
