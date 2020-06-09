import { Hbar, Client, Ed25519PrivateKey, AccountCreateTransaction } from '@hashgraph/sdk'

class HederaService {

    public readonly client: Client
    static instance: HederaService

    constructor () {
        if (!HederaService.instance) {
            this.client = Client.forTestnet()
            this.client.setOperator(
                process.env.HEDERA_ACCOUNT,
                Ed25519PrivateKey.fromString(process.env.HEDERA_KEY)
            )

            HederaService.instance = this
        }

        return HederaService.instance
    }


    public async createAccount (): Promise<any> {
        const privateKey = await Ed25519PrivateKey.generate()

        const transactionId = await new AccountCreateTransaction()
            .setKey(privateKey.publicKey)
            .setInitialBalance(new Hbar(20))
            .execute(this.client)

        const txReceipt = await transactionId.getReceipt(this.client)
        const accountID = txReceipt.getAccountId()

        return {
            name: accountID,
            privateKey: privateKey.toString()
        }
    }
}

export default new HederaService()
