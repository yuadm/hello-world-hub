import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import heroImage from "@/assets/hero.jpg";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="Contact Us" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>
          <div className="relative z-10 text-center text-primary-foreground px-4 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">Contact Us</h1>
            <p className="text-xl lg:text-2xl opacity-90">Have a question? We're here to help.</p>
          </div>
        </section>

        {/* Contact Form & Details */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-poppins text-2xl">Get in Touch</CardTitle>
                  <p className="text-muted-foreground">Send us a message and our team will respond promptly.</p>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">How can we help you?</Label>
                      <Input id="subject" placeholder="Subject" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message..." rows={5} />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-poppins text-2xl">Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold font-poppins mb-1">Email</h4>
                        <p className="text-muted-foreground">admin@readykids.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold font-poppins mb-1">Phone</h4>
                        <p className="text-muted-foreground">(123) 456‑7890</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold font-poppins mb-1">Visit Us</h4>
                        <p className="text-muted-foreground">
                          108 Regent Studio, 1 Thane Villas<br />
                          London, N7 7PH
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold font-poppins mb-1">Hours</h4>
                        <p className="text-muted-foreground">
                          Monday–Friday: 9 am – 6 pm<br />
                          Saturday–Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
