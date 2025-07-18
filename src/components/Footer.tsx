import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Integrations", href: "#integrations" },
    { name: "Pricing", href: "#pricing" },
    { name: "Changelog", href: "#changelog" }
  ],
  Resources: [
    { name: "Documentation", href: "#docs" },
    { name: "Templates", href: "#templates" },
    { name: "Blog", href: "#blog" },
    { name: "Community", href: "#community" }
  ],
  Company: [
    { name: "About", href: "#about" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
    { name: "Support", href: "#support" }
  ],
  Legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "Security", href: "#security" }
  ]
};

const socialLinks = [
  { name: "GitHub", icon: Github, href: "#github" },
  { name: "Twitter", icon: Twitter, href: "#twitter" },
  { name: "LinkedIn", icon: Linkedin, href: "#linkedin" },
  { name: "Email", icon: Mail, href: "#email" }
];

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">n8n</span>
              </div>
              <span className="text-xl font-bold">n8n</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              The most flexible workflow automation platform. Connect your apps and services with powerful automation.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-semibold">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 n8n. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="#status" className="hover:text-primary transition-colors">
              Status
            </a>
            <a href="#api" className="hover:text-primary transition-colors">
              API
            </a>
            <a href="#webhooks" className="hover:text-primary transition-colors">
              Webhooks
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}