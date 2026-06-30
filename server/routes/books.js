import express from 'express';
import Book from '../models/Book.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// GET all books
router.get('/', async (req, res) => {
  try {
    const { status, genre, sort } = req.query;
    let query = { userId: req.user.id };

    if (status) {
      query.status = status;
    }
    if (genre) {
      query.genre = { $regex: new RegExp(genre, 'i') };
    }

    let sortOptions = { createdAt: -1 }; // default: newest first
    if (sort) {
      if (sort === 'title') sortOptions = { title: 1 };
      else if (sort === 'author') sortOptions = { author: 1 };
      else if (sort === 'rating') sortOptions = { rating: -1 };
      else if (sort === 'progress') sortOptions = { currentPage: -1 };
    }

    const books = await Book.find(query).sort(sortOptions);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET statistics
router.get('/stats', async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id });
    
    const totalBooks = books.length;
    const completedBooks = books.filter(b => b.status === 'Completed').length;
    const readingBooks = books.filter(b => b.status === 'Reading').length;
    const wantToReadBooks = books.filter(b => b.status === 'Want to Read').length;
    
    let totalPagesRead = 0;
    books.forEach(b => {
      totalPagesRead += b.currentPage || 0;
    });

    // Genre distribution
    const genres = {};
    books.forEach(b => {
      if (b.genre) {
        const primaryGenre = b.genre.split(',')[0].trim();
        genres[primaryGenre] = (genres[primaryGenre] || 0) + 1;
      }
    });

    res.json({
      totalBooks,
      completedBooks,
      readingBooks,
      wantToReadBooks,
      totalPagesRead,
      genres,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new book
router.post('/', async (req, res) => {
  // Set automatic defaults if Completed
  const bookData = { ...req.body, userId: req.user.id };
  if (bookData.status === 'Completed' && bookData.totalPages > 0) {
    bookData.currentPage = bookData.totalPages;
  }
  
  const book = new Book(bookData);
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Extract only the allowed editable user-tracking fields
    const allowedKeys = ['status', 'currentPage', 'rating', 'review', 'startDate', 'endDate', 'genre', 'allGenres'];
    const updates = {};
    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    
    // Automatically manage page progress based on status changes
    if (updates.status === 'Completed' && book.totalPages > 0) {
      updates.currentPage = book.totalPages;
    } else if (updates.status === 'Want to Read') {
      updates.currentPage = 0;
    }

    // Automatically set status to Completed if progress is 100%
    if (updates.currentPage !== undefined && updates.currentPage === book.totalPages && book.totalPages > 0) {
      updates.status = 'Completed';
    }

    // Manage dates
    if (updates.status === 'Reading' && !book.startDate && !updates.startDate) {
      updates.startDate = new Date();
    }
    if (updates.status === 'Completed' && !book.endDate && !updates.endDate) {
      updates.endDate = new Date();
    }

    Object.assign(book, updates);
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
