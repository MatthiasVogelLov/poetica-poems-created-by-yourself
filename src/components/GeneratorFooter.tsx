
import React from 'react';
import { Link } from 'react-router-dom';

const GeneratorFooter = () => {
  return (
    <footer className="py-10 border-t">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-sm text-muted-foreground">
            <Link to="/impressum" className="hover:text-foreground transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link>
            <Link to="/agb" className="hover:text-foreground transition-colors">AGB</Link>
            <Link to="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link>
            <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GeneratorFooter;
