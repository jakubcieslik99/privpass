import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import voucher_codes from 'voucher-code-generator'
import User from '../models/userModel'
import { config } from '../config/utilities'
import {
  registerEmailValidation,
  registerCodeValidation,
  loginEmailValidation,
  loginCodeValidation,
} from '../validations/userValidation'
import { getAccessToken, getRefreshToken } from '../functions/generateTokens'
import sendEmail from '../functions/sendEmail'
import { registerSendCodeMessage } from '../messages/registerMessages'
import { loginSendCodeMessage } from '../messages/loginMessages'

//POST - /users/registerSendCode
const registerSendCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = await registerEmailValidation.validateAsync(req.body)

    const conflictUserEmail = await User.findOne({ email: validationResult.email })
    if (conflictUserEmail) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')

    const [code] = voucher_codes.generate({ count: 1, length: 4, charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' })

    const createUser = new User({
      email: validationResult.email,
      code: code,
    })
    await createUser.save()

    await sendEmail(registerSendCodeMessage(validationResult.email, code))

    return res
      .status(201)
      .send({ message: 'Zarejestrowano pomyślnie. Teraz potwierdź rejestrację otrzymanym na podany adres email kodem.' })
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

    const confirmUser = await User.findOne({ code: validationResult.code, email: validationResult.email })
    if (!confirmUser) throw createError(406, 'Błąd weryfikacji. Konto mogło zostać już potwierdzone.')

    const accessToken = await getAccessToken(confirmUser._id, confirmUser.email)
    const refreshToken = await getRefreshToken(confirmUser._id, confirmUser.email)

    confirmUser.code = null
    confirmUser.refreshToken = refreshToken
    confirmUser.confirmed = true
    await confirmUser.save()

    return res
      .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 1000 * 900 })
      .status(200)
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

//POST - /users/loginSendCode
const loginSendCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = await loginEmailValidation.validateAsync(req.body)

    const loginUser = await User.findOne({ email: validationResult.email })
    if (!loginUser) throw createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.')

    if (!loginUser.confirmed) throw createError(401, 'Rejestracja nie została potwierdzona.')

    const [code] = voucher_codes.generate({ count: 1, length: 4, charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' })

    loginUser.code = code

    await loginUser.save()

    await sendEmail(loginSendCodeMessage(validationResult.email, code))

    return res.status(200).send({ message: 'Teraz potwierdź logowanie otrzymanym na podany adres email kodem.' })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
}
//POST - /users/loginConfirmCode
const loginConfirmCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = await loginCodeValidation.validateAsync(req.body)

    const loginUser = await User.findOne({ code: validationResult.code, email: validationResult.email })
    if (!loginUser) throw createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.')

    const accessToken = await getAccessToken(loginUser._id, loginUser.email)
    const refreshToken = await getRefreshToken(loginUser._id, loginUser.email)

    loginUser.code = null
    loginUser.refreshToken = refreshToken
    await loginUser.save()

    return res
      .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 1000 * 900 })
      .status(200)
      .send({
        message: 'Potwierdzono logowanie pomyślnie. Nastąpi przekierowanie do profilu.',
        user: {
          id: loginUser._id,
          email: loginUser.email,
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
const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies
    if (!cookies?.refreshToken) return res.sendStatus(204)

    const checkedUser = await User.findOne({ refreshToken: cookies.refreshToken })
    if (!checkedUser)
      return res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true }).sendStatus(204)

    checkedUser.refreshToken = null

    await checkedUser.save()

    return res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true }).sendStatus(204)
  } catch (error) {
    return next(error)
  }
}

export { registerSendCode, registerConfirmCode, loginSendCode, loginConfirmCode, refreshAccessToken, logoutUser }
