import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Briefcase, CalendarDays, Users, ShieldCheck, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={'/rlogo.svg'} alt="RUET Alumni Logo" className="h-10 w-10" />
          <span className="text-xl font-bold">RUET Alumni</span>
        </Link>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Button variant="link" asChild className="text-primary-foreground hover:text-accent px-2 md:px-3">
            <Link to="/">Home</Link>
          </Button>
          <Button variant="link" asChild className="text-primary-foreground hover:text-accent px-2 md:px-3">
            <Link to="/alumni">Alumni</Link>
          </Button>
          <Button variant="link" asChild className="text-primary-foreground hover:text-accent px-2 md:px-3">
            <Link to="/jobs">Jobs</Link>
          </Button>
          <Button variant="link" asChild className="text-primary-foreground hover:text-accent px-2 md:px-3">
            <Link to="/events">Events</Link>
          </Button>
          {/* {user && (
                <Button variant="link" asChild className="text-primary-foreground hover:text-accent px-2 md:px-3">
                  <Link to="/messages">Messages</Link>
                </Button>
              )} */}
          {user && user.role === 'admin' && (
            <Button variant="link" asChild className="text-primary-foreground hover:text-accent px-2 md:px-3">
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-accent">
                    <AvatarImage src={user.profilePicture || `https://avatar.vercel.sh/${user.email}.png?size=40`} alt={user.name || 'User'} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || 'Alumni User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile/me')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/messages')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin/verify-alumni')}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Verify Alumni</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button variant="secondary" asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="default" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;