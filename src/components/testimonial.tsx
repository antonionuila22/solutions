import { cn } from "@/lib/utils";
import { Marquee } from "./magicui/marquee";

const reviews = [
  {
    name: "Astrid Euceda",
    username: "Google",
    body: "Code Brand ofrece un excelente servicio en el desarrollo técnico y creativo. Lograron cumplir con mis necesidades entregando un resultado mejor de lo esperado. Recomendaría a Code Brand sin dudarlo a cualquier persona que esté en busca de un servicio de alta calidad en el desarrollo de páginas web.",
    img: "https://lh3.googleusercontent.com/a/ACg8ocI6EKC8_1TnuJQj3FA7aGl_95SLfJEERSNFNzIPYdd_t9LZFw=w36-h36-p-rp-mo-br100",
  },
  {
    name: "Cindy Serrano",
    username: "Google",
    body: "Thanks, I'm in Mexico and they gave me  excellent service",
    img: "https://lh3.googleusercontent.com/a-/ALV-UjVyuTTgzp-rwjAbZQP-1SYA0LiblbAmJr_eEHIONTggAL2FBbVF=w36-h36-p-rp-mo-br100",
  },
  {
    name: "VIRGINIA DENISSE ALFARO REYES",
    username: "Google",
    body: "Excelente trabajo creando sitios webs",
    img: "https://lh3.googleusercontent.com/a/ACg8ocL-OchG04BXVf8WWT7ikPbS5WVvHzoqpJyp_DNLlhFVptuIjg=w36-h36-p-rp-mo-br100",
  },
  {
    name: "Nelson Nuñez",
    username: "Google",
    body: "Excelente Servicio, Eficaz y Responsables .😊",
    img: "https://lh3.googleusercontent.com/a-/ALV-UjXNpkqXOAfCvrSpfob4SwfZNDNh3OR1xbzguKLMfZYz6YhwOJ4=s36-c-rp-mo-br100",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

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
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
