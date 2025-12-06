import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero.jpg";

const coreValues = [
  { icon: "fa-child", title: "Child‑Centred Excellence", description: "We put children's welfare, happiness and holistic development at the heart of every decision we make." },
  { icon: "fa-check-circle", title: "Rigorous Compliance", description: "We strictly adhere to the EYFS and all childcare regulations to ensure safe, exemplary care." },
  { icon: "fa-comments", title: "Clarity & Support", description: "Families and childminders receive clear information, step‑by‑step guidance and ongoing mentorship." },
  { icon: "fa-lightbulb", title: "Transparency & Integrity", description: "We share inspection outcomes openly and maintain honest communication with all stakeholders." },
];

const whatWeDo = [
  { icon: "fa-id-card", title: "Registration & Vetting", description: "Enhanced DBS checks, health declarations and thorough local authority confirmations ensure only qualified, trustworthy professionals join our network." },
  { icon: "fa-layer-group", title: "Flexible Options", description: "We support early years, compulsory and voluntary childminding registers with care from home or approved non‑domestic settings." },
  { icon: "fa-clipboard-check", title: "Quality Assurance", description: "Regular visits and professional development keep standards high, fostering excellence in every setting." },
  { icon: "fa-hand-holding-medical", title: "Safeguarding & Partnerships", description: "Robust safeguarding practices and collaborations with local authorities guarantee children's safety and access to funding schemes." },
  { icon: "fa-sync", title: "Continuous Improvement", description: "Transparent feedback procedures and ongoing reviews help us refine our services and respond to families' needs." },
];

const team = [
  { title: "Director & Nominated Individual", description: "Provides strategic oversight and ensures compliance with childcare legislation, inspiring a culture of excellence." },
  { title: "Head of Quality & Standards", description: "Maintains and elevates our quality benchmarks through rigorous assessments and guidance on EYFS and GCR standards." },
  { title: "Safeguarding Lead", description: "Champions safeguarding across our agency, ensuring swift responses to concerns and supporting childminders in best practices." },
  { title: "Training & Development", description: "Designs comprehensive training programmes and fosters continuous learning for all registered childminders." },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="About ReadyKids" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>
          <div className="relative z-10 text-center text-primary-foreground px-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">About ReadyKids</h1>
            <p className="text-xl lg:text-2xl opacity-90">Empowering families and childminders across England</p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-6">Who We Are</h2>
            <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto">
              ReadyKids is a registered childminder agency dedicated to delivering outstanding early years and school‑age childcare across England. Our mission is to empower childminders and support families by providing safe, high‑quality and enriching childcare that helps every child thrive. We operate under the Childcare Act 2006, adhering to the Early Years Foundation Stage (EYFS) and other statutory regulations.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className={`fa-solid ${value.icon} text-2xl text-primary`}></i>
                    </div>
                    <CardTitle className="font-poppins">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">What We Do</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
              ReadyKids simplifies childcare by providing a comprehensive range of services for both families and childminders.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whatWeDo.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className={`fa-solid ${item.icon} text-2xl text-primary`}></i>
                    </div>
                    <CardTitle className="font-poppins text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">Meet Our Team</h2>
            <p className="text-lg opacity-80 text-center max-w-3xl mx-auto mb-12">
              Our dedicated leadership and support team uphold the highest standards in early years education and childcare. Their collective expertise ensures that childminders excel and families feel confident.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="bg-card text-card-foreground">
                  <CardHeader>
                    <CardTitle className="font-poppins text-lg">{member.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{member.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
