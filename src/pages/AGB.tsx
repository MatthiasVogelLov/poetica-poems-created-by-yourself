
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AGB = () => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem('admin_agb');
    setContent(savedContent || 'Platzhalter für AGB Inhalt.');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto">
            <h1 className="heading-lg mb-10">AGB</h1>
            
            <div className="prose max-w-none">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-muted-foreground">Platzhalter für AGB Inhalt.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AGB;
