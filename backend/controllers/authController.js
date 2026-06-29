const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
const registerUser = async (req, res) => {
    const { name, email, password, role, phone } = req.body;
    try {
        if (await User.findByEmail(email))
            return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create({ name, email, password: hashedPassword, role, phone });

        // FIX: driver gets 'pending' status (handled inside User.create)
        const statusMsg = role === 'driver'
            ? 'Driver registered. Awaiting admin approval.'
            : 'User registered successfully';

        res.status(201).json({ message: statusMsg, userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: 'Invalid email or password' });

        // Block rejected drivers
        if (user.status === 'rejected')
            return res.status(403).json({ message: 'Your account has been rejected. Contact admin.' });

        // Block pending drivers
        if (user.role === 'driver' && user.status === 'pending')
            return res.status(403).json({ message: 'Your account is pending admin approval.' });

        res.json({
            id: user.id, name: user.name, email: user.email,
            role: user.role, status: user.status,
            token: generateToken(user.id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get my profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getProfile };