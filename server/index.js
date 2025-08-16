const express = require('express');
const cors = require('cors');
const session = require('express-session');

const connectDB = require('./db');
const User = require('./models/User');
const Accounts = require('./models/Accounts');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// Connect to MongoDB
connectDB();
// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true // Allow cookies
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));




app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send("Hello, Password Manager API!");
});

function isLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).redirect("/");

    }
} 

app.get('/dashboard', isLoggedIn, (req, res) => {
    // User is authenticated if this handler is reached
    res.send("Welcome to your dashboard!");
   
});


// Basic API routes (no authentication)
app.get('/api/test', (req, res) => {
    res.json({ 
        message: "API is working!", 
        timestamp: new Date().toISOString()
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: "Server error" });
        }
        res.redirect("/");
    });
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    try {
        // Check if user already exists by email
        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });
        jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' }, (err, token) => {
            if (err) {
                console.error("Error signing JWT:", err);
                return res.status(500).json({ success: false, message: "Server error" });
            }
            res.status(201).json({ success: true, token, redirect: "/dashboard" });
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post('/saved', async (req, res) => {
    const { platform, email, password } = req.body;

    try{

        const hashedPassword = await bcrypt.hash(password, 20);

        const account = await Accounts.create({
            platform,
            email,
            password: hashedPassword
        });
    res.status(201).json({ success: true, message: "Credentials saved successfully" });

    }
    catch(err){
        console.error("Error saving credentials:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        // Assuming you have a User model imported as User
        bcrypt.compare(password, hashedPassword, async (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ success: false, message: "Server error" });
            }

            if (isMatch) {
                const user = await User.findOne({ email });
                if (user) {
                    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.status(201).json({ success: true, token, redirect: "/dashboard", message: "Login successful!" });
                } else {
                    res.status(401).json({ success: false, message: "Invalid credentials" });
                }
            }
    });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});



app.get('/:profile', isLoggedIn, (req, res) => {
    res.json({ name: `${req.params.profile}` });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});