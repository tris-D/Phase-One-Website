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
            logger.http(JSON.parse(message));
        }
    }
});

export default loggingMiddleware;