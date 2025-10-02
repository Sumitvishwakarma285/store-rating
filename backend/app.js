const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - IMPORTANT!
app.use(cors({
    origin: [
        'http://localhost:3000',  // React dev server
        'http://127.0.0.1:3000',  // Alternative localhost
        'http://localhost:3001'   // Alternative port
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

// Health check endpoint - IMPORTANT!
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Store Rating Platform API is running'
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: `Endpoint ${req.originalUrl} not found` });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error:', error);
    
    res.status(error.status || 500).json({
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

module.exports = app;
