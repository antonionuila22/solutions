import { motion } from "framer-motion";
import { 
  Zap, 
  Code, 
  Shield, 
  Globe, 
  Workflow, 
  BarChart3,
  Users,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Execute workflows in milliseconds with our optimized runtime engine."
  },
  {
    icon: Code,
    title: "Visual Editor",
    description: "Build complex automations with our intuitive drag-and-drop interface."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and compliance."
  },
  {
    icon: Globe,
    title: "400+ Integrations",
    description: "Connect with all your favorite apps and services out of the box."
  },
  {
    icon: Workflow,
    title: "Advanced Logic",
    description: "Handle complex conditional logic, loops, and error handling with ease."
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Monitor workflow performance with detailed metrics and insights."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share workflows and collaborate with your team in real-time."
  },
  {
    icon: Clock,
    title: "Scheduling",
    description: "Run workflows on schedules, webhooks, or triggered by events."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything you need to automate
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to handle workflows of any complexity, from simple automations to enterprise-grade processes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}