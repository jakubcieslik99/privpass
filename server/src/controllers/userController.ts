import { Request, Response } from 'express'
import createError from 'http-errors'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import voucher_codes from 'voucher-code-generator'
import User from '../models/userModel.js'
import { config, log } from '../config/utilities.js'
import { registerEmailValidation, loginEmailValidation, confirmCodeValidation } from '../validations/userValidation.js'
import {
  getAccessToken,
  getRefreshToken,
  hashRefreshToken,
  REFRESH_TOKEN_LIFETIME,
  REFRESH_TOKEN_GRACE_PERIOD,
} from '../functions/generateTokens.js'
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

  const createUser = new User({ email: validationResult.email.toLowerCase(), code: hashedCode })
  await createUser.save()

  try {
    await sendEmail(
      registerSendCodeMessage(
        validationResult.email.toLowerCase(),
        code,
        (req.params.language as AvailableLanguages) || availableLanguages[0],
      ),
    )
  } catch (error) {
    await createUser.deleteOne()
    throw error
  }

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

  await User.updateOne(
    { _id: checkedUser.id },
    { $set: { code: null }, $pull: { refreshTokens: { expirationDate: { $lte: new Date() } } } },
  ).exec()
  await User.updateOne(
    { _id: checkedUser.id },
    {
      $push: {
        refreshTokens: {
          refreshToken: hashRefreshToken(refreshToken),
          expirationDate: new Date(Date.now() + REFRESH_TOKEN_LIFETIME * 1000),
        },
      },
    },
  ).exec()

  return res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: config.ENV === 'production' ? true : false,
      maxAge: REFRESH_TOKEN_LIFETIME * 1000,
    })
    .status(200)
    .send({ message: CONFIRMED, userInfo: { id: checkedUser.id, email: checkedUser.email }, accessToken: accessToken })
}

// GET - /users/refreshAccessToken
const refreshAccessToken = async (req: Request, res: Response) => {
  if (!req.cookies?.refreshToken) throw createError(401, UNAUTHORIZED)

  let decode: string | JwtPayload
  try {
    decode = jwt.verify(req.cookies.refreshToken, config.JWT_REFRESH_TOKEN_SECRET)
  } catch {
    throw createError(401, UNAUTHORIZED)
  }
  if (typeof decode === 'string') throw createError(401, UNAUTHORIZED)

  // the signature already says whose token this is, so the session is looked up by the primary key
  const checkedUser = await User.findById(decode.id).exec()
  if (!checkedUser) throw createError(401, UNAUTHORIZED)

  const hashedToken = hashRefreshToken(req.cookies.refreshToken)
  const session = checkedUser.refreshTokens.find(element => element.refreshToken === hashedToken)

  if (!session) {
    const rotatedSession = checkedUser.refreshTokens.find(element => element.previousRefreshToken === hashedToken)
    const withinGracePeriod =
      rotatedSession?.rotatedAt && Date.now() - rotatedSession.rotatedAt.getTime() <= REFRESH_TOKEN_GRACE_PERIOD * 1000

    // a token that verifies but is no longer stored was either logged out or stolen - every session of that user goes
    if (!withinGracePeriod) {
      log.warn(`SECURITY - refresh token reuse detected for user ${checkedUser.id}, all of its sessions revoked.`)
      await User.updateOne({ _id: checkedUser.id }, { $set: { refreshTokens: [] } }).exec()
      throw createError(401, UNAUTHORIZED)
    }

    // rotated out a moment ago: parallel requests of one browser, not a theft - serve them without rotating again
    const accessToken = await getAccessToken(checkedUser.id, checkedUser.email)
    if (!accessToken) throw createError(500, SERVER_ERROR)

    return res.status(201).send({ accessToken })
  }

  // rotation carries the original expiration over, so a session never outlives the window opened at login
  const remainingLifetime = Math.floor((session.expirationDate.getTime() - Date.now()) / 1000)
  if (remainingLifetime <= 0) {
    await User.updateOne({ _id: checkedUser.id }, { $pull: { refreshTokens: { refreshToken: hashedToken } } }).exec()
    throw createError(401, UNAUTHORIZED)
  }

  const accessToken = await getAccessToken(checkedUser.id, checkedUser.email)
  if (!accessToken) throw createError(500, SERVER_ERROR)
  const rotatedToken = await getRefreshToken(checkedUser.id, checkedUser.email, remainingLifetime)
  if (!rotatedToken) throw createError(500, SERVER_ERROR)

  // conditional on the old hash still being there, so two parallel rotations cannot both win
  const { matchedCount } = await User.updateOne(
    { '_id': checkedUser.id, 'refreshTokens.refreshToken': hashedToken },
    {
      $set: {
        'refreshTokens.$.refreshToken': hashRefreshToken(rotatedToken),
        'refreshTokens.$.previousRefreshToken': hashedToken,
        'refreshTokens.$.rotatedAt': new Date(),
      },
    },
  ).exec()
  // somebody rotated the very same token first - their cookie is the valid one now, leave it alone
  if (!matchedCount) return res.status(201).send({ accessToken })

  return res
    .cookie('refreshToken', rotatedToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: config.ENV === 'production' ? true : false,
      maxAge: remainingLifetime * 1000,
    })
    .status(201)
    .send({ accessToken })
}
// GET - /users/logoutUser
const logoutUser = async (req: Request, res: Response) => {
  if (!req.cookies?.refreshToken) return res.sendStatus(204)

  const hashedToken = hashRefreshToken(req.cookies.refreshToken)

  const checkedUser = await User.findOne({ 'refreshTokens.refreshToken': hashedToken }).exec()
  if (!checkedUser)
    return res
      .clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: config.ENV === 'production' ? true : false })
      .sendStatus(204)

  await User.updateOne({ _id: checkedUser.id }, { $pull: { refreshTokens: { refreshToken: hashedToken } } }).exec()

  return res
    .clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: config.ENV === 'production' ? true : false })
    .sendStatus(204)
}

export { registerSendCode, loginSendCode, confirmCode, refreshAccessToken, logoutUser }
