const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { validate } = require('../../middleware/validation');
const {
  getProfile,
  updateProfile,
  changePassword
} = require('../../controllers/user.controller');
const {
  updateProfileSchema,
  changePasswordSchema
} = require('../../validations/user.validation');

// Apply authentication to all user routes
router.use(authenticate);

// Get current user profile
router.get('/me', getProfile);

// Update user profile
router.patch('/me', validate(updateProfileSchema), updateProfile);

// Change password
router.post('/change-password', validate(changePasswordSchema), changePassword);

module.exports = router;