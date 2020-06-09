import { Credentials, HederaAccount } from '../../types'

import { UserModel } from '../../database/models'

export class Login {
    public readonly credentials: Credentials

    public constructor (credentials: Credentials) {
        this.credentials = credentials
    }

    public async user (): Promise<HederaAccount> {
        const user = await UserModel.findOne({
            firstName: this.credentials.firstName,
            lastName: this.credentials.lastName
        })

        return new HederaAccount(
            user.hederaAccount.name,
            user.hederaAccount.key
        )
    }
}
