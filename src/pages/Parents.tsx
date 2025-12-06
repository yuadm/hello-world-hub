import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import parentsImage from "@/assets/parents.jpg";

const whyChoose = [
  { icon: "fa-star", title: "Highly Vetted Childminders", description: "Each professional is registered with Ready Kids and goes through rigorous screening to ensure warmth, nurturing and dedication." },
  { icon: "fa-person-circle-check", title: "Personalised Matchmaking", description: "Filter by location, availability and specialisms to find a childminder who fits your family's needs." },
  { icon: "fa-eye", title: "Transparent Profiles", description: "Compare qualifications, experience and reviews at a glance and chat directly to ask questions." },
  { icon: "fa-award", title: "Commitment to Quality", description: "Consistent inspections and CPD ensure excellence in every ReadyKids setting." },
  { icon: "fa-hand-holding-dollar", title: "Funding & Guidance", description: "We help you navigate Tax‑Free Childcare, Universal Credit and other schemes so you maximise every opportunity." },
  { icon: "fa-shield-heart", title: "Peace of Mind", description: "Robust safeguarding and low adult‑child ratios create a safe, loving environment for children to flourish." },
];

const approach = [
  { icon: "fa-people-group", title: "Personalised Care", description: "Full‑time, part‑time or wraparound care—our childminders adapt to your lifestyle and your child's developmental stage." },
  { icon: "fa-user-graduate", title: "Qualified Professionals", description: "All ReadyKids carers are trained in EYFS, safeguarding and paediatric first aid, ensuring the highest standards of care." },
  { icon: "fa-chart-line", title: "Continuous Improvement", description: "Ongoing professional development keeps our childminders abreast of the latest educational approaches and legislation." },
];

const howItWorks = [
  { icon: "fa-search", title: "Browse", description: "Search our network by location, hours and specialisms to find options that suit your family." },
  { icon: "fa-id-badge", title: "Review", description: "Read detailed profiles covering experience, qualifications and parent reviews to make an informed choice." },
  { icon: "fa-handshake", title: "Connect", description: "Message childminders directly and arrange a meeting to discuss expectations and ensure a perfect fit." },
  { icon: "fa-thumbs-up", title: "Ongoing Support", description: "After you've chosen, we continue monitoring and supporting the relationship so your child always receives exceptional care." },
];

const resources = [
  { title: "Guides & Articles", description: "Understand the EYFS framework and get tips on supporting your child's development at home." },
  { title: "Funding & Entitlements", description: "Learn about government schemes like Tax‑Free Childcare and Universal Credit and how to access them." },
  { title: "Parenting Tips", description: "Find advice on work‑life balance, emotional wellbeing and communicating with your childminder." },
];

const faqs = [
  { question: "How do I choose the right childminder?", answer: "Use our filters to select by location, availability and expertise. We also provide support during the decision process to ensure the best fit for your family." },
  { question: "Are ReadyKids childminders registered with Ready Kids?", answer: "Yes. All professionals meet strict standards set by Ready Kids and the Early Years Foundation Stage (EYFS) framework for quality and safety." },
  { question: "What is the EYFS framework?", answer: "The Early Years Foundation Stage sets out key areas of learning and development for children up to five. It ensures a well‑rounded, developmentally appropriate education." },
  { question: "How can I access funding for childcare?", answer: "ReadyKids guides you through schemes such as Universal Credit, Tax‑Free Childcare and Early Education Funding so you can make the most of every benefit available." },
];

const Parents = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="absolute inset-0 z-0">
            <img src={parentsImage} alt="Parents and childminder" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>
          <div className="relative z-10 text-center text-primary-foreground px-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">Find the Perfect Childminder for Your Family</h1>
            <p className="text-xl lg:text-2xl opacity-90 mb-10">Discover caring professionals who put your child's learning, health and happiness first.</p>
            <NavLink to="/apply">
              <Button size="lg" className="text-lg px-8 py-6">Get Started</Button>
            </NavLink>
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-12">Why Choose ReadyKids?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChoose.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className={`fa-solid ${item.icon} text-2xl text-primary`}></i>
                    </div>
                    <CardTitle className="font-poppins">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">Our Childminding Approach</h2>
            <p className="text-lg opacity-80 text-center max-w-3xl mx-auto mb-12">
              Every child deserves a nurturing, safe and stimulating environment tailored to their individual needs. Our approach goes beyond regulations, focusing on strong relationships and opportunities to learn through play.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {approach.map((item, index) => (
                <Card key={index} className="bg-card text-card-foreground text-center">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className={`fa-solid ${item.icon} text-2xl text-primary`}></i>
                    </div>
                    <CardTitle className="font-poppins">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className={`fa-solid ${item.icon} text-2xl text-primary`}></i>
                    </div>
                    <CardTitle className="font-poppins">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">Parent Resources</h2>
            <p className="text-lg opacity-80 text-center max-w-3xl mx-auto mb-12">
              Navigating childcare can be overwhelming. Our resource centre is packed with guides, articles and funding information to help you make confident decisions.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {resources.map((item, index) => (
                <Card key={index} className="bg-card text-card-foreground">
                  <CardHeader>
                    <CardTitle className="font-poppins">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-poppins text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{faq.answer}</CardDescription>
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

export default Parents;
