import express from 'express'
import { createUser, getAllUsers, loginUser, getUser, deleteUser, updateUser, blockUser, unBlockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getUserWishlist, saveAddress, userCart, getUserCart, applyCoupon, createOrder, getOrders, getUserOrders, updateOrderStatus } from '../controller/user.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post("/register", createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/password', authMiddleware, updatePassword)
router.put('/reset-password/:token', resetPassword)
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)
router.post("/login", loginUser)
router.post("/login", loginUser)
router.post("/add-to-cart", authMiddleware, userCart)
router.get("/logout", logout)
router.get('/allUsers', getAllUsers)
router.get('/wishlist', authMiddleware, getUserWishlist)
router.get('/cart', authMiddleware, getUserCart)
router.get('/orders', authMiddleware, isAdmin, getOrders)
router.get('/user-orders', authMiddleware, isAdmin, getUserOrders)
router.get('/cart/applycoupon', authMiddleware, applyCoupon)
router.post('/cart/cash-order', authMiddleware, createOrder)
router.get('/refresh', handleRefreshToken)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateUser)
router.put('/save-address', authMiddleware, saveAddress)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser)

export default router;