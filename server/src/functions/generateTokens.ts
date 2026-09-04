import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { config, log } from '../config/utilities.js'

const REFRESH_TOKEN_LIFETIME = 900
const REFRESH_TOKEN_GRACE_PERIOD = 30

const getAccessToken = (userId: string, userEmail: string) => {
  return new Promise<string | undefined>((resolve, reject) => {
    jwt.sign({ id: userId, email: userEmail }, config.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '60s' }, (error, token) => {
      if (error) {
        log.error(error.message)
        return reject(createError(500, 'Error during generating an access token.'))
      }
      return resolve(token)
    })
  })
}

const getRefreshToken = (userId: string, userEmail: string, expiresIn: number = REFRESH_TOKEN_LIFETIME) => {
  return new Promise<string | undefined>((resolve, reject) => {
    jwt.sign({ id: userId, email: userEmail }, config.JWT_REFRESH_TOKEN_SECRET, { expiresIn }, (error, token) => {
      if (error) {
        log.error(error.message)
        return reject(createError(500, 'Error during generating a refresh token.'))
      }
      return resolve(token)
    })
  })
}

// the database only ever sees the hash, so a leaked dump hands over no usable session
const hashRefreshToken = (refreshToken: string) => crypto.createHash('sha256').update(refreshToken).digest('hex')

export { getAccessToken, getRefreshToken, hashRefreshToken, REFRESH_TOKEN_LIFETIME, REFRESH_TOKEN_GRACE_PERIOD }
