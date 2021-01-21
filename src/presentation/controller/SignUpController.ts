import { HttpRequest, HttpResponse } from '../protocols/Http'
import MissingParamError from '../errors/MissingParamError'
import { badRequest } from '../helpers/httpHelper'

export default class SignUpController {
  public handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
