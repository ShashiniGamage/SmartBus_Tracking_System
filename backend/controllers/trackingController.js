
/*const db = require('../config/db');

// ── Public / Passenger ────────────────────────────────────────

// GET /api/tracking/search?origin=Kandy&destination=Colombo
const searchBuses = async (req, res) => {
    const { origin, destination } = req.query;
    if (!origin || !destination)
        return res.status(400).json({ message: 'origin and destination required' });
    try {
        const [trips] = await db.query(`
            SELECT t.id AS trip_id, t.status, t.current_lat, t.current_lng,
                   t.delay_reason, t.extra_minutes, t.started_at,
                   b.bus_number, b.type AS bus_type, b.capacity,
                   r.id AS route_id, r.route_name, r.origin, r.destination,
                   s.departure_time, s.days_of_week,
                   u.name AS driver_name
            FROM Routes r
            JOIN Trips t      ON t.route_id = r.id
            JOIN Buses b      ON t.bus_id   = b.id
            JOIN Users u      ON t.driver_id= u.id
            LEFT JOIN Schedules s ON t.schedule_id = s.id
            WHERE LOWER(r.origin)=LOWER(?) AND LOWER(r.destination)=LOWER(?)
              AND r.status='approved'
              AND t.status IN ('scheduled','active','delayed')
            ORDER BY s.departure_time
        `, [origin, destination]);

        // Calculate ETA for each trip
        for (const trip of trips) {
            trip.eta = await calculateETA(trip.trip_id, trip.route_id);
        }

        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/tracking/routes-data  — all approved routes + stops
const getRoutesWithStops = async (req, res) => {
    try {
        const [routes] = await db.query(`SELECT * FROM Routes WHERE status='approved'`);
        const [stops]  = await db.query(`SELECT * FROM Route_Stops ORDER BY route_id, stop_order`);
        res.json({ routes, stops });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch routes', error: error.message });
    }
};

// GET /api/tracking/trip/:id  — live location + ETA for a specific trip
const getTripLocation = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.id, t.status, t.current_lat, t.current_lng,
                   t.delay_reason, t.extra_minutes, t.started_at,
                   b.bus_number, b.type AS bus_type,
                   r.route_name, r.origin, r.destination, r.id AS route_id,
                   u.name AS driver_name
            FROM Trips t
            JOIN Buses b  ON t.bus_id   = b.id
            JOIN Routes r ON t.route_id = r.id
            JOIN Users u  ON t.driver_id= u.id
            WHERE t.id=?
        `, [req.params.id]);

        if (!rows.length) return res.status(404).json({ message: 'Trip not found' });

        const trip = rows[0];
        const [stops] = await db.query(
            `SELECT * FROM Route_Stops WHERE route_id=? ORDER BY stop_order`,
            [trip.route_id]
        );

        // ETA per stop
        const eta = await calculateETA(trip.id, trip.route_id, trip.started_at, trip.extra_minutes);
        trip.stops = stops;
        trip.eta   = eta;

        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/tracking/subscribe  — passenger picks trip + boarding stop
const subscribe = async (req, res) => {
    const { trip_id, boarding_stop } = req.body;
    if (!trip_id || !boarding_stop)
        return res.status(400).json({ message: 'trip_id and boarding_stop required' });
    try {
        // Remove old subscription for same trip if exists
        await db.query(
            `DELETE FROM Subscriptions WHERE passenger_id=? AND trip_id=?`,
            [req.user.id, trip_id]
        );
        await db.query(
            `INSERT INTO Subscriptions (passenger_id, trip_id, boarding_stop) VALUES (?,?,?)`,
            [req.user.id, trip_id, boarding_stop]
        );
        res.json({ message: 'Subscribed to trip tracking' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE /api/tracking/subscribe/:tripId  — manually stop tracking
const unsubscribe = async (req, res) => {
    try {
        await db.query(
            `UPDATE Subscriptions SET is_active=FALSE WHERE passenger_id=? AND trip_id=?`,
            [req.user.id, req.params.tripId]
        );
        res.json({ message: 'Tracking stopped' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Driver ────────────────────────────────────────────────────

// POST /api/tracking/update-location  (driver GPS)
const updateLocation = async (req, res) => {
    const { trip_id, lat, lng, is_gps_active, minutes_elapsed } = req.body;
    try {
        if (is_gps_active) {
            await db.query(
                `UPDATE Trips SET current_lat=?, current_lng=?, status='active' WHERE id=? AND driver_id=?`,
                [lat, lng, trip_id, req.user.id]
            );
            return res.json({ status: 'success', mode: 'GPS Live Tracking' });
        } else {
            // Time-based fallback
            const [trip] = await db.query(`SELECT route_id FROM Trips WHERE id=? AND driver_id=?`, [trip_id, req.user.id]);
            if (!trip.length) return res.status(404).json({ message: 'Trip not found' });

            const [stops] = await db.query(
                `SELECT latitude, longitude FROM Route_Stops
                 WHERE route_id=? AND estimated_time_from_start<=?
                 ORDER BY stop_order DESC LIMIT 1`,
                [trip[0].route_id, minutes_elapsed]
            );
            if (stops.length) {
                await db.query(
                    `UPDATE Trips SET current_lat=?, current_lng=? WHERE id=?`,
                    [stops[0].latitude, stops[0].longitude, trip_id]
                );
            }
            return res.json({ status: 'success', mode: 'Time-based Fallback' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Tracking update failed', error: error.message });
    }
};

// ── ETA Helper ────────────────────────────────────────────────
async function calculateETA(tripId, routeId, startedAt, extraMinutes = 0) {
    try {
        const [stops] = await db.query(
            `SELECT stop_name, stop_order, estimated_time_from_start FROM Route_Stops
             WHERE route_id=? ORDER BY stop_order`,
            [routeId]
        );
        if (!startedAt || !stops.length) return stops.map(s => ({ ...s, eta: null }));

        const start = new Date(startedAt);
        return stops.map(s => {
            const arrivalMs = start.getTime() + (s.estimated_time_from_start + extraMinutes) * 60000;
            const arrival   = new Date(arrivalMs);
            const diffMin   = Math.max(0, Math.round((arrivalMs - Date.now()) / 60000));
            return {
                stop_name:  s.stop_name,
                stop_order: s.stop_order,
                eta_time:   arrival.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }),
                eta_minutes: diffMin
            };
        });
    } catch {
        return [];
    }
}

module.exports = {
    searchBuses, getRoutesWithStops, getTripLocation,
    subscribe, unsubscribe, updateLocation
};*/



