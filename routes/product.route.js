import express from 'express'
import { addToWishlist, createProuduct, deleteProuduct, getAllProducts, getProduct, rating, updateProuduct, uploadImages } from '../controller/product.controller.js'
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import { uploadImage } from '../config/multer.config.js'


const router = express.Router()

router.post('/', authMiddleware, isAdmin, createProuduct)
router.put('/upload/:id', authMiddleware, isAdmin, (req, res, next) => {
    // Add logging for debugging
    console.log('Request received');

    uploadImage.array('images', 10)(req, res, (error) => {
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
router.put('/wishlist', authMiddleware, addToWishlist)
router.put('/rating', authMiddleware, rating)
router.get('/:id', getProduct)
router.put('/:id', authMiddleware, isAdmin, updateProuduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProuduct)
router.get('/', getAllProducts)

export default router;