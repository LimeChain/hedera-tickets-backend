export class HederaAccount {
    public readonly name: string;
    public readonly encKey: string;

    constructor (name: string, encKey: string) {
        this.name = name;
        this.encKey = encKey;
    }
}