const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log('Attempting MongoDB connection...'); 
        
        // Updated connection options - removed deprecated options
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        // More detailed error logging for troubleshooting
        if (error.name === 'MongooseServerSelectionError') {
            console.error('Could not connect to any servers in your MongoDB Atlas cluster. Check network connectivity and credentials.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
