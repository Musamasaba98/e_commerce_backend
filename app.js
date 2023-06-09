import express from 'express'
import authRouter from './routes/auth.route.js'
import productRouter from './routes/product.route.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/user", authRouter)
app.use("/api/product", productRouter)

app.use(notFound)
app.use(errorHandler)
export default app;    