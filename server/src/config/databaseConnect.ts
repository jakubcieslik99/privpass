import { Application } from 'express'
import mongoose from 'mongoose'
import { config, log } from './utilities.js'

const databaseConnect = async (app: Application) => {
  mongoose.connection.on('connected', () => log.info('MongoDB connection established'))
  mongoose.connection.on('disconnected', () => log.warn('MongoDB connection dropped'))

  mongoose.set('strictQuery', false)

  try {
    const environment = ['development', 'testing'].includes(config.ENV) ? '?authSource=admin' : ''
    const URI = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}${environment}`
    await mongoose.connect(URI)

    app.listen(config.PORT, () => log.info(`Server started on port ${config.PORT}`))
  } catch (error) {
    log.error(error)
  }
}

export default databaseConnect
