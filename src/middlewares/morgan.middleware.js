import logger from "../utils/logger.js"
import morgan from "morgan"


// ############## Initializing morgan middleware to get information from requests and using winston to log #########
const loggingMiddleware = morgan(
    (tokens, req, res) => {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number(tokens.status(req, res)),
            responseTime: Number(tokens['response-time'](req, res)),
            userAgent: tokens['user-agent'](req, res),
            ip: req.ip
        });
    }, {
    stream: {
        write: (message) => {
            const data = JSON.parse(message);
            // Pass a readable string as the log message, with the parsed fields as metadata.
            logger.http(
                `${data.method} ${data.url} ${data.status} ${data.responseTime}ms - ${data.ip}`,
                data
            );
        }
    }
});

export default loggingMiddleware;