const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Load env vars - add this before other requires
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const connectDB = require('./config/db');
const inwardRoutes = require('./routes/inwardRoutes');
const outwardRoutes = require('./routes/outwardRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Enhanced security middleware
app.use(helmet());
app.use(morgan('dev'));

// CORS configuration
app.use(cors({
    origin: '*', // For development, allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database with retry logic
(async function connectWithRetry() {
    let retries = 5;
    while (retries) {
        try {
            await connectDB();
            break;
        } catch (err) {
            retries -= 1;
            console.log(`Database connection failed, retries left: ${retries}`);
            // Wait for 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inward', authMiddleware, inwardRoutes);
app.use('/api/outward', authMiddleware, outwardRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'API is working!' });
});

// Base route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Improved error handling middleware
app.use((err, req, res, next) => {
    console.error(`${err.name}: ${err.message}`);
    console.error(err.stack);
    
    // Specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Server error' 
            : err.message 
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;
let server;

if (process.env.NODE_ENV === 'production' && fs.existsSync('./ssl/private-key.pem')) {
    // HTTPS for production with SSL certificates
    const privateKey = fs.readFileSync('./ssl/private-key.pem', 'utf8');
    const certificate = fs.readFileSync('./ssl/certificate.pem', 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    
    server = https.createServer(credentials, app);
    server.listen(PORT, () => {
        console.log(`HTTPS Server running on port ${PORT}`);
    });
} else {
    // HTTP for development
    server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`HTTP Server running on port ${PORT}`);
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;
