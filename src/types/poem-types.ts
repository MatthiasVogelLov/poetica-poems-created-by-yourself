
// Types specific to the poems functionality
export interface Poem {
  id: string;
  title: string;
  content: string;
  occasion: string;
  content_type: string;
  created_at: string;
  status?: string;
  batch_created?: boolean;
}

export interface PoemFilters {
  occasionFilter: string;
  contentTypeFilter: string;
}

export interface PoemHookState {
  poems: Poem[];
  filteredPoems: Poem[];
  isLoading: boolean;
  selectedPoemId: string | null;
  selectedPoem: Poem | null;
  occasionFilter: string;
  contentTypeFilter: string;
  poemSlugs: {[key: string]: string};
  slugToId: {[key: string]: string};
}

export interface PoemHookActions {
  setSelectedPoemId: (id: string | null) => void;
  setOccasionFilter: (filter: string) => void;
  setContentTypeFilter: (filter: string) => void;
  handleDeletePoem: (id: string, e: React.MouseEvent) => void;
  clearFilters: () => void;
  getUniqueOccasions: () => string[];
  getUniqueContentTypes: () => string[];
  findPoemBySlug: (slug: string) => string | null;
  getSlugForPoemId: (id: string) => string | null;
}
