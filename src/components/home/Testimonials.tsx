import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Director, Little Steps Childminding",
    content: "ChildMinderPro has transformed how we manage our agency. The compliance tracking alone has saved us countless hours and given us peace of mind.",
    rating: 5
  },
  {
    name: "James Thompson",
    role: "Owner, Caring Hands Agency",
    content: "The recruitment portal is a game-changer. We've reduced our hiring time by 60% and found better quality candidates. Absolutely worth it.",
    rating: 5
  },
  {
    name: "Emma Roberts",
    role: "Manager, Sunshine Childcare",
    content: "Finally, a platform built specifically for childminder agencies. The Ofsted compliance features are exactly what we needed.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Trusted by{" "}
            <span className="text-primary">Leading Agencies</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what agency owners say about ChildMinderPro
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="border-t border-border pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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
