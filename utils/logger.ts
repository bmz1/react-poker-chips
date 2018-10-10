import * as winston from 'winston'
import config from '../config'

export default winston.createLogger({
  level: config.logger.level,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})
