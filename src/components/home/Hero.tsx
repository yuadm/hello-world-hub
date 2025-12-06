import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-childcare.jpg";
import { useState, useEffect } from "react";

const cyclingWords = ["Flexible", "Safe", "Compliant", "Trusted", "Bespoke"];

const Hero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % cyclingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToValues = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm font-poppins">Forward-Thinking Childcare</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight font-poppins">
                Forward‑Thinking Care That Puts{" "}
                <span className="text-primary">Kids First</span>
              </h1>
              
              {/* Cycling tagline */}
              <div className="h-12 flex items-center">
                <span className="text-2xl lg:text-3xl font-semibold font-poppins">
                  <span className="text-secondary transition-all duration-500">
                    {cyclingWords[currentWordIndex]}
                  </span>
                </span>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Empowering families and childminders across England with safe, flexible and educational childcare solutions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <NavLink to="/apply">
                <Button size="lg" className="group w-full sm:w-auto">
                  Find Childcare
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              <NavLink to="/join">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Become a Childminder
                </Button>
              </NavLink>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Children learning and playing in a nurturing environment" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToValues}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        aria-label="Scroll to learn more"
      >
        <span className="text-sm font-medium">Learn More</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
