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
      "Transformación digital completa de una marca de moda, desde el rebranding hasta la implementación de una plataforma e-commerce de alto rendimiento.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    results: [
      { metric: "Ventas Online", value: "+340%", icon: TrendingUp },
      { metric: "Nuevos Clientes", value: "+280%", icon: Users },
      { metric: "ROI", value: "450%", icon: Award },
    ],
    tags: ["E-commerce", "Branding", "SEO", "Social Media"],
    challenge: "Bajo reconocimiento de marca y ventas online limitadas",
    solution:
      "Estrategia integral de marketing digital con enfoque en experiencia de usuario y conversión",
    timeline: "6 meses",
  },
  {
    id: 2,
    title: "SaaS Lead Generation Mastery",
    client: "TechFlow",
    category: "SaaS",
    description:
      "Campaña de generación de leads para una startup de software B2B, optimizando el funnel de ventas y automatizando procesos de marketing.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    results: [
      { metric: "Leads Cualificados", value: "+520%", icon: Target },
      { metric: "Conversión", value: "+185%", icon: TrendingUp },
      { metric: "CAC Reducción", value: "-60%", icon: Award },
    ],
    tags: ["SaaS", "Lead Generation", "Marketing Automation", "PPC"],
    challenge: "Alto costo de adquisición de clientes y baja calidad de leads",
    solution:
      "Implementación de marketing automation y optimización de campañas PPC",
    timeline: "4 meses",
  },
  {
    id: 3,
    title: "Restaurant Chain Digital Transformation",
    client: "FoodCorp",
    category: "Food & Beverage",
    description:
      "Digitalización completa de una cadena de restaurantes, incluyendo app móvil, delivery online y estrategias de social media.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    results: [
      { metric: "Pedidos Online", value: "+450%", icon: TrendingUp },
      { metric: "App Downloads", value: "100K+", icon: Users },
      { metric: "Revenue", value: "+220%", icon: Award },
    ],
    tags: ["Mobile App", "Delivery", "Social Media", "Local SEO"],
    challenge: "Impacto de pandemia en ventas presenciales",
    solution:
      "Pivote rápido a modelo digital con app de delivery y marketing local",
    timeline: "3 meses",
  },
  {
    id: 4,
    title: "FinTech User Acquisition",
    client: "PayFlow",
    category: "FinTech",
    description:
      "Estrategia de adquisición de usuarios para una app de pagos móviles, enfocada en segmentación avanzada y retargeting.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    results: [
      { metric: "Usuarios Activos", value: "+380%", icon: Users },
      { metric: "Retención", value: "+95%", icon: Target },
      { metric: "LTV", value: "+250%", icon: TrendingUp },
    ],
    tags: ["FinTech", "User Acquisition", "Retargeting", "Analytics"],
    challenge: "Alta competencia en mercado de pagos móviles",
    solution: "Segmentación avanzada y campañas de retargeting personalizadas",
    timeline: "8 meses",
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
            Casos de Éxito Comprobados
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Resultados que
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              hablan por sí solos
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre cómo hemos ayudado a empresas como la tuya a alcanzar el
            éxito digital
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
                Cliente: {currentItem.client}
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
                <h4 className="font-semibold mb-2 text-primary">Desafío</h4>
                <p className="text-muted-foreground text-sm">
                  {currentItem.challenge}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">Solución</h4>
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
                Ver Caso Completo
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
              ¿Listo para ser nuestro próximo caso de éxito?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
              Analicemos tu proyecto y creemos una estrategia personalizada para
              alcanzar tus objetivos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary"
              >
                Solicitar Análisis Gratuito
              </Button>
              <Button size="lg" variant="outline">
                Descargar Portfolio Completo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
