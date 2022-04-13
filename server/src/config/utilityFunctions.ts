import dotenv from 'dotenv'
import logger from 'pino'

dotenv.config()

const config = {
  PORT: process.env.PORT || 3001,
  IP: process.env.IP || '127.0.0.1',
  API_URL: process.env.API_URL || 'http://localhost:3001',
  WEBAPP_URL: process.env.WEBAPP_URL || 'http://localhost:3000',

  NOREPLY_ADDRESS: process.env.NOREPLY_ADDRESS || 'noreply@percpass.com',

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/percpass',

  JWT_SECRET: process.env.JWT_SECRET || 'jwt_secret_jwt_secret_jwt_secret',
  CRYPTO_SECRET: process.env.CRYPTO_SECRET || 'crypto_secret_crypto_secret_crypto_secret',
}

const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:yyyy/mm/dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
})

export { config, log }
