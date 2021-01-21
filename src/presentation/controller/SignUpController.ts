import { HttpRequest, HttpResponse } from '../protocols/Http'
import MissingParamError from '../errors/MissingParamError'

export default class SignUpController {
  public handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}