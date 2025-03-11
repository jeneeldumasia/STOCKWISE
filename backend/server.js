const express = require('express');
const connectDB = require('./config/db');
const inwardRoutes = require('./routes/inwardRoutes');
const outwardRoutes = require('./routes/outwardRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api/inward', inwardRoutes);
app.use('/api/outward', outwardRoutes);

app.get('/', (req, res) => {
    res.send('Inventory Management System API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
