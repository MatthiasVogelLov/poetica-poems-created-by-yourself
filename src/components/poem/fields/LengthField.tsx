
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface LengthFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const lengthOptions: SelectOption[] = [
  { value: 'mittel', label: 'Mittel (12-20 Zeilen)' },
  { value: 'lang', label: 'Lang (20-30 Zeilen)' }
];

const LengthField: React.FC<LengthFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="length"
      label="Länge"
      options={lengthOptions}
      className="w-full"
    />
  );
};

export default LengthField;
