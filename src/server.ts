import 'dotenv/config'
import env from './util/validateEnv'
import express from 'express'
import dbConnection from './config/connection'
import cors from 'cors'
import logger from 'morgan'
import AppError from './util/appError'
import dataManager from './routes/dataManager'
import auth from './routes/authentication'
import errorHandler from './middleware/errorHandler'
import { authMiddleware } from './middleware/authMiddleware'

const app = express()
app.use(cors({ origin: '*', methods: ["GET", "POST", "DELETE", "PATCH"] }))

// fixing "413 Request Entity Too Large" errors
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }))
app.use(logger('dev'))

// Health check
app.get('/', (req, res) => res.status(200).json({ message: 'OK' }))

// api endpoints
app.use('/api/admin/auth', auth)
app.use('/api/admin/dataManager', authMiddleware, dataManager)

// Error Handler
app.use(() => { throw new AppError({ statusCode: 404, message: 'Route not found!' }) })
app.use(errorHandler)

dbConnection().then(() => {
    const port = env.PORT || 8000
    app.listen(port, () => {
        console.log(`Server listen on http://localhost:${port}`);
    })
})