import express from 'express'
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from '../controller/blogCategory.controller.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
const router = express.Router()


router.get('/', authMiddleware, isAdmin, getAllCategory)
router.post('/', authMiddleware, isAdmin, createCategory)
router.put('/:id', authMiddleware, isAdmin, updateCategory)
router.get('/:id', authMiddleware, isAdmin, getCategory)
router.delete('/:id', authMiddleware, isAdmin, deleteCategory)
export default router