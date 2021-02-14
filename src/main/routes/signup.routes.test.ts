import request from 'supertest'
import app from '../config/app'

describe('SingUp Route', () => {
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup').send({
        nome: 'lucas',
        email: 'lucas@gmail.com',
        password: '123',
        confirmation_password: '123'
      }).expect(200)
  })
})
