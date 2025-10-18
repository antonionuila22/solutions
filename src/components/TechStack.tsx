import {
  Code2,
  Database,
  Cloud,
  Cpu,
  Layout,
  Server,
  Globe,
  Zap,
} from "lucide-react";

const technologies = [
  {
    name: "React.js",
    icon: Code2,
    category: "Front-End Framework",
    color: "text-cyan-600",
  },
  {
    name: "Node.js",
    icon: Server,
    category: "Back-End Runtime",
    color: "text-green-600",
  },
  {
    name: "Next.js",
    icon: Globe,
    category: "React Framework",
    color: "text-gray-800",
  },
  {
    name: "TypeScript",
    icon: Code2,
    category: "Type-Safe JavaScript",
    color: "text-blue-600",
  },
  {
    name: "Tailwind CSS",
    icon: Layout,
    category: "Utility-First CSS",
    color: "text-cyan-500",
  },
  {
    name: "PostgreSQL",
    icon: Database,
    category: "Database",
    color: "text-blue-700",
  },
  {
    name: "AWS / Vercel",
    icon: Cloud,
    category: "Cloud Hosting",
    color: "text-orange-500",
  },
  {
    name: "GraphQL",
    icon: Zap,
    category: "API Query Language",
    color: "text-pink-600",
  },
];

export default function TechStack() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
      {technologies.map((tech, index) => {
        const Icon = tech.icon;
        return (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all group"
          >
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon className={`w-12 h-12 ${tech.color}`} />
            </div>
            <h4 className="font-bold text-cyan-900">{tech.name}</h4>
            <p className="text-xs text-gray-500 text-center mt-2">
              {tech.category}
            </p>
          </div>
        );
      })}
    </div>
  );
}
