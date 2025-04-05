
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Hilfe = () => {
  const [content, setContent] = useState<string>('');
  const { language } = useLanguage();

  useEffect(() => {
    // Load content from localStorage based on language
    const contentKey = `admin_${language === 'en' ? 'help' : 'hilfe'}_${language}`;
    const savedContent = localStorage.getItem(contentKey);
    
    // Set default content based on language
    const defaultContent = language === 'en'
      ? 'Here you can find help on using Poetica.'
      : 'Hier finden Sie Hilfe zur Nutzung von Poetica.';
    
    setContent(savedContent || defaultContent);
  }, [language]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto">
            <h1 className="heading-lg mb-10">
              {language === 'en' ? 'Help' : 'Hilfe'}
            </h1>
            
            <div className="prose max-w-none">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Here you can find help on using Poetica.'
                    : 'Hier finden Sie Hilfe zur Nutzung von Poetica.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Hilfe;
