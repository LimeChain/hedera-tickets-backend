import { bytecode } from './factory/tickets-store.json'

import { BigNumber } from 'bignumber.js'
import {
    Hbar, Client, ContractId,
    Ed25519PrivateKey,
    AccountCreateTransaction,
    ContractCallQuery,
    ContractFunctionParams
} from '@hashgraph/sdk'

import { HederaAccount } from './../../types'
import { ContractFactory } from './factory'

class HederaService {

    public readonly client: Client
    static instance: HederaService

    constructor () {
        if (!HederaService.instance) {
            this.client = Client.forTestnet()
            this.setAdminOperator()

            HederaService.instance = this
        }

        return HederaService.instance
    }

    private setAdminOperator (): void {
        this.client.setOperator(
            process.env.HEDERA_ACCOUNT,
            Ed25519PrivateKey.fromString(process.env.HEDERA_KEY)
        )
    }

    /* General functionality */
    public async deploy (eventMaker: HederaAccount, commission: number, durationPeriod: number): Promise<ContractId> {
        const constructorParams = new ContractFunctionParams()
            .addUint256(new BigNumber(commission))
            .addUint256(new BigNumber(durationPeriod));

        const makerPrivKey = Ed25519PrivateKey.fromString(eventMaker.encKey)
        this.client.setOperator(eventMaker.name, makerPrivKey)

        const contractFactory = new ContractFactory(this.client, makerPrivKey.publicKey);
        const contractId = await contractFactory.deploy(bytecode, constructorParams);

        this.setAdminOperator()
        return contractId;
    }

    public async createAccount (): Promise<any> {
        const privateKey = await Ed25519PrivateKey.generate()

        const transactionId = await new AccountCreateTransaction()
            .setKey(privateKey.publicKey)
            .setInitialBalance(new Hbar(1000))
            .execute(this.client)

        const txReceipt = await transactionId.getReceipt(this.client)
        const accountID = txReceipt.getAccountId()

        return {
            name: accountID,
            privateKey: privateKey.toString()
        }
    }

    public async lastPrice (group: number, contractID: string) {
        const fnParams = new ContractFunctionParams().addUint256(new BigNumber(group));

        const result = await this.read(contractID, 'groups', fnParams);
        return result.getUint256(3).toString()
    }

    public async orgCommission (contractID: string): Promise<string> {
        const result = await this.read(contractID, 'eventCommission', null);
        return result.getUint256(0).toString()
    }

    public async offeringExpiration (contractID: string): Promise<string> {
        const result = await this.read(contractID, 'offeringExpiration', null);
        return result.getUint256(0).toString();
    }

    private async read (contractID: string, functionName: string, args: ContractFunctionParams) {
        return new ContractCallQuery()
            .setContractId(contractID)
            .setGas(200000)
            .setFunction(functionName, args)
            .execute(this.client)
    }
}

export default new HederaService()
