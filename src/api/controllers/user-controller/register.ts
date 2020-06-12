import { AES } from 'crypto-js'

import { HederaAccount, UserData } from '../../types'

import { UserModel } from '../../database/models'
import { HederaService, PasswordService } from '../../services'

export class Register {
    public readonly userData: UserData

    public constructor (userData: UserData) {
        this.userData = userData
    }

    public async user (): Promise<HederaAccount> {
        const chainAccount = await HederaService.createAccount()
        this.userData.hederaAccount = {
            name: chainAccount.name.toString(),
            key: AES.encrypt(
                chainAccount.privateKey,
                this.userData.password
            ).toString()
        }
        this.userData.password = PasswordService.hashPassword(this.userData.password);

        await UserModel.create(this.userData);

        return new HederaAccount(
            this.userData.hederaAccount.name,
            this.userData.hederaAccount.key
        );
    }
}
