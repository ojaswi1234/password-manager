const express = require('express');
const cors = require('cors');

const connectDB = require('./db');
``
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true // Allow cookies
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send("Hello, Password Manager API!");
});

// Basic API routes (no authentication)
app.get('/api/test', (req, res) => {
    res.json({ 
        message: "API is working!", 
        timestamp: new Date().toISOString()
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});