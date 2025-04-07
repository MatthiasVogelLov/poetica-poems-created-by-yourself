
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';

interface KeywordsFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const KeywordsField: React.FC<KeywordsFieldProps> = ({
  form
}) => {
  return (
    <FormField 
      control={form.control} 
      name="keywords" 
      render={({ field }) => (
        <FormItem className="col-span-2">
          <FormLabel className="block text-sm font-medium mb-2">
            Schlüsselwörter (optional)
          </FormLabel>
          <FormControl>
            <Textarea 
              {...field}
              placeholder="Fügen Sie (getrennt durch Kommas) Details oder Schlüsselwörter hinzu ..." 
              className="form-select min-h-[100px] resize-y bg-white" 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} 
    />
  );
};

export default KeywordsField;
