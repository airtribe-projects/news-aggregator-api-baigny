// Shared in-memory user store
// key: email, value: { name, email, passwordHash, preferences }
const users = {};

module.exports = { users };
