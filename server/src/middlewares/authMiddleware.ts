import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import User from '../models/userModel'
import { config } from '../config/utilities'

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) return next(createError(401, 'Błąd autoryzacji.'))
  const bearerToken = req.headers.authorization
  const token = bearerToken.slice(7, bearerToken.length)

  jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET, async (error, decode: any) => {
    if (error || !decode) return next(createError(401, 'Błąd autoryzacji.'))

    const authenticatedUser = await User.findById(decode.id)
    if (!authenticatedUser) return next(createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.'))

    res.locals.authenticatedUser = authenticatedUser

    return next()
  })
}

export { isAuth }
