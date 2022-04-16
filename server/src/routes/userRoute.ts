import express from 'express'
import { registerSendCode, registerConfirmCode, refreshAccessToken, logoutUser } from '../controllers/userController'

const router = express.Router()

router.post('/registerSendCode', registerSendCode)
router.post('/registerConfirmCode', registerConfirmCode)

router.get('/refreshAccessToken', refreshAccessToken)
router.get('/logoutUser', logoutUser)

export default router
