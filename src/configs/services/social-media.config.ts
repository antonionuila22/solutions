/**
 * Social Media Service Page Configuration
 * Configuration for social media marketing services using ServicePageTemplate
 * ENHANCED: Added process, case studies, testimonials, and related services
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const socialMediaConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "Social Media Design & Marketing Services | Content Creation - Codebrand",
    description:
      "Professional social media design and marketing services including custom graphics, post templates, stories, reels covers, content strategy, and visual content creation for all platforms.",
    keywords:
      "social media design, social media graphics, social media content, Instagram graphics, Facebook posts design, social media templates, post design, story design, social media visual content, brand graphics, social media marketing, social media management, content creation, social media strategy, Instagram marketing, Facebook marketing, TikTok marketing, LinkedIn marketing, social media agency, social media content creation",
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

  // Process Section
  process: {
    title: "Our Social Media",
    titleHighlight: "Process",
    subtitle: "A strategic approach that builds engaged communities and drives real business results.",
    steps: [
      {
        number: 1,
        title: "Brand Discovery",
        description: "We analyze your brand, audience, competitors, and goals to create a customized social media strategy.",
      },
      {
        number: 2,
        title: "Content Planning",
        description: "Develop content calendars, design templates, and establish brand voice guidelines for consistency.",
      },
      {
        number: 3,
        title: "Design & Creation",
        description: "Create scroll-stopping graphics, videos, and content optimized for each platform's specifications.",
      },
      {
        number: 4,
        title: "Delivery & Optimization",
        description: "Deliver content on schedule with performance tracking. Continuously optimize based on analytics.",
      },
    ],
  },

  // Case Studies Section
  caseStudies: {
    title: "Social Media",
    titleHighlight: "Success Stories",
    subtitle: "See how our social media strategies have helped brands grow their online presence.",
    items: [
      {
        category: "Retail",
        categoryColor: "text-blue-600",
        title: "Fashion Brand Growth",
        description: "Developed a complete social media strategy and content package that transformed a local boutique into a regional fashion destination.",
        metrics: [
          { value: "+450%", label: "Followers" },
          { value: "+280%", label: "Engagement" },
          { value: "+180%", label: "Online Sales" },
        ],
        gradientFrom: "from-blue-600",
        gradientTo: "to-blue-800",
      },
      {
        category: "Restaurant",
        categoryColor: "text-green-600",
        title: "Restaurant Social Revival",
        description: "Created mouth-watering food content and promotional graphics that drove significant foot traffic increase.",
        metrics: [
          { value: "+320%", label: "Engagement" },
          { value: "+85%", label: "Reservations" },
          { value: "50K", label: "New Followers" },
        ],
        gradientFrom: "from-green-600",
        gradientTo: "to-green-800",
      },
      {
        category: "B2B Tech",
        categoryColor: "text-purple-600",
        title: "SaaS LinkedIn Strategy",
        description: "Developed thought leadership content and professional graphics that established the brand as an industry authority.",
        metrics: [
          { value: "+200%", label: "Lead Gen" },
          { value: "15K", label: "LinkedIn Followers" },
          { value: "+90%", label: "Inbound Interest" },
        ],
        gradientFrom: "from-purple-600",
        gradientTo: "to-purple-800",
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
      { name: "Meta Business Suite", icon: "📱" },
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

  // Related Services for internal linking
  relatedServicesKey: "social-media",

  // Optional sections
  showWhyUs: true,
  showFaq: true,
  showTrustBadges: true,
  showTestimonials: true,
};
