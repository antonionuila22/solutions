import { useState, useMemo } from "react";
import {
  serviceCategories,
  monthlyPlans,
  calculateWithISR,
  formatPrice,
  ISR_RATE,
  getDependenciesForServices,
  type ServiceOption,
  type MonthlyPlan,
  type ServiceDependency,
} from "../data/quoter-pricing";

type TabType = "one-time" | "monthly";

interface SelectedService {
  categoryId: string;
  categoryName: string;
  option: ServiceOption;
  quantity: number;
}

// Icons component
const Icons = {
  palette: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  code: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  "shopping-cart": () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  film: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  ),
  cube: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  layout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  camera: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  video: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  instagram: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  database: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  gift: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  minus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  ),
  trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  alert: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  arrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
};

const getIcon = (iconName: string) => {
  const IconComponent = Icons[iconName as keyof typeof Icons];
  return IconComponent ? <IconComponent /> : null;
};

export default function Quoter() {
  const [activeTab, setActiveTab] = useState<TabType>("one-time");
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MonthlyPlan | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Calculate totals for one-time projects
  const oneTimeCalculation = useMemo(() => {
    const subtotal = selectedServices.reduce(
      (acc, service) => acc + service.option.price * service.quantity,
      0
    );
    return calculateWithISR(subtotal);
  }, [selectedServices]);

  // Calculate totals for monthly plan
  const monthlyCalculation = useMemo(() => {
    if (!selectedPlan) return { subtotal: 0, isr: 0, total: 0 };
    return calculateWithISR(selectedPlan.price);
  }, [selectedPlan]);

  // Calculate missing dependencies
  const missingDependencies = useMemo(() => {
    const selectedCategoryIds = [...new Set(selectedServices.map((s) => s.categoryId))];
    return getDependenciesForServices(selectedCategoryIds);
  }, [selectedServices]);

  // Add required service from dependency
  const addRequiredService = (dependency: ServiceDependency) => {
    const category = serviceCategories.find((c) => c.id === dependency.requiresId);
    if (!category) return;

    const option = dependency.recommendedOptionId
      ? category.options.find((o) => o.id === dependency.recommendedOptionId)
      : category.options[0];

    if (option) {
      addService(category.id, category.name, option);
    }
  };

  const addService = (categoryId: string, categoryName: string, option: ServiceOption) => {
    const existingIndex = selectedServices.findIndex(
      (s) => s.option.id === option.id
    );
    if (existingIndex >= 0) {
      // Increment quantity
      const updated = [...selectedServices];
      updated[existingIndex].quantity += 1;
      setSelectedServices(updated);
    } else {
      setSelectedServices([
        ...selectedServices,
        { categoryId, categoryName, option, quantity: 1 },
      ]);
    }
  };

  const updateQuantity = (optionId: string, delta: number) => {
    const updated = selectedServices
      .map((s) => {
        if (s.option.id === optionId) {
          const newQty = s.quantity + delta;
          const minQty = s.option.minQuantity;
          const maxQty = s.option.maxQuantity;

          // Check bounds
          if (newQty < minQty) return null; // Remove if below minimum
          if (newQty > maxQty) return s; // Don't exceed maximum

          return { ...s, quantity: newQty };
        }
        return s;
      })
      .filter(Boolean) as SelectedService[];
    setSelectedServices(updated);
  };

  const removeService = (optionId: string) => {
    setSelectedServices(selectedServices.filter((s) => s.option.id !== optionId));
  };

  const clearAll = () => {
    setSelectedServices([]);
    setSelectedPlan(null);
  };

  const handleContactRedirect = () => {
    const params = new URLSearchParams();

    if (activeTab === "one-time" && selectedServices.length > 0) {
      const servicesText = selectedServices
        .map((s) => `${s.categoryName}: ${s.option.name} (x${s.quantity})`)
        .join(", ");
      params.set("subject", "Quote Request - One-Time Projects");
      params.set("services", servicesText);
      params.set("total", `$${oneTimeCalculation.total.toLocaleString()} (incl. ISR)`);
    } else if (activeTab === "monthly" && selectedPlan) {
      params.set("subject", `Quote Request - ${selectedPlan.name} Plan`);
      params.set("services", `Monthly Plan: ${selectedPlan.name}`);
      params.set("total", `$${monthlyCalculation.total.toLocaleString()}/month (incl. ISR)`);
    }

    window.location.href = `/contact?${params.toString()}`;
  };

  const hasSelection = activeTab === "one-time"
    ? selectedServices.length > 0
    : selectedPlan !== null;

  const currentTotal = activeTab === "one-time"
    ? oneTimeCalculation
    : monthlyCalculation;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-xl p-1.5">
          <button
            onClick={() => setActiveTab("one-time")}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "one-time"
                ? "bg-white text-gray-900 shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            One-Time Projects
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "monthly"
                ? "bg-white text-gray-900 shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly Plans
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Services/Plans Selection */}
        <div className="lg:col-span-2">
          {activeTab === "one-time" ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Select Services
              </h3>
              {serviceCategories.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category.id ? null : category.id
                      )
                    }
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f48200]/20 to-[#007BFF]/20 flex items-center justify-center text-[#f48200]">
                        {getIcon(category.icon)}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedCategory === category.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedCategory === category.id && (
                    <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">
                      {(() => {
                        // Check if any option from this category is already selected
                        const selectedOptionInCategory = selectedServices.find(
                          (s) => s.categoryId === category.id
                        );
                        const lockedOptionId = selectedOptionInCategory?.option.id;

                        return category.options.map((option) => {
                          const isSelected = selectedServices.some(
                            (s) => s.option.id === option.id
                          );
                          // Option is locked if another option from same category is selected
                          const isLocked = lockedOptionId && lockedOptionId !== option.id;

                          return (
                            <div
                              key={option.id}
                              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                isLocked
                                  ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                                  : isSelected
                                  ? "border-[#f48200] bg-[#f48200]/5 cursor-pointer"
                                  : "border-gray-200 bg-white hover:border-[#007BFF]/50 cursor-pointer"
                              }`}
                              onClick={() => {
                                if (!isLocked) {
                                  addService(category.id, category.name, option);
                                }
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className={`font-semibold ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
                                      {option.name}
                                    </h4>
                                    {isLocked && (
                                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-500 rounded-full">
                                        Locked
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-sm mt-1 ${isLocked ? "text-gray-400" : "text-gray-600"}`}>
                                    {option.description}
                                  </p>
                                  {isLocked && (
                                    <p className="text-xs text-amber-600 mt-2">
                                      Remove "{selectedOptionInCategory?.option.name}" to select this option
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <span className={`font-bold ${isLocked ? "text-gray-400" : "text-[#007BFF]"}`}>
                                    {formatPrice(option.price, option.isStartingPrice)}
                                  </span>
                                  {!isLocked && option.maxQuantity > 1 && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      Max: {option.maxQuantity}
                                    </p>
                                  )}
                                  {isSelected && (
                                    <div className="mt-1">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f48200] text-white">
                                        <Icons.check />
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Select a Plan
              </h3>
              <div className="grid gap-4">
                {monthlyPlans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-[#f48200] bg-[#f48200]/5 shadow-lg"
                          : plan.highlight
                          ? "border-[#007BFF]/30 bg-white hover:border-[#007BFF]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-bold text-gray-900">
                              {plan.name}
                            </h4>
                            {plan.highlight && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-[#f48200] text-white rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {plan.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-gray-900">
                            ${plan.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">/month</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <span className="px-3 py-1 bg-[#007BFF]/10 text-[#007BFF] rounded-full font-medium">
                          {plan.hoursPerWeek}h/week
                        </span>
                        <span className="text-gray-600">
                          {plan.hoursPerDay}h/day × 5 days
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features.slice(1, 6).map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <span className="text-[#f48200] mt-0.5">
                              <Icons.check />
                            </span>
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 6 && (
                          <li className="text-sm text-gray-500 pl-6">
                            +{plan.features.length - 6} more features
                          </li>
                        )}
                      </ul>
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-[#f48200]/20">
                          <span className="inline-flex items-center gap-1 text-[#f48200] font-semibold text-sm">
                            <Icons.check /> Selected
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-[#007BFF] px-6 py-4">
              <h3 className="text-lg font-bold text-white">Quote Summary</h3>
              <p className="text-sm text-white/70">
                {activeTab === "one-time" ? "One-time payment" : "Monthly subscription"}
              </p>
            </div>

            <div className="p-6">
              {activeTab === "one-time" && selectedServices.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {selectedServices.map((service) => (
                    <div
                      key={service.option.id}
                      className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {service.option.name}
                        </p>
                        <p className="text-xs text-gray-500">{service.categoryName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(service.option.id, -1);
                            }}
                            disabled={service.quantity <= service.option.minQuantity}
                            className={`p-1.5 rounded-l-lg transition-colors ${
                              service.quantity <= service.option.minQuantity
                                ? "text-gray-300 cursor-not-allowed"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <Icons.minus />
                          </button>
                          <span className="px-2 text-sm font-medium min-w-[24px] text-center">
                            {service.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(service.option.id, 1);
                            }}
                            disabled={service.quantity >= service.option.maxQuantity}
                            className={`p-1.5 rounded-r-lg transition-colors ${
                              service.quantity >= service.option.maxQuantity
                                ? "text-gray-300 cursor-not-allowed"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <Icons.plus />
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeService(service.option.id);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icons.trash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTab === "monthly" && selectedPlan ? (
                <div className="mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedPlan.name} Plan
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedPlan.hoursPerWeek}h/week
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ${selectedPlan.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No items selected</p>
                  <p className="text-xs mt-1">
                    {activeTab === "one-time"
                      ? "Click on services to add them"
                      : "Select a plan to continue"}
                  </p>
                </div>
              )}

              {/* Missing Dependencies Alert */}
              {activeTab === "one-time" && missingDependencies.length > 0 && (
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Icons.alert />
                    <span className="text-sm font-semibold">Required Services</span>
                  </div>
                  {missingDependencies.map((dep, idx) => {
                    const requiredCategory = serviceCategories.find(
                      (c) => c.id === dep.requiresId
                    );
                    const requiredOption = dep.recommendedOptionId
                      ? requiredCategory?.options.find(
                          (o) => o.id === dep.recommendedOptionId
                        )
                      : requiredCategory?.options[0];

                    return (
                      <div
                        key={idx}
                        className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                      >
                        <p className="text-xs text-amber-800 mb-2">{dep.message}</p>
                        {requiredOption && (
                          <button
                            onClick={() => addRequiredService(dep)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-900 text-sm font-medium transition-colors"
                          >
                            <span>
                              Add {requiredOption.name} (+${requiredOption.price})
                            </span>
                            <Icons.arrowRight />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {hasSelection && (
                <>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ${currentTotal.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">ISR ({(ISR_RATE * 100).toFixed(1)}%)</span>
                      <span className="font-medium text-gray-900">
                        ${currentTotal.isr.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-[#f48200]">
                          ${currentTotal.total.toLocaleString()}
                          {activeTab === "monthly" && (
                            <span className="text-sm font-normal text-gray-500">/mo</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleContactRedirect}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#f48200] to-[#faa732] hover:from-[#007BFF] hover:to-[#00BCD4] text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    Request Quote
                  </button>

                  <button
                    onClick={clearAll}
                    className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear selection
                  </button>
                </>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Prices shown are estimates. Final quote may vary based on project specifics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
