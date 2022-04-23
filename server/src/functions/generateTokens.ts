import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { config, log } from '../config/utilities'

const getAccessToken = (userId: string, userEmail: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: userId,
        email: userEmail,
      },
      config.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: '300s' },
      (error, token) => {
        if (error) {
          log.error(error.message)
          return reject(createError(500, 'Błąd serwera.'))
        }
        return resolve(token)
      }
    )
  })
}

const getRefreshToken = (userId: string, userEmail: string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: userId,
        email: userEmail,
      },
      config.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: '900s' },
      (error, token) => {
        if (error) {
          log.error(error.message)
          return reject(createError(500, 'Błąd serwera.'))
        }
        return resolve(token)
      }
    )
  })
}

export { getAccessToken, getRefreshToken }
