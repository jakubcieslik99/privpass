import createError from 'http-errors'

const rateLimiter = {
  windowMs: 60 * 1000,
  max: 15,
  handler: () => {
    throw createError(429, 'Zbyt dużo zapytań do serwera.')
  },
}

const speedLimiter = {
  windowMs: 60 * 1000,
  delayAfter: 5,
  delayMs: 200,
}

export { rateLimiter, speedLimiter }
