import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const SetupPage = () => {
  const [formData, setFormData] = useState({
    name: 'Admin',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'Passwords do not match' });
      return;
    }

    const adminUser = {
      id: 'admin-' + Date.now(),
      ...formData,
      phoneNo: '',
      address: 'RUET, Rajshahi',
      series: '00',
      section: 'N/A',
      rollNo: '000000',
      department: 'Administration',
      passingYear: new Date().getFullYear().toString(),
      isVerified: true,
      role: 'admin',
      createdAt: new Date().toISOString(),
      currentJob: 'System Administrator',
      currentCompany: 'RUET',
      skills: [],
      profilePhoto: '',
      coverPhoto: ''
    };

    localStorage.setItem('ruetAlumniRegisteredUsers', JSON.stringify([adminUser]));
    toast({ title: 'Setup Complete', description: 'Admin account created successfully' });
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Initial Setup</h1>
        <p className="text-muted-foreground text-center">
          Create your admin account to get started
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>
          <Button type="submit" className="w-full">
            Complete Setup
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SetupPage;