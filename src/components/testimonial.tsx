import React from "react";
import { cn } from "../lib/utils";
import { Marquee } from "./magicui/marquee";

const reviews = [
  {
    name: "Astrid Euceda",
    username: "Google",
    body: "Codebrand delivered exceptional web development for my business. They understood my requirements perfectly and created a modern, fast-loading website that has significantly improved my online presence. The team was responsive throughout the entire project.",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI6EKC8_1TnuJQj3FA7aGl_95SLfJEERSNFNzIPYdd_t9LZFw=w36-h36-p-rp-mo-br100",
  },
  {
    name: "Elvin Amador",
    username: "Google",
    body: "Working with Codebrand was an excellent experience from start to finish. Their professionalism, creativity, and attention to detail set them apart. They delivered our React application ahead of schedule with clean, maintainable code.",
    img: "",
  },
  {
    name: "Nelson Nuñez",
    username: "Google",
    body: "Efficient and responsible team. Codebrand rebuilt our company website with modern technologies and the results exceeded expectations. Page load times improved by 70% and our SEO rankings jumped significantly.",
    img: "",
  },
  {
    name: "Serling Topete",
    username: "Google",
    body: "We hired Codebrand to build our e-commerce website from scratch. The result has been amazing - a beautiful, fast store that our customers love. Sales increased 35% in the first month after launch.",
    img: "",
  },
  {
    name: "Jose Castro",
    username: "Google",
    body: "Best web development team I've worked with. They delivered our custom web application on time and on budget. Their technical expertise in React and Node.js is impressive. Highly professional throughout.",
    img: "",
  },
  {
    name: "Daniel Gallardo",
    username: "Google",
    body: "10/10 would hire again! Codebrand transformed our outdated website into a modern, mobile-responsive platform. Their communication during US business hours made collaboration seamless despite the remote setup.",
    img: "https://lh3.googleusercontent.com/a-/ALV-UjXNpkqXOAfCvrSpfob4SwfZNDNh3OR1xbzguKLMfZYz6YhwOJ4=s36-c-rp-mo-br100",
  },
  {
    name: "Cindy Serrano",
    username: "Google",
    body: "Based in Mexico, I needed a reliable development partner in a similar timezone. Codebrand delivered excellent service - real-time communication, quality code, and a beautiful website that perfectly represents my brand.",
    img: "https://lh3.googleusercontent.com/a/ACg8ocJjQnYedoXHm50JakUJ7jL3ssGWjZifjwbWTxiZmsx8vcJu7Q=s36-c-rp-mo-br100",
  },
  {
    name: "Mayelin Canelas",
    username: "Google",
    body: "Codebrand exceeded all my expectations! They built a custom booking system for my business that's intuitive and reliable. The team handled complex integrations with ease and provided excellent post-launch support.",
    img: "",
  },
  {
    name: "Gabriela Cordova",
    username: "Google",
    body: "The website Codebrand created is beautiful and performs flawlessly. Fast loading, mobile-optimized, and easy for me to update. They also set up analytics so I can track visitor behavior. Great investment for my business.",
    img: "https://lh3.googleusercontent.com/a/ACg8ocJk7eS8wG8eB82XLRYFQeQl670y_-zgE2GPZFxhMtgNzShpUA=s36-c-rp-mo-br100",
  },
  {
    name: "Virginia Alfaro",
    username: "Google",
    body: "Outstanding web development work. Codebrand created a professional site for my consulting business with integrated contact forms and scheduling. Very professional team with clear communication throughout the project.",
    img: "",
  },
  {
    name: "Carlos Martinez",
    username: "Google",
    body: "Our Shopify e-commerce store built by Codebrand increased sales by 40% within three months. They optimized the checkout flow, improved page speed, and integrated our inventory system perfectly. Worth every dollar.",
    img: "",
  },
  {
    name: "Danisela Pineda",
    username: "Google",
    body: "Brilliant team with great communication skills! They built our company's internal dashboard and the results are fantastic. Clean interface, fast performance, and they were always available during our business hours.",
    img: "",
  },
  {
    name: "Maria Rodriguez",
    username: "Google",
    body: "Professional, responsive, and creative. Codebrand understood our vision and delivered a website that perfectly captures our brand. The development process was smooth with regular updates and demos.",
    img: "",
  },
  {
    name: "Tech Startup CEO",
    username: "Client",
    body: "Codebrand was instrumental in launching our MVP. Their senior developers understood startup constraints and delivered a scalable product in just 8 weeks. We've since raised our seed round and they remain our development partner.",
    img: "",
  },
  {
    name: "E-commerce Director",
    username: "Client",
    body: "After a failed offshore project, Codebrand rescued our e-commerce platform. Their US timezone availability and clear communication made all the difference. Our site now handles 10x the traffic with better performance.",
    img: "",
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
  const isLongText = body.length > 120;

  return (
    <figure
      className={cn(
        "group relative h-full w-[280px] sm:w-[300px] md:w-[320px] cursor-pointer overflow-hidden rounded-2xl border p-4 sm:p-5",
        "border-slate-700/80 bg-slate-800/70 hover:bg-slate-800 backdrop-blur-sm transition-all duration-300"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <Avatar name={name} img={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm sm:text-base font-semibold text-white">
            {name}
          </figcaption>
          <div className="flex items-center gap-1.5">
            <StarRating />
            <span className="text-xs text-slate-400">• {username}</span>
          </div>
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-slate-300 leading-relaxed">
        <span className={cn(
          isLongText && "line-clamp-4 sm:group-hover:line-clamp-none transition-all duration-300"
        )}>
          {body}
        </span>
        {isLongText && (
          <span className="hidden sm:block mt-2 text-xs text-cyan-400 group-hover:hidden">
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
        className={prefersReducedMotion ? "[--duration:0s]" : "[--duration:45s] sm:[--duration:40s]"}
      >
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        className={prefersReducedMotion ? "[--duration:0s]" : "[--duration:45s] sm:[--duration:40s]"}
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
