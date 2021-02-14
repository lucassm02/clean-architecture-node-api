import { AccountModel } from '../../../domain/models/Account'
import { AddAccountModel } from '../../../domain/useCases/AddAccount'
import DbAddAccount from './DbAddAccount'
import { Encrypter } from '../../protocols/Encrypter'
import { AddAccountRepository } from '../../protocols/AddAccountRepository'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    public async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hash'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    public async add (account: AddAccountModel): Promise<Omit<AccountModel, 'password'>> {
      const fakeAccount = { id: 'valid_id', name: 'Lucas', email: 'lucas@gmail.com' }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DbAddAccount useCases', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = { name: 'Lucas', email: 'lucas@gmail.com', password: '12345678' }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('12345678')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = { name: 'Lucas', email: 'lucas@gmail.com', password: '12345678' }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = { name: 'Lucas', email: 'lucas@gmail.com', password: '12345678' }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({ name: 'Lucas', email: 'lucas@gmail.com', password: 'hash' })
  })

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = { name: 'Lucas', email: 'lucas@gmail.com', password: '12345678' }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'add')
    const accountData = { name: 'Lucas', email: 'lucas@gmail.com', password: '12345678' }
    const account = await sut.add(accountData)
    expect(account).toEqual({ id: 'valid_id', name: 'Lucas', email: 'lucas@gmail.com' })
  })
})
