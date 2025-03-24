
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Helper function to create a URL-friendly slug from a title
export const createSlug = (title: string): string => {
  // Convert to lowercase, replace spaces with dashes, remove special chars
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Get a unique slug, adding numbers if needed to avoid duplicates
const getUniqueSlug = (title: string, existingSlugs: string[]): string => {
  let baseSlug = createSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  // Check if slug exists, if so add an incrementing number
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}_${counter}`;
    counter++;
  }
  
  return slug;
};

export const usePoems = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [poemSlugs, setPoemSlugs] = useState<{[key: string]: string}>({});
  const [slugToId, setSlugToId] = useState<{[key: string]: string}>({});

  // Fetch the poems from Supabase
  useEffect(() => {
    const fetchPoems = async () => {
      setIsLoading(true);
      try {
        // Fetch both user-created poems and published batch poems
        const { data, error } = await supabase
          .from('user_poems')
          .select('*')
          .or('batch_created.is.null,and(batch_created.eq.true,status.eq.published)')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPoems(data || []);
        setFilteredPoems(data || []);
        
        // Generate unique slugs for all poems
        const existingSlugs: string[] = [];
        const poemSlugsMap: {[key: string]: string} = {};
        const slugToIdMap: {[key: string]: string} = {};
        
        data?.forEach(poem => {
          const uniqueSlug = getUniqueSlug(poem.title, existingSlugs);
          existingSlugs.push(uniqueSlug);
          poemSlugsMap[poem.id] = uniqueSlug;
          slugToIdMap[uniqueSlug] = poem.id;
        });
        
        setPoemSlugs(poemSlugsMap);
        setSlugToId(slugToIdMap);
      } catch (error) {
        console.error('Error fetching poems:', error);
        toast.error('Fehler beim Laden der Gedichte');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoems();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let result = [...poems];
    
    if (occasionFilter && occasionFilter !== 'all') {
      result = result.filter(poem => poem.occasion === occasionFilter);
    }
    
    if (contentTypeFilter && contentTypeFilter !== 'all') {
      result = result.filter(poem => poem.content_type === contentTypeFilter);
    }
    
    setFilteredPoems(result);
  }, [poems, occasionFilter, contentTypeFilter]);

  // Fetch a single poem when selected by ID
  useEffect(() => {
    if (selectedPoemId) {
      console.log('Fetching single poem with ID:', selectedPoemId);
      
      const fetchSinglePoem = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('user_poems')
            .select('*')
            .eq('id', selectedPoemId)
            .single();
          
          if (error) {
            console.error('Error fetching single poem:', error);
            throw error;
          }
          
          console.log('Poem data received:', data);
          setSelectedPoem(data);
        } catch (error) {
          console.error('Error fetching poem:', error);
          toast.error('Fehler beim Laden des Gedichts');
          setSelectedPoem(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSinglePoem();
    } else {
      setSelectedPoem(null);
    }
  }, [selectedPoemId]);

  // Find poem by slug
  const findPoemBySlug = (slug: string): string | null => {
    return slugToId[slug] || null;
  };

  // Get slug for a poem ID
  const getSlugForPoemId = (id: string): string | null => {
    return poemSlugs[id] || null;
  };

  const handleDeletePoem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Möchten Sie dieses Gedicht wirklich löschen?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_poems')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPoems(poems.filter(poem => poem.id !== id));
      toast.success('Gedicht wurde gelöscht');
      
      if (selectedPoemId === id) {
        setSelectedPoemId(null);
      }
    } catch (error) {
      console.error('Error deleting poem:', error);
      toast.error('Fehler beim Löschen des Gedichts');
    }
  };

  const clearFilters = () => {
    setOccasionFilter('all');
    setContentTypeFilter('all');
  };

  const getUniqueOccasions = () => {
    const occasions = new Set(poems.map(poem => poem.occasion).filter(Boolean));
    return Array.from(occasions);
  };

  const getUniqueContentTypes = () => {
    const contentTypes = new Set(poems.map(poem => poem.content_type).filter(Boolean));
    return Array.from(contentTypes);
  };

  return {
    poems,
    filteredPoems,
    isLoading,
    selectedPoemId,
    selectedPoem,
    occasionFilter,
    contentTypeFilter,
    poemSlugs,
    slugToId,
    setSelectedPoemId,
    setOccasionFilter,
    setContentTypeFilter,
    handleDeletePoem,
    clearFilters,
    getUniqueOccasions,
    getUniqueContentTypes,
    findPoemBySlug,
    getSlugForPoemId
  };
};
