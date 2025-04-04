
import { toast } from "sonner";
import { 
  generateTitleFromOccasion, 
  getSamplePoem, 
  adjustPoemLength,
  personalizeWithKeywords 
} from './sample-poems';
import { savePoemDataToStorage } from './poem-storage';
import { useTranslations } from '@/hooks/use-translations';

// Function to handle paid poem retrieval
export const handlePaidPoemRetrieval = (
  setPoemTitle: (title: string) => void,
  setPoemContent: (content: string) => void,
  setIsGenerating: (isGenerating: boolean) => void,
  poemData: { title: string; poem: string; } | null,
  language = 'de'
): boolean => {
  console.log('Payment successful, retrieving poem data from localStorage');
  
  if (poemData) {
    setPoemTitle(poemData.title);
    setPoemContent(poemData.poem);
    setIsGenerating(false);
    
    // Notify user of successful unlock
    toast.success(language === 'en' ? "Poem successfully unlocked" : "Gedicht erfolgreich freigeschaltet", {
      description: language === 'en' ? "You can now save, print, or share it." : "Sie können es jetzt speichern, drucken oder teilen."
    });
    
    return true;
  } else {
    toast.error(language === 'en' ? "Error loading the poem" : "Fehler beim Laden des Gedichts", {
      description: language === 'en' ? "The saved data is incomplete or corrupted." : "Die gespeicherten Daten sind unvollständig oder beschädigt."
    });
    
    // If we get here, there was an error retrieving the poem data
    setIsGenerating(false);
    setPoemContent(language === 'en' 
      ? 'There was a problem loading your poem after payment. Please contact support.' 
      : 'Es gab ein Problem beim Laden Ihres Gedichts nach der Zahlung. Bitte kontaktieren Sie den Support.');
    return false;
  }
};

// Function to generate sample poem
export const generateSamplePoem = (
  formData: any,
  setPoemTitle: (title: string) => void,
  setPoemContent: (content: string) => void,
  setIsGenerating: (isGenerating: boolean) => void,
  language = 'de'
): void => {
  setIsGenerating(true);
  
  const { occasion, contentType, length, keywords } = formData;
  
  // Generate title based on occasion
  const title = generateTitleFromOccasion(occasion);
  setPoemTitle(title);

  try {
    setTimeout(() => {
      // Get sample poem based on content type
      const poem = getSamplePoem(contentType);
      
      // Adjust poem length
      let adjustedPoem = adjustPoemLength(poem, length);
      
      // Add personalization with keywords
      adjustedPoem = personalizeWithKeywords(adjustedPoem, keywords);
      
      setPoemContent(adjustedPoem);
      setIsGenerating(false);
      
      // Save to localStorage for payment flow
      savePoemDataToStorage(title, adjustedPoem);
    }, 1500);
  } catch (error) {
    console.error('Error generating poem:', error);
    setIsGenerating(false);
    setPoemContent(language === 'en'
      ? 'We\'re sorry, there was an error creating the poem. Please try again later.'
      : 'Es tut uns leid, beim Erstellen des Gedichts ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
  }
};
