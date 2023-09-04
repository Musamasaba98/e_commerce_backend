import express from 'express'
import { createCoupon, deletedCoupon, editCoupon, getAllCoupons, getCoupon } from '../controller/coupon.controller.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, isAdmin, getAllCoupons)
router.post('/', authMiddleware, isAdmin, createCoupon)
router.get('/:id', authMiddleware, isAdmin, getCoupon)
router.put('/:id', authMiddleware, isAdmin, editCoupon)
router.delete('/:id', authMiddleware, isAdmin, deletedCoupon)

export default router