import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import Password from '../models/passwordModel'

//GET - /passwords/getUserPasswords
const getUserPasswords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { decodedUser, checkedUser } = res.locals
    console.log(decodedUser.id)
    console.log(checkedUser._id)

    const userPasswords = await Password.find({ addedBy: decodedUser.id /*checkedUser._id*/ })

    return res.status(200).send({ passwords: userPasswords })
  } catch (error) {
    return next(error)
  }
}
//GET - /passwords/getUserPassword
const getUserPassword = async (req: Request, res: Response, next: NextFunction) => {}
//POST - /passwords/createUserPassword
const createUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { decodedUser, checkedUser } = res.locals
    console.log(decodedUser.id)
    console.log(checkedUser._id)

    const validationResult = {
      name: req.body.name,
      password: req.body.password,
    }

    const createPassword = new Password({
      addedBy: decodedUser.id, //checkedUser._id
      name: validationResult.name,
      encryption: validationResult.password,
      vi: 'vi',
    })

    await createPassword.save()

    return res.status(201).send({ message: 'Dodano nowe hasło.', password: createPassword })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
}
//PUT - /passwords/updateUserPassword/:id
const updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {}
//DELETE - /passwords/deleteUserPassword/:id
const deleteUserPassword = async (req: Request, res: Response, next: NextFunction) => {}

export { getUserPasswords, getUserPassword, createUserPassword, updateUserPassword, deleteUserPassword }
