import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import voucher_codes from 'voucher-code-generator'
import User from '../models/userModel'
import { config } from '../config/utilities'
import { registerEmailValidation, loginEmailValidation, confirmCodeValidation } from '../validations/userValidation'
import { getAccessToken, getRefreshToken } from '../functions/generateTokens'
import sendEmail from '../functions/sendEmail'
import { registerSendCodeMessage } from '../messages/registerMessages'
import { loginSendCodeMessage } from '../messages/loginMessages'

//POST - /users/registerSendCode
const registerSendCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.cookies?.refreshToken) throw createError(409, 'Użytkownik jest zalogowany.')

    const validationResult = await registerEmailValidation.validateAsync(req.body)

    const conflictUserEmail = await User.findOne({ email: validationResult.email }).exec()
    if (conflictUserEmail) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')

    const [code] = voucher_codes.generate({ count: 1, length: 4, charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' })

    const createUser = new User({
      email: validationResult.email,
      code: code,
    })
    await createUser.save()

    await sendEmail(registerSendCodeMessage(validationResult.email, code))

    return res.status(201).send({
      message: 'Zarejestrowano pomyślnie. Teraz potwierdź rejestrację otrzymanym na podany adres email kodem.',
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
    if (req.cookies?.refreshToken) throw createError(409, 'Użytkownik jest zalogowany.')

    const validationResult = await loginEmailValidation.validateAsync(req.body)

    const loginUser = await User.findOne({ email: validationResult.email }).exec()
    if (!loginUser) throw createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.')

    const [code] = voucher_codes.generate({ count: 1, length: 4, charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' })

    loginUser.code = code
    await loginUser.save()

    //await sendEmail(loginSendCodeMessage(validationResult.email, code))

    return res.status(200).send({ message: 'Teraz potwierdź logowanie otrzymanym na podany adres email kodem.' })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.status = 422
      error.message = 'Przesłano błędne dane.'
    }
    return next(error)
  }
}
//POST - /users/confirmCode
const confirmCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.cookies?.refreshToken) throw createError(409, 'Użytkownik jest zalogowany.')

    const validationResult = await confirmCodeValidation.validateAsync(req.body)

    const checkedUser = await User.findOne({ email: validationResult.email }).exec()
    if (!checkedUser) throw createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.')

    if (checkedUser.code !== validationResult.code) throw createError(406, 'Kod dostępu jest niepoprawny.')

    if (Date.now() - checkedUser.updatedAt > 300 * 1000) {
      checkedUser.code = null
      await checkedUser.save()
      throw createError(406, 'Kod dostępu stracił ważność.')
    }

    const accessToken = await getAccessToken(checkedUser._id, checkedUser.email)
    const refreshToken = await getRefreshToken(checkedUser._id, checkedUser.email)

    checkedUser.code = null
    checkedUser.refreshTokens = checkedUser.refreshTokens.filter(
      (element: { refreshToken: string; expirationDate: number }) => element.expirationDate > Date.now()
    )
    checkedUser.refreshTokens.push({ refreshToken, expirationDate: Date.now() + 900 * 1000 })
    await checkedUser.save()

    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: config.ENV !== 'test' ? true : false,
        maxAge: 900 * 1000,
      })
      .status(200)
      .send({
        message: 'Potwierdzenie kodem przebiegło pomyślnie. Nastąpi przekierowanie do profilu.',
        userInfo: {
          id: checkedUser._id,
          email: checkedUser.email,
        },
        accessToken: accessToken,
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
    if (!req.cookies?.refreshToken) throw createError(401, 'Błąd autoryzacji.')

    const checkedUser = await User.findOne({ 'refreshTokens.refreshToken': req.cookies.refreshToken }).exec()
    if (!checkedUser) throw createError(401, 'Błąd autoryzacji.')

    jwt.verify(
      req.cookies.refreshToken,
      config.JWT_REFRESH_TOKEN_SECRET,
      async (error: VerifyErrors | null, decode: any) => {
        if (error || checkedUser._id.toString() !== decode.id) throw createError(401, 'Błąd autoryzacji.')

        const accessToken = await getAccessToken(decode.id, decode.email)

        return res.status(201).send({ accessToken })
      }
    )
  } catch (error) {
    return next(error)
  }
}
//GET - /users/logoutUser
const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies?.refreshToken) return res.sendStatus(204)

    const checkedUser = await User.findOne({ 'refreshTokens.refreshToken': req.cookies.refreshToken }).exec()
    if (!checkedUser)
      return res
        .clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: config.ENV !== 'test' ? true : false })
        .sendStatus(204)

    checkedUser.refreshTokens = checkedUser.refreshTokens.filter(
      (element: { refreshToken: string; expirationDate: number }) => element.refreshToken !== req.cookies.refreshToken
    )
    await checkedUser.save()

    return res
      .clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: config.ENV !== 'test' ? true : false })
      .sendStatus(204)
  } catch (error) {
    return next(error)
  }
}

export { registerSendCode, loginSendCode, confirmCode, refreshAccessToken, logoutUser }
