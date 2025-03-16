
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface LengthFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const lengthOptions: SelectOption[] = [
  { value: 'kurz', label: 'Kurz (4-8 Zeilen)' },
  { value: 'mittel', label: 'Mittel (8-16 Zeilen)' },
  { value: 'lang', label: 'Lang (16-24 Zeilen)' }
];

const LengthField: React.FC<LengthFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="length"
      label="Länge"
      options={lengthOptions}
      className="col-span-2"
    />
  );
};

export default LengthField;
