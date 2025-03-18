
import React from 'react';
import Header from '../components/Header';
import PoemForm from '../components/PoemForm';
import HeaderContent from '../components/generator/HeaderContent';
import GeneratorFooter from '../components/GeneratorFooter';
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from 'react-router-dom';

const Generator = () => {
  const location = useLocation();
  
  // If we have state from location, a poem was just created
  // Send notification to admin
  React.useEffect(() => {
    const notifyAdmin = async () => {
      if (location.state?.generatedPoem) {
        try {
          // Send notification to admin about new poem
          await supabase.functions.invoke('notify-poem', {
            body: {
              poemTitle: location.state.generatedPoem.title,
              poemContent: location.state.generatedPoem.poem,
              formData: location.state.formData
            }
          });
          console.log('Admin notification sent');
        } catch (error) {
          console.error('Failed to send admin notification:', error);
        }
      }
    };
    
    notifyAdmin();
  }, [location.state]);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow">
          <HeaderContent />
          <PoemForm />
        </div>
      </div>
      
      <GeneratorFooter />
    </div>
  );
};

export default Generator;
