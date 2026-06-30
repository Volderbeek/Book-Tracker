import { X, Star, Trash2, Edit3, BookOpen, Bookmark, CheckCircle } from 'lucide-react';
import type { Book } from '../types';
import { formatDate } from '../utils/helpers';

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onUpdateStatus: (book: Book, status: Book['status']) => void;
  onEditClick: (book: Book) => void;
  onDeleteClick: (book: Book) => void;
  onGenreClick: (book: Book) => void;
}

export function BookDetailsModal({
  isOpen,
  onClose,
  book,
  onUpdateStatus,
  onEditClick,
  onDeleteClick,
  onGenreClick,
}: BookDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Book Details</h2>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="book-details-layout">
            <div className="details-sidebar">
              {book.coverUrl ? (
                <img src={book.coverUrl} className="details-cover" alt={book.title} />
              ) : (
                <div className="details-cover">
                  <BookOpen size={48} style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>{book.title}</span>
                </div>
              )}
              
              {/* Quick actions inside details */}
              <div className="details-date-item">
                <span className="date-label" style={{ marginBottom: '4px' }}>Status Update</span>
                <select
                  value={book.status}
                  className="form-select"
                  style={{ padding: '8px 12px', fontSize: '13px' }}
                  onChange={(e) => {
                    const nextStatus = e.target.value as Book['status'];
                    onUpdateStatus(book, nextStatus);
                  }}
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="details-info">
              <div className="details-title-row">
                <h3 className="details-title">{book.title}</h3>
                <p className="details-author">by {book.author}</p>
              </div>

              <div className="details-meta-pills">
                {book.genre && book.genre.split(',').map((g) => {
                  const trimmed = g.trim();
                  if (!trimmed) return null;
                  return (
                    <span 
                      key={trimmed}
                      className="details-pill"
                      onClick={() => onGenreClick(book)}
                      style={{ cursor: 'pointer', border: '1px dashed var(--accent-purple)' }}
                      title="Genre Actions"
                    >
                      {trimmed}
                    </span>
                  );
                })}
                <span 
                  className={`details-pill status-${book.status === 'Completed' ? 'completed' : book.status === 'Reading' ? 'reading' : 'want'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {book.status === 'Completed' && <CheckCircle size={12} />}
                  {book.status === 'Reading' && <BookOpen size={12} />}
                  {book.status === 'Want to Read' && <Bookmark size={12} />}
                  <span>{book.status}</span>
                </span>
                <span className="details-pill">
                  {book.totalPages} pages
                </span>
              </div>

              {/* Rating Stars Display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="date-label">My Rating:</span>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={18} 
                      className={`star-icon ${star > book.rating ? 'empty' : ''}`}
                    />
                  ))}
                </div>
              </div>

              {/* Dates tracker */}
              <div className="details-section">
                <span className="details-section-title">Reading History</span>
                <div className="details-dates-grid">
                  <div className="details-date-item">
                    <span className="date-label">Started Reading</span>
                    <span className="date-value">{formatDate(book.startDate)}</span>
                  </div>
                  <div className="details-date-item">
                    <span className="date-label">Finished Reading</span>
                    <span className="date-value">{formatDate(book.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Book description */}
              {book.description && (
                <div className="details-section">
                  <span className="details-section-title">Description</span>
                  <p className="details-description">{book.description}</p>
                </div>
              )}

              {/* Book review/notes */}
              {book.review && (
                <div className="details-section">
                  <span className="details-section-title">My Notes & Reviews</span>
                  <p className="details-notes">"{book.review}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn-danger" onClick={() => onDeleteClick(book)}>
            <Trash2 size={16} />
            <span>Remove</span>
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => onEditClick(book)}>
              <Edit3 size={16} />
              <span>Edit Details</span>
            </button>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}
