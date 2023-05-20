import express from 'express'
import authRouter from './routes/auth.route.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api/user", authRouter)

app.use(notFound)
app.use(errorHandler)
export default app;    