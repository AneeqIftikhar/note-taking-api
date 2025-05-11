const express = require('express');
const router = express.Router();

// Base v1 route for testing
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Note Taking API v1'
  });
});



// Import route modules
const authRoutes = require('./auth.routes');
const noteRoutes = require('./note.routes');
const userRoutes = require('./user.routes');

// API v1 routes
router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);
router.use('/users', userRoutes);

module.exports = router;