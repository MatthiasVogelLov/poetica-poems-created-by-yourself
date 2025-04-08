
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface KeywordsFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const KeywordsField: React.FC<KeywordsFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="keywords"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-medium">Personal Keywords (Optional)</FormLabel>
          <div className="text-sm text-muted-foreground mb-2">
            Add words or phrases that should be included in your poem
          </div>
          <FormControl>
            <Textarea 
              placeholder="E.g., rose garden, summer memories, golden retriever..." 
              className="resize-none min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default KeywordsField;
