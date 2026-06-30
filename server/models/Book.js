import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
  },
  allGenres: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Want to Read', 'Reading', 'Completed'],
    default: 'Want to Read',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  totalPages: {
    type: Number,
    min: [0, 'Total pages cannot be negative'],
    default: 0,
  },
  currentPage: {
    type: Number,
    min: [0, 'Current page cannot be negative'],
    default: 0,
    validate: {
      validator: function(value) {
        return value <= this.totalPages;
      },
      message: 'Current page ({VALUE}) cannot exceed total pages',
    },
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  review: {
    type: String,
    trim: true,
  },
  coverUrl: {
    type: String,
    trim: true,
  },
  openLibraryKey: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
