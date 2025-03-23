
import React, { useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import FormFields from './poem/FormFields';
import SubmitButton from './poem/SubmitButton';
import { usePoemForm } from '@/hooks/use-poem-form';

const PoemForm = () => {
  const { form, isLoading, handleSubmit } = usePoemForm();
  const [showReturnMessage, setShowReturnMessage] = React.useState(false);
  
  // Check if we're returning to previously saved form data
  useEffect(() => {
    const savedData = localStorage.getItem('lastPoemFormData');
    if (savedData) {
      setShowReturnMessage(true);
      
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowReturnMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {showReturnMessage && (
        <Alert className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Ihre vorherigen Einstellungen wurden wiederhergestellt. Sie können das Formular ändern und erneut absenden.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 animate-fade-in">
        <FormFields form={form} />
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

export default PoemForm;
