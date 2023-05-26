import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import createError from 'http-errors'
import { config, log } from './config/utilities'
import databaseConnect from './config/databaseConnect'
import corsOptions from './config/corsOptions'
import { rateLimiter, speedLimiter } from './config/limitOptions'
import { isError } from './middlewares/errorMiddleware'
import userRoute from './routes/userRoute'
import passwordRoute from './routes/passwordRoute'
import { RESOURCE_DOES_NOT_EXIST } from './constants/ErrorMessages'

const app = express()
app.set('trust proxy', `loopback, ${config.IP}`)
databaseConnect(app)

app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(helmet())
app.use(cors(corsOptions))
app.use(rateLimit(rateLimiter))
app.use(slowDown(speedLimiter))

//routes
app.use('/users', userRoute)
app.use('/passwords', passwordRoute)
//404 error
app.all('*', (_req, _res, next) => next(createError(404, RESOURCE_DOES_NOT_EXIST)))
//errors handling middleware
app.use(isError)

app.on('ready', () => {
  app.listen(config.PORT, () => log.info(`Server started on port ${config.PORT}`))
})
