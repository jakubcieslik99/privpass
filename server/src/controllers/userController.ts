import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
//import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import { config } from '../config/utilityFunctions'
import { registerEmailValidation, registerCodeValidation } from '../validations/userValidation'
import { getAccessToken, getRefreshToken } from '../functions/generateTokens'

//POST - /users/registerSendCode
const registerSendCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = await registerEmailValidation.validateAsync(req.body)

    const conflictUserEmail = await User.findOne({ email: validationResult.email })
    if (conflictUserEmail) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')

    const createUser = new User({
      email: validationResult.email,
      code: '2137',
    })
    await createUser.save()

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
    const validationResult = await registerCodeValidation.validateAsync(req.body)

    //check also email
    const confirmUser = await User.findOne({ code: validationResult.code })
    if (!confirmUser) throw createError(406, 'Błąd weryfikacji. Konto mogło zostać już potwierdzone.')

    const accessToken = await getAccessToken(confirmUser._id, confirmUser.email)
    const refreshToken = await getRefreshToken(confirmUser._id, confirmUser.email)

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
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
}

//GET - /users/refreshAccessToken
const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies
    if (!cookies?.refreshToken) throw createError(401, 'Błąd autoryzacji.')

    const checkedUser = await User.findOne({ refreshToken: cookies.refreshToken })
    if (!checkedUser) throw createError(401, 'Błąd autoryzacji.')

    jwt.verify(cookies.refreshToken, config.JWT_REFRESH_TOKEN_SECRET, async (error: any, decode: any) => {
      if (error || checkedUser._id.toString() !== decode.id) throw createError(401, 'Błąd autoryzacji.')

      const accessToken = await getAccessToken(decode.id, decode.email)
      //const accessToken = jwt.sign({ id: decode.id }, config.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '300s' })

      return res.status(201).send({ accessToken })
    })
  } catch (error) {
    return next(error)
  }

  /*const cookies = req.cookies
  if (!cookies?.refreshToken) return res.sendStatus(401)
  console.log(cookies.refreshToken)

  const checkedUser = await User.findOne({ refreshToken: cookies.refreshToken })
  if (!checkedUser) return res.sendStatus(404)

  jwt.verify(cookies.refreshToken, config.JWT_REFRESH_TOKEN_SECRET, async (error: any, decode: any) => {
    if (error || checkedUser._id !== decode.id) return res.sendStatus(401)

    const accessToken = jwt.sign({ id: decode.id }, config.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '300s' })

    return res.status(201).send({ accessToken })
  })*/
}
//GET - /users/logoutUser
const logoutUser = async (req: Request, res: Response, next: NextFunction) => {}

export { registerSendCode, registerConfirmCode, refreshAccessToken, logoutUser }
