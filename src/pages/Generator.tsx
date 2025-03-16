import React from 'react';
import Header from '../components/Header';
import PoemForm from '../components/PoemForm';
const Generator = () => {
  return <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center mb-12">
            
            <h1 className="heading-lg mb-6 animate-slide-up">
              Gestalten Sie Ihr persönliches Gedicht
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{
            animationDelay: '100ms'
          }}>
              Wählen Sie die Optionen und fügen Sie persönliche Details hinzu, um ein einzigartiges Gedicht zu erstellen.
            </p>
          </div>
          
          <PoemForm />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-sm text-muted-foreground">
              <a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a>
              <a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a>
              <a href="/agb" className="hover:text-foreground transition-colors">AGB</a>
              <a href="/kontakt" className="hover:text-foreground transition-colors">Kontakt</a>
            </div>
          </div>
          
        </div>
      </footer>
    </div>;
};
export default Generator;