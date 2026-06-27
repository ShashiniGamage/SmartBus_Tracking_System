/*const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getPendingDrivers, approveDriver } = require('../controllers/adminController');

// Only admin can see and approve pending drivers.
router.get('/pending-drivers', protect, adminOnly, getPendingDrivers);
router.put('/approve-driver/:id', protect, adminOnly, approveDriver);

module.exports = router;*/



const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getAllDrivers, updateDriverStatus,
    getAllRoutes, updateRouteStatus,
    getActiveTrips, getTodayIncidents
} = require('../controllers/adminController');

router.use(protect, adminOnly);   // all admin routes protected

router.get('/drivers',                getAllDrivers);
router.patch('/drivers/:id/status',   updateDriverStatus);

router.get('/routes',                 getAllRoutes);
router.patch('/routes/:id',           updateRouteStatus);

router.get('/trips/active',           getActiveTrips);
router.get('/trips/today',            getTodayIncidents);

module.exports = router;