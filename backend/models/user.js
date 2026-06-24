const db = require('../config/db');

class User {
    // අලුත් පරිශීලකයෙක් Database එකට ඇතුලත් කිරීම
    static async create(userData) {
        const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [userData.name, userData.email, userData.password, userData.role]);
        return result;
    }

    // Email එක හරහා පරිශීලකයෙක් සෙවීම (Login වීමට)
    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }
}

module.exports = User;