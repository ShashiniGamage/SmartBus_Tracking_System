const jwt = require('jsonwebtoken');

// 1. For regular users (checking if logged in)
const protect = (req, res, next) => {
    let token;

    // The token comes in the header 'Authorization' as 'Bearer <token>'.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Removing the word 'Bearer' and separating it into just the token
            token = req.headers.authorization.split(' ')[1];

            // Checking whether the token is correct via JWT_SECRET in .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Entering the user's information (id, role) into the req for further processing
            req.user = decoded;

            // If correct, it will allow you to proceed to the next step (Controller).
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 2. Protecting sections restricted to admins only
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminOnly };