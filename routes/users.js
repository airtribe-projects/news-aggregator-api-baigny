const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../data/store');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /users/signup
router.post('/signup', async (req, res) => {
    const { name, email, password, preferences } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email, and password are required' });
    }

    if (users[email]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    users[email] = {
        name,
        email,
        passwordHash,
        preferences: preferences || []
    };

    return res.status(200).json({ message: 'User registered successfully' });
});

// POST /users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }

    const user = users[email];
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
});

// GET /users/preferences
router.get('/preferences', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ preferences: user.preferences });
});

// PUT /users/preferences
router.put('/preferences', authenticate, (req, res) => {
    const { preferences } = req.body;
    const user = users[req.user.email];
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (!Array.isArray(preferences)) {
        return res.status(400).json({ error: 'preferences must be an array' });
    }
    user.preferences = preferences;
    return res.status(200).json({ message: 'Preferences updated', preferences: user.preferences });
});

module.exports = router;
