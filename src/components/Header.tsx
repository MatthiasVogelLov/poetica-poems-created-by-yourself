import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
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
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/generator" className="text-base transition-all duration-200 hover:text-primary font-medium">
            Gedicht erstellen
          </NavLink>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[200px]">
                    <NavLink to="/impressum" className="text-sm hover:text-primary transition-colors">
                      Impressum
                    </NavLink>
                    <NavLink to="/datenschutz" className="text-sm hover:text-primary transition-colors">
                      Datenschutz
                    </NavLink>
                    <NavLink to="/agb" className="text-sm hover:text-primary transition-colors">
                      AGB
                    </NavLink>
                    <NavLink to="/kontakt" className="text-sm hover:text-primary transition-colors">
                      Kontakt
                    </NavLink>
                    <NavLink to="/admin" className="text-sm hover:text-primary transition-colors">
                      Admin
                    </NavLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Mobile menu button */}
        <button onClick={toggleMenu} className="md:hidden p-2 focus:outline-none" aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}>
          {isMenuOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md animate-fade-in">
          <div className="py-5 px-8 flex flex-col space-y-4">
            <NavLink to="/generator" onClick={() => setIsMenuOpen(false)} className="text-base py-2 transition-all duration-200 font-medium">
              Gedicht erstellen
            </NavLink>
            <NavLink to="/impressum" onClick={() => setIsMenuOpen(false)} className="text-base py-2 transition-all duration-200">
              Impressum
            </NavLink>
            <NavLink to="/datenschutz" onClick={() => setIsMenuOpen(false)} className="text-base py-2 transition-all duration-200">
              Datenschutz
            </NavLink>
            <NavLink to="/agb" onClick={() => setIsMenuOpen(false)} className="text-base py-2 transition-all duration-200">
              AGB
            </NavLink>
            <NavLink to="/kontakt" onClick={() => setIsMenuOpen(false)} className="text-base py-2 transition-all duration-200">
              Kontakt
            </NavLink>
            <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className="text-base py-2 transition-all duration-200">
              Admin
            </NavLink>
          </div>
        </div>}
    </header>;
};
export default Header;