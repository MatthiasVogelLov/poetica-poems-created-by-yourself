
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import
import { BrowserRouter } from 'react-router-dom';
import PoemsList from '../PoemsList';

// Mock components and functions
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('PoemsList Component', () => {
  const mockPoems = [
    {
      id: '1',
      title: 'Test Poem 1',
      content: 'Content of test poem 1',
      occasion: 'geburtstag',
      content_type: 'liebe',
      created_at: '2023-01-01T12:00:00Z',
    },
    {
      id: '2',
      title: 'Test Poem 2',
      content: 'Content of test poem 2',
      occasion: 'hochzeit',
      content_type: 'freundschaft',
      created_at: '2023-01-02T12:00:00Z',
    },
  ];

  const mockProps = {
    poems: mockPoems,
    isLoading: false,
    handleDeletePoem: jest.fn(),
    setSelectedPoemId: jest.fn(),
    getOccasionDisplay: (occasion: string) => occasion,
    getContentTypeDisplay: (contentType: string) => contentType,
  };

  test('renders poems correctly', () => {
    render(
      <BrowserRouter>
        <PoemsList {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Poem 1')).toBeInTheDocument();
    expect(screen.getByText('Test Poem 2')).toBeInTheDocument();
  });

  test('displays loading state when isLoading is true', () => {
    render(
      <BrowserRouter>
        <PoemsList {...mockProps} isLoading={true} />
      </BrowserRouter>
    );

    expect(screen.getByText('Gedichte werden geladen...')).toBeInTheDocument();
  });

  test('displays empty state when no poems are available', () => {
    render(
      <BrowserRouter>
        <PoemsList {...mockProps} poems={[]} />
      </BrowserRouter>
    );

    expect(screen.getByText('Keine Gedichte gefunden')).toBeInTheDocument();
    expect(screen.getByText('Gedicht erstellen')).toBeInTheDocument();
  });

  test('calls setSelectedPoemId when a poem card is clicked', () => {
    render(
      <BrowserRouter>
        <PoemsList {...mockProps} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Test Poem 1'));
    expect(mockProps.setSelectedPoemId).toHaveBeenCalledWith('1');
  });
});
