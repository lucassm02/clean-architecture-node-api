import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'
import app from '../config/app'

describe('SingUp Route', () => {
  test('should return an account on success', async () => {
    beforeAll(async () => await mongoHelper.connect(process.env.MONGO_URL))
    afterAll(async () => await mongoHelper.disconnect())
    beforeAll(async () => await mongoHelper.getCollection('accounts').deleteMany({}))
    await request(app)
      .post('/api/signup').send({
        nome: 'lucas',
        email: 'lucas@gmail.com',
        password: '123',
        confirmation_password: '123'
      }).expect(200)
  })
})
