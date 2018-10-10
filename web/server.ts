import * as dotenv from 'dotenv'
dotenv.config()
import app from '../app'
import * as debug from 'debug'
debug('express-socket-poker:server')
import * as http from 'http'
import { socket } from '../socket'
import logger from '../utils/logger'

const port = normalizePort(process.env.PORT || '8000')
app.set('port', port)

const server: http.Server = http.createServer(app)

server.listen(port)
logger.info('Server is listening on port ' + port)
server.on('error', onError)
server.on('listening', onListening)

socket(server)

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}
