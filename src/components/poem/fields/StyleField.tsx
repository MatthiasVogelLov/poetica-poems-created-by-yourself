
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';

interface StyleFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const StyleField: React.FC<StyleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="style"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-sm font-medium mb-2">Stil</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            required
          >
            <FormControl>
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Stil auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="klassisch">Klassisch</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="romantisch">Romantisch</SelectItem>
              <SelectItem value="humorvoll">Humorvoll</SelectItem>
              <SelectItem value="experimentell">Experimentell</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StyleField;
