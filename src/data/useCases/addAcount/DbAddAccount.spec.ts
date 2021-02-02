import DbAddAccount from './DbAddAccount'

describe('DbAddAccount useCases', () => {
  test('should call Encrypter with correct password', async () => {
    class EncrypterStub {
      public async encrypt (value: string): Promise<string> {
        return new Promise(resolve => resolve('hash'))
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = { name: 'Lucas', email: 'lucas@gmail.com', password: '12345678' }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('12345678')
  })
})
