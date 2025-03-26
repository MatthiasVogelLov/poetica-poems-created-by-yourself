
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PoemFilters from '../PoemFilters';

describe('PoemFilters Component', () => {
  const mockProps = {
    occasionFilter: 'all',
    contentTypeFilter: 'all',
    styleFilter: 'all',
    audienceFilter: 'all',
    searchQuery: '',
    setOccasionFilter: jest.fn(),
    setContentTypeFilter: jest.fn(),
    setStyleFilter: jest.fn(),
    setAudienceFilter: jest.fn(),
    setSearchQuery: jest.fn(),
    clearFilters: jest.fn(),
    occasions: ['hochzeit', 'geburtstag'],
    contentTypes: ['liebe', 'freundschaft'],
    styles: ['klassisch', 'modern'],
    audiences: ['erwachsene', 'kinder'],
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
    }),
    getStyleDisplay: jest.fn(style => {
      const map = {
        'klassisch': 'Klassisch',
        'modern': 'Modern'
      };
      return map[style] || style;
    }),
    getAudienceDisplay: jest.fn(audience => {
      const map = {
        'erwachsene': 'Erwachsene',
        'kinder': 'Kinder'
      };
      return map[audience] || audience;
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
    
    // Open the audience dropdown
    fireEvent.click(screen.getAllByRole('combobox')[2]);
    expect(screen.getByText('Alle Zielgruppen')).toBeInTheDocument();
    expect(screen.getByText('Erwachsene')).toBeInTheDocument();
    expect(screen.getByText('Kinder')).toBeInTheDocument();
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
    
    // Select an audience
    fireEvent.click(screen.getAllByRole('combobox')[2]);
    fireEvent.click(screen.getByText('Erwachsene'));
    expect(mockProps.setAudienceFilter).toHaveBeenCalledWith('erwachsene');
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
