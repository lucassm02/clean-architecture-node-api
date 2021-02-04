import { Request, Response } from 'express'
import request from 'supertest'
import app from '../config/app'

describe('Cors Middleware', () => {
  test('should enable cors', async () => {
    app
      .get('/test-cors',
        (request: Request, response: Response) =>
          response.send())

    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
