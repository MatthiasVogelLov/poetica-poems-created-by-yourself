
import React from 'react';
import Header from '../components/Header';

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto">
            <h1 className="heading-lg mb-10">Datenschutz</h1>
            
            <div className="prose max-w-none">
              {/* Content will be filled in by the user */}
              <p className="text-muted-foreground">Platzhalter für Datenschutz Inhalt.</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-10 border-t">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="font-serif text-xl font-medium">Poetica</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-sm text-muted-foreground">
              <a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a>
              <a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a>
              <a href="/agb" className="hover:text-foreground transition-colors">AGB</a>
              <a href="/kontakt" className="hover:text-foreground transition-colors">Kontakt</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Poetica. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Datenschutz;
