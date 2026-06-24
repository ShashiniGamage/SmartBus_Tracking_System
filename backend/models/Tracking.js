const db = require('../config/db');

class Tracking {
    // බස් එකේ ලෝකේෂන් එක අප්ඩේට් කිරීම (Trip එකක් හරහා)
    static async updateLocation(tripId, lat, lng) {
        const sql = `
            UPDATE Trips 
            SET current_lat = ?, current_lng = ?, status = 'active'
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [lat, lng, tripId]);
        return result;
    }

    // දැනට ධාවනය වන (active) සියලුම බස් වල ලෝකේෂන් ගැනීම (Map එකට)
    static async getActiveTrips() {
        const sql = `
            SELECT t.id, t.status, t.current_lat, t.current_lng, t.delay_reason,
                   b.bus_number, b.type,
                   r.route_name
            FROM Trips t
            JOIN Buses b ON t.bus_id = b.id
            JOIN Routes r ON t.route_id = r.id
            WHERE t.status IN ('active', 'delayed')
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = Tracking;