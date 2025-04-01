
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <div className="flex items-center">
        <input
          type="search"
          placeholder="Gedichte durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
