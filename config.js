module.exports = {
    PORT: 3000,
    JWT_SECRET: 'news_aggregator_secret',
    GNEWS_API_KEY: '17a9c3eeedc0df382183f4076cbf047a',
    GNEWS_BASE_URL: 'https://gnews.io/api/v4/search',
    CACHE_TTL_MS: 5 * 60 * 1000,        // 5 minutes — max age of a cache entry
    CACHE_REFRESH_MS: 10 * 60 * 1000    // 10 minutes — how often background refresh runs
};
