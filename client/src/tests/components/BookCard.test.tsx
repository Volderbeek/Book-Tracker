import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard } from '../../components/BookCard';
import type { Book } from '../../types';

const mockBookWithCover: Book = {
  _id: '1',
  title: 'Test Book One',
  author: 'Author One',
  genre: 'Science Fiction, Fantasy',
  status: 'Completed',
  rating: 4,
  totalPages: 350,
  coverUrl: 'https://example.com/cover.jpg'
};

const mockBookNoCover: Book = {
  _id: '2',
  title: 'Test Book Two',
  author: 'Author Two',
  genre: 'Biography',
  status: 'Want to Read',
  rating: 0,
  totalPages: 120,
};

describe('BookCard Component', () => {
  const mockOnBookClick = jest.fn();
  const mockOnGenreClick = jest.fn();
  const mockOnUpdateStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book details with cover image correctly', () => {
    render(
      <BookCard
        book={mockBookWithCover}
        onBookClick={mockOnBookClick}
        onGenreClick={mockOnGenreClick}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    // Verify text content
    expect(screen.getByText('Test Book One')).toBeInTheDocument();
    expect(screen.getByText('Author One')).toBeInTheDocument();
    expect(screen.getByText('Size: 350 pages')).toBeInTheDocument();

    // Verify genre tags
    expect(screen.getByText('Science Fiction')).toBeInTheDocument();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();

    // Verify cover image is rendered
    const image = screen.getByRole('img', { name: /Test Book One/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/cover.jpg');

    // Verify status badge
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders fallback cover UI when coverUrl is missing', () => {
    render(
      <BookCard
        book={mockBookNoCover}
        onBookClick={mockOnBookClick}
        onGenreClick={mockOnGenreClick}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    // Verify fallback texts in the cover placeholder
    // One for the fallback-text class, one for the title
    const fallbackTextElements = screen.getAllByText('Test Book Two');
    expect(fallbackTextElements.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Author Two').length).toBeGreaterThan(1);

    // Verify status badge default state
    expect(screen.getByText('Want to Read')).toBeInTheDocument();
  });

  it('calls onBookClick when card article is clicked', () => {
    render(
      <BookCard
        book={mockBookWithCover}
        onBookClick={mockOnBookClick}
        onGenreClick={mockOnGenreClick}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    // Click the card body/article
    const article = screen.getByRole('article');
    fireEvent.click(article);

    expect(mockOnBookClick).toHaveBeenCalledTimes(1);
    expect(mockOnBookClick).toHaveBeenCalledWith(mockBookWithCover);
  });

  it('calls onGenreClick and stops propagation when clicking a genre tag', () => {
    render(
      <BookCard
        book={mockBookWithCover}
        onBookClick={mockOnBookClick}
        onGenreClick={mockOnGenreClick}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    const genreTag = screen.getByText('Science Fiction');
    fireEvent.click(genreTag);

    // verify it calls onGenreClick, but not onBookClick (stop propagation)
    expect(mockOnGenreClick).toHaveBeenCalledTimes(1);
    expect(mockOnGenreClick).toHaveBeenCalledWith(mockBookWithCover);
    expect(mockOnBookClick).not.toHaveBeenCalled();
  });

  it('calls onUpdateStatus and stops propagation when status badge is clicked for "Want to Read"', () => {
    render(
      <BookCard
        book={mockBookNoCover}
        onBookClick={mockOnBookClick}
        onGenreClick={mockOnGenreClick}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    // Find the badge. In BookCard.tsx:
    // status is 'Want to Read', has text 'Want to Read' or badge-text-default
    // The wrapper has className book-card-badge
    const statusBadge = screen.getByText('Want to Read');
    fireEvent.click(statusBadge);

    expect(mockOnUpdateStatus).toHaveBeenCalledTimes(1);
    expect(mockOnUpdateStatus).toHaveBeenCalledWith(mockBookNoCover, 'Reading');
    expect(mockOnBookClick).not.toHaveBeenCalled();
  });

  it('does not call onUpdateStatus if status is "Completed"', () => {
    render(
      <BookCard
        book={mockBookWithCover}
        onBookClick={mockOnBookClick}
        onGenreClick={mockOnGenreClick}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    const statusBadge = screen.getByText('Completed');
    fireEvent.click(statusBadge);

    expect(mockOnUpdateStatus).not.toHaveBeenCalled();
  });
});
