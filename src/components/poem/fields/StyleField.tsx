
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

interface StyleFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const StyleField: React.FC<StyleFieldProps> = ({ form }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const styleOptions: SelectOption[] = language === 'en' ? [
    { value: 'klassisch', label: 'Classical' },
    { value: 'modern', label: 'Modern' },
    { value: 'romantisch', label: 'Romantic' },
    { value: 'humorvoll', label: 'Humorous' },
    { value: 'experimentell', label: 'Experimental' }
  ] : [
    { value: 'klassisch', label: 'Klassisch' },
    { value: 'modern', label: 'Modern' },
    { value: 'romantisch', label: 'Romantisch' },
    { value: 'humorvoll', label: 'Humorvoll' },
    { value: 'experimentell', label: 'Experimentell' }
  ];

  return (
    <div>
      <div className="mb-2">
        <span className="text-sm font-medium">{t('generator.style')}</span>
      </div>
      
      <SelectField
        form={form}
        name="style"
        label=""
        hideLabel={true}
        options={styleOptions}
        className="w-full"
      />
    </div>
  );
};

export default StyleField;
