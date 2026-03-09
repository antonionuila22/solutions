export interface Question {
  id: number;
  question: string;
  helpText?: string;
  options: {
    text: string;
    websiteScore: number;
    webappScore: number;
    ecommerceScore: number;
  }[];
}

export type ResultType =
  | "website"
  | "ecommerce-basic"
  | "ecommerce-advanced"
  | "webapp"
  | "enterprise"
  | null;

export interface ResultContentData {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  priceRange: string;
  timeline: string;
  color: string;
  plan?: string;
}

export const SCORING = {
  WEBSITE_THRESHOLD: 50,
  ECOMMERCE_THRESHOLD: 40,
  WEBAPP_THRESHOLD: 40,
  ADVANCED_WEBAPP_SCORE: 15,
  ADVANCED_ECOMMERCE_SCORE: 8,
} as const;

export const questions: Question[] = [
  {
    id: 1,
    question: "What is the main purpose of your project?",
    helpText: "Think about what visitors will primarily do on your site.",
    options: [
      {
        text: "Display information about my business, services, or portfolio",
        websiteScore: 3,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Sell products online with a shopping cart and checkout",
        websiteScore: 0,
        webappScore: 1,
        ecommerceScore: 3,
      },
      {
        text: "Let users log in, manage data, or complete tasks",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 0,
      },
      {
        text: "Show a catalog of products/services (orders via WhatsApp/email)",
        websiteScore: 2,
        webappScore: 0,
        ecommerceScore: 1,
      },
    ],
  },
  {
    id: 2,
    question: "Will users need to create accounts and log in?",
    helpText: "Consider if users need personalized experiences or saved data.",
    options: [
      {
        text: "No — visitors just browse freely without accounts",
        websiteScore: 3,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Optional — for order history or wishlists only",
        websiteScore: 0,
        webappScore: 1,
        ecommerceScore: 2,
      },
      {
        text: "Yes — users need accounts with personal dashboards",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 1,
      },
      {
        text: "Yes — multiple user types (admin, staff, customers)",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 2,
      },
    ],
  },
  {
    id: 3,
    question: "How will you handle payments or transactions?",
    helpText: "Think about how money will flow through your platform.",
    options: [
      {
        text: "No payments needed — just information or contact forms",
        websiteScore: 3,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Simple payment links (PayPal, Stripe) or deposits",
        websiteScore: 2,
        webappScore: 0,
        ecommerceScore: 1,
      },
      {
        text: "Full shopping cart with checkout, shipping, and taxes",
        websiteScore: 0,
        webappScore: 1,
        ecommerceScore: 3,
      },
      {
        text: "Recurring payments, subscriptions, or complex billing",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 2,
      },
    ],
  },
  {
    id: 4,
    question: "How much will your content change based on who views it?",
    helpText:
      "Static means everyone sees the same; dynamic means personalized content.",
    options: [
      {
        text: "Same content for everyone — static pages",
        websiteScore: 3,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Mostly static, but I'll update a blog or news section",
        websiteScore: 2,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Product catalogs that I manage, but same for all visitors",
        websiteScore: 1,
        webappScore: 0,
        ecommerceScore: 2,
      },
      {
        text: "Each user sees different data based on their account",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 1,
      },
    ],
  },
  {
    id: 5,
    question: "Do you need to manage inventory, bookings, or complex data?",
    helpText:
      "Consider if you need to track stock, appointments, or business operations.",
    options: [
      {
        text: "No — just display information and receive contact inquiries",
        websiteScore: 3,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Basic product catalog (I'll manage stock manually)",
        websiteScore: 1,
        webappScore: 0,
        ecommerceScore: 2,
      },
      {
        text: "Automatic inventory tracking and stock updates",
        websiteScore: 0,
        webappScore: 2,
        ecommerceScore: 3,
      },
      {
        text: "Bookings, appointments, or complex scheduling system",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 0,
      },
    ],
  },
  {
    id: 6,
    question: "Will you need integrations with other tools or services?",
    helpText:
      "Think about connecting to CRMs, email marketing, accounting, etc.",
    options: [
      {
        text: "No — standalone site with basic contact form",
        websiteScore: 3,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Basic — embed a calendar (Calendly) or chat widget",
        websiteScore: 2,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Moderate — connect to email marketing or payment gateway",
        websiteScore: 1,
        webappScore: 1,
        ecommerceScore: 2,
      },
      {
        text: "Advanced — CRM, ERP, shipping APIs, custom automations",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 2,
      },
    ],
  },
  {
    id: 7,
    question: "Do you need an admin panel to manage the system?",
    helpText:
      "Consider if you or staff need a back-office to manage operations.",
    options: [
      {
        text: "No — or just a simple CMS to edit text and images",
        websiteScore: 3,
        webappScore: 0,
        ecommerceScore: 0,
      },
      {
        text: "Basic — add/edit products, view orders",
        websiteScore: 0,
        webappScore: 1,
        ecommerceScore: 2,
      },
      {
        text: "Advanced — manage users, analytics, reports, settings",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 2,
      },
      {
        text: "Custom dashboard with specific business workflows",
        websiteScore: 0,
        webappScore: 3,
        ecommerceScore: 1,
      },
    ],
  },
];

export const resultContent: Record<NonNullable<ResultType>, ResultContentData> = {
  website: {
    title: "Professional Website",
    subtitle: "Informational / Brochure Site",
    description:
      "Based on your answers, a professional website is the perfect solution. You need to display information, showcase your services, and receive inquiries — without complex user accounts or transactions.",
    features: [
      "Responsive design for all devices",
      "SEO optimization included",
      "Contact forms with validation",
      "CMS for easy content updates",
      "Fast loading performance",
    ],
    priceRange: "$550 - $3,000",
    timeline: "1-3 weeks",
    color: "cyan",
  },
  "ecommerce-basic": {
    title: "E-commerce Store",
    subtitle: "Basic to Intermediate Online Store",
    description:
      "You need an online store to sell products with shopping cart and checkout. This includes product management, payment processing, and order tracking — perfect for small to medium catalogs.",
    features: [
      "Product catalog with variants",
      "Shopping cart & secure checkout",
      "Payment gateway integration",
      "Order management system",
      "Inventory tracking",
      "Customer accounts (optional)",
    ],
    priceRange: "$1,500 - $3,800",
    timeline: "One-time project",
    color: "orange",
    plan: "Or Growth plan ($4.2k/mo) for ongoing development",
  },
  "ecommerce-advanced": {
    title: "Advanced E-commerce Platform",
    subtitle: "Full-Featured Online Store",
    description:
      "Your requirements indicate a robust e-commerce platform with advanced features like complex inventory, CRM integrations, multiple user roles, and sophisticated business logic. This is best built progressively.",
    features: [
      "Large product catalog management",
      "Advanced inventory & variants",
      "CRM/ERP integrations",
      "Custom admin dashboard",
      "Analytics & reporting",
      "Multi-user permissions",
      "Continuous improvements",
    ],
    priceRange: "$4,200 - $7,500/month",
    timeline: "6-month minimum",
    color: "purple",
    plan: "Growth ($4.2k/mo) or Enterprise ($7.5k/mo) plan",
  },
  webapp: {
    title: "Custom Web Application",
    subtitle: "Interactive Platform / Software",
    description:
      "Your project requires a full web application with user authentication, personalized dashboards, data management, and custom business logic. Web apps are built progressively — improving and adding features month by month.",
    features: [
      "User authentication system",
      "Personalized user dashboards",
      "Custom database design",
      "Business logic & workflows",
      "API integrations",
      "Admin back-office panel",
      "Continuous feature development",
    ],
    priceRange: "$4,200 - $7,500/month",
    timeline: "6-month minimum",
    color: "orange",
    plan: "Growth ($4.2k/mo) or Enterprise ($7.5k/mo) plan",
  },
  enterprise: {
    title: "Enterprise Web Application",
    subtitle: "Complex Platform / SaaS",
    description:
      "Your requirements indicate a complex, enterprise-grade application with advanced features, multiple integrations, sophisticated user management, and custom workflows. Enterprise apps evolve continuously with dedicated resources.",
    features: [
      "Complete design system",
      "Full-stack development",
      "Complex API integrations",
      "Custom admin dashboard",
      "Advanced user roles & permissions",
      "Real-time functionality",
      "Technical documentation",
      "Ongoing feature expansion",
    ],
    priceRange: "$7,500/month",
    timeline: "6-month minimum",
    color: "purple",
    plan: "Enterprise plan with dedicated designer + senior dev",
  },
};
