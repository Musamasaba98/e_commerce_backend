import mongoose from 'mongoose'

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected succesfully")
    } catch (error) {
        console.log("Database Error")
    }
}

export default dbConnect;