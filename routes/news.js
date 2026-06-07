const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const { users, articles, addArticle, newsCache } = require('../data/store');
const { GNEWS_API_KEY, GNEWS_BASE_URL, CACHE_TTL_MS } = require('../config');

const router = express.Router();

// Helper: fetch from GNews, store articles, update cache
const fetchFromGNews = async (query) => {
    const { data } = await axios.get(GNEWS_BASE_URL, {
        params: { q: query, token: GNEWS_API_KEY, lang: 'en', max: 10 }
    });

    const result = data.articles.map(({ title, description, url, publishedAt, source }) => {
        const id = addArticle({ title, description, url, publishedAt, source: source.name });
        return articles[id];
    });

    newsCache[query] = { articles: result, fetchedAt: Date.now() };
    return result;
};

// Helper: return cached articles if fresh, otherwise fetch from GNews
const fetchAndStoreNews = async (query) => {
    const cached = newsCache[query];
    const isFresh = cached && (Date.now() - cached.fetchedAt) < CACHE_TTL_MS;

    if (isFresh) {
        console.log(`[cache HIT] query: "${query}"`);
        return cached.articles;
    }

    console.log(`[cache MISS] query: "${query}" — fetching from GNews`);
    return fetchFromGNews(query);
};

// GET /news - fetch news based on user preferences
router.get('/', authenticate, async (req, res) => {
    try {
        const user = users[req.user.email];
        if (!user) return res.status(404).json({ error: 'User not found' });
        const validPrefs = user.preferences.map((p) => p.trim()).filter((p) => p.length > 0);
        const query = validPrefs.length > 0 ? validPrefs.join(' OR ') : 'general';
        const news = await fetchAndStoreNews(query);
        return res.status(200).json({ news });
    } catch (err) {
        const status = err.response?.status ?? 500;
        const error = err.response?.data?.errors?.[0] ?? err.response?.data?.message ?? 'Failed to fetch news';
        return res.status(status).json({ error });
    }
});

// GET /news/search/:keyword - search news by keyword
router.get('/search/:keyword', authenticate, async (req, res) => {
    const keyword = req.params.keyword.trim();
    if (!keyword) return res.status(400).json({ error: 'keyword must not be blank' });
    try {
        const news = await fetchAndStoreNews(keyword);
        return res.status(200).json({ news });
    } catch (err) {
        const status = err.response?.status ?? 500;
        const error = err.response?.data?.errors?.[0] ?? err.response?.data?.message ?? 'Failed to fetch news';
        return res.status(status).json({ error });
    }
});

// GET /news/read - get all read articles for the logged-in user
router.get('/read', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });
    const readArticles = (user.readArticles ?? []).map((id) => articles[id]).filter(Boolean);
    return res.status(200).json({ readArticles });
});

// GET /news/favorites - get all favorite articles for the logged-in user
router.get('/favorites', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });
    const favoriteArticles = (user.favoriteArticles ?? []).map((id) => articles[id]).filter(Boolean);
    return res.status(200).json({ favoriteArticles });
});

// POST /news/:id/read - mark an article as read
router.post('/:id/read', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: 'id must be a positive integer' });
    if (!articles[id]) return res.status(404).json({ error: 'Article not found' });
    if (!user.readArticles) user.readArticles = [];
    if (!user.readArticles.includes(id)) user.readArticles.push(id);

    return res.status(200).json({ message: 'Article marked as read' });
});

// POST /news/:id/favorite - mark an article as favorite
router.post('/:id/favorite', authenticate, (req, res) => {
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: 'id must be a positive integer' });
    if (!articles[id]) return res.status(404).json({ error: 'Article not found' });
    if (!user.favoriteArticles) user.favoriteArticles = [];
    if (!user.favoriteArticles.includes(id)) user.favoriteArticles.push(id);

    return res.status(200).json({ message: 'Article marked as favorite' });
});

module.exports = router;
