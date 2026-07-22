import { describe, it, expect } from '@jest/globals'
import { isValidId } from '../../src/middlewares/validityMiddleware.js'
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks.js'

const VALID_ID = '507f1f77bcf86cd799439011'

// Runs before isAuth, so a malformed id never reaches Mongoose.
describe('isValidId', () => {
  it('lets a valid ObjectId through', () => {
    const next = mockNext()

    isValidId('id', null)(mockRequest({ params: { id: VALID_ID } }), mockResponse(), next)

    expect(next).toHaveBeenCalledWith()
  })

  it('answers 422 for anything that is not an ObjectId', () => {
    const next = mockNext()

    isValidId('id', null)(mockRequest({ params: { id: 'not-an-id' } }), mockResponse(), next)

    expect(next.mock.calls[0][0].status).toBe(422)
  })

  it('checks the second parameter too when one is given', () => {
    const next = mockNext()
    const params = { userId: VALID_ID, passwordId: 'not-an-id' }

    isValidId('userId', 'passwordId')(mockRequest({ params }), mockResponse(), next)

    expect(next.mock.calls[0][0].status).toBe(422)
  })
})
