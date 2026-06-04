// Shared in-memory user store
// key: email, value: { name, email, passwordHash, preferences, readArticles, favoriteArticles }
const users = {};

// Shared articles store — populated when GET /news is called
// key: article id, value: article object
const articles = {};
let nextId = 1;

const addArticle = (article) => {
    // Avoid duplicates by URL
    const existing = Object.values(articles).find((a) => a.url === article.url);
    if (existing) return existing.id;
    const id = nextId++;
    articles[id] = { id, ...article };
    return id;
};

module.exports = { users, articles, addArticle };
