const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const app = express();

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Gracefully shut down
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Gracefully shut down
    server.close(() => process.exit(1));
});

// Security Middleware
app.use(helmet()); // Add security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Request parsing middleware
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static('public'));

// Request logging
app.use(morgan('dev')); // Development logging
app.use((req, res, next) => {
  // Add request timestamp and ID
  req.requestTime = new Date().toISOString();
  req.requestId = req.headers['x-request-id'] || Math.random().toString(36).substring(7);
  next();
});

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date().toISOString() });
});

// Initialize MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // API Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/appointments', require('./routes/appointments'));

    // Error Handler Middleware (should be last)
    app.use(errorHandler);

    // 404 handler (must be last)
    app.use((req, res) => {
      res.status(404).json({ 
        status: 'error',
        message: 'Route not found'
      });
    });

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed. Process terminated.');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Doctor Appointment Booking API' });
});

// Error Handler Middleware (should be last piece of middleware)
app.use(errorHandler);

// Error handling for the express app
app.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});
