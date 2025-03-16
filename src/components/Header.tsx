import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'py-4 bg-white/80 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'}`}>
      <div className="container-wide flex items-center justify-between">
        <NavLink to="/" className="font-serif text-xl md:text-2xl font-medium transition-all duration-300 hover:opacity-70">
          Poetica
        </NavLink>
        
        <div className="hidden md:flex space-x-8 items-center">
          
          
          <button className="btn-primary">
            Anmelden
          </button>
        </div>
        
        {/* Mobile menu button */}
        <button onClick={toggleMenu} className="md:hidden p-2 focus:outline-none" aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}>
          {isMenuOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md animate-fade-in">
          <div className="py-5 px-8 flex flex-col space-y-4">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={({
          isActive
        }) => `text-base py-2 transition-all duration-200 ${isActive ? 'text-primary font-medium' : 'text-foreground/80'}`}>
              Startseite
            </NavLink>
            <NavLink to="/generator" onClick={() => setIsMenuOpen(false)} className={({
          isActive
        }) => `text-base py-2 transition-all duration-200 ${isActive ? 'text-primary font-medium' : 'text-foreground/80'}`}>
              Gedicht erstellen
            </NavLink>
            <button className="btn-primary mt-2 w-full">
              Anmelden
            </button>
          </div>
        </div>}
    </header>;
};
export default Header;