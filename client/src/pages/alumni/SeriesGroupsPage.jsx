import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Users, Search, ChevronRight } from 'lucide-react';
    import { motion } from 'framer-motion';

    const SeriesGroupsPage = () => {
      const [allAlumni, setAllAlumni] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [registeredUsers, setRegisteredUsers] = useState([]);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch("http://localhost:5000/users");

                    const result = await response.json();
                    setRegisteredUsers(result);
                } catch (err) {
                    console.error("Failed to fetch users:", err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }, []); 

      useEffect(() => {
        // const registeredUsers = JSON.parse(localStorage.getItem('ruetAlumniRegisteredUsers')) || [];
        const verifiedAlumni = registeredUsers.filter(user => user.isVerified && user.role === 'alumni');
        
        // Add mock data for more variety if needed, ensuring no duplicates
        
        setAllAlumni(verifiedAlumni);
      }, [registeredUsers]);

      const seriesGroups = React.useMemo(() => {
        const groups = allAlumni.reduce((acc, alumni) => {
          const key = `${alumni.series}-${alumni.department}`;
          if (!acc[key]) {
            acc[key] = {
              series: alumni.series,
              department: alumni.department,
              count: 0,
              alumni: []
            };
          }
          acc[key].count++;
          acc[key].alumni.push(alumni);
          return acc;
        }, {});

        return Object.values(groups)
          .filter(group => 
            group.series.toLowerCase().includes(searchTerm.toLowerCase()) || 
            group.department.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) => {
            if (a.series === b.series) {
              return a.department.localeCompare(b.department);
            }
            return parseInt(b.series) - parseInt(a.series); // Newest series first
          });
      }, [allAlumni, searchTerm]);

      const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } }
      };
      
      const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: i => ({
          opacity: 1,
          scale: 1,
          transition: {
            delay: i * 0.05,
            duration: 0.3,
          },
        }),
      };

      if (isLoading) return <h1>loading...</h1>
      if(!allAlumni.length) return <h1>please wait...</h1>
      return (
        <div className="space-y-8 md:space-y-12 pb-12">
          <motion.section 
            className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-xl shadow-lg text-center"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold mb-4 text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Series & Department Groups
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Connect with alumni from your specific series and department. Explore shared experiences and opportunities.
            </motion.p>
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
              <Input
                type="text"
                placeholder="Search by Series or Department (e.g., 17 or CSE)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base w-full focus:shadow-outline-primary rounded-full"
              />
            </div>
          </motion.section>

          {seriesGroups.length > 0 ? (
            <motion.div 
              className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {seriesGroups.map((group, index) => (
                <motion.div key={`${group.series}-${group.department}`} custom={index} variants={cardVariants}>
                  <Card className="h-full transform transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">
                        {group.series} Series - {group.department}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {group.count} {group.count === 1 ? 'Alumnus' : 'Alumni'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground mb-4">
                        Connect with your batchmates and department peers.
                      </p>
                      {/* In a full implementation, this link would go to a page filtered for this specific group */}
                      <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                        <Link to={`/alumni?series=${group.series}&department=${group.department}`}>
                          View Members <ChevronRight size={16} className="ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16 container mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Users size={64} className="mx-auto text-muted-foreground mb-6" />
              <p className="text-2xl font-semibold text-foreground mb-2">No Groups Found</p>
              <p className="text-muted-foreground">Try adjusting your search term or check back later as more alumni join.</p>
            </motion.div>
          )}
        </div>
      );
    };

    export default SeriesGroupsPage;