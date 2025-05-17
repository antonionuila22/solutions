import { useEffect, useState } from "react";
import logo from "../assets/codebrand.svg";

type SubItem = {
  name: string;
  link: string;
};

type MenuItem = {
  name: string;
  link: string;
  hasDropdown: boolean;
  subItems?: SubItem[];
};

const menuItems: MenuItem[] = [
  { name: "Home", link: "/", hasDropdown: false },
  {
    name: "About Us",
    link: "#",
    hasDropdown: true,
    subItems: [
      { name: "History", link: "/historia-de-codebrand" },
      { name: "Our Specialist", link: "/team" },
    ],
  },
  {
    name: "Resources",
    link: "#",
    hasDropdown: true,
    subItems: [
      { name: "Books", link: "/libros" },
      { name: "Blog", link: "/blog" },
      { name: "Country We Serve", link: "/countryareas" },
    ],
  },
  { name: "Products", link: "/products", hasDropdown: false },
  { name: "Contact", link: "/contact", hasDropdown: false },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSubmenu = (index: number) => {
    setActiveSubmenu((prev) => (prev === index ? null : index));
  };

  return (
    <header className={`sticky top-0 z-50 transition-all bg-white ${isScrolled ? "shadow-md border-b border-zinc-100" : ""}`}>
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <a href="/" className="flex-shrink-0">
          <img src={logo.src ?? logo} alt="Codebrand logo" className="w-32 sm:w-36" />
        </a>

        <ul className="hidden md:flex items-center gap-8 font-medium mx-auto">
          {menuItems.map((item, index) => (
            <li key={index} className="relative group">
              <a
                href={item.link}
                className="flex items-center py-4 gap-1 texzt-gray-800 hover:text-orange-400 transition"
              >
                {item.name}
                {item.hasDropdown && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>

              {item.hasDropdown && (
                <ul className="absolute left-1/2 -translate-x-1/2 top-7 bg-white shadow-md rounded-lg py-4 px-4 mt-2 space-y-2 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity ease-in-out min-w-[25z20px] border border-zinc-100 z-50">
                  {item.subItems?.map((sub, i) => (
                    <li key={i}>
                      <a href={sub.link} className="block text-sm text-gray-700 hover:text-orange-400 whitespace-nowrap">
                        {sub.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="/contact"
            className="bg-gradient-to-r from-[#f48200] to-[#faa732] text-white font-semibold py-3 px-6 rounded-full shadow-md hover:from-[#007BFF] hover:to-[#00BCD4] hover:shadow-lg transition ease-in-out transform hover:scale-105 active:scale-95 text-sm lg:text-base"
          >
            Talk to us!
          </a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" aria-label="Abrir menú móvil">
          <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <div className={`md:hidden transition-all overflow-hidden ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col gap-3 px-6 pb-6 pt-2 bg-white border-t border-zinc-100 shadow-inner">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className="w-full flex justify-between items-center text-left font-semibold py-2 text-gray-800 hover:text-orange-400"
                  >
                    {item.name}
                    <svg className={`w-4 h-4 transform transition-transform ${activeSubmenu === index ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className={`pl-4 transition-all ${activeSubmenu === index ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                    {item.subItems?.map((subItem, i) => (
                      <a key={i} href={subItem.link} className="block text-sm text-gray-600 py-1 hover:text-orange-400">
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <a href={item.link} className="block text-base text-gray-800 hover:text-orange-400 py-2">
                  {item.name}
                </a>
              )}
            </div>
          ))}
          <div className="mt-4">
            <a
              href="/contact"
              className="bg-gradient-to-r from-[#f48200] to-[#faa732] text-white font-semibold py-3 px-6 rounded-full shadow-md hover:from-[#007BFF] hover:to-[#00BCD4] hover:shadow-lg transition ease-in-out transform hover:scale-105 active:scale-95 text-sm lg:text-base"
            >
              Talk to us!
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
