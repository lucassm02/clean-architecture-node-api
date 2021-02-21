import { LogErrorRepository } from '../../data/protocols/LogErrorRepository'
import { serverError } from '../../presentation/helpers/httpHelper'
import { Controller } from '../../presentation/protocols/Controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/Http'
import LogControllerDecorator from './Log'

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = { body: { name: 'Lucas' }, statusCode: 200 }
      return new Promise(resolve => resolve(httpResponse))
    }
  }

  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = new ControllerStub()
  const logControllerDecorator = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut: logControllerDecorator, controllerStub, logErrorRepositoryStub }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        email: 'lucas@gmail.com',
        name: 'Lucas',
        password: '1234',
        password_confirmation: '1234'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenLastCalledWith(httpRequest)
  })

  test('Should return the same results of the controller ', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'lucas@gmail.com',
        name: 'Lucas',
        password: '1234',
        password_confirmation: '1234'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({ body: { name: 'Lucas' }, statusCode: 200 })
  })

  test('Should return the same results of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'lucas@gmail.com',
        name: 'Lucas',
        password: '1234',
        password_confirmation: '1234'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({ body: { name: 'Lucas' }, statusCode: 200 })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'fake stack'
    const error = serverError(fakeError)

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve, reject) => resolve(error)))

    const httpRequest = {
      body: {
        email: 'lucas@gmail.com',
        name: 'Lucas',
        password: '1234',
        password_confirmation: '1234'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenLastCalledWith('fake stack')
  })
})
