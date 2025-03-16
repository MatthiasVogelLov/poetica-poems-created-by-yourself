
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import FormFields from './poem/FormFields';
import SubmitButton from './poem/SubmitButton';
import { PoemFormData, initialFormData } from '@/types/poem';

const PoemForm = () => {
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 animate-fade-in">
        <FormFields form={form} />
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

export default PoemForm;
