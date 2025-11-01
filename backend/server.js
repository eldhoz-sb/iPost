// backend/src/server.js
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running. Navigate to /api/v1/auth/meta to start the login.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});