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
const redis_1 = require("./redis");
const socketIO = require("socket.io");
const logger_1 = require("./utils/logger");
const allClients = [];
const tables = {};
exports.socket = (server) => {
    const io = socketIO.listen(server);
    io.on('connection', function (socket) {
        logger_1.default.info('a user connected');
        socket.on('join', room => {
            const client = {
                id: socket.id,
                room: room.roomName
            };
            allClients.push(client);
            const rooms = Object.keys(tables);
            if (rooms.indexOf(room.roomName) > -1) {
                const isUserNameTaken = tables[room.roomName].users.find(u => u.name === room.userName);
                if (isUserNameTaken) {
                    io.to(`${socket.id}`).emit('usernameTaken', 'Username taken');
                    return;
                }
            }
            socket.join(room.roomName, () => __awaiter(this, void 0, void 0, function* () {
                socket.emit('joined-to-room');
                if (rooms.indexOf(room.roomName) > -1) {
                    const user = {
                        id: socket.id,
                        name: room.userName,
                        chip: tables[room.roomName].chip,
                        ready: false
                    };
                    tables[room.roomName].users.push(user);
                }
                else {
                    const user = {
                        id: socket.id,
                        name: room.userName,
                        chip: room.chip,
                        ready: false
                    };
                    tables[room.roomName] = {
                        users: [user],
                        chip: room.chip,
                        pot: 0,
                        currentBet: 0
                    };
                }
                const message = {
                    action: `${room.userName} connected to ${room.roomName}`,
                    table: tables[room.roomName]
                };
                const history = yield redis_1.getMessageHistory(room.roomName);
                io.in(room.roomName).emit('history', history);
                io.in(room.roomName).emit('joined', message);
                console.log(tables);
                redis_1.pushMessage(room.roomName, message.action);
                logger_1.default.info('connected to ' + room.roomName);
            }));
        });
        socket.on('bet', data => {
            const user = tables[data.roomName].users.find(u => u.name === data.userName);
            user.chip -= data.bet;
            tables[data.roomName].pot += data.bet;
            tables[data.roomName].currentBet = data.bet;
            const message = {
                action: `[BET]: ${data.userName} bet ${data.bet} chips`,
                table: tables[data.roomName]
            };
            io.in(data.roomName).emit('joined', message);
            redis_1.pushMessage(data.roomName, message.action);
        });
        socket.on('call', data => {
            const user = tables[data.roomName].users.find(u => u.name === data.userName);
            user.chip -= tables[data.roomName].currentBet;
            tables[data.roomName].pot += tables[data.roomName].currentBet;
            const message = {
                action: `[CALL]: ${data.userName} called ${tables[data.roomName].currentBet} chips`,
                table: tables[data.roomName]
            };
            io.in(data.roomName).emit('joined', message);
            redis_1.pushMessage(data.roomName, message.action);
        });
        socket.on('scoreboard', data => {
            const scores = tables[data.roomName].users.sort((a, b) => b.chip - a.chip);
            io.in(data.roomName).emit('score', scores);
        });
        socket.on('take', data => {
            const user = tables[data.roomName].users.find(u => u.name === data.userName);
            user.chip += tables[data.roomName].pot;
            tables[data.roomName].pot = 0;
            const message = {
                action: `[WIN]: ${data.userName} won the pot.`,
                table: tables[data.roomName]
            };
            io.in(data.roomName).emit('joined', message);
            redis_1.pushMessage(data.roomName, message.action);
        });
        socket.on('check', data => {
            const message = {
                action: `[CHECK]: ${data.userName} checked.`,
                table: tables[data.roomName]
            };
            io.in(data.roomName).emit('joined', message);
            redis_1.pushMessage(data.roomName, message.action);
        });
        socket.on('fold', data => {
            const message = {
                action: `[FOLD]: ${data.userName} did fold.`,
                table: tables[data.roomName]
            };
            io.in(data.roomName).emit('joined', message);
            redis_1.pushMessage(data.roomName, message.action);
        });
        socket.on('all-in', data => {
            const user = tables[data.roomName].users.find(u => u.name === data.userName);
            tables[data.roomName].pot += user.chip;
            user.chip = 0;
            const message = {
                action: `[ALL-IN]: ${data.userName} said ALL-IN`,
                table: tables[data.roomName]
            };
            io.in(data.roomName).emit('joined', message);
            redis_1.pushMessage(data.roomName, message.action);
        });
        socket.on('disconnect', () => {
            //console.log(tables.room1.users)
            logger_1.default.info('user left');
            const disconnectedClient = allClients.find(client => client.id === socket.id);
            const userInTable = tables[disconnectedClient.room].users.find(user => user.id === disconnectedClient.id);
            const _i = tables[disconnectedClient.room].users.indexOf(userInTable);
            tables[disconnectedClient.room].users.splice(_i, 1);
            const i = allClients.indexOf(disconnectedClient);
            allClients.splice(i, 1);
        });
    });
};
//# sourceMappingURL=socket.js.map