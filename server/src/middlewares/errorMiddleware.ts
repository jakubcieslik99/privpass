import { Request, Response, NextFunction } from 'express'
import { HttpError } from 'http-errors'
import { config, log } from '../config/utilities.js'
import { SERVER_ERROR, UNPROCESSABLE_ENTITY } from '../constants/ErrorMessages.js'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const errorHandler = (controller: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(controller(req, res, next)).catch(next)

const isError = (error: HttpError, _req: Request, res: Response, _next: NextFunction): void => {
  // internal error handling
  if (!error.status && !error.isJoi) {
    log.error(`INTERNAL - ${error.stack || error.message || 'Internal error.'}`)
    res.status(500).send({ message: SERVER_ERROR })
  }
  // server error handling
  if (error.status >= 500) {
    log.error(`SERVER - ${error.status}: ${error.stack || error.message || SERVER_ERROR.split(':')[1].trim()}`)
    res.status(500).send({ message: SERVER_ERROR })
  }
  // client validation error handling
  if (error.isJoi) {
    if (config.ENV !== 'production') {
      log.error(`CLIENT - ${UNPROCESSABLE_ENTITY}`)
    }
    res.status(422).send({ message: UNPROCESSABLE_ENTITY })
  }
  // any other client error handling
  if (config.ENV !== 'production') {
    log.error(`CLIENT - ${error.message || SERVER_ERROR}`)
  }
  res.status(error.status).send({ message: error.message || SERVER_ERROR })
}

export { errorHandler, isError }
