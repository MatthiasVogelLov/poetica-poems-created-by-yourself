
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
  const [isGenerating, setIsGenerating] = useState(true);
  
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
    
    // In a real implementation, this would be an API call to OpenAI
    // Instead of using the sample poems, we'd send the formData to an API
    const generatePoem = async () => {
      setIsGenerating(true);
      
      try {
        // For now, we'll use a timeout and sample poems
        // In a real implementation, this would be replaced with an actual API call:
        /*
        const response = await fetch('/api/generate-poem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            audience, 
            occasion, 
            contentType, 
            style, 
            length, 
            keywords 
          })
        });
        const data = await response.json();
        setPoemContent(data.poem);
        */
        
        // For demonstration, use sample poems based on content type
        setTimeout(() => {
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
            
            leben: `Der Weg des Lebens, verschlungen und weit,
Führt über Gipfel und durch tiefe Täler.
Jeder Schritt ein Atem der Zeit,
Jede Wahl ein neues Kapitel.

In der Stille der Dämmerung,
Zwischen Gestern und Morgen,
Ruht die Kraft der Erneuerung,
Verblassen die alten Sorgen.

Was wir sind und was wir werden,
Liegt in unseren Händen allein.
Die Spuren, die wir hinterlassen auf Erden,
Werden Zeugnis unseres Wesens sein.

So lasst uns leben mit offenem Herzen,
Die Tage nutzen, die uns gegeben.
Denn im Licht wie auch in den Schmerzen,
Liegt die wahre Schönheit vom Leben.`,
            
            motivation: `Steh auf, wenn du gefallen bist,
Geh weiter, wenn der Weg sich windet.
Die größte Kraft, die in dir ist,
Wird wach, wenn Dunkelheit dich bindet.

Jeder Morgen, ein neues Blatt,
Jede Stunde, eine Chance zu wachsen.
Selbst wenn das Schicksal dich verlacht,
Dein Wille kann Berge versetzen.

Was heute noch unmöglich scheint,
Wird morgen schon der erste Schritt.
Der Glaube, der in dir vereint,
Nimmt alle deine Zweifel mit.

So folge deinem inneren Stern,
Auch wenn er manchmal schwach nur scheint.
Das Ziel mag heute noch so fern,
Dein Mut hat jede Furcht vereint.`,
            
            humor: `Im Alltag, wo die Sorgen wohnen,
Und Ernst regiert mit strengem Blick,
Da tanzt der Humor auf leisen Sohlen,
Und bringt uns sanft zum Glück zurück.

Ein Schmunzeln hier, ein Lachen dort,
Ein Witz zur rechten Zeit gesagt,
Schon trägt es alle Schwere fort,
Was eben noch das Herz geplagt.

Die Kunst, sich selbst nicht schwer zu nehmen,
Ist Weisheit, die nicht jeder kennt.
Doch wer kann Lachen frei entfremden,
Hat einen Schatz, der ewig brennt.

So lass den Humor dein Begleiter sein,
Durch alle Höhen, alle Tiefen.
Er macht das Herz und Leben fein,
Lässt Freude in die Seele triefen.`,
            
            trauer: `Im stillen Garten der Erinnerung,
Wo Schatten leise Geschichten weben,
Liegt verborgen eine tiefe Verbindung,
Die stärker ist als Tod und Leben.

Die Tränen, die wir um dich weinen,
Sind Perlen der Liebe, die bleibt.
Sie werden zum Licht und vereinen,
Was die Zeit nicht auseinandertreibt.

In jedem Windhauch, der uns streift,
In jedem Stern, der nachts erwacht,
Ist deine Seele, die uns greift,
Und leise flüstert: "Ich hab aufgepasst."

So tragen wir dein Angedenken,
Als kostbares Geschenk im Herzen.
Die Liebe wird sich niemals senken,
Sie leuchtet fort durch alle Schmerzen.`
          };
    
          // Select a poem based on content type, or use a default
          const poem = samplePoems[contentType] || samplePoems.liebe;
          
          // Adjust poem length based on user preference
          let adjustedPoem = poem;
          if (length === 'kurz') {
            // For short poems, just take first 2 stanzas
            const lines = poem.split('\n');
            adjustedPoem = lines.slice(0, 8).join('\n');
          } else if (length === 'lang') {
            // For long poems, duplicate some stanzas to make it longer
            const stanzas = poem.split('\n\n');
            if (stanzas.length > 2) {
              // Add variation to make it look less repetitive
              adjustedPoem = [...stanzas, stanzas[1], stanzas[0]].join('\n\n');
            }
          }
          
          // If keywords were provided, try to incorporate them somehow
          if (keywords && keywords.trim()) {
            // This would be handled by the API in a real implementation
            // For now, just add a personalized stanza at the end
            const keywordsList = keywords.split(',').map(k => k.trim());
            if (keywordsList.length > 0) {
              const personalizedStanza = `\n\nDie Worte "${keywordsList.join('" und "')}" vereint,
In diesem Gedicht für dich erdacht.
Ein persönlicher Gruß, der erscheint,
Mit Liebe und Fürsorge bedacht.`;
              
              adjustedPoem += personalizedStanza;
            }
          }
          
          setPoemContent(adjustedPoem);
          setIsGenerating(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error generating poem:', error);
        setIsGenerating(false);
        setPoemContent('Es tut uns leid, beim Erstellen des Gedichts ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    };
    
    generatePoem();
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
          
          {isGenerating ? (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
              <p className="text-lg text-muted-foreground">Ihr Gedicht wird erstellt...</p>
            </div>
          ) : (
            <PoemPreview 
              title={poemTitle}
              poem={poemContent}
              isPaid={isPaid}
            />
          )}
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
