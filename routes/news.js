const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const { users, articles, addArticle } = require('../data/store');
const { GNEWS_API_KEY, GNEWS_BASE_URL } = require('../config');

const router = express.Router();

// Helper: fetch from GNews and store articles, returns array with ids
const fetchAndStoreNews = async (query) => {
    const { data } = await axios.get(GNEWS_BASE_URL, {
        params: { q: query, token: GNEWS_API_KEY, lang: 'en', max: 10 }
    });

    return data.articles.map(({ title, description, url, publishedAt, source }) => {
        const id = addArticle({ title, description, url, publishedAt, source: source.name });
        return articles[id];
    });
};

// GET /news - fetch news based on user preferences
router.get('/', authenticate, async (req, res) => {
    try {
        const user = users[req.user.email];
        const preferences = user?.preferences?.length > 0 ? user.preferences : ['general'];
        const news = await fetchAndStoreNews(preferences.join(' OR '));
        return res.status(200).json({ news });
    } catch (err) {
        const status = err.response?.status ?? 500;
        const error = err.response?.data?.errors ?? 'Failed to fetch news';
        return res.status(status).json({ error });
    }
});

// GET /news/search/:keyword - search news by keyword
router.get('/search/:keyword', authenticate, async (req, res) => {
    try {
        const news = await fetchAndStoreNews(req.params.keyword);
        return res.status(200).json({ news });
    } catch (err) {
        const status = err.response?.status ?? 500;
        const error = err.response?.data?.errors ?? 'Failed to fetch news';
        return res.status(status).json({ error });
    }
});

// GET /news/read - get all read articles for the logged-in user
router.get('/read', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });
    const readArticles = user.readArticles.map((id) => articles[id]).filter(Boolean);
    return res.status(200).json({ readArticles });
});

// GET /news/favorites - get all favorite articles for the logged-in user
router.get('/favorites', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });
    const favoriteArticles = user.favoriteArticles.map((id) => articles[id]).filter(Boolean);
    return res.status(200).json({ favoriteArticles });
});

// POST /news/:id/read - mark an article as read
router.post('/:id/read', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const id = parseInt(req.params.id);
    if (!articles[id]) return res.status(404).json({ error: 'Article not found' });
    if (!user.readArticles.includes(id)) user.readArticles.push(id);

    return res.status(200).json({ message: 'Article marked as read' });
});

// POST /news/:id/favorite - mark an article as favorite
router.post('/:id/favorite', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const id = parseInt(req.params.id);
    if (!articles[id]) return res.status(404).json({ error: 'Article not found' });
    if (!user.favoriteArticles.includes(id)) user.favoriteArticles.push(id);

    return res.status(200).json({ message: 'Article marked as favorite' });
});

module.exports = router;
