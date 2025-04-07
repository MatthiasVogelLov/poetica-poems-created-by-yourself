
import { toast } from "sonner";
import { 
  generateTitleFromOccasion, 
  getSamplePoem, 
  adjustPoemLength,
  personalizeWithKeywords 
} from './sample-poems';
import { savePoemDataToStorage } from './poem-storage';

// Function to handle paid poem retrieval
export const handlePaidPoemRetrieval = (
  setPoemTitle: (title: string) => void,
  setPoemContent: (content: string) => void,
  setIsGenerating: (isGenerating: boolean) => void,
  poemData: { title: string; poem: string; } | null
): boolean => {
  console.log('Payment successful, retrieving poem data from localStorage');
  
  if (poemData) {
    setPoemTitle(poemData.title);
    setPoemContent(poemData.poem);
    setIsGenerating(false);
    
    // Notify user of successful unlock
    toast.success("Gedicht erfolgreich freigeschaltet", {
      description: "Sie können es jetzt speichern, drucken oder teilen."
    });
    
    return true;
  } else {
    toast.error("Fehler beim Laden des Gedichts", {
      description: "Die gespeicherten Daten sind unvollständig oder beschädigt."
    });
    
    // If we get here, there was an error retrieving the poem data
    setIsGenerating(false);
    setPoemContent('Es gab ein Problem beim Laden Ihres Gedichts nach der Zahlung. Bitte kontaktieren Sie den Support.');
    return false;
  }
};

// Function to generate sample poem
export const generateSamplePoem = (
  formData: any,
  setPoemTitle: (title: string) => void,
  setPoemContent: (content: string) => void,
  setIsGenerating: (isGenerating: boolean) => void
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
    setPoemContent('Es tut uns leid, beim Erstellen des Gedichts ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
  }
};
