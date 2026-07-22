import { jest, describe, it, expect } from '@jest/globals'
import jwt from 'jsonwebtoken'

const ACCESS_SECRET = 'test-access-secret'
const REFRESH_SECRET = 'test-refresh-secret'

jest.unstable_mockModule('../../src/config/utilities.js', () => ({
  config: { JWT_ACCESS_TOKEN_SECRET: ACCESS_SECRET, JWT_REFRESH_TOKEN_SECRET: REFRESH_SECRET },
  log: { error: jest.fn() },
}))

const { getAccessToken, getRefreshToken } = await import('../../src/functions/generateTokens.js')

const USER_ID = '507f1f77bcf86cd799439011'
const EMAIL = 'user@privpass.test'

const payloadOf = (token: any, secret: string): any => jwt.verify(token, secret)

describe('generateTokens', () => {
  it('puts the user id and email inside the access token', async () => {
    const payload = payloadOf(await getAccessToken(USER_ID, EMAIL), ACCESS_SECRET)

    expect(payload.id).toBe(USER_ID)
    expect(payload.email).toBe(EMAIL)
  })

  it('gives the access token 60 seconds and the refresh token 15 minutes', async () => {
    const access = payloadOf(await getAccessToken(USER_ID, EMAIL), ACCESS_SECRET)
    const refresh = payloadOf(await getRefreshToken(USER_ID, EMAIL), REFRESH_SECRET)

    expect(access.exp - access.iat).toBe(60)
    expect(refresh.exp - refresh.iat).toBe(900)
  })

  // Two separate secrets: leaking one must not let anybody mint the other kind of token.
  it('will not verify an access token with the refresh secret', async () => {
    const token = await getAccessToken(USER_ID, EMAIL)

    expect(() => payloadOf(token, REFRESH_SECRET)).toThrow()
  })
})
