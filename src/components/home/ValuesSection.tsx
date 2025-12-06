import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const values = [
  {
    icon: "fa-handshake-angle",
    title: "Flexible",
    description: "Choose care that fits your schedule and lifestyle. Our services accommodate full‑time, part‑time and wraparound needs.",
  },
  {
    icon: "fa-shield-halved",
    title: "Safe & Compliant",
    description: "Every ReadyKids setting meets rigorous standards set by Ready Kids and the EYFS, so you have complete peace of mind.",
  },
  {
    icon: "fa-users",
    title: "Trusted & Experienced",
    description: "Our vetted professionals deliver high‑quality, child‑centred care backed by continuous training and support.",
  },
  {
    icon: "fa-heart",
    title: "Bespoke & Accessible",
    description: "Personalised care plans ensure every child's unique needs are met in an inclusive, nurturing environment.",
  },
];

const ValuesSection = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-poppins mb-4">
            Our{" "}
            <span className="text-primary">Values‑First</span>{" "}
            Agency
          </h2>
          <p className="text-xl text-muted-foreground">
            At ReadyKids we believe that exceptional childcare blends flexibility, safety, trust and personalised support. Our approach is rooted in values that put families and children at the centre of everything we do.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group cursor-default"
            >
              <CardHeader>
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <i className={`fa-solid ${value.icon} text-2xl text-primary group-hover:scale-110 transition-transform duration-300`}></i>
                </div>
                <CardTitle className="text-lg font-poppins group-hover:text-primary transition-colors duration-300">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
