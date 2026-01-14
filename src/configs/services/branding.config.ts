/**
 * Branding Service Page Configuration
 * Configuration for branding services using ServicePageTemplate
 * ENHANCED: Added process, case studies, testimonials, and related services
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";
import BrandingExplainerSection from "../../components/service-sections/BrandingExplainerSection.astro";

export const brandingConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "Branding Services | Logo Design & Brand Identity - Codebrand",
    description:
      "Professional branding services including logo design, brand strategy, visual identity, and brand guidelines. Create a memorable brand that resonates with your audience and stands the test of time.",
    keywords:
      "branding, logo design, brand identity, visual identity, brand strategy, rebranding, brand guidelines, logo creation, corporate identity, brand design, brand development, brand positioning, brand messaging, brand personality, brand naming, brand collateral, business stationery, brand refresh, brand architecture, brand equity, trademark design, monogram design, wordmark design, symbol design, branding agency, brand identity design, professional branding services",
    image: "/photos/bannercodebrand.webp",
    canonicalUrl: "https://codebrand.us/branding", // Points to main page to avoid duplicate content
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "Branding Services",
    "Professional branding services including logo design, brand strategy, visual identity, brand guidelines, and rebranding. We create memorable brands that resonate with audiences and build lasting value.",
    "Branding Services",
    [
      {
        name: "Logo Design",
        description: "Distinctive, memorable logo design that embodies brand personality",
      },
      {
        name: "Brand Strategy",
        description: "Comprehensive brand positioning and messaging strategy",
      },
      {
        name: "Visual Identity Design",
        description: "Cohesive visual systems with color, typography, and design elements",
      },
      {
        name: "Brand Guidelines",
        description: "Detailed brand standards and usage documentation",
      },
    ]
  ),

  // Hero Section
  hero: {
    badge: "Branding Excellence",
    title: "Build a Brand That",
    titleHighlight: "Leaves a Legacy",
    description:
      "Strategic branding that goes beyond aesthetics. We create visual identities that capture your essence, resonate with your audience, and stand the test of time.",
    ctaPrimary: "Start Your Brand Journey",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "Explore Our Services",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "100+", label: "Brands Created", sublabel: "Successfully Delivered" },
      { value: "95%", label: "Client Satisfaction", sublabel: "Average Rating" },
      { value: "5+", label: "Years Experience", sublabel: "In the Industry" },
    ],
  },

  // Services Section
  services: {
    title: "Complete Brand Solutions",
    subtitle: "Our Branding Services",
    description:
      "From strategy to execution, we deliver comprehensive branding services that elevate your business and create lasting impressions in the minds of your customers.",
    columns: "3",
    items: [
      {
        icon: "/icons/diseno-grafico.webp",
        title: "Logo Design",
        description:
          "Create distinctive, memorable logos that embody your brand's personality and values with timeless appeal.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/creativity-svgrepo-com.svg",
        title: "Brand Strategy",
        description:
          "Develop comprehensive brand positioning, messaging, and personality that resonates with your target audience.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/target-focus-svgrepo-com.svg",
        title: "Visual Identity",
        description:
          "Craft cohesive visual systems including color palettes, typography, and design elements for brand consistency.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-grafico.webp",
        title: "Brand Guidelines",
        description:
          "Establish detailed brand standards and usage guidelines to maintain consistency across all touchpoints.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/case-ppt-svgrepo-com.svg",
        title: "Business Stationery",
        description:
          "Design professional business cards, letterheads, and corporate materials that reinforce your brand identity.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-grafico.webp",
        title: "Brand Collateral",
        description:
          "Create marketing materials, packaging, and promotional items that reflect your brand's visual language.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/case-ppt-svgrepo-com.svg",
        title: "Rebranding",
        description:
          "Refresh and modernize existing brands while preserving equity and evolving with market demands.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/brainstorming-svgrepo-com.svg",
        title: "Brand Naming",
        description:
          "Develop unique, memorable brand names and taglines that capture your brand essence and market positioning.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/diseno-grafico.webp",
        title: "Style Guides",
        description:
          "Create comprehensive documentation covering logo usage, color codes, typography, imagery, and tone of voice.",
        learnMoreUrl: "#",
      },
    ],
  },

  // Process Section
  process: {
    title: "Our Branding",
    titleHighlight: "Process",
    subtitle: "A strategic approach that creates brands with lasting impact.",
    steps: [
      {
        number: 1,
        title: "Discovery & Research",
        description: "Deep dive into your business, audience, competitors, and market to understand the landscape and opportunities.",
      },
      {
        number: 2,
        title: "Strategy & Positioning",
        description: "Define brand positioning, values, personality, and messaging that differentiates you from competitors.",
      },
      {
        number: 3,
        title: "Creative Development",
        description: "Design logo concepts, explore visual directions, and develop the visual identity system.",
      },
      {
        number: 4,
        title: "Refinement & Delivery",
        description: "Finalize designs, create brand guidelines, and deliver all assets and documentation.",
      },
    ],
  },

  // Case Studies Section
  caseStudies: {
    title: "Branding",
    titleHighlight: "Success Stories",
    subtitle: "See how our branding work has helped businesses establish strong market presence.",
    items: [
      {
        category: "Tech Startup",
        categoryColor: "text-blue-600",
        title: "SaaS Brand Launch",
        description: "Created a complete brand identity for a tech startup that helped them secure Series A funding and establish market presence.",
        metrics: [
          { value: "$5M", label: "Funding Secured" },
          { value: "+200%", label: "Brand Recognition" },
          { value: "90%", label: "Investor Approval" },
        ],
        gradientFrom: "from-blue-600",
        gradientTo: "to-blue-800",
      },
      {
        category: "Restaurant",
        categoryColor: "text-green-600",
        title: "Restaurant Rebrand",
        description: "Complete rebrand of a local restaurant chain that modernized their image and attracted a new demographic.",
        metrics: [
          { value: "+85%", label: "New Customers" },
          { value: "+45%", label: "Revenue Growth" },
          { value: "3x", label: "Social Following" },
        ],
        gradientFrom: "from-green-600",
        gradientTo: "to-green-800",
      },
      {
        category: "Professional Services",
        categoryColor: "text-purple-600",
        title: "Law Firm Identity",
        description: "Developed a sophisticated brand identity for a law firm that communicated trust, expertise, and professionalism.",
        metrics: [
          { value: "+120%", label: "Client Inquiries" },
          { value: "95%", label: "Brand Consistency" },
          { value: "+60%", label: "Client Trust" },
        ],
        gradientFrom: "from-purple-600",
        gradientTo: "to-purple-800",
      },
    ],
  },

  // Tools Section
  tools: {
    title: "Professional Design Tools",
    subtitle: "Industry-Standard Software",
    description:
      "We leverage industry-leading design software to create exceptional brand identities.",
    columns: "4",
    items: [
      { name: "Adobe Illustrator", icon: "🎨" },
      { name: "Adobe Photoshop", icon: "🖼️" },
      { name: "Adobe InDesign", icon: "📐" },
      { name: "Figma", icon: "🎯" },
      { name: "Sketch", icon: "✏️" },
      { name: "CorelDRAW", icon: "🖌️" },
      { name: "Affinity Designer", icon: "🎭" },
      { name: "Procreate", icon: "🖍️" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Why Choose Codebrand",
    subtitle: "Our Advantages",
    description:
      "Our branding approach combines creativity, strategy, and market insight to deliver results.",
    columns: "3",
    items: [
      {
        icon: "🎯",
        title: "Strategic Approach",
        description:
          "We combine market research, competitor analysis, and audience insights to create brands that stand out and connect.",
      },
      {
        icon: "⏱️",
        title: "Timeless Design",
        description:
          "Our designs are built to last, balancing contemporary trends with classic principles for long-term brand equity.",
      },
      {
        icon: "📦",
        title: "Complete Brand Systems",
        description:
          "We deliver comprehensive visual identities with detailed guidelines ensuring consistency across all applications.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to Build Your ",
    titleHighlight: "Brand Legacy?",
    description:
      "Let's create a brand identity that captures your vision, resonates with your audience, and stands out in the marketplace. Start your brand journey today.",
    ctaPrimary: "Get Started Now",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View All Services",
    ctaSecondaryUrl: "/services",
  },

  // Custom Sections - "What is Branding?" explainer
  customSections: [BrandingExplainerSection],

  // Related Services for internal linking
  relatedServicesKey: "branding",

  // Optional sections
  showWhyUs: true,
  showFaq: true,
  showTrustBadges: true,
  showTestimonials: true,
};
