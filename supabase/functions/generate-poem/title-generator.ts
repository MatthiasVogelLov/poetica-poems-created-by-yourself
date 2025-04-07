
// Generate a title based on occasion and style
export function generateTitleFromOccasion(occasion: string, style?: string): string {
  let title = '';
  
  // Title based on poetic style
  if (style) {
    if (style === 'sonett') {
      title = 'Sonett: ';
    } else if (style === 'ballade') {
      title = 'Ballade: ';
    } else if (style === 'ode') {
      title = 'Ode: ';
    } else if (style === 'hymne') {
      title = 'Hymne: ';
    } else if (style === 'epigramm') {
      title = 'Epigramm: ';
    } else if (style === 'haiku') {
      title = 'Haiku: ';
    } else if (style === 'tanka') {
      title = 'Tanka: ';
    } else if (style === 'freieverse') {
      title = 'Freie Verse: ';
    } else if (style === 'elfchen') {
      title = 'Elfchen: ';
    }
  }
  
  // Append occasion to title
  switch (occasion) {
    case 'abschluss':
      title = (title || '') + 'Gedicht zum Abschluss';
      break;
    case 'babyparty':
      title = (title || '') + 'Gedicht zur Geburt/Babyparty';
      break;
    case 'einzug':
      title = (title || '') + 'Gedicht zum Einzug';
      break;
    case 'geburtstag':
      title = (title || '') + 'Geburtstagsgedicht';
      break;
    case 'hochzeit':
      title = (title || '') + 'Hochzeitsgedicht';
      break;
    case 'junggesellenabschied':
      title = (title || '') + 'Gedicht zum Junggesellenabschied';
      break;
    case 'jubilaeum':
      title = (title || '') + 'Jubiläumsgedicht';
      break;
    case 'kommunion':
      title = (title || '') + 'Gedicht zur Kommunion';
      break;
    case 'konfirmation':
      title = (title || '') + 'Gedicht zur Konfirmation';
      break;
    case 'ruhestand':
      title = (title || '') + 'Gedicht zum Ruhestand';
      break;
    case 'scheidung':
      title = (title || '') + 'Gedicht zur Scheidung';
      break;
    case 'schulanfang':
      title = (title || '') + 'Gedicht zum Schulanfang';
      break;
    case 'taufe':
      title = (title || '') + 'Gedicht zur Taufe';
      break;
    case 'trauerfall':
      title = (title || '') + 'Gedicht zum Gedenken';
      break;
    case 'trennung':
      title = (title || '') + 'Gedicht zur Trennung';
      break;
    case 'umzug':
      title = (title || '') + 'Gedicht zum Umzug';
      break;
    case 'valentinstag':
      title = (title || '') + 'Liebesgedicht zum Valentinstag';
      break;
    case 'verlobung':
      title = (title || '') + 'Gedicht zur Verlobung';
      break;
    case 'weihnachten':
      title = (title || '') + 'Weihnachtsgedicht';
      break;
    case 'ostern':
      title = (title || '') + 'Ostergedicht';
      break;
    default:
      title = (title || '') + 'Personalisiertes Gedicht';
  }

  return title;
}
