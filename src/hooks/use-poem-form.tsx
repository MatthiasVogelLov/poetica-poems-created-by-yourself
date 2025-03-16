
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PoemFormData, initialFormData } from '@/types/poem';

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
    
    // Simulate API call to generate poem
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to preview with form data as state
      navigate('/preview', { state: { formData: data } });
    }, 1500);
  };

  return {
    form,
    isLoading,
    handleSubmit
  };
}
