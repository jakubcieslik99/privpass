import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { config, log } from '../config/utilities.js'

const getAccessToken = (userId: string, userEmail: string) => {
  return new Promise<string | undefined>((resolve, reject) => {
    jwt.sign(
      {
        id: userId,
        email: userEmail,
      },
      config.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' },
      (error, token) => {
        if (error) {
          log.error(error.message)
          return reject(createError(500, 'Error during generating an access token.'))
        }
        return resolve(token)
      },
    )
  })
}

const getRefreshToken = (userId: string, userEmail: string) => {
  return new Promise<string | undefined>((resolve, reject) => {
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
          return reject(createError(500, 'Error during generating a refresh token.'))
        }
        return resolve(token)
      },
    )
  })
}

export { getAccessToken, getRefreshToken }
