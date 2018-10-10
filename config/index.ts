 export default {
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    httpFormat: process.env.HTTP_LOG_FORMAT || 'none'
  },
  server: {
    port: Number(process.env.PORT || 8000),
  }
}
