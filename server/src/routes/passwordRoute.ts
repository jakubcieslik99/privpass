import express from 'express'
import { isValidId } from '../middlewares/validityMiddleware'
import { isAuth } from '../middlewares/authMiddleware'
import { errorHandler } from '../middlewares/errorMiddleware'
import {
  getUserPasswords,
  getUserPassword,
  createUserPassword,
  updateUserPassword,
  deleteUserPassword,
} from '../controllers/passwordController'

const router = express.Router()

router
  .get('/getUserPasswords', isAuth, errorHandler(getUserPasswords))
  .get('/getUserPassword/:id', isValidId('id', null), isAuth, errorHandler(getUserPassword))
  .post('/createUserPassword', isAuth, errorHandler(createUserPassword))
  .put('/updateUserPassword/:id', isValidId('id', null), isAuth, errorHandler(updateUserPassword))
  .delete('/deleteUserPassword/:id', isValidId('id', null), isAuth, errorHandler(deleteUserPassword))

export default router
