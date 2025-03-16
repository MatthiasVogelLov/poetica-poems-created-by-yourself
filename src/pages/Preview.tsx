
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import PoemPreview from '../components/PoemPreview';
import { ArrowLeft } from 'lucide-react';

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPaid = searchParams.get('paid') === 'true';
  
  const [poemTitle, setPoemTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  
  useEffect(() => {
    if (!location.state || !location.state.formData) {
      // If someone navigates directly to this page without form data, redirect to generator
      navigate('/generator');
      return;
    }
    
    const { audience, occasion, contentType, style, length, keywords } = location.state.formData;
    
    // Generate poem title based on form data
    let title;
    switch (occasion) {
      case 'geburtstag':
        title = 'Geburtstagsgedicht';
        break;
      case 'hochzeit':
        title = 'Hochzeitsgedicht';
        break;
      case 'jubilaeum':
        title = 'Jubiläumsgedicht';
        break;
      case 'trauerfall':
        title = 'Gedicht zum Gedenken';
        break;
      case 'weihnachten':
        title = 'Weihnachtsgedicht';
        break;
      case 'valentinstag':
        title = 'Liebesgedicht zum Valentinstag';
        break;
      default:
        title = 'Personalisiertes Gedicht';
    }
    
    setPoemTitle(title);
    
    // For demonstration purposes, generate a sample poem based on the parameters
    // In a real app, this would come from an API call to a backend/AI service
    const samplePoems = {
      liebe: `Wie Sonnenlicht auf sanften Wogen,
So strahlt dein Lächeln mir entgegen.
Ein Herzschlag, der zum Himmel strebt,
In deinen Augen Zukunft schwebt.

Durch Zeit und Raum, durch Nacht und Tag,
Begleitet mich dein Herzensschlag.
Was auch geschieht, was kommen mag,
Mit dir wird's stets ein neuer Tag.

Die Worte, die ich für dich finde,
Sind nur der Anfang einer Reise.
In jedem Atemzug verbunden,
Schenkt Liebe uns die schönsten Stunden.

Kein Weg zu weit, kein Berg zu steil,
Mit dir an meiner Seite, Teil für Teil,
Erschaffen wir ein wundersames Band,
Das uns durch alle Zeiten trägt – Hand in Hand.`,
      
      freundschaft: `Ein Seelenecho in der Zeit,
Zwei Wege, die sich sanft berühren.
Vertrauen, das wie Brücken trägt,
Wenn Stürme unsre Pfade kreuzen.

Du hörst die Worte, die ich schweige,
Verstehst den Blick, die leise Geste.
In Freude wie in schweren Stunden,
Bleibst du der Anker, fest und klar.

Ein Lachen, das die Sorgen nimmt,
Ein Trost, der keine Worte braucht.
So wandern wir auf gleichen Wegen,
Zwei Seelen, die sich tief verstehen.

Was uns verbindet, braucht kein Licht,
Wächst still im Schatten wie im Glanz.
Freundschaft, kostbares Geschenk,
In dir liegt Heimat und Vertrauen.`,
      
      natur: `Im Rauschen alter Eichenwipfel,
Im zarten Grün des frühen Jahrs,
Liegt Weisheit, die uns sanft berührt,
Ein Flüstern aus vergangner Zeit.

Der Morgentau auf Gräsern glänzt,
Als wären Sterne heimgekehrt.
Der Bach singt seine eigne Weise,
Uralte Lieder, immer neu.

Im Wandel der Jahreszeiten,
Spiegelt sich unser eignes Sein.
Wir blühen, reifen, ruhen, wachsen,
Im ewgen Kreislauf der Natur.

Die Berge stehen still und stark,
Wie Wächter über unsre Zeit.
In ihrer Ruhe liegt die Kraft,
Die unsre Seelen heimwärts führt.`,
    };
    
    // Select a poem based on content type, or use a default
    const poem = samplePoems[contentType] || samplePoems.liebe;
    setPoemContent(poem);
    
  }, [location.state, navigate]);
  
  const goBack = () => {
    navigate('/generator');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow">
          <button 
            onClick={goBack}
            className="btn-ghost mb-8 inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Zurück zum Generator</span>
          </button>
          
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="subheading mb-4 block animate-fade-in">
              Ihr Gedicht
            </span>
            <h1 className="heading-lg mb-6 animate-slide-up">
              {isPaid ? 'Ihr Gedicht ist fertig' : 'Vorschau Ihres Gedichts'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              {isPaid 
                ? 'Hier ist Ihr personalisiertes Gedicht. Sie können es jetzt speichern, drucken oder teilen.' 
                : 'Hier sehen Sie eine Vorschau Ihres personalisierten Gedichts.'}
            </p>
          </div>
          
          <PoemPreview 
            title={poemTitle}
            poem={poemContent}
            isPaid={isPaid}
          />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="font-serif text-xl font-medium">Poetica</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Impressum</a>
              <a href="#" className="hover:text-foreground transition-colors">Datenschutz</a>
              <a href="#" className="hover:text-foreground transition-colors">AGB</a>
              <a href="#" className="hover:text-foreground transition-colors">Kontakt</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Poetica. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Preview;
