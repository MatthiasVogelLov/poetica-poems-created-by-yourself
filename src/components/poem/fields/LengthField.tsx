
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

interface LengthFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const LengthField: React.FC<LengthFieldProps> = ({ form }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const lengthOptions: SelectOption[] = language === 'en' ? [
    { value: 'mittel', label: 'Medium (12-20 lines)' },
    { value: 'lang', label: 'Long (20-30 lines)' }
  ] : [
    { value: 'mittel', label: 'Mittel (12-20 Zeilen)' },
    { value: 'lang', label: 'Lang (20-30 Zeilen)' }
  ];

  return (
    <SelectField
      form={form}
      name="length"
      label={t('generator.length')}
      options={lengthOptions}
      className="w-full"
    />
  );
};

export default LengthField;
