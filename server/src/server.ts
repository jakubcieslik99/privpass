import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import createError, { HttpError } from 'http-errors'
import userRoute from './routes/userRoute'

const app = express()

app.set('trust proxy', 'loopback, ' + '127.0.0.1')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/users', userRoute)

app.use(async (_req, _res, next) => next(createError(404, 'Podany zasób nie istnieje.')))

app.use((error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(error.status || 500)
  res.send({ message: error.message })
})

//app.on("ready", () => {
app.listen('3001', () => console.log('Server started on port ' + '3001'))
//})
