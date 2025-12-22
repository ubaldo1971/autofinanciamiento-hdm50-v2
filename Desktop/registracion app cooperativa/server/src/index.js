const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration for Production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://raiteccop.org',
    'https://www.raiteccop.org',
    'http://raiteccop.org',
    'http://www.raiteccop.org'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow all for now, restrict in production
        }
    },
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/governance', require('./routes/governance'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Raite API is running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'RAITE Cooperative API',
        version: '1.0.0',
        docs: '/api/health'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
