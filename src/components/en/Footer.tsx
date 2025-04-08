
import React from 'react';
import { Link } from 'react-router-dom';
import LanguageToggle from '../LanguageToggle';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Poetica</h3>
            <p className="text-sm text-gray-600">
              Create personalized poems for any occasion with the help of AI.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/en" className="text-sm text-gray-600 hover:text-primary">Home</Link></li>
              <li><Link to="/en/generator" className="text-sm text-gray-600 hover:text-primary">Generator</Link></li>
              <li><Link to="/en/poemsland" className="text-sm text-gray-600 hover:text-primary">PoemsLand</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/en/help" className="text-sm text-gray-600 hover:text-primary">Help</Link></li>
              <li><Link to="/en/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/en/imprint" className="text-sm text-gray-600 hover:text-primary">Imprint</Link></li>
              <li><Link to="/en/privacy" className="text-sm text-gray-600 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/en/terms" className="text-sm text-gray-600 hover:text-primary">Terms & Conditions</Link></li>
              <li><LanguageToggle className="mt-4" /></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-sm text-center text-gray-600">
          &copy; {currentYear} Poetica. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
