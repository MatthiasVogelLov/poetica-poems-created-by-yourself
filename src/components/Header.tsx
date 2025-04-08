
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'py-4 bg-white/80 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'}`}>
      <div className="container-wide flex items-center justify-between">
        <NavLink 
          to="/" 
          className="font-serif text-xl md:text-2xl font-medium transition-all duration-300 hover:opacity-70 text-black"
          onClick={scrollToTop}
        >
          Poetica
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
