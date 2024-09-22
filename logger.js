import winston from 'winston';

const format = winston.format;
const { combine, timestamp, prettyPrint } = format;

export const Logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'mdnbot.log' }),
    ],
    format: combine(timestamp(), prettyPrint()),
});
