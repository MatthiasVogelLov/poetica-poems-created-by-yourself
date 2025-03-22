
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Initial check
    setMatches(mediaQuery.matches);
    
    // Add listener for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Modern browsers
    mediaQuery.addEventListener("change", handler);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

// Add a convenient hook for mobile detection
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
