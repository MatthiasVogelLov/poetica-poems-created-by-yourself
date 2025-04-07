
export interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  style?: string;
  verse_type?: string;
  length?: string;
  audience?: string;
  keywords?: string[];
  created_at: string;
  status?: string;
  batch_created?: boolean | null;
  language?: string;
}

export interface PoemHookState {
  poems: Poem[];
  filteredPoems: Poem[];
  isLoading: boolean;
  selectedPoemId: string | null;
  selectedPoem: Poem | null;
  occasionFilter: string;
  contentTypeFilter: string;
  styleFilter: string;
  audienceFilter: string;
  searchQuery: string;
  keywordFilters?: string[];
  poemSlugs: Record<string, string>;
  slugToId: Record<string, string>;
  page: number;
  totalCount: number;
  hasMore: boolean;
  poemsPerPage: number;
  nextPage: () => void;
  prevPage: () => void;
  getPoemSeoMetadata?: (poemId: string) => { description: string; keywords: string[] };
}

export const createPoemSlug = (poem: Poem) => {
  const title = poem.title.toLowerCase();
  return title
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};
