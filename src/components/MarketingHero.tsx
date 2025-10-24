import { Button } from "./ui/button";
import { ArrowRight, Play, TrendingUp, Users, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./ImageWithFallback";

export default function MarketingHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const stats = [
    { icon: TrendingUp, value: "300%", label: "ROI Promedio" },
    { icon: Users, value: "500+", label: "Clientes Felices" },
    { icon: Award, value: "50+", label: "Premios Ganados" },
    { icon: Zap, value: "24/7", label: "Soporte" },
  ];

  const floatingElements = [
    { icon: "📊", delay: 0, position: "top-10 left-10" },
    { icon: "🎯", delay: 1, position: "top-20 right-20" },
    { icon: "💎", delay: 2, position: "bottom-20 left-20" },
    { icon: "🚀", delay: 0.5, position: "bottom-10 right-10" },
  ];

  return (
    <section className="relative min-h-screen pt-20 pb-12 overflow-hidden">
      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`,
        }}
      />

      {/* Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.position} text-4xl opacity-20`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{
            duration: 2,
            delay: element.delay,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 3,
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium"
            >
              ✨ Agencia #1 en Resultados Digitales
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
                Transformamos tu
                <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent gradient-animate">
                  marca digital
                </span>
                en resultados
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Estrategias de marketing digital que generan más leads, ventas y
                crecimiento exponencial para tu negocio.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                Obtener Propuesta Gratis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Ver Casos de Éxito
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Consulta gratuita sin compromiso</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Resultados garantizados en 90 días</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard Image */}
            <motion.div
              className="relative bg-gradient-to-br from-primary/10 via-purple-600/10 to-pink-600/10 rounded-3xl p-8 backdrop-blur-sm border border-primary/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Marketing Dashboard"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />

              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -top-6 -right-6 bg-background/90 backdrop-blur-md border border-border rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">Conversiones</p>
                    <p className="text-2xl font-bold text-green-500">+47%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-6 -left-6 bg-background/90 backdrop-blur-md border border-border rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">ROI</p>
                    <p className="text-2xl font-bold text-blue-500">325%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl opacity-30 float-animation"></div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border/50"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center group cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-purple-600/20 transition-all duration-300">
                <stat.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
