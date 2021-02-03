import { AccountModel } from '../../../domain/models/Account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/AddAccount'
import { AddAccountRepository } from '../../protocols/AddAccountRepository'
import { Encrypter } from '../../protocols/Encrypter'

export default class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) {}
  public async add (account: AddAccountModel): Promise<Omit<AccountModel, 'password'>> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const accountDataCreated = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return accountDataCreated
  }
}
