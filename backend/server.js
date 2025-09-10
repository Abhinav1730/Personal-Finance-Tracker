import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

import transactionRoutes from './routes/transactions.js';

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;

app.use(cors({
  origin: NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] // Replace with your frontend domain
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
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
  console.error('Global error handler:', err);
  
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
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${NODE_ENV}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      console.log(`\n📝 Available endpoints:`);
      console.log(`   GET    /api/transactions - Get all transactions`);
      console.log(`   GET    /api/transactions/:id - Get single transaction`);
      console.log(`   POST   /api/transactions - Create transaction`);
      console.log(`   PUT    /api/transactions/:id - Update transaction`);
      console.log(`   DELETE /api/transactions/:id - Delete transaction`);
      console.log(`   GET    /api/transactions/stats/summary - Get statistics`);
      console.log(`\n💡 Example API calls:`);
      console.log(`   curl http://localhost:${PORT}/api/transactions`);
      console.log(`   curl -X POST http://localhost:${PORT}/api/transactions \\`);
      console.log(`        -H "Content-Type: application/json" \\`);
      console.log(`        -d '{"title":"Salary","amount":5000,"category":"income"}'`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

startServer();