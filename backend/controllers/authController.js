const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Token generation function
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token expires in 30 days.


    });
};

// 1. Register a new user (Register)


const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if someone already has this email


        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Password Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Adding a new user to the database
        const userData = {
            name,
            email,
            password: hashedPassword,
            role: role || 'passenger'
        };

        const result = await User.create(userData);

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 2. Login to the system


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Search for a user by email


        const user = await User.findByEmail(email);

        // If there is no user or the password is incorrect


        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If the user is correct, send him a token and data


        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};