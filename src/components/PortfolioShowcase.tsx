import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  TrendingUp,
  Users,
  Award,
  Target,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./ImageWithFallback";

const portfolioItems = [
  {
    id: 1,
    title: "E-commerce Fashion Revolution",
    client: "StyleHub",
    category: "E-commerce",
    description:
      "Complete digital transformation of a fashion brand, from rebranding to implementing a high-performance e-commerce platform.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    results: [
      { metric: "Online Sales", value: "+340%", icon: TrendingUp },
      { metric: "New Clients", value: "+280%", icon: Users },
      { metric: "ROI", value: "450%", icon: Award },
    ],
    tags: ["E-commerce", "Branding", "SEO", "Social Media"],
    challenge: "Low brand recognition and limited online sales",
    solution:
      "Comprehensive digital marketing strategy focused on user experience and conversion",
    timeline: "6 months",
  },
  {
    id: 2,
    title: "SaaS Lead Generation Mastery",
    client: "TechFlow",
    category: "SaaS",
    description:
      "Lead generation campaign for a B2B software startup, optimizing the sales funnel and automating marketing processes.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    results: [
      { metric: "Qualified Leads", value: "+520%", icon: Target },
      { metric: "Conversion", value: "+185%", icon: TrendingUp },
      { metric: "CAC Reduction", value: "-60%", icon: Award },
    ],
    tags: ["SaaS", "Lead Generation", "Marketing Automation", "PPC"],
    challenge: "High customer acquisition cost and low lead quality",
    solution:
      "Implementation of marketing automation and PPC campaign optimization",
    timeline: "4 months",
  },
  {
    id: 3,
    title: "Restaurant Chain Digital Transformation",
    client: "FoodCorp",
    category: "Food & Beverage",
    description:
      "Complete digitalization of a restaurant chain, including mobile app, online delivery, and social media strategies.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    results: [
      { metric: "Online Orders", value: "+450%", icon: TrendingUp },
      { metric: "App Downloads", value: "100K+", icon: Users },
      { metric: "Revenue", value: "+220%", icon: Award },
    ],
    tags: ["Mobile App", "Delivery", "Social Media", "Local SEO"],
    challenge: "Pandemic impact on in-person sales",
    solution:
      "Quick pivot to digital model with delivery app and local marketing",
    timeline: "3 months",
  },
  {
    id: 4,
    title: "FinTech User Acquisition",
    client: "PayFlow",
    category: "FinTech",
    description:
      "User acquisition strategy for a mobile payments app, focused on advanced segmentation and retargeting.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    results: [
      { metric: "Active Users", value: "+380%", icon: Users },
      { metric: "Retention", value: "+95%", icon: Target },
      { metric: "LTV", value: "+250%", icon: TrendingUp },
    ],
    tags: ["FinTech", "User Acquisition", "Retargeting", "Analytics"],
    challenge: "High competition in mobile payments market",
    solution: "Advanced segmentation and personalized retargeting campaigns",
    timeline: "8 months",
  },
];

export default function PortfolioShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % portfolioItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length
    );
  };

  const currentItem = portfolioItems[currentIndex];

  return (
    <section id="portfolio" className="py-24 bg-background" ref={ref}>
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
            <Award className="w-4 h-4 mr-2" />
            Proven Success Stories
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Results that
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              speak for themselves
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how we've helped companies like yours achieve digital
            success
          </p>
        </motion.div>

        {/* Main Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
        >
          {/* Image and Navigation */}
          <div className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <ImageWithFallback
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <Badge className="bg-background/90 text-foreground">
                  {currentItem.category}
                </Badge>
              </div>

              {/* Navigation Buttons */}
              <div className="absolute bottom-6 right-6 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={prevSlide}
                  className="bg-background/90 hover:bg-background"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={nextSlide}
                  className="bg-background/90 hover:bg-background"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {portfolioItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold mb-2">{currentItem.title}</h3>
              <p className="text-primary font-medium mb-4">
                Client: {currentItem.client}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {currentItem.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {currentItem.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-4">
              {currentItem.results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-4 bg-muted/50 rounded-2xl"
                >
                  <result.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary mb-1">
                    {result.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.metric}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Challenge</h4>
                <p className="text-muted-foreground text-sm">
                  {currentItem.challenge}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">Solution</h4>
                <p className="text-muted-foreground text-sm">
                  {currentItem.solution}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div>
                <span className="text-sm text-muted-foreground">
                  Timeline:{" "}
                </span>
                <span className="font-medium">{currentItem.timeline}</span>
              </div>
              <Button className="group">
                View Full Case
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setCurrentIndex(index)}
              className="cursor-pointer group"
            >
              <Card
                className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  currentIndex === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {hoveredCard === item.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-white/90 rounded-full p-2">
                          <ExternalLink className="h-4 w-4 text-primary" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {item.client}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/5 via-purple-600/5 to-pink-600/5 rounded-3xl p-8 border border-primary/10">
            <h3 className="text-3xl font-bold mb-4">
              Ready to be our next success story?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
              Let's analyze your project and create a personalized strategy to
              achieve your goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary"
              >
                Request Free Analysis
              </Button>
              <Button size="lg" variant="outline">
                Download Full Portfolio
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
