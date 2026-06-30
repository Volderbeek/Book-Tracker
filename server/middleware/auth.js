import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyforlocaldevchangeitlater';

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Middleware to check database connection status
export function checkDbConnection(req, res, next) {
  // readyState 1 means connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      isDbOffline: true,
      message: 'Database is down. Cloud synchronization is unavailable.',
    });
  }
  next();
}
