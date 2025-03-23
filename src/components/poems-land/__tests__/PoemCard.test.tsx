
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import
import PoemCard from '../PoemCard';

describe('PoemCard Component', () => {
  const mockPoem = {
    id: '123',
    title: 'Test Poem Title',
    content: 'Test poem content',
    occasion: 'hochzeit',
    content_type: 'liebe',
    created_at: '2023-01-01T12:00:00Z',
  };

  const mockProps = {
    poem: mockPoem,
    getOccasionDisplay: jest.fn().mockReturnValue('Hochzeit'),
    getContentTypeDisplay: jest.fn().mockReturnValue('Liebe'),
    onDelete: jest.fn(),
    onClick: jest.fn(),
  };

  test('renders poem title correctly', () => {
    render(<PoemCard {...mockProps} />);
    expect(screen.getByText('Test Poem Title')).toBeInTheDocument();
  });

  test('renders badges with correct display values', () => {
    render(<PoemCard {...mockProps} />);
    expect(screen.getByText('Hochzeit')).toBeInTheDocument();
    expect(screen.getByText('Liebe')).toBeInTheDocument();
  });

  test('calls onClick handler when card is clicked', () => {
    render(<PoemCard {...mockProps} />);
    fireEvent.click(screen.getByText('Test Poem Title'));
    expect(mockProps.onClick).toHaveBeenCalled();
  });

  test('calls onDelete handler when delete button is clicked', () => {
    render(<PoemCard {...mockProps} />);
    
    // Find the delete button (X icon) and click it
    const deleteButton = screen.getByRole('button', { name: /delete/i }) || document.querySelector('[aria-label="delete"]');
    fireEvent.click(deleteButton);
    
    expect(mockProps.onDelete).toHaveBeenCalledWith('123', expect.any(Object));
    // Verify event propagation was stopped
    expect(mockProps.onClick).not.toHaveBeenCalled();
  });

  test('formats date correctly', () => {
    render(<PoemCard {...mockProps} />);
    // Check for formatted date based on German locale format
    const dateElement = screen.getByText(/01\.01\.2023|1\. Jan/i);
    expect(dateElement).toBeInTheDocument();
  });
});
