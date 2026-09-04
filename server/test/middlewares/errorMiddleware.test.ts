import { jest, describe, it, expect } from '@jest/globals'
import createError from 'http-errors'
import { createPasswordValidation } from '../../src/validations/passwordValidation.js'
import { SERVER_ERROR, UNPROCESSABLE_ENTITY } from '../../src/constants/ErrorMessages.js'
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks.js'

jest.unstable_mockModule('../../src/config/utilities.js', () => ({ config: { ENV: 'test' }, log: { error: jest.fn() } }))

const { errorHandler, isError } = await import('../../src/middlewares/errorMiddleware.js')

describe('errorHandler', () => {
  it('hands a rejected controller over to next()', async () => {
    const error = createError(404, 'Password does not exist.')
    const next = mockNext()

    await errorHandler(async () => {
      throw error
    })(mockRequest(), mockResponse(), next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('stays out of the way when the controller succeeds', async () => {
    const next = mockNext()

    await errorHandler(async () => undefined)(mockRequest(), mockResponse(), next)

    expect(next).not.toHaveBeenCalled()
  })
})

describe('isError', () => {
  it('answers with the status and message of the thrown error', () => {
    const res = mockResponse()

    isError(createError(404, 'Password does not exist.'), mockRequest(), res, mockNext())

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledWith({ message: 'Password does not exist.' })
  })

  // isError has no `return` between its branches, so it can call res.send twice.
  // Express only ever delivers the first response, so that is the one asserted here.
  it('hides internals behind a generic message when something unexpected blows up', () => {
    const res = mockResponse()
    const leaky: any = new Error('mongodb://root:Passw0rd@cluster/database')

    isError(leaky, mockRequest(), res, mockNext())

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith({ message: SERVER_ERROR })
  })

  it('turns a Joi validation error into 422', async () => {
    const res = mockResponse()
    const joiError: any = await createPasswordValidation.validateAsync({}).catch(error => error)

    isError(joiError, mockRequest(), res, mockNext())

    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith({ message: UNPROCESSABLE_ENTITY })
  })
})
