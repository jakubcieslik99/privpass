import express from 'express'
import createError from 'http-errors'

const router = express.Router()

router.post('/register', async (req, res, next) => {
  try {
    return res.status(200).send({ message: 'Hello World!' })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
})

export default router
