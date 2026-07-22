import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { mockRequest, mockResponse, mockQuery } from '../helpers/mocks.js'

const ACCESS_SECRET = 'test-access-secret'
const REFRESH_SECRET = 'test-refresh-secret'
const USER_ID = '507f1f77bcf86cd799439011'
const EMAIL = 'user@privpass.test'
const CODE = 'A1B2'

const save = jest.fn()
const User: any = jest.fn((document: any) => ({ ...document, save }))
User.findOne = jest.fn()
const sendEmail: any = jest.fn()

jest.unstable_mockModule('../../src/config/utilities.js', () => ({
  config: {
    ENV: 'test',
    JWT_ACCESS_TOKEN_SECRET: ACCESS_SECRET,
    JWT_REFRESH_TOKEN_SECRET: REFRESH_SECRET,
    NOREPLY_ADDRESS: 'noreply@privpass.test',
  },
  log: { error: jest.fn() },
}))
jest.unstable_mockModule('../../src/models/userModel.js', () => ({ default: User }))
jest.unstable_mockModule('../../src/functions/sendEmail.js', () => ({ default: sendEmail }))

const { registerSendCode, confirmCode } = await import('../../src/controllers/userController.js')

// Nobody registered by default - each test overrides only what it cares about.
beforeEach(() => {
  User.findOne.mockReturnValue(mockQuery(null))
})

describe('registerSendCode', () => {
  it('answers 409 when the email is already registered', async () => {
    User.findOne.mockReturnValue(mockQuery({ id: USER_ID, email: EMAIL }))

    const promise = registerSendCode(mockRequest({ body: { email: EMAIL } }), mockResponse())

    await expect(promise).rejects.toMatchObject({ status: 409 })
    expect(sendEmail).not.toHaveBeenCalled()
  })

  // The code is a credential: the database may only hold its hash, the plain one goes out by email.
  it('emails the plain code but stores only its hash', async () => {
    await registerSendCode(mockRequest({ body: { email: EMAIL } }), mockResponse())

    const storedHash = User.mock.calls[0][0].code
    const emailedCode = sendEmail.mock.calls[0][0].html.match(/<h2>(.+)<\/h2>/)[1]

    expect(emailedCode).toHaveLength(4)
    expect(storedHash).not.toBe(emailedCode)
    expect(await bcrypt.compare(emailedCode, storedHash)).toBe(true)
  })
})

describe('confirmCode', () => {
  let hashedCode: string

  beforeAll(async () => {
    hashedCode = await bcrypt.hash(CODE, 10)
  })

  // Somebody who asked for a code a moment ago.
  const storedUser = (overrides: any = {}) => ({
    id: USER_ID,
    email: EMAIL,
    code: hashedCode,
    updatedAt: Date.now(),
    refreshTokens: [],
    save,
    ...overrides,
  })

  const request = (code = CODE) => mockRequest({ body: { code, email: EMAIL } })

  it('answers 406 when the code does not match', async () => {
    User.findOne.mockReturnValue(mockQuery(storedUser()))

    await expect(confirmCode(request('Z9Z9'), mockResponse())).rejects.toMatchObject({ status: 406 })
  })

  // Codes live for 5 minutes, and an expired one is cleared so it cannot be retried.
  it('answers 406 and clears the code once it is older than 5 minutes', async () => {
    const user = storedUser({ updatedAt: Date.now() - 301 * 1000 })
    User.findOne.mockReturnValue(mockQuery(user))

    await expect(confirmCode(request(), mockResponse())).rejects.toMatchObject({ status: 406 })
    expect(user.code).toBeNull()
  })

  it('returns the access token in the body and the refresh token in an httpOnly cookie', async () => {
    User.findOne.mockReturnValue(mockQuery(storedUser()))
    const res = mockResponse()

    await confirmCode(request(), res)

    const body = res.send.mock.calls[0][0]
    const [cookieName, cookieValue, cookieOptions] = res.cookie.mock.calls[0]
    const accessPayload: any = jwt.verify(body.accessToken, ACCESS_SECRET)
    const refreshPayload: any = jwt.verify(cookieValue, REFRESH_SECRET)

    expect(accessPayload.id).toBe(USER_ID)
    expect(cookieName).toBe('refreshToken')
    expect(refreshPayload.id).toBe(USER_ID)
    expect(cookieOptions).toMatchObject({ httpOnly: true, maxAge: 900 * 1000 })
    expect(body).not.toHaveProperty('refreshToken')
  })
})
