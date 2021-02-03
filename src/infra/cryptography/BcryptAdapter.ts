import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/Encrypter'

export default class BcryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}
  public async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
