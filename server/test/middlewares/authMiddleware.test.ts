import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import jwt from 'jsonwebtoken'
import { mockRequest, mockResponse, mockNext, mockQuery, flushPromises } from '../helpers/mocks.js'

const ACCESS_SECRET = 'test-access-secret'
const USER = { id: '507f1f77bcf86cd799439011', email: 'user@privpass.test' }

const User: any = { findById: jest.fn() }

jest.unstable_mockModule('../../src/config/utilities.js', () => ({
  config: { JWT_ACCESS_TOKEN_SECRET: ACCESS_SECRET },
  log: { error: jest.fn() },
}))
jest.unstable_mockModule('../../src/models/userModel.js', () => ({ default: User }))

const { isAuth } = await import('../../src/middlewares/authMiddleware.js')

const authHeader = (secret = ACCESS_SECRET, expiresIn: any = '60s') => ({
  authorization: `Bearer ${jwt.sign(USER, secret, { expiresIn })}`,
})

describe('isAuth', () => {
  beforeEach(() => {
    User.findById.mockReturnValue(mockQuery(USER))
  })

  it('answers 401 when there is no Authorization header', async () => {
    const next = mockNext()

    isAuth(mockRequest(), mockResponse(), next)
    await flushPromises()

    expect(next.mock.calls[0][0].status).toBe(401)
    expect(User.findById).not.toHaveBeenCalled()
  })

  it.each([
    ['signed with a different secret', authHeader('attacker-secret')],
    ['already expired', authHeader(ACCESS_SECRET, '-1s')],
  ])('answers 403 for a token %s', async (_case, headers) => {
    const next = mockNext()

    isAuth(mockRequest({ headers }), mockResponse(), next)
    await flushPromises()

    expect(next.mock.calls[0][0].status).toBe(403)
  })

  // A token stays valid for its full 60 seconds, so a deleted account can still turn up with a signed one.
  it('answers 404 when the token is valid but the user is gone', async () => {
    User.findById.mockReturnValue(mockQuery(null))
    const next = mockNext()

    isAuth(mockRequest({ headers: authHeader() }), mockResponse(), next)
    await flushPromises()

    expect(next.mock.calls[0][0].status).toBe(404)
  })

  it('puts the user on res.locals and continues', async () => {
    const res = mockResponse()
    const next = mockNext()

    isAuth(mockRequest({ headers: authHeader() }), res, next)
    await flushPromises()

    expect(User.findById).toHaveBeenCalledWith(USER.id)
    expect(res.locals.authenticatedUser).toBe(USER)
    expect(next).toHaveBeenCalledWith()
  })
})
