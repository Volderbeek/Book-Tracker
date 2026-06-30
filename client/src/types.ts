export interface Book {
  _id?: string;
  title: string;
  author: string;
  genre?: string;
  description?: string;
  status: 'Want to Read' | 'Reading' | 'Completed';
  rating: number;
  totalPages: number;
  currentPage?: number;
  startDate?: string;
  endDate?: string;
  review?: string;
  coverUrl?: string;
  openLibraryKey?: string;
  allGenres?: string;
  createdAt?: string;
}

export interface Stats {
  totalBooks: number;
  completedBooks: number;
  readingBooks: number;
  wantToReadBooks: number;
  genres: Record<string, number>;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface User {
  id: string;
  email: string;
}

