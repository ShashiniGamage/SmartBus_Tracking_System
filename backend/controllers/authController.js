const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Token එකක් නිපදවීමේ ශ්‍රිතය (Function)
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // දින 30කින් ටෝකන් එක කල් ඉකුත් වේ
    });
};

// 1. අලුත් පරිශීලකයෙක් ලියාපදිංචි කිරීම (Register)
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // මේ ඊමේල් එකෙන් කලින් කෙනෙක් ඉන්නවාදැයි බැලීම
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // මුරපදය (Password) ආරක්ෂිතව කේතනය කිරීම (Hashing)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // අලුත් පරිශීලකයාව Database එකට දැමීම
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

// 2. පද්ධතියට ඇතුළු වීම (Login)
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ඊමේල් එකෙන් පරිශීලකයාව සෙවීම
        const user = await User.findByEmail(email);

        // පරිශීලකයෙක් නැත්නම් හෝ මුරපදය වැරදි නම්
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // පරිශීලකයා නිවැරදි නම්, ඔහුට Token එකක් සහ දත්ත යැවීම
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