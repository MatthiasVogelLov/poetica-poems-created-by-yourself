
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import LanguageToggle from '../LanguageToggle';

const Footer: React.FC = () => {
  // Function to scroll to top when clicking on certain links
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="py-6 sm:py-10 border-t bg-white">
      <div className="container-wide px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/en" className="font-serif text-xl font-medium" onClick={scrollToTop}>
              Poetica
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 text-xs sm:text-sm text-muted-foreground">
            <Link to="/en/poemsland" className="hover:text-foreground transition-colors" onClick={scrollToTop}>PoemsLand</Link>
            <Link to="/en/help" className="hover:text-foreground transition-colors" onClick={scrollToTop}>Help</Link>
            <Link to="/en/contact" className="hover:text-foreground transition-colors" onClick={scrollToTop}>Contact</Link>
            <Link to="/en/admin" className="hover:text-foreground transition-colors" onClick={scrollToTop}>Admin</Link>
            <a href="https://www.instagram.com/poetica_poems_by_yourself/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Instagram size={16} className="text-primary" />
            </a>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
