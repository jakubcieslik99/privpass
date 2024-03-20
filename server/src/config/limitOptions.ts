import createError from 'http-errors'
import { TOO_MANY_REQUESTS } from '../constants/ErrorMessages.js'

const rateLimiter = {
  windowMs: 60 * 1000,
  max: 15,
  handler: () => {
    throw createError(429, TOO_MANY_REQUESTS)
  },
}

const speedLimiter = {
  windowMs: 60 * 1000,
  delayAfter: 5,
  delayMs: 200,
}

export { rateLimiter, speedLimiter }
