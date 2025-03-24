
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import
import SinglePoemView from '../SinglePoemView';

describe('SinglePoemView Component', () => {
  const mockPoem = {
    id: '123',
    title: 'Test Poem Title',
    content: 'Test poem content\nWith multiple lines',
    occasion: 'hochzeit',
    content_type: 'liebe',
    created_at: '2023-01-01T12:00:00Z',
  };

  const mockProps = {
    poem: mockPoem,
    isLoading: false,
    navigateBack: jest.fn(),
    getOccasionDisplay: jest.fn().mockReturnValue('Hochzeit'),
    getContentTypeDisplay: jest.fn().mockReturnValue('Liebe'),
  };

  test('renders poem details correctly', () => {
    render(<SinglePoemView {...mockProps} />);
    
    expect(screen.getByText('Test Poem Title')).toBeInTheDocument();
    expect(screen.getByText('Test poem content')).toBeInTheDocument();
    expect(screen.getByText('Hochzeit')).toBeInTheDocument();
    expect(screen.getByText('Liebe')).toBeInTheDocument();
    
    // Check for formatted date
    const dateElement = screen.getByText(/01\.01\.2023/);
    expect(dateElement).toBeInTheDocument();
  });

  test('calls goBack when back button is clicked', () => {
    render(<SinglePoemView {...mockProps} />);
    
    fireEvent.click(screen.getByText('Zurück zu allen Gedichten'));
    expect(mockProps.navigateBack).toHaveBeenCalled();
  });

  test('shows loading state when poem is null', () => {
    render(<SinglePoemView {...mockProps} poem={null} />);
    
    expect(screen.getByText('Gedicht nicht gefunden')).toBeInTheDocument();
  });

  test('renders multiline poem content correctly', () => {
    render(<SinglePoemView {...mockProps} />);
    
    expect(screen.getByText('Test poem content')).toBeInTheDocument();
    expect(screen.getByText('With multiple lines')).toBeInTheDocument();
  });
});
