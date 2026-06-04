const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: no token provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
}

module.exports = { authenticate };
