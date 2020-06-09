import BasicAuthorization from './../middleware/basic-authorization'

import UserController from '../controllers/user-controller'

export const userRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.post('/login', BasicAuthorization.authorize, UserController.login)
    router.post('/register', UserController.register)

    //router.get('/get', TokenAuthorization.User, UserController.getOne)

    return router
}
