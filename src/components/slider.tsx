import { useEffect, useRef, useState } from "react";
import { animated, useSpring, SpringValue } from "@react-spring/web";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

type Props = {
  testimonials: Testimonial[];
  interval?: number;
};

export default function Slider({ testimonials, interval = 4000 }: Props) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    if (interval) {
      timeoutRef.current = setTimeout(() => {
        next();
      }, interval);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, interval]);

  const visibleSlides = [
    testimonials[(index + 0) % testimonials.length],
    testimonials[(index + 1) % testimonials.length],
    testimonials[(index + 2) % testimonials.length],
  ];

  const AnimatedDiv = animated.div as React.FC<
  React.HTMLAttributes<HTMLDivElement>
>;

  // Animación con react-spring
  const springProps = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 280, friction: 40 },
    reset: true,
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Lo que dicen nuestros clientes
      </h2>

      <AnimatedDiv
        style={springProps as any}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {visibleSlides.map((testimonial, i) => (
          <div
            key={i}
            className="bg-[#11131c] border border-[#1f2129] rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex justify-center -mt-12">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full border-4 border-[#080c15] shadow-md object-cover"
              />
            </div>
            <blockquote className="mt-6 italic text-sm text-gray-300 text-center">
              “{testimonial.quote}”
            </blockquote>
            <div className="mt-4 pt-4 border-t border-gray-700 text-center">
              <p className="text-md font-semibold text-orange-400">
                {testimonial.name}
              </p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </AnimatedDiv>

      {/* Botones */}
      <div className="mt-8 flex justify-center gap-6">
        <button
          onClick={prev}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
        >
          ← Anterior
        </button>
        <button
          onClick={next}
          className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg transition"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
