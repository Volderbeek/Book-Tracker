import { HelpCircle } from 'lucide-react';
import type { Book } from '../types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onClearFilters: () => void;
  onGenreClick: (book: Book) => void;
  onUpdateStatus: (book: Book, status: Book['status']) => void;
}

export function BookGrid({ books, onBookClick, onClearFilters, onGenreClick, onUpdateStatus }: BookGridProps) {
  return (
    <main className="book-grid">
      {books.length > 0 ? (
        books.map((book) => (
          <BookCard 
            key={book._id} 
            book={book} 
            onBookClick={onBookClick} 
            onGenreClick={onGenreClick} 
            onUpdateStatus={onUpdateStatus}
          />
        ))
      ) : (
        <div className="empty-state animate-fade-in">
          <HelpCircle size={48} className="empty-icon" />
          <h2>No books found</h2>
          <p>Try refining your search keyword or changing your active filters.</p>
          <button 
            className="btn-secondary" 
            onClick={onClearFilters}
            style={{ marginTop: '8px' }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
}
