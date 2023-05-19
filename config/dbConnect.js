import mongoose from 'mongoose'

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => console.log('Connected Successfully'))
    } catch (error) {
        console.log(error.message)
    }
}

export default dbConnect;