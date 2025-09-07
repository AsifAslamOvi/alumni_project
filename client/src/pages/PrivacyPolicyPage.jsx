import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { ShieldCheck, FileText, UserCog } from 'lucide-react';

    const PrivacyPolicyPage = () => {
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
            <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-6" />
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold mb-4 text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Privacy Policy
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
            </motion.p>
            <p className="text-sm text-muted-foreground mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.section>

          <motion.section 
            className="container mx-auto px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <FileText className="mr-2 h-6 w-6" /> Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Welcome to the RUET Alumni Network. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
                <p>When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.</p>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section 
            className="container mx-auto px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <UserCog className="mr-2 h-6 w-6" /> Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We collect personal information that you voluntarily provide to us when registering on the website, expressing an interest in obtaining information about us or our products and services, when participating in activities on the website or otherwise contacting us.</p>
                <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect can include the following:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Name and Contact Data (e.g., email address, phone number, mailing address).</li>
                  <li>Academic and Professional Information (e.g., roll number, series, department, passing year, job title, company).</li>
                  <li>Credentials (e.g., passwords, password hints, and similar security information used for authentication and account access).</li>
                  <li>Profile Data (e.g., profile picture, bio, skills).</li>
                </ul>
                 <p>All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.</p>
              </CardContent>
            </Card>
          </motion.section>
          
           <motion.section 
            className="container mx-auto px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.</p>
                 <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>To facilitate account creation and logon process.</li>
                    <li>To send administrative information to you.</li>
                    <li>To manage user accounts.</li>
                    <li>To enable user-to-user communications.</li>
                    <li>To post testimonials (with your consent).</li>
                    <li>To request feedback.</li>
                    <li>To protect our Services.</li>
                    <li>To respond to legal requests and prevent harm.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.section>

          {/* Add more sections as needed: Sharing Your Information, Security of Your Information, Your Privacy Rights, Contact Us etc. */}

          <motion.section 
            className="container mx-auto px-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <p className="text-muted-foreground">For any questions regarding this privacy policy, please <a href="/contact" className="text-primary hover:underline">contact us</a>.</p>
          </motion.section>
        </div>
      );
    };

    export default PrivacyPolicyPage;