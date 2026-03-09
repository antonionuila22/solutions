export interface Testimonial {
  name: string;
  username: string;
  body: string;
  img: string;
}

export const testimonials = [
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
] as const satisfies readonly Testimonial[];
