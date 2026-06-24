const db = require('../config/db');

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
            // GPS වැඩ නම් Driver ගේ phone එකෙන් එන නියම live location එක update කරනවා
            await db.query(
                "UPDATE Trips SET current_lat = ?, current_lng = ?, status = 'active' WHERE id = ?",
                [lat, lng, trip_id]
            );
            return res.json({ status: "success", mode: "GPS Live Tracking" });
        } else {
            // GPS නැත්නම් Fallback: Time estimation එකට අනුව ඊළඟට තියෙන Bus Stop එක calculate කරනවා
            const [trip] = await db.query("SELECT route_id FROM Trips WHERE id = ?", [trip_id]);
            if (trip.length === 0) return res.status(404).json({ error: "Trip not found" });

            const route_id = trip[0].route_id;
            // ගතවූ කාලයට ආසන්නම Bus stop එක database එකෙන් ගන්නවා
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
};