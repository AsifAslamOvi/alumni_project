
    import React, { useState,useEffect } from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Mail, Lock, Shield } from 'lucide-react';

    const AdminLoginPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [users,setUsers] = useState([]);
      const { login } = useAuth();
      const navigate = useNavigate();
      const location = useLocation();
      const { toast } = useToast();
      const from = location.state?.from?.pathname || "/admin";

        useEffect(() => {
      const fetchData = async () => {
          try {
              setIsLoading(true);
              const response = await fetch(
                  "http://localhost:5000/users"
              );
             
              const result = await response.json();
              setUsers(result);
          } catch (err) {
            console.error("Failed to fetch users:", err);
          } finally {
              setIsLoading(false);
          }
      };

      fetchData();
  }, []); 

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const foundAdmin = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === 'admin'
        );
        // This is a mock admin login. In a real app, this would be a secure backend call.
        if (foundAdmin && password === 'adminpass') {
          login({
              id: foundAdmin.id,
              name: foundAdmin.name,
              email: foundAdmin.email,
              role: "admin",
              isVerified: true,
          });
          toast({ title: "Admin Login Successful!", description: "Welcome, Administrator!" });
          navigate('/admin', { replace: true });
        } else {
          toast({
            variant: "destructive",
            title: "Admin Login Failed",
            description: "Invalid admin credentials.",
          });
        }
        setIsLoading(false);
      };

      if(isLoading) return <h1>loading...</h1>

      return (
        <div className="flex items-center justify-center py-12 min-h-[calc(100vh-15rem)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm border-2 border-primary">
              <CardHeader className="text-center">
                <Shield className="w-20 h-20 mx-auto mb-4 text-primary" />
                <CardTitle className="text-3xl font-bold text-primary">Admin Portal Login</CardTitle>
                <CardDescription>Access the RUET Alumni administration panel.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@ruet.ac.bd"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Admin Password</Label>
                     <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? 'Authenticating...' : 'Login as Admin'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" asChild className="text-sm text-muted-foreground p-0 h-auto">
                  <Link to="/login">Alumni Login</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default AdminLoginPage;
  