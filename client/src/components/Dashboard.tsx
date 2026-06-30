import { useState, useEffect } from 'react';
import { BookMarked, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Book, Stats } from '../types';

interface DashboardProps {
  stats: Stats;
  readingBooks: Book[];
  onUpdateStatus: (book: Book, status: Book['status']) => void;
  onBookClick: (book: Book) => void;
}

export function Dashboard({
  stats,
  readingBooks,
  onUpdateStatus,
  onBookClick,
}: DashboardProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // Sync index if books list size changes
  useEffect(() => {
    if (currentIdx >= readingBooks.length) {
      setCurrentIdx(Math.max(0, readingBooks.length - 1));
    }
  }, [readingBooks.length, currentIdx]);

  const currentReadingBook = readingBooks.length > 0 ? readingBooks[currentIdx] : null;

  return (
    <section className="dashboard-grid">
      <div className="stats-card">
        <h2 className="stats-header-text">Library Analytics</h2>
        
        <div className="stats-overview">
          <div className="stat-item">
            <span className="stat-label">Total Shelf</span>
            <span className="stat-value">{stats.totalBooks}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value purple">{stats.completedBooks}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Reading</span>
            <span className="stat-value cyan">{stats.readingBooks}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Want to Read</span>
            <span className="stat-value pink">{stats.wantToReadBooks}</span>
          </div>
        </div>

        {/* Progress Bar Widget */}
        <div className="progress-pie-section">
          <div className="progress-ring-container">
            <svg width="100" height="100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="var(--bg-tertiary)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                className="progress-ring-circle"
                cx="50"
                cy="50"
                r="40"
                stroke="var(--accent-purple)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={
                  251.2 - (251.2 * (stats.totalBooks > 0 ? (stats.completedBooks / stats.totalBooks) : 0))
                }
                strokeLinecap="round"
              />
            </svg>
            <span className="progress-ring-text">
              {stats.totalBooks > 0 
                ? Math.round((stats.completedBooks / stats.totalBooks) * 100) 
                : 0}%
            </span>
          </div>
          
          <div className="progress-pie-info">
            <h3 className="progress-pie-title">Reading Completion Rate</h3>
            <p className="progress-pie-desc">
              You have completed <strong>{stats.completedBooks} out of {stats.totalBooks} books</strong> on your shelf. Keep pushing your reading goals!
            </p>
          </div>
        </div>
      </div>

      {/* Quick reading or Genre Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Quick Update Widget */}
        {currentReadingBook ? (
          <div className="quick-read-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Currently Reading
              </h3>
              {readingBooks.length > 1 && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {currentIdx + 1} of {readingBooks.length}
                </span>
              )}
            </div>

            {/* Pagination buttons overlapping left and right edges */}
            {readingBooks.length > 1 && (
              <>
                <button 
                  className="quick-read-arrow-btn left"
                  onClick={() => setCurrentIdx(prev => (prev === 0 ? readingBooks.length - 1 : prev - 1))}
                  aria-label="Previous book"
                  title="Previous book"
                >
                  <ChevronLeft size={36} />
                </button>
                <button 
                  className="quick-read-arrow-btn right"
                  onClick={() => setCurrentIdx(prev => (prev === readingBooks.length - 1 ? 0 : prev + 1))}
                  aria-label="Next book"
                  title="Next book"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            <div className="quick-read-container">
              {currentReadingBook.coverUrl ? (
                <img 
                  src={currentReadingBook.coverUrl} 
                  className="quick-cover" 
                  alt={currentReadingBook.title} 
                  onClick={() => onBookClick(currentReadingBook)}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <div 
                  className="quick-cover" 
                  onClick={() => onBookClick(currentReadingBook)}
                  style={{ cursor: 'pointer' }}
                >
                  {currentReadingBook.title.substring(0, 15)}...
                </div>
              )}
              <div className="quick-info">
                <h4 
                  className="quick-title" 
                  onClick={() => onBookClick(currentReadingBook)} 
                  style={{ cursor: 'pointer' }}
                >
                  {currentReadingBook.title}
                </h4>
                <p className="quick-author">{currentReadingBook.author}</p>
                
                <div className="quick-actions">
                  <button 
                    className="btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '9999px' }}
                    onClick={() => onUpdateStatus(currentReadingBook, 'Completed')}
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="quick-read-section" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '130px', textAlign: 'center' }}>
            <BookMarked size={28} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No books currently being read.</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pick a book from your list to start reading!</p>
          </div>
        )}

        {/* Genre breakdown */}
        <div className="genres-card">
          <h3 className="stats-header-text">Genre Distribution</h3>
          <div className="genres-list">
            {Object.keys(stats.genres).length > 0 ? (
              Object.entries(stats.genres).map(([genre, count]) => {
                const percentage = Math.max(5, Math.min(100, (count / stats.totalBooks) * 100));
                return (
                  <div key={genre} className="genre-progress-bar-container">
                    <div className="genre-info">
                      <span className="genre-name">{genre}</span>
                      <span className="genre-count">{count} {count === 1 ? 'book' : 'books'}</span>
                    </div>
                    <div className="genre-track">
                      <div className="genre-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>
                No genres logged yet. Add genres to categorize.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
