import multer from 'multer'
import cloudinary from './cloudinary.config.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary'


const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "e_commerce/productImages",
        public_id: (req, file) => file.originalname,
    }
})
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an Image! Please upload only images,', 400), false);
    }
};

export const uploadImage = multer({ storage: imageStorage, fileFilter: multerFilter, limits: { fieldSize: 2000000 } })
