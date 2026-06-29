const express = require('express');
const router = express.Router();
const { protect, driverOnly } = require('../middleware/authMiddleware');
const {
    searchBuses, getRoutesWithStops, getTripLocation,
    subscribe, unsubscribe, updateLocation
} = require('../controllers/trackingController');

// Passenger — public (only needs login)
router.get('/search',            protect, searchBuses);
router.get('/routes-data',       getRoutesWithStops);                 // public
router.get('/trip/:id',          protect, getTripLocation);
router.post('/subscribe',        protect, subscribe);
router.delete('/subscribe/:tripId', protect, unsubscribe);

// Driver — GPS update
router.post('/update-location',  protect, driverOnly, updateLocation); // FIX: was unprotected

module.exports = router;