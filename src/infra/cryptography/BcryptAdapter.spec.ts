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

describe('Bcrypt Adapter', () => {
  test('should call Bcrypt with correct value', async () => {
    const { salt, sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
