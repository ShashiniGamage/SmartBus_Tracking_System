/*const express = require('express');
const router = express.Router();
//const { register, login } = require('../controllers/authController');
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;*/

const express = require('express');
const router = express.Router();


const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);       

module.exports = router;