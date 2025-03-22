
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface OccasionFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const occasionOptions: SelectOption[] = [
  { value: 'ostern', label: 'Ostern' },
  { value: 'geburtstag', label: 'Geburtstag' },
  { value: 'hochzeit', label: 'Hochzeit' },
  { value: 'jubilaeum', label: 'Jubiläum' },
  { value: 'trauerfall', label: 'Trauerfall' },
  { value: 'weihnachten', label: 'Weihnachten' },
  { value: 'valentinstag', label: 'Valentinstag' },
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
