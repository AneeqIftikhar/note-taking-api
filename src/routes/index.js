const express = require('express');
const router = express.Router();
const v1 = require('./v1');
// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API v1 routes
router.use('/api/v1', v1);


// Handle 404 - Not Found
router.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found'
    });
  });


module.exports = router;