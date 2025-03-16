
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import LengthField from '../fields/LengthField';
import KeywordsField from '../fields/KeywordsField';

interface BottomFieldGroupProps {
  form: UseFormReturn<PoemFormData>;
}

const BottomFieldGroup: React.FC<BottomFieldGroupProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <LengthField form={form} />
      <KeywordsField form={form} />
    </div>
  );
};

export default BottomFieldGroup;
