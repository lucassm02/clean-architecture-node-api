import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'
import app from '../config/app'

describe('SingUp Route', () => {
  beforeAll(async () => await mongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await mongoHelper.disconnect())
  beforeAll(async () => await mongoHelper.getCollection('accounts').deleteMany({}))
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup').send({
        name: 'Lucas',
        email: 'lucastest@gmail.com',
        password: '12345678',
        password_confirmation: '12345678'
      }).expect(200)
  })
})
