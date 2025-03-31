
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Poem } from '@/types/poem-types';

interface UsePoemNavigationProps {
  poemSlug: string | undefined;
  findPoemBySlug: (slug: string) => string | null;
  setSelectedPoemId: (id: string | null) => void;
  getSlugForPoemId: (id: string) => string | null;
  selectedPoem: Poem | null;
}

export const usePoemNavigation = ({
  poemSlug,
  findPoemBySlug,
  setSelectedPoemId,
  getSlugForPoemId,
  selectedPoem
}: UsePoemNavigationProps) => {
  const navigate = useNavigate();

  // Handle navigation based on URL slug
  useEffect(() => {
    if (poemSlug) {
      console.log('Finding poem ID for slug:', poemSlug);
      const poemId = findPoemBySlug(poemSlug);
      
      if (poemId) {
        console.log('Setting selected poem ID from slug:', poemId);
        setSelectedPoemId(poemId);
      } else {
        console.log('Poem not found for slug:', poemSlug);
        navigate('/poemsland', { replace: true });
      }
    } else {
      setSelectedPoemId(null);
    }
  }, [poemSlug, findPoemBySlug, setSelectedPoemId, navigate]);

  // Update document title when selected poem changes
  useEffect(() => {
    if (selectedPoem) {
      document.title = `${selectedPoem.title} - PoemsLand`;
      
      // Inject CSS for better SEO markup in print and reader modes
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          .poem-content { font-size: 14pt; line-height: 1.5; }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    } else {
      document.title = "PoemsLand - Sammlung personalisierter Gedichte";
    }
  }, [selectedPoem]);

  // Navigation handlers
  const handleGoBack = () => {
    setSelectedPoemId(null);
    navigate('/poemsland', { replace: true });
  };

  const handleCreatePoem = () => {
    navigate('/generator');
  };

  const navigateToPoemDetail = (poemId: string) => {
    const slug = getSlugForPoemId(poemId);
    if (slug) {
      navigate(`/poemsland/${slug}`);
    }
  };

  return {
    handleGoBack,
    handleCreatePoem,
    navigateToPoemDetail
  };
};
