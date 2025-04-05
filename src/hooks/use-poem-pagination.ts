
import { useState } from 'react';

export const usePoemPagination = (initialPage = 1) => {
  const [page, setPage] = useState<number>(initialPage);
  const poemsPerPage = 12; // Fixed value as in original implementation
  
  const nextPage = () => {
    setPage(prev => prev + 1);
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };
  
  return { page, poemsPerPage, nextPage, prevPage, setPage };
};
