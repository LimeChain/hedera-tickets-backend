import * as express from 'express'

import { userRoutes } from './user-routes'
import { eventRoutes } from './event-router'
import { statusRoutes } from './status-routes'
import { statisticRoutes } from './statistics-router'

export const registerApiRoutes = (app: any) => {
    const basePrefix = process.env.API_BASE_PREFIX || ''

    app.use(`${basePrefix}/api/user`, userRoutes(express))
    app.use(`${basePrefix}/api/event`, eventRoutes(express))
    app.use(`${basePrefix}/api/statistic`, statisticRoutes(express))

    app.use(`${basePrefix}/api/status`, statusRoutes(express))

}
