import React from "react";
import { cn } from "../lib/utils";
import { Marquee } from "./magicui/marquee";

const reviews = [
  {
    name: "Astrid Euceda",
    username: "Google",
    body: "Code Brand ofrece un excelente servicio en el desarrollo técnico y creativo. Lograron cumplir con mis necesidades entregando un resultado mejor de lo esperado.",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI6EKC8_1TnuJQj3FA7aGl_95SLfJEERSNFNzIPYdd_t9LZFw=w36-h36-p-rp-mo-br100",
  },
  {
    name: "Elvin Amador",
    username: "Google",
    body: "Excellent experience with Codebrand. They stand out for their professionalism, creativity, and attention to detail.",
    img: "https://lh3.googleusercontent.com/a-/ALV-UjVyuTTgzp-rwjAbZQP-1SYA0LiblbAmJr_eEHIONTggAL2FBbVF=w36-h36-p-rp-mo-br100",
  },
  {
    name: "Serling Topete",
    username: "Google",
    body: "We hired Codebrand to build our website from scratch. The result has been amazing!",
    img: "https://lh3.googleusercontent.com/a/ACg8ocL-OchG04BXVf8WWT7ikPbS5WVvHzoqpJyp_DNLlhFVptuIjg=w36-h36-p-rp-mo-br100",
  },
  {
    name: "Daniel Gallardo",
    username: "Google",
    body: "10/10, highly recommended. I would hire them again without hesitation!",
    img: "https://lh3.googleusercontent.com/a-/ALV-UjXNpkqXOAfCvrSpfob4SwfZNDNh3OR1xbzguKLMfZYz6YhwOJ4=s36-c-rp-mo-br100",
  },
  {
    name: "Cindy Serrano",
    username: "Google",
    body: "Thanks, I'm in Mexico and they gave me excellent service.",
    img: "https://lh3.googleusercontent.com/a/ACg8ocJjQnYedoXHm50JakUJ7jL3ssGWjZifjwbWTxiZmsx8vcJu7Q=s36-c-rp-mo-br100",
  },
  {
    name: "Gabriela Cordova",
    username: "Google",
    body: "The website they created is beautiful and works perfectly!",
    img: "https://lh3.googleusercontent.com/a/ACg8ocJk7eS8wG8eB82XLRYFQeQl670y_-zgE2GPZFxhMtgNzShpUA=s36-c-rp-mo-br100",
  },
  {
    name: "Virginia Alfaro",
    username: "Google",
    body: "Excelente trabajo creando sitios webs. Muy profesionales.",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI6EKC8_1TnuJQj3FA7aGl_95SLfJEERSNFNzIPYdd_t9LZFw=w36-h36-p-rp-mo-br100",
  },
  {
    name: "Danisela Pineda",
    username: "Google",
    body: "Brilliant! Great communication and amazing results.",
    img: "https://lh3.googleusercontent.com/a-/ALV-UjVyuTTgzp-rwjAbZQP-1SYA0LiblbAmJr_eEHIONTggAL2FBbVF=w36-h36-p-rp-mo-br100",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

// Colores de fondo para avatares (estilo Google)
const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const getInitials = (name: string) => {
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const Avatar = ({ name, img }: { name: string; img?: string }) => {
  const [imgError, setImgError] = React.useState(false);
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  if (!img || imgError) {
    return (
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor} text-white text-xs font-bold`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      className="rounded-full w-8 h-8"
      width="32"
      height="32"
      alt={`${name} profile photo`}
      src={img}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
};

const StarRating = () => (
  <div className="flex gap-0.5" role="img" aria-label="5 out of 5 stars rating">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="w-3 h-3 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  const isLongText = body.length > 100;

  return (
    <figure
      className={cn(
        "group relative h-full w-[260px] sm:w-[280px] md:w-64 cursor-pointer overflow-hidden rounded-xl border p-3 sm:p-4",
        "border-slate-700 bg-slate-800/60 hover:bg-slate-800 backdrop-blur-sm transition-all duration-300"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Avatar name={name} img={img} />
        <div className="flex flex-col">
          <figcaption className="text-xs sm:text-sm font-medium text-white">
            {name}
          </figcaption>
          <div className="flex items-center gap-1">
            <StarRating />
            <span className="text-[10px] sm:text-xs text-slate-500">• {username}</span>
          </div>
        </div>
      </div>
      <blockquote className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <span className={cn(
          isLongText && "line-clamp-3 sm:group-hover:line-clamp-none transition-all duration-300"
        )}>
          {body}
        </span>
        {isLongText && (
          <span className="hidden sm:block mt-1 text-xs text-cyan-400 group-hover:hidden">
            Hover to read more...
          </span>
        )}
      </blockquote>
    </figure>
  );
};

export default function MarqueeDemo() {
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-3 sm:gap-4">
      <Marquee
        pauseOnHover
        className={prefersReducedMotion ? "[--duration:0s]" : "[--duration:25s] sm:[--duration:20s]"}
      >
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        className={prefersReducedMotion ? "[--duration:0s]" : "[--duration:25s] sm:[--duration:20s]"}
      >
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-12 md:w-1/6 lg:w-1/4 bg-gradient-to-r from-slate-950 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-12 md:w-1/6 lg:w-1/4 bg-gradient-to-l from-slate-950 to-transparent"></div>
    </div>
  );
}
