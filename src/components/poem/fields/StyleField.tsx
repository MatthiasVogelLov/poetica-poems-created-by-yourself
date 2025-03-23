
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';

interface StyleFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const styleOptions: SelectOption[] = [
  { value: 'klassisch', label: 'Klassisch' },
  { value: 'modern', label: 'Modern' },
  { value: 'romantisch', label: 'Romantisch' },
  { value: 'humorvoll', label: 'Humorvoll' },
  { value: 'experimentell', label: 'Experimentell' }
];

const StyleField: React.FC<StyleFieldProps> = ({ form }) => {
  return (
    <div>
      <div className="mb-2">
        <span className="text-sm font-medium">Stil</span>
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
