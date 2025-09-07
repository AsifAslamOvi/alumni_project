import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, CalendarCheck, ShieldCheck, Settings } from 'lucide-react'; // Added Settings for example
import { motion } from 'framer-motion';

const AdminDashboardPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Platform stats (sourced from backend when possible)
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [verifiedAlumni, setVerifiedAlumni] = useState(0);
  const [pendingAlumni, setPendingAlumni] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [pendingJobs, setPendingJobs] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [pendingEvents, setPendingEvents] = useState(0);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    let pollingId = null;

    async function fetchStats() {
      try {
        // Fetch users, jobs, events in parallel
        const [usersRes, jobsRes, eventsRes] = await Promise.all([
          fetch(`${apiBase}/users`),
          fetch(`${apiBase}/jobs`),
          fetch(`${apiBase}/events`),
        ]);

        let users = [];
        let jobs = [];
        let events = [];

        if (usersRes.ok) users = await usersRes.json();
        if (jobsRes.ok) jobs = await jobsRes.json();
        if (eventsRes.ok) events = await eventsRes.json();

        // If any fetch failed, fallback to localStorage for that dataset
        if (!usersRes.ok) {
          users = JSON.parse(localStorage.getItem('ruetAlumniRegisteredUsers')) || [];
        }
        if (!jobsRes.ok) {
          jobs = JSON.parse(localStorage.getItem('ruetAlumniJobs')) || [];
        }
        if (!eventsRes.ok) {
          events = JSON.parse(localStorage.getItem('ruetAlumniEvents')) || [];
        }

        const verified = users.filter(u => u.isVerified && u.role === 'alumni');
        const pending = users.filter(u => !u.isVerified && u.role === 'alumni');

        setTotalRegistered(users.length);
        setVerifiedAlumni(verified.length);
        setPendingAlumni(pending.length);

        setTotalJobs(jobs.length);
        setPendingJobs((jobs || []).filter(j => !j.isVerified).length);

        setTotalEvents(events.length);
        setPendingEvents((events || []).filter(e => !e.isVerified).length);
      } catch (err) {
        // Fallback to localStorage for all if something goes wrong
        console.error('Error fetching platform stats, falling back to localStorage:', err);
        const users = JSON.parse(localStorage.getItem('ruetAlumniRegisteredUsers')) || [];
        const jobs = JSON.parse(localStorage.getItem('ruetAlumniJobs')) || [];
        const events = JSON.parse(localStorage.getItem('ruetAlumniEvents')) || [];

        const verified = users.filter(u => u.isVerified && u.role === 'alumni');
        const pending = users.filter(u => !u.isVerified && u.role === 'alumni');

        setTotalRegistered(users.length);
        setVerifiedAlumni(verified.length);
        setPendingAlumni(pending.length);

        setTotalJobs(jobs.length);
        setPendingJobs((jobs || []).filter(j => !j.isVerified).length);

        setTotalEvents(events.length);
        setPendingEvents((events || []).filter(e => !e.isVerified).length);
      }
    }

    fetchStats();

    const onFocus = () => fetchStats();
    window.addEventListener('focus', onFocus);
    pollingId = setInterval(fetchStats, 60000);

    return () => {
      window.removeEventListener('focus', onFocus);
      if (pollingId) clearInterval(pollingId);
    };
  }, []);

  const adminActions = [
    {
      title: "Verify Alumni",
      description: "Approve or reject new alumni registrations.",
      link: "/admin/verify-alumni",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 hover:bg-blue-500/20"
    },
    {
      title: "Manage Job Postings",
      description: "Review and approve job postings from alumni.",
      link: "/admin/verify-jobs",
      icon: Briefcase,
      color: "text-green-500",
      bgColor: "bg-green-500/10 hover:bg-green-500/20"
    },
    {
      title: "Manage Event Postings",
      description: "Review and approve event announcements.",
      link: "/admin/verify-events",
      icon: CalendarCheck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10 hover:bg-purple-500/20"
    },
    // Example of another admin action:
    // {
    //   title: "Site Settings",
    //   description: "Configure general website settings.",
    //   link: "/admin/settings", // This route would need to be created
    //   icon: Settings,
    //   color: "text-orange-500",
    //   bgColor: "bg-orange-500/10 hover:bg-orange-500/20"
    // },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-xl shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Admin Dashboard</h1>
            <p className="text-md text-muted-foreground">Manage and moderate the RUET Alumni Platform.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminActions.map((action, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.link} className="block h-full">
              <Card className={`h-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl ${action.bgColor} border-primary/20`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-xl font-semibold ${action.color}`}>{action.title}</CardTitle>
                  {React.createElement(action.icon, { className: `h-8 w-8 ${action.color} opacity-80` })}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <Card className="mt-8 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Platform Overview</CardTitle>
          <CardDescription>Quick statistics about the platform. (Data from backend; falls back to localStorage)</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatDisplay label="Total Registered Users" value={totalRegistered} />
          <StatDisplay label="Verified Alumni" value={verifiedAlumni} />
          <StatDisplay label="Pending Alumni Verification" value={pendingAlumni} />
          <StatDisplay label="Total Job Posts (All)" value={totalJobs} />
          <StatDisplay label="Pending Job Verifications" value={pendingJobs} />
          <StatDisplay label="Total Event Posts (All)" value={totalEvents} />
          <StatDisplay label="Pending Event Verifications" value={pendingEvents} />
        </CardContent>
      </Card>
    </div>
  );
};

const StatDisplay = ({ label, value }) => {
  return (
    <div className="bg-secondary/30 p-4 rounded-lg text-center">
      <p className="text-2xl font-bold text-primary">{typeof value === 'number' ? value : value ?? 0}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default AdminDashboardPage;