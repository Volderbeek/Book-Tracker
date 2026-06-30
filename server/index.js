import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bookRouter from './routes/books.js';
import authRouter from './routes/auth.js';
import { checkDbConnection } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve directories (needed since we are in ES module mode)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/books', checkDbConnection, bookRouter);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  // Catch-all route to serve the React index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Book Tracker API is running in development mode. Start the Vite client for frontend.');
  });
}

// Connect to MongoDB and Start Server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/booktracker';

console.log('Connecting to MongoDB...');
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error details:', error.message);
    console.log('Please ensure your MongoDB instance is running.');
    console.log('Starting express server in offline-ready state (mock db operations will fail but API will be up)...');
    
    // Start server anyway to allow checking UI/health routes
    app.listen(PORT, () => {
      console.log(`Server (disconnected from MongoDB) is running on port ${PORT}`);
    });
  });
