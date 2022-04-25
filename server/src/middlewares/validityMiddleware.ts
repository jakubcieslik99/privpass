import { Request, Response, NextFunction } from 'express'
import { isValidObjectId } from 'mongoose'
import createError from 'http-errors'

const isValidId = (a: string, b: string | null) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (a !== null) if (!isValidObjectId(eval('req.params.' + a))) throw createError(422, 'Przesłano błędne dane.')
    if (b !== null) if (!isValidObjectId(eval('req.params.' + b))) throw createError(422, 'Przesłano błędne dane.')

    return next()
  }
}

export { isValidId }
