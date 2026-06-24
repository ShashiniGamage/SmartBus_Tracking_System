const jwt = require('jsonwebtoken');

// 1. සාමාන්‍ය පරිශීලකයින් සඳහා (Login වී ඇත්දැයි බැලීම)
const protect = (req, res, next) => {
    let token;

    // Token එක එන්නේ Header එකේ 'Authorization' කියන තැන 'Bearer <token>' විදිහටයි
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 'Bearer ' කියන වචනය අයින් කරලා token එක පමණක් වෙන් කරගැනීම
            token = req.headers.authorization.split(' ')[1];

            // Token එක නිවැරදිද යන්න .env එකේ ඇති JWT_SECRET හරහා පරීක්ෂා කිරීම
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // පරිශීලකයාගේ තොරතුරු (id, role) ඉදිරි ක්‍රියාවලිය සඳහා req එකට ඇතුලත් කිරීම
            req.user = decoded;

            // නිවැරදි නම් ඊළඟ පියවරට (Controller එකට) යන්න දෙනවා
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 2. Admin සඳහා පමණක් සීමා වූ කොටස් ආරක්ෂා කිරීම
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminOnly };