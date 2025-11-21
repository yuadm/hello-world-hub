import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-childcare.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">All-in-One Agency Management</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your{" "}
                <span className="text-primary">Childminder Agency</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Find, manage and onboard childminders seamlessly. Grow your childminding business with confidence and compliance.
              </p>
            </div>

            {/* Key benefits */}
            <div className="space-y-3">
              {[
                "Streamlined recruitment & vetting",
                "Built-in Ofsted compliance",
                "Automated document management",
                "Scale with ease"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent h-5 w-5 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <NavLink to="/join">
                <Button size="lg" className="group w-full sm:w-auto">
                  Join as Agency
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </NavLink>
              <NavLink to="/apply">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Apply as Childminder
                </Button>
              </NavLink>
            </div>

            <p className="text-sm text-muted-foreground">
              Join 200+ agencies already transforming their childminding operations
            </p>
          </div>

          {/* Right column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Professional childcare environment" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating stats card */}
            <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-xl shadow-lg border border-border hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle2 className="text-accent h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">Compliance Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
