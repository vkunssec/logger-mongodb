import winston from 'winston';
import 'winston-mongodb';

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    winston.format.align(),
    winston.format.printf((i) => 
        `${[i.timestamp]}: ${i.level}: ${i.message}`),
    winston.format.metadata({
        fillExcept: [
            'message', 
            'level', 
            'timestamp', 
            'label',
            'service',
        ],
    }),
);

const winstonLogger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        service: 'example-project',
    },
    transports: [
        new winston.transports.Console({
            format: customFormat,
        }),

        new winston.transports.File({ filename: 'logs/error.log', level: 'error', }),
        new winston.transports.File({ filename: 'logs/logger.log', }),
        
        new winston.transports.MongoDB({
            db: "mongodb://localhost:27017/test",
            collection: "log",
            options: {
                useUnifiedTopology: true, 
                useNewUrlParser: true, 
            },
        }),
    ],
    format: customFormat,
});

export const logger = winstonLogger;
