"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const app_1 = require("../app");
const debug = require("debug");
debug('express-socket-poker:server');
const http = require("http");
const socket_1 = require("../socket");
const logger_1 = require("../utils/logger");
const port = normalizePort(process.env.PORT || '8000');
app_1.default.set('port', port);
const server = http.createServer(app_1.default);
server.listen(port);
logger_1.default.info('Server is listening on port ' + port);
server.on('error', onError);
server.on('listening', onListening);
socket_1.socket(server);
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
//# sourceMappingURL=server.js.map