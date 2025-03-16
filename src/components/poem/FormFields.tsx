
import React from 'react';
import { PoemFormData } from '@/types/poem';

interface FormFieldsProps {
  formData: PoemFormData;
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({ formData, onChange }) => {
  return (
    <fieldset className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="audience" className="block text-sm font-medium mb-2">
            Zielgruppe
          </label>
          <select
            id="audience"
            name="audience"
            value={formData.audience}
            onChange={onChange}
            className="form-select w-full"
            required
          >
            <option value="kinder">Kinder</option>
            <option value="erwachsene">Erwachsene</option>
            <option value="partner">Partner/in</option>
            <option value="familie">Familie</option>
            <option value="freunde">Freunde</option>
            <option value="kollegen">Kollegen</option>
          </select>
        </div>

        <div>
          <label htmlFor="occasion" className="block text-sm font-medium mb-2">
            Anlass
          </label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={onChange}
            className="form-select w-full"
            required
          >
            <option value="geburtstag">Geburtstag</option>
            <option value="hochzeit">Hochzeit</option>
            <option value="jubilaeum">Jubiläum</option>
            <option value="trauerfall">Trauerfall</option>
            <option value="weihnachten">Weihnachten</option>
            <option value="valentinstag">Valentinstag</option>
            <option value="andere">Andere</option>
          </select>
        </div>

        <div>
          <label htmlFor="contentType" className="block text-sm font-medium mb-2">
            Inhalt
          </label>
          <select
            id="contentType"
            name="contentType"
            value={formData.contentType}
            onChange={onChange}
            className="form-select w-full"
            required
          >
            <option value="liebe">Liebe</option>
            <option value="freundschaft">Freundschaft</option>
            <option value="natur">Natur</option>
            <option value="leben">Leben</option>
            <option value="motivation">Motivation</option>
            <option value="humor">Humor</option>
            <option value="trauer">Trauer</option>
          </select>
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium mb-2">
            Stil
          </label>
          <select
            id="style"
            name="style"
            value={formData.style}
            onChange={onChange}
            className="form-select w-full"
            required
          >
            <option value="klassisch">Klassisch</option>
            <option value="modern">Modern</option>
            <option value="romantisch">Romantisch</option>
            <option value="humorvoll">Humorvoll</option>
            <option value="experimentell">Experimentell</option>
          </select>
        </div>

        <div className="col-span-2">
          <label htmlFor="length" className="block text-sm font-medium mb-2">
            Länge
          </label>
          <select
            id="length"
            name="length"
            value={formData.length}
            onChange={onChange}
            className="form-select w-full"
            required
          >
            <option value="kurz">Kurz (4-8 Zeilen)</option>
            <option value="mittel">Mittel (8-16 Zeilen)</option>
            <option value="lang">Lang (16-24 Zeilen)</option>
          </select>
        </div>

        <div className="col-span-2">
          <label htmlFor="keywords" className="block text-sm font-medium mb-2">
            Schlüsselwörter (optional)
          </label>
          <textarea
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={onChange}
            placeholder="Fügen Sie persönliche Details oder Schlüsselwörter hinzu..."
            className="form-select w-full min-h-[100px] resize-y"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default FormFields;
