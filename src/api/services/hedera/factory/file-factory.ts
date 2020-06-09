import {
    Hbar,
    Client,
    FileId,
    Ed25519PublicKey,
    FileCreateTransaction,
    FileAppendTransaction
} from '@hashgraph/sdk'

const BYTE_CHUNKS_SIZE = 4000;

export class FileFactory {

    public readonly client: Client
    public readonly publicKey: Ed25519PublicKey

    constructor (client: Client, publicKey: Ed25519PublicKey) {
        this.client = client;
        this.publicKey = publicKey;
    }

    async createFile (bytes: string) {
        const chunks = Math.floor(bytes.length / BYTE_CHUNKS_SIZE);
        const firstChunk = copyBytes(0, BYTE_CHUNKS_SIZE, bytes);

        const transaction = new FileCreateTransaction();
        transaction.setMaxTransactionFee(new Hbar(10));
        transaction.addKey(this.publicKey);
        transaction.setContents(firstChunk);

        const receipt = await (await transaction.execute(this.client)).getReceipt(this.client);
        const fileId = receipt.getFileId();

        for (let i = 1; i < chunks; i++) {
            const chunkBytes = copyBytes(i * BYTE_CHUNKS_SIZE, BYTE_CHUNKS_SIZE, bytes);
            await this.appendToFile(fileId, chunkBytes);
        }

        const reminderChunk = bytes.length % BYTE_CHUNKS_SIZE;
        if (reminderChunk > 0) {
            const remindedBytes = copyBytes(chunks * BYTE_CHUNKS_SIZE, reminderChunk, bytes);
            await this.appendToFile(fileId, remindedBytes);
        }

        return fileId;
    }

    async appendToFile (fileId: FileId, bytes: string) {
        const transaction = new FileAppendTransaction();
        transaction.setFileId(fileId);
        transaction.setMaxTransactionFee(new Hbar(5));
        transaction.setContents(bytes);

        return transaction.execute(this.client);
    }
}

const copyBytes = function (start: number, length: number, bytes: string) {
    let bytesCopy = '';
    for (let i = 0; i < length; i++) {
        bytesCopy += bytes[start + i];
    }

    return bytesCopy;
}
