
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

interface VerseTypeFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const VerseTypeField: React.FC<VerseTypeFieldProps> = ({ form }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const verseTypeOptions: SelectOption[] = language === 'en' ? [
    { value: 'frei', label: 'Free Verse' },
    { value: 'paarreim', label: 'Paired Rhyme (AABB)' },
    { value: 'kreuzreim', label: 'Cross Rhyme (ABAB)' },
    { value: 'umarmenderreim', label: 'Embracing Rhyme (ABBA)' }
  ] : [
    { value: 'frei', label: 'Freie Verse' },
    { value: 'paarreim', label: 'Paarreim (AABB)' },
    { value: 'kreuzreim', label: 'Kreuzreim (ABAB)' },
    { value: 'umarmenderreim', label: 'Umarmender Reim (ABBA)' }
  ];

  return (
    <div>
      <div className="mb-2">
        <span className="text-sm font-medium">{t('generator.verseType')}</span>
      </div>
      
      <SelectField
        form={form}
        name="verseType"
        label=""
        hideLabel={true}
        options={verseTypeOptions}
        className="w-full"
      />
    </div>
  );
};

export default VerseTypeField;
