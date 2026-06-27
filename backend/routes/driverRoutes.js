const express = require('express');
const router = express.Router();
const { protect, driverOnly } = require('../middleware/authMiddleware');
const {
    registerBus, getMyBus,
    createRoute, getMyRoutes,
    createSchedule, getMySchedules,
    startTrip, endTrip, reportDelay, getMyTrips
} = require('../controllers/driverController');

router.use(protect, driverOnly);

router.post('/bus',                   registerBus);
router.get('/bus',                    getMyBus);

router.post('/routes',                createRoute);
router.get('/routes',                 getMyRoutes);

router.post('/schedules',             createSchedule);
router.get('/schedules',              getMySchedules);

router.post('/trips/start',           startTrip);
router.patch('/trips/:id/end',        endTrip);
router.patch('/trips/:id/delay',      reportDelay);
router.get('/trips',                  getMyTrips);

module.exports = router;