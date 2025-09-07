import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Target, BookOpen, Award, Users2 } from 'lucide-react';

const AboutPage = () => {
  const [registeredAlumniCount, setRegisteredAlumniCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(null);
  const [loadingAlumniCount, setLoadingAlumniCount] = useState(true);
  const aboutHeroImage = "/ruet-gateCj4mypRkaw.jpg";
  const universitySectionImage = "/department-of-architecture9hQN2P9q97 (1).jpg";
  const communityImage = "/ruet-shaheed-minar-a-favorite-place-of-ruet-students.jpg";

  useEffect(() => {
    // Try to get count from backend. Fall back to localStorage if request fails.
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    let pollingId = null;

    async function fetchVerifiedCount() {
      setLoadingAlumniCount(true);
      try {
        const res = await fetch(`${apiBase}/users`);
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
        const users = await res.json();
        const verifiedAlumni = Array.isArray(users)
          ? users.filter(u => u.isVerified && u.role === 'alumni')
          : [];
        setRegisteredAlumniCount(verifiedAlumni.length);
      } catch (err) {
        // Fallback: read from localStorage to avoid empty UX
        console.error('Error loading verified alumni from API, falling back to localStorage:', err);
        const allUsers = JSON.parse(localStorage.getItem('ruetAlumniRegisteredUsers')) || [];
        const verifiedAlumni = allUsers.filter(user => user.isVerified && user.role === 'alumni');
        setRegisteredAlumniCount(verifiedAlumni.length);
      } finally {
        setLoadingAlumniCount(false);
      }
    }

    async function fetchDepartmentCount() {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBase}/external/ruet-departments`);
        if (!res.ok) throw new Error('Failed to fetch departments');
        const json = await res.json();
        setDepartmentCount(json.count || 18);
      } catch (err) {
        console.error('Failed to fetch RUET departments, using fallback 18:', err);
        setDepartmentCount(18);
      }
    }

    fetchVerifiedCount();
    fetchDepartmentCount();

    // Refresh when user focuses the window (helps reflect admin changes quickly)
    const onFocus = () => fetchVerifiedCount();
    window.addEventListener('focus', onFocus);

    // Poll every 60s as a lightweight update strategy
    pollingId = setInterval(fetchVerifiedCount, 60000);

    return () => {
      window.removeEventListener('focus', onFocus);
      if (pollingId) clearInterval(pollingId);
    };
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } }
  };

  const StatCard = ({ icon, value, label }) => (
    <motion.div
      className="bg-card/70 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center border border-primary/20"
      variants={sectionVariants}
    >
      {React.createElement(icon, { className: "h-12 w-12 text-accent mx-auto mb-3" })}
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );

  return (
    <div className="space-y-16 md:space-y-24 pb-12">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 md:py-32 rounded-xl overflow-hidden shadow-xl"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="absolute inset-0 z-0">
          <img src={aboutHeroImage} alt="RUET Campus Overview" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4 text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            About RUET Alumni Network
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Fostering connections, celebrating achievements, and supporting the RUET legacy. We are a vibrant community dedicated to lifelong learning and mutual growth.
          </motion.p>
        </div>
      </motion.section>

      {/* Our University Section */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 flex items-center">
              <BookOpen className="h-10 w-10 mr-3 text-accent" /> Our University
            </h2>
            <p className="text-lg text-foreground mb-4">
              Rajshahi University of Engineering & Technology (RUET) is one of the leading public universities in Bangladesh, specializing in science, engineering, and technology.
            </p>
            <p className="text-muted-foreground mb-6">
              With a rich history of academic excellence, RUET has produced thousands of graduates who are making significant contributions worldwide. This platform aims to bring them together, creating a powerful network for professional and personal development. For the latest official information, please visit the RUET website.
            </p>
            <Button asChild size="lg" className="btn-primary-glow">
              <a href="https://www.ruet.ac.bd" target="_blank" rel="noopener noreferrer">Visit RUET Website</a>
            </Button>
          </div>
          <motion.div
            className="order-1 md:order-2 rounded-xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src={universitySectionImage} alt="RUET Academic Building - Department of Architecture" className="w-full h-auto object-cover aspect-video" />
          </motion.div>
        </div>
      </motion.section>

      {/* Our Mission & Vision Section */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-primary/20">
            <h3 className="text-2xl font-semibold text-accent mb-4 flex items-center">
              <Target className="h-8 w-8 mr-2" /> Our Mission
            </h3>
            <p className="text-muted-foreground">
              To build a strong, engaged global community of RUET alumni by providing a platform for connection, collaboration, and continuous learning. We aim to support alumni in their professional and personal endeavors and contribute to the advancement of RUET.
            </p>
          </div>
          <div className="bg-card/70 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-primary/20">
            <h3 className="text-2xl font-semibold text-accent mb-4 flex items-center">
              <Users className="h-8 w-8 mr-2" /> Our Vision
            </h3>
            <p className="text-muted-foreground">
              To be the premier network for RUET graduates, recognized for its impactful contributions to alumni success, the university's growth, and societal development. We envision a future where every RUET alumnus feels connected and empowered.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 text-center">Our Network at a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <StatCard icon={Users2} value={loadingAlumniCount ? '—' : `${registeredAlumniCount.toLocaleString()}+`} label="Verified Alumni" />
          <StatCard icon={BookOpen} value={departmentCount === null ? '—' : `${departmentCount}`} label="Departments (Official)" />
          <StatCard icon={Award} value="50+" label="Years of Excellence (Est.)" />
          <StatCard icon={Users} value="Multiple" label="Active Series Groups" />
        </div>
        <p className="text-center text-muted-foreground text-sm mt-6">Department count and years of excellence are based on official RUET information. For the most current data, please refer to the <a href="https://www.ruet.ac.bd" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">RUET Website</a>.</p>
      </motion.section>


      {/* Join Our Community Section */}
      <motion.section
        className="relative py-16 md:py-24 rounded-xl overflow-hidden shadow-xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="absolute inset-0 z-0">
          <img src={communityImage} alt="Alumni networking event with diverse group" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a recent graduate or a seasoned professional, the RUET Alumni Network offers valuable connections, resources, and opportunities. Become a part of our growing family today!
          </p>
          <Button asChild size="lg" className="btn-accent-glow">
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;