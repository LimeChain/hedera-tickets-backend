import { FileFactory } from './file-factory'
import {
    Hbar,
    Client,
    Ed25519PublicKey,
    ContractFunctionParams,
    ContractCreateTransaction
} from '@hashgraph/sdk'

export class ContractFactory {

    public readonly client: Client
    public readonly fileFactory: FileFactory

    constructor (client: Client, publicKey: Ed25519PublicKey) {
        this.client = client;
        this.fileFactory = new FileFactory(client, publicKey);
    }

    async deploy (bytecode: string, args: ContractFunctionParams) {
        const fileId = await this.fileFactory.createFile(bytecode);

        const transaction = new ContractCreateTransaction();
        transaction.setMaxTransactionFee(new Hbar(200));
        transaction.setGas(1000000);
        transaction.setConstructorParams(args);
        transaction.setBytecodeFileId(fileId);

        const result = await (await transaction.execute(this.client)).getRecord(this.client);
        return result.receipt.getContractId();
    }
}
