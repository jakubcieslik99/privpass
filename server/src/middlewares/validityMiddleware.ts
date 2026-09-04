import { Request, Response, NextFunction } from 'express'
import { isValidObjectId } from 'mongoose'
import createError from 'http-errors'
import { UNPROCESSABLE_ENTITY } from '../constants/ErrorMessages.js'

const isValidId = (a: string, b: string | null) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.params) return next(createError(422, UNPROCESSABLE_ENTITY))
  if (!isValidObjectId(req.params[a])) return next(createError(422, UNPROCESSABLE_ENTITY))
  if (b !== null && !isValidObjectId(req.params[b])) return next(createError(422, UNPROCESSABLE_ENTITY))

  return next()
}

export { isValidId }
