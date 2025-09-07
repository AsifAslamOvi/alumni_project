import React from 'react';
    import { Link } from 'react-router-dom';
    import { Github, Linkedin, Facebook, Globe } from 'lucide-react';

    const Footer = () => {
      const currentYear = new Date().getFullYear();
      return (
        <footer className="bg-primary/90 text-primary-foreground mt-auto py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <p className="font-semibold text-lg mb-2">RUET Alumni Association</p>
                <p className="text-sm text-secondary-foreground">Connecting graduates, fostering community.</p>
                <img src="/rlogo.svg" alt="RUET Alumni Logo Small" className="h-12 w-12 mx-auto mt-2 opacity-80" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-2">Quick Links</p>
                <ul className="space-y-1">
                  <li><a href="https://www.ruet.ac.bd/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">RUET Official Website</a></li>
                  <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                  <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                   <li><Link to="/alumni" className="hover:text-accent transition-colors">Alumni Directory</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-lg mb-2">Connect With Us</p>
                <div className="flex justify-center space-x-4">
                  <a href="https://www.facebook.com/groups/647267059771872/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="RUET Alumni Facebook Group"><Facebook size={24} /></a>
                  <a href="https://www.ruet.ac.bd/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="RUET Official Website"><Globe size={24} /></a>
                  <a href="https://bd.linkedin.com/school/rajshahi-university-of-engineering-&-technology/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="RUET Alumni LinkedIn"><Linkedin size={24} /></a>
                </div>
              </div>
            </div>
            <div className="border-t border-secondary pt-4">
              <p className="text-sm text-secondary-foreground">
                &copy; {currentYear} RUET Alumni Association. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;