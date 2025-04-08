
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoemForm } from '@/hooks/use-poem-form';
import FormFields from './poem/FormFields';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PoemForm: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { form, isLoading, handleSubmit: originalHandleSubmit } = usePoemForm();
  
  const handleFormSubmit = form.handleSubmit(async (formData) => {
    setIsGenerating(true);
    
    try {
      console.log('Generating poem with:', formData);
      
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-poem', {
        body: {
          ...formData,
          language: 'english' // Specify English language
        }
      });
      
      if (error) {
        console.error('Error generating poem:', error);
        toast.error('Error generating poem. Please try again.');
        setIsGenerating(false);
        return;
      }
      
      if (!data || !data.poem || !data.title) {
        console.error('Invalid poem data received:', data);
        toast.error('Error generating poem. Please try again.');
        setIsGenerating(false);
        return;
      }
      
      // Store the current poem data in localStorage for recovery
      localStorage.setItem('currentPoemData', JSON.stringify({
        title: data.title,
        poem: data.poem,
        formData
      }));
      
      // Navigate to preview page
      navigate('/en/preview', {
        state: {
          generatedPoem: {
            title: data.title,
            poem: data.poem
          },
          formData
        }
      });
      
    } catch (error) {
      console.error('Error in poem generation:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <FormFields form={form} />
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full py-3 text-base" 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Poem...
              </>
            ) : (
              'Generate Poem'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PoemForm;
