import { Request, Response } from 'express'
import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('should parse body as json', async () => {
    app
      .post('/test-body-parser',
        (request: Request, response: Response) =>
          response.json(request.body))

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'Luca' })
      .expect({ name: 'Luca' })
  })
})
