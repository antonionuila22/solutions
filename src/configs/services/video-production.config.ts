/**
 * Video Production Service Page Configuration
 * Configuration for video production and editing services using ServicePageTemplate
 * ENHANCED: Added process, case studies, testimonials, and related services
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const videoProductionConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "Video Production & Editing Services | Professional Videography - Codebrand",
    description:
      "Professional video production and editing services including corporate videos, social media content, commercials, product demos, motion graphics, color grading, and event coverage. High-quality video content that drives results.",
    keywords:
      "video production, video editing, corporate videos, commercial videos, social media videos, product videos, motion graphics, color grading, video marketing, promotional videos, explainer videos, YouTube videos, video content creation, professional videography, video production company, video editing services, video post-production, video production agency, corporate video production, promotional video production, video content strategy",
    image: "/photos/bannercodebrand.webp",
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "Video Production and Editing Services",
    "Professional video production and editing services including corporate videos, social media content, commercials, product demos, motion graphics, color grading, and event coverage.",
    "Video Production Services",
    [
      {
        name: "Corporate Videos",
        description: "Professional corporate video production including presentations, testimonials, and communications",
      },
      {
        name: "Social Media Content",
        description: "Short-form video content optimized for Instagram, TikTok, YouTube Shorts, and Facebook",
      },
      {
        name: "Commercial Advertising",
        description: "Professional video commercials and advertising content for all platforms",
      },
      {
        name: "Motion Graphics",
        description: "Dynamic animated graphics, titles, and visual effects for video content",
      },
      {
        name: "Color Grading",
        description: "Professional color correction and grading for cinematic video quality",
      },
    ]
  ),

  // Hero Section
  hero: {
    badge: "Video Production Excellence",
    title: "Create Videos That",
    titleHighlight: "Captivate & Convert",
    description:
      "Professional video production and editing that tells your story, engages audiences, and drives results. From concept to final cut, we create video content that stands out.",
    ctaPrimary: "Start Your Project",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View Our Work",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "500+", label: "Videos Produced", sublabel: "Successfully Delivered" },
      { value: "4K", label: "Ultra HD Quality", sublabel: "Cinematic Results" },
      { value: "100%", label: "Client Satisfaction", sublabel: "Proven Excellence" },
    ],
  },

  // Services Section
  services: {
    title: "Complete Video Production Services",
    subtitle: "Video Production & Editing",
    description:
      "From pre-production planning to final delivery, we create professional video content for every platform and purpose.",
    columns: "3",
    items: [
      {
        icon: "/icons/edicion-de-video.webp",
        title: "Corporate Videos",
        description:
          "Professional company presentations, testimonials, and corporate communications that elevate your brand image.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/case-ppt-svgrepo-com.svg",
        title: "Social Media Content",
        description:
          "Eye-catching short-form videos optimized for Instagram Reels, TikTok, YouTube Shorts, and Facebook.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.webp",
        title: "Commercial Advertising",
        description:
          "Compelling video ads that capture attention, tell your story, and drive conversions across all platforms.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/horn-marketing-trumpet-svgrepo-com.svg",
        title: "Product Demos",
        description:
          "Showcase your products with high-quality demos that highlight features and benefits effectively.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/balloon-business-svgrepo-com.svg",
        title: "Event Coverage",
        description:
          "Capture and edit event footage into engaging highlight reels and full-length productions.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/earth-planet-svgrepo-com.svg",
        title: "Explainer Videos",
        description:
          "Simplify complex concepts with clear, engaging explainer videos that educate and convert viewers.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/light-bulb-idea-people-svgrepo-com.svg",
        title: "YouTube Content",
        description:
          "Full-service YouTube video production including editing, thumbnails, and channel optimization.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/edicion-de-video.webp",
        title: "Motion Graphics",
        description:
          "Dynamic animated graphics, lower thirds, titles, and transitions that enhance your video content.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/animacion.webp",
        title: "Color Grading",
        description:
          "Professional color correction and grading to achieve cinematic looks and consistent branding.",
        learnMoreUrl: "#",
      },
    ],
  },

  // Process Section
  process: {
    title: "Our Video Production",
    titleHighlight: "Process",
    subtitle: "A streamlined workflow that delivers high-quality videos efficiently.",
    steps: [
      {
        number: 1,
        title: "Pre-Production",
        description: "Script development, storyboarding, location scouting, and production planning. We prepare everything before cameras roll.",
      },
      {
        number: 2,
        title: "Production",
        description: "Professional filming with cinema-grade equipment, expert lighting, and quality audio capture. On-location or in-studio.",
      },
      {
        number: 3,
        title: "Post-Production",
        description: "Expert editing, color grading, sound design, motion graphics, and visual effects to create polished final content.",
      },
      {
        number: 4,
        title: "Delivery & Optimization",
        description: "Final review, revisions, and delivery in all required formats optimized for web, social, and broadcast.",
      },
    ],
  },

  // Case Studies Section
  caseStudies: {
    title: "Video Production",
    titleHighlight: "Success Stories",
    subtitle: "See how our videos have helped brands tell their stories and achieve their goals.",
    items: [
      {
        category: "Corporate",
        categoryColor: "text-blue-600",
        title: "Tech Company Brand Video",
        description: "Produced a cinematic brand story video that captured the company culture and mission, used for recruiting and investor presentations.",
        metrics: [
          { value: "+200%", label: "Applications" },
          { value: "1.2M", label: "LinkedIn Views" },
          { value: "95%", label: "Completion Rate" },
        ],
        gradientFrom: "from-blue-600",
        gradientTo: "to-blue-800",
      },
      {
        category: "E-commerce",
        categoryColor: "text-green-600",
        title: "Product Launch Campaign",
        description: "Created a series of product videos for social media launch that generated massive engagement and sales.",
        metrics: [
          { value: "+340%", label: "Sales Week 1" },
          { value: "5M+", label: "Social Views" },
          { value: "+180%", label: "ROAS" },
        ],
        gradientFrom: "from-green-600",
        gradientTo: "to-green-800",
      },
      {
        category: "Healthcare",
        categoryColor: "text-purple-600",
        title: "Medical Facility Tour",
        description: "Produced virtual tour and testimonial videos for a healthcare network, improving patient trust and appointment bookings.",
        metrics: [
          { value: "+75%", label: "Appointments" },
          { value: "45%", label: "Longer Site Visits" },
          { value: "+60%", label: "Patient Trust" },
        ],
        gradientFrom: "from-purple-600",
        gradientTo: "to-purple-800",
      },
    ],
  },

  // Tools Section
  tools: {
    title: "Professional Video Production Tools",
    subtitle: "Industry-Standard Software",
    description:
      "We use cutting-edge video production and editing tools for cinematic-quality results.",
    columns: "4",
    items: [
      { name: "Adobe Premiere Pro", icon: "🎬" },
      { name: "Adobe After Effects", icon: "🎞️" },
      { name: "DaVinci Resolve", icon: "🎨" },
      { name: "Final Cut Pro", icon: "✂️" },
      { name: "Cinema 4D", icon: "🎭" },
      { name: "Adobe Audition", icon: "🎵" },
      { name: "Photoshop", icon: "🖼️" },
      { name: "Illustrator", icon: "✏️" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Why Choose Codebrand",
    subtitle: "Our Video Production Advantages",
    description:
      "Our video production combines creative storytelling with technical excellence for outstanding results.",
    columns: "3",
    items: [
      {
        icon: "🎥",
        title: "Cinematic Quality",
        description:
          "Hollywood-grade editing techniques, color grading, and post-production that make your videos stand out.",
      },
      {
        icon: "⚡",
        title: "Fast Turnaround",
        description:
          "Efficient workflow and project management ensures your videos are delivered on time without compromising quality.",
      },
      {
        icon: "🎯",
        title: "Platform Optimization",
        description:
          "Videos optimized for each platform's specifications, ensuring maximum engagement and performance.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to ",
    titleHighlight: "Create Amazing Videos?",
    description:
      "Let's bring your vision to life with professional video production that engages audiences and drives results. Get your free consultation today.",
    ctaPrimary: "Get Free Consultation",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View All Services",
    ctaSecondaryUrl: "/services",
  },

  // Related Services for internal linking
  relatedServicesKey: "video-production",

  // Optional sections
  showWhyUs: true,
  showFaq: true,
  showTrustBadges: true,
  showTestimonials: true,
};
