import { useState } from "react";

interface TabItem {
  title: string;
  description: string;
  image?: string;
}

interface Props {
  tabs: TabItem[];
}

export default function TabComponent({ tabs }: Props) {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Tabs */}
        <div className="flex lg:flex-col gap-3 lg:w-1/3 w-full overflow-x-scroll lg:overflow-hidden md:overflow-x-hidden sm:overflow-x-scroll">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-full text-left px-5 py-3 rounded-lg text-sm font-medium border transition
                ${
                  active === i
                    ? "bg-orange-400 text-white border-orange-500 shadow-sm"
                    : "bg-white text-cyan-800 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          {/* Optional image */}
          {current?.image && (
            <div className="mb-6">
              <img
                src={current.image}
                alt={current.title}
                loading="lazy"
                className="w-full rounded-lg aspect-[16/5] object-cover shadow"
              />
            </div>
          )}

          <h3 className="text-xl md:text-2xl font-bold text-cyan-900 mb-4">
            {current?.title}
          </h3>
          <p className="text-gray-700 text-base leading-relaxed">
            {current?.description}
          </p>

          <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-900 hover:underline">
            Learn More
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
