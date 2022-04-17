import express from 'express'
import {
  registerSendCode,
  registerConfirmCode,
  loginSendCode,
  loginConfirmCode,
  refreshAccessToken,
  logoutUser,
} from '../controllers/userController'

const router = express.Router()

router.post('/registerSendCode', registerSendCode)
router.post('/registerConfirmCode', registerConfirmCode)

router.post('/loginSendCode', loginSendCode)
router.post('/loginConfirmCode', loginConfirmCode)

router.get('/refreshAccessToken', refreshAccessToken)
router.get('/logoutUser', logoutUser)

export default router
