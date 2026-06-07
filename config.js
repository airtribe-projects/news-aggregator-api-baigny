const required = (name) => {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
};

module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: required('JWT_SECRET'),
    GNEWS_API_KEY: required('GNEWS_API_KEY'),
    GNEWS_BASE_URL: 'https://gnews.io/api/v4/search',
    CACHE_TTL_MS: 5 * 60 * 1000,        // 5 minutes — max age of a cache entry
    CACHE_REFRESH_MS: 10 * 60 * 1000    // 10 minutes — how often background refresh runs
};
