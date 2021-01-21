import { HttpRequest, HttpResponse } from '../protocols/Http'
import MissingParamError from '../errors/MissingParamError'
import { badRequest } from '../helpers/httpHelper'

export default class SignUpController {
  public handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
