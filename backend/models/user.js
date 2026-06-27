/*const db = require('../config/db');

class User {
    static async create(userData) {
        // To match the columns of the new table
        const sql = `INSERT INTO Users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
            userData.name, 
            userData.email, 
            userData.password, 
            userData.role || 'passenger',
            userData.status || 'approved' // Usually a passenger is approved directly.
        ]);
        return result;
    }*/

        /*const db = require('../config/db');

class User {
    static async create(userData) {
        
        const status = userData.role === 'driver' ? 'pending' : 'approved';
        const sql = `INSERT INTO Users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
            userData.name, userData.email, userData.password, userData.role, status
        ]);
        return result;
    }
    
}

    static async findByEmail(email) {
        const sql = `SELECT * FROM Users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }
}

module.exports = User;*/

/*
const db = require('../config/db');

class User {
    
    static async create(userData) {
        const status = userData.role === 'driver' ? 'pending' : 'approved';
        const sql = `INSERT INTO Users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [
            userData.name, 
            userData.email, 
            userData.password, 
            userData.role, 
            status
        ]);
        return result;
    }

   
    static async findByEmail(email) {
        const sql = `SELECT * FROM Users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }
}

module.exports = User;*/

const db = require('../config/db');

class User {
    static async create(userData) {
        const sql = `INSERT INTO Users (name, email, password, role, phone, status) VALUES (?,?,?,?,?,?)`;
        // FIX: driver registers as 'pending', passenger as 'approved'
        const status = userData.role === 'driver' ? 'pending' : 'approved';
        const [result] = await db.execute(sql, [
            userData.name,
            userData.email,
            userData.password,
            userData.role || 'passenger',
            userData.phone || null,
            status
        ]);
        return result;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(`SELECT * FROM Users WHERE email = ?`, [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(`SELECT id,name,email,role,phone,status,created_at FROM Users WHERE id = ?`, [id]);
        return rows[0];
    }

    // FIX: was missing — admin: get all drivers
    static async findAllDrivers() {
        const [rows] = await db.execute(
            `SELECT id,name,email,phone,status,created_at FROM Users WHERE role='driver' ORDER BY created_at DESC`
        );
        return rows;
    }

    // FIX: was missing — admin: approve or reject driver
    static async updateStatus(id, status) {
        const [result] = await db.execute(
            `UPDATE Users SET status=? WHERE id=? AND role='driver'`,
            [status, id]
        );
        return result;
    }
}

module.exports = User;