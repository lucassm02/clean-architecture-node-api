import InvalidParamError from '../errors/InvalidParamError'
import MissingParamError from '../errors/MissingParamError'
import { badRequest, serverError } from '../helpers/httpHelper'
import { Controller } from '../protocols/Controller'
import { EmailValidator } from '../protocols/EmailValidator'
import { HttpRequest, HttpResponse } from '../protocols/Http'

export default class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  public handle (httpRequest: HttpRequest): HttpResponse {
    try {
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
    } catch (error) {
      return serverError()
    }
  }
}
