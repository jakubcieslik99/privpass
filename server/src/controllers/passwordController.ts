import { Request, Response } from 'express'
import createError from 'http-errors'
import Password from '../models/passwordModel'
import { createPasswordValidation, updatePasswordValidation } from '../validations/passwordValidation'
import { encryptPassword, decryptPassword } from '../functions/encryptDecrypt'
import { NEW_PASSWORD_ADDED, PASSWORD_UPDATED, PASSWORD_DELETED } from '../constants/SuccessMessages'
import { PASSWORD_DOES_NOT_EXIST, PASSWORD_NAME_ALREADY_EXISTS } from '../constants/ErrorMessages'

// GET - /passwords/getUserPasswords
const getUserPasswords = async (req: Request, res: Response) => {
  const { authenticatedUser } = res.locals

  let query = {}
  if (req.query.searchKeyword) {
    query = {
      addedBy: authenticatedUser.id,
      name: { $regex: req.query.searchKeyword, $options: 'i' },
    }
  } else query = { addedBy: authenticatedUser.id }

  let sortOrder = {}
  if (req.query.sortOrder && req.query.sortOrder === 'oldest') sortOrder = { createdAt: 1 }
  else if (req.query.sortOrder && req.query.sortOrder === 'newest') sortOrder = { createdAt: -1 }
  else if (req.query.sortOrder && req.query.sortOrder === 'ztoa') sortOrder = { name: -1 }
  else sortOrder = { name: 1 }

  const userPasswords = await Password.find(query, 'name').sort(sortOrder).exec()

  const userPasswordsFinal = userPasswords.map(element => {
    return { _id: element.id, name: element.name }
  })

  return res.status(200).send({ passwords: userPasswordsFinal })
}
// GET - /passwords/getUserPassword/:id
const getUserPassword = async (req: Request, res: Response) => {
  const { authenticatedUser } = res.locals

  const foundPassword = await Password.findOne({ _id: req.params.id, addedBy: authenticatedUser.id }).exec()
  if (!foundPassword) throw createError(404, PASSWORD_DOES_NOT_EXIST)

  const decryptedPassword = decryptPassword({ encryptedPassword: foundPassword.encryptedPassword, iv: foundPassword.iv })

  return res.status(200).send({ _id: foundPassword.id, password: decryptedPassword })
}
// POST - /passwords/createUserPassword
const createUserPassword = async (req: Request, res: Response) => {
  const { authenticatedUser } = res.locals
  const validationResult = await createPasswordValidation.validateAsync(req.body)

  const possibleDuplicates = await Password.find({ addedBy: authenticatedUser.id, name: validationResult.name }).exec()
  if (possibleDuplicates.length > 0) throw createError(409, PASSWORD_NAME_ALREADY_EXISTS)

  const { encryptedPassword, iv } = encryptPassword(validationResult.password)

  const createPassword = new Password({
    addedBy: authenticatedUser.id,
    name: validationResult.name,
    encryptedPassword: encryptedPassword,
    iv: iv,
  })

  await createPassword.save()

  return res.status(201).send({ message: NEW_PASSWORD_ADDED })
}
// PUT - /passwords/updateUserPassword/:id
const updateUserPassword = async (req: Request, res: Response) => {
  const { authenticatedUser } = res.locals
  const validationResult = await updatePasswordValidation.validateAsync(req.body)

  const possibleDuplicates = await Password.find({ addedBy: authenticatedUser.id, name: validationResult.name }).exec()
  if (possibleDuplicates.length > 1) throw createError(409, PASSWORD_NAME_ALREADY_EXISTS)

  const updatePassword = await Password.findOne({ _id: req.params.id, addedBy: authenticatedUser.id }).exec()
  if (!updatePassword) throw createError(404, PASSWORD_DOES_NOT_EXIST)

  const { encryptedPassword, iv } = encryptPassword(validationResult.password)

  updatePassword.name = validationResult.name
  updatePassword.encryptedPassword = encryptedPassword
  updatePassword.iv = iv
  await updatePassword.save()

  return res.status(201).send({ message: PASSWORD_UPDATED })
}
// DELETE - /passwords/deleteUserPassword/:id
const deleteUserPassword = async (req: Request, res: Response) => {
  const { authenticatedUser } = res.locals

  const deletePassword = await Password.findOne({ _id: req.params.id, addedBy: authenticatedUser.id }).exec()
  if (!deletePassword) throw createError(404, PASSWORD_DOES_NOT_EXIST)

  await deletePassword.remove()

  return res.status(200).send({ message: PASSWORD_DELETED })
}

export { getUserPasswords, getUserPassword, createUserPassword, updateUserPassword, deleteUserPassword }
