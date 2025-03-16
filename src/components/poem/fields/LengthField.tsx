
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';

interface LengthFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const LengthField: React.FC<LengthFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="length"
      render={({ field }) => (
        <FormItem className="col-span-2">
          <FormLabel className="block text-sm font-medium mb-2">Länge</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            required
          >
            <FormControl>
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Länge auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="kurz">Kurz (4-8 Zeilen)</SelectItem>
              <SelectItem value="mittel">Mittel (8-16 Zeilen)</SelectItem>
              <SelectItem value="lang">Lang (16-24 Zeilen)</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LengthField;
