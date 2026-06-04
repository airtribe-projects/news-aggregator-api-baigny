const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const { users } = require('../data/store');
const { GNEWS_API_KEY, GNEWS_BASE_URL } = require('../config');

const router = express.Router();

// GET /news - fetch news based on user preferences
router.get('/', authenticate, async (req, res) => {
    try {
        const user = users[req.user.email];
        const preferences = user?.preferences?.length > 0 ? user.preferences : ['general'];
        const query = preferences.join(' OR ');

        const { data } = await axios.get(GNEWS_BASE_URL, {
            params: { q: query, token: GNEWS_API_KEY, lang: 'en', max: 10 }
        });

        const news = data.articles.map(({ title, description, url, publishedAt, source }) => ({
            title,
            description,
            url,
            publishedAt,
            source: source.name
        }));

        return res.status(200).json({ news });

    } catch (err) {
        const status = err.response?.status ?? 500;
        const error = err.response?.data?.errors ?? 'Failed to fetch news';
        return res.status(status).json({ error });
    }
});

module.exports = router;
