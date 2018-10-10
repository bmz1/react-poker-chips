"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
const logger_1 = require("./utils/logger");
const util_1 = require("util");
const client = redis.createClient(parseInt(process.env.REDIS_PORT), process.env.REDIS_URL, { no_ready_check: true });
client.auth(process.env.REDIS_PW);
const getRange = util_1.promisify(client.lrange).bind(client);
client.on('connect', () => {
    logger_1.default.info('Redis client connected');
});
client.on('error', err => {
    console.log(err);
    logger_1.default.info(`Error happened during connection: ${err}`);
});
exports.pushMessage = (roomKey, data) => __awaiter(this, void 0, void 0, function* () {
    yield client.lpush(roomKey, data);
});
exports.getMessageHistory = (roomKey) => __awaiter(this, void 0, void 0, function* () {
    const history = yield getRange(roomKey, 0, 99);
    const reversedHistory = history.reverse();
    return reversedHistory;
});
//# sourceMappingURL=redis.js.map