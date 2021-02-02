import DbAddAccount from './DbAddAccount'
import { Encrypter } from './protocols/Encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    public async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hash'))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return { sut, encrypterStub }
}

describe('DbAddAccount useCases', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = { name: 'Lucas', email: 'lucas@gmail.com', password: '12345678' }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('12345678')
  })
})
