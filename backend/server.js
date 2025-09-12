import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import transactionRoutes from './routes/transactions.js';

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: NODE_ENV === 'production' 
    ? [
      "https://personal-finance-tracker-pi-three.vercel.app/"
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  next();
});

app.use('/api/transactions', transactionRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Personal Finance Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Personal Finance Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      transactions: '/api/transactions',
      stats: '/api/transactions/stats/summary'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value',
      field: Object.keys(err.keyValue)[0]
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connection to the MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
  } catch (error) {
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      // Server started successfully
    });
  } catch (error) {
    process.exit(1);
  }
};

process.on('unhandledRejection', (err, promise) => {
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  process.exit(1);
});

process.on('SIGTERM', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

startServer();