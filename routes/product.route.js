import express from 'express'
import { createProuduct, getAllProducts, getProduct, updateProuduct } from '../controller/product.controller.js'

const router = express.Router()

router.post('/', createProuduct)
router.get('/:id', getProduct)
router.put('/:id', updateProuduct)
router.get('/', getAllProducts)

export default router;