import { pushMessage, getMessageHistory } from './redis'
import { Table, User } from './interfaces/socketClasses'
import { Player, Client } from './interfaces/socketInterfaces'
import * as socketIO from 'socket.io'
import logger from './utils/logger'
import { Server } from 'http'


const tables = new Table()
console.log(tables)

export const socket = (server: Server) => {
  const io = socketIO.listen(server)

  io.on('connection', (socket: SocketIO.Socket) => {
    logger.info('a user connected')

    socket.on('join', (room: {chip: number; roomName: string; userName: string }) => {
      const client: Client = {
        id: socket.id,
        name: room.userName,
        room: room.roomName
      }

      tables.addClient(client)

      const isUserNameTaken = tables.isUsernameTaken(room)
      if (isUserNameTaken) {
        io.to(`${socket.id}`).emit('usernameTaken', 'Username taken')
        return
      }

      socket.join(room.roomName, async () => {
        socket.emit('joined-to-room')

        const player: Player = new User(socket.id, room.userName, room.chip, false)
        

        tables.joinRoom(room.roomName, player)

        const message = {
          action: `${room.userName} connected to ${room.roomName}`,
          table: tables.sendRoom(room.roomName)
        }
        const history = await getMessageHistory(room.roomName)
        io.in(room.roomName).emit('history', history)
        io.in(room.roomName).emit('joined', message)

        pushMessage(room.roomName, message.action)
        logger.info('connected to ' + room.roomName)
      })
    })

    socket.on('bet', data => {
        tables.bet(data)
        const message = {
          action: `[BET]: ${data.userName} bet ${data.bet} chips`,
          table: tables.sendRoom(data.roomName)
        }
        io.in(data.roomName).emit('joined', message)
        pushMessage(data.roomName, message.action)
      
    })

    socket.on('call', data => {
      tables.call(data)
        const message = {
          action: `[CALL]: ${data.userName} called ${
            tables.getCurrentBet(data)
          } chips`,
          table: tables.sendRoom(data.roomName)
        }

        io.in(data.roomName).emit('joined', message)
        pushMessage(data.roomName, message.action)
      
    })

    socket.on('scoreboard', data => {
      const scores = tables.getScores(data)
      io.in(data.roomName).emit('score', scores)
    })

    socket.on('take', data => {
        tables.take(data)
        const message = {
          action: `[WIN]: ${data.userName} won the pot.`,
          table: tables.sendRoom(data.roomName)
        }

        io.in(data.roomName).emit('joined', message)
        pushMessage(data.roomName, message.action)
      
    })

    socket.on('check', data => {
      const message = {
        action: `[CHECK]: ${data.userName} checked.`,
        table: tables.sendRoom(data.roomName)
      }

      io.in(data.roomName).emit('joined', message)
      pushMessage(data.roomName, message.action)
    })

    socket.on('fold', data => {
      const message = {
        action: `[FOLD]: ${data.userName} did fold.`,
        table: tables.sendRoom(data.roomName)
      }

      io.in(data.roomName).emit('joined', message)
      pushMessage(data.roomName, message.action)
    })

    socket.on('all-in', data => {
      tables.allIn(data)

        const message = {
          action: `[ALL-IN]: ${data.userName} said ALL-IN`,
          table: tables.sendRoom(data.roomName)
        }

        io.in(data.roomName).emit('joined', message)
        pushMessage(data.roomName, message.action)
      
    })

    // socket.on('history', async (data) => {
    //   const history = await getMessageHistory(data.roomName)
    //   const message = {
    //     action: `[REJOIN]: ${data.userName} is back`,
    //     table: tables.sendRoom(data.roomName)
    //   }
    //   io.in(data.roomName).emit('history', history)
    //   io.in(data.roomName).emit('info', message)
    // })

    socket.on('disconnect', () => {
      logger.info('user left')

      tables.removeUser(socket.id)
    })
  })
}
