
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { PoemFormData } from '@/types/poem';
import TopFieldGroup from './field-groups/TopFieldGroup';
import MiddleFieldGroup from './field-groups/MiddleFieldGroup';
import BottomFieldGroup from './field-groups/BottomFieldGroup';
import StyleField from './fields/StyleField';

interface FormFieldsProps {
  form: UseFormReturn<PoemFormData>;
}

const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <Form {...form}>
      <fieldset className="space-y-5">
        <TopFieldGroup form={form} />
        <MiddleFieldGroup form={form} />
        <div className="grid grid-cols-1 gap-4">
          <StyleField form={form} />
        </div>
        <BottomFieldGroup form={form} />
      </fieldset>
    </Form>
  );
};

export default FormFields;
