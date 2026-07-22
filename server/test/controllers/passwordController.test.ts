import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { mockRequest, mockResponse, mockQuery } from '../helpers/mocks.js'

const USER_ID = '507f1f77bcf86cd799439011'
const PASSWORD_ID = '507f191e810c19729de860ea'
const PASSWORD = 'S3cret!Passw0rd'

jest.unstable_mockModule('../../src/config/utilities.js', () => ({
  config: { CRYPTO_SECRET: '0123456789abcdef0123456789abcdef' },
  log: { error: jest.fn() },
}))

// Fake Mongoose model: `new Password(...)` gives back a document with a save() spy, plus the statics the controller uses.
const save = jest.fn()
const Password: any = jest.fn((document: any) => ({ ...document, save }))
Password.find = jest.fn()
Password.findOne = jest.fn()

jest.unstable_mockModule('../../src/models/passwordModel.js', () => ({ default: Password }))

// Encryption is deliberately NOT mocked - these tests should see the real ciphertext.
const { getUserPasswords, getUserPassword, createUserPassword, deleteUserPassword } =
  await import('../../src/controllers/passwordController.js')
const { encryptPassword, decryptPassword } = await import('../../src/functions/encryptDecrypt.js')

// A response that has already been through isAuth.
const authenticated = () => {
  const res = mockResponse()
  res.locals.authenticatedUser = { id: USER_ID }
  return res
}

// Empty database by default - each test overrides only what it cares about.
beforeEach(() => {
  Password.find.mockReturnValue(mockQuery([]))
  Password.findOne.mockReturnValue(mockQuery(null))
})

describe('getUserPasswords', () => {
  it('only ever asks for passwords owned by the logged in user', async () => {
    await getUserPasswords(mockRequest(), authenticated())

    expect(Password.find).toHaveBeenCalledWith({ addedBy: USER_ID }, 'name')
  })

  it('adds a case insensitive filter when searching', async () => {
    await getUserPasswords(mockRequest({ query: { searchKeyword: 'bank' } }), authenticated())

    expect(Password.find).toHaveBeenCalledWith({ addedBy: USER_ID, name: { $regex: 'bank', $options: 'i' } }, 'name')
  })

  it('sorts by name unless asked otherwise', async () => {
    const query = mockQuery([])
    Password.find.mockReturnValue(query)

    await getUserPasswords(mockRequest(), authenticated())

    expect(query.sort).toHaveBeenCalledWith({ name: 1 })
  })

  // The list must stay useless to anyone who intercepts it - no ciphertext, no IVs.
  it('returns only ids and names', async () => {
    Password.find.mockReturnValue(mockQuery([{ id: PASSWORD_ID, name: 'Bank account', ...encryptPassword(PASSWORD) }]))
    const res = authenticated()

    await getUserPasswords(mockRequest(), res)

    expect(res.send).toHaveBeenCalledWith({ passwords: [{ _id: PASSWORD_ID, name: 'Bank account' }] })
  })
})

describe('getUserPassword', () => {
  it('answers 404 when the password belongs to somebody else', async () => {
    const request = mockRequest({ params: { id: PASSWORD_ID } })

    await expect(getUserPassword(request, authenticated())).rejects.toMatchObject({ status: 404 })
    expect(Password.findOne).toHaveBeenCalledWith({ _id: PASSWORD_ID, addedBy: USER_ID })
  })

  it('decrypts the password for its owner', async () => {
    Password.findOne.mockReturnValue(mockQuery({ id: PASSWORD_ID, ...encryptPassword(PASSWORD) }))
    const res = authenticated()

    await getUserPassword(mockRequest({ params: { id: PASSWORD_ID } }), res)

    expect(res.send).toHaveBeenCalledWith({ _id: PASSWORD_ID, password: PASSWORD })
  })
})

describe('createUserPassword', () => {
  it('answers 409 when the user already has a password with that name', async () => {
    Password.find.mockReturnValue(mockQuery([{ name: 'Bank account' }]))
    const request = mockRequest({ body: { name: 'Bank account', password: PASSWORD } })

    await expect(createUserPassword(request, authenticated())).rejects.toMatchObject({ status: 409 })
    expect(Password).not.toHaveBeenCalled()
  })

  // The one thing this whole application exists for.
  it('stores the password encrypted and owned by the logged in user', async () => {
    const request = mockRequest({ body: { name: 'Bank account', password: PASSWORD } })
    const res = authenticated()

    await createUserPassword(request, res)

    const document = Password.mock.calls[0][0]
    expect(document.addedBy).toBe(USER_ID)
    expect(document.encryptedPassword).not.toContain(PASSWORD)
    expect(decryptPassword(document)).toBe(PASSWORD)
    expect(save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
  })
})

describe('deleteUserPassword', () => {
  it('deletes the password and confirms', async () => {
    const deleteOne = jest.fn()
    Password.findOne.mockReturnValue(mockQuery({ _id: PASSWORD_ID, deleteOne }))
    const res = authenticated()

    await deleteUserPassword(mockRequest({ params: { id: PASSWORD_ID } }), res)

    expect(deleteOne).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
