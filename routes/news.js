const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const { users } = require('../data/store');

const router = express.Router();

const GNEWS_API_KEY = '17a9c3eeedc0df382183f4076cbf047a';
const GNEWS_BASE_URL = 'https://gnews.io/api/v4/search';

// GET /news - fetch news based on user preferences
router.get('/', authenticate, async (req, res) => {
    try {
        const user = users[req.user.email];
        const preferences = user && user.preferences.length > 0
            ? user.preferences
            : ['general'];

        // Join preferences as OR query e.g. "movies OR comics"
        const query = preferences.join(' OR ');

        const response = await axios.get(GNEWS_BASE_URL, {
            params: {
                q: query,
                token: GNEWS_API_KEY,
                lang: 'en',
                max: 10
            }
        });

        const articles = response.data.articles.map((article) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source.name
        }));

        return res.status(200).json({ news: articles });

    } catch (err) {
        if (err.response) {
            // GNews API returned an error
            return res.status(err.response.status).json({ error: err.response.data.errors || 'News API error' });
        }
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
});

module.exports = router;
