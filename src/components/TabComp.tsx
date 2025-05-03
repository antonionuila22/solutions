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
      <h2 className="text-3xl md:text-4xl font-bold text-cyan-900 mt-5 mb-14 text-center">
        Servicios profesionales
        <span className="text-orange-400"> para tu negocio</span>
      </h2>

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
                className="w-full rounded-lg aspect-[4/2] object-cover shadow"
              />
            </div>
          )}

          <h3 className="text-xl md:text-2xl font-bold text-cyan-900 mb-4">
            {current?.title}
          </h3>
          <p className="text-gray-700 text-base leading-relaxed">
            {current?.description}
          </p>
          <div className="mt-6">
            <button onClick={() => window.location.href = './products'} className="bg-gradient-to-r from-[#f48200] to-[#faa732] text-white font-semibold
   py-[15px] px-[30px] rounded-full shadow-lg
   hover:from-[#007BFF] hover:to-[#00BCD4] hover:shadow-2xl hover:brightness-125
   transition-all duration-300 ease-in-out
   transform border-none text-sm lg:text-lg">
            Mas información
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}
