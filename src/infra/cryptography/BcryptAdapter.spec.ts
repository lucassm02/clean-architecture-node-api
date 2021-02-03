import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/Encrypter'
import BcryptAdapter from './BcryptAdapter'

interface SutTypes {
  sut: Encrypter
  salt: number
}
const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return { sut, salt }
}

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> =>
    new Promise(resolve => resolve('hash'))
}))

describe('Bcrypt Adapter', () => {
  test('should call Bcrypt with correct value', async () => {
    const { salt, sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toEqual('hash')
  })

  test('should throw if bcrypt trows', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) =>
        reject(new Error())
      )
    )

    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
