
export type Audience = 'eltern' | 'erwachsene' | 'familie' | 'freunde' | 'kinder' | 'kollegen' | 'partner';
export type Occasion = 
  | 'ostern' 
  | 'abschluss'
  | 'babyparty'
  | 'einzug'
  | 'geburtstag' 
  | 'hochzeit' 
  | 'junggesellenabschied'
  | 'jubilaeum' 
  | 'kommunion'
  | 'konfirmation'
  | 'ruhestand'
  | 'scheidung'
  | 'schulanfang'
  | 'taufe'
  | 'trauerfall' 
  | 'trennung'
  | 'umzug'
  | 'valentinstag' 
  | 'verlobung'
  | 'weihnachten'
  | 'andere';
export type ContentType = 'liebe' | 'freundschaft' | 'natur' | 'leben' | 'motivation' | 'humor' | 'trauer';
export type Style = 'klassisch' | 'modern' | 'romantisch' | 'humorvoll' | 'experimentell';
export type Length = 'mittel' | 'lang';
export type VerseType = 'frei' | 'paarreim' | 'kreuzreim' | 'umarmenderreim';

export interface PoemFormData {
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  verseType: VerseType;
  length: Length;
  keywords: string;
}

export const initialFormData: PoemFormData = {
  audience: 'erwachsene',
  occasion: 'ostern',
  contentType: 'liebe',
  style: 'klassisch',
  verseType: 'frei',
  length: 'mittel',
  keywords: '',
};
