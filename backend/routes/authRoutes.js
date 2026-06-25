const express = require('express');
const router = express.Router();

// Auth Controller eken functions deka import karaganima
const { registerUser, loginUser } = require('../controllers/authController');

//  (Register) - POST /api/auth/register
router.post('/register', registerUser);

//  (Login) - POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;