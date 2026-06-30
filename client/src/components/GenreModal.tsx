import { useState, useEffect } from 'react';
import { X, Filter, Tag, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import type { Book } from '../types';
import { VALID_GENRES } from '../utils/helpers';

interface GenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onFilterGenre: (genre: string) => void;
  onUpdateBookGenre: (book: Book, genre: string) => Promise<void>;
}

export function GenreModal({
  isOpen,
  onClose,
  book,
  onFilterGenre,
  onUpdateBookGenre,
}: GenreModalProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showAllStandard, setShowAllStandard] = useState<boolean>(false);

  // Parse active genres when modal opens or book changes
  useEffect(() => {
    if (book && book.genre) {
      setSelectedGenres(book.genre.split(',').map(g => g.trim()).filter(Boolean));
    } else {
      setSelectedGenres([]);
    }
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  // Extract valid genres that the book had when pulled from Open Library
  const pulledGenres = book.allGenres
    ? book.allGenres.split(',').map(g => g.trim()).filter(Boolean)
    : [];

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        if (prev.length >= 3) {
          // Replace the last one or do nothing? Let's limit to 3 and show warning
          alert('You can select a maximum of 3 active genres.');
          return prev;
        }
        return [...prev, genre];
      }
    });
  };

  const handleSave = async () => {
    const updatedGenreString = selectedGenres.join(', ');
    await onUpdateBookGenre(book, updatedGenreString);
    onClose();
  };

  const handleFilterClick = (genre: string) => {
    onFilterGenre(genre);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Genre Settings</h2>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '16px' }}>
          {/* Header Info */}
          <div style={{ display: 'flex', gap: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '16px' }}>
            {book.coverUrl ? (
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
              />
            ) : (
              <div style={{ width: '40px', height: '60px', borderRadius: '6px', background: 'var(--gradient-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
                <BookOpen size={16} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Select up to 3 active genres.</p>
            </div>
          </div>

          {/* Filter Actions */}
          {selectedGenres.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="date-label" style={{ fontSize: '11px' }}>Quick Filter Shelf:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedGenres.map((genre) => (
                  <button 
                    key={genre}
                    className="btn-secondary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px', borderRadius: '8px' }}
                    onClick={() => handleFilterClick(genre)}
                  >
                    <Filter size={12} />
                    <span>Filter shelf by "{genre}"</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 1: Pulled from Open Library */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', margin: 0 }}>
              <Tag size={14} color="var(--accent-cyan)" />
              <span>Genres Pulled from Open Library:</span>
            </h3>
            
            {pulledGenres.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {pulledGenres.map((genre) => {
                  const isActive = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      className={`btn-secondary ${isActive ? 'active' : ''}`}
                      style={{ 
                        padding: '8px 12px', 
                        fontSize: '12px', 
                        borderRadius: '8px',
                        borderColor: isActive ? 'var(--accent-purple)' : 'var(--card-border)',
                        background: isActive ? 'var(--accent-purple-glow)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0', fontStyle: 'italic' }}>
                No valid genres were matching during Open Library pull.
              </p>
            )}
          </div>

          {/* Section 2: Collapsible list of all standard library categories */}
          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
            <button
              className="btn-secondary"
              style={{ 
                width: '100%', 
                justifyContent: 'space-between', 
                padding: '8px 12px', 
                fontSize: '13px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.01)'
              }}
              onClick={() => setShowAllStandard(!showAllStandard)}
            >
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={14} />
                Show All Standard Categories
              </span>
              {showAllStandard ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAllStandard && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '6px', 
                maxHeight: '180px', 
                overflowY: 'auto', 
                paddingRight: '4px',
                marginTop: '10px'
              }}>
                {VALID_GENRES.map((genre) => {
                  const isActive = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      className={`btn-secondary ${isActive ? 'active' : ''}`}
                      style={{ 
                        justifyContent: 'flex-start', 
                        padding: '8px 10px', 
                        fontSize: '12px', 
                        borderRadius: '6px',
                        borderColor: isActive ? 'var(--accent-purple)' : 'var(--card-border)',
                        textAlign: 'left',
                        background: isActive ? 'var(--accent-purple-glow)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}
                      onClick={() => handleGenreToggle(genre)}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleSave}>Save Selection</button>
        </div>
      </div>
    </div>
  );
}
