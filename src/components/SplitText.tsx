// SplitTextTailwind.tsx
import { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
}

const SplitTextTailwind: React.FC<SplitTextProps> = ({
  text,
  className = "",
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const letters = text.split("");

  return (
    <p ref={ref} className={className}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`
            inline-block transition-all duration-500 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
          style={{ transitionDelay: `${index * 90}ms` }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </p>
  );
};

export default SplitTextTailwind;
