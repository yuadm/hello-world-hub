import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold font-poppins text-primary">
            Ready<span className="text-secondary">Kids</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('parents')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Parents
            </button>
            <button 
              onClick={() => scrollToSection('childminders')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Childminders
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/admin">
              <Button variant="ghost" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </NavLink>
            <NavLink to="/apply">
              <Button variant="default">Find Childcare</Button>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('parents')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Parents
            </button>
            <button 
              onClick={() => scrollToSection('childminders')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Childminders
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
            <div className="pt-4 space-y-3">
              <NavLink to="/admin" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <LogIn className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
              </NavLink>
              <NavLink to="/apply" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full">Find Childcare</Button>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
