import EmailValidator from '../presentation/protocols/EmailValidator'

export default class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
