import DbAddAccount from '../../data/useCases/addAccount/DbAddAccount'
import BcryptAdapter from '../../infra/cryptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/Account'
import SignUpController from '../../presentation/controllers/SignUpController'
import { Controller } from '../../presentation/protocols/Controller'
import EmailValidatorAdapter from '../../util/EmailValidatorAdapter'
import LogControllerDecorator from '../decorators/Log'

export const makeSignupController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount)
  return new LogControllerDecorator(signupController)
}
