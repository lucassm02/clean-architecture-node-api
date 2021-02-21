import request from 'supertest'
import { mongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'
import app from '../config/app'

describe('SingUp Route', () => {
  beforeAll(async () => await mongoHelper.connect(process.env.MONGO_URL))
  beforeAll(async () => (await mongoHelper.getCollection('accounts')).deleteMany({}))
  afterAll(async () => await mongoHelper.disconnect())
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
