import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserCheck, 
  Shield, 
  FileText, 
  Calendar, 
  BarChart3, 
  Bell,
  Building2,
  Lock
} from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Recruitment Portal",
    description: "Streamlined application process for childminder candidates with automated screening and tracking.",
  },
  {
    icon: Shield,
    title: "DBS & Compliance Checks",
    description: "Integrated DBS verification and suitability checks for applicants and household members.",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Secure storage for qualifications, certificates, first aid documents, and health declarations.",
  },
  {
    icon: Calendar,
    title: "Availability Scheduling",
    description: "Manage childminder availability, working hours, and branch locations in one place.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Track applications, monitor compliance status, and measure agency performance.",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    description: "Never miss critical renewals with automatic notifications for health checks and certifications.",
  },
  {
    icon: Building2,
    title: "Multi-Branch Support",
    description: "Manage multiple locations and teams from a single, centralized dashboard.",
  },
  {
    icon: Lock,
    title: "Ofsted Compliant",
    description: "Built-in regulatory compliance tools to meet Ofsted standards and requirements.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Manage Your Agency</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed specifically for childminder agencies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
