// Safe dotenv loading for production
if (process.env.NODE_ENV !== 'production') {
  try {
      require('dotenv').config();
  } catch (error) {
      console.log('dotenv not available, using environment variables');
  }
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://store-rating-frontend.onrender.com'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
      status: 'OK',
      service: 'Store Rating API',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
      message: 'Store Rating Platform API',
      version: '1.0.0',
      status: 'Running successfully'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  res.status(error.status || 500).json({
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API endpoint ${req.originalUrl} not found` });
});

const startServer = async () => {
  try {
      // Test database connection
      await testConnection();
      
      app.listen(PORT, '0.0.0.0', () => {
          console.log(`🚀 Store Rating API server running on port ${PORT}`);
          console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
          console.log(`📊 Database: ${process.env.DB_NAME}`);
          console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      });
  } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
  }
};

startServer();
