// Pricing data for the Quoter component
// All prices are in USD, ISR (12.5%) is calculated separately

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  isStartingPrice?: boolean;
  minQuantity: number;
  maxQuantity: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  options: ServiceOption[];
}

export interface MonthlyPlan {
  id: string;
  name: string;
  price: number;
  hoursPerWeek: number;
  hoursPerDay: number;
  description: string;
  features: string[];
  highlight?: boolean;
}

// ISR Tax Rate
export const ISR_RATE = 0.125; // 12.5%

// Monthly Plans (Subscription-based)
// IMPORTANT: 6-month minimum commitment, 2-month cancellation notice required
export const monthlyPlans: MonthlyPlan[] = [
  {
    id: "essential",
    name: "Essential",
    price: 1800,
    hoursPerWeek: 20,
    hoursPerDay: 4,
    description: "Perfect for businesses launching their digital presence.",
    features: [
      "20 productive hours per week (4h/day × 5 days)",
      "Professional website (3-5 pages)",
      "UX/UI design in Figma (responsive)",
      "Modern frontend development (React/Astro)",
      "Basic CMS (WordPress or Webflow)",
      "Contact forms with validation",
      "Hosting setup assistance (hosting cost separate)",
      "1 revision round per month",
      "Email support (48h response)",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 4200,
    hoursPerWeek: 40,
    hoursPerDay: 8,
    description: "For businesses ready to scale with custom solutions.",
    highlight: true,
    features: [
      "40 productive hours per week (8h/day × 5 days)",
      "Custom website (5-10 pages)",
      "Advanced UX/UI design + prototype",
      "Modern tech stack (React/Next.js/Astro)",
      "Headless CMS or Webflow",
      "API integrations (CRM, email, payments)",
      "Basic backend + database (Supabase/Turso)",
      "Custom animations & micro-interactions",
      "2 revision rounds per month",
      "Priority support (24h response)",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 7500,
    hoursPerWeek: 40,
    hoursPerDay: 8,
    description: "Complete web applications and advanced e-commerce.",
    features: [
      "40 productive hours per week (8h/day × 5 days)",
      "Full web app or advanced e-commerce",
      "Complete design system in Figma",
      "Full-stack development (Next.js + Supabase)",
      "Complex API integrations",
      "E-commerce with payments & inventory",
      "Custom admin dashboard",
      "Dedicated designer + senior developer",
      "4 revision rounds per month",
      "Same-day support",
      "Technical documentation included",
    ],
  },
];

// Service Categories for One-Time Projects
export const serviceCategories: ServiceCategory[] = [
  {
    id: "branding",
    name: "Branding & Graphic Design",
    icon: "palette",
    options: [
      {
        id: "branding-basic",
        name: "Basic Visual Identity",
        description: "Logo + palette + typography + 1 visual application + basic brandbook",
        price: 390,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "branding-professional",
        name: "Professional Branding",
        description: "All basic + 4 visual applications + identity system + logo variations",
        price: 690,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "branding-corporate",
        name: "Corporate Branding",
        description: "Professional branding + extended graphic line + stationery + templates",
        price: 950,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: "web-development",
    name: "Web Development",
    icon: "code",
    options: [
      {
        id: "web-standard",
        name: "Standard Page",
        description: "Up to 8 sections, responsive design, basic form",
        price: 550,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 15,
      },
      {
        id: "web-cms",
        name: "CMS-Editable Page",
        description: "Editable via WordPress, Webflow",
        price: 550,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 15,
      },
      {
        id: "web-integrations",
        name: "Page with Integrations",
        description: "API connections, dynamic forms, filters, data handling",
        price: 700,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 10,
      },
      {
        id: "web-advanced",
        name: "Advanced Page",
        description: "Custom animations, multiple integrations, React/Astro components",
        price: 900,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 10,
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: "shopping-cart",
    options: [
      {
        id: "ecommerce-basic",
        name: "Basic Store",
        description: "Simple products, no variants, up to 10 items",
        price: 1500,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "ecommerce-intermediate",
        name: "Intermediate Store",
        description: "Up to 50 products, variants, coupons, analytics",
        price: 2500,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "ecommerce-advanced",
        name: "Advanced Store",
        description: "Large catalogs, CRM/ERP integrations, blog",
        price: 3800,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "ecommerce-custom",
        name: "Custom Store",
        description: "Fully tailored build, animations, global sales features",
        price: 5200,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: "seo",
    name: "SEO Optimization",
    icon: "search",
    options: [
      {
        id: "seo-basic",
        name: "Basic SEO",
        description: "Audit + essential fixes (metadata, structure, sitemap)",
        price: 320,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "seo-intermediate",
        name: "Intermediate SEO",
        description: "Basic + performance optimization + 5 key pages",
        price: 490,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "seo-advanced",
        name: "Advanced SEO",
        description: "All above + content strategy, internal linking, 10+ pages",
        price: 750,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: "animation",
    name: "Animation 2D & 3D",
    icon: "film",
    options: [
      {
        id: "animation-intro",
        name: "Animated Intro/Outro",
        description: "Animated logo in 2D or 3D for social media or presentations",
        price: 320,
        minQuantity: 1,
        maxQuantity: 5,
      },
      {
        id: "animation-2d-basic",
        name: "Basic 2D Animation",
        description: "Simple motion graphics up to 60 sec (text, icons, transitions)",
        price: 480,
        minQuantity: 1,
        maxQuantity: 5,
      },
      {
        id: "animation-2d-narrative",
        name: "Narrative 2D Animation",
        description: "Explainer or promo video with storytelling and characters",
        price: 650,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 3,
      },
      {
        id: "animation-3d-basic",
        name: "Basic 3D Animation",
        description: "Product modeling + animation or simple scene (up to 30 sec)",
        price: 750,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 3,
      },
      {
        id: "animation-3d-advanced",
        name: "Advanced 3D Animation",
        description: "Cameras, textures, lights, detailed 3D environments (60-90 sec)",
        price: 1100,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 2,
      },
    ],
  },
  {
    id: "render3d",
    name: "3D Renderings",
    icon: "cube",
    options: [
      {
        id: "render-basic",
        name: "Basic Product Render",
        description: "White or transparent background, ideal for e-commerce",
        price: 390,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 20,
      },
      {
        id: "render-premium",
        name: "Premium Product Render",
        description: "Complex materials, stylized scene, shadows, reflections",
        price: 550,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 15,
      },
      {
        id: "render-technical",
        name: "Technical/Industrial Render",
        description: "High-precision geometry, technical textures, cutaways",
        price: 600,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 10,
      },
      {
        id: "render-interior",
        name: "Architectural Interior",
        description: "Full interior scenes with furniture, lighting, atmosphere",
        price: 750,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 10,
      },
      {
        id: "render-exterior",
        name: "Architectural Exterior",
        description: "Facades, natural/urban surroundings, ambient lighting",
        price: 850,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 10,
      },
    ],
  },
  {
    id: "ux-ui",
    name: "UX/UI Design",
    icon: "layout",
    options: [
      {
        id: "uxui-prototype",
        name: "Complete Figma Prototype",
        description: "Up to 8 sections per page, responsive, 1 revision round",
        price: 459,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: "photography",
    name: "Photography",
    icon: "camera",
    options: [
      {
        id: "photo-portrait",
        name: "Professional Portrait",
        description: "Ideal for LinkedIn, team profiles, or personal branding",
        price: 280,
        minQuantity: 1,
        maxQuantity: 10,
      },
      {
        id: "photo-product",
        name: "Product for E-commerce",
        description: "White background or styled shots for catalogs",
        price: 320,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 50,
      },
      {
        id: "photo-lifestyle",
        name: "Lifestyle / Personal Brand",
        description: "Creative session for social media and brand storytelling",
        price: 390,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 5,
      },
      {
        id: "photo-events",
        name: "Corporate Events",
        description: "Coverage of events, product launches, presentations",
        price: 580,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 3,
      },
      {
        id: "photo-campaign",
        name: "Full Visual Campaign",
        description: "Art direction + photography for key campaigns",
        price: 890,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 2,
      },
    ],
  },
  {
    id: "video",
    name: "Video Editing",
    icon: "video",
    options: [
      {
        id: "video-simple",
        name: "Simple Edit",
        description: "Basic cut + music + transitions (up to 60 seconds)",
        price: 320,
        minQuantity: 1,
        maxQuantity: 10,
      },
      {
        id: "video-social",
        name: "Dynamic Social Media Edit",
        description: "Reels, Shorts, TikToks with visual rhythm and branding",
        price: 380,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 20,
      },
      {
        id: "video-narrative",
        name: "Narrative Editing",
        description: "Explainers, interviews, or educational videos (2-5 min)",
        price: 520,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 5,
      },
      {
        id: "video-promo",
        name: "Full Promotional Video",
        description: "Storytelling, b-roll, animated text, brand-aligned edit",
        price: 750,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 3,
      },
      {
        id: "video-pitch",
        name: "Presentation / Pitch Video",
        description: "Business/investor video with motion design",
        price: 950,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 2,
      },
    ],
  },
  {
    id: "social-media",
    name: "Social Media Design",
    icon: "instagram",
    options: [
      {
        id: "social-10",
        name: "Social Media 10",
        description: "10 designs/month, visual components and support",
        price: 150,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "social-30",
        name: "Social Media 30",
        description: "30 designs/month, visual components and support",
        price: 320,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "social-60",
        name: "Social Media 60",
        description: "60 designs/month, visual components and support",
        price: 500,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: "data-entry",
    name: "Data Entry",
    icon: "database",
    options: [
      {
        id: "data-essential",
        name: "Essential Plan",
        description: "Up to 3,000 products/month, full-time assistant",
        price: 650,
        minQuantity: 1,
        maxQuantity: 1,
      },
      {
        id: "data-pro",
        name: "Pro Plan",
        description: "Up to 6,500 products/month, advanced catalog optimization",
        price: 1300,
        minQuantity: 1,
        maxQuantity: 1,
      },
    ],
  },
  {
    id: "promotional",
    name: "Promotional Products",
    icon: "gift",
    options: [
      {
        id: "promo-tshirt",
        name: "T-shirts (12 units min)",
        description: "Sublimation & DTF, 2-5 business days",
        price: 192, // 12 × $16
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 50,
      },
      {
        id: "promo-mugs",
        name: "Custom Mugs (12 units min)",
        description: "Sublimation print, 2-5 business days",
        price: 120, // 12 × $10
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 50,
      },
      {
        id: "promo-bags",
        name: "Tote Bags (12 units min)",
        description: "1 to 3 color screen print, 3-10 business days",
        price: 84, // 12 × $7
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 50,
      },
      {
        id: "promo-special",
        name: "Special Items",
        description: "Thermoses, notebooks, mousepads, stickers",
        price: 100,
        isStartingPrice: true,
        minQuantity: 1,
        maxQuantity: 20,
      },
    ],
  },
];

// Service Dependencies - what services require other services
export interface ServiceDependency {
  serviceId: string; // Category ID that triggers the dependency
  requiresId: string; // Category ID that is required
  message: string; // Message to show the user
  recommendedOptionId?: string; // Specific option to recommend
}

export const serviceDependencies: ServiceDependency[] = [
  {
    serviceId: "web-development",
    requiresId: "ux-ui",
    message: "Web Development requires UX/UI Design in Figma before development can begin.",
    recommendedOptionId: "uxui-prototype",
  },
  {
    serviceId: "ecommerce",
    requiresId: "ux-ui",
    message: "E-commerce requires UX/UI Design in Figma to define the store layout and user flow.",
    recommendedOptionId: "uxui-prototype",
  },
  {
    serviceId: "ecommerce",
    requiresId: "branding",
    message: "E-commerce works best with professional branding (logo, colors, typography) for a cohesive store identity.",
    recommendedOptionId: "branding-basic",
  },
  {
    serviceId: "social-media",
    requiresId: "branding",
    message: "Social Media Design requires your brand assets (logo, colors, fonts) to create consistent visuals.",
    recommendedOptionId: "branding-basic",
  },
  {
    serviceId: "video",
    requiresId: "branding",
    message: "Video Editing works best with brand assets for consistent visual identity in your videos.",
    recommendedOptionId: "branding-basic",
  },
  {
    serviceId: "animation",
    requiresId: "branding",
    message: "Animation projects benefit from having brand assets (logo, colors) for branded motion graphics.",
    recommendedOptionId: "branding-basic",
  },
];

// Helper function to get dependencies for selected services
export function getDependenciesForServices(selectedCategoryIds: string[]): ServiceDependency[] {
  return serviceDependencies.filter(
    (dep) =>
      selectedCategoryIds.includes(dep.serviceId) &&
      !selectedCategoryIds.includes(dep.requiresId)
  );
}

// Helper function to calculate total with ISR
export function calculateWithISR(subtotal: number): {
  subtotal: number;
  isr: number;
  total: number;
} {
  const isr = subtotal * ISR_RATE;
  const total = subtotal + isr;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    isr: Math.round(isr * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

// Helper function to format price
export function formatPrice(price: number, isStarting?: boolean): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return isStarting ? `From ${formatted}` : formatted;
}
