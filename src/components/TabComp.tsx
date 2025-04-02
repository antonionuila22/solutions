import { useState } from "react";

interface TabItem {
  title: string;
  description: string;
  image: string;
}

interface Props {
  tabs: TabItem[];
}

export default function TabComponent({ tabs }: Props) {
  const [active, setActive] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-white">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Tabs */}
        <div className="flex md:flex-col gap-4 w-full md:w-1/3">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={`px-6 py-3 text-left rounded-lg border transition-all duration-300 hover:bg-orange-500 hover:text-white ${
                active === i
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white border-gray-700 text-cyan-900"
              }`}
              onClick={() => setActive(i)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-xl">
          <img
            src={tabs[active]?.image}
            alt={tabs[active]?.title}
            className="w-full max-h-80 object-cover rounded-lg mb-6 shadow-lg"
          />
          <h3 className="text-2xl font-bold text-orange-400 mb-4">
            {tabs[active]?.title}
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            {tabs[active]?.description}
          </p>
        </div>
      </div>
    </section>
  );
}
