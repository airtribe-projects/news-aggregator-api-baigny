const jwt = require('jsonwebtoken');

const JWT_SECRET = 'news_aggregator_secret';

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: no token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { email, name }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
}

module.exports = { authenticate, JWT_SECRET };
