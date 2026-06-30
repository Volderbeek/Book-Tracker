import React, { useState } from 'react';
import { X, HelpCircle, BookOpen } from 'lucide-react';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (olBook: any) => Promise<void>;
  addingKey: string | null;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function AddBookModal({
  isOpen,
  onClose,
  onAddBook,
  addingKey,
  addToast,
}: AddBookModalProps) {
  const [olQuery, setOlQuery] = useState<string>('');
  const [olResults, setOlResults] = useState<any[]>([]);
  const [olSearching, setOlSearching] = useState<boolean>(false);
  const [olSearched, setOlSearched] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleOpenLibrarySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!olQuery.trim()) {
      addToast('Please enter a book title, author, or keyword', 'error');
      return;
    }
    setOlSearching(true);
    setOlSearched(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          olQuery
        )}&fields=key,title,author_name,cover_i,number_of_pages_median,first_publish_year,subject&limit=10`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setOlResults(data.docs || []);
    } catch (err) {
      console.error(err);
      addToast('Open Library search failed. Check your internet connection.', 'error');
    } finally {
      setOlSearching(false);
    }
  };

  const handleClose = () => {
    setOlQuery('');
    setOlResults([]);
    setOlSearching(false);
    setOlSearched(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Search & Add Book</h2>
          <button className="btn-icon-only" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Search for a book on Open Library. You can search by title, author, or keyword.
          </p>
          
          <form onSubmit={handleOpenLibrarySearch} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="e.g. The Lord of the Rings, Matt Haig..." 
              className="form-input"
              value={olQuery}
              onChange={(e) => setOlQuery(e.target.value)}
              style={{ flex: 1 }}
              required
            />
            <button type="submit" className="btn-primary" style={{ padding: '0 24px', borderRadius: '12px', height: '46px' }}>
              Search
            </button>
          </form>

          {/* Results Section */}
          <div className="search-results-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
            {olSearching && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '12px' }}>
                <div className="spinner"></div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Searching Open Library database...</span>
              </div>
            )}

            {!olSearching && olSearched && olResults.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                <HelpCircle size={32} style={{ marginBottom: '8px', color: 'var(--text-muted)' }} />
                <p style={{ fontSize: '15px', fontWeight: 600 }}>No matches found</p>
                <p style={{ fontSize: '13px' }}>Try checking spelling or search with author names.</p>
              </div>
            )}

            {!olSearching && olResults.length > 0 && olResults.map((result) => (
              <div key={result.key} className="search-result-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                background: 'var(--bg-tertiary)',
                borderRadius: '16px',
                border: '1px solid var(--card-border)',
                transition: 'var(--transition-fast)'
              }}>
                {result.cover_i ? (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${result.cover_i}-M.jpg`} 
                    alt={result.title} 
                    style={{ width: '48px', height: '72px', objectFit: 'cover', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}
                  />
                ) : (
                  <div style={{
                    width: '48px',
                    height: '72px',
                    borderRadius: '8px',
                    background: 'var(--gradient-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-purple)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <BookOpen size={16} />
                  </div>
                )}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={result.title}>
                    {result.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    by {result.author_name ? result.author_name.join(', ') : 'Unknown Author'}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {result.first_publish_year && <span>Published: {result.first_publish_year}</span>}
                    {result.number_of_pages_median && <span>Pages: {result.number_of_pages_median}</span>}
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '9999px', whiteSpace: 'nowrap', opacity: addingKey ? 0.7 : 1 }}
                  onClick={() => onAddBook(result)}
                  disabled={addingKey !== null}
                >
                  {addingKey === result.key ? 'Adding...' : 'Add Book'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
