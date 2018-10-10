"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const config_1 = require("../config");
exports.default = winston.createLogger({
    level: config_1.default.logger.level,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        })
    ]
});
//# sourceMappingURL=logger.js.map