import { useState, useEffect, useRef, useCallback } from 'react';
import type { Book, Stats, Toast, User } from './types';
import { ToastList } from './components/ToastList';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ControlsBar } from './components/ControlsBar';
import { BookGrid } from './components/BookGrid';
import { AddBookModal } from './components/AddBookModal';
import { EditBookModal } from './components/EditBookModal';
import { BookDetailsModal } from './components/BookDetailsModal';
import { GenreModal } from './components/GenreModal';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DbOfflineModal } from './components/DbOfflineModal';
import { extractDescription, getValidGenresFromSubjects } from './utils/helpers';
import './App.css';

// Initial mock data for fallback offline/local mode
const INITIAL_MOCK_BOOKS: Book[] = [
  {
    _id: 'mock-1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    allGenres: 'Fiction, Fantasy',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    status: 'Reading',
    rating: 4,
    totalPages: 304,
    startDate: '2026-06-15T12:00:00.000Z',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    review: 'Really enjoying the philosophical take on choices and regrets. A very cozy and readable book.',
    openLibraryKey: '/works/OL18192806W',
  },
  {
    _id: 'mock-2',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help / Personal Growth',
    allGenres: 'Self-Help / Personal Growth, Non-Fiction',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies.',
    status: 'Completed',
    rating: 5,
    totalPages: 320,
    startDate: '2026-05-01T12:00:00.000Z',
    endDate: '2026-05-20T12:00:00.000Z',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    review: 'An absolute game-changer. The 1% better every day philosophy has completely shifted my mindset on productivity.',
    openLibraryKey: '/works/OL20067332W',
  },
  {
    _id: 'mock-3',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction / Sci-Fi, Fantasy',
    allGenres: 'Science Fiction / Sci-Fi, Fantasy, Classics, Adventure / Action',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the mysterious man known as Muad\'Dib.',
    status: 'Want to Read',
    rating: 0,
    totalPages: 617,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    review: '',
    openLibraryKey: '/works/OL366750W',
  }
];

