import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { UserValues } from '../models/userModel'
import { config, log } from '../config/utilityFunctions'

const getAccessToken = (user: UserValues) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: user._id }, config.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '300s' }, (error, token) => {
      if (error) {
        log.error(error.message)
        return reject(createError(500, 'Błąd serwera.'))
      }
      return resolve(token)
    })
  })
}

const getRefreshToken = (user: UserValues) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: user._id }, config.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '900s' }, (error, token) => {
      if (error) {
        log.error(error.message)
        return reject(createError(500, 'Błąd serwera.'))
      }
      return resolve(token)
    })
  })
}

export { getAccessToken, getRefreshToken }
