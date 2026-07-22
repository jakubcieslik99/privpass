import { jest } from '@jest/globals'

// Express and Mongoose test doubles.
// Everything is typed as `any` on purpose - a test should be easy to extend without fighting mock signatures.

const mockRequest = (data: any = {}): any => ({ params: {}, query: {}, body: {}, headers: {}, cookies: {}, ...data })

// Every method returns the response itself, so chains like res.status(200).send(...) work.
const mockResponse = (): any => {
  const res: any = { locals: {} }
  res.status = jest.fn(() => res)
  res.send = jest.fn(() => res)
  res.sendStatus = jest.fn(() => res)
  res.cookie = jest.fn(() => res)
  res.clearCookie = jest.fn(() => res)
  return res
}

const mockNext = (): any => jest.fn()

// Mongoose queries are chainable: find(...).sort(...).exec()
const mockQuery = (result: any): any => {
  const query: any = { sort: jest.fn(() => query), exec: jest.fn(async () => result) }
  return query
}

// jwt.verify hands over to an async callback - give it a tick before asserting.
const flushPromises = () => new Promise(resolve => setImmediate(resolve))

export { mockRequest, mockResponse, mockNext, mockQuery, flushPromises }
