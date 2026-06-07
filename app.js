const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');

app.use('/users', usersRouter);
app.use('/news', newsRouter);

module.exports = app;
