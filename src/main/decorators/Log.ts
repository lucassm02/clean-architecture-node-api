import { Controller } from '../../presentation/protocols/Controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/Http'

export default class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) console.log('Deu ruim irmão')
    return httpResponse
  }
}
