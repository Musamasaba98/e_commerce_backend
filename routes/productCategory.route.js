import express from 'express'
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../controller/productCategory.controller.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
const router = express.Router()


router.get('/', authMiddleware, isAdmin, getAllCategory)
router.post('/', authMiddleware, isAdmin, createCategory)
router.put('/:id', authMiddleware, isAdmin, updateCategory)
router.get('/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/:id', authMiddleware, isAdmin, deleteCategory)
export default router