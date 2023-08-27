import express from 'express'
import { createProuduct, deleteProuduct, getAllProducts, getProduct, updateProuduct } from '../controller/product.controller.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'


const router = express.Router()

router.post('/', authMiddleware, isAdmin, createProuduct)
router.get('/:id', getProduct)
router.put('/:id', authMiddleware, isAdmin, updateProuduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProuduct)
router.get('/', getAllProducts)

export default router;