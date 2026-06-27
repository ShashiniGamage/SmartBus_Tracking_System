const db = require('../config/db');

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
};