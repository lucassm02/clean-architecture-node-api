/* eslint-disable @typescript-eslint/camelcase */
import { AddAccount } from '../../domain/useCases/AddAccount'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, ok, serverError } from '../helpers/httpHelper'
import { Controller, HttpRequest, HttpResponse } from '../protocols'
import EmailValidator from '../protocols/EmailValidator'

export default class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, password_confirmation } = httpRequest.body

      if (password !== password_confirmation) {
        return badRequest(new InvalidParamError('password_confirmation'))
      }

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
