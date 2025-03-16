
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormFields from './poem/FormFields';
import SubmitButton from './poem/SubmitButton';
import { PoemFormData, initialFormData } from '@/types/poem';

const PoemForm = () => {
  const [formData, setFormData] = useState<PoemFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to generate poem
    setTimeout(() => {
      setIsLoading(false);
      // For now, just navigate to preview with form data as state
      navigate('/preview', { state: { formData } });
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
        <FormFields formData={formData} onChange={handleChange} />
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
};

export default PoemForm;
