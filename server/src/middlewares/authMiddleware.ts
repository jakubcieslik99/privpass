import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import User from '../models/userModel'
import { config } from '../config/utilityFunctions'

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) return next(createError(401, 'Błąd autoryzacji.'))
  const bearerToken = req.headers.authorization
  const token = bearerToken.slice(7, bearerToken.length)

  jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET, async (error, decode) => {
    if (error) return next(createError(401, 'Błąd autoryzacji.'))
    //req.user = decode
    res.locals.decodedUser = decode

    //const checkedUser = await User.findById(req.user.id)
    const checkedUser = await User.findById(res.locals.decodedUser.id)
    if (!checkedUser) return next(createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.'))
    //req.checkedUser = checkedUser
    res.locals.checkedUser = checkedUser

    return next()
  })
}

export { isAuth }
