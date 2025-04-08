
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { PoemFormData } from '@/types/poem';
import TopFieldGroup from './field-groups/TopFieldGroup';
import MiddleFieldGroup from '@/components/poem/field-groups/MiddleFieldGroup';
import BottomFieldGroup from './field-groups/BottomFieldGroup';

interface FormFieldsProps {
  form: UseFormReturn<PoemFormData>;
}

const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <Form {...form}>
      <fieldset className="space-y-5">
        <TopFieldGroup form={form} />
        <MiddleFieldGroup form={form} />
        <BottomFieldGroup form={form} />
      </fieldset>
    </Form>
  );
};

export default FormFields;
