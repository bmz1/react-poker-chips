import * as redis from 'redis'
import logger from './utils/logger'
import { promisify } from 'util'


const client = redis.createClient(parseInt(process.env.REDIS_PORT), process.env.REDIS_URL, {no_ready_check: true})
client.auth(process.env.REDIS_PW)
const getRange = promisify(client.lrange).bind(client)

client.on('connect', () => {
  logger.info('Redis client connected')
})

client.on('error', err => {
  console.log(err)
  logger.info(`Error happened during connection: ${err}`)
})

export const pushMessage = async (roomKey: string, data: string) => {
  const date = new Date().setHours(5)
  await client.lpush(roomKey, data)
  client.expireat(roomKey, date)
  

}

export const getMessageHistory = async (roomKey: string) => {
  const history: string[] = await getRange(roomKey, 0, 99)
  const reversedHistory = history.reverse()
  return reversedHistory
}
