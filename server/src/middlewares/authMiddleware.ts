import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import createError from 'http-errors'
import User from '../models/userModel.js'
import { config } from '../config/utilities.js'
import { UNAUTHORIZED, SESSION_EXPIRED, USER_DOES_NOT_EXIST } from '../constants/ErrorMessages.js'

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) return next(createError(401, UNAUTHORIZED))
  const bearerToken = req.headers.authorization
  const token = bearerToken.slice(7, bearerToken.length)

  jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET, async (error: VerifyErrors | null, decode: any) => {
    if (error || !decode) return next(createError(403, SESSION_EXPIRED))

    const authenticatedUser = await User.findById(decode.id).exec()
    if (!authenticatedUser) return next(createError(404, USER_DOES_NOT_EXIST))

    res.locals.authenticatedUser = authenticatedUser

    return next()
  })
}

export { isAuth }
