import * as express from 'express'

import { userRoutes } from './user-routes'
import { adminRoutes } from './admin-routes'
import { statusRoutes } from './status-routes'

export const registerApiRoutes = (app: any) => {
    const basePrefix = process.env.API_BASE_PREFIX || ''

    app.use(`${basePrefix}/api/user`, userRoutes(express))
    // app.use(`${basePrefix}/api/admin`, adminRoutes(express))
    app.use(`${basePrefix}/api/status`, statusRoutes(express))
}
