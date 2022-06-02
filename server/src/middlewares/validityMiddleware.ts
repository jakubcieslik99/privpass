import { Request, Response, NextFunction } from 'express'
import { isValidObjectId } from 'mongoose'
import createError from 'http-errors'

const isValidId = (a: string, b: string | null) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.params) return next(createError(422, 'Przesłano błędne dane.'))
  if (a !== null) if (!isValidObjectId(eval('req.params.' + a))) return next(createError(422, 'Przesłano błędne dane.'))
  if (b !== null) if (!isValidObjectId(eval('req.params.' + b))) return next(createError(422, 'Przesłano błędne dane.'))

  return next()
}

export { isValidId }
