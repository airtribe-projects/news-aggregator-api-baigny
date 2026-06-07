const app = require('./app');
const { startCacheUpdater } = require('./services/cacheUpdater');
const { PORT } = require('./config');

const port = PORT;

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

startCacheUpdater();
