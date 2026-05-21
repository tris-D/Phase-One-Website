import winston from 'winston';
const { combine, timestamp, json, colorize, printf } = winston.format;

// Custom format for console logging with colors - Pretty
const consoleLogFormat = combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
)

// Create a Winston logger
const logger = winston.createLogger({ 
    level:process.env.NODE_ENV === "production" ? "info" : "http",
    format: combine(
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.Console({
            format:consoleLogFormat
        }),
        new winston.transports.File({filename:'./logs/app.log',format: combine(timestamp(),json())})
        // LOGS THE REQUESTS ONTO "app.log"
    ]
})

export default logger;