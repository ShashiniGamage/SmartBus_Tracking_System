/*const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes importing
const authRoutes = require('./routes/authRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send("Smart Bus API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/


/*const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes importing
const authRoutes = require('./routes/authRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const adminRoutes = require('./routes/adminRoutes'); // new part

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes); // new part

// Test Route
app.get('/', (req, res) => {
    res.send("Smart Bus API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/




const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));
app.use('/api/driver',   require('./routes/driverRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));

app.get('/', (_, res) => res.send('Smart Bus API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));