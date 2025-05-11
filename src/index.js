require('dotenv').config();
const express = require('express');
const initDB = require('./config/db-init');
const cors = require('cors');
const { redisClient } = require('./config/redis');
const logger = require('./utils/logger');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    redis: redisClient.isOpen ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use(routes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    errors: err.errors || undefined
  });
});

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
    await initDB();
    // Test Redis connection
    await redisClient.connect();
    await redisClient.ping();
    logger.info('✅ Redis connected successfully');
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Unable to start the server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  await redisClient.quit();
  process.exit(0);
});

startServer();

module.exports = app;