const db = require('../config/db');

// ── ETA Calculator ────────────────────────────────────────────
async function calculateETA(routeId, startedAt, extraMinutes = 0, currentLat = null, currentLng = null) {
    try {
        const [stops] = await db.query(
            `SELECT stop_name, stop_order, estimated_time_from_start, latitude, longitude
             FROM Route_Stops WHERE route_id=? ORDER BY stop_order`,
            [routeId]
        );
        if (!stops.length) return [];
        if (!startedAt) return stops.map(s => ({
            stop_name: s.stop_name, stop_order: s.stop_order,
            eta_time: null, eta_minutes: null,
            latitude: s.latitude, longitude: s.longitude
        }));

        const nowMs = Date.now();
        let elapsedOffset = 0;

        if (currentLat && currentLng) {
            let minDist = Infinity, closestIdx = 0;
            stops.forEach((s, i) => {
                if (s.latitude && s.longitude) {
                    const d = haversine(currentLat, currentLng, s.latitude, s.longitude);
                    if (d < minDist) { minDist = d; closestIdx = i; }
                }
            });
            elapsedOffset = Math.max(
                stops[closestIdx].estimated_time_from_start,
                (nowMs - new Date(startedAt).getTime()) / 60000
            );
        } else {
            elapsedOffset = (nowMs - new Date(startedAt).getTime()) / 60000;
        }

        return stops.map(s => {
            const remainingMin = Math.max(0, s.estimated_time_from_start + extraMinutes - elapsedOffset);
            const arrival      = new Date(nowMs + remainingMin * 60000);
            return {
                stop_name:   s.stop_name,
                stop_order:  s.stop_order,
                eta_time:    arrival.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }),
                eta_minutes: Math.round(remainingMin),
                latitude:    s.latitude,
                longitude:   s.longitude
            };
        });
    } catch { return []; }
}

