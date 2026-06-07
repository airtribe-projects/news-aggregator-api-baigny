const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) => typeof password === 'string' && password.length >= 6;

const isValidPreferences = (preferences) =>
    Array.isArray(preferences) &&
    preferences.every((p) => typeof p === 'string' && p.trim().length > 0);

module.exports = { isValidEmail, isValidPassword, isValidPreferences };
