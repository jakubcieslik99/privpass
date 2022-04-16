import express from 'express'
import { isValidId } from '../middlewares/validityMiddleware'
import { isAuth } from '../middlewares/authMiddleware'
import {
  getUserPasswords,
  getUserPassword,
  createUserPassword,
  updateUserPassword,
  deleteUserPassword,
} from '../controllers/passwordController'

const router = express.Router()

router
  .get('/getUserPasswords', isAuth, getUserPasswords)
  .get('/getUserPassword/:id', isValidId('id', null), isAuth, getUserPassword)
  .post('/createUserPassword', isAuth, createUserPassword)
  .put('/updateUserPassword/:id', isValidId('id', null), isAuth, updateUserPassword)
  .delete('/deleteUserPassword/:id', isValidId('id', null), isAuth, deleteUserPassword)

export default router
