import { AddAccountRepository } from '../../../../data/protocols/AddAccountRepository'
import { AccountModel } from '../../../../domain/models/Account'
import { AddAccountModel } from '../../../../domain/useCases/AddAccount'
import { mongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
  public async add (account: AddAccountModel): Promise<Omit<AccountModel, 'password'>> {
    const accountCollection = mongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)
    const { _id: id, ...accountWithoutId } = result.ops[0]
    return { id, ...accountWithoutId }
  }
}
