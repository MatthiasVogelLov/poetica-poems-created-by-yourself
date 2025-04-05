
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/use-translations';

interface OccasionFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const OccasionField: React.FC<OccasionFieldProps> = ({ form }) => {
  const { language } = useLanguage();
  const { t } = useTranslations();

  const occasionOptions: SelectOption[] = language === 'en' ? [
    { value: 'ostern', label: 'Easter' },
    { value: 'abschluss', label: 'Graduation' },
    { value: 'babyparty', label: 'Birth/Baby Shower' },
    { value: 'einzug', label: 'Moving In' },
    { value: 'geburtstag', label: 'Birthday' },
    { value: 'hochzeit', label: 'Wedding' },
    { value: 'junggesellenabschied', label: 'Bachelor Party' },
    { value: 'jubilaeum', label: 'Anniversary' },
    { value: 'kommunion', label: 'Communion' },
    { value: 'konfirmation', label: 'Confirmation' },
    { value: 'ruhestand', label: 'Retirement' },
    { value: 'scheidung', label: 'Divorce' },
    { value: 'schulanfang', label: 'First Day of School' },
    { value: 'taufe', label: 'Baptism' },
    { value: 'trauerfall', label: 'Bereavement' },
    { value: 'trennung', label: 'Separation' },
    { value: 'umzug', label: 'Moving' },
    { value: 'valentinstag', label: 'Valentine\'s Day' },
    { value: 'verlobung', label: 'Engagement' },
    { value: 'weihnachten', label: 'Christmas' },
    { value: 'andere', label: 'Other' }
  ] : [
    { value: 'ostern', label: 'Ostern' },
    { value: 'abschluss', label: 'Abschluss' },
    { value: 'babyparty', label: 'Geburt/Babyparty' },
    { value: 'einzug', label: 'Einzug' },
    { value: 'geburtstag', label: 'Geburtstag' },
    { value: 'hochzeit', label: 'Hochzeit' },
    { value: 'junggesellenabschied', label: 'Junggesellenabschied' },
    { value: 'jubilaeum', label: 'Jubiläum' },
    { value: 'kommunion', label: 'Kommunion' },
    { value: 'konfirmation', label: 'Konfirmation' },
    { value: 'ruhestand', label: 'Ruhestand' },
    { value: 'scheidung', label: 'Scheidung' },
    { value: 'schulanfang', label: 'Schulanfang' },
    { value: 'taufe', label: 'Taufe' },
    { value: 'trauerfall', label: 'Trauerfall' },
    { value: 'trennung', label: 'Trennung' },
    { value: 'umzug', label: 'Umzug' },
    { value: 'valentinstag', label: 'Valentinstag' },
    { value: 'verlobung', label: 'Verlobung' },
    { value: 'weihnachten', label: 'Weihnachten' },
    { value: 'andere', label: 'Andere' }
  ];

  return (
    <SelectField
      form={form}
      name="occasion"
      label={t('generator.occasion')}
      options={occasionOptions}
    />
  );
};

export default OccasionField;
