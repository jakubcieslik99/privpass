import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import Password from '../models/passwordModel'
import { createPasswordValidation, updatePasswordValidation } from '../validations/passwordValidation'
import { encryptPassword, decryptPassword } from '../functions/encryptDecrypt'

//GET - /passwords/getUserPasswords
const getUserPasswords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authenticatedUser } = res.locals
    console.log(authenticatedUser)

    const userPasswords = await Password.find({ addedBy: authenticatedUser._id })

    return res.status(200).send({ passwords: userPasswords })
  } catch (error) {
    return next(error)
  }
}
//GET - /passwords/getUserPassword/:id
const getUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authenticatedUser } = res.locals

    const foundPassword = await Password.findOne({ _id: req.params.id, addedBy: authenticatedUser._id })
    if (!foundPassword) throw createError(404, 'Podane hasło nie istnieje lub zostało usunięte.')

    const decryptedPassword = decryptPassword({ encryptedPassword: foundPassword.encryptedPassword, iv: foundPassword.iv })

    return res.status(200).send(decryptedPassword)
  } catch (error) {
    return next(error)
  }
}
//POST - /passwords/createUserPassword
const createUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authenticatedUser } = res.locals
    const validationResult = await createPasswordValidation.validateAsync(req.body)

    const possibleDuplicates = await Password.find({ addedBy: authenticatedUser._id, name: validationResult.name })
    if (possibleDuplicates.length > 0) throw createError(409, 'Dodano już hasło o takiej nazwie.')

    const { encryptedPassword, iv } = encryptPassword(validationResult.password)

    const createPassword = new Password({
      addedBy: authenticatedUser._id,
      name: validationResult.name,
      encryptedPassword: encryptedPassword,
      iv: iv,
    })

    await createPassword.save()

    return res.status(201).send({ message: 'Dodano nowe hasło.', name: createPassword.name })
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
