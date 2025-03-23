
import React, { useEffect } from 'react';
import FormFields from './poem/FormFields';
import SubmitButton from './poem/SubmitButton';
import { usePoemForm } from '@/hooks/use-poem-form';
import { useLocation } from 'react-router-dom';

const PoemForm = () => {
  const location = useLocation();
  const { form, isLoading, handleSubmit } = usePoemForm();
  
  // Check if we're returning from preview page and have form data to restore
  useEffect(() => {
    if (location.state?.returnFromPreview && location.state?.formData) {
      // If we have form data in state, reset the form with this data
      form.reset(location.state.formData);
    }
  }, [location.state, form]);

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
