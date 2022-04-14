import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
//import nodemailer from 'nodemailer'
import User from '../models/userModel'
import { registerEmailValidation, registerCodeValidation } from '../validations/userValidation'
import { getAccessToken, getRefreshToken } from '../functions/generateTokens'

//POST - /users/registerSendCode
const registerSendCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    const validationResult = await registerEmailValidation.validateAsync(req.body)

    const conflictUserEmail = await User.findOne({ email: validationResult.email })
    if (conflictUserEmail) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')

    const createUser = new User({
      email: validationResult.email,
      code: '2137',
    })
    const createdUser = await createUser.save()
    console.log(createdUser)

    return res
      .status(201)
      .send({ message: 'Zarejestrowano pomyślnie. Teraz potwierdź e-mail otrzymanym kodem aby się zalogować.' })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
}

//POST - /users/registerConfirmCode
const registerConfirmCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    const validationResult = await registerCodeValidation.validateAsync(req.body)

    const confirmUser = await User.findOne({ code: validationResult.code })
    if (!confirmUser) throw createError(406, 'Błąd weryfikacji. Konto mogło zostać już potwierdzone.')

    const accessToken = await getAccessToken(confirmUser)
    const refreshToken = await getRefreshToken(confirmUser)

    confirmUser.code = null
    confirmUser.refreshToken = refreshToken
    confirmUser.confirmed = true
    await confirmUser.save()

    return res
      .status(200)
      .cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 900 })
      .send({
        message: 'Potwierdzono konto pomyślnie. Nastąpi przekierowanie do profilu.',
        user: {
          id: confirmUser._id,
          email: confirmUser.email,
          accessToken: accessToken,
        },
      })

    /*return res.status(200).send({
      message: 'Potwierdzono konto pomyślnie. Nastąpi przekierowanie do profilu.',
      user: {
        id: confirmUser._id,
        accessToken: accessToken,
      },
    })*/
    //.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 1000 * 900 })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
}

export { registerSendCode, registerConfirmCode }
