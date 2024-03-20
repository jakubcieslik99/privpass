import { Request, Response } from 'express'
import createError from 'http-errors'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import voucher_codes from 'voucher-code-generator'
import User from '../models/userModel.js'
import { config } from '../config/utilities.js'
import { registerEmailValidation, loginEmailValidation, confirmCodeValidation } from '../validations/userValidation.js'
import { getAccessToken, getRefreshToken } from '../functions/generateTokens.js'
import sendEmail from '../functions/sendEmail.js'
import { registerSendCodeMessage } from '../messages/registerMessages.js'
import { loginSendCodeMessage } from '../messages/loginMessages.js'
import { CONFIRM_REGISTRATION, CONFIRM_LOGIN, CONFIRMED } from '../constants/SuccessMessages.js'
import { AvailableLanguages, availableLanguages } from '../constants/AvailableLanguages.js'
import {
  SERVER_ERROR,
  UNAUTHORIZED,
  USER_DOES_NOT_EXIST,
  INVALID_ACCESS_CODE,
  ACCESS_CODE_EXPIRED,
  USER_ALREADY_LOGGED_IN,
  USER_EMAIL_ALREADY_EXISTS,
} from '../constants/ErrorMessages.js'

// POST - /users/registerSendCode
const registerSendCode = async (req: Request, res: Response) => {
  if (req.cookies?.refreshToken) throw createError(409, USER_ALREADY_LOGGED_IN)

  const validationResult = await registerEmailValidation.validateAsync(req.body)

  const conflictUserEmail = await User.findOne({ email: validationResult.email.toLowerCase() }).exec()
  if (conflictUserEmail) throw createError(409, USER_EMAIL_ALREADY_EXISTS)

  const [code] = voucher_codes.generate({ count: 1, length: 4, charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' })
  const salt = await bcrypt.genSalt(10)
  const hashedCode = await bcrypt.hash(code, salt)

  const createUser = new User({
    email: validationResult.email.toLowerCase(),
    code: hashedCode,
  })
  await createUser.save()

  await sendEmail(
    registerSendCodeMessage(
      validationResult.email.toLowerCase(),
      code,
      (req.params.language as AvailableLanguages) || availableLanguages[0],
    ),
  )

  return res.status(201).send({ message: CONFIRM_REGISTRATION })
}
// POST - /users/loginSendCode
const loginSendCode = async (req: Request, res: Response) => {
  if (req.cookies?.refreshToken) throw createError(409, USER_ALREADY_LOGGED_IN)

  const validationResult = await loginEmailValidation.validateAsync(req.body)

  const loginUser = await User.findOne({ email: validationResult.email.toLowerCase() }).exec()
  if (!loginUser) throw createError(404, USER_DOES_NOT_EXIST)

  const [code] = voucher_codes.generate({ count: 1, length: 4, charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' })
  const salt = await bcrypt.genSalt(10)
  const hashedCode = await bcrypt.hash(code, salt)

  loginUser.code = hashedCode
  await loginUser.save()

  await sendEmail(
    loginSendCodeMessage(
      validationResult.email.toLowerCase(),
      code,
      (req.params.language as AvailableLanguages) || availableLanguages[0],
    ),
  )

  return res.status(200).send({ message: CONFIRM_LOGIN })
}
// POST - /users/confirmCode
const confirmCode = async (req: Request, res: Response) => {
  if (req.cookies?.refreshToken) throw createError(409, USER_ALREADY_LOGGED_IN)

  const validationResult = await confirmCodeValidation.validateAsync(req.body)

  const checkedUser = await User.findOne({ email: validationResult.email.toLowerCase() }).exec()
  if (!checkedUser) throw createError(404, USER_DOES_NOT_EXIST)

  const checkCode = await bcrypt.compare(validationResult.code, checkedUser.code || '')
  if (!checkCode) throw createError(406, INVALID_ACCESS_CODE)

  if (Date.now() - checkedUser.updatedAt > 300 * 1000) {
    checkedUser.code = null
    await checkedUser.save()
    throw createError(406, ACCESS_CODE_EXPIRED)
  }

  const accessToken = await getAccessToken(checkedUser.id, checkedUser.email)
  if (!accessToken) throw createError(500, SERVER_ERROR)
  const refreshToken = await getRefreshToken(checkedUser.id, checkedUser.email)
  if (!refreshToken) throw createError(500, SERVER_ERROR)

  checkedUser.code = null
  checkedUser.refreshTokens = checkedUser.refreshTokens.filter(
    (element: { refreshToken: string; expirationDate: number }) => element.expirationDate > Date.now(),
  )
  checkedUser.refreshTokens.push({ refreshToken, expirationDate: Date.now() + 900 * 1000 })
  await checkedUser.save()

  return res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: config.ENV === 'production' ? true : false,
      maxAge: 900 * 1000,
    })
    .status(200)
    .send({
      message: CONFIRMED,
      userInfo: {
        id: checkedUser.id,
        email: checkedUser.email,
      },
      accessToken: accessToken,
    })
}

// GET - /users/refreshAccessToken
const refreshAccessToken = async (req: Request, res: Response) => {
  if (!req.cookies?.refreshToken) throw createError(401, UNAUTHORIZED)

  const checkedUser = await User.findOne({ 'refreshTokens.refreshToken': req.cookies.refreshToken }).exec()
  if (!checkedUser) throw createError(401, UNAUTHORIZED)

  jwt.verify(req.cookies.refreshToken, config.JWT_REFRESH_TOKEN_SECRET, async (error: VerifyErrors | null, decode: any) => {
    if (error || checkedUser.id !== decode.id) throw createError(401, UNAUTHORIZED)

    const accessToken = await getAccessToken(decode.id, decode.email)
    if (!accessToken) throw createError(500, SERVER_ERROR)

    return res.status(201).send({ accessToken })
  })
}
// GET - /users/logoutUser
const logoutUser = async (req: Request, res: Response) => {
  if (!req.cookies?.refreshToken) return res.sendStatus(204)

  const checkedUser = await User.findOne({ 'refreshTokens.refreshToken': req.cookies.refreshToken }).exec()
  if (!checkedUser)
    return res
      .clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: config.ENV === 'production' ? true : false })
      .sendStatus(204)

  checkedUser.refreshTokens = checkedUser.refreshTokens.filter(
    (element: { refreshToken: string; expirationDate: number }) => element.refreshToken !== req.cookies.refreshToken,
  )
  await checkedUser.save()

  return res
    .clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: config.ENV === 'production' ? true : false })
    .sendStatus(204)
}

export { registerSendCode, loginSendCode, confirmCode, refreshAccessToken, logoutUser }
