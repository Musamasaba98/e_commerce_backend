import express from 'express'
import { createBlog, deleteBlog, dislikeBlog, getAllBlogs, getBlog, likeBlog, updateBlog } from '../controller/blog.controller.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import { uploadBImage } from '../config/multer.config.js'
import { uploadImages } from '../controller/blog.controller.js'

const router = express.Router()

router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/upload/:id', authMiddleware, isAdmin, (req, res, next) => {
    // Add logging for debugging
    console.log('Request received');

    uploadBImage.single('images')(req, res, (error) => {
        if (error) {
            // Log the error for debugging
            console.error('File upload failed:', error);

            // Handle the file upload error, e.g., by sending an error response
            res.status(400).json({ error: 'File upload failed' });
        } else {
            // If there are no upload errors, proceed to the next middleware
            next();
        }
    });
}, uploadImages);
router.put('/likes', authMiddleware, likeBlog)
router.put('/dislikes', authMiddleware, dislikeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
export default router   