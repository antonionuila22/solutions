/**
 * 3D Rendering Service Page Configuration
 * Configuration for 3D rendering and visualization services using ServicePageTemplate
 * ENHANCED: Added process, case studies, testimonials, and related services
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const renderingConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "3D Rendering Services | Architectural & Product Visualization - Codebrand",
    description:
      "Professional 3D rendering services for architecture, real estate, and product visualization. Photorealistic renders, 360° views, and virtual tours. Fast turnaround, unlimited revisions.",
    keywords:
      "3D rendering, architectural visualization, product rendering, 3D modeling, interior design rendering, exterior visualization, photorealistic rendering, CAD to 3D, virtual tours, 3D rendering services, architectural rendering, real estate rendering, 3D product visualization, 3D architecture, commercial rendering, residential rendering, 3D visualization company, CGI rendering, 3D walkthrough, rendering services near me, professional 3D renders",
    image: "/photos/bannercodebrand.webp",
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "3D Rendering and Visualization Services",
    "Professional 3D rendering services including architectural visualization, product rendering, interior/exterior design, and photorealistic visualization for marketing and presentations.",
    "3D Rendering Services",
    [
      {
        name: "Architectural Visualization",
        description: "Photorealistic 3D renders of buildings and spaces",
      },
      {
        name: "Product Rendering",
        description: "High-quality 3D product visualization for marketing",
      },
      {
        name: "Interior Design",
        description: "3D interior visualization and virtual staging",
      },
      {
        name: "Virtual Tours",
        description: "Immersive 360-degree virtual property tours",
      },
    ]
  ),

  // Hero Section
  hero: {
    badge: "3D Rendering Excellence",
    title: "Transform Your Vision Into",
    titleHighlight: "Stunning Reality",
    description:
      "Professional 3D rendering services that bring your architectural projects and products to life. Photorealistic visualizations that impress clients and accelerate sales.",
    ctaPrimary: "Request a Quote",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View Services",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "400+", label: "Projects Rendered", sublabel: "Successfully Delivered" },
      { value: "8K", label: "Resolution", sublabel: "Ultra HD Quality" },
      { value: "99%", label: "Client Satisfaction", sublabel: "Average Rating" },
    ],
  },

  // Services Section
  services: {
    title: "Complete 3D Solutions",
    subtitle: "3D Rendering Services",
    description:
      "From concept to final render, we create stunning 3D visualizations for architecture, real estate, and product marketing.",
    columns: "3",
    items: [
      {
        icon: "/icons/computer-monitor-svgrepo-com.svg",
        title: "Architectural Visualization",
        description:
          "Photorealistic renders of residential and commercial buildings for presentations, marketing, and approvals.",
      },
      {
        icon: "/icons/computer-monitor-svgrepo-com.svg",
        title: "Interior Design Rendering",
        description:
          "Detailed 3D interior visualizations showcasing materials, lighting, and furniture arrangements.",
      },
      {
        icon: "/icons/modelo-3d.webp",
        title: "Exterior Visualization",
        description:
          "Stunning exterior renders with realistic landscaping, lighting, and environmental context.",
      },
      {
        icon: "/icons/earth-planet-svgrepo-com.svg",
        title: "Product Rendering",
        description:
          "High-quality 3D product visualization for e-commerce, catalogs, and marketing materials.",
      },
      {
        icon: "/icons/balloon-business-svgrepo-com.svg",
        title: "360° Virtual Tours",
        description:
          "Immersive 360-degree renders and virtual tours for interactive property exploration.",
      },
      {
        icon: "/icons/planet-space-svgrepo-com.svg",
        title: "Real Estate Marketing",
        description:
          "Pre-construction visualization for real estate sales and investor presentations.",
      },
    ],
  },

  // Process Section
  process: {
    title: "Our 3D Rendering",
    titleHighlight: "Process",
    subtitle: "A systematic approach that transforms concepts into photorealistic visualizations.",
    steps: [
      {
        number: 1,
        title: "Briefing & Planning",
        description: "We gather your requirements, reference materials, CAD files, and design specifications. Define project scope and deliverables.",
      },
      {
        number: 2,
        title: "3D Modeling",
        description: "Create detailed 3D models based on your drawings and specifications. Accurate geometry and proportions guaranteed.",
      },
      {
        number: 3,
        title: "Materials & Lighting",
        description: "Apply realistic materials, textures, and set up professional lighting. Camera angles selected for maximum impact.",
      },
      {
        number: 4,
        title: "Rendering & Delivery",
        description: "High-resolution rendering, post-production, and final delivery. Unlimited revisions until you're satisfied.",
      },
    ],
  },

  // Case Studies Section
  caseStudies: {
    title: "3D Rendering",
    titleHighlight: "Success Stories",
    subtitle: "See how our photorealistic renders have helped clients sell properties and launch products.",
    items: [
      {
        category: "Real Estate",
        categoryColor: "text-blue-600",
        title: "Luxury Condo Pre-Sales",
        description: "Created photorealistic renders for a luxury condo development that sold 80% of units before construction began.",
        metrics: [
          { value: "80%", label: "Pre-Sold Units" },
          { value: "$50M", label: "Sales Value" },
          { value: "45", label: "Renders Delivered" },
        ],
        gradientFrom: "from-blue-600",
        gradientTo: "to-blue-800",
      },
      {
        category: "Product Design",
        categoryColor: "text-green-600",
        title: "Furniture E-commerce",
        description: "Produced 3D product renders for a furniture brand that eliminated photography costs and increased online sales.",
        metrics: [
          { value: "+120%", label: "Online Sales" },
          { value: "-70%", label: "Photo Costs" },
          { value: "200+", label: "Product Renders" },
        ],
        gradientFrom: "from-green-600",
        gradientTo: "to-green-800",
      },
      {
        category: "Architecture",
        categoryColor: "text-purple-600",
        title: "Commercial Development",
        description: "Delivered architectural visualization for a commercial plaza that helped secure investor funding.",
        metrics: [
          { value: "$25M", label: "Funding Secured" },
          { value: "30", label: "Exterior Views" },
          { value: "4K", label: "Resolution" },
        ],
        gradientFrom: "from-purple-600",
        gradientTo: "to-purple-800",
      },
    ],
  },

  // Tools Section
  tools: {
    title: "Professional Rendering Tools",
    subtitle: "Industry-Standard Software",
    description:
      "We use cutting-edge 3D rendering engines and modeling software for exceptional quality.",
    columns: "4",
    items: [
      { name: "Blender", icon: "🎨" },
      { name: "3ds Max", icon: "🏗️" },
      { name: "V-Ray", icon: "💡" },
      { name: "Corona Renderer", icon: "☀️" },
      { name: "SketchUp", icon: "📐" },
      { name: "Lumion", icon: "🌆" },
      { name: "Photoshop", icon: "🖼️" },
      { name: "After Effects", icon: "🎬" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Why Choose Codebrand",
    subtitle: "Our Advantages",
    description:
      "Our 3D rendering combines technical precision with artistic vision for stunning results.",
    columns: "3",
    items: [
      {
        icon: "🎯",
        title: "Photorealistic Quality",
        description:
          "Industry-leading rendering techniques create images indistinguishable from photography, perfect for presentations and marketing.",
      },
      {
        icon: "⚡",
        title: "Fast Delivery",
        description:
          "Efficient workflow and powerful rendering infrastructure ensure quick turnaround without sacrificing quality.",
      },
      {
        icon: "🔄",
        title: "Unlimited Revisions",
        description:
          "We work with you until you're completely satisfied. Revisions are included to ensure your vision is realized.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to See Your Vision in ",
    titleHighlight: "3D?",
    description:
      "Let's transform your blueprints, sketches, or concepts into photorealistic 3D visualizations that impress clients and accelerate sales. Get your custom quote today.",
    ctaPrimary: "Request a Quote",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View All Services",
    ctaSecondaryUrl: "/services",
    features: "Fast turnaround | Unlimited revisions | Photorealistic quality",
  },

  // Related Services for internal linking
  relatedServicesKey: "3d-rendering",

  // Optional sections
  showWhyUs: true,
  showFaq: true,
  showTrustBadges: true,
  showTestimonials: true,
};
