import express from 'express'
import { registerSendCode, registerConfirmCode } from '../controllers/userController'

const router = express.Router()

router.post('/registerSendCode', registerSendCode)
router.post('/registerConfirmCode', registerConfirmCode)

export default router
