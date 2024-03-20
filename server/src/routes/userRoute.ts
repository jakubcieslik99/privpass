import express from 'express'
import { errorHandler } from '../middlewares/errorMiddleware.js'
import {
  registerSendCode,
  loginSendCode,
  confirmCode,
  refreshAccessToken,
  logoutUser,
} from '../controllers/userController.js'

const router = express.Router()

router.post('/registerSendCode', errorHandler(registerSendCode))
router.post('/loginSendCode', errorHandler(loginSendCode))
router.post('/confirmCode', errorHandler(confirmCode))

router.get('/refreshAccessToken', errorHandler(refreshAccessToken))
router.get('/logoutUser', errorHandler(logoutUser))

export default router
