
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface OccasionFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const occasionOptions: SelectOption[] = [
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

const OccasionField: React.FC<OccasionFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="occasion"
      label="Anlass"
      options={occasionOptions}
    />
  );
};

export default OccasionField;
