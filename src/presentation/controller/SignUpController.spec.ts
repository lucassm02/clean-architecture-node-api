import SignUpController from './SignUpController'
import { EmailValidator } from '../protocols/EmailValidator'
import { InvalidParamError, ServerError, MissingParamError } from '../errors'

interface SutType{
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    public isValid (email: string): boolean { return true }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('SignUpController', () => {
  test('Should return 400 if name is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'lucassm02@gmail.com',
        password: '12345678',
        password_confirmation: '12345678'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lucas',
        password: '12345678',
        password_confirmation: '12345678'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lucas',
        email: 'lucastest@gmail.com',
        password_confirmation: '12345678'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if password confirmation is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'Lucas',
        email: 'lucastest@gmail.com',
        password: '12345678'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password_confirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub: emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'Lucas',
        email: 'lucastestgmail.com',
        password: '12345678',
        password_confirmation: '12345678'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub: emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'Lucas',
        email: 'lucastestgmail.com',
        password: '12345678',
        password_confirmation: '12345678'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('lucastestgmail.com')
  })

  test('Should return 500 if EmailValidator throws ', () => {
    class EmailValidatorStub implements EmailValidator {
      public isValid (email: string): boolean { throw new Error() }
    }

    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'Lucas',
        email: 'lucastest@gmail.com',
        password: '12345678',
        password_confirmation: '12345678'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
