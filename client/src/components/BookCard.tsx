import { BookOpen, Star, ChevronRight, Bookmark, CheckCircle } from 'lucide-react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
  onGenreClick: (book: Book) => void;
  onUpdateStatus?: (book: Book, status: Book['status']) => void;
}

export function BookCard({ book, onBookClick, onGenreClick, onUpdateStatus }: BookCardProps) {
  return (
    <article 
      className="book-card" 
      onClick={() => onBookClick(book)}
      style={{ cursor: 'pointer' }}
    >
      <div className="book-card-cover-wrapper">
        {book.coverUrl ? (
          <img src={book.coverUrl} className="book-card-cover" alt={book.title} loading="lazy" />
        ) : (
          <div className="book-card-cover-fallback">
            <BookOpen className="fallback-icon" size={32} />
            <span className="fallback-text">{book.title}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{book.author}</span>
          </div>
        )}
        
        {/* Status badges */}
        <span 
          className={`book-card-badge ${
            book.status === 'Completed' ? 'completed' : book.status === 'Reading' ? 'reading' : 'want'
          }`}
          onClick={(e) => {
            if (book.status === 'Want to Read' && onUpdateStatus) {
              e.stopPropagation();
              onUpdateStatus(book, 'Reading');
            }
          }}
          style={{ 
            cursor: book.status === 'Want to Read' ? 'pointer' : undefined,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {book.status === 'Completed' && (
            <CheckCircle size={11} />
          )}
          {book.status === 'Reading' && (
            <BookOpen size={11} />
          )}
          {book.status === 'Want to Read' && (
            <>
              <Bookmark size={11} className="badge-icon-default" />
              <BookOpen size={11} className="badge-icon-hover" />
            </>
          )}

          {book.status === 'Want to Read' ? (
            <>
              <span className="badge-text-default">Want to Read</span>
              <span className="badge-text-hover">Read</span>
            </>
          ) : (
            <span className="badge-text-default">{book.status}</span>
          )}
        </span>
      </div>

      <div className="book-card-body">
        <div className="book-card-meta">
          <h3 className="book-card-title" title={book.title}>{book.title}</h3>
          <p className="book-card-author">{book.author}</p>
        </div>

        {book.genre && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '4px 0' }}>
            {book.genre.split(',').map((g) => {
              const trimmed = g.trim();
              if (!trimmed) return null;
              return (
                <span 
                  key={trimmed}
                  className="book-card-genre"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenreClick(book);
                  }}
                  style={{ cursor: 'pointer', margin: 0 }}
                  title="Genre Actions"
                >
                  {trimmed}
                </span>
              );
            })}
          </div>
        )}

        {book.totalPages > 0 && (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Size: {book.totalPages} pages
          </div>
        )}

        <div className="book-card-footer">
          {/* Rating block */}
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={14} 
                className={`star-icon ${star > book.rating ? 'empty' : ''}`}
              />
            ))}
          </div>
          
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Details <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </span>
        </div>
      </div>
    </article>
  );
}
