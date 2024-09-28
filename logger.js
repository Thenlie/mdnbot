import winston, { format } from 'winston';

const { combine, timestamp, prettyPrint } = format;

export const Logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'mdnbot.log' }),
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'mdnbot.log' }),
    ],
    format: combine(timestamp({ format: 'HH:mm:ss.SSS - ddd. MMM Do, YYYY' }), prettyPrint()),
    exitOnError: false,
});
