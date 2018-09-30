const logger = require('./utils/logger')

const sockets = {}

const tables = {}

sockets.init = function(server) {
  const io = require('socket.io').listen(server)

  io.on('connection', function(socket) {
    logger.info('a user connected')
    socket.on('join', room => {
      const rooms = Object.keys(tables)
      if (rooms.indexOf(room.roomName) > -1) {
        const isUserNameTaken = tables[room.roomName].users.find(
          u => u.name === room.userName
        )
        if (isUserNameTaken) {
          io.to(`${socket.id}`).emit('usernameTaken', 'Username taken')
          return
        }
      }

      socket.join(room.roomName, () => {
        socket.emit('joined-to-room')

        if (rooms.indexOf(room.roomName) > -1) {
          const user = {
            name: room.userName,
            chip: tables[room.roomName].chip,
            ready: false
          }
          tables[room.roomName].users.push(user)
        } else {
          const user = {
            name: room.userName,
            chip: room.chip,
            ready: false
          }
          tables[room.roomName] = {
            users: [user],
            chip: room.chip,
            pot: 0,
            currentBet: 0
          }
        }
        socket.room = tables[room.roomName]
        const message = {
          action: `${room.userName} connected to ${room.roomName}`,
          table: tables[room.roomName]
        }
        io.in(room.roomName).emit('joined', message)
        logger.info('connected to ' + socket.room)
      })
    })

    socket.on('bet', data => {
      const user = tables[data.roomName].users.find(
        u => u.name === data.userName
      )
      logger.info(user)
      user.chip -= data.bet
      
      tables[data.roomName].pot += data.bet
      tables[data.roomName].currentBet = data.bet
      const message = {
        action: `${data.userName} bet ${data.bet} chips`,
        table: tables[data.roomName]
      }
      io.in(data.roomName).emit('joined', message)

      logger.info('roomname: ', socket.room)
    })

    socket.on('call', data => {
      const user = tables[data.roomName].users.find(
        u => u.name === data.userName
      )
      user.chip -= tables[data.roomName].currentBet
      tables[data.roomName].pot += tables[data.roomName].currentBet
      const message = {
        action: `${data.userName}: Call! ${
          tables[data.roomName].currentBet
        } chips`,
        table: tables[data.roomName]
      }

      io.in(data.roomName).emit('joined', message)
    })

    socket.on('scoreboard', data => {
      const scores = tables[data.roomName].users.sort((a, b) => b.chip - a.chip)
      io.in(data.roomName).emit('score', scores)
    })

    socket.on('take', data => {
      const user = tables[data.roomName].users.find(
        u => u.name === data.userName
      )
      user.chip += tables[data.roomName].pot
      tables[data.roomName].pot = 0

      const message = {
        action: `${data.userName} won the pot.`,
        table: tables[data.roomName]
      }

      io.in(data.roomName).emit('joined', message)
    })

    socket.on('disconnect', () => {
      logger.info('user left')
    })
  })
}

module.exports = sockets
