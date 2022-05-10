import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import Password from '../models/passwordModel'
import { createPasswordValidation, updatePasswordValidation } from '../validations/passwordValidation'
import { encryptPassword, decryptPassword } from '../functions/encryptDecrypt'

//GET - /passwords/getUserPasswords
const getUserPasswords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authenticatedUser } = res.locals

    let query = {}
    if (req.query.searchKeyword) {
      query = {
        addedBy: authenticatedUser._id,
        name: { $regex: req.query.searchKeyword, $options: 'i' },
      }
    } else query = { addedBy: authenticatedUser._id }

    let sortOrder = {}
    if (req.query.sortOrder && req.query.sortOrder === 'oldest') sortOrder = { _id: 1 }
    else if (req.query.sortOrder && req.query.sortOrder === 'newest') sortOrder = { _id: -1 }
    else if (req.query.sortOrder && req.query.sortOrder === 'ztoa') sortOrder = { name: -1 }
    else sortOrder = { name: 1 }

    const userPasswords = await Password.find(query, 'name').sort(sortOrder).exec()

    const userPasswordsFinal = userPasswords.map(element => {
      return { _id: element._id, name: element.name }
    })

    return res.status(200).send({ passwords: userPasswordsFinal })
  } catch (error) {
    return next(error)
  }
}
//GET - /passwords/getUserPassword/:id
const getUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authenticatedUser } = res.locals

    const foundPassword = await Password.findOne({ _id: req.params.id, addedBy: authenticatedUser._id }).exec()
    if (!foundPassword) throw createError(404, 'Podane hasło nie istnieje lub zostało usunięte.')

    const decryptedPassword = decryptPassword({ encryptedPassword: foundPassword.encryptedPassword, iv: foundPassword.iv })

    return res.status(200).send({ _id: foundPassword._id, password: decryptedPassword })
  } catch (error) {
    return next(error)
  }
}
//POST - /passwords/createUserPassword
const createUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authenticatedUser } = res.locals
    const validationResult = await createPasswordValidation.validateAsync(req.body)

    const possibleDuplicates = await Password.find({ addedBy: authenticatedUser._id, name: validationResult.name }).exec()
    if (possibleDuplicates.length > 0) throw createError(409, 'Istnieje już hasło o takiej nazwie.')

    const { encryptedPassword, iv } = encryptPassword(validationResult.password)

    const createPassword = new Password({
      addedBy: authenticatedUser._id,
      name: validationResult.name,
      encryptedPassword: encryptedPassword,
      iv: iv,
    })

    await createPassword.save()

    return res.status(201).send({ message: 'Dodano nowe hasło.' })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
}
//PUT - /passwords/updateUserPassword/:id
const updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authenticatedUser } = res.locals
    const validationResult = await updatePasswordValidation.validateAsync(req.body)

    const possibleDuplicates = await Password.find({ addedBy: authenticatedUser._id, name: validationResult.name }).exec()
    if (possibleDuplicates.length > 1) throw createError(409, 'Istnieje już hasło o takiej nazwie.')

    const updatePassword = await Password.findOne({ _id: req.params.id, addedBy: authenticatedUser._id }).exec()
    if (!updatePassword) throw createError(404, 'Podane hasło nie istnieje lub zostało usunięte.')

    const { encryptedPassword, iv } = encryptPassword(validationResult.password)

    updatePassword.name = validationResult.name
    updatePassword.encryptedPassword = encryptedPassword
    updatePassword.iv = iv
    await updatePassword.save()

    return res.status(201).send({ message: 'Zaktualizowano hasło.' })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
}
//DELETE - /passwords/deleteUserPassword/:id
const deleteUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authenticatedUser } = res.locals

    const deletePassword = await Password.findOne({ _id: req.params.id, addedBy: authenticatedUser._id }).exec()
    if (!deletePassword) throw createError(404, 'Podane hasło nie istnieje lub zostało usunięte.')

    await deletePassword.remove()

    return res.status(200).send({ message: 'Usunięto hasło.' })
  } catch (error) {
    return next(error)
  }
}

export { getUserPasswords, getUserPassword, createUserPassword, updateUserPassword, deleteUserPassword }
