
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import ContentTypeField from '../fields/ContentTypeField';
import StyleField from '../fields/StyleField';

interface MiddleFieldGroupProps {
  form: UseFormReturn<PoemFormData>;
}

const MiddleFieldGroup: React.FC<MiddleFieldGroupProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ContentTypeField form={form} />
      <StyleField form={form} />
    </div>
  );
};

export default MiddleFieldGroup;
