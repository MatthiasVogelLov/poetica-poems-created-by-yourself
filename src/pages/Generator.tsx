
import React, { useEffect } from 'react';
import Header from '../components/Header';
import PoemForm from '../components/PoemForm';
import HeaderContent from '../components/generator/HeaderContent';
import Footer from '../components/Footer';
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const Generator = () => {
  const location = useLocation();

  // If we have state from location, a poem was just created
  // Send notification to admin and save to user_poems
  useEffect(() => {
    const notifyAdmin = async () => {
      if (location.state?.generatedPoem) {
        try {
          console.log('Sending admin notification about new poem:', location.state.generatedPoem.title);

          // Send notification to admin about new poem
          const {
            data,
            error
          } = await supabase.functions.invoke('notify-poem', {
            body: {
              poemTitle: location.state.generatedPoem.title,
              poemContent: location.state.generatedPoem.poem,
              formData: location.state.formData
            }
          });
          if (error) {
            console.error('Error sending admin notification:', error);
            return;
          }
          console.log('Admin notification sent successfully:', data);
          
          // Save poem to user_poems table
          const { error: saveError } = await supabase
            .from('user_poems')
            .insert([
              {
                title: location.state.generatedPoem.title,
                content: location.state.generatedPoem.poem,
                occasion: location.state.formData.occasion,
                content_type: location.state.formData.contentType,
                style: location.state.formData.style,
                verse_type: location.state.formData.verseType,
                length: location.state.formData.length,
              }
            ]);
            
          if (saveError) {
            console.error('Error saving poem to database:', saveError);
            return;
          }
          
          toast.success('Gedicht wurde in PoemsLand gespeichert', {
            description: 'Sie können es jederzeit in PoemsLand ansehen.',
            duration: 5000,
          });
          
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
