import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { Search, User, Briefcase, MapPin, Users, ChevronDown, ChevronUp } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

    const departments = ["All", "CE", "EEE", "ME", "CSE", "ETE", "IPE", "GCE", "URP", "Arch", "MTE", "CFPE", "BECM", "ESE"];

    const AlumniCard = ({ alumni }) => {
      const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
      };

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center space-x-4 p-4 bg-secondary/30">
              <Avatar className="h-16 w-16 border-2 border-primary/70 shadow-sm">
                <AvatarImage src={alumni.profilePhoto || `https://avatar.vercel.sh/${alumni.email}.png?size=64`} alt={alumni.name} />
                <AvatarFallback className="text-xl bg-primary/20 text-primary font-semibold">{getInitials(alumni.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl text-primary hover:text-primary/80 transition-colors">
                  <Link to={`/profile/${alumni.id}`}>{alumni.name}</Link>
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{alumni.department} - {alumni.passingYear}</CardDescription>
                 <CardDescription className="text-xs text-muted-foreground">Roll: {alumni.rollNo}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-sm">
              <div className="flex items-center text-foreground">
                <Briefcase size={16} className="mr-2 text-accent flex-shrink-0" />
                <span className="truncate">{alumni.currentJob || 'Not specified'}</span>
              </div>
              <div className="flex items-center text-foreground">
                <MapPin size={16} className="mr-2 text-accent flex-shrink-0" />
                <span className="truncate">{alumni.location || 'Not specified'}</span>
              </div>
              <Button asChild variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Link to={`/profile/${alumni.id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    const SeriesGroup = ({ series, alumniList, initiallyOpen = false }) => {
      const [isOpen, setIsOpen] = useState(initiallyOpen);
    
      return (
        <motion.div layout className="mb-8 rounded-xl overflow-hidden shadow-lg bg-card/50 border border-border">
          <motion.header 
            layout 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-4 sm:p-6 bg-secondary/50 hover:bg-secondary/70 cursor-pointer flex justify-between items-center transition-colors duration-200"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              {series} Series <span className="text-base font-normal text-muted-foreground">({alumniList.length} Alumni)</span>
            </h2>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={28} className={`text-primary transition-transform duration-200 ${isOpen ? '' : 'rotate-[-90deg]'}`} />
            </motion.div>
          </motion.header>
          <AnimatePresence>
            {isOpen && (
              <motion.section
                layout
                key="content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="p-4 sm:p-6"
              >
                {alumniList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {alumniList.map(alumni => (
                      <AlumniCard key={alumni.id} alumni={alumni} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No alumni found for this series with current filters.</p>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };
    
    const AlumniDirectoryPage = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const [allAlumni, setAllAlumni] = useState([]);
      const [departmentFilter, setDepartmentFilter] = useState("All");
      const [registeredUsers, setRegisteredUsers] = useState([]);
      const [isLoading, setIsLoading] = useState(false);

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
      
      console.log(registeredUsers);

      useEffect(() => {
        const verifiedAlumni = registeredUsers.filter(user => user.isVerified && user.role === 'alumni');
        setAllAlumni(verifiedAlumni);
      }, [registeredUsers]);
      

      const filteredAndGroupedAlumni = React.useMemo(() => {
        const filtered = allAlumni.filter(alumni =>
          (alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           alumni.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           alumni.currentJob?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (departmentFilter === "All" || alumni.department === departmentFilter)
        );

        const grouped = filtered.reduce((acc, alumni) => {
          const series = alumni.series || "Unknown Series";
          if (!acc[series]) {
            acc[series] = [];
          }
          acc[series].push(alumni);
          return acc;
        }, {});
        
        return Object.entries(grouped).sort(([seriesA], [seriesB]) => {
            if (seriesA === "Unknown Series") return 1;
            if (seriesB === "Unknown Series") return -1;
            return parseInt(seriesB) - parseInt(seriesA); 
        });

      }, [allAlumni, searchTerm, departmentFilter]);

      if(isLoading) return <h1>loading...</h1>

      return (
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-xl shadow-xl mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3 tracking-tight">Alumni Network</h1>
            <p className="text-lg text-muted-foreground mb-6">Explore and connect with RUET graduates across series and departments.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                <Input
                  type="text"
                  placeholder="Search by Name, Roll, Job..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-11 text-base w-full focus:shadow-outline-primary"
                />
              </div>
              <div className="w-full sm:w-auto">
                 <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="h-11 text-base w-full sm:w-[180px] focus:shadow-outline-primary">
                        <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                        {departments.map(dept => (
                            <SelectItem key={dept} value={dept} className="text-base">{dept}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {filteredAndGroupedAlumni.length > 0 ? (
            <AnimatePresence>
              {filteredAndGroupedAlumni.map(([series, alumniList], index) => (
                <SeriesGroup 
                  key={series} 
                  series={series} 
                  alumniList={alumniList}
                  initiallyOpen={index < 2} 
                />
              ))}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <Users size={64} className="mx-auto text-muted-foreground mb-6" />
              <p className="text-2xl font-semibold text-foreground mb-2">No Alumni Found</p>
              <p className="text-muted-foreground">Try adjusting your search terms or filters. If you've just registered, please wait for admin verification.</p>
            </motion.div>
          )}
        </div>
      );
    };

    export default AlumniDirectoryPage;