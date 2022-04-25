import express from 'express'
import { registerSendCode, loginSendCode, confirmCode, refreshAccessToken, logoutUser } from '../controllers/userController'

const router = express.Router()

router.post('/registerSendCode', registerSendCode)
router.post('/loginSendCode', loginSendCode)
router.post('/confirmCode', confirmCode)

router.get('/refreshAccessToken', refreshAccessToken)
router.get('/logoutUser', logoutUser)

export default router
