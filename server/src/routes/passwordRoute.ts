import express from 'express'
import createError from 'http-errors'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    return res.status(200).send({ message: 'Hello World!' })
  } catch (error) {
    return next(error)
  }
})

export default router
