import * as dotenv from 'dotenv'
dotenv.config()

import { APIServer } from './app'

const server = new APIServer()
const app = server.getApp()

export { app }
