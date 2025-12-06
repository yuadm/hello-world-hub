import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const propositions = [
  {
    icon: "fa-handshake",
    title: "Transparent Partnerships",
    description: "Open collaboration with parents, childminders and authorities ensures the best outcomes for your child.",
  },
  {
    icon: "fa-certificate",
    title: "Quality & Safeguarding",
    description: "We exceed statutory requirements with regular inspections and robust safeguarding practices.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Regulatory Expertise",
    description: "Our team stays on top of the latest legal frameworks and EYFS guidelines, so you don't have to.",
  },
  {
    icon: "fa-user-check",
    title: "Personalised Support",
    description: "From training to resources, we tailor our guidance to suit each family's unique needs and circumstances.",
  },
];

const ValueProposition = () => {
  return (
    <section id="parents" className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-poppins mb-4">
            Choose Value That Goes{" "}
            <span className="text-secondary">Beyond</span>
          </h2>
          <p className="text-xl opacity-80">
            Partner with ReadyKids and feel the difference. Our transparent partnerships, uncompromising quality and personalised support deliver real value for your family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {propositions.map((proposition, index) => (
            <Card 
              key={index} 
              className="bg-card text-card-foreground border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group cursor-default"
            >
              <CardHeader>
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <i className={`fa-solid ${proposition.icon} text-2xl text-primary group-hover:scale-110 transition-transform duration-300`}></i>
                </div>
                <CardTitle className="text-lg font-poppins group-hover:text-primary transition-colors duration-300">{proposition.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {proposition.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
