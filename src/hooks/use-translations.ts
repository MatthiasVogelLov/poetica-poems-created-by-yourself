
import { useLanguage } from '@/contexts/LanguageContext';
import deTranslations from '../locales/de.json';
import enTranslations from '../locales/en.json';

export const useTranslations = () => {
  const { language } = useLanguage();
  
  const translations = language === 'en' ? enTranslations : deTranslations;
  
  const t = (key: string) => {
    // Split the key by dot notation (e.g., "common.appName")
    const keys = key.split('.');
    
    // Traverse the translations object using the keys
    let result: any = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // If the key doesn't exist in translations, return the key itself
        return key;
      }
    }
    
    return result;
  };
  
  return { t, language };
};
