const axios = require('axios');
const { newsCache, articles, addArticle } = require('../data/store');
const { GNEWS_API_KEY, GNEWS_BASE_URL, CACHE_REFRESH_MS } = require('../config');

// Refresh a single cached query by re-fetching from GNews
const refreshQuery = async (query) => {
    try {
        const { data } = await axios.get(GNEWS_BASE_URL, {
            params: { q: query, token: GNEWS_API_KEY, lang: 'en', max: 10 }
        });

        const result = data.articles.map(({ title, description, url, publishedAt, source }) => {
            const id = addArticle({ title, description, url, publishedAt, source: source.name });
            return articles[id];
        });

        newsCache[query] = { articles: result, fetchedAt: Date.now() };
        console.log(`[cache REFRESH] query: "${query}" updated at ${new Date().toISOString()}`);
    } catch (err) {
        console.error(`[cache REFRESH] Failed to refresh query "${query}":`, err.message);
    }
};

// Periodically refresh all queries currently in the cache
const startCacheUpdater = () => {
    setInterval(async () => {
        const queries = Object.keys(newsCache);
        if (queries.length === 0) return;

        console.log(`[cache REFRESH] Running background refresh for ${queries.length} query(s)...`);
        await Promise.all(queries.map(refreshQuery));
    }, CACHE_REFRESH_MS);

    console.log(`[cache REFRESH] Background updater started (interval: ${CACHE_REFRESH_MS / 1000}s)`);
};

module.exports = { startCacheUpdater };
