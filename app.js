const express = require('express');
const { startCacheUpdater } = require('./services/cacheUpdater');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');

app.use('/users', usersRouter);
app.use('/news', newsRouter);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
    startCacheUpdater();
});

module.exports = app;
