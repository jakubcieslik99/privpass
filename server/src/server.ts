import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import createError, { HttpError } from 'http-errors'
import databaseConnect from './config/databaseConnect'
import { config, log } from './config/utilityFunctions'
import userRoute from './routes/userRoute'
import passwordRoute from './routes/passwordRoute'

const app = express()
databaseConnect(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(
  cors({
    origin: config.WEBAPP_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

//routes
app.use('/users', userRoute)
app.use('/passwords', passwordRoute)
//404 error
app.use(async (_req, _res, next) => next(createError(404, 'Podany zasób nie istnieje.')))

app.use((error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(error.status || 500)
  res.send({ message: error.message })
})

app.on('ready', () => {
  app.listen(config.PORT, () => log.info('Server started on port ' + config.PORT))
})
