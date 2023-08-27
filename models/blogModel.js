import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,

    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    image: {
        type: String,
        default: "https://autism.assisted.pk/images/default_blog_img.png"
    },
    author: {
        type: String,
        default: "Admin"
    }
}, {
    toJSON: {
        virtuals: true
    }, toObject: {
        virtuals: true
    },
    timestamps: true

});

//Export the model
const Blog = mongoose.model('Blog', blogSchema);
export default Blog