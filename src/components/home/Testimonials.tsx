import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Olivia B.",
    role: "Parent",
    content: "ReadyKids helped us find a wonderful childminder who cares for our daughter like family. The personal updates and flexible scheduling make our lives so much easier.",
    rating: 5,
    initials: "OB",
    color: "bg-primary/20 text-primary",
  },
  {
    name: "Sarah A.",
    role: "Registered Childminder",
    content: "As a childminder, I value ReadyKids' support and continuous training. Their standards keep me on my toes and give parents confidence in my care.",
    rating: 5,
    initials: "SA",
    color: "bg-secondary/20 text-secondary",
  },
];

const Testimonials = () => {
  return (
    <section id="childminders" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-poppins mb-4">
            Trusted by{" "}
            <span className="text-primary">Parents & Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what families and childminders say about ReadyKids
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
              <CardContent className="pt-6">
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 h-8 w-8 text-muted/20 group-hover:text-primary/20 transition-colors" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                
                <p className="text-foreground mb-6 leading-relaxed relative z-10 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="border-t border-border pt-4 flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`h-10 w-10 rounded-full ${testimonial.color} flex items-center justify-center font-semibold text-sm font-poppins`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold font-poppins">— {testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
