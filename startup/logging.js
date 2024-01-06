require('express-async-errors')
require('winston-mongodb')

const winston = require('winston')

const logger = winston.createLogger({
    transports: [
        new winston.transports.MongoDB({
            level: 'error',
            db: 'mongodb://127.0.0.1/vidlyDB',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            metaKey: 'error',
            storeMetadata: true
        }),
        new winston.transports.File({
            filename: 'logFile.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss', timezone: 'Africa/Nairobi' }),
                winston.format.errors({ stack: true }),
                winston.format.printf(({ level, message, timestamp, stack }) => `${JSON.stringify({ message, stack, level, timestamp })}`)
            )
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.errors({ stack: false }),
                winston.format.printf(({ level, message }) => `${level}: ${message}`)
            )
        })
    ]
})

module.exports = logger