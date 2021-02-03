import { mongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './Account'
describe('Account Mongo repository', () => {
  beforeAll(async () => await mongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await mongoHelper.disconnect())
  beforeAll(async () => await mongoHelper.getCollection('accounts').deleteMany({}))

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  test('should return an account on success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'Lucas',
      email: 'lucas@gmail.com',
      password: 'hash'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('Lucas')
    expect(account.email).toBe('lucas@gmail.com')
  })
})
