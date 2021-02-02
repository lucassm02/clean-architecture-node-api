import { AccountModel } from '../../../domain/models/Account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/AddAccount'
import { Encrypter } from './protocols/Encrypter'

export default class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}
  public async add (account: AddAccountModel): Promise<Omit<AccountModel, 'password'>> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
