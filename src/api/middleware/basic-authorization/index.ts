import { Request, Response, NextFunction } from 'express'

import { UserModel } from './../../database/models'
import { PasswordService } from './../../services'

class BasicAuthorization {

    static instance: BasicAuthorization;

    public constructor () {
        if (!BasicAuthorization.instance) {
            BasicAuthorization.instance = this
        }

        return BasicAuthorization.instance
    }

    public async authorize (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await UserModel.findOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName
            })

            if (PasswordService.compare(req.body.password, user.password)) {
                req.user = user
                return next()
            }

            throw new Error()
        } catch (error) {
            console.log(error)
            res.status(401).send({ message: 'Not authorized' })
        }
    }
}

export default new BasicAuthorization()
