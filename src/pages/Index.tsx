import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import ValuesSection from "@/components/home/ValuesSection";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import ValueProposition from "@/components/home/ValueProposition";
import Testimonials from "@/components/home/Testimonials";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section id="home">
          <Hero />
        </section>
        <ValuesSection />
        <WhatWeOffer />
        <ValueProposition />
        <section id="contact">
          <Testimonials />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
