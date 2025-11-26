import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Search, 
  Megaphone, 
  PenTool, 
  BarChart3, 
  Globe, 
  Smartphone,
  Target,
  Video,
  Mail
} from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const services = [
  {
    id: "seo",
    icon: Search,
    title: "SEO & SEM",
    description: "Search engine optimization and paid campaigns",
    features: ["Keyword research", "On-page optimization", "Link building", "Google Ads"],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    results: "+150% average organic traffic"
  },
  {
    id: "social",
    icon: Megaphone,
    title: "Social Media",
    description: "Complete social media management and community management",
    features: ["Content strategy", "Community management", "Social advertising", "Influencer marketing"],
    color: "from-pink-500 to-purple-500",
    bgColor: "bg-pink-500/10",
    results: "+200% social engagement"
  },
  {
    id: "design",
    icon: PenTool,
    title: "Creative Design",
    description: "Graphic design and branding that connects with your audience",
    features: ["Visual identity", "Web design", "Marketing materials", "UX/UI Design"],
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    results: "+85% better brand perception"
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics & Data",
    description: "In-depth data analysis to optimize results",
    features: ["Google Analytics", "Data visualization", "Automated reporting", "KPI tracking"],
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    results: "+40% better campaign ROI"
  },
  {
    id: "web",
    icon: Globe,
    title: "Web Development",
    description: "Websites optimized for conversion and performance",
    features: ["Responsive development", "E-commerce", "Landing pages", "WordPress/Shopify"],
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500/10",
    results: "+95% better loading speed"
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile Marketing",
    description: "Strategies optimized for mobile devices",
    features: ["App marketing", "Mobile ads", "SMS marketing", "Push notifications"],
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    results: "+180% mobile conversions"
  }
];

const categories = [
  { id: "all", label: "All Services" },
  { id: "digital", label: "Digital Marketing" },
  { id: "creative", label: "Creativity" },
  { id: "tech", label: "Technology" }
];

export default function InteractiveServices() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="services" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Target className="w-4 h-4 mr-2" />
            Services That Drive Results
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Complete digital
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              marketing solutions
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From strategy to execution, we have everything you need to grow your online business
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
            <TabsList className="grid w-full grid-cols-4 bg-background/50 backdrop-blur-sm border border-border/50">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-purple-600/10 data-[state=active]:text-primary"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={item}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              className="group relative"
            >
              <div className={`relative p-8 rounded-3xl border border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 ${
                hoveredService === service.id ? 'border-primary/30' : ''
              }`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`relative w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`h-8 w-8 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Results Badge */}
                  <div className={`inline-flex items-center ${service.bgColor} px-3 py-1 rounded-full text-sm font-medium mb-6`}>
                    <BarChart3 className="w-3 h-3 mr-2" />
                    {service.results}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>

                {/* Hover Effect Decoration */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                  animate={hoveredService === service.id ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/5 via-purple-600/5 to-pink-600/5 rounded-3xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We create customized solutions tailored to your business's specific needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary">
                Request Custom Consultation
              </Button>
              <Button variant="outline">
                View All Services
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}