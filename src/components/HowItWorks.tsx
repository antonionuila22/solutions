import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

const steps = [
  {
    number: "01",
    title: "Choose your trigger",
    description:
      "Select from 400+ apps or set up webhooks, schedules, and custom triggers to start your workflow.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    number: "02",
    title: "Design your workflow",
    description:
      "Use our visual editor to create complex logic, add conditions, and connect multiple services seamlessly.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
  {
    number: "03",
    title: "Deploy and monitor",
    description:
      "Activate your workflow and watch it run automatically. Monitor performance with real-time analytics.",
    image:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get up and running in minutes with our intuitive workflow builder.
          </p>
        </motion.div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              <div
                className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-primary opacity-50">
                    {step.number}
                  </span>
                  <div className="w-12 h-0.5 bg-primary/20"></div>
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold">{step.title}</h3>

                <p className="text-lg text-muted-foreground">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="flex items-center text-primary">
                    <span className="text-sm font-medium mr-2">Next step</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8">
                    <ImageWithFallback
                      src={step.image}
                      alt={step.title}
                      className="w-full h-auto rounded-lg shadow-xl"
                    />
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/10 rounded-full blur-2xl"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
