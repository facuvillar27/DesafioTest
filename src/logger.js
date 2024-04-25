import winston from "winston";
import dotenv from "dotenv";

dotenv.config();
const MODE = process.env.MODE || "dev";

let levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5
};

const checkEnvirontment = () => {
    if (MODE.toUpperCase() === "DEV") {
        return devLogger;
    }
    return prodLogger;
}

const devLogger = winston.createLogger({
    levels: levels,
    transports: [
        new winston.transports.Console({level: "debug"}), // cubre debug, http, info, warn, error, fatal
    ]
});

const prodLogger = winston.createLogger({
    levels: levels,
    transports: [
        new winston.transports.Console({ level: "info"}), // cubre info, warn, error, fatal
        new winston.transports.File({ filename: "./errors.log", level: "error"})
    ]
});

export const addLogger = (req, res, next) => {
    req.logger = checkEnvirontment();
    const textDate = new Date().toISOString()
    console.log(textDate)
    req.logDetails = {
        method: req.method,
        url: req.url,
        date: textDate
    }
    req.logger.http(`${req.logDetails.method} ${req.logDetails.url} ${req.logDetails.date}`);
    next();
}