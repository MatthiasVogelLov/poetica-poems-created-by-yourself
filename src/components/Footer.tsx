
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

const Footer = () => {
  // Function to scroll to top when clicking on certain links
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const { language } = useLanguage();
  const { t } = useTranslations();

  // Get appropriate paths and labels based on current language
  const paths = {
    poems: language === 'en' ? '/en/poemsland' : '/poemsland',
    help: language === 'en' ? '/en/help' : '/hilfe',
    contact: language === 'en' ? '/en/contact' : '/kontakt',
    admin: '/admin'
  };

  return (
    <footer className="py-6 sm:py-10 border-t bg-white">
      <div className="container-wide px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to={language === 'en' ? '/en' : '/'} className="font-serif text-xl font-medium" onClick={scrollToTop}>
              Poetica
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 text-xs sm:text-sm text-muted-foreground">
            <Link to={paths.poems} className="hover:text-foreground transition-colors" onClick={scrollToTop}>
              PoemsLand
            </Link>
            <Link to={paths.help} className="hover:text-foreground transition-colors" onClick={scrollToTop}>
              {t('header.help')}
            </Link>
            <Link to={paths.contact} className="hover:text-foreground transition-colors" onClick={scrollToTop}>
              {t('header.contact')}
            </Link>
            <Link to={paths.admin} className="hover:text-foreground transition-colors" onClick={scrollToTop}>
              Admin
            </Link>
            <a href="https://www.instagram.com/poetica_poems_by_yourself/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Instagram size={16} className="text-primary" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
