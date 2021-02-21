import { Controller } from '../../presentation/protocols/Controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/Http'
import LogControllerDecorator from './Log'

interface SutTypes{
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = { body: { name: 'Lucas' }, statusCode: 200 }
      return new Promise(resolve => resolve(httpResponse))
    }
  }

  const controllerStub = new ControllerStub()
  const logControllerDecorator = new LogControllerDecorator(controllerStub)
  return { sut: logControllerDecorator, controllerStub }
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
})
