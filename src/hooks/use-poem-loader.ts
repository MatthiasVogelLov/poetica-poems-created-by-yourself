
import { useState, useEffect } from 'react';
import { getPoemDataFromStorage } from '../utils/poem-storage';
import { handlePaidPoemRetrieval, generateSamplePoem } from '../utils/poem-generator';

// Main hook for poem loading
export function usePoemLoader(isPaid: boolean, locationState: any, navigate: any) {
  const [poemTitle, setPoemTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Handle paid poem retrieval
    if (isPaid) {
      const poemData = getPoemDataFromStorage();
      handlePaidPoemRetrieval(setPoemTitle, setPoemContent, setIsGenerating, poemData);
      return;
    }

    // If not returning from payment, check location state
    if (!locationState || !locationState.formData) {
      console.log('No form data found, redirecting to generator');
      navigate('/generator');
      return;
    }

    if (locationState.generatedPoem) {
      console.log('Using generated poem from location state');
      const { title, poem } = locationState.generatedPoem;
      setPoemTitle(title);
      setPoemContent(poem);
      setIsGenerating(false);
    } else {
      generateSamplePoem(locationState.formData, setPoemTitle, setPoemContent, setIsGenerating);
    }
  }, [isPaid, locationState, navigate]);

  return {
    poemTitle,
    poemContent,
    isGenerating
  };
}
