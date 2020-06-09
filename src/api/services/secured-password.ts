import bcrypt from 'bcryptjs'

class PasswordService {

    static instance: PasswordService;

    constructor () {
        if (!PasswordService.instance) {
            PasswordService.instance = this
        }

        return PasswordService.instance
    }

    public hashPassword (plainPassword: string): string {
        const salt = bcrypt.genSaltSync()
        return bcrypt.hashSync(plainPassword, salt)
    }

    public compare (plainPassword: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }
}

export default new PasswordService()
