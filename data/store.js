// In-memory store — intentionally volatile for this assignment.
// All data (users, articles, cache) is lost on process restart.
// Replace with a persistent store (e.g. SQLite, MongoDB) for production use.

// key: email, value: { name, email, passwordHash, preferences, readArticles, favoriteArticles }
const users = {};

// Shared articles store — populated when GET /news is called
// key: article id, value: article object
const articles = {};
// Secondary index for O(1) deduplication — key: url, value: article id
const articleIdByUrl = {};
let nextId = 1;

const addArticle = (article) => {
    const existingId = articleIdByUrl[article.url];
    if (existingId !== undefined) return existingId;
    const id = nextId++;
    articles[id] = { id, ...article };
    articleIdByUrl[article.url] = id;
    return id;
};

// News cache — key: query string, value: { articles: [...], fetchedAt: timestamp }
const newsCache = {};

module.exports = { users, articles, addArticle, newsCache };
