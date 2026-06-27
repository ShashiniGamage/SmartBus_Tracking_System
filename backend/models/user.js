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

module.exports = User;