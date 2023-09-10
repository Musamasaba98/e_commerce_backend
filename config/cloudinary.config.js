import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: 'diweh6rab',
    api_key: '986477256541117',
    api_secret: '1jeFmXwWE6sTQE6YA9WKq5Fte0Y',
    secure: true,
    shorten: true,
    ssl_detected: true
})

export default cloudinary;