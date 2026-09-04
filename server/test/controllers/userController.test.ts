import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals'
import crypto from 'crypto'
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
User.findById = jest.fn()
User.updateOne = jest.fn()
const sendEmail: any = jest.fn()

jest.unstable_mockModule('../../src/config/utilities.js', () => ({
  config: {
    ENV: 'test',
    JWT_ACCESS_TOKEN_SECRET: ACCESS_SECRET,
    JWT_REFRESH_TOKEN_SECRET: REFRESH_SECRET,
    NOREPLY_ADDRESS: 'noreply@privpass.test',
  },
  log: { error: jest.fn(), warn: jest.fn() },
}))
jest.unstable_mockModule('../../src/models/userModel.js', () => ({ default: User }))
jest.unstable_mockModule('../../src/functions/sendEmail.js', () => ({ default: sendEmail }))

const { registerSendCode, confirmCode, refreshAccessToken } = await import('../../src/controllers/userController.js')

// Computed here rather than imported, so the tests check the stored value against a hash of their own making.
const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex')

// Nobody registered by default - each test overrides only what it cares about.
beforeEach(() => {
  User.findOne.mockReturnValue(mockQuery(null))
  User.findById.mockReturnValue(mockQuery(null))
  User.updateOne.mockReturnValue(mockQuery({ matchedCount: 1, modifiedCount: 1 }))
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

  // A stolen database dump must not hand anybody a working session.
  it('stores only a hash of the refresh token', async () => {
    User.findOne.mockReturnValue(mockQuery(storedUser()))
    const res = mockResponse()

    await confirmCode(request(), res)

    const [, cookieValue] = res.cookie.mock.calls[0]
    const stored = User.updateOne.mock.calls[1][1].$push.refreshTokens.refreshToken

    expect(stored).not.toBe(cookieValue)
    expect(stored).toBe(sha256(cookieValue))
  })
})

describe('refreshAccessToken', () => {
  const signRefreshToken = (expiresIn = 900) => jwt.sign({ id: USER_ID, email: EMAIL }, REFRESH_SECRET, { expiresIn })

  // Somebody logged in a minute ago, with 14 minutes of the session left.
  const storedSession = (overrides: any = {}) => ({
    refreshToken: '',
    previousRefreshToken: null,
    rotatedAt: null,
    expirationDate: new Date(Date.now() + 840 * 1000),
    ...overrides,
  })

  const loggedIn = (sessions: any[]) =>
    User.findById.mockReturnValue(mockQuery({ id: USER_ID, email: EMAIL, refreshTokens: sessions }))

  const request = (refreshToken: string) => mockRequest({ cookies: { refreshToken } })

  it('answers 401 without ever touching the database when the cookie is not a valid token', async () => {
    await expect(refreshAccessToken(request('not-a-token'), mockResponse())).rejects.toMatchObject({ status: 401 })
    expect(User.findById).not.toHaveBeenCalled()
  })

  // Each refresh burns the presented token and hands out the next one.
  it('rotates the refresh token and replaces the cookie', async () => {
    const token = signRefreshToken()
    loggedIn([storedSession({ refreshToken: sha256(token) })])
    const res = mockResponse()

    await refreshAccessToken(request(token), res)

    const [, rotatedToken] = res.cookie.mock.calls[0]
    const [filter, update] = User.updateOne.mock.calls[0]

    expect(rotatedToken).not.toBe(token)
    expect(filter['refreshTokens.refreshToken']).toBe(sha256(token))
    expect(update.$set['refreshTokens.$.refreshToken']).toBe(sha256(rotatedToken))
    expect(update.$set['refreshTokens.$.previousRefreshToken']).toBe(sha256(token))
    expect(res.status).toHaveBeenCalledWith(201)
  })

  // Rotation may not turn a 15 minute session into an endless one.
  it('carries the original expiration over to the rotated token', async () => {
    const token = signRefreshToken()
    loggedIn([storedSession({ refreshToken: sha256(token), expirationDate: new Date(Date.now() + 120 * 1000) })])
    const res = mockResponse()

    await refreshAccessToken(request(token), res)

    const [, rotatedToken, cookieOptions] = res.cookie.mock.calls[0]
    const rotatedPayload: any = jwt.verify(rotatedToken, REFRESH_SECRET)

    expect(rotatedPayload.exp - rotatedPayload.iat).toBeLessThanOrEqual(120)
    expect(rotatedPayload.exp - rotatedPayload.iat).toBeGreaterThan(115)
    expect(cookieOptions.maxAge).toBeLessThanOrEqual(120 * 1000)
  })

  it('answers 401 once the session window has run out', async () => {
    const token = signRefreshToken()
    loggedIn([storedSession({ refreshToken: sha256(token), expirationDate: new Date(Date.now() - 1000) })])

    await expect(refreshAccessToken(request(token), mockResponse())).rejects.toMatchObject({ status: 401 })
    expect(User.updateOne.mock.calls[0][1]).toEqual({ $pull: { refreshTokens: { refreshToken: sha256(token) } } })
  })

  // Two tabs refreshing at once both send the same cookie - the slower one is not a thief.
  it('serves a token rotated out a moment ago without rotating again', async () => {
    const token = signRefreshToken()
    loggedIn([
      storedSession({ refreshToken: sha256('newer-token'), previousRefreshToken: sha256(token), rotatedAt: new Date() }),
    ])
    const res = mockResponse()

    await refreshAccessToken(request(token), res)

    expect(res.send.mock.calls[0][0]).toHaveProperty('accessToken')
    expect(res.cookie).not.toHaveBeenCalled()
    expect(User.updateOne).not.toHaveBeenCalled()
  })

  // Long after rotation the same token can only come from somebody who kept a copy of it.
  it('revokes every session when a rotated out token comes back too late', async () => {
    const token = signRefreshToken()
    loggedIn([
      storedSession({
        refreshToken: sha256('newer-token'),
        previousRefreshToken: sha256(token),
        rotatedAt: new Date(Date.now() - 60 * 1000),
      }),
    ])

    await expect(refreshAccessToken(request(token), mockResponse())).rejects.toMatchObject({ status: 401 })
    expect(User.updateOne.mock.calls[0][1]).toEqual({ $set: { refreshTokens: [] } })
  })

  it('revokes every session when a valid token is not stored at all', async () => {
    loggedIn([])

    await expect(refreshAccessToken(request(signRefreshToken()), mockResponse())).rejects.toMatchObject({ status: 401 })
    expect(User.updateOne.mock.calls[0][1]).toEqual({ $set: { refreshTokens: [] } })
  })
})
