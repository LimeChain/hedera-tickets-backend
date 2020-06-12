import BasicAuthorization from './../middleware/basic-authorization'
import EventController from '../controllers/event'

export const eventRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.post('/create', BasicAuthorization.authorize, EventController.create)

    router.post('/group/history', EventController.history)
    router.post('/group/price', EventController.lastPrice)
    router.post('/group/price/update', EventController.updatePrice)

    return router
}
