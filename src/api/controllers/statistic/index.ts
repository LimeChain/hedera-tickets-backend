import { Request, Response } from 'express'

import { EventModel } from '../../database/models'
import { HederaService } from './../../services'

class StatisticController {
    public allGroups = async (req: Request, res: Response): Promise<void> => {
        const eventData = JSON.parse(JSON.stringify(req.body))
        const eventContractID = await this.retrieveEventContract(eventData.name)

        const groups = await HederaService.groups(eventContractID)
        res.send(groups)
    }

    public orgCommission = async (req: Request, res: Response): Promise<void> => {
        const eventData = JSON.parse(JSON.stringify(req.body))
        const eventContractID = await this.retrieveEventContract(eventData.name)

        const commission = await HederaService.orgCommission(eventContractID)
        res.send(commission)
    }

    public offeringExpiration = async (req: Request, res: Response): Promise<void> => {
        const eventData = JSON.parse(JSON.stringify(req.body))
        const eventContractID = await this.retrieveEventContract(eventData.name)

        const expiration = await HederaService.offeringExpiration(eventContractID)
        res.send(expiration)
    }

    private retrieveEventContract = async (eventName: string): Promise<string> => {
        const eventDetails = await EventModel.findOne({
            name: eventName
        })

        return eventDetails.contractID
    }
}

export default new StatisticController()
