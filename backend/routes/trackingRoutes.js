const express = require('express');
const router = express.Router();
const { getRoutesWithStops, updateLocation, reportIncident } = require('../controllers/trackingController');

router.get('/routes-data', getRoutesWithStops);
router.post('/update-location', updateLocation);
router.post('/report-incident', reportIncident);

module.exports = router;