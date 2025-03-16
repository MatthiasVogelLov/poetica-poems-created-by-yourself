
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

type Audience = 'kinder' | 'erwachsene' | 'partner' | 'familie' | 'freunde' | 'kollegen';
type Occasion = 'geburtstag' | 'hochzeit' | 'jubilaeum' | 'trauerfall' | 'weihnachten' | 'valentinstag' | 'andere';
type ContentType = 'liebe' | 'freundschaft' | 'natur' | 'leben' | 'motivation' | 'humor' | 'trauer';
type Style = 'klassisch' | 'modern' | 'romantisch' | 'humorvoll' | 'experimentell';
type Length = 'kurz' | 'mittel' | 'lang';

interface PoemFormData {
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  length: Length;
  keywords: string;
}

const initialFormData: PoemFormData = {
  audience: 'erwachsene',
  occasion: 'geburtstag',
  contentType: 'liebe',
  style: 'klassisch',
  length: 'mittel',
  keywords: '',
};

const PoemForm = () => {
  const [formData, setFormData] = useState<PoemFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to generate poem
    setTimeout(() => {
      setIsLoading(false);
      // For now, just navigate to preview with form data as state
      navigate('/preview', { state: { formData } });
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
        <fieldset className="space-y-5">
          <div className="mb-4">
            <label htmlFor="audience" className="block text-sm font-medium mb-2">
              Zielgruppe
            </label>
            <select
              id="audience"
              name="audience"
              value={formData.audience}
              onChange={handleChange}
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

          <div className="mb-4">
            <label htmlFor="occasion" className="block text-sm font-medium mb-2">
              Anlass
            </label>
            <select
              id="occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
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

          <div className="mb-4">
            <label htmlFor="contentType" className="block text-sm font-medium mb-2">
              Inhalt
            </label>
            <select
              id="contentType"
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
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

          <div className="mb-4">
            <label htmlFor="style" className="block text-sm font-medium mb-2">
              Stil
            </label>
            <select
              id="style"
              name="style"
              value={formData.style}
              onChange={handleChange}
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

          <div className="mb-4">
            <label htmlFor="length" className="block text-sm font-medium mb-2">
              Länge
            </label>
            <select
              id="length"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="form-select w-full"
              required
            >
              <option value="kurz">Kurz (4-8 Zeilen)</option>
              <option value="mittel">Mittel (8-16 Zeilen)</option>
              <option value="lang">Lang (16-24 Zeilen)</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="keywords" className="block text-sm font-medium mb-2">
              Schlüsselwörter (optional)
            </label>
            <textarea
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Fügen Sie persönliche Details oder Schlüsselwörter hinzu..."
              className="form-select w-full min-h-[100px] resize-y"
            />
          </div>
        </fieldset>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ease-in-out"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white/100 animate-spin"></div>
                <span>Gedicht wird erstellt...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Gedicht erstellen</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PoemForm;
