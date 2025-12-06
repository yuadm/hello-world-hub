import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero.jpg";
import serviceBlocksImage from "@/assets/service-blocks.jpg";
import tutorImage from "@/assets/tutor.jpg";
import parentsImage from "@/assets/parents.jpg";

const tuitionServices = [
  { image: serviceBlocksImage, title: "Subject‑Focused Boost", description: "Target core subjects like Mathematics, English and Science to reinforce classroom learning and overcome specific challenges." },
  { image: tutorImage, title: "Language & Communication", description: "Develop speaking, listening and comprehension skills through engaging sessions in English or additional languages." },
  { image: parentsImage, title: "Primary Support", description: "Receive tailored assistance for Key Stages 1 & 2 in reading, writing and maths, ensuring children stay on track." },
  { image: heroImage, title: "Custom Programmes", description: "We work with tutors to design bespoke learning plans that address your child's unique goals and learning style." },
];

const therapyServices = [
  { image: parentsImage, title: "Occupational Therapy", description: "Help children develop motor skills and independence through engaging activities tailored to their needs." },
  { image: tutorImage, title: "Speech & Language", description: "Evidence‑based techniques improve articulation, language development and social communication." },
  { image: serviceBlocksImage, title: "Sign Language", description: "Promote inclusive communication through British Sign Language programmes offered alongside spoken language." },
  { image: heroImage, title: "Autism & SEN", description: "Specially trained carers support children with autism and special educational needs in structured, understanding environments." },
];

const sportKidsServices = [
  { title: "Early Skills", description: "Build coordination and motor skills through fun sports and arts activities designed for early years." },
  { title: "Primary Fundamentals", description: "Enhance athletic ability and confidence with structured sports training for older children." },
  { title: "Arts & Sports", description: "Combine dance, theatre, painting and sports to encourage balanced, creative expression." },
  { title: "Seasonal Camps", description: "Immersive camps and workshops during school holidays offer intensive skill‑building and memorable experiences." },
];

const nannyServices = [
  { image: parentsImage, title: "Flexible Pricing & Booking", description: "Set hours and fees that work for your schedule, with easy online booking and management." },
  { image: tutorImage, title: "Emergency Cover", description: "Access reliable care at short notice when unexpected events arise so your child is always safe." },
  { image: serviceBlocksImage, title: "Working Parents Support", description: "Nannies provide morning, after‑school and evening help to suit demanding family schedules." },
  { image: heroImage, title: "Types of Nannies", description: "Choose from full‑time, part‑time and specialist nannies trained in SEN, language development or postnatal care." },
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="Our Services" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>
          <div className="relative z-10 text-center text-primary-foreground px-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">Our Services</h1>
            <p className="text-xl lg:text-2xl opacity-90">Explore the specialist programmes and support we offer to enrich every child's learning and development.</p>
          </div>
        </section>

        {/* Tuition Centres */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">Tuition Centres</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
              Professional teaching spaces that deliver personalised, evidence‑based tuition to help children excel academically.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tuitionServices.map((service, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-poppins text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TherapyPlus */}
        <section className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">TherapyPlus</h2>
            <p className="text-lg opacity-80 text-center max-w-3xl mx-auto mb-12">
              Specialist therapeutic services integrated into daily care so every child can thrive academically, socially and emotionally.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {therapyServices.map((service, index) => (
                <Card key={index} className="bg-card text-card-foreground overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-poppins text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SportKids */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">SportKids</h2>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
              Dynamic programmes that blend physical activity and creative arts to foster holistic development.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sportKidsServices.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-futbol text-2xl text-primary"></i>
                    </div>
                    <CardTitle className="font-poppins">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Nannies */}
        <section className="py-16 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-poppins text-center mb-4">Nannies</h2>
            <p className="text-lg opacity-80 text-center max-w-3xl mx-auto mb-12">
              Professional in‑home care that adapts to your family's lifestyle—perfect for busy parents who need extra support.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nannyServices.map((service, index) => (
                <Card key={index} className="bg-card text-card-foreground overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-poppins text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
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

export default Services;
