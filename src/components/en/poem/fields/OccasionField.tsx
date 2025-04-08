
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface OccasionFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const occasionOptions: SelectOption[] = [
  { value: 'ostern', label: 'Easter' },
  { value: 'abschluss', label: 'Graduation' },
  { value: 'babyparty', label: 'Birth/Baby Shower' },
  { value: 'einzug', label: 'Moving In' },
  { value: 'geburtstag', label: 'Birthday' },
  { value: 'hochzeit', label: 'Wedding' },
  { value: 'junggesellenabschied', label: 'Bachelor/Bachelorette Party' },
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
];

const OccasionField: React.FC<OccasionFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="occasion"
      label="Occasion"
      options={occasionOptions}
    />
  );
};

export default OccasionField;
