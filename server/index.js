const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./logger');
const passport = require('passport');

require('dotenv').config();
require('./config/db');
require('./config/passJWT');

const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/', require('./api/routes'));



app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// error handler middleware
app.use((error, req, res) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

app.listen(port, (err) => {
    if (err) {
        logger.error(err);
    }
    logger.info(`Server started at http://localhost:${port}`);
});