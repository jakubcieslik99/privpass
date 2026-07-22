import { describe, it, expect } from '@jest/globals'
import { registerEmailValidation, confirmCodeValidation } from '../../src/validations/userValidation.js'

const EMAIL = 'user@privpass.test'

describe('registerEmailValidation', () => {
  it('accepts a well formed address', async () => {
    await expect(registerEmailValidation.validateAsync({ email: EMAIL })).resolves.toEqual({ email: EMAIL })
  })

  it.each([
    ['a missing email', {}],
    ['a malformed email', { email: 'not-an-email' }],
    ['an email over 60 characters', { email: `${'a'.repeat(55)}@privpass.test` }],
    ['an unexpected extra field', { email: EMAIL, role: 'admin' }],
  ])('rejects %s', async (_case, body) => {
    // `isJoi` is the flag errorMiddleware looks at to answer 422 instead of 500.
    await expect(registerEmailValidation.validateAsync(body)).rejects.toMatchObject({ isJoi: true })
  })
})

describe('confirmCodeValidation', () => {
  it('accepts a four character upper case code', async () => {
    await expect(confirmCodeValidation.validateAsync({ code: 'A1B2', email: EMAIL })).resolves.toBeDefined()
  })

  it.each([
    ['a lower case code', { code: 'a1b2', email: EMAIL }],
    ['a code of the wrong length', { code: 'A1B', email: EMAIL }],
    ['a missing email', { code: 'A1B2' }],
  ])('rejects %s', async (_case, body) => {
    await expect(confirmCodeValidation.validateAsync(body)).rejects.toMatchObject({ isJoi: true })
  })
})
