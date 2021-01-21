import { HttpRequest, HttpResponse } from '../protocols/Http'
import { Controller } from '../protocols/Controller'
import MissingParamError from '../errors/MissingParamError'
import { badRequest } from '../helpers/httpHelper'

export default class SignUpController implements Controller {
  public handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'password_confirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
