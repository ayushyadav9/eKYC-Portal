const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const devLogger = () => {
    const myFormat = printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    });

    return createLogger({
        level: 'debug',
        format: combine(
            format.colorize(),
            label({ label: 'development' }),
            timestamp({ format: 'HH:mm:ss' }),
            myFormat
        ),

        transports: [
            new transports.Console(),
            new transports.File({
                filename: 'logs/debug.log',
            }),
        ],
    });
};

module.exports = devLogger;