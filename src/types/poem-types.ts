
// Types specific to the poems functionality
export interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  style?: string;
  created_at: string;
  status?: string;
  batch_created?: boolean;
  audience?: string;
  keywords?: string;
  language?: 'en' | 'de';
}

export interface PoemFilters {
  occasionFilter: string;
  contentTypeFilter: string;
  styleFilter: string;
  audienceFilter?: string;
  searchQuery?: string;
  keywordFilters?: string[];
}

export interface PoemSeoMetadata {
  description: string;
  keywords: string[];
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
  audienceFilter?: string;
  searchQuery?: string;
  keywordFilters?: string[];
  poemSlugs: {[key: string]: string};
  slugToId: {[key: string]: string};
  page: number;
  totalCount: number;
  hasMore: boolean;
  poemsPerPage: number;
  nextPage: () => void;
  prevPage: () => void;
  getPoemSeoMetadata?: (poemId: string) => PoemSeoMetadata;
}

export interface PoemHookActions {
  setSelectedPoemId: (id: string | null) => void;
  setOccasionFilter: (filter: string) => void;
  setContentTypeFilter: (filter: string) => void;
  setStyleFilter: (filter: string) => void;
  setAudienceFilter?: (filter: string) => void;
  setSearchQuery?: (query: string) => void;
  toggleKeywordFilter?: (keyword: string) => void;
  clearKeywordFilters?: () => void;
  handleDeletePoem: (id: string, e: React.MouseEvent) => void;
  clearFilters: () => void;
  getUniqueOccasions: () => string[];
  getUniqueContentTypes: () => string[];
  getUniqueStyles: () => string[];
  getUniqueAudiences?: () => string[];
  findPoemBySlug: (slug: string) => string | null;
  getSlugForPoemId: (id: string) => string | null;
}
