
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PoemFormData, initialFormData } from '@/types/poem';
import { createClient } from '@supabase/supabase-js';

export function usePoemForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<PoemFormData>({
    defaultValues: initialFormData,
    mode: 'onSubmit',
  });
  
  const handleSubmit = async (data: PoemFormData) => {
    setIsLoading(true);
    
    // Check if any required fields are empty
    if (!data.audience || !data.occasion || !data.contentType || !data.style || !data.length) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle erforderlichen Felder aus.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Create Supabase client to call the edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase configuration is missing. Please check your environment variables.");
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      // Call our edge function
      const { data: responseData, error } = await supabase.functions.invoke('generate-poem', {
        body: data
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Navigate to preview with form data and generated poem
      navigate('/preview', { 
        state: { 
          formData: data,
          generatedPoem: responseData
        }
      });
    } catch (error) {
      console.error('Error generating poem:', error);
      toast({
        title: "Fehler",
        description: "Beim Erstellen des Gedichts ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleSubmit
  };
}
