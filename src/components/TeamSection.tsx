import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Linkedin, Twitter, Mail, Award, Star } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImafeWithFallback";

const teamMembers = [            
  {
    id: 1,
    name: "Ramón Antonio Nuila",
    role: "Co-Founder & CEO / Full Stack Developer",
    department: "Product & Engineering",
    bio: "Visionary software engineer and entrepreneur with 7+ years leading digital transformation projects, specializing in scalable web applications and cloud solutions.",
    image: "./photos/team-code/RamonNuila.png",
    achievements: [
      "Launched 100+ web platforms",
      "Pixel Pay API Integration",
      "AWS Certified Solutions Architect"
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/ramon-nuila",
      twitter: "https://twitter.com/ramonnuila22",
      email: "info@codebrand.es"
    },
    specialties: ["Full Stack Development", "Cloud Architecture", "DevOps", "Technical Leadership"],
    experience: "7+ years",
    projects: "100+ completed proje ects",
    color: "from-orange-600 to-orange-400"
  },
  {
    id: 2,
    name: "Iris Gomez",
    role: "Logistics & Operations Engineer",
    department: "Operations & Logistics",
    bio: "Civil engineer with 8+ years optimizing supply chains and managing large-scale logistics for tech-driven companies.",
    image: "./photos/team-code/irispaola.png",
    achievements: [
      "Streamlined logistics for 50+ projects",
      "Master’s in Resource Management",
      "Esabep Logistics Partnership"
    ],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["Process Optimization", "Supply Chain Engineering", "Resource Management"],
    experience: "8+ years",
    projects: "50+ logistics projects",
    color: "from-orange-600 to-orange-400"
  },
  {
    id: 3,
    name: "Larisa Lopez",
    role: "Product Manager & UX/UI Designer",
    department: "Product & Design",
    bio: "Product manager and UX/UI designer with 10+ years crafting intuitive digital experiences and leading cross-functional teams.",
    image: "./photos/team-code/Cmorel.png",
    achievements: [
      "Google UX/UI Certification",
      "Led 20+ product launches",
      "Expert in User-Centered Design"
    ],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["UX/UI Design", "Product Management", "User Research", "Prototyping"],
    experience: "10+ years",
    projects: "20+ digital products",
    color: "from-orange-600 to-orange-400"
  },
  {
    id: 4,
    name: "Enrique Perez",
    role: "Digital Marketing & Social Media Lead",
    department: "Marketing & Growth",
    bio: "Marketing strategist with 8+ years of experience in digital campaigns, content creation, and analytics for brand growth.",
    image: "./photos/team-code/Perez.png",
    achievements: [
      "Google Premier Partner",
      "Managed 150+ successful campaigns",
      "Facebook Marketing Expert"
    ],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["Digital Marketing", "Content Strategy", "Analytics", "Conversion Optimization"],
    experience: "8+ years",
    projects: "150+ campaigns",
    color: "from-orange-600 to-orange-400"
  },
  {
    id: 5,
    name: "Maria Casco",
    role: "Promotional Products & Branding Specialist",
    department: "Marketing & Growth",
    bio: "Promotional products expert with 13+ years creating impactful brand experiences through custom merchandise and promotional strategies.",
    image: "./photos/team-code/Mariacasco.png",
    achievements: [
      "Product Branding Specialist",
      "13+ years in promotional products",
      "Expert in Custom Merchandise"
    ],
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    },
    specialties: ["Product Branding", "Promotional Strategies", "Custom Merchandise"],
    experience: "13+ years",
    projects: "100+ branding projects",
    color: "from-orange-600 to-orange-400"
  },
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
        className="relative bg-background/80 backdrop-blur-sm  rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl "
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
              <div className="text-xs text-muted-foreground">Experience</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">{member.projects}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </motion.div>

          {/* Specialties */}
          <motion.div
            className="flex flex-wrap gap-1 mb-4"
            initial={{ opacity: 0.7 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0.7 }}
          >
            {member.specialties.slice(0, 2).map((specialty: string, idx: number) => (
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
              Key Achievements:
            </div>
            {member.achievements.slice(0, 2).map((achievement: string, idx: number) => (
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
        className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl"
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
            className="inline-flex items-center  border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Award className="w-4 h-4 mr-2" />
            Our Team Experts
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Smart
            <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Exceptional results for your business
            </span>
          </h2>
          
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Meet the professionals who will make your company's digital transformation a reality
            </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
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
          <div className=" rounded-3xl p-8 border border-primary/10">
            <h3 className="text-3xl font-bold mb-4">
              Want to join the team?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
              We are always looking for exceptional talent to join our mission
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300"
                onClick={() => window.location.href = "./contact"}
              
              >
                Contact us
              </motion.button>
            
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}