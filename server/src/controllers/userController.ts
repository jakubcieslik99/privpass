import { Request, Response } from 'express'
import createError from 'http-errors'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import voucher_codes from 'voucher-code-generator'
import User from '../models/userModel'
import { config } from '../config/utilities'
import { registerEmailValidation, loginEmailValidation, confirmCodeValidation } from '../validations/userValidation'
import { getAccessToken, getRefreshToken } from '../functions/generateTokens'
import sendEmail from '../functions/sendEmail'
import { registerSendCodeMessage } from '../messages/registerMessages'
import { loginSendCodeMessage } from '../messages/loginMessages'

//POST - /users/registerSendCode
const registerSendCode = async (req: Request, res: Response) => {
  if (req.cookies?.refreshToken) throw createError(409, 'Użytkownik jest zalogowany.')

  const validationResult = await registerEmailValidation.validateAsync(req.body)

  const conflictUserEmail = await User.findOne({ email: validationResult.email.toLowerCase() }).exec()
  if (conflictUserEmail) throw createError(409, 'Istnieje już użytkownik o podanym adresie e-mail.')

  const [code] = voucher_codes.generate({ count: 1, length: 4, charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' })
  const salt = await bcrypt.genSalt(10)
  const hashedCode = await bcrypt.hash(code, salt)

  const createUser = new User({
    email: validationResult.email.toLowerCase(),
    code: hashedCode,
  })
  await createUser.save()

  await sendEmail(registerSendCodeMessage(validationResult.email.toLowerCase(), code))

  return res.status(201).send({
    message: 'Zarejestrowano pomyślnie. Teraz potwierdź rejestrację otrzymanym na podany adres email kodem.',
  })
}
//POST - /users/loginSendCode
const loginSendCode = async (req: Request, res: Response) => {
  if (req.cookies?.refreshToken) throw createError(409, 'Użytkownik jest zalogowany.')

  const validationResult = await loginEmailValidation.validateAsync(req.body)

  const loginUser = await User.findOne({ email: validationResult.email.toLowerCase() }).exec()
  if (!loginUser) throw createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.')

  const [code] = voucher_codes.generate({ count: 1, length: 4, charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' })
  const salt = await bcrypt.genSalt(10)
  const hashedCode = await bcrypt.hash(code, salt)

  loginUser.code = hashedCode
  await loginUser.save()

  await sendEmail(loginSendCodeMessage(validationResult.email.toLowerCase(), code))

  return res.status(200).send({ message: 'Teraz potwierdź logowanie otrzymanym na podany adres email kodem.' })
}
//POST - /users/confirmCode
const confirmCode = async (req: Request, res: Response) => {
  if (req.cookies?.refreshToken) throw createError(409, 'Użytkownik jest zalogowany.')

  const validationResult = await confirmCodeValidation.validateAsync(req.body)

  const checkedUser = await User.findOne({ email: validationResult.email.toLowerCase() }).exec()
  if (!checkedUser) throw createError(404, 'Konto użytkownika nie istnieje lub zostało usunięte.')

  const checkCode = await bcrypt.compare(validationResult.code, checkedUser.code || '')
  if (!checkCode) throw createError(406, 'Kod dostępu jest niepoprawny.')

  if (Date.now() - checkedUser.updatedAt > 300 * 1000) {
    checkedUser.code = null
    await checkedUser.save()
    throw createError(406, 'Kod dostępu stracił ważność.')
  }

  const accessToken = await getAccessToken(checkedUser.id, checkedUser.email)
  if (!accessToken) throw createError(500, 'Błąd serwera.')
  const refreshToken = await getRefreshToken(checkedUser.id, checkedUser.email)
  if (!refreshToken) throw createError(500, 'Błąd serwera.')

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
        id: checkedUser.id,
        email: checkedUser.email,
      },
      accessToken: accessToken,
    })
}

//GET - /users/refreshAccessToken
const refreshAccessToken = async (req: Request, res: Response) => {
  if (!req.cookies?.refreshToken) throw createError(401, 'Błąd autoryzacji.')

  const checkedUser = await User.findOne({ 'refreshTokens.refreshToken': req.cookies.refreshToken }).exec()
  if (!checkedUser) throw createError(401, 'Błąd autoryzacji.')

  jwt.verify(req.cookies.refreshToken, config.JWT_REFRESH_TOKEN_SECRET, async (error: VerifyErrors | null, decode: any) => {
    if (error || checkedUser.id !== decode.id) throw createError(401, 'Błąd autoryzacji.')

    const accessToken = await getAccessToken(decode.id, decode.email)
    if (!accessToken) throw createError(500, 'Błąd serwera.')

    return res.status(201).send({ accessToken })
  })
}
//GET - /users/logoutUser
const logoutUser = async (req: Request, res: Response) => {
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
}

export { registerSendCode, loginSendCode, confirmCode, refreshAccessToken, logoutUser }
