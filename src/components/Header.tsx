import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">n8n</span>
          </div>
          <span className="text-xl font-bold">n8n</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
            How it works
          </a>
          <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
            Pricing
          </a>
          <a href="#docs" className="text-foreground hover:text-primary transition-colors">
            Docs
          </a>
          <a href="#community" className="text-foreground hover:text-primary transition-colors">
            Community
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost">Sign in</Button>
          <Button>Get started free</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
              How it works
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-foreground hover:text-primary transition-colors">
              Docs
            </a>
            <a href="#community" className="text-foreground hover:text-primary transition-colors">
              Community
            </a>
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Button variant="ghost" className="justify-start">Sign in</Button>
              <Button className="justify-start">Get started free</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}