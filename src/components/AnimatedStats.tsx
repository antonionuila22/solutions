import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Users, Award, Globe, Zap, Target } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Satisfied Clients",
    description: "Companies that trust us",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: TrendingUp,
    value: 300,
    suffix: "%",
    label: "Average ROI",
    description: "Guaranteed return on investment",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10"
  },
  {
    icon: Award,
    value: 50,
    suffix: "+",
    label: "Awards Won",
    description: "Industry recognition",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/10"
  },
  {
    icon: Globe,
    value: 25,
    suffix: "+",
    label: "Countries Reached",
    description: "International presence",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: Zap,
    value: 1000000,
    suffix: "+",
    label: "Impressions Generated",
    description: "Average monthly reach",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-500/10",
    format: "compact"
  },
  {
    icon: Target,
    value: 95,
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Clients who recommend us",
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-500/10"
  }
];

function AnimatedNumber({ value, suffix = "", format = "normal" }: { value: number; suffix?: string; format?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (num: number) => {
    if (format === "compact" && num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (format === "compact" && num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <span className="text-4xl md:text-5xl font-bold">
      {formatNumber(displayValue)}{suffix}
    </span>
  );
}

function StatCard({ stat, index, isInView }: { stat: any; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Background Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20`}
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:-translate-y-2">
        {/* Icon Container */}
        <motion.div
          className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden`}
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <stat.icon className={`h-8 w-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent relative z-10`} />
          
          {/* Animated Background */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
            animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
          />
        </motion.div>

        {/* Number */}
        <motion.div
          className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isInView && (
            <AnimatedNumber 
              value={stat.value} 
              suffix={stat.suffix} 
              format={stat.format}
            />
          )}
        </motion.div>

        {/* Label */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {stat.label}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {stat.description}
        </p>

        {/* Hover Indicator */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100"
          animate={isHovered ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

export default function AnimatedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  // Auto-cycle through stats for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
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
            <TrendingUp className="w-4 h-4 mr-2" />
            Impressive Numbers
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Results that
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              exceed expectations
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Over 5 years creating digital success for businesses of all sizes
          </p>
        </motion.div>

        {/* Stats Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              stat={stat} 
              index={index} 
              isInView={isInView}
            />
          ))}
        </div>

        {/* Stats Carousel - Mobile */}
        <div className="md:hidden">
          <div className="relative">
            <StatCard 
              stat={stats[currentStatIndex]} 
              index={0} 
              isInView={isInView}
            />
            
            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {stats.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStatIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStatIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16 pt-12 border-t border-border/50"
        >
          <h3 className="text-2xl font-bold mb-4">
            Want to be part of these statistics?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the companies already seeing extraordinary results with our strategies
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300"
            >
              Start My Project
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-primary/20 rounded-2xl font-medium hover:bg-primary/5 transition-all duration-300"
            >
              View Methodology
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}