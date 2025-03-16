
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PoemFormData } from '@/types/poem';

interface FormFieldsProps {
  form: UseFormReturn<PoemFormData>;
}

const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <Form {...form}>
      <fieldset className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="occasion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-2">Anlass</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  required
                >
                  <FormControl>
                    <SelectTrigger className="form-select">
                      <SelectValue placeholder="Anlass auswählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="geburtstag">Geburtstag</SelectItem>
                    <SelectItem value="hochzeit">Hochzeit</SelectItem>
                    <SelectItem value="jubilaeum">Jubiläum</SelectItem>
                    <SelectItem value="trauerfall">Trauerfall</SelectItem>
                    <SelectItem value="weihnachten">Weihnachten</SelectItem>
                    <SelectItem value="valentinstag">Valentinstag</SelectItem>
                    <SelectItem value="andere">Andere</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium mb-2">Inhalt</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  required
                >
                  <FormControl>
                    <SelectTrigger className="form-select">
                      <SelectValue placeholder="Inhalt auswählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="liebe">Liebe</SelectItem>
                    <SelectItem value="freundschaft">Freundschaft</SelectItem>
                    <SelectItem value="natur">Natur</SelectItem>
                    <SelectItem value="leben">Leben</SelectItem>
                    <SelectItem value="motivation">Motivation</SelectItem>
                    <SelectItem value="humor">Humor</SelectItem>
                    <SelectItem value="trauer">Trauer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="Fügen Sie persönliche Details oder Schlüsselwörter hinzu..."
                    className="form-select min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </fieldset>
    </Form>
  );
};

export default FormFields;
