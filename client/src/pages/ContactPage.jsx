import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Send, Mail, Phone, MapPin, Building, ExternalLink } from 'lucide-react';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapPreviewImage = "/Screenshot 2025-09-03 001637.png";
  const googleMapsLink = "https://maps.app.goo.gl/nXmBEWUcRCgwsf7z7";


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form Data Submitted:", formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
      className: "bg-green-500 text-white",
    });
    setFormData({ fullName: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } }
  };

  return (
    <div className="space-y-12 md:space-y-16 pb-12">
      <motion.section
        className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-xl shadow-lg text-center"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-4 text-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Get In Touch
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          We'd love to hear from you! Whether you have a question, suggestion, or just want to say hello, feel free to reach out.
        </motion.p>
      </motion.section>

      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Form */}
          <Card className="lg:col-span-2 shadow-xl bg-card/80 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <Send className="mr-2 h-6 w-6" /> Send us a Message
              </CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" placeholder="Your Name" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" placeholder="Message Subject" value={formData.subject} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Your message here..." value={formData.message} onChange={handleChange} required rows={5} />
                </div>
                <Button type="submit" className="w-full btn-primary-glow text-lg h-12" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information & Map */}
          <div className="space-y-8">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <Building className="mr-2 h-5 w-5" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1 h-5 w-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">RUET Alumni Association</p>
                    <p className="text-muted-foreground">Rajshahi University of Engineering & Technology</p>
                    <p className="text-muted-foreground">Talaimari, Rajshahi-6204, Bangladesh</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-accent flex-shrink-0" />
                  <a href="mailto:admin.ruet.ac.bd" className="text-muted-foreground hover:text-primary transition-colors">admin.ruet.ac.bd(example)</a>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-accent flex-shrink-0" />
                  <a href="tel:+8801234567890" className="text-muted-foreground hover:text-primary transition-colors">+880-123-4567890 (example)</a>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <MapPin className="mr-2 h-5 w-5" /> Find Us On Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="block aspect-video rounded-md overflow-hidden border border-border group relative">
                  <img src={mapPreviewImage} alt="Map showing RUET location" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" className="bg-background/80 text-foreground hover:bg-background gap-2">
                      <ExternalLink size={16} /> View on Google Maps
                    </Button>
                  </div>
                </a>
                <p className="text-xs text-muted-foreground mt-2 text-center">Click the map to view location on Google Maps.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactPage;