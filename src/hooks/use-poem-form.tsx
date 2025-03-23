
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PoemFormData, initialFormData } from '@/types/poem';
import { supabase } from '@/integrations/supabase/client';
import { findPoemInCache, addPoemToCache } from '@/utils/poem-cache';
import { savePoemDataToStorage } from '@/utils/poem-storage';

const saveFormData = (data: PoemFormData) => {
  localStorage.setItem('lastPoemFormData', JSON.stringify(data));
};

const loadFormData = (): PoemFormData | null => {
  const savedData = localStorage.getItem('lastPoemFormData');
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (error) {
      console.error('Error parsing saved form data:', error);
    }
  }
  return null;
};

export function usePoemForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const savedFormData = loadFormData() || initialFormData;
  
  const form = useForm<PoemFormData>({
    defaultValues: savedFormData,
    mode: 'onSubmit',
  });
  
  useEffect(() => {
    if (location.state?.clearForm) {
      localStorage.removeItem('lastPoemFormData');
      form.reset(initialFormData);
    }
  }, [location.state, form]);
  
  const handleSubmit = async (data: PoemFormData) => {
    setIsLoading(true);
    
    saveFormData(data);
    
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
      // First check if we have a cached poem
      const cachedPoem = findPoemInCache(data);
      
      if (cachedPoem) {
        console.log('Using cached poem:', cachedPoem.title);
        
        // Save to localStorage for payment flow
        savePoemDataToStorage(cachedPoem.title, cachedPoem.poem);
        
        // Track cache hit
        try {
          await supabase.functions.invoke('track-stats', {
            body: {
              action: 'poem_cache_hit',
              data: {
                audience: data.audience,
                occasion: data.occasion,
                contentType: data.contentType,
                style: data.style,
                length: data.length,
                keywords: data.keywords
              }
            }
          });
        } catch (trackError) {
          console.error('Error tracking poem cache hit:', trackError);
        }
        
        // Navigate to preview with cached poem
        navigate('/preview', { 
          state: { 
            formData: data,
            generatedPoem: {
              title: cachedPoem.title,
              poem: cachedPoem.poem
            },
            fromCache: true
          }
        });
        setIsLoading(false);
        return;
      }
      
      // No cache hit, generate a new poem
      const { data: responseData, error } = await supabase.functions.invoke('generate-poem', {
        body: data
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Add the newly generated poem to the cache
      addPoemToCache(
        responseData.title,
        responseData.poem,
        data
      );
      
      try {
        await supabase.functions.invoke('track-stats', {
          body: {
            action: 'poem_generated',
            data: {
              audience: data.audience,
              occasion: data.occasion,
              contentType: data.contentType,
              style: data.style,
              length: data.length,
              keywords: data.keywords
            }
          }
        });
        
        if (data.keywords) {
          await supabase.functions.invoke('track-stats', {
            body: {
              action: 'keyword_used',
              data: {
                keywords: data.keywords,
                poemId: responseData.id
              }
            }
          });
        }
      } catch (trackError) {
        console.error('Error tracking poem generation:', trackError);
      }
      
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
