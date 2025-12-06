import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { ArrowRight } from "lucide-react";

const offerings = [
  {
    icon: "fa-house-chimney-user",
    title: "Childminders",
    description: "Discover warm, homely settings where qualified childminders nurture your child's curiosity, independence and well‑being.",
    cta: "Find a Childminder",
    link: "/apply",
  },
  {
    icon: "fa-graduation-cap",
    title: "Tutors",
    description: "Boost your child's learning with subject specialists who make education fun and engaging for all abilities.",
    cta: "Learn More",
    link: "/services",
  },
  {
    icon: "fa-baby",
    title: "Nannies",
    description: "Professional nannies provide reliable, tailored in‑home care—perfect for busy parents needing flexible support.",
    cta: "Meet Our Nannies",
    link: "/services",
  },
];

const WhatWeOffer = () => {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-poppins mb-4">
            What We{" "}
            <span className="text-primary">Offer</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            ReadyKids connects families with trusted professionals who enrich children's lives through education, care and play. Explore our core services below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {offerings.map((offering, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group cursor-default text-center"
            >
              <CardHeader className="pb-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <i className={`fa-solid ${offering.icon} text-3xl text-primary group-hover:scale-110 transition-transform duration-300`}></i>
                </div>
                <CardTitle className="text-xl font-poppins group-hover:text-primary transition-colors duration-300">{offering.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {offering.description}
                </CardDescription>
                <NavLink to={offering.link}>
                  <Button variant="outline" className="group/btn">
                    {offering.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </NavLink>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
