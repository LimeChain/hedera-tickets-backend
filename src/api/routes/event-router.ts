import BasicAuthorization from './../middleware/basic-authorization'
import EventController from '../controllers/event'

export const eventRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.post('/create', BasicAuthorization.authorize, EventController.create)

    return router
}
