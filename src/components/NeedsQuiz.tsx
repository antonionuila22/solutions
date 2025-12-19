import { useState, type ReactNode } from "react";

interface Question {
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

const questions: Question[] = [
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

type ResultType =
  | "website"
  | "ecommerce-basic"
  | "ecommerce-advanced"
  | "webapp"
  | "enterprise"
  | null;

interface ResultContent {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  priceRange: string;
  timeline: string;
  color: string;
  icon: ReactNode;
  plan?: string;
}

export default function NeedsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ website: 0, webapp: 0, ecommerce: 0 });
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (isAnimating) return;

    setSelectedOption(optionIndex);
    const option = questions[currentQuestion].options[optionIndex];

    setIsAnimating(true);

    setTimeout(() => {
      setScores((prev) => ({
        website: prev.website + option.websiteScore,
        webapp: prev.webapp + option.webappScore,
        ecommerce: prev.ecommerce + option.ecommerceScore,
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
      setIsAnimating(false);
    }, 300);
  };

  const getResult = (): ResultType => {
    const { website, webapp, ecommerce } = scores;
    const total = website + webapp + ecommerce;

    // Calculate percentages
    const websitePercent = (website / total) * 100;
    const webappPercent = (webapp / total) * 100;
    const ecommercePercent = (ecommerce / total) * 100;

    // Determine result based on dominant score
    if (websitePercent >= 50) {
      return "website";
    }

    if (ecommercePercent >= 40) {
      if (webapp >= 8) {
        return "ecommerce-advanced";
      }
      return "ecommerce-basic";
    }

    if (webappPercent >= 40) {
      if (webapp >= 15) {
        return "enterprise";
      }
      return "webapp";
    }

    // Mixed result - default to webapp if scores are close
    if (ecommerce > website) {
      return "ecommerce-basic";
    }

    return "website";
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ website: 0, webapp: 0, ecommerce: 0 });
    setShowResult(false);
    setSelectedOption(null);
  };

  const result = getResult();

  const resultContent: Record<NonNullable<ResultType>, ResultContent> = {
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
      icon: (
        <svg
          className="w-12 h-12 text-cyan-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
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
      icon: (
        <svg
          className="w-12 h-12 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
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
      icon: (
        <svg
          className="w-12 h-12 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
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
      icon: (
        <svg
          className="w-12 h-12 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
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
      icon: (
        <svg
          className="w-12 h-12 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  };

  if (showResult && result) {
    const content = resultContent[result];
    const colorClasses = {
      cyan: {
        bg: "bg-cyan-500/20",
        border: "border-cyan-500/30",
        text: "text-cyan-400",
        badge: "bg-cyan-500",
      },
      orange: {
        bg: "bg-orange-500/20",
        border: "border-orange-500/30",
        text: "text-orange-400",
        badge: "bg-orange-500",
      },
      purple: {
        bg: "bg-purple-500/20",
        border: "border-purple-500/30",
        text: "text-purple-400",
        badge: "bg-purple-500",
      },
    };
    const colors = colorClasses[content.color as keyof typeof colorClasses];

    return (
      <div className="animate-fadeIn">
        <div className="bg-slate-800/50 rounded-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="mb-4 flex justify-center">{content.icon}</div>
            <div
              className={`inline-block px-3 py-1 ${colors.badge} text-white text-xs font-bold rounded-full mb-3`}
            >
              Our Recommendation
            </div>
            <h4
              className={`text-2xl sm:text-3xl font-bold ${colors.text} mb-2`}
            >
              {content.title}
            </h4>
            <p className="text-slate-400 text-sm">{content.subtitle}</p>
          </div>

          <p className="text-slate-300 mb-6 text-center max-w-2xl mx-auto leading-relaxed">
            {content.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-w-xl mx-auto">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-slate-400"
              >
                <svg
                  className={`w-4 h-4 ${colors.text} flex-shrink-0`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div
            className={`${colors.bg} ${colors.border} border rounded-xl p-4 mb-6 max-w-md mx-auto`}
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-slate-400 text-xs mb-1">Investment</p>
                <p className={`font-bold ${colors.text}`}>
                  {content.priceRange}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Timeline</p>
                <p className={`font-bold ${colors.text}`}>{content.timeline}</p>
              </div>
            </div>
            {content.plan && (
              <p className="text-center text-slate-500 text-xs mt-3 pt-3 border-t border-slate-700">
                {content.plan}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              Get a Free Quote
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="/quoter"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Build Custom Quote
            </a>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={resetQuiz}
              className="text-slate-500 hover:text-slate-400 text-sm underline transition-colors"
            >
              Retake assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div
        className={`transition-opacity duration-300 ${isAnimating ? "opacity-50" : "opacity-100"}`}
      >
        <h4 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          {question.question}
        </h4>
        {question.helpText && (
          <p className="text-slate-400 text-sm mb-6">{question.helpText}</p>
        )}

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnimating}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedOption === index
                  ? "border-orange-500 bg-orange-500/20"
                  : "border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
              } ${isAnimating ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedOption === index
                      ? "border-orange-500 bg-orange-500"
                      : "border-slate-500"
                  }`}
                >
                  {selectedOption === index && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-slate-200 text-sm sm:text-base">
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