function haversine(lat1, lng1, lat2, lng2) {
    const R    = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a    = Math.sin(dLat/2)**2 +
                 Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ── Search ────────────────────────────────────────────────────
const searchBuses = async (req, res) => {
    const { origin, destination } = req.query;
    if (!origin || !destination)
        return res.status(400).json({ message: 'origin and destination required' });
    try {
        const [trips] = await db.query(`
            SELECT t.id AS trip_id, t.status, t.current_lat, t.current_lng,
                   t.delay_reason, t.extra_minutes, t.started_at,
                   b.bus_number, b.type AS bus_type, b.capacity,
                   r.id AS route_id, r.route_name, r.origin, r.destination,
                   s.departure_time, s.days_of_week,
                   u.name AS driver_name
            FROM Routes r
            JOIN Trips t          ON t.route_id  = r.id
            JOIN Buses b          ON t.bus_id    = b.id
            JOIN Users u          ON t.driver_id = u.id
            LEFT JOIN Schedules s ON t.schedule_id = s.id
            WHERE LOWER(r.origin)      = LOWER(?)
              AND LOWER(r.destination) = LOWER(?)
              AND r.status = 'approved'
              AND t.status IN ('scheduled','active','delayed')
            ORDER BY s.departure_time
        `, [origin, destination]);

        for (const trip of trips) {
            trip.eta = await calculateETA(
                trip.route_id, trip.started_at, trip.extra_minutes,
                trip.current_lat, trip.current_lng
            );
        }
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Routes data ───────────────────────────────────────────────
const getRoutesWithStops = async (req, res) => {
    try {
        const [routes] = await db.query(`SELECT * FROM Routes WHERE status='approved'`);
        const [stops]  = await db.query(`SELECT * FROM Route_Stops ORDER BY route_id, stop_order`);
        res.json({ routes, stops });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch routes', error: error.message });
    }
};

// ── Trip live location ────────────────────────────────────────
const getTripLocation = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.id, t.status, t.current_lat, t.current_lng,
                   t.delay_reason, t.extra_minutes, t.started_at,
                   b.bus_number, b.type AS bus_type,
                   r.route_name, r.origin, r.destination, r.id AS route_id,
                   u.name AS driver_name
            FROM Trips t
            JOIN Buses b  ON t.bus_id    = b.id
            JOIN Routes r ON t.route_id  = r.id
            JOIN Users u  ON t.driver_id = u.id
            WHERE t.id = ?
        `, [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: 'Trip not found' });

        const trip     = rows[0];
        const [stops]  = await db.query(
            `SELECT * FROM Route_Stops WHERE route_id=? ORDER BY stop_order`, [trip.route_id]
        );
        trip.stops = stops;
        trip.eta   = await calculateETA(
            trip.route_id, trip.started_at, trip.extra_minutes,
            trip.current_lat, trip.current_lng
        );
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Subscribe ─────────────────────────────────────────────────
const subscribe = async (req, res) => {
    const { trip_id, boarding_stop } = req.body;
    if (!trip_id || !boarding_stop)
        return res.status(400).json({ message: 'trip_id and boarding_stop required' });
    try {
        await db.query(
            `DELETE FROM Subscriptions WHERE passenger_id=? AND trip_id=?`,
            [req.user.id, trip_id]
        );
        await db.query(
            `INSERT INTO Subscriptions (passenger_id, trip_id, boarding_stop) VALUES (?,?,?)`,
            [req.user.id, trip_id, boarding_stop]
        );
        res.json({ message: 'Subscribed to trip tracking' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const unsubscribe = async (req, res) => {
    try {
        await db.query(
            `UPDATE Subscriptions SET is_active=FALSE WHERE passenger_id=? AND trip_id=?`,
            [req.user.id, req.params.tripId]
        );
        res.json({ message: 'Tracking stopped' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── GPS Update (Driver) ───────────────────────────────────────
const updateLocation = async (req, res) => {
    const { trip_id, lat, lng, speed, is_gps_active, minutes_elapsed } = req.body;
    const io = req.app.get('io');
    try {
        let newLat = lat, newLng = lng;
        let mode   = 'GPS';

        if (is_gps_active && lat && lng) {
            await db.query(
                `UPDATE Trips SET current_lat=?, current_lng=?, status='active'
                 WHERE id=? AND driver_id=?`,
                [lat, lng, trip_id, req.user.id]
            );
        } else {
            mode = 'Time Estimate';
            const [trip] = await db.query(
                `SELECT route_id, started_at, extra_minutes FROM Trips
                 WHERE id=? AND driver_id=?`,
                [trip_id, req.user.id]
            );
            if (!trip.length) return res.status(404).json({ message: 'Trip not found' });

            const elapsedMin = minutes_elapsed ||
                Math.round((Date.now() - new Date(trip[0].started_at).getTime()) / 60000);

            const [stops] = await db.query(
                `SELECT latitude, longitude FROM Route_Stops
                 WHERE route_id=? AND estimated_time_from_start<=?
                 ORDER BY stop_order DESC LIMIT 1`,
                [trip[0].route_id, elapsedMin - (trip[0].extra_minutes || 0)]
            );
            if (stops.length && stops[0].latitude) {
                newLat = stops[0].latitude;
                newLng = stops[0].longitude;
                await db.query(
                    `UPDATE Trips SET current_lat=?, current_lng=? WHERE id=?`,
                    [newLat, newLng, trip_id]
                );
            }
        }

        // Broadcast to passengers
        const [tripRows] = await db.query(`
            SELECT t.*, b.bus_number, r.id AS route_id
            FROM Trips t
            JOIN Buses b  ON t.bus_id   = b.id
            JOIN Routes r ON t.route_id = r.id
            WHERE t.id = ?
        `, [trip_id]);

        if (tripRows.length) {
            const trip    = tripRows[0];
            const etaData = await calculateETA(
                trip.route_id, trip.started_at, trip.extra_minutes, newLat, newLng
            );

            io.to(`trip_${trip_id}`).emit('location_update', {
                trip_id, lat: newLat, lng: newLng,
                speed: speed || null, status: trip.status,
                delay_reason: trip.delay_reason,
                extra_minutes: trip.extra_minutes,
                eta: etaData, mode
            });

            // Arrival alerts — 10 min threshold
            const [subs] = await db.query(
                `SELECT passenger_id, boarding_stop FROM Subscriptions
                 WHERE trip_id=? AND is_active=TRUE`,
                [trip_id]
            );
            for (const sub of subs) {
                const myEta = etaData.find(e =>
                    e.stop_name.toLowerCase() === sub.boarding_stop.toLowerCase()
                );
                if (myEta && myEta.eta_minutes !== null &&
                    myEta.eta_minutes <= 10 && myEta.eta_minutes > 0) {
                    io.to(`trip_${trip_id}`).emit('arrival_alert', {
                        trip_id,
                        passenger_id:  sub.passenger_id,
                        boarding_stop: sub.boarding_stop,
                        eta_minutes:   myEta.eta_minutes,
                        eta_time:      myEta.eta_time,
                        bus_number:    trip.bus_number,
                        message: `🚌 Bus ${trip.bus_number} arriving at ${sub.boarding_stop} in ~${myEta.eta_minutes} min!`
                    });
                }
            }
        }
        res.json({ status: 'success', mode });
    } catch (error) {
        res.status(500).json({ message: 'Tracking update failed', error: error.message });
    }
};

// ── Broadcast helpers (used by driverController) ──────────────
const broadcastDelay = (io, tripId, reason, extraMinutes, busNumber) => {
    io.to(`trip_${tripId}`).emit('delay_alert', {
        trip_id: tripId, delay_reason: reason,
        extra_minutes: extraMinutes, bus_number: busNumber,
        message: `⚠️ Bus ${busNumber} delayed: ${reason} (+${extraMinutes} min)`
    });
};

const broadcastCancellation = (io, tripId, reason, busNumber) => {
    io.to(`trip_${tripId}`).emit('cancellation_alert', {
        trip_id: tripId, reason, bus_number: busNumber,
        message: `❌ Trip cancelled: ${reason}`
    });
};

module.exports = {
    searchBuses, getRoutesWithStops, getTripLocation,
    subscribe, unsubscribe, updateLocation,
    broadcastDelay, broadcastCancellation
};