import { Request, Response, NextFunction } from 'express'
import { HttpError } from 'http-errors'
import { config, log } from '../config/utilities.js'
import { SERVER_ERROR, UNPROCESSABLE_ENTITY } from '../constants/ErrorMessages.js'

// eslint-disable-next-line @typescript-eslint/ban-types
const errorHandler = (controller: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(controller(req, res, next)).catch(next)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isError = (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  // internal error handling
  if (!error.status && !error.isJoi) {
    log.error(`INTERNAL - ${error.stack || error.message || 'Internal error.'}`)
    return res.status(500).send({ message: SERVER_ERROR })
  }
  // server error handling
  if (error.status >= 500) {
    log.error(`SERVER - ${error.status}: ${error.stack || error.message || SERVER_ERROR.split(':')[1].trim()}`)
    return res.status(500).send({ message: SERVER_ERROR })
  }
  // client validation error handling
  if (error.isJoi) {
    config.ENV !== 'production' && log.error(`CLIENT - ${UNPROCESSABLE_ENTITY}`)
    return res.status(422).send({ message: UNPROCESSABLE_ENTITY })
  }
  // any other client error handling
  config.ENV !== 'production' && log.error(`CLIENT - ${error.message || SERVER_ERROR}`)
  return res.status(error.status).send({ message: error.message || SERVER_ERROR })
}

export { errorHandler, isError }
