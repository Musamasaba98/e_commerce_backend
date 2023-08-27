import express from 'express'
import { createUser, getAllUsers, loginUser, getUser, deleteUser, updateUser, blockUser, unBlockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } from '../controller/user.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post("/register", createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/password', authMiddleware, updatePassword)
router.put('/reset-password/:token', resetPassword)
router.post("/login", loginUser)
router.get("/logout", logout)
router.get('/allUsers', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser)

export default router;