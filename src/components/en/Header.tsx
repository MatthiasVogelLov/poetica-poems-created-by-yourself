
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLanguageSwitch = () => {
    // Get the current path and remove the "/en" prefix if present
    const currentPath = location.pathname;
    if (currentPath.startsWith('/en/')) {
      // Switch to German - remove the "/en" prefix
      navigate(`/${currentPath.substring(4)}`);
    } else if (currentPath === '/en') {
      // From English home to German home
      navigate('/');
    } else {
      // Switch to English - add the "/en" prefix
      navigate(`/en${currentPath}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/en" className="text-xl font-bold">Poetica</Link>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/en" className="text-gray-600 hover:text-primary">Home</Link>
            <Link to="/en/generator" className="text-gray-600 hover:text-primary">Generator</Link>
            <Link to="/en/poemsland" className="text-gray-600 hover:text-primary">PoemsLand</Link>
            <Link to="/en/help" className="text-gray-600 hover:text-primary">Help</Link>
            <Link to="/en/contact" className="text-gray-600 hover:text-primary">Contact</Link>
            
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <span>EN</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLanguageSwitch}>
                  Deutsch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
