import * as StatusController from '../controllers/status-controller'

export const statusRoutes = (expressApp: any) => {
    const statusRouter = expressApp.Router()

    statusRouter.get('/', StatusController.ping)

    return statusRouter
}
