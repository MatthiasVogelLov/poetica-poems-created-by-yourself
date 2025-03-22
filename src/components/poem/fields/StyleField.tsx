
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PoemFormData } from '@/types/poem';
import SelectField, { SelectOption } from './SelectField';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface StyleFieldProps {
  form: UseFormReturn<PoemFormData>;
}

const styleOptions: SelectOption[] = [
  { value: 'sonett', label: 'Sonett' },
  { value: 'ballade', label: 'Ballade' },
  { value: 'ode', label: 'Ode' },
  { value: 'hymne', label: 'Hymne' },
  { value: 'epigramm', label: 'Epigramm' },
  { value: 'haiku', label: 'Haiku' },
  { value: 'tanka', label: 'Tanka' },
  { value: 'freieverse', label: 'Freie Verse' },
  { value: 'elfchen', label: 'Elfchen' },
  { value: 'klassisch', label: 'Klassisch' },
  { value: 'modern', label: 'Modern' },
  { value: 'romantisch', label: 'Romantisch' },
  { value: 'humorvoll', label: 'Humorvoll' },
  { value: 'experimentell', label: 'Experimentell' }
];

const StyleHelpContent = () => {
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <h3 className="font-bold">1. Sonett</h3>
        <p>Ein Sonett besteht aus 14 Versen, die meist in zwei Quartette (vierzeilige Strophen) und zwei Terzette (dreizeilige Strophen) unterteilt sind. Häufig folgt es dem Reimschema ABBA ABBA CCD EED oder Ähnlichem. Klassische Themen sind Liebe, Natur und Vergänglichkeit.</p>
        <div className="bg-muted p-3 rounded-md italic text-sm">
          <p>Der Frühling kehrt mit Blütenpracht zurück, (A)</p>
          <p>er haucht dem Land ein neues Leben ein. (B)</p>
          <p>Die Bäume kleiden sich im jungen Grün, (B)</p>
          <p>und heller strahlt des Morgens erstes Glück. (A)</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">2. Ballade</h3>
        <p>Eine Ballade ist ein erzählendes Gedicht mit dramatischen Elementen. Sie verbindet Lyrik, Epik und Dramatik und schildert oft eine spannende oder tragische Geschichte.</p>
        <div className="bg-muted p-3 rounded-md italic text-sm">
          <p>Ein Ritter ritt im Abendrot,</p>
          <p>sein Herz war schwer, sein Blick war tot.</p>
          <p>Er hörte eine Stimme rufen,</p>
          <p>vom alten Turm im dunklen Hofen.</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">3. Ode</h3>
        <p>Eine Ode ist ein feierliches, meist reimloses Gedicht mit erhabenem Ton. Sie lobt oft eine Person, eine Idee oder ein Ideal.</p>
        <div className="bg-muted p-3 rounded-md italic text-sm">
          <p>O Licht des Morgens, rein und klar,</p>
          <p>du weckst die Welt aus dunkler Ruh,</p>
          <p>durchflutest Tal und Berg und Fluss –</p>
          <p>dein Glanz erhellt die Zeiten.</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">4. Hymne</h3>
        <p>Eine Hymne ist eine feierliche Preis- und Lobgesangform, meist ohne festes Metrum oder Reimschema. Sie ist oft religiösen oder patriotischen Inhalts.</p>
        <div className="bg-muted p-3 rounded-md italic text-sm">
          <p>Oh Freiheit, du leuchtende Flamme,</p>
          <p>du führst die Herzen aus dunkler Nacht,</p>
          <p>dein Ruf erklingt in jedem Volke,</p>
          <p>unbezwingbar, strahlend und frei!</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">5. Epigramm</h3>
        <p>Ein Epigramm ist ein kurzes, oft pointiertes oder witziges Gedicht mit einer überraschenden Wendung oder einem scharfsinnigen Schluss.</p>
        <div className="bg-muted p-3 rounded-md italic text-sm">
          <p>Die Zeit vergeht, die Uhr sie tickt,</p>
          <p>und ehe man's begreift – sie ist geschickt.</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">6. Haiku</h3>
        <p>Ein Haiku ist eine japanische Gedichtform mit 17 Silben in der Struktur 5-7-5. Es beschreibt oft Natur und den Moment.</p>
        <div className="bg-muted p-3 rounded-md italic text-sm">
          <p>Blätter fallen sanft,</p>
          <p>der Wind singt sein leises Lied,</p>
          <p>Herbstzeit kehrt nun ein.</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">7. Tanka</h3>
        <p>Ein Tanka ist eine erweiterte Form des Haiku mit 31 Silben in der Struktur 5-7-5-7-7. Es erweitert das Haiku um persönliche Reflexionen.</p>
        <div className="bg-muted p-3 rounded-md italic text-sm">
          <p>Am See ganz allein,</p>
          <p>Wellen flüstern sanft zu mir,</p>
          <p>der Wind trägt Gedanken fort,</p>
          <p>die Nacht bringt leise Träume,</p>
          <p>ein Herz ruht in Stille aus.</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">8. Elfchen</h3>
        <p>Ein Elfchen besteht aus 11 Wörtern, verteilt auf fünf Zeilen nach folgendem Schema: 1 Wort – 2 Wörter – 3 Wörter – 4 Wörter – 1 Wort.</p>
        <div className="bg-muted p-3 rounded-md italic text-sm">
          <p>Herbst,</p>
          <p>Blätter tanzen,</p>
          <p>Winde wehen stark,</p>
          <p>goldene Farben vergehen bald,</p>
          <p>Stille.</p>
        </div>
      </div>
    </div>
  );
};

const StyleField: React.FC<StyleFieldProps> = ({ form }) => {
  const isMobile = useIsMobile();

  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <span className="text-sm font-medium">Stil</span>
        {isMobile ? (
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex h-4 w-4 items-center justify-center rounded-full p-0 ml-1">
                <HelpCircle className="h-3 w-3" />
                <span className="sr-only">Gedichtstile Informationen</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Gedichtstile</DialogTitle>
                <DialogDescription>
                  Informationen zu verschiedenen Gedichtstilen.
                </DialogDescription>
              </DialogHeader>
              <StyleHelpContent />
            </DialogContent>
          </Dialog>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex h-4 w-4 items-center justify-center rounded-full p-0 ml-1">
                  <HelpCircle className="h-3 w-3" />
                  <span className="sr-only">Gedichtstile Informationen</span>
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="center" 
                className="max-w-md w-80 max-h-[500px] overflow-y-auto"
              >
                <StyleHelpContent />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <SelectField
        form={form}
        name="style"
        label=""
        hideLabel={true}
        options={styleOptions}
      />
    </div>
  );
};

export default StyleField;
