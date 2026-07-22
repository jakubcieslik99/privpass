import { describe, it, expect } from '@jest/globals'
import { createPasswordValidation } from '../../src/validations/passwordValidation.js'

const ENTRY = { name: 'Bank account', password: 'S3cret!Passw0rd' }

describe('createPasswordValidation', () => {
  it('accepts a name and a password', async () => {
    await expect(createPasswordValidation.validateAsync(ENTRY)).resolves.toEqual(ENTRY)
  })

  it('accepts the longest values still allowed', async () => {
    const longest = { name: 'a'.repeat(40), password: 'a'.repeat(60) }

    await expect(createPasswordValidation.validateAsync(longest)).resolves.toBeDefined()
  })

  it.each([
    ['a missing name', { password: ENTRY.password }],
    ['a missing password', { name: ENTRY.name }],
    ['a name over 40 characters', { ...ENTRY, name: 'a'.repeat(41) }],
    ['a password over 60 characters', { ...ENTRY, password: 'a'.repeat(61) }],
    // The owner comes from the access token, so the body must never be able to set it.
    ['an attempt to set the owner', { ...ENTRY, addedBy: '507f1f77bcf86cd799439011' }],
  ])('rejects %s', async (_case, body) => {
    await expect(createPasswordValidation.validateAsync(body)).rejects.toMatchObject({ isJoi: true })
  })
})
