
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';

interface AudienceFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const AudienceField: React.FC<AudienceFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="audience"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-sm font-medium mb-2">Zielgruppe</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            required
          >
            <FormControl>
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Zielgruppe auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="kinder">Kinder</SelectItem>
              <SelectItem value="erwachsene">Erwachsene</SelectItem>
              <SelectItem value="partner">Partner/in</SelectItem>
              <SelectItem value="familie">Familie</SelectItem>
              <SelectItem value="freunde">Freunde</SelectItem>
              <SelectItem value="kollegen">Kollegen</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AudienceField;
