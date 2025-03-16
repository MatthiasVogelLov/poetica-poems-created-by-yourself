
import { useState, useEffect } from 'react';
import { toast } from "sonner";

interface PoemData {
  title: string;
  poem: string;
  timestamp?: string;
}

export function usePoemLoader(isPaid: boolean, locationState: any, navigate: any) {
  const [poemTitle, setPoemTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Handle paid poem retrieval
    if (isPaid) {
      console.log('Payment successful, retrieving poem data from localStorage');
      const storedPoemData = localStorage.getItem('currentPoemData');
      
      if (storedPoemData) {
        try {
          const parsedData = JSON.parse(storedPoemData);
          console.log('Retrieved poem data from localStorage:', parsedData);
          
          if (parsedData.title && parsedData.poem) {
            setPoemTitle(parsedData.title);
            setPoemContent(parsedData.poem);
            setIsGenerating(false);
            
            // Notify user of successful unlock
            toast.success("Gedicht erfolgreich freigeschaltet", {
              description: "Sie können es jetzt speichern, drucken oder teilen."
            });
            
            return;
          } else {
            console.error('Stored poem data is missing title or poem');
            toast.error("Fehler beim Laden des Gedichts", {
              description: "Die gespeicherten Daten sind unvollständig."
            });
          }
        } catch (e) {
          console.error('Error parsing stored poem data:', e);
          toast.error("Fehler beim Laden des Gedichts", {
            description: "Die gespeicherten Daten sind beschädigt."
          });
        }
      } else {
        console.error('No poem data found in localStorage after payment');
        toast.error("Fehler beim Laden des Gedichts", {
          description: "Es wurden keine gespeicherten Daten gefunden."
        });
      }
      
      // If we get here, there was an error retrieving the poem data
      setIsGenerating(false);
      setPoemContent('Es gab ein Problem beim Laden Ihres Gedichts nach der Zahlung. Bitte kontaktieren Sie den Support.');
      return;
    }

    // If not returning from payment, check location state
    if (!locationState || !locationState.formData) {
      console.log('No form data found, redirecting to generator');
      navigate('/generator');
      return;
    }

    if (locationState.generatedPoem) {
      console.log('Using generated poem from location state');
      const { title, poem } = locationState.generatedPoem;
      setPoemTitle(title);
      setPoemContent(poem);
      setIsGenerating(false);
      
      // Save to localStorage for payment flow
      const poemData = {
        title,
        poem,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('currentPoemData', JSON.stringify(poemData));
      console.log('Saved poem data to localStorage:', poemData);
    } else {
      generateSamplePoem(locationState.formData);
    }
  }, [isPaid, locationState, navigate]);

  // Function to generate a sample poem
  const generateSamplePoem = (formData: any) => {
    setIsGenerating(true);
    
    const { audience, occasion, contentType, style, length, keywords } = formData;

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

    try {
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

        const poem = samplePoems[contentType] || samplePoems.liebe;

        let adjustedPoem = poem;
        if (length === 'kurz') {
          const lines = poem.split('\n');
          adjustedPoem = lines.slice(0, 8).join('\n');
        } else if (length === 'lang') {
          const stanzas = poem.split('\n\n');
          if (stanzas.length > 2) {
            adjustedPoem = [...stanzas, stanzas[1], stanzas[0]].join('\n\n');
          }
        }

        if (keywords && keywords.trim()) {
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
        
        // Store poem data in localStorage for payment return flow
        const poemData = {
          title,
          poem: adjustedPoem,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('currentPoemData', JSON.stringify(poemData));
        console.log('Saved new poem data to localStorage:', poemData);
      }, 1500);
    } catch (error) {
      console.error('Error generating poem:', error);
      setIsGenerating(false);
      setPoemContent('Es tut uns leid, beim Erstellen des Gedichts ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
    }
  };

  return {
    poemTitle,
    poemContent,
    isGenerating
  };
}
