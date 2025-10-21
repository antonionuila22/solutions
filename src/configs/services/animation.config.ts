/**
 * Animation Service Page Configuration
 * Configuration for 2D and 3D Animation services using ServicePageTemplate
 */

import { createServiceSchema } from "../../utils/schema";
import type { ServicePageConfig } from "../../components/ServicePageTemplate.astro";

export const animationConfig: ServicePageConfig = {
  // SEO Configuration
  seo: {
    title: "2D & 3D Animation Services | Motion Graphics & Visual Effects - Codebrand",
    description:
      "Professional 2D and 3D animation services including motion graphics, character animation, product visualization, explainer videos, and visual effects. Bring your ideas to life with stunning animations.",
    keywords:
      "2D animation, 3D animation, motion graphics, character animation, product animation, explainer videos, logo animation, visual effects, VFX, whiteboard animation, animated explainer videos, kinetic typography, 3D character animation, product visualization, animation services, animated videos, motion design, 2D motion graphics, 3D modeling and animation, explainer animation, corporate animation, educational animation, social media animation, animated logo design",
    image: "/photos/bannercodebrand.webp",
  },

  // Schema.org Structured Data
  schema: createServiceSchema(
    "2D and 3D Animation Services",
    "Professional 2D and 3D animation services including motion graphics, character animation, product visualization, explainer videos, logo animation, and visual effects.",
    "Animation Services",
    [
      {
        name: "2D Motion Graphics",
        description: "Dynamic animated graphics and kinetic typography for videos and presentations",
      },
      {
        name: "3D Animation",
        description: "High-quality 3D character animation, product animations, and architectural walkthroughs",
      },
      {
        name: "Explainer Animations",
        description: "Engaging animated explainer videos that simplify complex concepts",
      },
      {
        name: "Visual Effects",
        description: "Professional VFX and compositing for enhanced video content",
      },
    ]
  ),

  // Hero Section
  hero: {
    badge: "Animation Excellence",
    title: "Bring Ideas to Life",
    titleHighlight: "With Stunning Animation",
    description:
      "Professional 2D and 3D animation that transforms concepts into captivating visual stories. From motion graphics to character animation, we create animations that engage and inspire.",
    ctaPrimary: "Start Your Animation Project",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "Explore Animation Services",
    ctaSecondaryUrl: "#services",
    stats: [
      { value: "300+", label: "Animations Created", sublabel: "Successfully Delivered" },
      { value: "60fps", label: "Smooth Playback", sublabel: "Ultra HD Quality" },
      { value: "100%", label: "Custom Made", sublabel: "Tailored to You" },
    ],
  },

  // Services Section
  services: {
    title: "Complete Animation Solutions",
    subtitle: "Animation Services",
    description:
      "From concept to final render, we create custom 2D and 3D animations that elevate your brand, explain complex ideas, and captivate your audience.",
    columns: "3",
    items: [
      {
        icon: "/icons/creativity-svgrepo-com.svg",
        title: "2D Motion Graphics",
        description:
          "Dynamic animated graphics, kinetic typography, and visual effects for videos and presentations.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/creativity-svgrepo-com.svg",
        title: "3D Animation",
        description:
          "High-quality 3D character animation, product animations, and architectural walkthroughs.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/modelo-3d.webp",
        title: "Explainer Animations",
        description:
          "Engaging animated explainer videos that simplify complex concepts and boost understanding.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/animacion.webp",
        title: "Logo Animation",
        description:
          "Bring your brand to life with animated logos and brand reveal sequences.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/creativity-svgrepo-com.svg",
        title: "Character Design & Rigging",
        description:
          "Create custom characters with full rigging for smooth, lifelike animation.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/animacion.webp",
        title: "Product Visualization",
        description:
          "Showcase products with stunning 3D animations that highlight features and benefits.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/balloon-business-svgrepo-com.svg",
        title: "Social Media Animations",
        description:
          "Eye-catching animated content optimized for Instagram, TikTok, and other social platforms.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/redes-sociales.webp",
        title: "Whiteboard Animation",
        description:
          "Engaging whiteboard-style animations perfect for educational and corporate content.",
        learnMoreUrl: "#",
      },
      {
        icon: "/icons/case-ppt-svgrepo-com.svg",
        title: "VFX & Compositing",
        description:
          "Professional visual effects and compositing to enhance your video content.",
        learnMoreUrl: "#",
      },
    ],
  },

  // Tools Section
  tools: {
    title: "Professional Animation Tools",
    subtitle: "Industry-Standard Software",
    description:
      "We use industry-leading animation software to create high-quality 2D and 3D content.",
    columns: "4",
    items: [
      { name: "Adobe After Effects", icon: "🎬" },
      { name: "Cinema 4D", icon: "🎭" },
      { name: "Blender", icon: "🎨" },
      { name: "Maya", icon: "🎯" },
      { name: "3ds Max", icon: "📐" },
      { name: "Houdini", icon: "⚡" },
      { name: "Illustrator", icon: "✏️" },
      { name: "Photoshop", icon: "🖼️" },
    ],
  },

  // Benefits Section
  benefits: {
    title: "Why Choose Codebrand",
    subtitle: "Our Advantages",
    description:
      "Our animation combines artistry, technical skill, and strategic thinking for maximum impact.",
    columns: "3",
    items: [
      {
        icon: "🎬",
        title: "Creative Storytelling",
        description:
          "We combine artistic vision with technical expertise to create animations that captivate audiences and communicate your message effectively.",
      },
      {
        icon: "🎨",
        title: "Versatile Styles",
        description:
          "From minimalist 2D motion graphics to photorealistic 3D animations, we adapt our style to match your brand and goals.",
      },
      {
        icon: "⭐",
        title: "Industry Standards",
        description:
          "Professional animation pipeline using industry-leading software and techniques for broadcast-quality results.",
      },
    ],
  },

  // CTA Section
  cta: {
    title: "Ready to ",
    titleHighlight: "Animate Your Vision?",
    description:
      "Let's create stunning animations that bring your ideas to life, engage your audience, and make your brand unforgettable. Start your animation project today.",
    ctaPrimary: "Get Started Now",
    ctaPrimaryUrl: "/contact",
    ctaSecondary: "View All Services",
    ctaSecondaryUrl: "/services",
  },

  // Optional sections
  showWhyUs: true,
  showFaq: true,
};
