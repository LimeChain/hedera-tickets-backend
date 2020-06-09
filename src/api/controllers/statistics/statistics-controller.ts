import { Request, Response } from 'express'

class UserController {
    public login = async (req: Request, res: Response): Promise<void> => {
        const credentials = JSON.parse(JSON.stringify(req.body))
        const login = new Login(credentials)
        const hederaAccount = await login.user()

        res.send(hederaAccount)
    }

    public register = async (req: Request, res: Response): Promise<void> => {
        const userData = JSON.parse(JSON.stringify(req.body))
        const register = new Register(userData)
        const hederaAccount = await register.user()

        res.send(hederaAccount)
    }

    public getOne = async (req: Request, res: Response): Promise<void> => {
        // const token = new Token(req.headers.authorization)
        // const userData = await adapter.getUserData(token)

        // res.send(userData)
        res.send('OK')
    }
}

export default new UserController()
