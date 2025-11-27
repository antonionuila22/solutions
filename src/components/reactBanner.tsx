import { useEffect } from "react";
import gsap from "gsap";

interface Props {
  title: string;
  subtitle: string;
  description: string;
  imgUrl: string;
}

export default function BannerSecond({ title, subtitle, description, imgUrl }: Props) {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

    tl.fromTo("#gsap-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1 })
      .fromTo("#gsap-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.5")
      .fromTo("#gsap-desc", { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.4")
      .fromTo("#gsap-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.4")
      .fromTo("#gsap-image", { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1 }, "-=0.8")
      .fromTo("#card-1", { y: -20, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1 }, "-=0.6")
      .fromTo("#card-2", { y: 20, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1 }, "-=0.6");
  }, []);

  return (
    <section className="w-full bg-gradient-to-br from-[#0d0f1a] to-[#1a1d2e] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        <div className="z-10 space-y-6 text-center lg:text-left">
          <span id="gsap-subtitle" className="text-orange-400 font-medium text-lg uppercase block opacity-0">
            {subtitle}
          </span>
          <h1 id="gsap-title" className="text-white text-4xl sm:text-5xl font-bold leading-tight opacity-0">
            {title}
          </h1>
          <p id="gsap-desc" className="text-white text-md sm:text-md max-w-xl mx-auto lg:mx-0 opacity-0">
            {description}
          </p>
          <div id="gsap-cta" className="opacity-0">
            <a
              href="./contact"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold
              py-[15px] px-[30px] rounded-xl shadow-lg shadow-orange-500/25
              hover:from-orange-400 hover:to-orange-500 hover:shadow-orange-500/40 hover:brightness-110
              transition-all duration-300 ease-in-out
              transform hover:scale-105 hover:-translate-y-1 active:scale-95 border-none text-sm lg:text-lg"
            >
              Get Started
            </a>
          </div>
        </div>

        <div className="relative w-full flex justify-center items-center">
          <img
            src={imgUrl}
            alt="Hero Visual"
            id="gsap-image"
            className="w-full max-w-md sm:max-w-lg rounded-3xl shadow-2xl object-cover opacity-0"
          />

          <div
            id="card-1"
            className="absolute -top-6 -left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-xl shadow-md opacity-0"
          >
            <p className="text-sm">Dashboard</p>
            <div className="h-1 w-40 bg-orange-400 mt-2 rounded-full"></div>
          </div>

          <div
            id="card-2"
            className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-xl shadow-md opacity-0"
          >
            <p className="text-sm">Performance +100%</p>
            <div className="h-1 w-40 bg-cyan-400 mt-2 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
