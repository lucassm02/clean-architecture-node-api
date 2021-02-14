import DbAddAccount from '../../data/useCases/addAccount/DbAddAccount'
import BcryptAdapter from '../../infra/cryptography/BcryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/Account'
import SignUpController from '../../presentation/controllers/SignUpController'
import EmailValidatorAdapter from '../../util/EmailValidatorAdapter'

export const makeSignupController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
