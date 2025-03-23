
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import VerseTypeField from '../fields/VerseTypeField';
import StyleField from '../fields/StyleField';
import LengthField from '../fields/LengthField';

interface MiddleFieldGroupProps {
  form: UseFormReturn<PoemFormData>;
}

const MiddleFieldGroup: React.FC<MiddleFieldGroupProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <VerseTypeField form={form} />
      <div className="grid grid-cols-2 gap-4">
        <StyleField form={form} />
        <LengthField form={form} />
      </div>
    </div>
  );
};

export default MiddleFieldGroup;
