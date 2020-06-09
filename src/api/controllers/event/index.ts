import { AES, enc } from 'crypto-js'
import { Request, Response } from 'express'

import { EventData, HederaAccount } from '../../types'
import { EventModel } from '../../database/models'
import { HederaService } from '../../services'

class EventController {
    public create = async (req: Request, res: Response): Promise<void> => {
        const eventData: EventData = JSON.parse(JSON.stringify(req.body))
        if (await this.eventExists(eventData.name)) {
            res.status(400).send('Such event already exists')
            return void 0
        }

        const userKey = AES.decrypt(
            req.user.hederaAccount.key,
            req.body.password).toString(enc.Utf8)

        eventData.contractID = (await HederaService.deploy(
            new HederaAccount(req.user.hederaAccount.name, userKey),
            eventData.commission,
            eventData.expiration
        )).toString()

        eventData.owner = req.user._id;
        await EventModel.create(eventData)

        res.send('OK')
    }

    private async eventExists (eventName: string): Promise<boolean> {
        const event = await EventModel.findOne({ name: eventName })
        return event._id
    }
}

export default new EventController()
