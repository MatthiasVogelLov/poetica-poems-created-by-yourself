import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="py-6 sm:py-10 border-t bg-slate-100">
      <div className="container-wide px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="font-serif text-xl font-medium">
              Poetica
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 text-xs sm:text-sm text-muted-foreground">
            <Link to="/hilfe" className="hover:text-foreground transition-colors">Hilfe</Link>
            <Link to="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link>
            <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;