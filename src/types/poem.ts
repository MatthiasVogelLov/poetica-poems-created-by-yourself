
export type Audience = 'kinder' | 'erwachsene' | 'partner' | 'familie' | 'freunde' | 'kollegen';
export type Occasion = 'geburtstag' | 'hochzeit' | 'jubilaeum' | 'trauerfall' | 'weihnachten' | 'valentinstag' | 'andere';
export type ContentType = 'liebe' | 'freundschaft' | 'natur' | 'leben' | 'motivation' | 'humor' | 'trauer';
export type Style = 'sonett' | 'ballade' | 'ode' | 'hymne' | 'epigramm' | 'haiku' | 'tanka' | 'freieverse' | 'elfchen' | 'klassisch' | 'modern' | 'romantisch' | 'humorvoll' | 'experimentell';
export type Length = 'kurz' | 'mittel' | 'lang';

export interface PoemFormData {
  audience: Audience;
  occasion: Occasion;
  contentType: ContentType;
  style: Style;
  length: Length;
  keywords: string;
}

export const initialFormData: PoemFormData = {
  audience: 'erwachsene',
  occasion: 'geburtstag',
  contentType: 'liebe',
  style: 'klassisch',
  length: 'mittel',
  keywords: '',
};
