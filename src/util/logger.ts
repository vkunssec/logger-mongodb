import winston from 'winston';
import 'winston-mongodb';

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    winston.format.align(),
    winston.format.printf((i) => 
        `${[i.timestamp]}: [${i.service}] ${i.level}: ${i.message}`),
);

export const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        service: 'example-project',
    },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', }),
        new winston.transports.File({ filename: 'logs/logger.log', }),
        
        new winston.transports.MongoDB({
            db: "mongodb://localhost:27017/test",
            collection: "log",
            name: "error-mongo",
            options: {
                useUnifiedTopology: true, 
                useNewUrlParser: true, 
            },
        }),
    ],
    format: customFormat,
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        // format: winston.format.simple(),
        format: customFormat,
    }));
}
