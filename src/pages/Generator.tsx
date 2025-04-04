
import React, { useEffect } from 'react';
import Header from '../components/Header';
import PoemForm from '../components/PoemForm';
import HeaderContent from '../components/generator/HeaderContent';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const Generator = () => {
  const location = useLocation();
  const { language } = useLanguage();
  
  // Send notification to admin when a poem is generated
  useEffect(() => {
    const notifyAdmin = async () => {
      if (location.state?.generatedPoem) {
        try {
          console.log('Sending admin notification about new poem:', location.state.generatedPoem.title);
          
          // Get editor preferences if available
          const editorPreferences = localStorage.getItem('poemEditorPreferences');
          const parsedPreferences = editorPreferences ? JSON.parse(editorPreferences) : null;

          // Send notification to admin about new poem
          const {
            data,
            error
          } = await supabase.functions.invoke('notify-poem', {
            body: {
              poemTitle: location.state.generatedPoem.title,
              poemContent: location.state.generatedPoem.poem,
              formData: {
                ...location.state.formData,
                language // Add language to the notification
              },
              editorPreferences: parsedPreferences
            }
          });
          
          if (error) {
            console.error('Error sending admin notification:', error);
            return;
          }
          console.log('Admin notification sent successfully:', data);
          
          // We're not saving to user_poems here anymore as this is done in Preview page
          // when poem is fully unlocked (paid).
        } catch (error) {
          console.error('Failed to process poem:', error);
        }
      }
    };
    notifyAdmin();
  }, [location.state, language]);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20 bg-white">
        <div className="container-narrow">
          <HeaderContent />
          <PoemForm />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Generator;
