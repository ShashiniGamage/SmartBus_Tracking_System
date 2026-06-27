/*const express = require('express');
const router = express.Router();
const { getRoutesWithStops, updateLocation, reportIncident } = require('../controllers/trackingController');

router.get('/routes-data', getRoutesWithStops);
//router.post('/update-location', updateLocation);
router.post('/update-location', protect, driverOnly, updateLocation);

router.post('/report-incident', reportIncident);

module.exports = router;*/



const express = require('express');
const router = express.Router();


const { protect, adminOnly, driverOnly } = require('../middleware/authMiddleware'); 
const { getRoutesWithStops, updateLocation, reportIncident } = require('../controllers/trackingController');

router.get('/routes-data', getRoutesWithStops);


router.post('/update-location', protect, driverOnly, updateLocation); 
router.post('/report-incident', protect, reportIncident);

module.exports = router;