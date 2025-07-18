import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Linkedin, Twitter, Mail, Award, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const teamMembers = [
  {
    id: 1,
    name: "Alexandra Torres",
    role: "CEO & Founder",
    department: "Liderazgo",
    bio: "15+ años en marketing digital, ex-Google. Especialista en estrategias de crecimiento para startups y empresas Fortune 500.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["Forbes 30 Under 30", "Google Partner Premier", "TEDx Speaker"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["Estrategia Digital", "Growth Hacking", "Liderazgo"],
    experience: "15+ años",
    projects: "200+ proyectos",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    role: "Director Creativo",
    department: "Creatividad",
    bio: "Diseñador galardonado con experiencia en branding y UX/UI. Ha trabajado con marcas como Nike y Apple.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["Cannes Lion Winner", "Adobe Creative Master", "D&AD Pencil"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["Branding", "UX/UI Design", "Creative Direction"],
    experience: "12+ años",
    projects: "300+ diseños",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Sofia Martinez",
    role: "Head of Performance",
    department: "Performance",
    bio: "Experta en SEM y analytics. Certificada en Google Ads y Facebook Blueprint. Especialista en optimización de ROI.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["Google Premier Partner", "Facebook Marketing Expert", "Analytics Ninja"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["SEM", "Analytics", "Conversion Optimization"],
    experience: "10+ años",
    projects: "150+ campañas",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Tech Lead",
    department: "Tecnología",
    bio: "Full-stack developer especializado en soluciones de marketing automation y desarrollo de plataformas escalables.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["AWS Certified", "React Expert", "Node.js Specialist"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["Full-Stack Development", "Marketing Automation", "Cloud Architecture"],
    experience: "8+ años",
    projects: "100+ aplicaciones",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    name: "Maria Gonzalez",
    role: "Content Strategist",
    department: "Contenido",
    bio: "Especialista en storytelling y content marketing. Ex-editora de medios digitales líderes en LATAM.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["Content Marketing Institute Speaker", "Journalism Award", "Viral Campaign Creator"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["Content Strategy", "Copywriting", "Social Media"],
    experience: "9+ años",
    projects: "500+ contenidos",
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 6,
    name: "Roberto Silva",
    role: "Data Scientist",
    department: "Analytics",
    bio: "PhD en Data Science. Especialista en machine learning aplicado al marketing y predicción de comportamiento del consumidor.",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    achievements: ["PhD Data Science", "Kaggle Grandmaster", "AI Research Published"],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["Machine Learning", "Predictive Analytics", "Big Data"],
    experience: "7+ años",
    projects: "50+ modelos ML",
    color: "from-teal-500 to-blue-500"
  }
];

function TeamMemberCard({ member, index, isInView }: { member: any; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="group perspective-1000"
    >
      <motion.div
        className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/30"
        animate={isHovered ? { 
          rotateX: (mousePosition.y - 50) * 0.1,
          rotateY: (mousePosition.x - 50) * 0.1,
          scale: 1.02
        } : { 
          rotateX: 0, 
          rotateY: 0, 
          scale: 1 
        }}
        transition={{ duration: 0.3 }}
        style={{
          transformStyle: "preserve-3d"
        }}
      >
        {/* Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 transition-opacity duration-500`}
          animate={isHovered ? { opacity: 0.05 } : { opacity: 0 }}
        />

        {/* Profile Image */}
        <div className="relative p-6 pb-0">
          <motion.div
            className="relative w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden"
            animate={isHovered ? { scale: 1.1, rotateZ: 5 } : { scale: 1, rotateZ: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ImageWithFallback
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay on hover */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 transition-opacity duration-300`}
              animate={isHovered ? { opacity: 0.2 } : { opacity: 0 }}
            />
            
            {/* Social Icons Overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center space-x-2 opacity-0"
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.a
                href={member.social.linkedin}
                className="p-2 bg-white/90 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={member.social.twitter}
                className="p-2 bg-white/90 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="h-4 w-4" />
              </motion.a>
              <motion.a
                href={member.social.email}
                className="p-2 bg-white/90 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-4 w-4" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Department Badge */}
          <motion.div
            className={`absolute top-6 right-6 px-3 py-1 bg-gradient-to-r ${member.color} text-white text-xs font-medium rounded-full`}
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          >
            {member.department}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 pt-0">
          <motion.div
            animate={isHovered ? { y: -5 } : { y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
              {member.name}
            </h3>
            <p className={`text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-3`}>
              {member.role}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {member.bio}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-4"
            initial={{ opacity: 0 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{member.experience}</div>
              <div className="text-xs text-muted-foreground">Experiencia</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{member.projects}</div>
              <div className="text-xs text-muted-foreground">Completados</div>
            </div>
          </motion.div>

          {/* Specialties */}
          <motion.div
            className="flex flex-wrap gap-1 mb-4"
            initial={{ opacity: 0.7 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0.7 }}
          >
            {member.specialties.slice(0, 2).map((specialty, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
              >
                {specialty}
              </span>
            ))}
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, height: 0 }}
            animate={isHovered ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <Award className="h-3 w-3 mr-1" />
              Logros destacados:
            </div>
            {member.achievements.slice(0, 2).map((achievement, idx) => (
              <div key={idx} className="flex items-center text-xs text-muted-foreground">
                <Star className="h-2 w-2 mr-2 text-yellow-500" />
                {achievement}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hover Effect Decoration */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" className="py-24 bg-background relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut"
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
            <Award className="w-4 h-4 mr-2" />
            Nuestro Equipo de Expertos
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Mentes brillantes
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              resultados extraordinarios
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Conoce a los profesionales que harán realidad la transformación digital de tu empresa
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 via-purple-600/5 to-pink-600/5 rounded-3xl p-8 border border-primary/10">
            <h3 className="text-3xl font-bold mb-4">
              ¿Quieres formar parte del equipo?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
              Siempre estamos buscando talento excepcional para unirse a nuestra misión
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300"
              >
                Ver Oportunidades
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-primary/20 rounded-2xl font-medium hover:bg-primary/5 transition-all duration-300"
              >
                Conoce Nuestra Cultura
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}