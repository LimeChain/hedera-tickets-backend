import { AES, enc } from 'crypto-js'
import BigNumber from 'bignumber.js'
import { Request, Response } from 'express'

import { EventData, HederaAccount } from '../../types'
import { EventModel, EventHistoryModel } from '../../database/models'

import { HederaService } from './../../services'

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

    public history = async (req: Request, res: Response): Promise<void> => {
        const { group } = JSON.parse(JSON.stringify(req.body))

        const result = await EventHistoryModel.findOne({ "group.number": group })

        if (result) {
            return void res.send({
                history: result.group.history,
                time: result.group.historyTime
            })
        }

        res.send({ history: [], time: [] })
    }

    public updatePrice = async (req: Request, res: Response): Promise<void> => {
        const { group } = JSON.parse(JSON.stringify(req.body))

        const result = await EventHistoryModel.findOne({ "group.number": group })
        const lastPrice = await HederaService.lastPrice(group, process.env.CONTRACT)

        if (result) {
            result.group.history.push(new BigNumber(lastPrice).div(100000000))
            result.group.historyTime.push(new Date().toLocaleString())
            await result.save()
        } else {
            await EventHistoryModel.create({
                group: {
                    number: group,
                    history: [new BigNumber(lastPrice).div(100000000)],
                    historyTime: [new Date().toLocaleString()]
                }
            });
        }

        res.send('OK')
    }

    public lastPrice = async (req: Request, res: Response): Promise<void> => {
        const { group } = JSON.parse(JSON.stringify(req.body))

        const lastPrice = await HederaService.lastPrice(group, process.env.CONTRACT)
        res.send(lastPrice)
    }

    public orgCommission = async (req: Request, res: Response): Promise<void> => {
        const commission = await HederaService.orgCommission(process.env.CONTRACT)
        res.send(commission)
    }

    public offeringExpiration = async (req: Request, res: Response): Promise<void> => {
        const expiration = await HederaService.offeringExpiration(process.env.CONTRACT)
        res.send(expiration)
    }
}

export default new EventController()
