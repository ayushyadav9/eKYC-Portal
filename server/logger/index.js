const developmentLogger = require('./devLogger');
const productionLogger = require('./prodLogger');

let logger = null;

if (process.env.NODE_ENV === 'production') {
    logger = productionLogger();
} else {
    logger = developmentLogger();
}

module.exports = logger;