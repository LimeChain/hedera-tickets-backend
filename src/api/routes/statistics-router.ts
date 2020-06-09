import StatisticController from '../controllers/statistic'

export const statisticRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.post('/groups', StatisticController.allGroups)
    router.post('/commission', StatisticController.orgCommission)
    router.post('/expiration', StatisticController.offeringExpiration)

    return router
}
