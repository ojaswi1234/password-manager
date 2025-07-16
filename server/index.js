
const express = require('express');
const app = express();

const mongoose = require('mongoose');

const connectDB = require('./db'); // Import the database connection function
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.redirect();
});9

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});