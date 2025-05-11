const express = require('express');
const router = express.Router();
const { register, login } = require('../../controllers/auth.controller');
const { validate } = require('../../middleware/validation');
const { loginSchema, registerSchema } = require('../../validations/auth.validation');

// Register user
router.post('/register', validate(registerSchema), register);

// Login user
router.post('/login', validate(loginSchema), login);

module.exports = router;