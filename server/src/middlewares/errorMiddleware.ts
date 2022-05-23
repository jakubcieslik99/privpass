import { Request, Response, NextFunction } from 'express'
import { HttpError } from 'http-errors'
import { config, log } from '../config/utilities'

const errorHandler = (controller: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(controller(req, res, next)).catch(next)

const isError = (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  if (error.isJoi === true) {
    error.status = 422
    error.message = 'Przesłano błędne dane.'
  }
  config.ENV !== 'prod' && log.error(`HTTP - ${error.status || 500}`)
  return res.status(error.status || 500).send({ message: error.message || 'Błąd serwera.' })
}

export { errorHandler, isError }
