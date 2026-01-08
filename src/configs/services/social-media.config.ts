/**
 * Social Media Service Page Configuration
 * Configuration for social media marketing services using ServicePageTemplate
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const socialMediaConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "Social Media Design Services | Content & Graphics - Codebrand",
    description:
      "Professional social media design services including custom graphics, post templates, stories, reels covers, and visual content creation for all platforms.",
    keywords:
      "social media design, social media graphics, social media content, Instagram graphics, Facebook posts design, social media templates, post design, story design, social media visual content, brand graphics",
    image: "/photos/bannercodebrand.webp",
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "Social Media Marketing Services",
    "Professional social media marketing services including strategy development, content creation, community management, paid social advertising, influencer marketing, and analytics.",
    "Social Media Marketing Services",
    [
      {
        name: "Social Media Strategy",
        description: "Comprehensive social media strategy development aligned with business objectives",
      },
      {
        name: "Content Creation",
        description: "Engaging social media content including posts, graphics, videos, and stories",
      },
      {
        name: "Community Management",
        description: "Active community engagement and relationship building on social platforms",
      },
      {
        name: "Paid Social Advertising",
        description: "Strategic paid advertising campaigns on Facebook, Instagram, LinkedIn, and TikTok",
      },
      {
        name: "Influencer Marketing",
        description: "Influencer partnerships and campaign management for brand amplification",
      },
      {
        name: "Social Media Analytics",
        description: "Performance tracking, audience insights, and detailed social media reporting",
      },
    ]
  ),

  // Hero Section
  hero: {
    badge: "Social Media Design",
    title: "Stand Out",
    titleHighlight: "On Social Media",
    description:
      "Professional social media design that makes your brand stand out. Custom graphics, templates, and visual content that capture attention and maintain brand consistency across all platforms.",
    ctaPrimary: "Get Design Quote",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View Packages",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "500+", label: "Designs Delivered", sublabel: "Monthly Average" },
      { value: "50+", label: "Brands Served", sublabel: "Across Industries" },
      { value: "3", label: "Design Packages", sublabel: "10, 30, 60 Posts/mo" },
    ],
  },

  // Services Section
  services: {
    title: "Social Media Design Packages",
    subtitle: "Visual Content Creation",
    description:
      "We design professional social media content that aligns with your brand. You handle posting and strategy - we handle the visuals. Note: We provide design only, not account management or posting.",
    columns: "3",
    items: [
      {
        icon: "/icons/redes-sociales.webp",
        title: "Social Media Strategy",
        description:
          "Develop comprehensive strategies aligned with your business goals and target audience across all platforms.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/target-focus-svgrepo-com.svg",
        title: "Content Creation",
        description:
          "Craft engaging posts, graphics, videos, and stories that capture attention and drive engagement.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/creativity-svgrepo-com.svg",
        title: "Community Management",
        description:
          "Build and nurture your online community with timely responses and authentic engagement.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/talk-talk-svgrepo-com.svg",
        title: "Paid Social Advertising",
        description:
          "Create and optimize paid campaigns on Facebook, Instagram, LinkedIn, and TikTok for maximum ROI.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/horn-marketing-trumpet-svgrepo-com.svg",
        title: "Influencer Marketing",
        description:
          "Partner with influencers to amplify your brand message and reach new audiences authentically.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/balloon-business-svgrepo-com.svg",
        title: "Social Media Analytics",
        description:
          "Track performance metrics, audience insights, and campaign ROI with detailed reporting.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/data-graphics-analysis-svgrepo-com.svg",
        title: "Platform Management",
        description:
          "Full-service management of your social media accounts across Facebook, Instagram, LinkedIn, and more.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/operating-system-svgrepo-com.svg",
        title: "Social Listening",
        description:
          "Monitor brand mentions, competitor activity, and industry trends to inform strategy and respond quickly.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/response-monitoring-svgrepo-com.svg",
        title: "Viral Campaigns",
        description:
          "Create shareable content and campaigns designed to maximize reach and engagement organically.",
        learnMoreUrl: "#",
      },
    ],
  },

  // Tools Section
  tools: {
    title: "Professional Social Media Tools",
    subtitle: "Industry-Standard Platforms",
    description:
      "We use powerful social media management and analytics tools to maximize your social presence.",
    columns: "4",
    items: [
      { name: "Meta Business Suite", icon: "/icons/earth-planet-svgrepo-com.svg" },
      { name: "Hootsuite", icon: "🦉" },
      { name: "Buffer", icon: "📊" },
      { name: "Sprout Social", icon: "🌱" },
      { name: "Canva", icon: "🎨" },
      { name: "Later", icon: "📅" },
      { name: "BuzzSumo", icon: "📈" },
      { name: "Google Analytics", icon: "📉" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Why Choose Codebrand",
    subtitle: "Our Social Media Advantages",
    description:
      "Our social media strategies combine creativity, data analysis, and community building for maximum impact.",
    columns: "3",
    items: [
      {
        icon: "🎯",
        title: "Targeted Approach",
        description:
          "We create platform-specific strategies tailored to your audience, ensuring every post resonates and drives engagement.",
      },
      {
        icon: "📊",
        title: "Data-Driven Decisions",
        description:
          "Every campaign is optimized using real-time analytics, A/B testing, and performance metrics to maximize ROI.",
      },
      {
        icon: "🚀",
        title: "Consistent Growth",
        description:
          "Proven strategies that build authentic followers, increase engagement rates, and convert social traffic into customers.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to ",
    titleHighlight: "Grow Your Social Presence?",
    description:
      "Let's build a thriving social media presence that engages your audience and drives real business results. Get your custom social media strategy today.",
    ctaPrimary: "Get Free Strategy Session",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View All Services",
    ctaSecondaryUrl: "/services",
  },

  // Optional sections
  showWhyUs: true,
  showFaq: true,
};
