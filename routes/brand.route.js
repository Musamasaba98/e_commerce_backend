import express from 'express'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import { createBrand, deleteBrand, getAllBrand, getBrand, updateBrand } from '../controller/brand.controller.js'
const router = express.Router()


router.get('/', authMiddleware, isAdmin, getAllBrand)
router.post('/', authMiddleware, isAdmin, createBrand)
router.put('/:id', authMiddleware, isAdmin, updateBrand)
router.get('/:id', authMiddleware, isAdmin, getBrand)
router.delete('/:id', authMiddleware, isAdmin, deleteBrand)
export default router