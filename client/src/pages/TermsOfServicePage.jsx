import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { FileBadge, Users, ShieldAlert } from 'lucide-react';

    const TermsOfServicePage = () => {
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
            <FileBadge className="h-16 w-16 text-primary mx-auto mb-6" />
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold mb-4 text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Terms of Service
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Please read these terms carefully before using our service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
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
                  <Users className="mr-2 h-6 w-6" /> Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
                <p>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
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
                  <ShieldAlert className="mr-2 h-6 w-6" /> User Conduct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, the reputation of RUET Alumni Network, or the general business of RUET Alumni Network.</p>
                <p>You further agree not to use the Service:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>To harass, abuse, or threaten others or otherwise violate any person's legal rights.</li>
                  <li>To violate any intellectual property rights of RUET Alumni Network or any third party.</li>
                  <li>To upload or otherwise disseminate any computer viruses or other software that may damage the property of another.</li>
                  <li>To perpetrate any fraud.</li>
                  <li>To engage in or create any unlawful gambling, sweepstakes, or pyramid scheme.</li>
                  <li>To publish or distribute any obscene or defamatory material.</li>
                  <li>To publish or distribute any material that incites violence, hatred, or discrimination towards any group.</li>
                  <li>To unlawfully gather information about others.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.section>

          {/* Add more sections as needed: Intellectual Property, Termination, Limitation Of Liability, Governing Law, Changes, Contact Us etc. */}

          <motion.section 
            className="container mx-auto px-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <p className="text-muted-foreground">If you have any questions about these Terms, please <a href="/contact" className="text-primary hover:underline">contact us</a>.</p>
          </motion.section>
        </div>
      );
    };

    export default TermsOfServicePage;