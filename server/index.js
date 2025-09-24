const express = require('express');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');

const connectDB = require('./db');
const User = require('./models/User');
const Accounts = require('./models/Accounts');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Crypto utility functions for password encryption
function encryptPassword(plaintext, masterKey) {
    const iv = crypto.randomBytes(12); // 96-bit IV for GCM
    const salt = crypto.randomBytes(32);
    const key = crypto.scryptSync(masterKey, salt, 32);
    
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    
    return {
        encrypted: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        salt: salt.toString('base64'),
        tag: tag.toString('base64')
    };
}

function decryptPassword(encryptedData, masterKey) {
    const key = crypto.scryptSync(masterKey, Buffer.from(encryptedData.salt, 'base64'), 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(encryptedData.iv, 'base64'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'base64'));
    
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData.encrypted, 'base64')),
        decipher.final()
    ]);
    
    return decrypted.toString('utf8');
}



// Connect to MongoDB
connectDB().then(async () => {
    // Ensure no legacy unique index on email blocks reuse across platforms
    try {
        const existingIndexes = await Accounts.collection.indexes();
        const emailUnique = existingIndexes.find(ix => ix.key && ix.key.email === 1 && ix.unique);
        if (emailUnique) {
            await Accounts.collection.dropIndex(emailUnique.name);
            // Optional: create a compound index for faster per-user/platform queries if desired later
            // await Accounts.collection.createIndex({ user: 1, platform: 1 });
        }
    } catch (idxErr) {
        // Log but don't crash server
        console.warn('Index inspection/removal issue (safe to ignore if none):', idxErr.message);
    }
});
// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true // Allow cookies
}));

app.use(session({
    name: 'pm.sid', // custom cookie name
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    rolling: true, // refresh expiration on each response
    cookie: {
        secure: false,               // true if behind HTTPS / proxy with trust proxy
        httpOnly: true,              // mitigate XSS access
        sameSite: 'lax',             // helps with CSRF while allowing same-site navigation
        maxAge: 1000 * 60 * 60 * 2   // 2 hours inactivity window
    }
}));




app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send("Hello, Password Manager API!");
});

function isLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    // Return JSON for API consumers instead of redirecting
    return res.status(401).json({ success: false, message: 'Unauthorized' });
} 




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
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const masterKey = process.env.MASTER_KEY || 'temporary-master-key-change-this';
    const encryptedPassword = encryptPassword(password, masterKey);
    const account = await Accounts.create({
      platform,
      email,
      password: JSON.stringify(encryptedPassword),
      user: req.session.userId
    });
    res.status(201).json({ success: true, message: 'Credentials saved successfully', id: account._id });
  } catch (err) {
    console.error('Error saving credentials:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email first
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare plaintext password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            req.session.userId = user._id; // Set session
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });
            res.json({ success: true, token, redirect: "/dashboard", message: "Login successful!" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.get('/credentials', isLoggedIn, async (req, res) => {
  try {
    // Find accounts for this user OR legacy accounts with no user field (migrate silently)
    const accounts = await Accounts.find({ $or: [ { user: req.session.userId }, { user: { $exists: false } } ] });

    // Migrate legacy (no user) accounts to this user id (optional behavior - could be removed later)
    const legacyIds = accounts.filter(a => !a.user).map(a => a._id);
    if (legacyIds.length) {
      await Accounts.updateMany({ _id: { $in: legacyIds } }, { $set: { user: req.session.userId } });
    }

    // Return only metadata & status flags, NOT decrypted password
    const sanitized = accounts.map(a => ({
      _id: a._id,
      platform: a.platform,
      email: a.email,
      // Do not send password here
      legacy: a.password.startsWith('$2b$') || a.password.startsWith('$2a$'),
      decryptable: !(a.password.startsWith('$2b$') || a.password.startsWith('$2a$')),
    }));

    res.json({ success: true, accounts: sanitized });
  } catch (err) {
    console.error('Error fetching credentials:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/credentials/:id/delete', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete the account by ID
        const result = await Accounts.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ success: false, message: "Account not found" });
        }
        
        res.json({ success: true, message: "Account deleted successfully" });
    } catch(err) {
        console.error("Error deleting account:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.get('/credentials/:id', isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const masterKey = process.env.MASTER_KEY || 'temporary-master-key-change-this';
    const account = await Accounts.findOne({ _id: id, user: req.session.userId });
    if (!account) return res.status(404).json({ success: false, message: 'Not found' });

    if (account.password.startsWith('$2b$') || account.password.startsWith('$2a$')) {
      return res.json({ success: true, account: { _id: account._id, platform: account.platform, email: account.email, password: '[Encrypted - Old Format]' } });
    }
    try {
      const encryptedData = JSON.parse(account.password);
      const decryptedPassword = decryptPassword(encryptedData, masterKey);
      return res.json({ success: true, account: { _id: account._id, platform: account.platform, email: account.email, password: decryptedPassword } });
    } catch (err) {
      return res.json({ success: true, account: { _id: account._id, platform: account.platform, email: account.email, password: '[Decryption Error]' } });
    }
  } catch (err) {
    console.error('Error revealing credential:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



app.get('/:profile', isLoggedIn, (req, res) => {
    res.json({ name: `${req.params.profile}` });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});