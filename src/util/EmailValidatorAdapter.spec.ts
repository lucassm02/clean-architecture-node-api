import EmailValidatorAdapter from './EmailValidatorAdapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('lucas')

    expect(isValid).toBe(false)
  })
})
