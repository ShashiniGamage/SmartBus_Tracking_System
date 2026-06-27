const db = require('../config/db');

// ── Bus ───────────────────────────────────────────────────────

// POST /api/driver/bus
const registerBus = async (req, res) => {
    const { bus_number, type, capacity } = req.body;
    if (!bus_number) return res.status(400).json({ message: 'Bus number required' });
    try {
        const [existing] = await db.query(`SELECT id FROM Buses WHERE bus_number=?`, [bus_number]);
        if (existing.length > 0)
            return res.status(400).json({ message: 'Bus number already registered' });

        const [result] = await db.query(
            `INSERT INTO Buses (bus_number, type, capacity, driver_id) VALUES (?,?,?,?)`,
            [bus_number, type || null, capacity || null, req.user.id]
        );
        res.status(201).json({ message: 'Bus registered', busId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/driver/bus  — get my bus
const getMyBus = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM Buses WHERE driver_id=?`, [req.user.id]);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Routes ────────────────────────────────────────────────────

// POST /api/driver/routes   — submit new route (pending approval)
const createRoute = async (req, res) => {
    const { origin, destination, route_name, stops } = req.body;
    if (!origin || !destination || !stops?.length)
        return res.status(400).json({ message: 'origin, destination and stops required' });
    try {
        const [routeResult] = await db.query(
            `INSERT INTO Routes (driver_id, origin, destination, route_name, status) VALUES (?,?,?,?,'pending')`,
            [req.user.id, origin, destination, route_name || `${origin} - ${destination}`]
        );
        const routeId = routeResult.insertId;

        // Insert stops
        for (let i = 0; i < stops.length; i++) {
            const s = stops[i];
            await db.query(
                `INSERT INTO Route_Stops (route_id, stop_name, latitude, longitude, stop_order, estimated_time_from_start)
                 VALUES (?,?,?,?,?,?)`,
                [routeId, s.stop_name, s.latitude || null, s.longitude || null, i + 1, s.estimated_time || 0]
            );
        }
        res.status(201).json({ message: 'Route submitted for approval', routeId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/driver/routes  — my routes + approval status
const getMyRoutes = async (req, res) => {
    try {
        const [routes] = await db.query(
            `SELECT r.*, GROUP_CONCAT(rs.stop_name ORDER BY rs.stop_order SEPARATOR ' → ') AS stop_list
             FROM Routes r
             LEFT JOIN Route_Stops rs ON r.id = rs.route_id
             WHERE r.driver_id=?
             GROUP BY r.id
             ORDER BY r.created_at DESC`,
            [req.user.id]
        );
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Schedules ─────────────────────────────────────────────────

// POST /api/driver/schedules
const createSchedule = async (req, res) => {
    const { route_id, bus_id, departure_time, days_of_week } = req.body;
    if (!route_id || !bus_id || !departure_time || !days_of_week)
        return res.status(400).json({ message: 'All fields required' });
    try {
        // Verify route is approved
        const [route] = await db.query(`SELECT status FROM Routes WHERE id=? AND driver_id=?`, [route_id, req.user.id]);
        if (!route.length) return res.status(404).json({ message: 'Route not found' });
        if (route[0].status !== 'approved')
            return res.status(400).json({ message: 'Route must be approved before scheduling' });

        const [result] = await db.query(
            `INSERT INTO Schedules (route_id, bus_id, driver_id, departure_time, days_of_week) VALUES (?,?,?,?,?)`,
            [route_id, bus_id, req.user.id, departure_time, days_of_week]
        );
        res.status(201).json({ message: 'Schedule created', scheduleId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/driver/schedules
const getMySchedules = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, r.route_name, r.origin, r.destination, b.bus_number
            FROM Schedules s
            JOIN Routes r ON s.route_id = r.id
            JOIN Buses   b ON s.bus_id   = b.id
            WHERE s.driver_id=?
            ORDER BY s.departure_time
        `, [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Trips ─────────────────────────────────────────────────────

// POST /api/driver/trips/start
const startTrip = async (req, res) => {
    const { route_id, bus_id, schedule_id } = req.body;
    if (!route_id || !bus_id) return res.status(400).json({ message: 'route_id and bus_id required' });
    try {
        const [result] = await db.query(
            `INSERT INTO Trips (bus_id, driver_id, route_id, schedule_id, status, started_at)
             VALUES (?,?,?,?,'active', NOW())`,
            [bus_id, req.user.id, route_id, schedule_id || null]
        );
        res.status(201).json({ message: 'Trip started', tripId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PATCH /api/driver/trips/:id/end
const endTrip = async (req, res) => {
    try {
        const [result] = await db.query(
            `UPDATE Trips SET status='completed', ended_at=NOW()
             WHERE id=? AND driver_id=? AND status IN ('active','delayed')`,
            [req.params.id, req.user.id]
        );
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Trip not found or already ended' });
        res.json({ message: 'Trip ended' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PATCH /api/driver/trips/:id/delay
const reportDelay = async (req, res) => {
    const { reason, extra_minutes } = req.body;
    if (!reason) return res.status(400).json({ message: 'Delay reason required' });
    try {
        const [result] = await db.query(
            `UPDATE Trips SET status='delayed', delay_reason=?, extra_minutes=? WHERE id=? AND driver_id=?`,
            [reason, extra_minutes || 0, req.params.id, req.user.id]
        );
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Trip not found' });
        res.json({ message: 'Delay reported' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/driver/trips  — my trips
const getMyTrips = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, r.route_name, r.origin, r.destination, b.bus_number
            FROM Trips t
            JOIN Routes r ON t.route_id = r.id
            JOIN Buses  b ON t.bus_id   = b.id
            WHERE t.driver_id=?
            ORDER BY t.created_at DESC
            LIMIT 20
        `, [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerBus, getMyBus,
    createRoute, getMyRoutes,
    createSchedule, getMySchedules,
    startTrip, endTrip, reportDelay, getMyTrips
};