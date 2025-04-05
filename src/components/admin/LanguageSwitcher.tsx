
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from '@/hooks/use-translations';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations();

  const handleLanguageChange = (value: string) => {
    console.log('Language change requested:', value);
    setLanguage(value as 'de' | 'en');
  };

  return (
    <div className="flex items-center">
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] h-9 border-orange-400 border-2">
          <SelectValue placeholder={t('common.language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="de">Deutsch</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
