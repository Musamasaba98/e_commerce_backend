import express from 'express'
import { createUser, getAllUsers, loginUser, getUser, deleteUser, updateUser } from '../controller/user.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.get('/allUsers', getAllUsers)
router.get('/:id', authMiddleware, isAdmin, getUser)
router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateUser)

export default router;