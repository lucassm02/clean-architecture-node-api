import { HttpRequest, HttpResponse } from '../protocols/Http'
import { Controller } from '../protocols/Controller'
import { EmailValidator } from '../protocols/EmailValidator'
import MissingParamError from '../errors/MissingParamError'
import { badRequest } from '../helpers/httpHelper'
import InvalidParamError from '../errors/InvalidParamError'

export default class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  public handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'password_confirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body?.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
