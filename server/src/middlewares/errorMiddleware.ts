import { Request, Response, NextFunction } from 'express'
import { HttpError } from 'http-errors'
import { log } from '../config/utilities'

const isError = (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  log.error(`HTTP - ${error.status || 500}`)
  return res.status(error.status || 500).send({ message: error.message || 'Błąd serwera.' })
}

export default isError
