
import React from 'react';
import FormFields from './poem/FormFields';
import SubmitButton from './poem/SubmitButton';
import { usePoemForm } from '@/hooks/use-poem-form';

const PoemForm = () => {
  const { form, isLoading, handleSubmit } = usePoemForm();

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
