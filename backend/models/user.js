const db = require('../config/db');

class User {
    static async create(userData) {
        // අලුත් Table එකේ columns වලට ගැලපෙන ලෙස
        const sql = `INSERT INTO Users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
            userData.name, 
            userData.email, 
            userData.password, 
            userData.role || 'passenger',
            userData.status || 'approved' // සාමාන්‍යයෙන් passenger කෙනෙක් කෙලින්ම approve වෙනවා
        ]);
        return result;
    }

    static async findByEmail(email) {
        const sql = `SELECT * FROM Users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }
}

module.exports = User;