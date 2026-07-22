import { jest, describe, it, expect } from '@jest/globals'

// AES-256 needs a 32 character key. In production it comes from Infisical, here it is fixed so the test is repeatable.
jest.unstable_mockModule('../../src/config/utilities.js', () => ({
  config: { CRYPTO_SECRET: '0123456789abcdef0123456789abcdef' },
  log: { error: jest.fn() },
}))

const { encryptPassword, decryptPassword } = await import('../../src/functions/encryptDecrypt.js')

const PASSWORD = 'S3cret!Passw0rd'

describe('encryptPassword / decryptPassword', () => {
  it('decrypts back to the original password', () => {
    const encrypted = encryptPassword(PASSWORD)

    expect(decryptPassword(encrypted)).toBe(PASSWORD)
  })

  it('does not leave the plain password in the result', () => {
    const encrypted = encryptPassword(PASSWORD)

    expect(encrypted.encryptedPassword).not.toContain(PASSWORD)
  })

  // A fresh IV per call is what stops two identical passwords from looking identical in the database.
  it('encrypts the same password differently every time', () => {
    const first = encryptPassword(PASSWORD)
    const second = encryptPassword(PASSWORD)

    expect(first.encryptedPassword).not.toBe(second.encryptedPassword)
    expect(first.iv).not.toBe(second.iv)
  })

  it('needs the matching IV to decrypt', () => {
    const encrypted = encryptPassword(PASSWORD)
    const wrongIv = encryptPassword(PASSWORD).iv

    expect(decryptPassword({ encryptedPassword: encrypted.encryptedPassword, iv: wrongIv })).not.toBe(PASSWORD)
  })
})
