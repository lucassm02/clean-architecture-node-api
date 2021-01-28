import validator from 'validator'
import EmailValidatorAdapter from './EmailValidatorAdapter'

jest.mock('validator', () => ({
  isEmail: (): boolean => true
}))

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('lucas')

    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('lucassantos@gmail.com')

    expect(isValid).toBe(true)
  })

  test('Should call validator correct email', () => {
    const sut = new EmailValidatorAdapter()
    sut.isValid('lucassantos@gmail.com')
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    expect(isEmailSpy).toHaveBeenCalledWith('lucassantos@gmail.com')
  })
})
