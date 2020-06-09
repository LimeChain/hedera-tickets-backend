import { Request, Response } from 'express'

export const ping = async (req: Request, res: Response) => {
    res.json('OK')
}