const defaultStats: Stats = {
  totalBooks: 0,
  completedBooks: 0,
  readingBooks: 0,
  wantToReadBooks: 0,
  genres: {},
};

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  // App settings - default to offline mode if no token is present
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [isLocalMode, setIsLocalMode] = useState<boolean>(() => !localStorage.getItem('token'));
  
  // Search / filter / sort
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isGenreOpen, setIsGenreOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isDbOfflineOpen, setIsDbOfflineOpen] = useState<boolean>(false);
  const [genreBook, setGenreBook] = useState<Book | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [addingKey, setAddingKey] = useState<string | null>(null);

  // Ref to track page initialization
  const isInitialized = useRef(false);

  // Add toast helper
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Switch dark/light mode
  const toggleTheme = useCallback(() => {
    setIsLightMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
      return newMode;
    });
  }, []);

  // Load theme preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!prefersDark) {
      toggleTheme();
    }
  }, [toggleTheme]);

  const calculateStats = useCallback((booksList: Book[]) => {
    const totalBooks = booksList.length;
    const completedBooks = booksList.filter(b => b.status === 'Completed').length;
    const readingBooks = booksList.filter(b => b.status === 'Reading').length;
    const wantToReadBooks = booksList.filter(b => b.status === 'Want to Read').length;
    
    const genres: Record<string, number> = {};

    booksList.forEach(b => {
      if (b.genre) {
        const primaryGenre = b.genre.split(',')[0].trim();
        genres[primaryGenre] = (genres[primaryGenre] || 0) + 1;
      }
    });

    setStats({
      totalBooks,
      completedBooks,
      readingBooks,
      wantToReadBooks,
      genres,
    });
  }, []);

  // Local storage helpers (offline fallback mode)
  const loadLocalData = useCallback(() => {
    const localBooksStr = localStorage.getItem('books');
    let localBooks = INITIAL_MOCK_BOOKS;
    if (localBooksStr) {
      localBooks = JSON.parse(localBooksStr);
    } else {
      localStorage.setItem('books', JSON.stringify(INITIAL_MOCK_BOOKS));
    }
    setBooks(localBooks);
    calculateStats(localBooks);
    setLoading(false);
  }, [calculateStats]);

  // Sign out helper
  const handleSignOut = useCallback((showToast = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLocalMode(true);
    loadLocalData();
    if (showToast) {
      addToast('Signed out successfully. Reverted to offline local mode.', 'info');
    }
  }, [loadLocalData, addToast]);

  // Database offline handler
  const handleDatabaseOffline = useCallback(() => {
    const hasToken = !!token || !!localStorage.getItem('token');
    if (hasToken) {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLocalMode(true);
      setIsDbOfflineOpen(true);
      loadLocalData();
    }
  }, [token, loadLocalData]);

  // Wrapper for authenticated fetch with DB connectivity verification
  const apiFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    
    const storedToken = localStorage.getItem('token') || token;
    if (storedToken) {
      headers.set('Authorization', `Bearer ${storedToken}`);
    }
    
    if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (response.status === 503) {
        const body = await response.json().catch(() => ({}));
        if (body.isDbOffline) {
          handleDatabaseOffline();
          throw new Error('DATABASE_OFFLINE');
        }
      }

      if (response.status === 401 || response.status === 403) {
        handleSignOut(false);
        throw new Error('SESSION_EXPIRED');
      }

      return response;
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        const hasToken = !!token || !!localStorage.getItem('token');
        if (hasToken) {
          handleDatabaseOffline();
          throw new Error('DATABASE_OFFLINE');
        }
      }
      throw err;
    }
  }, [token, handleDatabaseOffline, handleSignOut]);

  // Fetch books and stats from server
  const loadData = useCallback(async () => {
    setLoading(true);
    
    if (isLocalMode) {
      loadLocalData();
      return;
    }

    try {
      const response = await apiFetch('/api/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const booksData = await response.json();
      setBooks(booksData);

      const statsResponse = await apiFetch('/api/books/stats');
      if (!statsResponse.ok) throw new Error('Failed to fetch statistics');
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      if (!isInitialized.current) {
        addToast('Connected to database successfully.', 'success');
        isInitialized.current = true;
      }
    } catch (err: any) {
      if (err.message === 'DATABASE_OFFLINE' || err.message === 'SESSION_EXPIRED') {
        return;
      }
      console.warn('Backend server unavailable or connection error. Reverting to offline mode.', err);
      handleDatabaseOffline();
    } finally {
      setLoading(false);
    }
  }, [isLocalMode, loadLocalData, addToast, apiFetch, handleDatabaseOffline]);

  const handleAuthSuccess = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLocalMode(false);
  }, []);

  const updateLocalBooks = (updatedList: Book[]) => {
    localStorage.setItem('books', JSON.stringify(updatedList));
    setBooks(updatedList);
    calculateStats(updatedList);
  };

  // Trigger load data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add Book from Open Library result
  const handleAddOpenLibraryBook = async (olBook: any) => {
    const exists = books.some((b) => b.openLibraryKey === olBook.key);
    if (exists) {
      addToast('This book is already on your shelf!', 'error');
      return;
    }

    setAddingKey(olBook.key);
    let resolvedDescription = '';
    let resolvedGenre = '';
    let resolvedAllGenres = '';

    try {
      const response = await fetch(`https://openlibrary.org${olBook.key}.json`);
      if (response.ok) {
        const workDetails = await response.json();
        resolvedDescription = extractDescription(workDetails);
        const subjects = workDetails.subjects || olBook.subject || [];
        const validGenresList = getValidGenresFromSubjects(subjects);
        resolvedGenre = validGenresList.slice(0, 3).join(', ');
        resolvedAllGenres = validGenresList.join(', ');
      } else {
        throw new Error('Failed to fetch detailed work metadata');
      }
    } catch (err) {
      console.warn('Could not fetch detailed work metadata, falling back to search result data.', err);
      resolvedDescription = `First published in ${olBook.first_publish_year || 'unknown year'}.`;
      const validGenresList = getValidGenresFromSubjects(olBook.subject || []);
      resolvedGenre = validGenresList.slice(0, 3).join(', ');
      resolvedAllGenres = validGenresList.join(', ');
    }

    if (!resolvedGenre) resolvedGenre = 'Fiction';
    if (!resolvedAllGenres) resolvedAllGenres = 'Fiction';
    if (!resolvedDescription) {
      resolvedDescription = olBook.first_publish_year 
        ? `First published in ${olBook.first_publish_year}.` 
        : 'No description available.';
    }

    const title = olBook.title;
    const author = olBook.author_name ? olBook.author_name.join(', ') : 'Unknown Author';
    const coverUrl = olBook.cover_i ? `https://covers.openlibrary.org/b/id/${olBook.cover_i}-L.jpg` : '';
    const totalPages = olBook.number_of_pages_median || 250;

    const payload = {
      title,
      author,
      genre: resolvedGenre,
      allGenres: resolvedAllGenres,
      description: resolvedDescription,
      status: 'Want to Read' as const,
      rating: 0,
      totalPages,
      coverUrl,
      review: '',
      openLibraryKey: olBook.key,
    };

    if (isLocalMode) {
      const newBook = {
        ...payload,
        _id: 'local-' + Date.now().toString(),
        createdAt: new Date().toISOString()
      } as Book;
      updateLocalBooks([newBook, ...books]);
      addToast(`"${title}" added to local shelf!`);
      setIsAddOpen(false);
      setAddingKey(null);
    } else {
      try {
        const res = await apiFetch('/api/books', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error creating book');
        
        addToast(`"${title}" added to your shelf!`);
        setIsAddOpen(false);
        loadData();
      } catch (err: any) {
        if (err.message !== 'DATABASE_OFFLINE' && err.message !== 'SESSION_EXPIRED') {
          addToast(err.message || 'Error adding book', 'error');
        }
      } finally {
        setAddingKey(null);
      }
    }
  };

  // Edit Book Submission
  const handleEditSubmit = async (payload: Partial<Book>) => {
    if (!selectedBook?._id) return;

    if (isLocalMode) {
      const updatedList = books.map((b) => {
        if (b._id === selectedBook._id) {
          const updatedBook = {
            ...b,
            status: payload.status,
            rating: payload.rating,
            review: payload.review,
          } as Book;
          
          if (updatedBook.status === 'Completed' && !updatedBook.endDate) {
            updatedBook.endDate = new Date().toISOString();
          }
          if (updatedBook.status === 'Reading' && !updatedBook.startDate) {
            updatedBook.startDate = new Date().toISOString();
          }
          return updatedBook;
        }
        return b;
      });
      
      updateLocalBooks(updatedList);
      addToast('Book details updated');
      setIsEditOpen(false);
      
      const synced = updatedList.find(b => b._id === selectedBook._id);
      if (synced) setSelectedBook(synced);
    } else {
      try {
        const res = await apiFetch(`/api/books/${selectedBook._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Error updating book');
        const updated = await res.json();
        
        // Sync parent book states
        setBooks(prev => prev.map(b => b._id === selectedBook._id ? updated : b));
        calculateStats(books.map(b => b._id === selectedBook._id ? updated : b));
        setSelectedBook(updated);
        
        addToast('Book details updated successfully!');
        setIsEditOpen(false);
      } catch (err: any) {
        if (err.message !== 'DATABASE_OFFLINE' && err.message !== 'SESSION_EXPIRED') {
          addToast(err.message || 'Error updating book', 'error');
        }
      }
    }
  };

  // Delete Book
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this book from your collection?')) return;

    if (isLocalMode) {
      const updatedList = books.filter((b) => b._id !== id);
      updateLocalBooks(updatedList);
      addToast('Book removed from library', 'info');
      setIsDetailsOpen(false);
      setSelectedBook(null);
    } else {
      try {
        const res = await apiFetch(`/api/books/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error deleting book');
        
        addToast('Book removed from library', 'info');
        setIsDetailsOpen(false);
        setSelectedBook(null);
        loadData();
      } catch (err: any) {
        if (err.message !== 'DATABASE_OFFLINE' && err.message !== 'SESSION_EXPIRED') {
          addToast(err.message || 'Error deleting book', 'error');
        }
      }
    }
  };

  // Direct status update from UI triggers
  const updateStatus = async (book: Book, nextStatus: Book['status']) => {
    let endDate = book.endDate;
    let startDate = book.startDate;

    if (nextStatus === 'Reading' && !startDate) {
      startDate = new Date().toISOString();
    }
    if (nextStatus === 'Completed' && !endDate) {
      endDate = new Date().toISOString();
    }

    const payload = {
      status: nextStatus,
      startDate,
      endDate,
    };

    if (isLocalMode) {
      const updatedList = books.map((b) => {
        if (b._id === book._id) {
          return { ...b, ...payload } as Book;
        }
        return b;
      });
      updateLocalBooks(updatedList);
      const synced = updatedList.find(b => b._id === book._id);
      if (synced) setSelectedBook(synced);
    } else {
      try {
        const res = await apiFetch(`/api/books/${book._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update status');
        const updated = await res.json();
        
        setBooks(prev => prev.map(b => b._id === book._id ? updated : b));
        calculateStats(books.map(b => b._id === book._id ? updated : b));
        
        if (selectedBook?._id === book._id) {
          setSelectedBook(updated);
        }
        
        const statsRes = await apiFetch('/api/books/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err: any) {
        if (err.message !== 'DATABASE_OFFLINE' && err.message !== 'SESSION_EXPIRED') {
          console.error('Failed to update status:', err);
          addToast('Error saving status update', 'error');
        }
      }
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsOpen(true);
  };

  const handleEditClickInDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsOpen(false);
    setIsEditOpen(true);
  };

  const handleDeleteClickInDetails = (book: Book) => {
    if (book._id) {
      handleDelete(book._id);
    }
  };

  const handleGenreClick = (book: Book) => {
    setGenreBook(book);
    setIsGenreOpen(true);
  };

  const handleUpdateBookGenre = async (book: Book, genre: string) => {
    const payload = { genre };

    if (isLocalMode) {
      const updatedList = books.map((b) => {
        if (b._id === book._id) {
          return { ...b, genre } as Book;
        }
        return b;
      });
      updateLocalBooks(updatedList);
      addToast(`Genre updated to "${genre}"`);
      
      if (selectedBook?._id === book._id) {
        setSelectedBook(prev => prev ? { ...prev, genre } : null);
      }
    } else {
      try {
        const res = await apiFetch(`/api/books/${book._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update genre');
        const updated = await res.json();
        
        setBooks(prev => prev.map(b => b._id === book._id ? updated : b));
        calculateStats(books.map(b => b._id === book._id ? updated : b));
        
        if (selectedBook?._id === book._id) {
          setSelectedBook(updated);
        }
        
        addToast(`Genre updated to "${genre}"`);
      } catch (err: any) {
        if (err.message !== 'DATABASE_OFFLINE' && err.message !== 'SESSION_EXPIRED') {
          console.error('Failed to update genre:', err);
          addToast('Error saving genre update', 'error');
        }
      }
    }
  };

  // Quick read logic (find all books with "Reading" status)
  const readingBooks = books.filter(b => b.status === 'Reading');

  // Filter and Sort Books logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.genre && book.genre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || book.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'pages') {
      return b.totalPages - a.totalPages;
    }
    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
  });

  return (
    <div className="app-container">
      <ToastList toasts={toasts} />

      <Header 
        isLightMode={isLightMode} 
        user={user} 
        onToggleTheme={toggleTheme} 
        onAuthClick={() => setIsAuthOpen(true)} 
        onSignOut={() => handleSignOut(true)} 
        onAddBookClick={() => setIsAddOpen(true)} 
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Opening your library...</p>
        </div>
      ) : (
        <>
          <Dashboard 
            stats={stats} 
            readingBooks={readingBooks} 
            onUpdateStatus={updateStatus} 
            onBookClick={handleBookClick} 
          />

          <ControlsBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            statusFilter={statusFilter} 
            onStatusFilterChange={setStatusFilter} 
            sortBy={sortBy} 
            onSortByChange={setSortBy} 
          />

          <BookGrid 
            books={filteredBooks} 
            onBookClick={handleBookClick} 
            onClearFilters={() => { setSearchTerm(''); setStatusFilter('All'); }} 
            onGenreClick={handleGenreClick}
            onUpdateStatus={updateStatus}
          />
        </>
      )}

      <AddBookModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAddBook={handleAddOpenLibraryBook} 
        addingKey={addingKey} 
        addToast={addToast} 
      />

      {selectedBook && (
        <EditBookModal 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          book={selectedBook} 
          onSubmit={handleEditSubmit} 
        />
      )}

      {selectedBook && (
        <BookDetailsModal 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          book={selectedBook} 
          onUpdateStatus={updateStatus} 
          onEditClick={handleEditClickInDetails} 
          onDeleteClick={handleDeleteClickInDetails} 
          onGenreClick={handleGenreClick}
        />
      )}

      <GenreModal 
        isOpen={isGenreOpen} 
        onClose={() => { setIsGenreOpen(false); setGenreBook(null); }} 
        book={genreBook} 
        onFilterGenre={(genre) => setSearchTerm(genre)} 
        onUpdateBookGenre={handleUpdateBookGenre} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
        addToast={addToast} 
      />

      <DbOfflineModal 
        isOpen={isDbOfflineOpen} 
        onClose={() => setIsDbOfflineOpen(false)} 
      />

      <Footer />
    </div>
  );
}

export default App;
