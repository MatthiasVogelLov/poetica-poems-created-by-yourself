
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import
import PoemFilters from '../PoemFilters';

describe('PoemFilters Component', () => {
  const mockProps = {
    occasionFilter: 'all',
    contentTypeFilter: 'all',
    setOccasionFilter: jest.fn(),
    setContentTypeFilter: jest.fn(),
    clearFilters: jest.fn(),
    occasions: ['hochzeit', 'geburtstag'],
    contentTypes: ['liebe', 'freundschaft'],
    getOccasionDisplay: jest.fn(occasion => {
      const map = {
        'hochzeit': 'Hochzeit',
        'geburtstag': 'Geburtstag'
      };
      return map[occasion] || occasion;
    }),
    getContentTypeDisplay: jest.fn(contentType => {
      const map = {
        'liebe': 'Liebe',
        'freundschaft': 'Freundschaft'
      };
      return map[contentType] || contentType;
    })
  };

  test('renders filter options correctly', () => {
    render(<PoemFilters {...mockProps} />);
    
    expect(screen.getByText('Filter:')).toBeInTheDocument();
    
    // Open the occasion dropdown
    fireEvent.click(screen.getAllByRole('combobox')[0]);
    expect(screen.getByText('Alle Anlässe')).toBeInTheDocument();
    expect(screen.getByText('Hochzeit')).toBeInTheDocument();
    expect(screen.getByText('Geburtstag')).toBeInTheDocument();
    
    // Open the content type dropdown
    fireEvent.click(screen.getAllByRole('combobox')[1]);
    expect(screen.getByText('Alle Themen')).toBeInTheDocument();
    expect(screen.getByText('Liebe')).toBeInTheDocument();
    expect(screen.getByText('Freundschaft')).toBeInTheDocument();
  });

  test('calls filter setters when options are selected', () => {
    render(<PoemFilters {...mockProps} />);
    
    // Select an occasion
    fireEvent.click(screen.getAllByRole('combobox')[0]);
    fireEvent.click(screen.getByText('Hochzeit'));
    expect(mockProps.setOccasionFilter).toHaveBeenCalledWith('hochzeit');
    
    // Select a content type
    fireEvent.click(screen.getAllByRole('combobox')[1]);
    fireEvent.click(screen.getByText('Liebe'));
    expect(mockProps.setContentTypeFilter).toHaveBeenCalledWith('liebe');
  });

  test('shows reset button when filters are active', () => {
    const activeFiltersProps = {
      ...mockProps,
      occasionFilter: 'hochzeit',
      contentTypeFilter: 'all'
    };
    
    render(<PoemFilters {...activeFiltersProps} />);
    expect(screen.getByText('Filter zurücksetzen')).toBeInTheDocument();
    
    // Click reset button
    fireEvent.click(screen.getByText('Filter zurücksetzen'));
    expect(mockProps.clearFilters).toHaveBeenCalled();
  });

  test('does not show reset button when no filters are active', () => {
    render(<PoemFilters {...mockProps} />);
    expect(screen.queryByText('Filter zurücksetzen')).not.toBeInTheDocument();
  });
});
