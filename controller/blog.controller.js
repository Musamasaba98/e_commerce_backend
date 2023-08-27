import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongodbId.js";


export const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})
export const updateBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})
export const getBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const blog = await Blog.findById(id).populate("likes").populate("dislikes")
        await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1 },
        }, { new: true })
        res.json(blog)
    } catch (error) {
        throw new Error(error)
    }
})
export const getAllBlogs = asyncHandler(async (req, res) => {
    try {

        const blogs = await Blog.find()
        res.json(blogs)
    } catch (error) {
        throw new Error(error)
    }
})
export const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const blog = await Blog.findByIdAndDelete(id)
        res.status(200).json({ msg: "Blog has successfully been deleted" })
    } catch (error) {
        throw new Error(error)
    }
})
export const likeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        validateMongoDbId(blogId);

        // Find the blog which you want the user to like
        const blog = await Blog.findById(blogId);

        // Find the logged-in User
        const loginUserId = req.user?._id;

        // Find if the user has liked the blog
        const isLiked = blog?.isLiked;

        // Find if the user has already disliked the blog
        const alreadyDisliked = blog?.dislikes?.find(userId => userId?.toString() === loginUserId?.toString());

        if (alreadyDisliked) {
            // Remove the user from the list of dislikers
            await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisliked: false
            });
        }

        if (isLiked) {
            // Remove the user from the list of likers
            await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false
            });
        } else {
            // Add the user to the list of likers
            await Blog.findByIdAndUpdate(blogId, {
                $push: { likes: loginUserId },
                isLiked: true
            });
        }

        // Get the updated blog
        const updatedBlog = await Blog.findById(blogId);

        // Send a JSON response with the updated blog
        res.status(200).json(updatedBlog);
    } catch (error) {
        // Handle errors gracefully
        res.status(500).json({ error: 'An error occurred' });
    }
});
export const dislikeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;
        validateMongoDbId(blogId);

        // Find the blog which you want the user to like
        const blog = await Blog.findById(blogId);

        // Find the logged-in User
        const loginUserId = req.user?._id;

        // Find if the user has disliked the blog
        const isDisliked = blog?.isDisliked;

        // Find if the user has already liked the blog
        const alreadyLiked = blog?.likes?.find(userId => userId?.toString() === loginUserId?.toString());

        if (alreadyLiked) {
            // Remove the user from the list of dislikers
            await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false
            });
        }

        if (isDisliked) {
            // Remove the user from the list of likers
            await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisliked: false
            });
        } else {
            // Add the user to the list of likers
            await Blog.findByIdAndUpdate(blogId, {
                $push: { dislikes: loginUserId },
                isDisliked: true
            });
        }

        // Get the updated blog
        const updatedBlog = await Blog.findById(blogId);

        // Send a JSON response with the updated blog
        res.status(200).json(updatedBlog);
    } catch (error) {
        // Handle errors gracefully
        res.status(500).json({ error: 'An error occurred' });
    }
});
