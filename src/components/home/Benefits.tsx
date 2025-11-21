import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, Award, Users } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Save Time on Recruiting",
    description: "Automate your hiring process and reduce recruitment time by up to 70%",
    stat: "70%",
    statLabel: "Time Saved"
  },
  {
    icon: Award,
    title: "Compliance Made Easy",
    description: "Built-in Ofsted regulatory checks ensure you're always compliant",
    stat: "100%",
    statLabel: "Compliant"
  },
  {
    icon: Users,
    title: "Professional Image",
    description: "Manage all childminders under one unified, professional platform",
    stat: "200+",
    statLabel: "Agencies"
  },
  {
    icon: TrendingUp,
    title: "Scale with Confidence",
    description: "One platform to grow your agency from startup to enterprise",
    stat: "5x",
    statLabel: "Growth"
  },
];

const Benefits = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="text-secondary">ChildMinderPro</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join hundreds of agencies transforming their childminding operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <CardContent className="pt-6">
                <div className="h-16 w-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <benefit.icon className="h-8 w-8 text-secondary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {benefit.description}
                </p>
                
                <div className="pt-4 border-t border-border">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {benefit.stat}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {benefit.statLabel}
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

export default Benefits;
