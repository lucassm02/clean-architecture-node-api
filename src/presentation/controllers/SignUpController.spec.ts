import SignUpController from './SignUpController'
import { EmailValidator } from '../protocols'
import { InvalidParamError, ServerError, MissingParamError } from '../errors'
import { AddAccount, AddAccountModel } from '../../domain/useCases/AddAccount'
import { AccountModel } from '../../domain/models/Account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid (email: string): boolean { return true }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): any => {
  class AddAccountStub {
    public add (account: AddAccountModel): Omit<AccountModel, 'password'> { return { id: 'unique_id', name: 'Lucas', email: 'lucastestgmail.com' } }
  }

  return new AddAccountStub()
}

interface SutType{
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
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
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

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

  test('Should return 400 if password confirmation fails', () => {
    const { sut, emailValidatorStub: emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'Lucas',
        email: 'lucastest@gmail.com',
        password: '12345678',
        password_confirmation: '1234567'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('password_confirmation'))
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'Lucas',
        email: 'lucastestgmail.com',
        password: '12345678',
        password_confirmation: '12345678'
      }
    }

    sut.handle(httpRequest)
    expect(addSpy).toBeCalledWith({
      name: 'Lucas',
      email: 'lucastestgmail.com',
      password: '12345678'
    })
  })
})
