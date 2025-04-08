import { useState, useEffect } from "react";
import logo from "../assets/codebrand.svg";

const menuItems = [
  { name: "Inicio", link: "/", hasDropdown: false },
  {
    name: "Servicios",
    link: "#",
    hasDropdown: true,
    subItems: [
      { name: "Desarrollo Web y Apps", link: "/servicios/desarrollo-web" },
      { name: "Diseño UX-UI", link: "/servicios/ux-ui" },
      { name: "SEO", link: "/servicios/seo" },
      { name: "Diseño Gráfico & Branding", link: "/servicios/branding" },
      { name: "Promocionales", link: "/servicios/promocionales" },
      { name: "Social Media", link: "/servicios/social-media" },
      { name: "Edición de Video", link: "/servicios/edicion-video" },
      { name: "Animación 2D y 3D", link: "/servicios/animacion" },
      { name: "Renderizado 3D", link: "/servicios/renderizado" },
    ],
  },
  {
    name: "Nosotros",
    link: "#",
    hasDropdown: true,
    subItems: [
      { name: "Historia", link: "/historia-de-codebrand" },
      { name: "Nuestros Especialistas", link: "/team" },
    ],
  },
  {
    name: "Recursos",
    link: "#",
    hasDropdown: true,
    subItems: [
      { name: "Libros", link: "/libros" },
      { name: "Blog", link: "/blog" },
      { name: "Países de Servicio", link: "/countryareas" },
    ],
  },
  { name: "Productos", link: "/products", hasDropdown: false },
  { name: "Contacto", link: "/contacto", hasDropdown: false },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<number[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSubmenu = (index: number) => {
    setOpenSubmenus((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <a href="/" className="flex-shrink-0">
          <img src={logo.src} alt="Codebrand" className="w-32 sm:w-36" />
        </a>

        <ul className="hidden md:flex items-center gap-8 font-medium mx-auto">
          {menuItems.map((item, index) => (
            <li key={index} className="relative group">
              <a
                href={item.link}
                className="text-gray-800 hover:text-orange-400 transition flex items-center gap-1"
              >
                {item.name}
                {item.hasDropdown && (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>

              {item.hasDropdown && (
                <ul className="absolute animation delay-200 top-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md py-3 px-4 mt-2 space-y-2 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-300 ease-in-out min-w-[220px] border z-50">
                  {item.subItems?.map((sub, i) => (
                    <li key={i}>
                      <a
                        href={sub.link}
                        className="text-sm text-gray-700 hover:text-orange-400 block whitespace-nowrap"
                      >
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
            href="/contacto"
            className="bg-gradient-to-r from-[#f48200] to-[#faa732] text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:from-[#007BFF] hover:to-[#00BCD4] hover:shadow-2xl hover:brightness-110 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-sm lg:text-base"
          >
            Hablemos!
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          aria-label="Abrir menú móvil"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-3 px-6 pb-6 pt-2 bg-white border-t shadow-inner">
          {menuItems.map((item, index) => (
            <div key={index} className="w-full">
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className="w-full flex justify-between items-center text-left text-base font-semibold py-2 text-gray-800 hover:text-orange-400"
                  >
                    {item.name}
                    <svg
                      className="w-4 h-4 transform transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className={`pl-4 transition-all duration-300 ${openSubmenus.includes(index) ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                    {item.subItems?.map((subItem, subIdx) => (
                      <a
                        key={subIdx}
                        href={subItem.link}
                        className="block text-sm text-gray-600 py-1 hover:text-orange-400"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <a
                  href={item.link}
                  className="block text-base text-gray-800 hover:text-orange-400 py-2"
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}

          <div className="mt-4">
            <a
              href="/contacto"
              className="bg-gradient-to-r from-[#f48200] to-[#faa732] text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:from-[#007BFF] hover:to-[#00BCD4] hover:shadow-2xl hover:brightness-110 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-sm lg:text-base"
            >
              Hablemos!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}