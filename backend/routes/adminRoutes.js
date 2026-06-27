const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getPendingDrivers, approveDriver } = require('../controllers/adminController');

// Only admin can see and approve pending drivers.
router.get('/pending-drivers', protect, adminOnly, getPendingDrivers);
router.put('/approve-driver/:id', protect, adminOnly, approveDriver);

module.exports = router;