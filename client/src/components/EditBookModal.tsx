import React, { useState, useEffect } from 'react';
import { X, Star, BookOpen } from 'lucide-react';
import type { Book } from '../types';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onSubmit: (updatedFields: Partial<Book>) => Promise<void>;
}

export function EditBookModal({
  isOpen,
  onClose,
  book,
  onSubmit,
}: EditBookModalProps) {
  const [formData, setFormData] = useState<Partial<Book>>({
    status: 'Want to Read',
    rating: 0,
    review: '',
  });

  // Keep form data in sync when the selected book changes
  useEffect(() => {
    if (book) {
      setFormData({
        status: book.status,
        rating: book.rating,
        review: book.review || '',
      });
    }
  }, [book]);

  if (!isOpen) return null;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (val: number) => {
    setFormData(prev => ({ ...prev, rating: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Reading Tracker</h2>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Bibliographic Read-only Info Header */}
            <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--card-border)', borderRadius: '16px', marginBottom: '8px' }}>
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  style={{ width: '48px', height: '72px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <div style={{ width: '48px', height: '72px', borderRadius: '8px', background: 'var(--gradient-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                  <BookOpen size={16} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>by {book.author}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {book.genre && <span style={{ fontSize: '11px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px' }}>{book.genre}</span>}
                  <span style={{ fontSize: '11px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px' }}>{book.totalPages} pages</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>
              Note: Bibliographic details are pulled from Open Library and cannot be modified.
            </p>

            {/* Editable Tracking Fields */}
            <div className="form-group">
              <label className="form-label">Reading Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="form-select"
              >
                <option value="Want to Read">Want to Read</option>
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">My Rating</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((val) => (
                  <Star 
                    key={val} 
                    size={28} 
                    className={`rating-input-star ${val <= (formData.rating || 0) ? 'active' : ''}`}
                    onClick={() => handleRatingClick(val)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">My Review & Notes</label>
              <textarea 
                name="review"
                value={formData.review}
                onChange={handleFormChange}
                placeholder="Write your thoughts, reviews, or favorite quotes here..."
                className="form-textarea"
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
