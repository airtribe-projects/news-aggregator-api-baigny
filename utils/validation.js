const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) => password.length >= 6;

const isValidPreferences = (preferences) =>
    Array.isArray(preferences) && preferences.every((p) => typeof p === 'string');

module.exports = { isValidEmail, isValidPassword, isValidPreferences };
