
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface LengthFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const lengthOptions: SelectOption[] = [
  { value: 'mittel', label: 'Medium (12-20 lines)' },
  { value: 'lang', label: 'Long (20-30 lines)' }
];

const LengthField: React.FC<LengthFieldProps> = ({ form }) => {
  return (
    <SelectField
      form={form}
      name="length"
      label="Length"
      options={lengthOptions}
      className="w-full"
    />
  );
};

export default LengthField;
