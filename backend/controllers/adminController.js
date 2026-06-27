/*const db = require('../config/db');

// Get all pending drivers.
exports.getPendingDrivers = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, name, email FROM Users WHERE role = 'driver' AND status = 'pending'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve the driver.
exports.approveDriver = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute("UPDATE Users SET status = 'approved' WHERE id = ?", [id]);
        res.json({ message: 'Driver approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};*/


const db = require('../config/db');
const User = require('../models/User');

// ── Drivers ──────────────────────────────────────────────────

// GET /api/admin/drivers
const getAllDrivers = async (req, res) => {
    try {
        const drivers = await User.findAllDrivers();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PATCH /api/admin/drivers/:id/status   body: { status: 'approved'|'rejected' }
const updateDriverStatus = async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status))
        return res.status(400).json({ message: 'Status must be approved or rejected' });
    try {
        const result = await User.updateStatus(req.params.id, status);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Driver not found' });
        res.json({ message: `Driver ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Routes ────────────────────────────────────────────────────

// GET /api/admin/routes  — all routes with driver info
const getAllRoutes = async (req, res) => {
    try {
        const [routes] = await db.query(`
            SELECT r.*, u.name AS driver_name, u.email AS driver_email
            FROM Routes r
            LEFT JOIN Users u ON r.driver_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PATCH /api/admin/routes/:id  — approve/reject + optional edit note
const updateRouteStatus = async (req, res) => {
    const { status, admin_note, route_name, origin, destination } = req.body;
    if (!['approved', 'rejected'].includes(status))
        return res.status(400).json({ message: 'Status must be approved or rejected' });
    try {
        await db.query(
            `UPDATE Routes SET status=?, admin_note=?,
             route_name=COALESCE(?,route_name),
             origin=COALESCE(?,origin),
             destination=COALESCE(?,destination)
             WHERE id=?`,
            [status, admin_note || null, route_name || null, origin || null, destination || null, req.params.id]
        );
        res.json({ message: `Route ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ── Dashboard ─────────────────────────────────────────────────

// GET /api/admin/trips/active
const getActiveTrips = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.id, t.status, t.current_lat, t.current_lng,
                   t.delay_reason, t.extra_minutes, t.started_at,
                   b.bus_number, b.type AS bus_type,
                   r.route_name, r.origin, r.destination,
                   u.name AS driver_name, u.phone AS driver_phone
            FROM Trips t
            JOIN Buses b  ON t.bus_id   = b.id
            JOIN Routes r ON t.route_id = r.id
            JOIN Users u  ON t.driver_id= u.id
            WHERE t.status IN ('active','delayed')
            ORDER BY t.started_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET /api/admin/trips/today  — delayed & cancelled today
const getTodayIncidents = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.id, t.status, t.delay_reason, t.extra_minutes,
                   t.started_at, t.ended_at,
                   b.bus_number, r.route_name, r.origin, r.destination,
                   u.name AS driver_name
            FROM Trips t
            JOIN Buses b  ON t.bus_id   = b.id
            JOIN Routes r ON t.route_id = r.id
            JOIN Users u  ON t.driver_id= u.id
            WHERE t.status IN ('delayed','cancelled')
              AND DATE(t.created_at) = CURDATE()
            ORDER BY t.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllDrivers, updateDriverStatus,
    getAllRoutes, updateRouteStatus,
    getActiveTrips, getTodayIncidents
};