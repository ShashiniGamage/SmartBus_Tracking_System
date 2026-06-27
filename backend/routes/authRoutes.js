/*const express = require('express');
const router = express.Router();
//const { register, login } = require('../controllers/authController');
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;*/

/*const express = require('express');
const router = express.Router();


const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);       

module.exports = router;*/




const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);   // FIX: was missing

module.exports = router;