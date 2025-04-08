
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/en/Header';
import PoemForm from '../../components/en/PoemForm';
import HeaderContent from '../../components/en/generator/HeaderContent';
import Footer from '../../components/en/Footer';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

const Generator = () => {
  const location = useLocation();
  
  // Send notification to admin when a poem is generated
  useEffect(() => {
    const notifyAdmin = async () => {
      if (location.state?.generatedPoem) {
        try {
          console.log('Sending admin notification about new English poem:', location.state.generatedPoem.title);
          
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
              formData: location.state.formData,
              editorPreferences: parsedPreferences,
              language: 'english'
            }
          });
          
          if (error) {
            console.error('Error sending admin notification:', error);
            return;
          }
          console.log('Admin notification sent successfully:', data);
        } catch (error) {
          console.error('Failed to process poem:', error);
        }
      }
    };
    notifyAdmin();
  }, [location.state]);
  
  return <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20 bg-white">
        <div className="container-narrow">
          <HeaderContent />
          <PoemForm />
        </div>
      </div>
      
      <Footer />
    </div>;
};

export default Generator;
