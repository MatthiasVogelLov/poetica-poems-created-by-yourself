
interface PoemData {
  title: string;
  poem: string;
  timestamp?: string;
}

// Function to retrieve poem data from localStorage
export const getPoemDataFromStorage = (): PoemData | null => {
  const storedPoemData = localStorage.getItem('currentPoemData');
  
  if (!storedPoemData) {
    console.error('No poem data found in localStorage');
    return null;
  }
  
  try {
    const parsedData = JSON.parse(storedPoemData);
    console.log('Retrieved poem data from localStorage:', parsedData);
    
    if (parsedData.title && parsedData.poem) {
      return parsedData;
    } else {
      console.error('Stored poem data is missing title or poem');
      return null;
    }
  } catch (e) {
    console.error('Error parsing stored poem data:', e);
    return null;
  }
};

// Function to save poem data to localStorage
export const savePoemDataToStorage = (title: string, poem: string): void => {
  const poemData = {
    title,
    poem,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('currentPoemData', JSON.stringify(poemData));
  console.log('Saved poem data to localStorage:', poemData);
};
