import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to German, but check localStorage for saved preference
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferred_language');
    // Also check URL for language preference
    const isEnglishRoute = window.location.hash.includes('/en');
    
    if (isEnglishRoute) {
      return 'en';
    }
    
    return (savedLanguage === 'en' ? 'en' : 'de') as Language;
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    setIsAdmin(adminAuth === 'true');
  }, []);
  
  // Save language preference to localStorage when it changes
  const setLanguage = (lang: Language) => {
    console.log('Setting language to:', lang);
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
    
    // Handle route changes based on language
    if (lang === 'en') {
      // If we're switching to English and we're not already on an English route, redirect
      if (!window.location.hash.includes('/en/') && window.location.hash !== '#/en') {
        if (window.location.hash === '#/') {
          window.location.hash = '#/en';
        } else if (window.location.hash === '#/admin') {
          // For admin, keep the admin route but reload to update language
          window.location.hash = '#/admin';
          window.location.reload();
        } else {
          // Convert route to English equivalent
          const currentPath = window.location.hash.substring(1); // Remove the #
          const englishPath = currentPath.replace(/^\//, '/en/');
          window.location.hash = englishPath;
        }
      } else if (window.location.hash === '#/admin') {
        // For admin, reload to update language
        window.location.reload();
      }
    } else {
      // If we're switching to German and we're on an English route, redirect
      if (window.location.hash.includes('/en/')) {
        const currentPath = window.location.hash.substring(1); // Remove the #
        const germanPath = currentPath.replace('/en/', '/');
        window.location.hash = germanPath;
      } else if (window.location.hash === '#/en') {
        window.location.hash = '#/';
      } else if (window.location.hash === '#/admin') {
        // For admin, reload to update language
        window.location.reload();
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isAdmin, setIsAdmin }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
