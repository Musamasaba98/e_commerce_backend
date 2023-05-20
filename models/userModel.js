import mongoose from 'mongoose' // Erase if already required
import bcrypt from 'bcrypt'

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        index: true,
    },
    lastname: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: Array,
        default: []
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
    ,
    address: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Address"
    }],
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)

})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//Export the model
const User = mongoose.model('User', userSchema);
export default User;