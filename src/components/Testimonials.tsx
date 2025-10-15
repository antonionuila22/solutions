import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Operations",
    company: "TechCorp",
    content:
      "n8n has revolutionized how we handle data between our tools. What used to take hours now happens automatically in seconds.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Marcus Rodriguez",
    role: "DevOps Engineer",
    company: "StartupXYZ",
    content:
      "The visual workflow editor is incredibly intuitive. Our team was able to build complex automations without writing a single line of code.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Emily Johnson",
    role: "Product Manager",
    company: "Growth Inc",
    content:
      "We've saved countless hours on manual tasks. The integration capabilities are exactly what we needed for our workflow automation.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
  },
];

const stats = [
  { number: "50K+", label: "Active workflows" },
  { number: "1M+", label: "Tasks automated daily" },
  { number: "400+", label: "Integrations" },
  { number: "99.9%", label: "Uptime" },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Trusted by teams worldwide
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-background rounded-lg p-6 shadow-sm border border-border"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-3">
                <ImageWithFallback
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
