/**
 * Social Media Service Page Configuration
 * Configuration for social media marketing services using ServicePageTemplate
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const socialMediaConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "Social Media Marketing Services | Strategy & Management - Codebrand",
    description:
      "Professional social media marketing services including strategy development, content creation, community management, paid social advertising, influencer marketing, and analytics.",
    keywords:
      "social media marketing, social media management, social media strategy, content creation, community management, social media advertising, Facebook marketing, Instagram marketing, LinkedIn marketing, TikTok marketing, influencer marketing, social media analytics, paid social, social media campaigns",
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
    badge: "Social Media Excellence",
    title: "Amplify Your Brand",
    titleHighlight: "On Social Media",
    description:
      "Professional social media marketing that builds communities, drives engagement, and converts followers into customers. Strategic campaigns that deliver real business results.",
    ctaPrimary: "Get Social Strategy",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View Services",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "500K+", label: "Followers Grown", sublabel: "Across All Platforms" },
      { value: "250%", label: "Engagement Increase", sublabel: "Average Growth" },
      { value: "150+", label: "Brands Managed", sublabel: "Successfully" },
    ],
  },

  // Services Section
  services: {
    title: "Complete Social Media Solutions",
    subtitle: "Social Media Marketing Services",
    description:
      "From strategy to execution, we create and manage social media campaigns that build brand awareness, engage audiences, and drive conversions.",
    columns: "3",
    items: [
      {
        icon: "/icons/redes-sociales.png",
        title: "Social Media Strategy",
        description:
          "Develop comprehensive strategies aligned with your business goals and target audience across all platforms.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.png",
        title: "Content Creation",
        description:
          "Craft engaging posts, graphics, videos, and stories that capture attention and drive engagement.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.png",
        title: "Community Management",
        description:
          "Build and nurture your online community with timely responses and authentic engagement.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.png",
        title: "Paid Social Advertising",
        description:
          "Create and optimize paid campaigns on Facebook, Instagram, LinkedIn, and TikTok for maximum ROI.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.png",
        title: "Influencer Marketing",
        description:
          "Partner with influencers to amplify your brand message and reach new audiences authentically.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.png",
        title: "Social Media Analytics",
        description:
          "Track performance metrics, audience insights, and campaign ROI with detailed reporting.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.png",
        title: "Platform Management",
        description:
          "Full-service management of your social media accounts across Facebook, Instagram, LinkedIn, and more.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.png",
        title: "Social Listening",
        description:
          "Monitor brand mentions, competitor activity, and industry trends to inform strategy and respond quickly.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.png",
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
      { name: "Meta Business Suite", icon: "📘" },
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
