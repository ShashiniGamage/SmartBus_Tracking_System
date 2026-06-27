/*const db = require('../config/db');

// 1. Get All Routes & Stops (Sri Lankan Route Data)
exports.getRoutesWithStops = async (req, res) => {
    try {
        const [routes] = await db.query("SELECT * FROM Routes");
        const [stops] = await db.query("SELECT * FROM Route_Stops ORDER BY route_id, stop_order");
        
        res.json({ routes, stops });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch routes", details: error.message });
    }
};

// 2. Update Bus Live Location (GPS or Simulation Fallback)
exports.updateLocation = async (req, res) => {
    const { trip_id, lat, lng, is_gps_active, minutes_elapsed } = req.body;

    try {
        if (is_gps_active) {
            // If GPS is working, the exact live location from the driver's phone will be updated

            await db.query(
                "UPDATE Trips SET current_lat = ?, current_lng = ?, status = 'active' WHERE id = ?",
                [lat, lng, trip_id]
            );
            return res.json({ status: "success", mode: "GPS Live Tracking" });
        } else {
            // GPS or Fallback: Calculates the next bus stop based on time estimation


            const [trip] = await db.query("SELECT route_id FROM Trips WHERE id = ?", [trip_id]);
            if (trip.length === 0) return res.status(404).json({ error: "Trip not found" });

            const route_id = trip[0].route_id;
            // The closest bus stop to the elapsed time is retrieved from the database


            const [stops] = await db.query(
                "SELECT latitude, longitude FROM Route_Stops WHERE route_id = ? AND estimated_time_from_start <= ? ORDER BY stop_order DESC LIMIT 1",
                [route_id, minutes_elapsed]
            );

            if (stops.length > 0) {
                await db.query(
                    "UPDATE Trips SET current_lat = ?, current_lng = ? WHERE id = ?",
                    [stops[0].latitude, stops[0].longitude, trip_id]
                );
                return res.json({ status: "success", mode: "Time-based Simulation Fallback" });
            }
        }
        res.json({ status: "success", message: "Location remains unchanged" });
    } catch (error) {
        res.status(500).json({ error: "Tracking update failed", details: error.message });
    }
};

// 3. Report Trip Delay / Cancellation
exports.reportIncident = async (req, res) => {
    const { trip_id, status, reason } = req.body; // status can be 'delayed' or 'cancelled'
    try {
        await db.query(
            "UPDATE Trips SET status = ?, delay_reason = ? WHERE id = ?",
            [status, reason, trip_id]
        );
        res.json({ message: `Trip status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to report incident" });
    }
};*/



const db = require('../config/db');

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
};