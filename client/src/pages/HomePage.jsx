import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Users, Briefcase, CalendarCheck2, MessageSquare, Search, Building } from 'lucide-react';
    import { motion } from 'framer-motion';

    const FeatureCard = ({ icon, title, description, linkTo, linkText }) => (
      <motion.div
        whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="h-full transform transition-all duration-300 hover:shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="items-center text-center">
            <div className="p-3 rounded-full bg-primary text-primary-foreground mb-3">
              {React.createElement(icon, { size: 32 })}
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="mb-4 min-h-[40px]">{description}</CardDescription>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to={linkTo}>{linkText}</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );

    const HomePage = () => {
      const heroBackgroundImage = "/auditoriumt7mVyqt03z.jpg";

      return (
        <div className="text-center">
          <motion.section 
            className="py-20 md:py-32 bg-cover bg-center bg-no-repeat rounded-xl shadow-lg mb-16 p-8 relative overflow-hidden"
            style={{ backgroundImage: `url(${heroBackgroundImage})` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black/60 z-0"></div> {/* Overlay for text readability */}
            <div className="relative z-10">
              <motion.h1 
                className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Welcome to the RUET Alumni Network
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto drop-shadow-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Connect, Share, and Grow with your fellow Rajshahi University of Engineering & Technology graduates.
                Rediscover old friends, build new connections, and explore opportunities.
              </motion.p>
              <motion.div 
                className="space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                  <Link to="/register">Join Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-background/30 backdrop-blur-sm shadow-lg">
                  <Link to="/alumni">Explore Alumni</Link>
                </Button>
              </motion.div>
            </div>
          </motion.section>

          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-12 text-primary">Platform Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Users} 
                title="Alumni Directory" 
                description="Find and connect with alumni from various batches and departments."
                linkTo="/alumni"
                linkText="Browse Directory"
              />
              <FeatureCard 
                icon={Briefcase} 
                title="Job Board" 
                description="Discover career opportunities shared by fellow alumni and companies."
                linkTo="/jobs"
                linkText="View Jobs"
              />
              <FeatureCard 
                icon={CalendarCheck2} 
                title="Events & Reunions" 
                description="Stay updated on upcoming alumni events, webinars, and reunions."
                linkTo="/events"
                linkText="See Events"
              />
              <FeatureCard 
                icon={MessageSquare} 
                title="Networking" 
                description="Engage in meaningful conversations and build your professional network."
                linkTo="/profile/me" 
                linkText="Update Profile"
              />
              <FeatureCard 
                icon={Search} 
                title="Advanced Search" 
                description="Easily find alumni based on skills, location, industry, and more."
                linkTo="/alumni"
                linkText="Start Searching"
              />
               <FeatureCard 
                icon={Building} 
                title="Series Groups" 
                description="Connect with alumni from your specific series and department."
                linkTo="/series-groups"
                linkText="Find Your Group"
              />
            </div>
          </section>
          
          <section className="py-16 bg-secondary/50 rounded-xl shadow-inner">
             <h2 className="text-3xl font-bold mb-6 text-primary">Become a Part of Our Growing Community</h2>
             <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
               Whether you're looking to reconnect, find job opportunities, or share your experiences, the RUET Alumni Network is your platform.
             </p>
             <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/register">Register Today</Link>
              </Button>
          </section>
        </div>
      );
    };

    export default HomePage;