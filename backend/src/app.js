const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Route imports
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const status = {
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    server: {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    },
    database: {
      status: 'unknown',
      message: 'Database connectivity check not performed'
    }
  };

  // Test database connectivity
  try {
    const prisma = require('./config/database');
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    status.database = {
      status: 'healthy',
      message: 'Database connection successful'
    };
  } catch (error) {
    status.database = {
      status: 'unhealthy',
      message: 'Database connection failed',
      error: error.message
    };
    status.success = false;
  }

  const statusCode = status.success ? 200 : 503;
  res.status(statusCode).json(status);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;