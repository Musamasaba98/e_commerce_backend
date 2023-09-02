import express from 'express'
import { createCategory } from '../controller/category.controller.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
const router = express.Router()


router.post('/', authMiddleware, isAdmin, createCategory)
export default router